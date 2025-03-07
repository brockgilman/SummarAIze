// This content script runs in the context of web pages

// Function to extract article content
function getArticleContent() {
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
  
  return { 
    title, 
    abstract, 
    bodyContent,
    url: window.location.href
  };
}

// Function to check if current page is a scientific article
function isScientificArticle() {
  // Check for common elements in scientific article pages
  return (
    document.querySelector('.Abstracts') !== null ||
    document.querySelector('.article-dochead') !== null ||
    document.querySelector('meta[name="citation_title"]') !== null
  );
}

// Listen for messages from popup or background
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getArticleContent') {
    sendResponse(getArticleContent());
  } else if (request.action === 'isScientificArticle') {
    sendResponse({ isArticle: isScientificArticle() });
  }
  return true;
});