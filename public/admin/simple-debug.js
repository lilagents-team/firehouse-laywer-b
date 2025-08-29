// Simple debug to find the right preview panel
console.log('🔍 Simple debug starting...');

function simpleDebug() {
  console.log('=== SIMPLE DEBUG ===');
  
  // Log screen width for reference
  console.log('Screen width:', window.innerWidth);
  console.log('Right side threshold:', window.innerWidth / 2);
  
  // Find all divs and check their position + content
  const allDivs = document.querySelectorAll('div');
  console.log(`Total divs: ${allDivs.length}`);
  
  let rightPanelCandidates = [];
  
  allDivs.forEach((div, index) => {
    const rect = div.getBoundingClientRect();
    const text = div.textContent?.trim() || '';
    const hasInputs = div.querySelector('input, textarea, select, button') !== null;
    
    // Check if it's on the right side and has relevant content
    const isRightSide = rect.left > window.innerWidth / 2;
    const hasRelevantText = text.includes('2021 Legislative Bills') || 
                           text.includes('Volume') || 
                           text.includes('Edition') || 
                           text.includes('Summary');
    
    if (isRightSide && hasRelevantText && !hasInputs && rect.width > 200) {
      console.log(`🎯 RIGHT PANEL CANDIDATE ${index}:`, {
        element: div,
        position: { left: rect.left, top: rect.top, width: rect.width, height: rect.height },
        textPreview: text.substring(0, 150),
        classes: div.className,
        hasInputs: hasInputs,
        parent: div.parentElement?.tagName
      });
      
      rightPanelCandidates.push(div);
      
      // Apply bright styling for testing
      div.style.border = '3px solid lime';
      div.style.backgroundColor = '#ff00ff'; // Magenta for visibility
      div.style.color = '#ffffff';
      div.style.padding = '10px';
    }
  });
  
  console.log(`Found ${rightPanelCandidates.length} right panel candidates`);
  
  if (rightPanelCandidates.length === 0) {
    console.log('❌ No right panel candidates found');
    
    // Fallback: highlight ANY div with newsletter content
    allDivs.forEach((div, index) => {
      const text = div.textContent?.trim() || '';
      const hasInputs = div.querySelector('input, textarea, select, button') !== null;
      
      if ((text.includes('2021 Legislative Bills') || text.includes('Volume')) && !hasInputs) {
        console.log(`📝 ANY NEWSLETTER DIV ${index}:`, {
          element: div,
          position: div.getBoundingClientRect(),
          textPreview: text.substring(0, 100),
          classes: div.className
        });
        
        div.style.border = '2px solid orange';
        div.style.backgroundColor = '#0000ff'; // Blue for visibility
      }
    });
  }
}

// Run immediately
simpleDebug();

// Run after delays
setTimeout(simpleDebug, 3000);
setTimeout(simpleDebug, 6000);

// Run on clicks to refresh
document.addEventListener('click', () => {
  setTimeout(simpleDebug, 500);
});

console.log('🔍 Simple debug loaded');