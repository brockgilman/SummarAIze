import React, { useEffect, useState } from 'react';
import { getUserID } from "../components/firebase/firebaseUserID";
import Sidebar from "../components/Sidebar";
import { collection, getDocs, getDoc, doc, updateDoc, arrayUnion, deleteField, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../components/firebase/firebaseConfig';
import { 
  TextField, 
  InputAdornment, 
  Select, 
  MenuItem, 
  FormControl,
  Card,
  CardContent,
  CardActions,
  Button,
  IconButton,
  Collapse,
  styled,
  Chip,
  Typography
} from '@mui/material';
import { Search, Save, X, Plus, Trash2 } from 'lucide-react';
import AddToNotebook from './components/AddToNotebook';

// Styled components for the expandable card
const ExpandableCard = styled(Card)(({ theme, expanded }) => ({
  transition: 'all 0.3s ease-in-out',
  transform: expanded ? 'scale(1)' : 'scale(1)',
  zIndex: expanded ? 1000 : 0,
  position: expanded ? 'fixed' : 'relative',
  top: expanded ? '50%' : 'auto',
  left: expanded ? 'calc(50% + 150px)' : 'auto', // Center in the content area (300px sidebar / 2)
  transform: expanded ? 'translate(-50%, -50%)' : 'none',
  maxHeight: expanded ? 'none' : '300px',
  width: expanded ? 'calc(70% - 32px)' : '300px',
  height: expanded ? '70vh' : 'auto',
  borderRadius: '20px',
  boxShadow: expanded ? '0 8px 24px rgba(0,0,0,0.2)' : '0 4px 8px rgba(0,0,0,0.2)',
  display: 'flex',
  flexDirection: 'column',
  '&:hover': {
    boxShadow: expanded ? '0 8px 24px rgba(0,0,0,0.2)' : '0 6px 12px rgba(0,0,0,0.15)',
  },
}));

// Helper function for word and sentence count
const getTextStatistics = (text) => {
  if (!text) return { words: 0, sentences: 0 };
  const words = text.trim().split(/\s+/).filter(word => word.length > 0).length;
  const sentences = text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0).length;
  return { words, sentences };
};

