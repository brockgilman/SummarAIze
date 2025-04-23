import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import TextField from '@mui/material/TextField';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { getUserID } from '../components/firebase/firebaseUserID';
import { db } from '../components/firebase/firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';


// Custom MUI theme styling
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#478cde' },
    background: { paper: '#2c2c2c', default: '#1a1a1a' },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.7)',
    },
  },
  components: {
    MuiToggleButton: {
      styleOverrides: {
        root: {
          color: '#000',
          border: 'none',
          padding: '8px 16px',
          textTransform: 'none',
          fontWeight: 600,
          // default state
          backgroundColor: '#CFD4DA',
          // hover state
          '&:hover': {
            backgroundColor: '#BABFC4',
          },
          // selected state
          '&.Mui-selected': {
            color: '#CFD4DA',
            backgroundColor: '#0F2841',
            // hover state
            '&:hover': {
              backgroundColor: 'rgba(15, 40, 65, 0.9)',
            },
            '&:active': {
              backgroundColor: 'rgba(15, 40, 65, 0.9)',
            },
          },
        },
      },
    },
    MuiToggleButtonGroup: {
      styleOverrides: {
        root: {
          backgroundColor: '#CFD4DA',
          borderRadius: '8px',
          padding: '2px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
          border: '1px solid rgba(169, 201, 255, 0.2)',
          width: '100%',
          maxWidth: '100%',
        },
        grouped: {
          margin: 2,
          border: 'none',
          borderRadius: '6px !important',
        },
      },
    },
  },
});

