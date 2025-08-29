// Enhanced newsletter preview using actual front-end component structure
console.log('🎨 Loading enhanced newsletter preview with front-end components...');

// Import Tailwind CSS and fonts if not already available
function loadStyles() {
  // Check if Tailwind is available, if not inject it
  if (!document.querySelector('link[href*="tailwindcss"]')) {
    const tailwindLink = document.createElement('link');
    tailwindLink.rel = 'stylesheet';
    tailwindLink.href = 'https://cdn.tailwindcss.com';
    document.head.appendChild(tailwindLink);
  }

  // Load Google Fonts for Bebas Neue and Montserrat
  if (!document.querySelector('link[href*="Bebas+Neue"]')) {
    const fontLink = document.createElement('link');
    fontLink.rel = 'stylesheet';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Montserrat:wght@300;400;500;600;700;800;900&display=swap';
    document.head.appendChild(fontLink);
  }

  // Inject custom CSS variables and utilities
  const customStyles = document.createElement('style');
  customStyles.textContent = `
    :root {
      --urban-dark: hsl(0, 0%, 10%);
      --urban-gray: hsl(0, 0%, 18%);
      --urban-medium: hsl(0, 0%, 23%);
      --urban-light: hsl(0, 0%, 29%);
      --muted-red: hsl(0, 100%, 27%);
      --neon-orange: hsl(0, 82%, 55%);
      --near-black: hsl(0, 0%, 5%);
    }
    
    /* Urban theme utilities */
    .bg-urban-dark { background-color: var(--urban-dark); }
    .bg-urban-gray { background-color: var(--urban-gray); }
    .bg-urban-medium { background-color: var(--urban-medium); }
    .bg-urban-light { background-color: var(--urban-light); }
    .bg-neon-orange { background-color: var(--neon-orange); }
    .text-neon-orange { color: var(--neon-orange); }
    .border-neon-orange { border-color: var(--neon-orange); }
    
    .font-bebas { font-family: 'Bebas Neue', Arial, sans-serif; }
    .font-montserrat { font-family: 'Montserrat', sans-serif; }
    
    .text-shadow-gritty { text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8); }
    .urban-shadow-lg { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.1); }
    .urban-concrete {
      background-image: radial-gradient(circle at 1px 1px, rgba(255,255,255,0.02) 1px, transparent 0);
      background-size: 20px 20px;
    }
    .urban-grid {
      background-image: 
        linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
      background-size: 40px 40px;
    }
    .distressed-border {
      border: 2px solid var(--neon-orange);
      position: relative;
    }

    /* Badge component styles */
    .badge {
      display: inline-flex;
      align-items: center;
      border-radius: 9999px;
      border: 1px solid;
      padding: 0.125rem 0.625rem;
      font-size: 0.75rem;
      font-weight: 600;
      transition: all 0.2s;
      cursor: pointer;
    }
    .badge-default {
      border: transparent;
      background-color: var(--neon-orange);
      color: black;
    }
    .badge-default:hover {
      background-color: hsl(0, 84%, 60%);
      color: white;
    }
    .badge-outline {
      color: white;
      border-color: var(--neon-orange);
    }
    .badge-outline:hover {
      background-color: var(--neon-orange);
      color: black;
    }
    .badge-blue {
      border-color: #60a5fa;
      color: #93c5fd;
    }
    .badge-blue:hover {
      background-color: #60a5fa;
      color: black;
    }
    .badge-purple {
      border-color: #a78bfa;
      color: #c4b5fd;
    }
    .badge-purple:hover {
      background-color: #a78bfa;
      color: black;
    }
    .badge-green {
      border-color: #4ade80;
      color: #86efac;
    }
    .badge-green:hover {
      background-color: #4ade80;
      color: black;
    }
    .badge-orange {
      border-color: #fb923c;
      color: #fdba74;
    }
    .badge-orange:hover {
      background-color: #fb923c;
      color: black;
    }
  `;
  document.head.appendChild(customStyles);
}

