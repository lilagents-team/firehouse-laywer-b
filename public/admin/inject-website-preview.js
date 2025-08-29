// Inject actual website styling and layout into CMS preview
document.addEventListener('DOMContentLoaded', function() {
  console.log('Setting up website-style preview injection for Sveltia CMS...');
  
  function injectWebsitePreview() {
    // Find the preview panel in Sveltia CMS (not iframe-based)
    const previewPanel = document.querySelector('[data-testid="preview-pane"]') || 
                        document.querySelector('.preview-pane') || 
                        document.querySelector('[class*="preview"]') ||
                        document.querySelector('main > div > div:last-child'); // Fallback for right panel
    
    if (previewPanel && !previewPanel.querySelector('#sveltia-preview-styled')) {
      console.log('Found preview panel, injecting styles...');
      
      // Mark as styled to avoid re-injection
      const marker = document.createElement('div');
      marker.id = 'sveltia-preview-styled';
      marker.style.display = 'none';
      previewPanel.appendChild(marker);
      
      // Apply website-style CSS to the preview panel
      const style = document.createElement('style');
      style.textContent = `
        /* Target the preview panel specifically */
        [data-testid="preview-pane"], 
        .preview-pane,
        main > div > div:last-child {
          background-color: #1a1a1a !important;
          color: #ffffff !important;
          font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif !important;
          padding: 0 !important;
        }
        
        /* Style the preview content */
        [data-testid="preview-pane"] > *,
        .preview-pane > *,
        main > div > div:last-child > * {
          background-color: #1a1a1a !important;
          color: #ffffff !important;
        }
        
        /* Newsletter header styling */
        [data-testid="preview-pane"] h1:first-of-type,
        .preview-pane h1:first-of-type,
        main > div > div:last-child h1:first-of-type {
          background-color: #111111 !important;
          color: #ffffff !important;
          font-size: 2rem !important;
          font-weight: bold !important;
          padding: 2rem 1rem !important;
          margin: 0 !important;
          border-bottom: 2px solid #ff6b35 !important;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.5) !important;
          letter-spacing: 0.05em !important;
        }
        
        /* Section headers */
        [data-testid="preview-pane"] h2,
        [data-testid="preview-pane"] h3,
        [data-testid="preview-pane"] h4,
        .preview-pane h2,
        .preview-pane h3,
        .preview-pane h4,
        main > div > div:last-child h2,
        main > div > div:last-child h3,
        main > div > div:last-child h4 {
          color: #ff6b35 !important;
          font-size: 1.25rem !important;
          font-weight: bold !important;
          text-transform: uppercase !important;
          letter-spacing: 0.05em !important;
          border-bottom: 1px solid #ff6b35 !important;
          padding-bottom: 0.5rem !important;
          margin: 2rem 1rem 1rem 1rem !important;
        }
        
        /* Paragraphs and content */
        [data-testid="preview-pane"] p,
        [data-testid="preview-pane"] div,
        [data-testid="preview-pane"] span,
        .preview-pane p,
        .preview-pane div,
        .preview-pane span,
        main > div > div:last-child p,
        main > div > div:last-child div,
        main > div > div:last-child span {
          color: #f3f4f6 !important;
          line-height: 1.6 !important;
          padding: 0.5rem 1rem !important;
          margin-bottom: 1rem !important;
        }
        
        /* Content background */
        [data-testid="preview-pane"] > div,
        .preview-pane > div,
        main > div > div:last-child > div {
          background-color: #2a2a2a !important;
          min-height: 60vh !important;
          padding: 1rem !important;
        }
      `;
      
      document.head.appendChild(style);
      
      // Transform content structure
      setTimeout(() => {
        transformSveltiaPreview(previewPanel);
      }, 500);
    }
    
    // Also try to style any iframes (fallback)
    const previewFrames = document.querySelectorAll('iframe');
    previewFrames.forEach(frame => {
      try {
        const frameDoc = frame.contentDocument || frame.contentWindow.document;
        
        if (frameDoc && frameDoc.body) {
          // Only inject if we haven't already done so
          if (frameDoc.querySelector('#website-preview-injected')) {
            return;
          }
          
          // Mark as injected
          const marker = frameDoc.createElement('div');
          marker.id = 'website-preview-injected';
          marker.style.display = 'none';
          frameDoc.body.appendChild(marker);
          
          // Inject Tailwind CSS and your website styles
          const tailwindLink = frameDoc.createElement('link');
          tailwindLink.rel = 'stylesheet';
          tailwindLink.href = 'https://cdn.tailwindcss.com';
          frameDoc.head.appendChild(tailwindLink);
          
          // Inject your custom styles
          const customStyles = frameDoc.createElement('style');
          customStyles.textContent = `
            /* Base website styles */
            body {
              font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif !important;
              background-color: #1a1a1a !important;
              color: #ffffff !important;
              margin: 0 !important;
              padding: 0 !important;
            }
            
            /* Create the website layout structure */
            .newsletter-preview-container {
              background-color: #1a1a1a;
              min-height: 100vh;
              padding: 0;
            }
            
            .newsletter-header {
              background-color: #111111;
              padding: 2rem 1rem;
              border-bottom: 2px solid #ff6b35;
            }
            
            .newsletter-header-content {
              max-width: 1200px;
              margin: 0 auto;
            }
            
            .newsletter-volume {
              color: #ff6b35;
              font-size: 0.875rem;
              font-weight: 600;
              text-transform: uppercase;
              letter-spacing: 0.1em;
              margin: 0 0 0.5rem 0;
            }
            
            .newsletter-title {
              font-size: 2rem;
              font-weight: bold;
              color: #ffffff;
              margin: 0 0 0.5rem 0;
              letter-spacing: 0.05em;
              text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
              line-height: 1.2;
            }
            
            .newsletter-date {
              font-size: 1rem;
              color: #d1d5db;
              margin: 0;
            }
            
            .newsletter-main {
              background-color: #2a2a2a;
              padding: 2rem 1rem;
              min-height: 60vh;
            }
            
            .newsletter-content {
              max-width: 800px;
              margin: 0 auto;
            }
            
            .newsletter-section {
              margin-bottom: 2rem;
            }
            
            .newsletter-section h3 {
              font-size: 1.25rem;
              font-weight: bold;
              color: #ffffff;
              margin-bottom: 1rem;
              letter-spacing: 0.05em;
              text-transform: uppercase;
              border-bottom: 1px solid #ff6b35;
              padding-bottom: 0.5rem;
            }
            
            .newsletter-section p {
              color: #f3f4f6;
              line-height: 1.6;
              margin-bottom: 1rem;
            }
            
            .newsletter-topics {
              display: flex;
              flex-wrap: wrap;
              gap: 0.5rem;
              margin-bottom: 1.5rem;
            }
            
            .newsletter-topic-badge {
              background-color: #ff6b35;
              color: #000000;
              font-size: 0.75rem;
              padding: 0.25rem 0.5rem;
              border-radius: 0.25rem;
              font-weight: 500;
            }
            
            /* Override default preview styles */
            h1, h2, h3, h4, h5, h6 {
              color: #ffffff !important;
              font-weight: bold !important;
            }
            
            h1 {
              font-size: 2rem !important;
              text-shadow: 2px 2px 4px rgba(0,0,0,0.5) !important;
            }
            
            p, li, span, div {
              color: #f3f4f6 !important;
              line-height: 1.6 !important;
            }
            
            /* Hide default CMS preview elements */
            .cms-preview-pane > div:first-child {
              display: none !important;
            }
          `;
          frameDoc.head.appendChild(customStyles);
          
          // Transform the content structure
          setTimeout(() => {
            transformPreviewContent(frameDoc);
          }, 500);
        }
      } catch (e) {
        // Cross-origin or access issues
        console.log('Could not access preview frame:', e.message);
      }
    });
  }
  
  function transformSveltiaPreview(previewPanel) {
    console.log('Transforming Sveltia preview content...');
    
    // Add a special class to indicate this is our styled preview
    previewPanel.classList.add('newsletter-website-preview');
    
    // Find content elements and add volume/edition info if available
    const titleElement = previewPanel.querySelector('h1');
    if (titleElement) {
      // Try to extract volume/edition from form fields
      const volumeField = document.querySelector('input[name*="volume"], input[id*="volume"]');
      const editionField = document.querySelector('input[name*="edition"], input[id*="edition"]');
      
      if (volumeField && editionField && volumeField.value && editionField.value) {
        // Create volume/edition display
        let volumeDisplay = previewPanel.querySelector('.volume-edition-display');
        if (!volumeDisplay) {
          volumeDisplay = document.createElement('div');
          volumeDisplay.className = 'volume-edition-display';
          volumeDisplay.style.cssText = `
            color: #ff6b35 !important;
            font-size: 0.875rem !important;
            font-weight: 600 !important;
            text-transform: uppercase !important;
            letter-spacing: 0.1em !important;
            margin: 0 0 0.5rem 0 !important;
            padding: 0.5rem 1rem !important;
            background-color: #111111 !important;
          `;
          titleElement.parentNode.insertBefore(volumeDisplay, titleElement);
        }
        volumeDisplay.textContent = `Volume ${volumeField.value}, Edition ${editionField.value}`;
      }
    }
  }
  
  function transformPreviewContent(frameDoc) {
    const body = frameDoc.body;
    
    // Wrap all content in our newsletter container
    const container = frameDoc.createElement('div');
    container.className = 'newsletter-preview-container';
    
    // Create header section
    const header = frameDoc.createElement('div');
    header.className = 'newsletter-header';
    
    const headerContent = frameDoc.createElement('div');
    headerContent.className = 'newsletter-header-content';
    
    // Extract title, volume, edition from the preview content
    const existingH1 = body.querySelector('h1');
    const title = existingH1 ? existingH1.textContent : 'Newsletter Title';
    
    // Try to extract volume and edition from content
    const volumeMatch = body.textContent.match(/Volume[:\s]+(\d+)/i);
    const editionMatch = body.textContent.match(/Edition[:\s]+(\d+)/i);
    const volume = volumeMatch ? volumeMatch[1] : '';
    const edition = editionMatch ? editionMatch[1] : '';
    
    // Build header HTML
    if (volume && edition) {
      const volumeEl = frameDoc.createElement('p');
      volumeEl.className = 'newsletter-volume';
      volumeEl.textContent = `Volume ${volume}, Edition ${edition}`;
      headerContent.appendChild(volumeEl);
    }
    
    const titleEl = frameDoc.createElement('h1');
    titleEl.className = 'newsletter-title';
    titleEl.textContent = title;
    headerContent.appendChild(titleEl);
    
    // Try to extract date
    const dateMatch = body.textContent.match(/(\d{4}-\d{2}-\d{2}|\w+ \d{4})/);
    if (dateMatch) {
      const dateEl = frameDoc.createElement('p');
      dateEl.className = 'newsletter-date';
      const dateStr = dateMatch[1];
      
      // Format date if it's YYYY-MM-DD format
      if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
        const date = new Date(dateStr + 'T12:00:00');
        dateEl.textContent = date.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long' 
        });
      } else {
        dateEl.textContent = dateStr;
      }
      headerContent.appendChild(dateEl);
    }
    
    header.appendChild(headerContent);
    container.appendChild(header);
    
    // Create main content section
    const main = frameDoc.createElement('div');
    main.className = 'newsletter-main';
    
    const content = frameDoc.createElement('div');
    content.className = 'newsletter-content';
    
    // Move existing content to structured sections
    const sections = ['Summary', 'Description', 'Content Preview'];
    const existingContent = Array.from(body.children).filter(el => !el.id || el.id !== 'website-preview-injected');
    
    existingContent.forEach(el => {
      if (el.tagName === 'H1') return; // Skip title, we handled it
      
      const section = frameDoc.createElement('div');
      section.className = 'newsletter-section';
      
      // If it's a heading, make it a section header
      if (['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(el.tagName)) {
        const sectionTitle = frameDoc.createElement('h3');
        sectionTitle.textContent = el.textContent || 'Content';
        section.appendChild(sectionTitle);
      } else {
        // Regular content
        const clonedEl = el.cloneNode(true);
        section.appendChild(clonedEl);
      }
      
      content.appendChild(section);
    });
    
    main.appendChild(content);
    container.appendChild(main);
    
    // Replace body content with our structured version
    body.innerHTML = '';
    body.appendChild(container);
  }
  
  // Initial injection
  setTimeout(injectWebsitePreview, 2000);
  
  // Re-inject when DOM changes (new preview loaded)
  const observer = new MutationObserver(() => {
    setTimeout(injectWebsitePreview, 1000);
  });
  
  observer.observe(document.body, { 
    childList: true, 
    subtree: true 
  });
  
  console.log('Website preview injection setup complete');
});