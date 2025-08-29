// Debug script to find Sveltia CMS preview elements
console.log('🔍 Debug: Looking for Sveltia CMS preview elements...');

function debugPreviewElements() {
  console.log('=== SVELTIA CMS PREVIEW DEBUG ===');
  
  // Log all possible preview-related elements
  const selectors = [
    'main',
    'main > div',
    'main > div > div',
    '[data-testid*="preview"]',
    '[class*="preview"]',
    '.preview-pane',
    'div[role="main"]',
    'article',
    'section'
  ];
  
  selectors.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    console.log(`Selector "${selector}": found ${elements.length} elements`);
    elements.forEach((el, index) => {
      console.log(`  - Element ${index}:`, el);
      console.log(`    - Classes:`, el.className);
      console.log(`    - Data attributes:`, Object.keys(el.dataset));
      console.log(`    - Text content preview:`, el.textContent?.substring(0, 100));
    });
  });
  
  // Try to find the right panel by looking for specific text
  const allDivs = document.querySelectorAll('div');
  console.log(`Total divs found: ${allDivs.length}`);
  
  allDivs.forEach((div, index) => {
    const text = div.textContent;
    if (text && (
      text.includes('2021 Legislative Bills') ||
      text.includes('Volume') ||
      text.includes('Edition') ||
      text.includes('Summary')
    ) && !div.querySelector('input, textarea, select')) {
      console.log(`🎯 POTENTIAL PREVIEW DIV ${index}:`, div);
      console.log(`   Classes:`, div.className);
      console.log(`   Parent:`, div.parentElement);
      console.log(`   Text:`, text.substring(0, 200));
      
      // Try to style this element directly
      div.style.backgroundColor = '#ff0000'; // Red background for testing
      div.style.color = '#ffffff';
      div.style.border = '2px solid #00ff00'; // Green border for visibility
    }
  });
}

// Run debug immediately
debugPreviewElements();

// Run again after a delay
setTimeout(debugPreviewElements, 3000);
setTimeout(debugPreviewElements, 5000);

// Monitor for changes
const observer = new MutationObserver(() => {
  setTimeout(debugPreviewElements, 500);
});

observer.observe(document.body, { childList: true, subtree: true });

console.log('🔍 Debug script loaded - check console for preview element info');