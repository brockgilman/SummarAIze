const API_KEY = "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";

// Add permission to the manifest.json to access cookies
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'makeApiRequest') {
    fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: "llama3-70b-8192",
        messages: [{
          role: "user",
          content: request.prompt
        }],
        temperature: 0.7,
        max_tokens: 1024
      })
    })
    .then(async response => {
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error: ${errorText}`);
      }
      return response.json();
    })
    .then(data => {
      if (!data.choices || !data.choices[0]?.message?.content) {
        throw new Error('Invalid API response format');
      }
      sendResponse({ success: true, data });
    })
    .catch(error => {
      console.error('API Error:', error);
      sendResponse({ success: false, error: error.message });
    });
    return true;
  }
  
  // New handler to save summary to Firebase
  if (request.action === 'saveSummaryToFirebase') {
    // We'll use fetch to make a request to your web app
    fetch(request.apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request.summaryData)
    })
    .then(async response => {
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error: ${errorText}`);
      }
      return response.json();
    })
    .then(data => {
      sendResponse({ success: true, data });
    })
    .catch(error => {
      console.error('Firebase Save Error:', error);
      sendResponse({ success: false, error: error.message });
    });
    return true;
  }
  
  // New handler to get cookie
  if (request.action === 'getCookie') {
    const { url, name } = request.cookieParams;
    chrome.cookies.get({ url, name }, cookie => {
      if (cookie) {
        sendResponse({ 
          success: true, 
          value: decodeURIComponent(cookie.value) 
        });
      } else {
        sendResponse({ 
          success: false, 
          error: 'Cookie not found' 
        });
      }
    });
    return true;
  }

  if (request.action === 'saveSummaryToFirebase') {
    console.log('Saving summary to Firebase via endpoint:', request.apiEndpoint);
    console.log('Summary data:', request.summaryData);
    
    // Use fetch with proper CORS handling
    fetch(request.apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request.summaryData)
    })
    .then(async response => {
      // Even if response is not ok, get the text to show error details
      const text = await response.text();
      
      if (!response.ok) {
        console.error('API Error Status:', response.status);
        console.error('API Error Response:', text);
        throw new Error(`API Error: ${response.status} - ${text}`);
      }
      
      // Try to parse as JSON if possible
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        data = { message: text };
      }
      
      return data;
    })
    .then(data => {
      console.log('Save successful:', data);
      sendResponse({ success: true, data });
    })
    .catch(error => {
      console.error('Firebase Save Error:', error);
      sendResponse({ 
        success: false, 
        error: error.message || 'Network error occurred'
      });
    });
    
    return true;  // Keep channel open for async response
  }
});