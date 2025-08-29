// Basic newsletter preview styling - matches production colors and tone without layout changes
console.log('🎨 Loading basic newsletter preview styling...');

// Add visible indicator that script loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log('🎯 DOM loaded, script is active');
});

// Debug function to show current state
function debugCurrentState() {
  console.log('=== DEBUG STATE ===');
  console.log('Screen width:', window.innerWidth);
  console.log('Right side threshold:', window.innerWidth / 2);
  
  const allDivs = document.querySelectorAll('div');
  console.log(`Total divs: ${allDivs.length}`);
  
  let rightSideDivs = 0;
  allDivs.forEach((div, index) => {
    const rect = div.getBoundingClientRect();
    const isRightSide = rect.left > window.innerWidth / 2;
    if (isRightSide && rect.width > 100) {
      rightSideDivs++;
      const text = div.textContent?.trim()?.substring(0, 100) || '';
      console.log(`Right side div ${index}: "${text}"`);
    }
  });
  
  console.log(`Found ${rightSideDivs} right-side divs`);
}

function applyBasicStyling() {
  console.log('=== APPLYING BASIC NEWSLETTER STYLING ===');
  
  const allDivs = document.querySelectorAll('div');
  let styledCount = 0;
  
  allDivs.forEach((div, index) => {
    const rect = div.getBoundingClientRect();
    const text = div.textContent?.trim() || '';
    const hasInputs = div.querySelector('input, textarea, select, button') !== null;
    
    // Broader detection - any substantial content on right side that's not system messages
    const isRightSide = rect.left > window.innerWidth / 2;
    const hasRelevantText = text.includes('Analysis of PERC Cases') || 
                           text.includes('Volume') || 
                           text.includes('Edition') || 
                           text.includes('Summary') ||
                           text.includes('Publication Month') ||
                           text.includes('Newsletter') ||
                           text.includes('Legal') ||
                           (text.length > 100 && !text.includes('Draft backup') && !text.includes('Entry has been'));
    
    if (isRightSide && hasRelevantText && !hasInputs && rect.width > 200) {
      console.log(`🎯 Styling right panel element ${index}`);
      
      if (!div.hasAttribute('data-basic-styled')) {
        div.setAttribute('data-basic-styled', 'true');
        
        // Apply basic production colors and typography - NO layout changes
        div.style.backgroundColor = '#1a1a1a'; // --urban-dark
        div.style.color = '#f3f4f6'; // Light gray text
        div.style.fontFamily = 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';
        div.style.lineHeight = '1.6';
        
        // Style headings if they exist - keep original layout
        const headings = div.querySelectorAll('h1, h2, h3, h4, h5, h6, strong');
        headings.forEach(heading => {
          heading.style.color = '#ed2c2c'; // --neon-orange (red)
          heading.style.fontWeight = 'bold';
        });
        
        // Style all text elements - preserve original spacing and layout
        const textElements = div.querySelectorAll('p, div, span');
        textElements.forEach(el => {
          if (!el.querySelector('input, textarea, select, button')) {
            el.style.color = '#f3f4f6';
          }
        });
        
        styledCount++;
      }
    }
  });
  
  console.log(`✅ Applied basic styling to ${styledCount} elements`);
}

// Run debug first to see what we're working with
setTimeout(debugCurrentState, 1000);
setTimeout(debugCurrentState, 3000);

// Apply styling immediately
applyBasicStyling();

// Apply after delays to catch dynamically loaded content
setTimeout(applyBasicStyling, 2000);
setTimeout(applyBasicStyling, 5000);

// Apply on DOM changes
const observer = new MutationObserver(() => {
  setTimeout(applyBasicStyling, 500);
});

observer.observe(document.body, { 
  childList: true, 
  subtree: true
});

console.log('🎨 Basic preview styling loaded');