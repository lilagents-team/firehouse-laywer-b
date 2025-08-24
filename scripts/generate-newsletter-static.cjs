#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');

// Helper function to convert date to PDF filename format
function dateToPdfFilename(dateString) {
  const date = new Date(dateString);
  const month = date.toLocaleDateString('en-US', { month: 'long' });
  const year = date.getFullYear();
  return `/Newsletters/${month}${year}FINAL.pdf`;
}

// Helper function to find actual PDF file that exists
async function findPdfFile(newsletter, availableFiles) {
  const pdfDir = path.join(process.cwd(), 'client/public/Newsletters');
  
  // Try original filename first if it exists
  if (newsletter.original_filename) {
    try {
      await fs.access(path.join(pdfDir, newsletter.original_filename));
      console.log(`Found original filename: ${newsletter.original_filename}`);
      return `/Newsletters/${newsletter.original_filename}`;
    } catch {
      // Original filename doesn't exist, continue
    }
  }
  
  // Try intelligent slug-based matching with regex
  if (newsletter.slug && availableFiles.length > 0) {
    const slugBase = newsletter.slug.replace(/-extracted.*$/, '').replace(/\.md$/, '');
    console.log(`Finding PDF for slug: ${newsletter.slug}, base: ${slugBase}`);
    
    const patterns = [
      // Exact match
      new RegExp(`^${slugBase}\\.pdf$`, 'i'),
      // With FINAL suffix
      new RegExp(`^${slugBase}FINAL\\.pdf$`, 'i'),
      // Month/Year patterns from slug
      new RegExp(`^${slugBase.replace(/FINAL.*$/, '')}.*FINAL\\.pdf$`, 'i'),
      // Flexible matching
      new RegExp(`^${slugBase.replace(/FINAL.*$/, '')}.*\\.pdf$`, 'i'),
      // Handle cases like "MarchApril2019"
      new RegExp(`^${slugBase.replace(/[0-9]{4}.*$/, '')}[0-9]{4}.*\\.pdf$`, 'i')
    ];
    
    for (const pattern of patterns) {
      const matchingFile = availableFiles.find(file => pattern.test(file));
      if (matchingFile) {
        try {
          await fs.access(path.join(pdfDir, matchingFile));
          console.log(`Found PDF by regex matching: ${matchingFile}`);
          return `/Newsletters/${matchingFile}`;
        } catch {
          continue;
        }
      }
    }
  }
  
  // Try standard MonthYearFINAL.pdf format as fallback (only if date exists)
  if (newsletter.date) {
    const standardFormat = dateToPdfFilename(newsletter.date);
    const standardPath = path.join(pdfDir, path.basename(standardFormat));
    
    try {
      await fs.access(standardPath);
      console.log(`Found fallback PDF: ${standardFormat}`);
      return standardFormat;
    } catch {
      // Date-based fallback failed, continue to null return
    }
  }
  
  console.log(`No PDF found for newsletter ${newsletter.slug}`);
  return null;
}