function createEnhancedPreview(container, formData) {
  console.log('🏗️ Creating enhanced preview with form data:', formData);

  // Clear existing content
  container.innerHTML = '';

  // Create main structure mimicking newsletter-detail.tsx
  const mainDiv = document.createElement('div');
  mainDiv.className = 'bg-urban-gray urban-concrete min-h-screen';

  // Header section
  const headerSection = document.createElement('div');
  headerSection.className = 'bg-urban-dark py-16 urban-grid';
  
  const headerContainer = document.createElement('div');
  headerContainer.className = 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8';
  
  const headerContent = document.createElement('div');
  headerContent.className = 'flex items-center mb-4';
  
  const headerInfo = document.createElement('div');
  
  // Volume/Edition info
  const volumeInfo = document.createElement('p');
  volumeInfo.className = 'text-neon-orange text-sm font-montserrat uppercase tracking-wide';
  volumeInfo.textContent = `Volume ${formData.volume || 'X'}, Edition ${formData.edition || 'X'}`;
  
  // Title
  const title = document.createElement('h1');
  title.className = 'text-4xl lg:text-6xl font-bebas font-bold text-white mb-2 tracking-wider text-shadow-gritty';
  title.textContent = formData.title || 'Newsletter Title';
  
  // Date
  const dateP = document.createElement('p');
  dateP.className = 'text-xl text-gray-200 font-montserrat';
  dateP.textContent = formatDate(formData.date);
  
  headerInfo.appendChild(volumeInfo);
  headerInfo.appendChild(title);
  headerContent.appendChild(headerInfo);
  headerContainer.appendChild(headerContent);
  headerContainer.appendChild(dateP);
  headerSection.appendChild(headerContainer);

  // Content section
  const contentSection = document.createElement('div');
  contentSection.className = 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-urban-gray urban-concrete min-h-screen';
  
  // Main grid layout
  const mainGrid = document.createElement('div');
  mainGrid.className = 'lg:grid lg:grid-cols-3 lg:gap-12';
  
  // Left column - main content
  const leftColumn = document.createElement('div');
  leftColumn.className = 'lg:col-span-2';
  
  const contentDiv = document.createElement('div');
  contentDiv.className = 'mb-8';
  
  // Content header
  const contentHeader = document.createElement('div');
  contentHeader.className = 'flex items-start justify-between mb-6';
  
  const contentHeaderLeft = document.createElement('div');
  
  const contentTitle = document.createElement('h2');
  contentTitle.className = 'text-2xl lg:text-3xl font-bebas font-bold text-white mb-4 tracking-wider text-shadow-gritty';
  contentTitle.textContent = 'NEWSLETTER CONTENT';
  
  // Topics badges
  const topicsDiv = document.createElement('div');
  topicsDiv.className = 'flex flex-wrap gap-2 mb-4';
  
  if (formData.topics && Array.isArray(formData.topics)) {
    formData.topics.forEach(topic => {
      const badge = document.createElement('span');
      badge.className = 'badge badge-default';
      badge.textContent = topic;
      topicsDiv.appendChild(badge);
    });
  }
  
  contentHeaderLeft.appendChild(contentTitle);
  contentHeaderLeft.appendChild(topicsDiv);
  contentHeader.appendChild(contentHeaderLeft);
  
  // Summary section
  const summaryDiv = document.createElement('div');
  summaryDiv.className = 'mb-8';
  
  const summaryTitle = document.createElement('h3');
  summaryTitle.className = 'text-xl font-bebas font-bold text-white mb-4 tracking-wider text-shadow-gritty';
  summaryTitle.textContent = 'SUMMARY';
  
  const summaryP = document.createElement('p');
  summaryP.className = 'text-gray-100 mb-6 leading-relaxed font-montserrat';
  summaryP.textContent = formData.summary || 'Newsletter summary will appear here...';
  
  summaryDiv.appendChild(summaryTitle);
  summaryDiv.appendChild(summaryP);
  
  contentDiv.appendChild(contentHeader);
  contentDiv.appendChild(summaryDiv);
  leftColumn.appendChild(contentDiv);
  
  // Right column - sidebar
  const rightColumn = document.createElement('div');
  rightColumn.className = 'mt-12 lg:mt-0 space-y-8';
  
  // Keywords section
  if (formData.keywords && formData.keywords.length > 0) {
    const keywordsSection = createSidebarSection('KEYWORDS', formData.keywords, 'badge-outline');
    rightColumn.appendChild(keywordsSection);
  }
  
  // Legal Cases section
  if (formData.legal_cases && formData.legal_cases.length > 0) {
    const casesSection = createSidebarSection('LEGAL CASES', formData.legal_cases, 'badge-blue');
    rightColumn.appendChild(casesSection);
  }
  
  // Legal Statutes section
  if (formData.legal_statutes && formData.legal_statutes.length > 0) {
    const statutesSection = createSidebarSection('LEGAL STATUTES', formData.legal_statutes, 'badge-purple');
    rightColumn.appendChild(statutesSection);
  }
  
  // Categories section
  if (formData.categories && formData.categories.length > 0) {
    const categoriesSection = createSidebarSection('CATEGORIES', formData.categories, 'badge-green');
    rightColumn.appendChild(categoriesSection);
  }
  
  // Tags section
  if (formData.tags && formData.tags.length > 0) {
    const tagsSection = createSidebarSection('TAGS', formData.tags, 'badge-orange');
    rightColumn.appendChild(tagsSection);
  }
  
  mainGrid.appendChild(leftColumn);
  mainGrid.appendChild(rightColumn);
  contentSection.appendChild(mainGrid);
  
  mainDiv.appendChild(headerSection);
  mainDiv.appendChild(contentSection);
  container.appendChild(mainDiv);
}

