// CSS-only preview styling - no DOM manipulation to avoid conflicts
console.log('🎨 Loading CSS-only newsletter preview styling...');

// Create and inject CSS styles only - no DOM manipulation
const style = document.createElement('style');
style.id = 'newsletter-css-only-styles';
style.textContent = `
  /* Target preview divs that contain newsletter content */
  div:has([class*="preview"]),
  div[class*="preview"],
  main > div > div:last-child,
  article,
  section {
    background-color: #1a1a1a !important;
    color: #ffffff !important;
    font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif !important;
  }
  
  /* More aggressive targeting - any div containing newsletter text that's not a form */
  div:not(:has(input)):not(:has(textarea)):not(:has(select)):not(:has(button)) {
    background-color: transparent !important;
  }
  
  /* Specifically target divs with newsletter content */
  div:not(:has(input)):not(:has(textarea)):not(:has(select)):not(:has(button)):matches([textcontent*="Legislative Bills"], [textcontent*="Volume"], [textcontent*="Edition"], [textcontent*="Summary"]) {
    background-color: #1a1a1a !important;
    color: #ffffff !important;
  }
  
  /* Universal preview styling for any element containing newsletter text */
  * {
    /* Only apply to elements that seem to be preview content */
  }
  
  /* Try targeting by text content using CSS */
  [data-newsletter-styled] {
    background-color: #1a1a1a !important;
    color: #ffffff !important;
    font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif !important;
    padding: 0 !important;
    margin: 0 !important;
  }
  
  [data-newsletter-styled] h1,
  [data-newsletter-styled] h2:first-child {
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
  
  [data-newsletter-styled] h2,
  [data-newsletter-styled] h3,
  [data-newsletter-styled] h4,
  [data-newsletter-styled] h5,
  [data-newsletter-styled] h6 {
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
  
  [data-newsletter-styled] p,
  [data-newsletter-styled] div:not([class*="button"]),
  [data-newsletter-styled] span {
    color: #f3f4f6 !important;
    line-height: 1.6 !important;
    padding: 0.3rem 1rem !important;
    margin-bottom: 0.8rem !important;
    background-color: transparent !important;
  }
  
  [data-newsletter-styled] > div {
    background-color: #2a2a2a !important;
    min-height: 60vh !important;
    padding: 0 !important;
  }
`;

document.head.appendChild(style);

// Very minimal JS - just add data attributes, no DOM manipulation
function markPreviewElements() {
  const allDivs = document.querySelectorAll('div');
  
  allDivs.forEach((div) => {
    const text = div.textContent;
    if (text && (
      text.includes('2021 Legislative Bills') ||
      text.includes('Legislative Bills') ||
      text.includes('Volume') ||
      text.includes('Edition') ||
      text.includes('Summary') ||
      text.includes('Publication Month')
    ) && !div.querySelector('input, textarea, select, button')) {
      
      // Only add data attribute - no DOM manipulation
      if (!div.hasAttribute('data-newsletter-styled')) {
        console.log('📝 Marking preview element (no DOM changes)');
        div.setAttribute('data-newsletter-styled', 'true');
      }
    }
  });
}

// Run with minimal frequency to avoid conflicts
setTimeout(markPreviewElements, 2000);
setInterval(markPreviewElements, 5000); // Much slower to avoid conflicts

console.log('🎨 CSS-only preview styling loaded');