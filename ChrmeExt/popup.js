let currentArticleContent = '';
let selectedTone = 'casual';
let selectedLength = 'short';

// Function to display status messages
function updateStatus(message) {
  const status = document.getElementById('status');
  status.textContent = message;
  setTimeout(() => {
    status.textContent = '';
  }, 3000);
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

// Initialize popup when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
  try {
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
    Please summarize this scientific article in a ${selectedTone} tone and ${selectedLength} length.
    
    Article Title: ${content.title}
    
    Abstract: ${content.abstract}
    
    Article Content: ${content.bodyContent.substring(0, 10000)}...
    
    Please provide a summary that captures the main findings, methodology, and implications of the research.
    
    TONE GUIDELINES:
    - If formal: use academic language, maintain objectivity, and focus on the scientific content
    - If explanatory: explain concepts in more accessible terms, include more background context
    - If concise: create a brief, to-the-point summary focusing only on key findings and implications
    
    LENGTH GUIDELINES:
    - If short: 1-2 paragraphs (about 150 words)
    - If medium: 3-4 paragraphs (about 300 words)
    - If long: 5-6 paragraphs (about 500 words)
    
    Ensure the summary accurately reflects the core content of the article.
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

// Apply button click handler - saves the summary (implementation depends on use case)
document.getElementById('apply').addEventListener('click', async () => {
  try {
    const summary = document.getElementById('responseBox').value;
    if (!summary) {
      updateStatus('No summary to save');
      return;
    }
    
    // Here you might want to implement functionality to save the summary
    // For example, copying to clipboard or saving to local storage
    
    // Copy to clipboard example:
    await navigator.clipboard.writeText(summary);
    updateStatus('Summary copied to clipboard');
    
    // Additional implementation for saving or using the summary would go here
    
  } catch (error) {
    updateStatus('Error saving summary');
    console.error('Save Error:', error);
  }
});