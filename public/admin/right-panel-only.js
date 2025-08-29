// Target ONLY the right-side preview panel
console.log('🎯 Loading right-panel-only newsletter styling...');

function identifyRightPanel() {
  // Strategy: Find the main container, then target the right side
  const main = document.querySelector('main');
  if (!main) return;
  
  // Look for a two-column layout (edit form + preview)
  const mainChildren = Array.from(main.children);
  console.log(`Found ${mainChildren.length} main children`);
  
  // Try different approaches to find the right panel
  const possibleRightPanels = [
    // Last child of main (common layout pattern)
    main.lastElementChild,
    // Look for flex layout - second item
    ...main.querySelectorAll('div:last-child'),
    // Look for grid layout - second column
    ...main.querySelectorAll('div[style*="grid-column: 2"], div[style*="flex: 1"]:last-child'),
    // Look for elements containing preview text but not form inputs
    ...Array.from(document.querySelectorAll('div')).filter(div => {
      const text = div.textContent;
      return text && 
        (text.includes('2021 Legislative Bills') || text.includes('Volume') || text.includes('Edition') || text.includes('Summary')) &&
        !div.querySelector('input, textarea, select, button, label') &&
        div.getBoundingClientRect().left > window.innerWidth / 2; // Right side of screen
    })
  ];
  
  console.log(`Found ${possibleRightPanels.length} possible right panels`);
  
  // Test each candidate
  possibleRightPanels.forEach((panel, index) => {
    if (!panel) return;
    
    const rect = panel.getBoundingClientRect();
    const isRightSide = rect.left > window.innerWidth / 2;
    const hasContent = panel.textContent && panel.textContent.trim().length > 0;
    const hasNoInputs = !panel.querySelector('input, textarea, select, button');
    
    console.log(`Panel ${index}:`, {
      element: panel,
      isRightSide,
      hasContent,
      hasNoInputs,
      left: rect.left,
      width: rect.width,
      classes: panel.className,
      textPreview: panel.textContent?.substring(0, 100)
    });
    
    if (isRightSide && hasContent && hasNoInputs) {
      console.log(`🎯 Found right panel! Applying styling...`);
      applyNewsletterStyling(panel);
    }
  });
}

function applyNewsletterStyling(rightPanel) {
  // Mark as styled
  if (rightPanel.hasAttribute('data-right-panel-styled')) return;
  rightPanel.setAttribute('data-right-panel-styled', 'true');
  
  console.log('✨ Applying newsletter styling to right panel:', rightPanel);
  
  // Create a unique CSS rule just for this element
  const uniqueId = 'newsletter-preview-' + Date.now();
  rightPanel.id = uniqueId;
  
  const style = document.createElement('style');
  style.textContent = `
    /* Target ONLY the specific right panel by ID */
    #${uniqueId} {
      background-color: #1a1a1a !important;
      color: #ffffff !important;
      font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif !important;
      padding: 0 !important;
      margin: 0 !important;
      min-height: 70vh !important;
    }
    
    #${uniqueId} h1:first-of-type,
    #${uniqueId} h2:first-of-type {
      background-color: #111111 !important;
      color: #ffffff !important;
      font-size: 1.5rem !important;
      font-weight: bold !important;
      padding: 1.5rem 1rem !important;
      margin: 0 0 1rem 0 !important;
      border-bottom: 2px solid #ff6b35 !important;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.5) !important;
      letter-spacing: 0.02em !important;
      line-height: 1.2 !important;
    }
    
    #${uniqueId} h2:not(:first-of-type),
    #${uniqueId} h3,
    #${uniqueId} h4,
    #${uniqueId} h5,
    #${uniqueId} h6 {
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
    
    #${uniqueId} p,
    #${uniqueId} div:not([class*="button"]),
    #${uniqueId} span {
      color: #f3f4f6 !important;
      line-height: 1.6 !important;
      padding: 0.3rem 1rem !important;
      margin-bottom: 0.8rem !important;
      background-color: transparent !important;
    }
    
    #${uniqueId} > div,
    #${uniqueId} > * {
      background-color: #2a2a2a !important;
    }
    
    /* Override any conflicting styles */
    #${uniqueId} * {
      color: inherit !important;
    }
    
    #${uniqueId} h1,
    #${uniqueId} h2:first-of-type {
      color: #ffffff !important;
    }
    
    #${uniqueId} h2:not(:first-of-type),
    #${uniqueId} h3,
    #${uniqueId} h4,
    #${uniqueId} h5,
    #${uniqueId} h6 {
      color: #ff6b35 !important;
    }
  `;
  
  document.head.appendChild(style);
  
  // Add volume/edition info if available (minimal DOM manipulation)
  const volumeField = document.querySelector('input[name*="volume"], select[name*="volume"]');
  const editionField = document.querySelector('input[name*="edition"], select[name*="edition"]');
  
  if (volumeField && editionField && volumeField.value && editionField.value) {
    let volumeInfo = rightPanel.querySelector('.volume-edition-info');
    if (!volumeInfo) {
      volumeInfo = document.createElement('div');
      volumeInfo.className = 'volume-edition-info';
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
      rightPanel.insertBefore(volumeInfo, rightPanel.firstChild);
    }
    volumeInfo.textContent = `Volume ${volumeField.value}, Edition ${editionField.value}`;
  }
}

// Initial identification
setTimeout(identifyRightPanel, 2000);

// Re-identify periodically but less frequently
setInterval(identifyRightPanel, 5000);

// Watch for layout changes
const observer = new MutationObserver(() => {
  setTimeout(identifyRightPanel, 1000);
});

observer.observe(document.body, { 
  childList: true, 
  subtree: true
});

console.log('🎯 Right-panel-only styling loaded');