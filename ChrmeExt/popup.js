let currentArticleContent = '';
let selectedTone = 'casual';
let selectedLength = 'short';
let userUID = null;
const FIREBASE_API_ENDPOINT = 'https://summaraize-8487f.web.app/api/save-summary'; // Replace with your actual endpoint

// Function to display status messages
function updateStatus(message) {
  const status = document.getElementById('status');
  status.textContent = message;
  setTimeout(() => {
    status.textContent = '';
  }, 3000);
}

// Function to update the UI based on authentication status
function updateSaveButtonText() {
  const saveButton = document.getElementById('apply');
  const authIndicator = document.getElementById('auth-indicator');
  const authText = document.getElementById('auth-text');
  
  if (userUID) {
    // User is logged in
    saveButton.textContent = 'Save';
    authIndicator.classList.remove('logged-out');
    authIndicator.classList.add('logged-in');
    authText.textContent = 'Logged in';
  } else {
    // User is not logged in
    saveButton.textContent = 'Login to Save';
    authIndicator.classList.remove('logged-in');
    authIndicator.classList.add('logged-out');
    authText.textContent = 'Not logged in';
  }
}

// Get the current tab and extract article content
async function getCurrentTab() {
  const [tab] = await chrome.tabs.query({ 
    active: true, 
    currentWindow: true 
  });
  return tab;
}

// Extract article content from the page
async function getArticleContent() {
  const tab = await getCurrentTab();
  if (!tab) {
    throw new Error('No active tab found');
  }

  const results = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: () => {
      // Extract article title
      const title = document.querySelector('h1.Head') ? 
        document.querySelector('h1.Head').textContent.trim() : 
        document.title;
      
      // Extract article abstract
      const abstract = document.querySelector('.Abstracts') ? 
        document.querySelector('.Abstracts').textContent.trim() : '';
      
      // Extract article body
      const bodyContent = document.querySelector('.Body') ? 
        document.querySelector('.Body').textContent.trim() : '';
      
      // Combine relevant sections
      return { 
        title, 
        abstract, 
        bodyContent,
        url: window.location.href
      };
    }
  });

  return results[0]?.result;
}

// Get user UID from cookie
async function getUserUIDFromCookie() {
  try {
    const response = await chrome.runtime.sendMessage({
      action: 'getCookie',
      cookieParams: {
        url: 'https://summaraize-8487f.web.app/homepage', // Replace with your actual domain
        name: 'extension_user_uid'
      }
    });
    
    if (response.success) {
      userUID = response.value;
      console.log('User UID found:', userUID);
      
      // Check if we have a valid UID value
      if (userUID && userUID.length > 0) {
        return userUID;
      } else {
        console.error('Invalid UID in cookie');
        return null;
      }
    } else {
      console.error('Cookie error:', response.error);
      return null;
    }
  } catch (error) {
    console.error('Error getting cookie:', error);
    return null;
  }
}

// Initialize popup when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Get user UID from cookie
    await getUserUIDFromCookie();
    
    // Update the save button text based on authentication status
    updateSaveButtonText();
    
    // Extract article content when popup opens
    const content = await getArticleContent();
    if (content) {
      currentArticleContent = content;
      console.log('Article content extracted:', content.title);
    }
  } catch (error) {
    updateStatus('Error loading article content');
    console.error('Error:', error);
  }

  // Set up the tone toggle options
  document.querySelectorAll('#tone-toggle .toggle-option').forEach(option => {
    option.addEventListener('click', function() {
      // Remove active class from all tone options
      document.querySelectorAll('#tone-toggle .toggle-option').forEach(opt => {
        opt.classList.remove('active');
      });
      
      // Add active class to the clicked tone option
      this.classList.add('active');
      selectedTone = this.dataset.tone;
    });
  });

  // Set up the length toggle options
  document.querySelectorAll('#length-toggle .toggle-option').forEach(option => {
    option.addEventListener('click', function() {
      // Remove active class from all length options
      document.querySelectorAll('#length-toggle .toggle-option').forEach(opt => {
        opt.classList.remove('active');
      });
      
      // Add active class to the clicked length option
      this.classList.add('active');
      selectedLength = this.dataset.length;
    });
  });
});