// var delcarations
const Generate = () => {
  // UI state
  const [selectedTone, setSelectedTone] = useState('casual');
  const [selectedLength, setSelectedLength] = useState('short');
  const [textInput, setTextInput] = useState('');
  const [responseText, setResponseText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [inputStats, setInputStats] = useState({ words: 0, sentences: 0 });
  const [outputStats, setOutputStats] = useState({ words: 0, sentences: 0 });
  const textareaRef = useRef(null);
  const [userId, setUserId] = useState(null);

  // Groq API Key
  const API_KEY = import.meta.env.VITE_GROQ_API_KEY;

  // Helper function to count words and sentences
  const countWordsAndSentences = (text) => {
    if (!text) return { words: 0, sentences: 0 };
    const words = text.trim().split(/\s+/).filter((word) => word.length > 0).length;
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0).length;
    return { words, sentences };
  };

  // Recalculate input stats when user types
  useEffect(() => {
    setInputStats(countWordsAndSentences(textInput));
  }, [textInput]);

  // Recalculate output stats when response changes
  useEffect(() => {
    setOutputStats(countWordsAndSentences(responseText));
  }, [responseText]);

  // Tone toggle change handler
  const handleToneChange = (event, newTone) => {
    if (newTone !== null) {
      setSelectedTone(newTone);
    }
  };

  // Length toggle change handler
  const handleLengthChange = (event, newLength) => {
    if (newLength !== null) {
      setSelectedLength(newLength);
    }
  };

  // Input change handler
  const handleTextChange = (e) => {
    setTextInput(e.target.value);
  };

  // Paste text from clipboard
  const pasteFromClipboard = () => {
    navigator.clipboard.readText()
      .then((text) => setTextInput(text))
      .catch((err) => console.error('Failed to read clipboard contents:', err));
  };

  // Generate summary with Groq API
  const generateSummary = async () => {
    if (!textInput) {
      setError('Please paste text to summarize');
      return;
    }
    setIsGenerating(true);
    setError('');

    try {
      // Prompt
      const prompt = 
      `
        You are a summarization engine.

        TASK: Summarize the content below with a ${selectedTone} tone and ${selectedLength} length.
        
        RULES (follow strictly):
        - Output ONLY the summary — no preamble, no notes, no labels, no quotes, no formatting.
        - DO NOT include any text before or after the summary.
        - DO NOT write "Summary:", "Here is...", "Here's..." or anything similar.
        - Output must start immediately with the first word of the summary.
        - If you break any of these rules, the output is invalid.

        CONTENT: ${textInput}

        TONE GUIDELINES:
        - If casual: use natural, conversational language, explain concepts in an accessible way
        - If knowledgeable: use more technical language with proper terminology and structure
        - If expert: use specialized terminology, maintain academic style, use advance vocabulary

        LENGTH GUIDELINES:
        - If short: 1-2 paragraphs (~150 words)
        - If medium: 3-4 paragraphs (~300 words)
        - If long: 5-6 paragraphs (~500 words)

        Ensure the summary is accurate and relevant to the content.
      `;

      // API call
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: 'llama3-70b-8192',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
          max_tokens: 1024,
        }),
      });

      // If the response status is not OK, throw an error
      if (!response.ok) {
        throw new Error(`API error code: ${response.status}`);
      }

      // Parse the response into JSON format
      const data = await response.json();
      console.log('Groq API response:', data); // api error state for debugging

      // Check if the response contains valid content, then set it
      if (data.choices && data.choices[0]?.message?.content) {
        setResponseText(data.choices[0].message.content);
      } else {
        throw new Error('Invalid API response format');
      }
    } catch (err) {
      setError(`Error: ${err.message}`);
      console.error('Generate Error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  // useEffect to fetch and store the user ID when component mounts
  useEffect(() => {
    const unsubscribe = getUserID((uid) => {
      if (uid) {
        setUserId(uid);
      } else {
        console.log('No user authenticated');
      }
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  // Function to save the generated summary to Firestore
  const saveSummary = async () => {
    if (!responseText) {
      setError('No summary to save');
      return;
    }
    try {
      if (!userId) {
        throw new Error('User not authenticated');
      }

      // Reference to the user's summaries subcollection
      const summariesRef = collection(db, `users/${userId}/summaries`);
      
      // Add a new document to the summaries subcollection
      await addDoc(summariesRef, {
        'summary-content': responseText,
        'summary-length': selectedLength,
        'summary-tone': selectedTone,
        createdAt: serverTimestamp() // Use serverTimestamp to match Chrome extension
      });

      setError('');
      alert('Summary saved successfully!');
    } catch (error) {
      setError(`Error: ${error.message}`);
      console.error('Save Error:', error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="generate-wrapper min-h-screen bg-[#1a1a1a] text-white flex">
        {/* Fixed sidebar on the left */}
        <Sidebar />

        
        {/* Main content offset from sidebar */}
        <div
          className="p-10"
          style={{
            marginLeft: '350px',
            marginRight: '350px',
            marginTop: '20px',
            width: 'calc(100% - 450px)', 
          }}
        >
          <h1 className="text-3xl font-bold mb-8">Generate Summary</h1>

          {/* Tone & Length Toggles */}
          <div className="mb-8 space-y-6">
            <div className="w-full flex items-center gap-4">
              <div className="text-white font-semibold" style={{ minWidth: '60px' }}>Tone</div>
              <ToggleButtonGroup
                value={selectedTone}
                exclusive
                onChange={handleToneChange}
                fullWidth
                sx={{ width: '100%' }}
              >
                <ToggleButton value="casual">Casual</ToggleButton>
                <ToggleButton value="knowledgeable">Knowledgeable</ToggleButton>
                <ToggleButton value="expert">Expert</ToggleButton>
              </ToggleButtonGroup>
            </div>
            <div className="w-full flex items-center gap-4">
              <div className="text-white font-semibold" style={{ minWidth: '60px' }}>Length</div>
              <ToggleButtonGroup
                value={selectedLength}
                exclusive
                onChange={handleLengthChange}
                fullWidth
                sx={{ width: '100%' }}
              >
                <ToggleButton value="short">Short</ToggleButton>
                <ToggleButton value="medium">Medium</ToggleButton>
                <ToggleButton value="long">Long</ToggleButton>
              </ToggleButtonGroup>
            </div>
          </div>

          {/* Side-by-side text fields */}
          <div className="flex flex-row mb-6" 
            style={{ 
              display: 'flex', 
              width: '100%', 
              minHeight: '400px',
              border: '2px solid #CFD4DA',
              borderRadius: '25px',
              overflow: 'hidden',
              backgroundColor: '#FFFFFF',
              marginTop: '32px'
            }}>
            {/* Left (Input) */}
            <div style={{ 
              flex: '1 1 50%', 
              display: 'flex', 
              flexDirection: 'column',
              padding: '12px',
              borderRight: '2px solid #CFD4DA',
              position: 'relative'
            }}>
              <div className="mb-1">
                <label className="text-black font-semibold">Input Text</label>
              </div>
              <TextField
                inputRef={textareaRef}
                value={textInput}
                onChange={handleTextChange}
                variant="outlined"
                multiline
                fullWidth
                placeholder="Paste text to summarize..."
                sx={{
                  flex: 1,
                  backgroundColor: '#FFFFFF',
                  borderRadius: '15px',
                  height: '400px',
                  '& .MuiInputBase-root': {
                    color: '#000',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    border: 'none',
                    padding: '6px',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '15px',
                    '& textarea': {
                      height: 'calc(100% - 30px) !important',
                      textAlign: 'justify',
                      overflowY: 'auto !important',
                      paddingRight: '16px',
                    }
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    border: 'none'
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    border: 'none'
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    border: 'none'
                  },
                }}
              />
              <div className="text-sm text-gray-600" style={{ 
                position: 'absolute', 
                bottom: '8px', 
                left: '20px',
                display: 'flex',
                alignItems: 'center',
                height: '38px'
              }}>
                {inputStats.words} words • {inputStats.sentences} sentences
              </div>
              <button
                onClick={generateSummary}
                disabled={isGenerating}
                style={{
                  position: 'absolute',
                  bottom: '8px',
                  right: '20px',
                  backgroundColor: '#0F2841',
                  color: '#CFD4DA',
                  padding: '8px 32px',
                  height: '38px',
                  borderRadius: '6px',
                  border: 'none',
                  fontWeight: 600,
                  fontSize: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(15, 40, 65, 0.9)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = '#0F2841';
                }}
                onMouseDown={(e) => e.currentTarget.style.backgroundColor = 'rgba(15, 40, 65, 0.8)'}
                onMouseUp={(e) => e.currentTarget.style.backgroundColor = 'rgba(15, 40, 65, 0.9)'}
                className="disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? 'Generating...' : 'Generate'}
              </button>
            </div>

            {/* Right (Output) */}
            <div style={{ 
              flex: '1 1 50%', 
              display: 'flex', 
              flexDirection: 'column',
              padding: '12px',
              position: 'relative'
            }}>
              <div className="mb-1">
                <label className="text-black font-semibold">Summary</label>
              </div>
              <TextField
                value={responseText}
                variant="outlined"
                multiline
                fullWidth
                placeholder="Your summary will appear here..."
                InputProps={{ readOnly: true }}
                sx={{
                  flex: 1,
                  backgroundColor: '#FFFFFF',
                  borderRadius: '15px',
                  height: '400px',
                  '& .MuiInputBase-root': {
                    color: '#000',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    border: 'none',
                    padding: '6px',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '15px',
                    '& textarea': {
                      height: 'calc(100% - 30px) !important',
                      textAlign: 'justify',
                      overflowY: 'auto !important',
                      paddingRight: '16px',
                    }
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    border: 'none'
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    border: 'none'
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    border: 'none'
                  },
                }}
              />
              <div className="text-sm text-gray-600" style={{ 
                position: 'absolute', 
                bottom: '8px', 
                left: '20px',
                display: 'flex',
                alignItems: 'center',
                height: '38px'
              }}>
                {outputStats.words} words • {outputStats.sentences} sentences
              </div>
              <button
                onClick={saveSummary}
                disabled={!responseText}
                style={{
                  position: 'absolute',
                  bottom: '8px',
                  right: '20px',
                  backgroundColor: '#0F2841',
                  color: '#CFD4DA',
                  padding: '8px 32px',
                  height: '38px',
                  borderRadius: '6px',
                  border: 'none',
                  fontWeight: 600,
                  fontSize: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(15, 40, 65, 0.9)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = '#0F2841';
                }}
                onMouseDown={(e) => e.currentTarget.style.backgroundColor = 'rgba(15, 40, 65, 0.8)'}
                onMouseUp={(e) => e.currentTarget.style.backgroundColor = 'rgba(15, 40, 65, 0.9)'}
                className="disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 text-red-400 text-center">
              {error}
            </div>
          )}
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Generate;
