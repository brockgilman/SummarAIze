import React, { useState, useEffect, useRef } from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import TextField from '@mui/material/TextField';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Navbar from '../components/Navbar';
import Button from '@mui/material/Button';

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

const Demo = () => {
  const [selectedTone, setSelectedTone] = useState('casual');
  const [selectedLength, setSelectedLength] = useState('short');
  const [textInput, setTextInput] = useState('');
  const [inputStats, setInputStats] = useState({ words: 0, sentences: 0 });
  const textareaRef = useRef(null);

  const countWordsAndSentences = (text) => {
    if (!text) return { words: 0, sentences: 0 };
    const words = text.trim().split(/\s+/).filter((word) => word.length > 0).length;
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0).length;
    return { words, sentences };
  };

  useEffect(() => {
    setInputStats(countWordsAndSentences(textInput));
  }, [textInput]);

  const handleToneChange = (event, newTone) => {
    if (newTone !== null) {
      setSelectedTone(newTone);
    }
  };

  const handleLengthChange = (event, newLength) => {
    if (newLength !== null) {
      setSelectedLength(newLength);
    }
  };

  const handleTextChange = (e) => {
    setTextInput(e.target.value);
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="min-h-screen bg-[#1a1a1a] text-white">
        <Navbar />
        {/* Main Content */}
        <div className="p-10" style={{
          marginLeft: '50px',
          marginRight: '50px',
          marginTop: '80px',
          width: 'calc(100% - 100px)',
        }}>
          <h1 className="text-3xl font-bold mb-8 text-center">Demo Generate Summary</h1>

          {/* Tone & Length Toggles */}
          <div className="mb-8 space-y-6" style={{ maxWidth: '1400px', margin: '0 auto' }}>
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

          {/* Text field */}
          <div className="flex flex-row mb-6" 
            style={{ 
              display: 'flex', 
              width: '100%',
              maxWidth: '1400px',
              margin: '0 auto',
              minHeight: '400px',
              border: '2px solid #CFD4DA',
              borderRadius: '25px',
              overflow: 'hidden',
              backgroundColor: '#FFFFFF',
              marginTop: '32px'
            }}>
            {/* Input */}
            <div style={{ 
              flex: '1',
              display: 'flex', 
              flexDirection: 'column',
              padding: '12px',
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
                  marginBottom: '50px',
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
              <div style={{
                position: 'absolute',
                bottom: '16px',
                left: 0,
                right: 0,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0 20px',
                height: '32px',
                backgroundColor: '#FFFFFF'
              }}>
                <div className="text-sm text-gray-600" style={{
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  {inputStats.words} words • {inputStats.sentences} sentences
                </div>
                <Button
                  onClick={() => window.location.href = '/signup'}
                  variant="contained"
                  sx={{
                    backgroundColor: '#0F2841',
                    color: '#CFD4DA',
                    padding: '8px 32px',
                    height: '32px',
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '14px',
                    '&:hover': {
                      backgroundColor: 'rgba(15, 40, 65, 0.9)',
                    }
                  }}
                >
                  Try for Free
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Demo;