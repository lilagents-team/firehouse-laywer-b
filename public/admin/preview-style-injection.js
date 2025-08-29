// Style injection for Sveltia CMS preview
document.addEventListener('DOMContentLoaded', function() {
  // Wait for CMS to load
  setTimeout(() => {
    // Inject styles into preview iframe
    const injectPreviewStyles = () => {
      // Find all preview frames
      const previewFrames = document.querySelectorAll('iframe[src*="preview"]');
      
      previewFrames.forEach(frame => {
        try {
          const frameDoc = frame.contentDocument || frame.contentWindow.document;
          
          if (frameDoc) {
            // Create style element
            const style = frameDoc.createElement('style');
            style.textContent = `
              body {
                font-family: system-ui, -apple-system, 'Segoe UI', sans-serif !important;
                background-color: #1a1a1a !important;
                color: #ffffff !important;
                margin: 0 !important;
                padding: 1rem !important;
              }
              
              h1, h2, h3, h4, h5, h6 {
                color: #ffffff !important;
                text-transform: uppercase !important;
                letter-spacing: 0.05em !important;
                font-weight: bold !important;
              }
              
              h1 {
                font-size: 2.5rem !important;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.5) !important;
                border-bottom: 2px solid #ff6b35 !important;
                padding-bottom: 1rem !important;
                margin-bottom: 2rem !important;
              }
              
              h3 {
                color: #ff6b35 !important;
                font-size: 1.25rem !important;
                margin: 2rem 0 1rem 0 !important;
              }
              
              p {
                color: #f3f4f6 !important;
                line-height: 1.6 !important;
                margin-bottom: 1.5rem !important;
              }
              
              ul, ol {
                color: #f3f4f6 !important;
              }
              
              li {
                margin-bottom: 0.5rem !important;
                color: #f3f4f6 !important;
              }
              
              /* Make it look more like the website */
              .preview-container {
                max-width: 800px !important;
                margin: 0 auto !important;
                padding: 2rem !important;
                background-color: #2a2a2a !important;
                border-radius: 0.5rem !important;
              }
            `;
            
            frameDoc.head.appendChild(style);
            
            // Wrap content in container
            const body = frameDoc.body;
            if (body && !body.querySelector('.preview-container')) {
              const container = frameDoc.createElement('div');
              container.className = 'preview-container';
              
              // Move all body content to container
              while (body.firstChild) {
                container.appendChild(body.firstChild);
              }
              
              body.appendChild(container);
            }
          }
        } catch (e) {
          // Cross-origin issues, skip
          console.log('Could not access preview frame:', e);
        }
      });
    };
    
    // Initial injection
    injectPreviewStyles();
    
    // Re-inject when content changes
    const observer = new MutationObserver(injectPreviewStyles);
    observer.observe(document.body, { 
      childList: true, 
      subtree: true 
    });
    
  }, 2000);
});