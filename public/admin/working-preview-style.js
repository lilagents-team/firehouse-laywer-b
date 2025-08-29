// Working preview styling - based on successful debug detection
console.log('🎨 Loading working newsletter preview styling...');

function applyNewsletterStyling() {
  console.log('=== APPLYING NEWSLETTER STYLING ===');
  
  const allDivs = document.querySelectorAll('div');
  let styledCount = 0;
  
  allDivs.forEach((div, index) => {
    const rect = div.getBoundingClientRect();
    const text = div.textContent?.trim() || '';
    const hasInputs = div.querySelector('input, textarea, select, button') !== null;
    
    // Same logic as debug script that worked
    const isRightSide = rect.left > window.innerWidth / 2;
    const hasRelevantText = text.includes('Analysis of PERC Cases') || 
                           text.includes('Volume') || 
                           text.includes('Edition') || 
                           text.includes('Summary') ||
                           text.includes('Publication Month');
    
    if (isRightSide && hasRelevantText && !hasInputs && rect.width > 200) {
      console.log(`🎯 Styling right panel element ${index}`);
      
      // Remove any debug styling first
      div.style.border = '';
      
      // Apply newsletter website styling
      if (!div.hasAttribute('data-newsletter-final-styled')) {
        div.setAttribute('data-newsletter-final-styled', 'true');
        
        // Base styling
        div.style.backgroundColor = '#1a1a1a';
        div.style.color = '#ffffff';
        div.style.fontFamily = 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';
        div.style.padding = '0';
        div.style.margin = '0';
        div.style.minHeight = '70vh';
        
        // Style child elements
        const title = div.querySelector('h1, h2, strong, [style*="font-weight"]');
        if (title) {
          title.style.backgroundColor = '#111111';
          title.style.color = '#ffffff';
          title.style.fontSize = '1.5rem';
          title.style.fontWeight = 'bold';
          title.style.padding = '1.5rem 1rem';
          title.style.margin = '0 0 1rem 0';
          title.style.borderBottom = '2px solid #ff6b35';
          title.style.textShadow = '2px 2px 4px rgba(0,0,0,0.5)';
          title.style.letterSpacing = '0.02em';
          title.style.lineHeight = '1.2';
        }
        
        // Style all text content
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
        
        // Style headers
        const headers = div.querySelectorAll('h2, h3, h4, h5, h6');
        headers.forEach(header => {
          if (header !== title) { // Don't double-style the main title
            header.style.color = '#ff6b35';
            header.style.fontSize = '1.1rem';
            header.style.fontWeight = 'bold';
            header.style.textTransform = 'uppercase';
            header.style.letterSpacing = '0.05em';
            header.style.borderBottom = '1px solid #ff6b35';
            header.style.padding = '0.8rem 1rem 0.3rem 1rem';
            header.style.margin = '1.5rem 0 0.8rem 0';
            header.style.backgroundColor = 'transparent';
          }
        });
        
        // Add volume/edition display
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
            
            div.insertBefore(volumeInfo, div.firstChild);
          }
          volumeInfo.textContent = `Volume ${volumeField.value}, Edition ${editionField.value}`;
        }
        
        styledCount++;
      }
    }
    
    // Fallback: also target any newsletter content anywhere (with blue background from debug)
    else if ((text.includes('Analysis of PERC Cases') || text.includes('Volume')) && !hasInputs) {
      console.log(`📝 Styling fallback newsletter element ${index}`);
      
      // Remove debug styling and apply newsletter styling
      div.style.border = '';
      div.style.backgroundColor = '#1a1a1a';
      div.style.color = '#ffffff';
      styledCount++;
    }
  });
  
  console.log(`✅ Applied styling to ${styledCount} elements`);
}

// Apply styling immediately
applyNewsletterStyling();

// Apply after delays to catch dynamically loaded content
setTimeout(applyNewsletterStyling, 2000);
setTimeout(applyNewsletterStyling, 5000);

// Apply on DOM changes
const observer = new MutationObserver(() => {
  setTimeout(applyNewsletterStyling, 500);
});

observer.observe(document.body, { 
  childList: true, 
  subtree: true
});

console.log('🎨 Working preview styling loaded');