function createSidebarSection(title, items, badgeClass) {
  const section = document.createElement('div');
  section.className = 'bg-urban-medium p-6 rounded-lg border border-neon-orange distressed-border urban-shadow-lg';
  
  const sectionTitle = document.createElement('h3');
  sectionTitle.className = 'text-xl font-bebas font-bold text-white mb-4 tracking-wider text-shadow-gritty';
  sectionTitle.textContent = title;
  
  const badgesDiv = document.createElement('div');
  badgesDiv.className = 'flex flex-wrap gap-2';
  
  items.forEach(item => {
    const badge = document.createElement('span');
    badge.className = `badge ${badgeClass}`;
    badge.textContent = item;
    badgesDiv.appendChild(badge);
  });
  
  section.appendChild(sectionTitle);
  section.appendChild(badgesDiv);
  return section;
}

function formatDate(dateString) {
  if (!dateString) return 'Date not available';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  } catch (e) {
    return dateString;
  }
}

function extractFormData() {
  const formData = {};
  
  // Extract form field values
  const titleField = document.querySelector('input[name="title"], textarea[name="title"]');
  if (titleField) formData.title = titleField.value;
  
  const volumeField = document.querySelector('input[name="volume"], select[name="volume"]');
  if (volumeField) formData.volume = volumeField.value;
  
  const editionField = document.querySelector('input[name="edition"], select[name="edition"]');
  if (editionField) formData.edition = editionField.value;
  
  const dateField = document.querySelector('input[name="date"], select[name="date"]');
  if (dateField) formData.date = dateField.value;
  
  const summaryField = document.querySelector('textarea[name="summary"]');
  if (summaryField) formData.summary = summaryField.value;
  
  // Extract list fields
  const keywordsFields = document.querySelectorAll('input[name^="keywords"]');
  formData.keywords = Array.from(keywordsFields).map(field => field.value).filter(v => v.trim());
  
  const topicsSelects = document.querySelectorAll('select[name^="topics"] option:checked');
  formData.topics = Array.from(topicsSelects).map(option => option.value).filter(v => v.trim());
  
  const casesFields = document.querySelectorAll('input[name^="legal_cases"]');
  formData.legal_cases = Array.from(casesFields).map(field => field.value).filter(v => v.trim());
  
  const statutesFields = document.querySelectorAll('input[name^="legal_statutes"]');
  formData.legal_statutes = Array.from(statutesFields).map(field => field.value).filter(v => v.trim());
  
  const categoriesFields = document.querySelectorAll('input[name^="categories"]');
  formData.categories = Array.from(categoriesFields).map(field => field.value).filter(v => v.trim());
  
  const tagsFields = document.querySelectorAll('input[name^="tags"]');
  formData.tags = Array.from(tagsFields).map(field => field.value).filter(v => v.trim());
  
  return formData;
}

function applyEnhancedStyling() {
  console.log('=== APPLYING ENHANCED NEWSLETTER PREVIEW ===');
  
  // Load required styles first
  loadStyles();
  
  const allDivs = document.querySelectorAll('div');
  let styledCount = 0;
  
  allDivs.forEach((div, index) => {
    const rect = div.getBoundingClientRect();
    const text = div.textContent?.trim() || '';
    const hasInputs = div.querySelector('input, textarea, select, button') !== null;
    const hasLabels = div.querySelector('label') !== null;
    const hasHints = text.includes('Usually corresponds to year') || 
                     text.includes('Issue number for the year') ||
                     text.includes('hint:') ||
                     text.includes('Select the month') ||
                     text.includes('Upload the newsletter');
    
    // Use the exact same logic that worked before, just add hint exclusion
    const isRightSide = rect.left > window.innerWidth / 2;
    const hasRelevantText = text.includes('Analysis of PERC Cases') || 
                           text.includes('Volume') || 
                           text.includes('Edition') || 
                           text.includes('Summary') ||
                           text.includes('Publication Month');
    
    if (isRightSide && hasRelevantText && !hasInputs && !hasHints && rect.width > 200) {
      console.log(`🎯 Applying enhanced styling to right panel element ${index}`);
      console.log('Element text preview:', text.substring(0, 200));
      
      if (!div.hasAttribute('data-enhanced-preview-styled')) {
        div.setAttribute('data-enhanced-preview-styled', 'true');
        
        // Extract form data and create enhanced preview
        const formData = extractFormData();
        createEnhancedPreview(div, formData);
        
        styledCount++;
      }
    }
  });
  
  console.log(`✅ Applied enhanced styling to ${styledCount} elements`);
}

// Initialize enhanced preview
setTimeout(() => {
  loadStyles();
  setTimeout(applyEnhancedStyling, 1000);
}, 2000);

// Apply after delays to catch dynamically loaded content
setTimeout(applyEnhancedStyling, 5000);
setTimeout(applyEnhancedStyling, 8000);

// Apply on DOM changes
const observer = new MutationObserver(() => {
  setTimeout(applyEnhancedStyling, 1000);
});

observer.observe(document.body, { 
  childList: true, 
  subtree: true
});

console.log('🎨 Enhanced newsletter preview loaded');