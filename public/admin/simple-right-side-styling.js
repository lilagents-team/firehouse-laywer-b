// Ultra-simple styling - just target right side of screen
console.log('🎨 Loading simple right-side styling...');

function applySimpleStyling() {
  console.log('=== APPLYING SIMPLE RIGHT-SIDE STYLING ===');
  
  const allDivs = document.querySelectorAll('div');
  let styledCount = 0;
  
  allDivs.forEach((div, index) => {
    const rect = div.getBoundingClientRect();
    const text = div.textContent?.trim() || '';
    
    // Very simple: right side + has some content + not tiny
    const isRightSide = rect.left > window.innerWidth / 2;
    const hasContent = text.length > 20;
    const isReasonableSize = rect.width > 100 && rect.height > 50;
    
    if (isRightSide && hasContent && isReasonableSize) {
      console.log(`🎯 Found right-side content div ${index}: "${text.substring(0, 100)}..."`);
      
      if (!div.hasAttribute('data-simple-styled')) {
        div.setAttribute('data-simple-styled', 'true');
        
        // Apply basic dark theme
        div.style.backgroundColor = '#1a1a1a !important';
        div.style.color = '#f3f4f6 !important';
        div.style.fontFamily = 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif !important';
        
        console.log(`✅ Styled div ${index}`);
        styledCount++;
      }
    }
  });
  
  console.log(`✅ Applied styling to ${styledCount} elements total`);
}

// Apply immediately and with delays
applySimpleStyling();
setTimeout(applySimpleStyling, 1000);
setTimeout(applySimpleStyling, 3000);
setTimeout(applySimpleStyling, 5000);

// Watch for changes
const observer = new MutationObserver(() => {
  setTimeout(applySimpleStyling, 200);
});

observer.observe(document.body, { 
  childList: true, 
  subtree: true
});

console.log('🎨 Simple right-side styling loaded');