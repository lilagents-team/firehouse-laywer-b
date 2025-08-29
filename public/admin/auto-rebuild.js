// Auto-rebuild hook for Sveltia CMS
// Triggers build when content is saved

let isRebuilding = false;

function triggerRebuild(eventName) {
  if (isRebuilding) {
    console.log('Rebuild already in progress, skipping...');
    return;
  }
  
  isRebuilding = true;
  console.log(`Content ${eventName}, triggering rebuild...`);
  
  // Show notification immediately
  const notification = document.createElement('div');
  notification.id = 'rebuild-notification';
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #ff6b35;
    color: white;
    padding: 12px 24px;
    border-radius: 4px;
    z-index: 10000;
    font-family: system-ui;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    font-size: 14px;
    font-weight: 500;
  `;
  notification.textContent = 'Rebuilding content... Preview will update in a moment.';
  document.body.appendChild(notification);
  
  // Trigger rebuild by calling our build endpoint
  fetch('/api/rebuild', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      event: eventName,
      timestamp: new Date().toISOString()
    })
  })
  .then(response => response.json())
  .then(data => {
    console.log('Rebuild completed:', data);
    
    // Update notification
    if (notification && document.body.contains(notification)) {
      notification.style.background = '#10b981';
      notification.textContent = 'Content rebuilt! Preview updated.';
      
      // Remove notification after 2 seconds
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 2000);
    }
    
    isRebuilding = false;
  })
  .catch(error => {
    console.error('Rebuild error:', error);
    
    // Update notification with error
    if (notification && document.body.contains(notification)) {
      notification.style.background = '#ef4444';
      notification.textContent = 'Rebuild failed. Check console for details.';
      
      // Remove notification after 3 seconds
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 3000);
    }
    
    isRebuilding = false;
  });
}

// Set up rebuild triggers for Sveltia CMS
document.addEventListener('DOMContentLoaded', function() {
  console.log('Setting up Sveltia CMS auto-rebuild...');
  
  // Method 1: Listen for form submissions (most reliable)
  document.addEventListener('submit', function(event) {
    const form = event.target;
    if (form.closest('[data-slate-editor]') || form.querySelector('[name*="title"]')) {
      // This looks like a CMS save form
      setTimeout(() => triggerRebuild('saved'), 1000); // Delay to allow save to complete
    }
  });
  
  // Method 2: Listen for storage events (Sveltia may use localStorage)
  window.addEventListener('storage', function(event) {
    if (event.key && (event.key.includes('sveltia') || event.key.includes('cms'))) {
      setTimeout(() => triggerRebuild('updated'), 1000);
    }
  });
  
  // Method 3: Poll for changes in CMS content area
  let lastContentHash = '';
  setInterval(() => {
    const contentElements = document.querySelectorAll('[data-slate-editor], .cms-editor-visual');
    if (contentElements.length > 0) {
      const currentContent = Array.from(contentElements).map(el => el.textContent || '').join('');
      const currentHash = currentContent.length; // Simple hash
      
      if (lastContentHash && lastContentHash !== currentHash) {
        // Content changed, trigger rebuild after a delay
        setTimeout(() => triggerRebuild('modified'), 2000);
      }
      lastContentHash = currentHash;
    }
  }, 5000); // Check every 5 seconds
  
  console.log('Sveltia CMS auto-rebuild hooks installed');
});