// Send request to Groq API
async function makeApiRequest(prompt) {
  try {
    // Send the request to your backend service that handles the Groq API call
    const response = await chrome.runtime.sendMessage({
      action: 'makeApiRequest',
      prompt: prompt
    });
    
    return response;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// Save summary to Firebase
async function saveSummaryToFirebase(summary) {
  // Make sure we have a user UID
  if (!userUID) {
    const uid = await getUserUIDFromCookie();
    if (!uid) {
      throw new Error('User not authenticated. Please login first.');
    }
  }
  
  try {
    const summaryData = {
      userId: userUID,
      'paper-link': currentArticleContent.url,
      'summary-content': summary,
      'summary-length': selectedLength,
      'summary-tone': selectedTone,
      timestamp: new Date().toISOString()
    };
    
    const response = await chrome.runtime.sendMessage({
      action: 'saveSummaryToFirebase',
      apiEndpoint: FIREBASE_API_ENDPOINT,
      summaryData
    });
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to save summary');
    }
    
    return response.data;
  } catch (error) {
    console.error('Save to Firebase Error:', error);
    throw error;
  }
}

// Generate button click handler
document.getElementById('generate').addEventListener('click', async () => {
  try {
    // Refresh content before generating
    const content = await getArticleContent();
    if (!content || (!content.title && !content.abstract && !content.bodyContent)) {
      updateStatus('No article content found. Please make sure you are on a scientific article page.');
      return;
    }

    currentArticleContent = content;
    
    updateStatus('Generating summary...');
    
    // Construct the prompt for the AI model
    const prompt = `
    
    You are a summarization engine.

    TASK: Summarize the content below with a ${selectedTone} tone and ${selectedLength} length.
        
    Article Title: ${content.title}
    
    Abstract: ${content.abstract}
    
    Article Content: ${content.bodyContent.substring(0, 10000)}...
    
    RULES (follow strictly):
        - Output ONLY the summary — no preamble, no notes, no labels, no quotes, no formatting.
        - DO NOT include any text before or after the summary.
        - DO NOT write "Summary:", "Here is...", "Here's..." or anything similar.
        - Output must start immediately with the first word of the summary.
        - If you break any of these rules, the output is invalid.

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

    const response = await makeApiRequest(prompt);

    if (response.success && response.data?.choices?.[0]?.message?.content) {
      const summary = response.data.choices[0].message.content;
      document.getElementById('responseBox').value = summary;
      updateStatus('Summary generated successfully');
    } else if (response.error) {
      console.error('API Error:', response.error);
      updateStatus(`Error: ${response.error}`);
    } else {
      throw new Error('Invalid response format from API');
    }
  } catch (error) {
    console.error('Generate Error:', error);
    updateStatus(`Error: ${error.message}`);
  }
});

// Apply button click handler - saves the summary to Firebase
document.getElementById('apply').addEventListener('click', async () => {
  try {
    const summary = document.getElementById('responseBox').value;
    if (!summary) {
      updateStatus('No summary to save');
      return;
    }
    
    // Check if user is authenticated
    if (!userUID) {
      await getUserUIDFromCookie();
      if (!userUID) {
        updateStatus('Not logged in. Redirecting to login page...');
        
        // Get current tab
        const tab = await getCurrentTab();
        
        // Open the login page in a new tab
        chrome.tabs.create({ 
          url: 'https://summaraize-8487f.web.app/',
          active: true
        });
        return;
      }
    }
    
    updateStatus('Saving summary...');
    await saveSummaryToFirebase(summary);
    
    // Copy to clipboard as well
    await navigator.clipboard.writeText(summary);
    updateStatus('Summary saved and copied to clipboard');
    
  } catch (error) {
    updateStatus(`Error: ${error.message}`);
    console.error('Save Error:', error);
  }
});