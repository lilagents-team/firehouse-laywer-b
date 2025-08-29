// Final preview styling - using the successful selectors from debug
console.log('🎨 Loading final newsletter preview styling...');

function applyNewsletterStyling() {
  // Find all divs that contain newsletter content (same logic as debug script)
  const allDivs = document.querySelectorAll('div');
  
  allDivs.forEach((div) => {
    const text = div.textContent;
    if (text && (
      text.includes('2021 Legislative Bills') ||
      text.includes('Volume') ||
      text.includes('Edition') ||
      text.includes('Summary') ||
      text.includes('Publication Month') ||
      text.includes('Keywords') ||
      text.includes('Topics')
    ) && !div.querySelector('input, textarea, select')) {
      
      // This is a preview div - apply website styling
      if (!div.hasAttribute('data-newsletter-styled')) {
        console.log('🎯 Styling preview element:', div);
        
        div.setAttribute('data-newsletter-styled', 'true');
        
        // Apply base styling
        div.style.backgroundColor = '#1a1a1a';
        div.style.color = '#ffffff';
        div.style.fontFamily = 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';
        div.style.padding = '0';
        div.style.margin = '0';
        div.style.border = 'none';
        div.style.minHeight = '70vh';
        
        // Style all child elements
        const title = div.querySelector('h1, h2, [style*="font-size"], strong');
        if (title) {
          title.style.backgroundColor = '#111111';
          title.style.color = '#ffffff';
          title.style.fontSize = '1.8rem';
          title.style.fontWeight = 'bold';
          title.style.padding = '1.5rem 1rem';
          title.style.margin = '0 0 1rem 0';
          title.style.borderBottom = '2px solid #ff6b35';
          title.style.textShadow = '2px 2px 4px rgba(0,0,0,0.5)';
          title.style.letterSpacing = '0.02em';
          title.style.lineHeight = '1.2';
        }
        
        // Style all paragraphs and text content
        const textElements = div.querySelectorAll('p, div, span');
        textElements.forEach(el => {
          if (!el.querySelector('input, textarea, select, button')) {
            el.style.color = '#f3f4f6';
            el.style.lineHeight = '1.6';
            el.style.padding = '0.3rem 1rem';
            el.style.marginBottom = '0.8rem';
            el.style.backgroundColor = 'transparent';
          }
        });
        
        // Add section headers styling
        const headers = div.querySelectorAll('h2, h3, h4, h5, h6');
        headers.forEach(header => {
          header.style.color = '#ff6b35';
          header.style.fontSize = '1.1rem';
          header.style.fontWeight = 'bold';
          header.style.textTransform = 'uppercase';
          header.style.letterSpacing = '0.05em';
          header.style.borderBottom = '1px solid #ff6b35';
          header.style.padding = '0.8rem 1rem 0.3rem 1rem';
          header.style.margin = '1.5rem 0 0.8rem 0';
          header.style.backgroundColor = 'transparent';
        });
        
        // Create main content background
        const contentDiv = document.createElement('div');
        contentDiv.style.backgroundColor = '#2a2a2a';
        contentDiv.style.minHeight = '60vh';
        contentDiv.style.padding = '0';
        contentDiv.style.margin = '0';
        
        // Move all children into the content div
        while (div.firstChild) {
          contentDiv.appendChild(div.firstChild);
        }
        div.appendChild(contentDiv);
        
        // Try to add volume/edition info from form fields
        const volumeField = document.querySelector('input[name*="volume"], select[name*="volume"]');
        const editionField = document.querySelector('input[name*="edition"], select[name*="edition"]');
        
        if (volumeField && editionField && volumeField.value && editionField.value) {
          let volumeInfo = div.querySelector('.volume-edition-header');
          if (!volumeInfo) {
            volumeInfo = document.createElement('div');
            volumeInfo.className = 'volume-edition-header';
            volumeInfo.style.backgroundColor = '#111111';
            volumeInfo.style.color = '#ff6b35';
            volumeInfo.style.fontSize = '0.875rem';
            volumeInfo.style.fontWeight = '600';
            volumeInfo.style.textTransform = 'uppercase';
            volumeInfo.style.letterSpacing = '0.1em';
            volumeInfo.style.padding = '0.5rem 1rem';
            volumeInfo.style.margin = '0';
            volumeInfo.style.borderBottom = '2px solid #ff6b35';
            
            // Insert at the very top
            div.insertBefore(volumeInfo, div.firstChild);
          }
          volumeInfo.textContent = `Volume ${volumeField.value}, Edition ${editionField.value}`;
        }
      }
    }
  });
}

// Apply styling immediately when script loads
applyNewsletterStyling();

// Apply styling when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('🎨 DOM ready - applying newsletter styling...');
  applyNewsletterStyling();
  
  // Reapply styling periodically to catch dynamic changes
  setInterval(applyNewsletterStyling, 1000);
  
  // Watch for DOM changes
  const observer = new MutationObserver(() => {
    setTimeout(applyNewsletterStyling, 100);
  });
  
  observer.observe(document.body, { 
    childList: true, 
    subtree: true,
    attributes: true
  });
  
  console.log('🎨 Newsletter preview styling is active');
});

// Also apply immediately if DOM is already loaded
if (document.readyState !== 'loading') {
  setTimeout(applyNewsletterStyling, 500);
  setInterval(applyNewsletterStyling, 2000);
}

console.log('🎨 Final preview styling script loaded');