async function generateStaticNewsletters() {
  try {
    console.log('🚀 Starting static newsletter generation...');
    
    const dataDir = path.join(process.cwd(), 'content/newsletters/data');
    const outputDir = path.join(process.cwd(), 'client/public/api/newsletters');
    const pdfDir = path.join(process.cwd(), 'client/public/Newsletters');
    
    // Create output directory
    await fs.mkdir(outputDir, { recursive: true });
    await fs.mkdir(path.join(outputDir, 'v'), { recursive: true });
    
    // Get available PDF files
    let availableFiles = [];
    try {
      availableFiles = await fs.readdir(pdfDir);
      availableFiles = availableFiles.filter(file => file.toLowerCase().endsWith('.pdf'));
      console.log(`📁 Found ${availableFiles.length} PDF files`);
    } catch {
      console.warn('⚠️  Could not read PDF directory');
    }
    
    // Read all JSON files
    const jsonFiles = (await fs.readdir(dataDir)).filter(file => file.endsWith('.json'));
    console.log(`📄 Processing ${jsonFiles.length} newsletter files...`);
    
    const newsletters = [];
    
    for (const file of jsonFiles) {
      try {
        const filePath = path.join(dataDir, file);
        let content = await fs.readFile(filePath, 'utf-8');
        
        // Handle JSON wrapped in markdown code blocks
        if (content.startsWith('```json')) {
          const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/);
          if (jsonMatch) {
            content = jsonMatch[1];
          }
        }
        
        const newsletter = JSON.parse(content);
        
        // Check for data quality issues
        let dataCorruption = newsletter.corruption_detected || false;
        let corruptionNotes = newsletter.corruption_notes || '';
        
        // Detect missing essential data
        const missingFields = [];
        if (!newsletter.date || newsletter.date.includes('xx') || newsletter.date === '') missingFields.push('date');
        if (!newsletter.summary) missingFields.push('summary');
        if (!newsletter.title) missingFields.push('title');
        
        if (missingFields.length > 0) {
          dataCorruption = true;
          const missingFieldsText = missingFields.join(', ');
          corruptionNotes = corruptionNotes 
            ? `${corruptionNotes}. Missing essential fields: ${missingFieldsText}`
            : `Missing essential fields: ${missingFieldsText}. This newsletter may have incomplete data extraction.`;
        }
        
        // Normalize the newsletter format
        const normalizedNewsletter = {
          volume: newsletter.volume,
          edition: newsletter.edition,
          title: Array.isArray(newsletter.title) ? newsletter.title.join(', ') : newsletter.title,
          date: newsletter.date,
          summary: Array.isArray(newsletter.summary) ? newsletter.summary.join(' ') : newsletter.summary,
          keywords: Array.isArray(newsletter.keywords) ? newsletter.keywords : [],
          topics: Array.isArray(newsletter.topics) ? newsletter.topics : [],
          compressed_content: Array.isArray(newsletter.compressed_content) 
            ? newsletter.compressed_content.join(' ') 
            : newsletter.compressed_content || '',
          search_text: newsletter.search_text || newsletter.title.toLowerCase(),
          corruption_detected: dataCorruption,
          corruption_notes: corruptionNotes,
          original_filename: newsletter.original_filename || null,
          slug: (newsletter.slug || file.replace('.json', '')).replace('.md', ''),
          file_size_kb: newsletter.file_size_kb || 0
        };
        
        // Find PDF file
        const pdfUrl = await findPdfFile(normalizedNewsletter, availableFiles);
        normalizedNewsletter.pdf_url = pdfUrl;
        
        if (normalizedNewsletter.volume && normalizedNewsletter.edition && normalizedNewsletter.title) {
          newsletters.push(normalizedNewsletter);
          
          // Write individual newsletter files
          const individualPath = path.join(outputDir, 'v', `${normalizedNewsletter.volume}`, `${normalizedNewsletter.edition}.json`);
          await fs.mkdir(path.dirname(individualPath), { recursive: true });
          await fs.writeFile(individualPath, JSON.stringify(normalizedNewsletter, null, 2));
          
          // Write by slug
          if (normalizedNewsletter.slug) {
            const slugPath = path.join(outputDir, `${normalizedNewsletter.slug}.json`);
            await fs.writeFile(slugPath, JSON.stringify(normalizedNewsletter, null, 2));
          }
        }
      } catch (fileError) {
        console.error(`❌ Error processing ${file}:`, fileError.message);
      }
    }
    
    // Sort by date (newest first)
    newsletters.sort((a, b) => {
      if (!a.date && !b.date) return 0;
      if (!a.date) return 1;
      if (!b.date) return -1;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
    
    // Generate main index
    const index = {
      newsletters,
      total_count: newsletters.length,
      last_updated: new Date().toISOString(),
      cache_version: "2.0-static"
    };
    
    const indexPath = path.join(outputDir, 'index.json');
    await fs.writeFile(indexPath, JSON.stringify(index, null, 2));
    
    console.log(`✅ Generated static files for ${newsletters.length} newsletters`);
    console.log(`📊 Index file: ${indexPath}`);
    console.log(`🔗 Individual files in: ${outputDir}/v/`);
    
  } catch (error) {
    console.error('❌ Error generating static newsletters:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  generateStaticNewsletters();
}

module.exports = { generateStaticNewsletters };