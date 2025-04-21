import React, { useEffect, useState } from 'react';
import { getUserID } from "../components/firebase/firebaseUserID";
import Sidebar from "../components/Sidebar";
import { collection, getDocs, doc, updateDoc, arrayUnion, deleteField } from 'firebase/firestore';
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
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const [newNotebookName, setNewNotebookName] = useState('');



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
  
  const handleRemoveFromNotebook = async (notebookName, summaryId) => {
    try {
      const notebook = notebooks.find(nb => nb.name === notebookName);
      if (!notebook) return;
  
      const summaryKey = Object.keys(notebook).find(
        (key) => notebook[key] === summaryId && key.startsWith('summary')
      );
  
      if (!summaryKey) return;
  
      const currentTotal = notebook.total || 1;
      const newTotal = currentTotal - 1;
  
      const notebookRef = doc(db, `users/${userId}/notebooks/${notebookName}`);
  
      // Update Firestore: delete the summary field and update total
      await updateDoc(notebookRef, {
        [summaryKey]: deleteField(),
        total: newTotal,
      });
  
      // Update local state
      const updatedNotebooks = notebooks.map(nb => {
        if (nb.name === notebookName) {
          const newSummaries = nb.summaries.filter(id => id !== summaryId);
          const updated = { ...nb };
          delete updated[summaryKey];
          return {
            ...updated,
            summaries: newSummaries,
            total: newTotal,
          };
        }
        return nb;
      });
  
      setNotebooks(updatedNotebooks);
      console.log(`Removed summary ${summaryId} from notebook ${notebookName}`);
    } catch (error) {
      console.error("Error removing summary from notebook:", error);
    }
  };
  
  
  
  
  const fetchUserData = async (uid) => {
    try {
      // Fetch user's summaries
      const summariesRef = collection(db, `users/${uid}/summaries`);
      const summariesSnapshot = await getDocs(summariesRef);
      const summariesData = summariesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // sort summaries by createdAt timestamp
      const sortedSummaries = summariesData.sort((a, b) => {
        
        const getTimestamp = (doc) => {
          if (!doc.createdAt) return 0;
          
          if (doc.createdAt.seconds) {
            return doc.createdAt.seconds * 1000;
          }
          
          return doc.createdAt;
        };
        
        return getTimestamp(b) - getTimestamp(a);
      });
      
      // Fetch user's notebooks
      const notebooksRef = collection(db, `users/${uid}/notebooks`);
      const notebooksSnapshot = await getDocs(notebooksRef);
      const notebooksData = notebooksSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: doc.id,
          ...data,
          summaries: Object.values(data).filter(val => typeof val === 'string')
        };
      });
      
      setSummaries(sortedSummaries);
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

  const handleAddToNotebook = async () => {
    if (!selectedSummary || !selectedNotebook) return;

    // Prevent duplicates
    const targetNotebook = notebooks.find(nb => nb.name === selectedNotebook);
    if (targetNotebook?.summaries?.includes(selectedSummary)) {
      console.log("Summary already exists in this notebook.");
      setShowTagModal(false);
      setSelectedNotebook('');
      return;
    }

  
    try {
      const targetNotebook = notebooks.find(nb => nb.name === selectedNotebook);
      const currentTotal = targetNotebook?.total || 0;
      console.log(targetNotebook?.total);
      const nextSummaryNum = currentTotal + 1;
  
      const notebookRef = doc(db, `users/${userId}/notebooks/${selectedNotebook}`);
  
      // Update Firestore: add new summary and increment total
      await updateDoc(notebookRef, {
        [`summary${nextSummaryNum}`]: selectedSummary,
        total: nextSummaryNum,
      });
  
      // Update local state
      const updatedNotebooks = notebooks.map(notebook => {
        if (notebook.name === selectedNotebook) {
          return {
            ...notebook,
            summaries: [...notebook.summaries, selectedSummary],
            [`summary${nextSummaryNum}`]: selectedSummary,
            total: nextSummaryNum,
          };
        }
        return notebook;
      });
  
      setNotebooks(updatedNotebooks);
      setShowTagModal(false);
      setSelectedNotebook('');
      console.log(`Added summary ${selectedSummary} as summary${nextSummaryNum} to notebook ${selectedNotebook}`);
    } catch (error) {
      console.error("Error adding summary to notebook:", error);
    }
  };
  
  const handleCreateNotebook = async () => {
    const trimmedName = newNotebookName.trim();
    if (!trimmedName || notebooks.find(nb => nb.name === trimmedName)) return;
  
    try {
      const notebookRef = doc(db, `users/${userId}/notebooks/${trimmedName}`);
      await updateDoc(notebookRef, {
        total: 0
      });
  
      const newNotebook = {
        id: trimmedName,
        name: trimmedName,
        total: 0,
        summaries: []
      };
  
      setNotebooks([...notebooks, newNotebook]);
      setSelectedNotebook(trimmedName);
      setNewNotebookName('');
      console.log(`Notebook "${trimmedName}" created.`);
    } catch (error) {
      console.error("Error creating notebook:", error);
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

  const handleAddTagClick = (e, summaryId) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
  
    setSelectedSummary(summaryId);
    setShowTagModal(true);
    setModalPosition({
      top: rect.bottom + window.scrollY + 10, // position just below button
      left: rect.left + rect.width / 2 + window.scrollX, // center horizontally
    });
  };
  

  // format timestamp
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    
    let date;
    
    if (timestamp.seconds) {
      date = new Date(timestamp.seconds * 1000);
    } else {
      
      date = new Date(timestamp);
    }
    
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[date.getMonth()];
    const day = date.getDate();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    return `${month} ${day} ${hours}:${minutes}`;
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
      <div className="flex-1 pr-8 py-6 overflow-auto"
      style={{
        marginLeft: '300px',
      }}>
        <div style={{
          marginTop: '20px',
        }}>
        <h1 className="text-3xl font-bold mb-8">Summaries</h1>
        </div>
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
          <div>
            <div className="bg-white border border-gray-300 rounded shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-col items-center justify-center">
                  <h2 className="text-xl text-gray-700 font-medium mb-6">New</h2>
                  <button className="flex items-center text-sm font-medium text-gray-600 border border-gray-300 rounded px-3 py-1.5 hover:bg-gray-50">
                    <svg className="w-4 h-4 mr-1 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    Upload
                  </button>
                </div>
              </div>
            <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    columnGap: '15px',
                    rowGap: '15px',
                  }}>
              
              
              {/* Summary Cards */}
              {summaries.map((summary) => (
                <div
                  key={summary.id}
                  className="border-gray-300 rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  style={{
                    maxHeight: '300px',
                    boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
                    textAlign: 'center',
                    padding: '10px 5px 0px 5px',
                    width: '300px',
                    textWrap: 'pretty',
                    overflowX: 'hidden',
                    borderRadius: '20px',
                  }}
                  onClick={() => setActiveSummary(summary)}
                >
                  <div className="px-6 py-4">
                    <div className="relative h-[120px] text-gray-700 text-base"
                    style={{
                      position: 'relative',
                      height: '200px',
                      overflow: 'hidden',
                    }}>
                      <p className="whitespace-pre-wrap break-words"
                      style={{

                      }}>
                        {summary['summary-content']}
                      </p>
                      <div className="absolute bottom-0 left-0 w-full h-6 bg-gradient-to-t from-white to-transparent pointer-events-none"
                      style={{
                        position: 'absolute',
                        bottom: '0',
                        left: '0',
                        height: '40px',
                        width: '100%',
                        background: 'linear-gradient(to top, white, transparent)',
                        PointerEvent: 'none',
                      }} />
                    </div>
                  </div>
                  <div style={{ 
                    position: 'relative', 
                    marginTop: '10px', 
                    display: 'flex', 
                    marginBottom: '5px',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingRight: '10px'
                  }}>
                    {/* Plus Button Circle - Adjusted position */}
                    <div style={{
                      position: 'relative',
                      width: '28px',
                      height: '28px',
                      backgroundColor: 'lightgray',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                    }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddTagClick(e, summary.id);
                      }}
                      title="Add to notebook"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        stroke="gray"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        style={{ width: '14px', height: '14px' }}
                      >
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                    </div>

                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      justifyContent: 'center',
                      gap: '6px',
                      flex: '1'
                    }}>
                      {notebooks
                        .filter((nb) => nb.summaries.includes(summary.id))
                        .map((nb) => (
                          <span
                            key={nb.name}
                            style={{
                              position: 'relative',
                              backgroundColor: 'lightgray',
                              borderRadius: '100px',
                              padding: '4px 10px',
                              fontSize: '0.85rem',
                              cursor: 'pointer',
                              transition: 'background-color 0.2s',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = 'rgba(211, 211, 211, 0.5)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'lightgray';
                            }}
                          >
                            #{nb.name}
                            {/* Remove Button */}
                            <span
                              style={{
                                position: 'absolute',
                                top: '-4px',
                                right: '-4px',
                                width: '18px',
                                height: '18px',
                                borderRadius: '50%',
                                backgroundColor: '#e53e3e',
                                color: 'white',
                                fontWeight: 'bold',
                                fontSize: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                opacity: 0,
                                transition: 'opacity 0.2s',
                              }}
                              className="remove-button"
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent opening the summary
                                handleRemoveFromNotebook(nb.name, summary.id);
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                              onMouseLeave={(e) => (e.currentTarget.style.opacity = '0')}
                            >
                              ×
                            </span>
                          </span>

                        ))}
                      
                    </div>

                    <div style={{
                      fontSize: '0.8rem',
                      color: '#666',
                      whiteSpace: 'nowrap',
                      marginLeft: '10px'
                    }}>
                      {formatTimestamp(summary.createdAt)}
                    </div>
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
          </div>
        )}
      </div>
      
      {showTagModal && selectedSummary && (
        <div
          style={{
            position: 'absolute',
            top: `${modalPosition.top}px`,
            left: `${modalPosition.left}px`,
            transform: 'translateX(-50%)',
            zIndex: 9999,
            backgroundColor: 'white',
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '12px',
            width: '250px',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
          }}
          onClick={(e) => e.stopPropagation()} // prevent modal click from expanding summary
        >
          <h3 style={{ fontSize: '1rem', marginBottom: '8px' }}>Add to Notebook</h3>
          <select
            value={selectedNotebook}
            onChange={(e) => setSelectedNotebook(e.target.value)}
            style={{
              width: '100%',
              padding: '6px 10px',
              border: '1px solid #ccc',
              borderRadius: '6px',
              marginBottom: '12px',
            }}
          >
            <option value="">Choose a notebook</option>
            {notebooks.map((notebook) => (
              <option key={notebook.id} value={notebook.name}>
                {notebook.name}
              </option>
            ))}
          </select>
          <h4 style={{ textAlign: 'center', marginBottom: '8px' }}>or</h4>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
              <input
                type="text"
                placeholder="New notebook name"
                value={newNotebookName}
                onChange={(e) => setNewNotebookName(e.target.value)}
                style={{
                  flex: 1,
                  padding: '6px 10px',
                  border: '1px solid #ccc',
                  borderRadius: '6px',
                }}
              />
              <button
                onClick={handleCreateNotebook}
                disabled={!newNotebookName.trim() || notebooks.some(nb => nb.name === newNotebookName.trim())}
                style={{
                  padding: '6px 10px',
                  backgroundColor: '#10b981', // green
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: newNotebookName.trim() ? 'pointer' : 'default',
                  opacity: newNotebookName.trim() ? 1 : 0.5,
                }}
                title="Create new notebook"
              >
                +
              </button>
            </div>


          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <button
              onClick={() => setShowTagModal(false)}
              style={{
                padding: '6px 12px',
                backgroundColor: '#f3f4f6',
                border: 'none',
                borderRadius: '4px',
                color: '#333',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleAddToNotebook}
              disabled={!selectedNotebook}
              style={{
                padding: '6px 12px',
                backgroundColor: '#2563eb',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                opacity: !selectedNotebook ? 0.5 : 1,
                cursor: !selectedNotebook ? 'default' : 'pointer',
              }}
            >
              Add
            </button>
          </div>
        </div>
      )}
      <style>
        {`
          span:hover .remove-button {
            opacity: 1 !important;
          }
        `}
      </style>

    </div>
  );
};

export default Summaries;

