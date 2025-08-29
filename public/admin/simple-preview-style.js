// Simple, aggressive styling for Sveltia CMS preview
console.log('Loading simple preview styling...');

// Inject styles immediately
const style = document.createElement('style');
style.id = 'newsletter-preview-styles';
style.textContent = `
  /* Force dark theme on the entire right panel */
  main > div:last-child,
  [data-testid*="preview"],
  .preview-pane,
  div[class*="preview"] {
    background-color: #1a1a1a !important;
    color: #ffffff !important;
    font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif !important;
  }
  
  /* Style all content in the preview area */
  main > div:last-child *,
  [data-testid*="preview"] *,
  .preview-pane *,
  div[class*="preview"] * {
    background-color: inherit !important;
    color: #f3f4f6 !important;
  }
  
  /* Title styling (first h1 in preview) */
  main > div:last-child h1:first-of-type,
  [data-testid*="preview"] h1:first-of-type,
  .preview-pane h1:first-of-type,
  div[class*="preview"] h1:first-of-type {
    background-color: #111111 !important;
    color: #ffffff !important;
    font-size: 1.8rem !important;
    font-weight: bold !important;
    padding: 1.5rem 1rem !important;
    margin: 0 0 1rem 0 !important;
    border-bottom: 2px solid #ff6b35 !important;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.5) !important;
    letter-spacing: 0.02em !important;
    line-height: 1.2 !important;
  }
  
  /* Section headers */
  main > div:last-child h2,
  main > div:last-child h3,
  main > div:last-child h4,
  [data-testid*="preview"] h2,
  [data-testid*="preview"] h3,
  [data-testid*="preview"] h4,
  .preview-pane h2,
  .preview-pane h3,
  .preview-pane h4,
  div[class*="preview"] h2,
  div[class*="preview"] h3,
  div[class*="preview"] h4 {
    color: #ff6b35 !important;
    font-size: 1.1rem !important;
    font-weight: bold !important;
    text-transform: uppercase !important;
    letter-spacing: 0.05em !important;
    border-bottom: 1px solid #ff6b35 !important;
    padding: 0.8rem 1rem 0.3rem 1rem !important;
    margin: 1.5rem 0 0.8rem 0 !important;
    background-color: transparent !important;
  }
  
  /* Paragraphs and text content */
  main > div:last-child p,
  main > div:last-child div:not([class*="button"]),
  main > div:last-child span,
  [data-testid*="preview"] p,
  [data-testid*="preview"] div:not([class*="button"]),
  [data-testid*="preview"] span,
  .preview-pane p,
  .preview-pane div:not([class*="button"]),
  .preview-pane span,
  div[class*="preview"] p,
  div[class*="preview"] div:not([class*="button"]),
  div[class*="preview"] span {
    color: #f3f4f6 !important;
    line-height: 1.6 !important;
    padding: 0.3rem 1rem !important;
    margin-bottom: 0.8rem !important;
    background-color: transparent !important;
  }
  
  /* Main content area */
  main > div:last-child > div,
  [data-testid*="preview"] > div,
  .preview-pane > div,
  div[class*="preview"] > div {
    background-color: #2a2a2a !important;
    min-height: 70vh !important;
    padding: 0 !important;
  }
  
  /* Lists */
  main > div:last-child ul,
  main > div:last-child ol,
  main > div:last-child li,
  [data-testid*="preview"] ul,
  [data-testid*="preview"] ol,
  [data-testid*="preview"] li,
  .preview-pane ul,
  .preview-pane ol,
  .preview-pane li {
    color: #f3f4f6 !important;
    padding: 0.2rem 1rem !important;
  }
  
  /* Override any white backgrounds */
  main > div:last-child [style*="background-color: white"],
  main > div:last-child [style*="background: white"],
  main > div:last-child [style*="background-color: #fff"],
  main > div:last-child [style*="background: #fff"] {
    background-color: #2a2a2a !important;
  }
  
  /* Override any black text */
  main > div:last-child [style*="color: black"],
  main > div:last-child [style*="color: #000"] {
    color: #f3f4f6 !important;
  }
`;

document.head.appendChild(style);

// Function to continuously apply styling
function applyPreviewStyling() {
  // Find preview elements
  const previewElements = document.querySelectorAll('main > div:last-child, [data-testid*="preview"], .preview-pane, div[class*="preview"]');
  
  previewElements.forEach(element => {
    if (element && !element.hasAttribute('data-styled')) {
      element.setAttribute('data-styled', 'true');
      element.style.backgroundColor = '#1a1a1a';
      element.style.color = '#ffffff';
      element.style.fontFamily = 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';
      
      // Add volume/edition info if we can find the form fields
      const titleElement = element.querySelector('h1');
      if (titleElement) {
        const volumeField = document.querySelector('input[name*="volume"], select[name*="volume"]');
        const editionField = document.querySelector('input[name*="edition"], select[name*="edition"]');
        
        if (volumeField && editionField && volumeField.value && editionField.value) {
          let volumeInfo = element.querySelector('.volume-info');
          if (!volumeInfo) {
            volumeInfo = document.createElement('div');
            volumeInfo.className = 'volume-info';
            volumeInfo.style.cssText = `
              background-color: #111111 !important;
              color: #ff6b35 !important;
              font-size: 0.875rem !important;
              font-weight: 600 !important;
              text-transform: uppercase !important;
              letter-spacing: 0.1em !important;
              padding: 0.5rem 1rem !important;
              margin: 0 !important;
              border-bottom: 2px solid #ff6b35 !important;
            `;
            titleElement.parentNode.insertBefore(volumeInfo, titleElement);
          }
          volumeInfo.textContent = `Volume ${volumeField.value}, Edition ${editionField.value}`;
        }
      }
    }
  });
}

// Apply styling immediately and on changes
document.addEventListener('DOMContentLoaded', () => {
  console.log('Applying newsletter preview styling...');
  applyPreviewStyling();
  
  // Reapply styling periodically to catch dynamic content
  setInterval(applyPreviewStyling, 2000);
  
  // Watch for changes in the DOM
  const observer = new MutationObserver(() => {
    setTimeout(applyPreviewStyling, 100);
  });
  
  observer.observe(document.body, { 
    childList: true, 
    subtree: true,
    attributes: true
  });
  
  console.log('Newsletter preview styling active');
});

// Also apply immediately if DOM is already loaded
if (document.readyState !== 'loading') {
  applyPreviewStyling();
  setInterval(applyPreviewStyling, 2000);
}

console.log('Simple preview styling loaded successfully');