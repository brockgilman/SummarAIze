import React, { useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '/src/components/firebase/firebaseConfig';
import { 
  TextField, 
  Select, 
  MenuItem, 
  FormControl,
  Button,
  IconButton,
  Typography
} from '@mui/material';
import { X, Plus, Check } from 'lucide-react';

const AddToNotebook = ({ 
  showModal, 
  position, 
  onClose, 
  notebooks, 
  selectedSummary, 
  userId, 
  onAddToNotebook, 
  onNotebooksUpdate 
}) => {
  const [selectedNotebook, setSelectedNotebook] = useState('');
  const [newNotebookName, setNewNotebookName] = useState('');
  const [isAddingNotebook, setIsAddingNotebook] = useState(false);

  const handleCreateNotebook = async () => {
    const trimmedName = newNotebookName.trim().toLowerCase();
    if (!trimmedName || trimmedName === 'trash' || notebooks.find(nb => nb.name.toLowerCase() === trimmedName)) return;

    setIsAddingNotebook(true);
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

      const updatedNotebooks = [...notebooks, newNotebook];
      onNotebooksUpdate(updatedNotebooks);
      setSelectedNotebook(trimmedName);
      
      setTimeout(() => {
        setNewNotebookName('');
        setIsAddingNotebook(false);
        onClose();
      }, 1000);
      
      console.log(`Notebook "${trimmedName}" created.`);
    } catch (error) {
      console.error("Error creating notebook:", error);
      setIsAddingNotebook(false);
    }
  };

  const handleAddClick = () => {
    if (selectedNotebook) {
      onAddToNotebook(selectedNotebook);
      setSelectedNotebook('');
      onClose();
    }
  };

  if (!showModal) return null;

  return (
    <div
      style={{
        position: 'absolute',
        top: `${position.top}px`,
        left: `${position.left}px`,
        transform: 'translateX(-50%)',
        zIndex: 1200,
        backgroundColor: 'white',
        border: '1px solid #D1D5DB',
        borderRadius: '12px',
        padding: '16px',
        width: '300px',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <Typography variant="h6" sx={{ mb: 2, color: '#111827', fontWeight: 600 }}>
        Add to Notebook
      </Typography>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <Select
          value={selectedNotebook}
          onChange={(e) => setSelectedNotebook(e.target.value)}
          displayEmpty
          MenuProps={{
            container: document.body,
            PaperProps: {
              sx: {
                zIndex: 1300,
                mt: 1,
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                border: '1px solid #D1D5DB',
                borderRadius: '8px',
              }
            },
            sx: {
              zIndex: 1300,
              "& .MuiPopover-paper": {
                zIndex: 1300,
              },
              "& .MuiMenu-paper": {
                zIndex: 1300,
              }
            }
          }}
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
          <MenuItem value="" disabled>
            Choose a notebook
          </MenuItem>
          {notebooks
            .filter(notebook => notebook.name.toLowerCase() !== 'trash')
            .map((notebook) => (
              <MenuItem 
                key={notebook.id} 
                value={notebook.name}
                sx={{
                  padding: '12px 14px',
                  '&:hover': {
                    backgroundColor: 'rgba(15, 40, 65, 0.04)',
                  },
                }}
              >
                {notebook.name}
              </MenuItem>
            ))}
        </Select>
      </FormControl>
      
      <Typography variant="body1" sx={{ textAlign: 'center', mb: 2, color: '#6B7280' }}>
        or
      </Typography>
      
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <TextField
          placeholder="New notebook name"
          value={newNotebookName}
          onChange={(e) => setNewNotebookName(e.target.value)}
          fullWidth
          size="small"
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'white',
              borderRadius: '8px',
              '& fieldset': {
                borderColor: '#D1D5DB',
                borderWidth: '1.5px',
              },
              '&:hover fieldset': {
                borderColor: '#D1D5DB',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#0F2841',
                borderWidth: '2px',
              },
            },
          }}
        />
        <IconButton
          onClick={handleCreateNotebook}
          disabled={!newNotebookName.trim() || notebooks.some(nb => nb.name.toLowerCase() === newNotebookName.trim().toLowerCase())}
          sx={{
            backgroundColor: isAddingNotebook ? '#059669' : '#10b981',
            width: '40px',
            height: '40px',
            color: 'white',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              backgroundColor: '#059669',
              transform: 'scale(1.05)',
            },
            '&.Mui-disabled': {
              backgroundColor: '#D1D5DB',
              color: 'white',
            },
            '& svg': {
              transition: 'all 0.3s ease-in-out',
              transform: isAddingNotebook ? 'rotate(90deg)' : 'none',
            },
          }}
        >
          {isAddingNotebook ? (
            <Check 
              size={20}
              style={{
                animation: 'checkmark 0.3s ease-in-out forwards',
              }}
            />
          ) : (
            <Plus size={20} />
          )}
        </IconButton>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
        <Button
          startIcon={<X size={16} />}
          onClick={onClose}
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
          startIcon={<Plus size={16} />}
          onClick={() => {
            onAddToNotebook(selectedNotebook);
            setSelectedNotebook('');
            onClose();
          }}
          disabled={!selectedNotebook}
          color="primary"
          variant="contained"
          size="small"
          sx={{
            backgroundColor: '#0F2841',
            '&:hover': {
              backgroundColor: '#1a3d5f',
            },
            '&.Mui-disabled': {
              backgroundColor: '#D1D5DB',
            }
          }}
        >
          Add
        </Button>
      </div>
      <style>
        {`
          @keyframes checkmark {
            0% {
              transform: scale(0) rotate(-90deg);
              opacity: 0;
            }
            100% {
              transform: scale(1) rotate(0);
              opacity: 1;
            }
          }
        `}
      </style>
    </div>
  );
};

export default AddToNotebook; 