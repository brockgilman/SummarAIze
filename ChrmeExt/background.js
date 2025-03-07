const API_KEY = "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";

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'makeApiRequest') {
      fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          model: "mixtral-8x7b-32768",
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
  });