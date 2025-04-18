import React, { useEffect, useState } from 'react';
import { getUserID } from "../components/firebase/firebaseUserID";
import Sidebar from "../components/Sidebar";
import { collection, getDocs, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../components/firebase/firebaseConfig';

const Summaries = () => {
  const [summaries, setSummaries] = useState([]);
  const [notebooks, setNotebooks] = useState([]);
  const [userId, setUserId] = useState(null);
  const [expandedSummary, setExpandedSummary] = useState(null);
  const [showTagModal, setShowTagModal] = useState(false);
  const [selectedSummary, setSelectedSummary] = useState(null);
  const [selectedNotebook, setSelectedNotebook] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [activeSummary, setActiveSummary] = useState(null);


  useEffect(() => {
    // Set up cookie creation when component mounts
    const unsubscribe = getUserID((uid) => {
      if (uid) {
        // Create cookie with the user's UID
        setCookie('extension_user_uid', uid, 30); // Cookie expires in 30 days
        console.log('User ID cookie created:', uid);
        setUserId(uid);
        fetchUserData(uid);
      } else {
        console.log('No user authenticated');
        setIsLoading(false);
      }
    });

    // Clean up the auth listener when component unmounts
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []); // Empty dependency array ensures this runs once on component mount
  
  
  const fetchUserData = async (uid) => {
    try {
      // Fetch user's summaries
      const summariesRef = collection(db, `users/${uid}/summaries`);
      const summariesSnapshot = await getDocs(summariesRef);
      const summariesData = summariesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Fetch user's notebooks
      const notebooksRef = collection(db, `users/${uid}/notebooks`);
      const notebooksSnapshot = await getDocs(notebooksRef);
      const notebooksData = notebooksSnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.id, // Using document ID as name based on your structure
        summaries: Object.values(doc.data())
      }));
      
      setSummaries(summariesData);
      setNotebooks(notebooksData);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setIsLoading(false);
    }
  };

  // Helper function to set cookie
  const setCookie = (name, value, days) => {
    let expires = '';
    
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = '; expires=' + date.toUTCString();
    }
    
    // Set cookie with SameSite=None and Secure flags to make it accessible from extension
    document.cookie = `${name}=${encodeURIComponent(value)}${expires}; path=/; SameSite=None; Secure`;
    console.log("Cookie online"); 
  };

  const handleSummaryClick = (summaryId) => {
    if (expandedSummary === summaryId) {
      setExpandedSummary(null);
    } else {
      setExpandedSummary(summaryId);
    }
  };

  const handleAddTagClick = (e, summaryId) => {
    e.stopPropagation(); // Prevent triggering the summary expansion
    setSelectedSummary(summaryId);
    setShowTagModal(true);
  };

  const handleAddToNotebook = async () => {
    if (!selectedSummary || !selectedNotebook) return;
    
    try {
      // Find the next available summary number
      const targetNotebook = notebooks.find(nb => nb.name === selectedNotebook);
      const summaryCount = Object.keys(targetNotebook || {}).filter(key => key.startsWith('summary')).length;
      const nextSummaryNum = summaryCount + 1;
      
      // Update the notebook document
      const notebookRef = doc(db, `users/${userId}/notebooks/${selectedNotebook}`);
      await updateDoc(notebookRef, {
        [`summary${nextSummaryNum}`]: selectedSummary
      });
      
      // Update local state
      const updatedNotebooks = notebooks.map(notebook => {
        if (notebook.name === selectedNotebook) {
          return {
            ...notebook,
            summaries: [...notebook.summaries, selectedSummary]
          };
        }
        return notebook;
      });
      
      setNotebooks(updatedNotebooks);
      setShowTagModal(false);
      setSelectedNotebook('');
      
      console.log(`Added summary ${selectedSummary} to notebook ${selectedNotebook}`);
    } catch (error) {
      console.error("Error adding summary to notebook:", error);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown date';
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const truncateText = (text, maxLength = 120) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-blue-100">
        <div className="text-lg text-gray-600">Loading summaries...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      {/* Added left padding of 275px */}
      <div className="flex-1 ml-[275px] md:ml-[300px] pr-8 py-6 overflow-auto">
        <div className="mb-6">
          <div className="relative max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Search..."
              className="w-full py-2 pl-10 pr-4 text-gray-700 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
        
        {summaries.length === 0 ? (
          <div className="text-center text-gray-500 mt-16">
            <p className="text-xl">You don't have any summaries yet</p>
            <p className="mt-2">Use the extension to create your first summary</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-6">
            {/* New/Upload Card */}
            <div className="bg-white border border-gray-300 rounded shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col items-center justify-center p-8">
                <div className="w-16 h-16 mb-4 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                    <polyline points="13 2 13 9 20 9"></polyline>
                  </svg>
                </div>
                <h2 className="text-xl text-gray-700 font-medium mb-6">New</h2>
                <button className="flex items-center text-sm font-medium text-gray-600 border border-gray-300 rounded px-3 py-1.5 hover:bg-gray-50">
                  <svg className="w-4 h-4 mr-1 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  Upload
                </button>
              </div>
            </div>
            
            {/* Summary Cards */}
            {summaries.map((summary) => (
              <div
                key={summary.id}
                className="max-w-sm rounded overflow-hidden shadow-lg bg-white cursor-pointer transition-shadow hover:shadow-md col-span-1"
                onClick={() => setActiveSummary(summary)}
              >
                <div className="px-6 py-4">
                  <div className="font-bold text-xl mb-2 truncate">
                    {summary['paper-link']
                      ? summary['paper-link'].split('/').pop()
                      : 'Untitled Summary'}
                  </div>
                  <p className="text-gray-700 text-base line-clamp-3">
                    {truncateText(summary['summary-content'], 150)}
                  </p>
                </div>
                <div className="px-6 pt-4 pb-2 flex flex-wrap items-center gap-2">
                  {notebooks
                    .filter((nb) => nb.summaries.includes(summary.id))
                    .map((nb) => (
                      <div
                        key={nb.name}
                        className="inline-flex items-center bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700"
                      >
                        #{nb.name}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddTagClick(e, summary.id);
                          }}
                          className="ml-2 w-4 h-4 flex items-center justify-center text-gray-600 hover:text-gray-800"
                          title="Add to notebook"
                        >
                          <svg
                            className="w-3 h-3"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                          >
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            ))}

            {activeSummary && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
                <div className="relative w-full max-w-4xl bg-white rounded-lg shadow-lg p-8 max-h-[90vh] overflow-y-auto">
                  {/* Close Button */}
                  <button
                    onClick={() => setActiveSummary(null)}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl font-bold"
                  >
                    &times;
                  </button>

                  {/* Summary Content */}
                  <h2 className="text-2xl font-semibold mb-4">
                    {activeSummary['paper-link']
                      ? activeSummary['paper-link'].split('/').pop()
                      : 'Untitled Summary'}
                  </h2>
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {activeSummary['summary-content']}
                  </p>
                </div>
              </div>
            )}

          </div>
        )}
      </div>
      
      {/* Tag Modal */}
      {showTagModal && (
        <div className="fixed inset-0 bg-blue bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Add to Notebook</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Notebook
              </label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md"
                value={selectedNotebook}
                onChange={(e) => setSelectedNotebook(e.target.value)}
              >
                <option value="">Choose a notebook</option>
                {notebooks.map(notebook => (
                  <option key={notebook.id} value={notebook.name}>
                    {notebook.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
                onClick={() => setShowTagModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                onClick={handleAddToNotebook}
                disabled={!selectedNotebook}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Summaries;