import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import TextField from '@mui/material/TextField';
import { createTheme, ThemeProvider } from '@mui/material/styles';

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
  const [selectedTone, setSelectedTone] = useState('casual');
  const [selectedLength, setSelectedLength] = useState('short');
  const [textInput, setTextInput] = useState('');
  const [responseText, setResponseText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [inputStats, setInputStats] = useState({ words: 0, sentences: 0 });
  const [outputStats, setOutputStats] = useState({ words: 0, sentences: 0 });
  const textareaRef = useRef(null);

  const API_KEY = "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";

  // count words and sentences
  const countWordsAndSentences = (text) => {
    if (!text) return { words: 0, sentences: 0 };
    const words = text.trim().split(/\s+/).filter((word) => word.length > 0).length;
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0).length;
    return { words, sentences };
  };

  // update stats when input changes
  useEffect(() => {
    setInputStats(countWordsAndSentences(textInput));
  }, [textInput]);

  // Update stats when output changes
  useEffect(() => {
    setOutputStats(countWordsAndSentences(responseText));
  }, [responseText]);

  // tone toggle
  const handleToneChange = (event, newTone) => {
    if (newTone !== null) {
      setSelectedTone(newTone);
    }
  };

  // length toggle
  const handleLengthChange = (event, newLength) => {
    if (newLength !== null) {
      setSelectedLength(newLength);
    }
  };

  // input text change
  const handleTextChange = (e) => {
    setTextInput(e.target.value);
  };

  // paste from clipboard
  const pasteFromClipboard = () => {
    navigator.clipboard.readText()
      .then((text) => setTextInput(text))
      .catch((err) => console.error('Failed to read clipboard contents:', err));
  };

  // generate summary
  const generateSummary = async () => {
    if (!textInput) {
      setError('Please paste text to summarize');
      return;
    }
    setIsGenerating(true);
    setError('');

    try {
      // ai prompt
      const prompt = `
        Please summarize this content in a ${selectedTone} tone and ${selectedLength} length.
        
        Content: ${textInput}

        TONE GUIDELINES:
        - If casual: use conversational language, explain concepts in an accessible way
        - If knowledgeable: use more technical language with proper terminology
        - If expert: use specialized terminology, maintain academic style

        LENGTH GUIDELINES:
        - If short: 1-2 paragraphs (about 150 words)
        - If medium: 3-4 paragraphs (about 300 words)
        - If long: 5-6 paragraphs (about 500 words)

        DO NOT include any before/after text in the summary, just the summary itself.

        Please make sure the summary is accurate and relevant to the content.
      `;

      // api call
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

      if (!response.ok) {
        throw new Error(`API error code: ${response.status}`);
      }

      const data = await response.json();
      console.log('Groq API response:', data); // api error state for debugging

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

  // save summary for future use
  const saveSummary = async () => {
    if (!responseText) {
      setError('No summary to save');
      return;
    }
    try {
      // implementation for saving summary
      alert('Summary saved successfully!');
    } catch (err) {
      setError(`Error saving: ${err.message}`);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="generate-wrapper min-h-screen bg-[#1a1a1a] text-white flex">
        {/* Fixed sidebar on the left */}
        <Sidebar />

        {/* TODO: still figuring out how to make sidebar dynamic */}
        {/* Main content offset from sidebar */}
        <div
          className="p-6"
          style={{
            marginLeft: '275px',          // match sidebar width from Sidebar.css
            width: 'calc(100% - 275px)', // fill remaining space
          }}
        >
          <h1 className="text-3xl font-bold mb-8">Generate Summary</h1>

          {/* Tone & Length Toggles */}
          <div className="mb-8 space-y-6">
            <div>
              <div className="text-white font-extrabold mb-2">Tone</div>
              <ToggleButtonGroup
                value={selectedTone}
                exclusive
                onChange={handleToneChange}
                fullWidth
              >
                <ToggleButton value="casual">Casual</ToggleButton>
                <ToggleButton value="knowledgeable">Knowledgeable</ToggleButton>
                <ToggleButton value="expert">Expert</ToggleButton>
              </ToggleButtonGroup>
            </div>
            <div>
              <div className="text-white font-semibold mb-2">Length</div>
              <ToggleButtonGroup
                value={selectedLength}
                exclusive
                onChange={handleLengthChange}
                fullWidth
              >
                <ToggleButton value="short">Short</ToggleButton>
                <ToggleButton value="medium">Medium</ToggleButton>
                <ToggleButton value="long">Long</ToggleButton>
              </ToggleButtonGroup>
            </div>
          </div>

          {/* Side-by-side text fields */}
          <div className="flex flex-row gap-6 mb-6" style={{ display: 'flex', width: '100%', minHeight: '400px' }}>
            {/* Left (Input) */}
            <div style={{ flex: '1 1 50%', display: 'flex', flexDirection: 'column' }}>
              <div className="flex justify-between items-center mb-2">
                <label className="text-white font-semibold">Input Text</label>
                <div className="text-sm text-gray-400">
                  {inputStats.words} words | {inputStats.sentences} sentences
                </div>
              </div>
              <button
                onClick={pasteFromClipboard}
                className="mb-2 w-32 bg-[#478cde] text-white py-2 px-4 rounded-md font-bold hover:opacity-90 transition shadow-md"
              >
                Paste Text
              </button>
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
                  backgroundColor: '#2c2c2c',
                  '& .MuiInputBase-root': {
                    color: '#fff',
                    display: 'block',
                    maxHeight: '300px',
                    overflowY: 'scroll',
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(169,201,255,0.2)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#478cde',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#478cde',
                  },
                }}
              />
            </div>

            {/* Right (Output) */}
            <div style={{ flex: '1 1 50%', display: 'flex', flexDirection: 'column' }}>
              <div className="flex justify-between items-center mb-2">
                <label className="text-white font-semibold">Summary</label>
                <div className="text-sm text-gray-400">
                  {outputStats.words} words | {outputStats.sentences} sentences
                </div>
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
                  backgroundColor: '#2c2c2c',
                  '& .MuiInputBase-root': {
                    color: '#fff',
                    display: 'block',
                    maxHeight: '300px',
                    overflowY: 'scroll',
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(169,201,255,0.2)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#478cde',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#478cde',
                  },
                }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-6 mb-4">
            <button
              onClick={generateSummary}
              disabled={isGenerating}
              className="px-8 bg-[#478cde] text-white py-3 rounded-md font-bold text-lg hover:opacity-90 transition disabled:opacity-50"
            >
              {isGenerating ? 'Generating...' : 'Generate'}
            </button>
            <button
              onClick={saveSummary}
              disabled={!responseText}
              className="px-8 bg-[#478cde] text-white py-3 rounded-md font-bold text-lg hover:opacity-90 transition disabled:opacity-50"
            >
              Save Summary
            </button>
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