const Summaries = () => {
  // State variables to store summaries, notebooks, user ID, and various modal states
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
  const [sortOption, setSortOption] = useState(''); // "date" or "notebook"
  const [searchQuery, setSearchQuery] = useState('');
  const [editableSummary, setEditableSummary] = useState(null);
  const [editedContent, setEditedContent] = useState('');

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
  
  // Function to remove a summary from a specific notebook
  const handleRemoveFromNotebook = async (notebookName, summaryId) => {
    try {
      const notebook = notebooks.find(nb => nb.name === notebookName);
      if (!notebook) return;
  
      // Find the key corresponding to the summary in the notebook
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
  
  // Function to fetch user data from Firestore
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
      const notebooksData = notebooksSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: doc.id,
          ...data,
          summaries: Object.values(data).filter(val => typeof val === 'string')
        };
      });
      
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

  // Function to handle click on a summary to toggle expanded view
  const handleSummaryClick = (summaryId) => {
    if (expandedSummary === summaryId) {
      setExpandedSummary(null);
    } else {
      setExpandedSummary(summaryId);
    }
  };

  // Function to add a summary to a selected notebook
  const handleAddToNotebook = async (selectedNotebook) => {
    if (!selectedSummary || !selectedNotebook) return;

    // Prevent duplicates by checking if the summary already exists in the selected notebook
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
      const nextSummaryNum = currentTotal + 1;
  
      const notebookRef = doc(db, `users/${userId}/notebooks/${selectedNotebook}`);
  
      // Update Firestore: add new summary and increment total
      await updateDoc(notebookRef, {
        [`summary${nextSummaryNum}`]: selectedSummary,
        total: nextSummaryNum,
      });
  
      // Update local state with the new notebook state
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
      
      // Refresh the data to ensure UI is up to date
      await fetchUserData(userId);
      if (selectedNotebook.toLowerCase() === "lebron") {
        playTacoTuesday();
      }      
      
      console.log(`Added summary ${selectedSummary} as summary${nextSummaryNum} to notebook ${selectedNotebook}`);
    } catch (error) {
      console.error("Error adding summary to notebook:", error);
    }
  };
  
  // Function to create a new notebook with a specified name
  const handleCreateNotebook = async () => {
    const trimmedName = newNotebookName.trim().toLowerCase();
    if (!trimmedName || trimmedName === 'trash' || notebooks.find(nb => nb.name.toLowerCase() === trimmedName)) return;
  
    try {
      const notebookRef = doc(db, `users/${userId}/notebooks/${trimmedName}`);
      await setDoc(notebookRef, {
        total: 0
      });
  
      const newNotebook = {
        id: trimmedName,
        name: trimmedName,
        total: 0,
        summaries: []
      };
  
      // Update local state with the new notebook
      const updatedNotebooks = [...notebooks, newNotebook];
      setNotebooks(updatedNotebooks);
      setSelectedNotebook(trimmedName);
      
      // Play Taco Tuesday audio
      playTacoTuesday();
      
      // Reset the input field
      setNewNotebookName('');
      setShowTagModal(false);
      
      console.log(`Notebook "${trimmedName}" created.`);
    } catch (error) {
      console.error("Error creating notebook:", error);
    }
  };
  
  // Helper function to play Taco Tuesday audio
  const playTacoTuesday = () => {
    const audio = new Audio('/TacoTuesday.mp3');
    audio.play();
    console.log('Taco Tuesday MP3 is playing!');
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
  
  // Add this function to handle saving the edited summary
  const handleSaveSummary = async (summaryId) => {
    try {
      const summaryRef = doc(db, `users/${userId}/summaries/${summaryId}`);
      await updateDoc(summaryRef, {
        'summary-content': editedContent,
        updatedAt: serverTimestamp()
      });

      // Update local state
      setSummaries(prevSummaries =>
        prevSummaries.map(summary =>
          summary.id === summaryId
            ? { ...summary, 'summary-content': editedContent, updatedAt: new Date() }
            : summary
        )
      );

      setEditableSummary(null);
      setEditedContent('');
    } catch (error) {
      console.error("Error saving summary:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-blue-100">
        <div className="text-lg text-gray-600">Loading summaries...</div>
      </div>
    );
  }

  let filteredSummaries = summaries.filter((summary) => {
    const isTrashed = notebooks.some(
      (nb) => nb.name === 'trash' && nb.summaries.includes(summary.id)
    );
    return !isTrashed;
  });
  
  // Search by content
  if (searchQuery.trim() !== '') {
    filteredSummaries = filteredSummaries.filter((summary) =>
      summary['summary-content']?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }
  
  // Sort
  if (sortOption === 'createdAt') {
    filteredSummaries.sort((a, b) => {
      const dateA = a.createdAt?.toDate?.() || new Date(0);
      const dateB = b.createdAt?.toDate?.() || new Date(0);
      return dateB - dateA;
    });
  } else if (sortOption === 'updatedAt') {
    filteredSummaries.sort((a, b) => {
      const dateA = a.updatedAt?.toDate?.() || new Date(0);
      const dateB = b.updatedAt?.toDate?.() || new Date(0);
      return dateB - dateA;
    });
  } else if (sortOption === 'notebook') {
    filteredSummaries.sort((a, b) => {
      const aNotebook = notebooks.find(nb => nb.summaries.includes(a.id))?.name || '';
      const bNotebook = notebooks.find(nb => nb.summaries.includes(b.id))?.name || '';
      return aNotebook.localeCompare(bNotebook);
    });
  }
  
  return (
    
    <div className="flex h-screen bg-gray-50">
    
      <Sidebar />
      {editableSummary && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: '275px',
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 999,
            marginLeft: 0,
            paddingLeft: 0,
            borderLeft: 'none',
          }}
        />
      )}
      <div 
        className="flex-1 pr-8 py-6 overflow-auto"
        style={{
          marginLeft: '300px',
          position: 'relative',
        }}
      >
        <div style={{
          marginTop: '20px',
        }}>
        <h1 className="text-3xl font-bold mb-8">Summaries</h1>
        </div>
        <div className="mb-6">
          <div className="flex justify-between items-center max-w-4xl mx-auto">
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search summaries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={20} className="text-gray-500" />
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: '8px',
                  backgroundColor: 'white',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#D1D5DB',
                    borderWidth: '1.5px',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#D1D5DB',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#0F2841',
                    borderWidth: '2px',
                  },
                },
              }}
              sx={{
                maxWidth: '600px',
                '& .MuiInputBase-input': {
                  padding: '12px 14px',
                },
              }}
            />

            {/* Sort dropdown */}
            <FormControl sx={{ minWidth: 120, ml: 2 }}>
              <Select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                displayEmpty
                sx={{
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#D1D5DB',
                    borderWidth: '1.5px',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#D1D5DB',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#0F2841',
                    borderWidth: '2px',
                  },
                  '& .MuiSelect-select': {
                    padding: '12px 14px',
                  },
                }}
              >
                <MenuItem value="">Filter</MenuItem>
                <MenuItem value="createdAt">Date Created</MenuItem>
                <MenuItem value="updatedAt">Date Modified</MenuItem>
                <MenuItem value="notebook">Notebook</MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>
        
        {summaries.length === 0 ? (
          <div className="text-center text-gray-500 mt-16">
            <p className="text-xl">You don't have any summaries yet</p>
            <p className="mt-2">Use the extension to create your first summary</p>
          </div>
        ) : (
          <div style={{
            position: 'relative',
            minHeight: '100%',
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              columnGap: '15px',
              rowGap: '15px',
              position: 'relative',
            }}>
              {filteredSummaries.map((summary) => (
                <ExpandableCard
                  key={summary.id}
                  expanded={editableSummary === summary.id}
                  onClick={() => {
                    if (editableSummary !== summary.id) {
                      setEditableSummary(summary.id);
                      setEditedContent(summary['summary-content']);
                    }
                  }}
                >
                  {editableSummary === summary.id ? (
                    <CardContent sx={{ flex: 1, overflow: 'hidden', pb: 0 }}>
                      <div style={{ 
                        display: 'flex', 
                        flexDirection: 'column',
                        height: '70vh',
                        padding: '16px',
                      }}>
                        <TextField
                          fullWidth
                          multiline
                          value={editedContent}
                          onChange={(e) => setEditedContent(e.target.value)}
                          variant="outlined"
                          onClick={(e) => e.stopPropagation()}
                          sx={{
                            flex: '1 1 auto',
                            mb: 2,
                            backgroundColor: '#FFFFFF',
                            borderRadius: '15px',
                            '& .MuiInputBase-root': {
                              color: '#000',
                              height: '100%',
                              display: 'flex',
                              flexDirection: 'column',
                              backgroundColor: '#FFFFFF',
                              borderRadius: '15px',
                              padding: '16px',
                              '& textarea': {
                                height: '100% !important',
                                textAlign: 'justify',
                                overflowY: 'auto !important',
                                fontSize: '16px',
                                lineHeight: '1.6',
                                padding: '0'
                              }
                            },
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#D1D5DB',
                              borderWidth: '1.5px',
                              borderRadius: '15px'
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#D1D5DB',
                              borderWidth: '1.5px'
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#0F2841',
                              borderWidth: '2px'
                            }
                          }}
                        />
                        <div style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '12px',
                        }}>
                          <div style={{
                            display: 'flex',
                            justifyContent: 'flex-start',
                            gap: '16px',
                            color: '#6B7280',
                            fontSize: '14px',
                            fontWeight: 500,
                            borderTop: '1px solid rgba(0,0,0,0.1)',
                            paddingTop: '12px',
                          }}>
                            <span>{getTextStatistics(editedContent).words} words</span>
                            <span>{getTextStatistics(editedContent).sentences} sentences</span>
                          </div>
                          <CardActions 
                            sx={{ 
                              padding: '8px 0',
                              display: 'flex',
                              alignItems: 'center',
                              backgroundColor: 'white',
                              borderBottomLeftRadius: '20px',
                              borderBottomRightRadius: '20px',
                            }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              flex: 1,
                            }}>
                              {notebooks
                                .filter((nb) => nb.summaries.includes(summary.id))
                                .map((nb) => (
                                  <div key={nb.name} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <Chip
                                      label={`#${nb.name}`}
                                      sx={{
                                        backgroundColor: '#0F2841',
                                        color: 'white',
                                        borderRadius: '100px',
                                        '&:hover': {
                                          backgroundColor: '#1a3d5f',
                                        },
                                        '& .MuiChip-deleteIcon': {
                                          color: 'white',
                                          padding: '3px',
                                          borderRadius: '90%',
                                          backgroundColor: '#0F2841',
                                          transition: 'all 0.2s ease',
                                          '&:hover': {
                                            backgroundColor: 'white',
                                            color: '#f87171',
                                          },
                                        },
                                      }}
                                      onDelete={(e) => {
                                        e.stopPropagation();
                                        handleRemoveFromNotebook(nb.name, summary.id);
                                      }}
                                    />
                                  </div>
                                ))}
                            </div>
                            <div style={{ display: 'flex', gap: '6px' }}>
                              <IconButton
                                size="small"
                                sx={{
                                  backgroundColor: '#0F2841',
                                  width: '24px',
                                  height: '24px',
                                  color: 'white',
                                  '&:hover': {
                                    backgroundColor: '#1a3d5f',
                                  },
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAddTagClick(e, summary.id);
                                }}
                              >
                                <Plus size={14} />
                              </IconButton>
                              <IconButton
                                size="small"
                                sx={{
                                  backgroundColor: '#f87171',
                                  width: '24px',
                                  height: '24px',
                                  color: 'white',
                                  '&:hover': {
                                    backgroundColor: '#ef4444',
                                  },
                                }}
                                onClick={async (e) => {
                                  e.stopPropagation();
                                  const summaryId = summary.id;
                                  const trashNotebook = notebooks.find(nb => nb.name === 'trash');

                                  if (!trashNotebook) {
                                    const notebookRef = doc(db, `users/${userId}/notebooks/trash`);
                                    await setDoc(notebookRef, {
                                      summary1: summaryId,
                                      total: 1,
                                    });

                                    const newNotebook = {
                                      id: 'trash',
                                      name: 'trash',
                                      total: 1,
                                      summary1: summaryId,
                                      summaries: [summaryId],
                                    };

                                    setNotebooks([...notebooks, newNotebook]);
                                    return;
                                  }

                                  if (trashNotebook.summaries.includes(summaryId)) {
                                    console.log('Already in trash');
                                    return;
                                  }

                                  const nextSummaryNum = trashNotebook.total + 1;
                                  const notebookRef = doc(db, `users/${userId}/notebooks/trash`);

                                  await updateDoc(notebookRef, {
                                    [`summary${nextSummaryNum}`]: summaryId,
                                    total: nextSummaryNum,
                                  });

                                  // Add trashedAt timestamp to the summary
                                  const summaryRef = doc(db, `users/${userId}/summaries/${summaryId}`);
                                  
                                  await updateDoc(summaryRef, {
                                    trashedAt: serverTimestamp()
                                  });


                                  const updatedNotebooks = notebooks.map(nb => {
                                    if (nb.name === 'trash') {
                                      return {
                                        ...nb,
                                        [`summary${nextSummaryNum}`]: summaryId,
                                        summaries: [...nb.summaries, summaryId],
                                        total: nextSummaryNum,
                                      };
                                    }
                                    return nb;
                                  });

                                  setNotebooks(updatedNotebooks);
                                }}
                              >
                                <Trash2 size={14} />
                              </IconButton>
                            </div>
                            <div style={{ display: 'flex', gap: '8px', marginLeft: '8px' }}>
                              <Button
                                startIcon={<X size={16} />}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditableSummary(null);
                                  setEditedContent('');
                                }}
                                color="error"
                                variant="outlined"
                                size="small"
                                sx={{
                                  borderColor: '#f87171',
                                  color: '#f87171',
                                  '&:hover': {
                                    borderColor: '#ef4444',
                                    color: '#ef4444',
                                    backgroundColor: 'rgba(239, 68, 68, 0.04)',
                                  }
                                }}
                              >
                                Cancel
                              </Button>
                              <Button
                                startIcon={<Save size={16} />}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSaveSummary(summary.id);
                                }}
                                color="primary"
                                variant="contained"
                                size="small"
                                sx={{
                                  backgroundColor: '#0F2841',
                                  '&:hover': {
                                    backgroundColor: '#1a3d5f',
                                  }
                                }}
                              >
                                Save
                              </Button>
                            </div>
                          </CardActions>
                        </div>
                      </div>
                    </CardContent>
                  ) : (
                    <CardContent sx={{ 
                      flex: 1, 
                      overflow: 'hidden', 
                      pb: '0 !important',  // Override default padding bottom
                      pt: 2,
                      px: 2,
                      display: 'flex', 
                      flexDirection: 'column',
                      height: '100%',  // Ensure full height
                      minHeight: '200px' // Minimum height to prevent content squishing
                    }}>
                      <div className="relative flex-1 text-gray-700 text-base overflow-hidden" style={{ minHeight: '150px', marginBottom: '48px' }}>
                        <p className="whitespace-pre-wrap break-words">
                          {summary['summary-content']}
                        </p>
                        <div className="absolute bottom-0 left-0 w-full h-10 bg-gradient-to-t from-white to-transparent" />
                      </div>
                      <CardActions 
                        sx={{ 
                          padding: '12px 16px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          backgroundColor: 'white',
                          borderTop: '1px solid rgba(0, 0, 0, 0.1)',
                          borderBottomLeftRadius: '20px',
                          borderBottomRightRadius: '20px',
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          mt: 'auto',
                          mx: 0,  // Reset margin compensation
                          mb: 0,  // Reset margin compensation
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          flex: 1,
                          overflow: 'hidden',
                        }}>
                          {notebooks
                            .filter((nb) => nb.summaries.includes(summary.id) && nb.name !== 'trash')
                            .map((nb) => (
                              <div key={nb.name} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Chip
                                  label={`#${nb.name}`}
                                  sx={{
                                    backgroundColor: '#0F2841',
                                    color: 'white',
                                    borderRadius: '100px',
                                    '&:hover': {
                                      backgroundColor: '#1a3d5f',
                                    },
                                    '& .MuiChip-deleteIcon': {
                                      color: 'white',
                                      padding: '3px',
                                      borderRadius: '90%',
                                      backgroundColor: '#0F2841',
                                      transition: 'all 0.2s ease',
                                      '&:hover': {
                                        backgroundColor: 'white',
                                        color: '#f87171',
                                      },
                                    },
                                  }}
                                  onDelete={(e) => {
                                    e.stopPropagation();
                                    handleRemoveFromNotebook(nb.name, summary.id);
                                  }}
                                />
                              </div>
                            ))}
                        </div>
                        <div style={{ display: 'flex', gap: '6px', marginLeft: '8px', flexShrink: 0 }}>
                          <IconButton
                            size="small"
                            sx={{
                              backgroundColor: '#0F2841',
                              width: '24px',
                              height: '24px',
                              color: 'white',
                              '&:hover': {
                                backgroundColor: '#1a3d5f',
                              },
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddTagClick(e, summary.id);
                            }}
                          >
                            <Plus size={14} />
                          </IconButton>
                          <IconButton
                            size="small"
                            sx={{
                              backgroundColor: '#f87171',
                              width: '24px',
                              height: '24px',
                              color: 'white',
                              '&:hover': {
                                backgroundColor: '#ef4444',
                              },
                            }}
                            onClick={async (e) => {
                              e.stopPropagation();
                              const summaryId = summary.id;
                              const trashNotebook = notebooks.find(nb => nb.name === 'trash');

                              if (!trashNotebook) {
                                const notebookRef = doc(db, `users/${userId}/notebooks/trash`);
                                await setDoc(notebookRef, {
                                  summary1: summaryId,
                                  total: 1,
                                });

                                const newNotebook = {
                                  id: 'trash',
                                  name: 'trash',
                                  total: 1,
                                  summary1: summaryId,
                                  summaries: [summaryId],
                                };

                                setNotebooks([...notebooks, newNotebook]);
                                return;
                              }

                              if (trashNotebook.summaries.includes(summaryId)) {
                                console.log('Already in trash');
                                return;
                              }

                              const nextSummaryNum = trashNotebook.total + 1;
                              const notebookRef = doc(db, `users/${userId}/notebooks/trash`);

                              await updateDoc(notebookRef, {
                                [`summary${nextSummaryNum}`]: summaryId,
                                total: nextSummaryNum,
                              });

                              const summaryRef = doc(db, `users/${userId}/summaries/${summaryId}`);
                              const summarySnap = await getDoc(summaryRef);

                              if (summarySnap.exists()) {
                                await setDoc(summaryRef, {
                                  trashedAt: serverTimestamp()
                                }, { merge: true });
                                console.log(`trashedAt timestamp added to summary ${summaryId}`);
                              } else {
                                console.warn(`Summary ${summaryId} not found.`);
                              }


                              const updatedNotebooks = notebooks.map(nb => {
                                if (nb.name === 'trash') {
                                  return {
                                    ...nb,
                                    [`summary${nextSummaryNum}`]: summaryId,
                                    summaries: [...nb.summaries, summaryId],
                                    total: nextSummaryNum,
                                  };
                                }
                                return nb;
                              });

                              setNotebooks(updatedNotebooks);
                            }}
                          >
                            <Trash2 size={14} />
                          </IconButton>
                        </div>
                      </CardActions>
                    </CardContent>
                  )}
                </ExpandableCard>
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
      
      <AddToNotebook 
        showModal={showTagModal}
        position={modalPosition}
        onClose={() => {
          setShowTagModal(false);
          fetchUserData(userId); // Refresh the data after closing the modal
        }}
        notebooks={notebooks}
        selectedSummary={selectedSummary}
        userId={userId}
        onAddToNotebook={handleAddToNotebook}
        onNotebooksUpdate={setNotebooks}
      />
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

