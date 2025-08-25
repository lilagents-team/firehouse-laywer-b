import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import fs from "fs/promises";
import path from "path";

const contactFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  organization: z.string().optional(),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

const newsletterSubscriptionSchema = z.object({
  email: z.string().email("Valid email is required"),
});

const newsletterSearchSchema = z.object({
  q: z.string().min(1, "Query is required"),
  page: z.string().optional().default("1"),
  limit: z.string().optional().default("10"),
});

interface CompressedNewsletter {
  volume: number;
  edition: number;
  title: string;
  date: string;
  summary: string;
  keywords: string[];
  topics: string[];
  compressed_content: string;
  search_text: string;
  corruption_detected: boolean;
  corruption_notes: string;
  pdf_url?: string;
  slug?: string;
  original_filename?: string;
}

// Helper function to convert date to PDF filename format
function dateToPdfFilename(dateString: string): string {
  const date = new Date(dateString);
  const month = date.toLocaleDateString('en-US', { month: 'long' });
  const year = date.getFullYear();
  return `/Newsletters/${month}${year}FINAL.pdf`;
}

// Helper function to find actual PDF file that exists
async function findPdfFile(newsletter: CompressedNewsletter): Promise<string | null> {
  const basePath = path.join(process.cwd(), 'client/public/Newsletters');
  
  // Get list of all available PDF files for intelligent matching
  let availableFiles: string[] = [];
  try {
    availableFiles = await fs.readdir(basePath);
    availableFiles = availableFiles.filter(file => file.toLowerCase().endsWith('.pdf'));
  } catch {
    availableFiles = [];
  }
  
  // Try original filename first (most accurate)
  if (newsletter.original_filename) {
    const originalPath = path.join(basePath, newsletter.original_filename);
    
    try {
      await fs.access(originalPath);
      console.log(`Found original filename: ${newsletter.original_filename}`);
      return `/Newsletters/${newsletter.original_filename}`;
    } catch {
      console.log(`Original filename ${newsletter.original_filename} not found`);
      // Original filename doesn't exist, continue to other formats
    }
  }
  
  // Try intelligent slug-based matching with regex
  if (newsletter.slug && availableFiles.length > 0) {
    // Extract base name from slug (remove -extracted, .md etc)
    const slugBase = newsletter.slug.replace(/-extracted.*$/, '').replace(/\.md$/, '');
    console.log(`Finding PDF for slug: ${newsletter.slug}, base: ${slugBase}`);
    
    // Create regex patterns for matching
    const patterns = [
      // Exact match
      new RegExp(`^${slugBase}\\.pdf$`, 'i'),
      // With FINAL suffix
      new RegExp(`^${slugBase}FINAL\\.pdf$`, 'i'),
      // Month/Year patterns from slug (e.g., August2024FINAL-extracted -> August2024FINAL.pdf)
      new RegExp(`^${slugBase.replace(/FINAL.*$/, '')}.*FINAL\\.pdf$`, 'i'),
      // Flexible matching for common patterns
      new RegExp(`^${slugBase.replace(/FINAL.*$/, '')}.*\\.pdf$`, 'i'),
      // Handle cases like "MarchApril2019" -> "MarchApril2019.pdf"
      new RegExp(`^${slugBase.replace(/[0-9]{4}.*$/, '')}[0-9]{4}.*\\.pdf$`, 'i')
    ];
    
    for (const pattern of patterns) {
      const matchingFile = availableFiles.find(file => pattern.test(file));
      if (matchingFile) {
        try {
          await fs.access(path.join(basePath, matchingFile));
          console.log(`Found PDF by regex matching: ${matchingFile} (pattern: ${pattern.source})`);
          return `/Newsletters/${matchingFile}`;
        } catch {
          // File access failed, continue to next pattern
          continue;
        }
      }
    }
  }
  
  // Try v*n* format (for older newsletters)
  if (newsletter.slug) {
    const legacyFilename = `${newsletter.slug}.pdf`;
    const legacyPath = path.join(basePath, legacyFilename);
    
    try {
      await fs.access(legacyPath);
      return `/Newsletters/${legacyFilename}`;
    } catch {
      // v*n* format doesn't exist, continue to standard format
    }
  }
  
  // Try date-based matching with regex if we have a date
  if (newsletter.date && availableFiles.length > 0) {
    try {
      const date = new Date(newsletter.date);
      const month = date.toLocaleDateString('en-US', { month: 'long' });
      const monthShort = date.toLocaleDateString('en-US', { month: 'short' });
      const year = date.getFullYear();
      
      // Create regex patterns for date-based matching
      const dateRegexPatterns = [
        // MonthYearFINAL.pdf (e.g., August2024FINAL.pdf)
        new RegExp(`^${month}${year}FINAL\\.pdf$`, 'i'),
        // MonthYear.pdf (e.g., August2024.pdf)
        new RegExp(`^${month}${year}\\.pdf$`, 'i'),
        // Short month versions (AugustYearFINAL.pdf)
        new RegExp(`^${monthShort}${year}FINAL\\.pdf$`, 'i'),
        new RegExp(`^${monthShort}${year}\\.pdf$`, 'i'),
        // With any suffix/prefix patterns
        new RegExp(`^.*${month}${year}.*\\.pdf$`, 'i'),
        new RegExp(`^.*${monthShort}${year}.*\\.pdf$`, 'i'),
        // Flexible year matching for 2-digit years
        new RegExp(`^${month}${year.toString().slice(-2)}.*\\.pdf$`, 'i')
      ];
      
      for (const pattern of dateRegexPatterns) {
        const matchingFile = availableFiles.find(file => pattern.test(file));
        if (matchingFile) {
          try {
            await fs.access(path.join(basePath, matchingFile));
            console.log(`Found PDF by date regex matching: ${matchingFile} (pattern: ${pattern.source})`);
            return `/Newsletters/${matchingFile}`;
          } catch {
            // File access failed, continue to next pattern
            continue;
          }
        }
      }
    } catch {
      // Date parsing failed, continue
    }
  }
  
  // Try standard MonthYearFINAL.pdf format as fallback
  const standardFormat = dateToPdfFilename(newsletter.date);
  const standardPath = path.join(basePath, path.basename(standardFormat));
  console.log(`Trying fallback: ${standardFormat} for date: ${newsletter.date}`);
  
  try {
    await fs.access(standardPath);
    console.log(`Found fallback PDF: ${standardFormat}`);
    return standardFormat;
  } catch {
    // No PDF file found - don't guess, return null
    console.log(`No PDF found for newsletter ${newsletter.slug}, returning null instead of guessing`);
    return null;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Contact form submission
  app.post("/api/contact", async (req, res) => {
    try {
      const data = contactFormSchema.parse(req.body);
      
      // TODO: Implement email sending logic using nodemailer or similar
      // For now, we'll just log the contact form submission
      console.log("Contact form submission:", data);
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 500));
      
      res.json({ 
        success: true, 
        message: "Your message has been sent successfully. We'll get back to you within 24 hours." 
      });
    } catch (error) {
      console.error("Contact form error:", error);
      res.status(400).json({ 
        success: false, 
        message: "There was an error sending your message. Please try again." 
      });
    }
  });

  // Note: /api/Newsletter routes (capital N) are handled by middleware that rewrites the URL to /api/newsletters
  // This is done at the app level to avoid conflicts with static file serving

  // Newsletter subscription
  app.post("/api/newsletter/subscribe", async (req, res) => {
    try {
      const data = newsletterSubscriptionSchema.parse(req.body);
      
      // TODO: Implement newsletter subscription logic
      // This could integrate with email marketing services like Mailchimp, ConvertKit, etc.
      console.log("Newsletter subscription:", data);
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 500));
      
      res.json({ 
        success: true, 
        message: "Successfully subscribed to the newsletter!" 
      });
    } catch (error) {
      console.error("Newsletter subscription error:", error);
      res.status(400).json({ 
        success: false, 
        message: "There was an error subscribing to the newsletter. Please try again." 
      });
    }
  });

  // Helper function to extract keywords from newsletter content
  function extractKeywords(content: string): string[] {
    const keywords: string[] = [];
    
    // Common legal terms and concepts in fire department law
    const legalTerms = [
      'Public Records Act', 'PRA', 'OPMA', 'Open Public Meetings Act',
      'FLSA', 'Fair Labor Standards Act', 'employment', 'investigation',
      'privacy', 'disclosure', 'administrative leave', 'misconduct',
      'collective bargaining', 'union', 'arbitration', 'grievance',
      'discrimination', 'harassment', 'due process', 'personnel files',
      'disciplinary action', 'termination', 'suspension', 'training',
      'certification', 'liability', 'negligence', 'workers compensation',
      'LEOFF', 'pension', 'retirement', 'disability', 'medical leave'
    ];
    
    // Find legal terms mentioned in content
    const contentLower = content.toLowerCase();
    legalTerms.forEach(term => {
      if (contentLower.includes(term.toLowerCase())) {
        keywords.push(term);
      }
    });
    
    // Extract case names (pattern: word v. word)
    const caseMatches = content.match(/\w+\s+v\.\s+\w+[^,.]*/g);
    if (caseMatches) {
      caseMatches.forEach(caseName => {
        keywords.push(caseName.trim());
      });
    }
    
    // Extract RCW references
    const rcwMatches = content.match(/RCW\s+[\d.]+/g);
    if (rcwMatches) {
      rcwMatches.forEach(rcw => {
        keywords.push(rcw);
      });
    }
    
    return [...new Set(keywords)].slice(0, 10); // Dedupe and limit
  }

  // Helper function to extract topics from newsletter content
  function extractTopics(content: string, title: string): string[] {
    const topics: string[] = [];
    
    // Topic mapping based on content
    const topicKeywords = {
      'Public Records': ['public records', 'pra', 'disclosure', 'transparency'],
      'Employment Law': ['employment', 'personnel', 'discipline', 'termination', 'hiring'],
      'Open Government': ['opma', 'meetings', 'transparency', 'public access'],
      'Labor Relations': ['union', 'collective bargaining', 'arbitration', 'grievance'],
      'Privacy Rights': ['privacy', 'confidential', 'personal information'],
      'Administrative Law': ['administrative', 'procedure', 'notice', 'hearing'],
      'Constitutional Law': ['constitutional', 'due process', 'first amendment', 'fourth amendment'],
      'Workers Compensation': ['workers compensation', 'injury', 'disability', 'medical'],
      'Training Requirements': ['training', 'certification', 'education', 'requirements'],
      'Legal Compliance': ['compliance', 'regulation', 'law', 'statute']
    };
    
    const contentLower = (content + ' ' + title).toLowerCase();
    
    Object.entries(topicKeywords).forEach(([topic, keywords]) => {
      if (keywords.some(keyword => contentLower.includes(keyword))) {
        topics.push(topic);
      }
    });
    
    return topics.length > 0 ? topics : ['Legal Updates'];
  }

  // Helper function to parse newsletter filename for volume/edition/date
  function parseNewsletterFilename(filename: string) {
    // Parse filename like "v13n04apr2015" or "v09n07jul2009"
    const match = filename.match(/^v(\d+)n(\d+)(\w+)(\d{4})$/);
    if (match) {
      const [, volume, edition, monthStr, year] = match;
      
      // Convert month string to number
      const monthMap: { [key: string]: string } = {
        'jan': '01', 'feb': '02', 'mar': '03', 'apr': '04',
        'may': '05', 'jun': '06', 'jul': '07', 'aug': '08', 
        'sep': '09', 'oct': '10', 'nov': '11', 'dec': '12'
      };
      
      const month = monthMap[monthStr.toLowerCase()] || '01';
      const date = `${year}-${month}-01`;
      
      return {
        volume: parseInt(volume),
        edition: parseInt(edition),
        date,
        slug: filename
      };
    }
    return null;
  }

  // Helper function to generate newsletter index from individual JSON files
  async function generateNewsletterIndex(): Promise<void> {
    try {
      const dataDir = path.join(process.cwd(), 'content/newsletters/data');
      const cacheDir = path.join(process.cwd(), 'content/newsletters/cache');
      
      // Ensure cache directory exists
      await fs.mkdir(cacheDir, { recursive: true });
      
      // Read all JSON files from data directory
      const files = await fs.readdir(dataDir);
      const jsonFiles = files.filter(file => file.endsWith('.json'));
      
      const newsletters: CompressedNewsletter[] = [];
      
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
          
          let newsletter;
          try {
            newsletter = JSON.parse(content);
          } catch (parseError) {
            // Handle corrupted JSON files by creating a basic fallback entry
            console.log(`❌ JSON parse error in ${file}: ${parseError.message}`);
            const filename = file.replace('.json', '').replace('.md', '');
            newsletter = {
              title: `Corrupted Newsletter Data (${filename})`,
              date: null,
              summary: "This newsletter file contains corrupted data that cannot be fully parsed. The original PDF may still be available for download.",
              keywords: [],
              topics: ["Corrupted Data"],
              compressed_content: `Error parsing newsletter data from ${file}: ${parseError.message}`,
              search_text: filename,
              corruption_detected: true,
              corruption_notes: `JSON parsing failed: ${parseError.message}. This file contains malformed data that prevents normal processing.`,
              volume: null,
              edition: null
            };
          }
          
          // Extract volume and edition from filename if not present in JSON
          let volume = newsletter.volume;
          let edition = newsletter.edition;
          
          if (!volume || !edition) {
            const filename = file.replace('.json', '').replace('.md', '');
            const volumeEditionMatch = filename.match(/v(\d+)n(\d+)/);
            if (volumeEditionMatch) {
              volume = volume || parseInt(volumeEditionMatch[1]);
              edition = edition || parseInt(volumeEditionMatch[2]);
            }
          }
          
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
          
          // Normalize the newsletter format to match our interface
          const normalizedNewsletter: CompressedNewsletter = {
            volume: volume,
            edition: edition,
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
          
          // Include all newsletters that have a title (volume/edition can be null for some)
          if (normalizedNewsletter.title) {
            newsletters.push(normalizedNewsletter);
          }
        } catch (fileError) {
          console.error(`Error processing newsletter file ${file}:`, fileError);
        }
      }
      
      // Sort by date (newest first), handling null dates
      newsletters.sort((a, b) => {
        // Handle null dates - put them at the end
        if (!a.date && !b.date) return 0;
        if (!a.date) return 1; // a goes after b
        if (!b.date) return -1; // b goes after a
        
        // Both have dates, sort normally (newest first)
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
      
      // Generate index
      const index = {
        newsletters,
        total_count: newsletters.length,
        last_updated: new Date().toISOString(),
        cache_version: "2.0-dynamic",
        generated_from: "individual_json_files"
      };
      
      // Write cache file
      const cachePath = path.join(cacheDir, 'newsletter-index.json');
      await fs.writeFile(cachePath, JSON.stringify(index, null, 2));
      
      console.log(`Generated newsletter index with ${newsletters.length} newsletters`);
    } catch (error) {
      console.error('Failed to generate newsletter index:', error);
    }
  }

  // Helper function to load newsletters from static build files
  async function loadNewsletters(): Promise<CompressedNewsletter[]> {
    try {
      // Read from static build files generated by generate-newsletter-static.cjs
      const staticIndexPath = path.join(process.cwd(), 'client/public/api/newsletters/index.json');
      
      try {
        const staticContent = await fs.readFile(staticIndexPath, 'utf-8');
        const staticIndex = JSON.parse(staticContent);
        return staticIndex.newsletters || [];
      } catch (staticError) {
        console.warn('Static newsletter index not found, falling back to cache generation');
        
        // Fallback: generate index if static files don't exist
        const cacheDir = path.join(process.cwd(), 'content/newsletters/cache');
        const cachePath = path.join(cacheDir, 'newsletter-index.json');
        
        // Generate index
        await generateNewsletterIndex();
        
        // Load from cache
        const cacheContent = await fs.readFile(cachePath, 'utf-8');
        const index = JSON.parse(cacheContent);
        
        return index.newsletters || [];
      }
    } catch (error) {
      console.error('Failed to load newsletters:', error);
      // Final fallback to existing newsletter index
      try {
        const fallbackPath = path.join(process.cwd(), 'content/newsletters-compressed/newsletter-index.json');
        const fallbackContent = await fs.readFile(fallbackPath, 'utf-8');
        const fallbackIndex = JSON.parse(fallbackContent);
        return fallbackIndex.newsletters || [];
      } catch (fallbackError) {
        console.error('All fallbacks failed:', fallbackError);
        return [];
      }
    }
  }

  // Newsletter API Routes

  // Newsletter index endpoint - serve from static files (single source of truth)
  app.get("/api/newsletters/index", async (req, res) => {
    try {
      const staticIndexPath = path.join(process.cwd(), 'client/public/api/newsletters/index.json');
      const staticData = await fs.readFile(staticIndexPath, 'utf-8');
      const data = JSON.parse(staticData);
      res.json(data);
    } catch (error) {
      console.error('Failed to load static newsletter index:', error);
      res.status(500).json({ 
        error: "Newsletter index not found. Run: node scripts/generate-newsletter-static.cjs",
        hint: "The development server now uses static files as the single source of truth."
      });
    }
  });

  // Newsletter index endpoint with .json extension - serve from static files
  app.get("/api/newsletters/index.json", async (req, res) => {
    try {
      const staticIndexPath = path.join(process.cwd(), 'client/public/api/newsletters/index.json');
      const staticData = await fs.readFile(staticIndexPath, 'utf-8');
      const data = JSON.parse(staticData);
      res.json(data);
    } catch (error) {
      console.error('Failed to load static newsletter index:', error);
      res.status(500).json({ 
        error: "Newsletter index not found. Run: node scripts/generate-newsletter-static.cjs",
        hint: "The development server now uses static files as the single source of truth."
      });
    }
  });

  // Newsletter search endpoint
  app.get("/api/newsletters/search", async (req, res) => {
    try {
      console.log('Search query params:', req.query);
      const query = req.query.q as string;
      const page = parseInt(req.query.page as string) || 1;
      const limit = Math.min(parseInt(req.query.limit as string) || 10, 50);
      
      if (!query || query.length < 1) {
        return res.status(400).json({ error: "Query parameter 'q' is required" });
      }
      const newsletters = await loadNewsletters();
      
      // Search across multiple fields including date
      const searchTerm = query.toLowerCase();
      const matchingNewsletters = newsletters.filter(newsletter => {
        // Standard field searches
        const titleMatch = (newsletter.title || "").toLowerCase().includes(searchTerm);
        const summaryMatch = (newsletter.summary || "").toLowerCase().includes(searchTerm);
        const keywordMatch = (newsletter.keywords || []).some(keyword => keyword.toLowerCase().includes(searchTerm));
        const topicMatch = (newsletter.topics || []).some(topic => topic.toLowerCase().includes(searchTerm));
        const searchTextMatch = (newsletter.search_text || "").toLowerCase().includes(searchTerm);
        
        // Date-based searches
        const dateString = newsletter.date || "";
        let dateMatch = false;
        
        if (dateString) {
          // Parse YYYY-MM-DD format manually to avoid timezone issues
          const dateParts = dateString.match(/^(\d{4})-(\d{2})-(\d{2})$/);
          if (dateParts) {
            const year = dateParts[1];
            const monthNum = dateParts[2];
            const dayNum = dateParts[3];
            
            // Create date object using local time to avoid timezone shifts
            const dateObj = new Date(parseInt(year), parseInt(monthNum) - 1, parseInt(dayNum));
            const month = dateObj.toLocaleDateString('en-US', { month: 'long' }).toLowerCase();
            const monthShort = dateObj.toLocaleDateString('en-US', { month: 'short' }).toLowerCase();
            
            // Check if search term matches year, full month name, short month name, or month number
            dateMatch = year.includes(searchTerm) ||
                       month.includes(searchTerm) ||
                       monthShort.includes(searchTerm) ||
                       monthNum.includes(searchTerm) ||
                       dateString.toLowerCase().includes(searchTerm);
          } else {
            // Fallback for other date formats
            dateMatch = dateString.toLowerCase().includes(searchTerm);
          }
        }
        
        return titleMatch || summaryMatch || keywordMatch || topicMatch || searchTextMatch || dateMatch;
      });

      // Add relevance scoring
      const scoredResults = matchingNewsletters.map(newsletter => {
        let score = 0;
        const titleMatch = (newsletter.title || "").toLowerCase().includes(searchTerm);
        const keywordMatch = (newsletter.keywords || []).some(k => k.toLowerCase().includes(searchTerm));
        const topicMatch = (newsletter.topics || []).some(t => t.toLowerCase().includes(searchTerm));
        const summaryMatch = (newsletter.summary || "").toLowerCase().includes(searchTerm);
        
        // Date match scoring
        let dateMatch = false;
        const dateString = newsletter.date || "";
        
        if (dateString) {
          // Parse YYYY-MM-DD format manually to avoid timezone issues
          const dateParts = dateString.match(/^(\d{4})-(\d{2})-(\d{2})$/);
          if (dateParts) {
            const year = dateParts[1];
            const monthNum = dateParts[2];
            const dayNum = dateParts[3];
            
            // Create date object using local time to avoid timezone shifts
            const dateObj = new Date(parseInt(year), parseInt(monthNum) - 1, parseInt(dayNum));
            const month = dateObj.toLocaleDateString('en-US', { month: 'long' }).toLowerCase();
            const monthShort = dateObj.toLocaleDateString('en-US', { month: 'short' }).toLowerCase();
            
            dateMatch = year.includes(searchTerm) ||
                       month.includes(searchTerm) ||
                       monthShort.includes(searchTerm) ||
                       monthNum.includes(searchTerm) ||
                       dateString.toLowerCase().includes(searchTerm);
          } else {
            dateMatch = dateString.toLowerCase().includes(searchTerm);
          }
        }
        
        if (titleMatch) score += 3;
        if (keywordMatch) score += 2;
        if (topicMatch) score += 2;
        if (dateMatch) score += 2; // Date matches are important
        if (summaryMatch) score += 1;
        
        return { ...newsletter, relevance_score: score / 10 }; // Updated max score
      }).sort((a, b) => b.relevance_score - a.relevance_score);

      // Pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedResults = scoredResults.slice(startIndex, endIndex);

      res.json({
        results: paginatedResults,
        pagination: {
          page,
          limit,
          total: scoredResults.length,
          total_pages: Math.ceil(scoredResults.length / limit)
        },
        search_time_ms: Date.now() % 100 // Mock search time
      });
    } catch (error) {
      console.error("Newsletter search error:", error);
      res.status(400).json({ 
        error: "Search failed",
        message: error instanceof z.ZodError ? error.errors[0].message : "Invalid search parameters" 
      });
    }
  });

  // Get specific newsletter by volume/edition using /v/ prefix - serve from static files (MUST BE BEFORE :slug route!)
  app.get("/api/newsletters/v/:volume/:edition", async (req, res) => {
    const { volume, edition } = req.params;
    const staticFilePath = path.resolve(process.cwd(), 'client', 'public', 'api', 'newsletters', 'v', volume, `${edition}.json`);
    
    try {
      const data = await fs.readFile(staticFilePath, 'utf8');
      res.setHeader('Content-Type', 'application/json');
      res.send(data);
    } catch (error) {
      res.status(404).json({ error: "Newsletter not found" });
    }
  });

  // Get specific newsletter by year/month (all 2-digit and 4-digit numbers treated as years)
  app.get("/api/newsletters/:year/:month", async (req, res) => {
    console.log("📅 YEAR/MONTH route hit with params:", req.params);
    try {
      let year = parseInt(req.params.year);
      const month = parseInt(req.params.month);
      
      if (isNaN(year) || isNaN(month) || month < 1 || month > 12) {
        return res.status(400).json({ error: "Invalid year or month" });
      }

      // Convert 2-digit years to 4-digit (25 -> 2025, 97 -> 1997)
      if (year < 100) {
        year = year > 50 ? 1900 + year : 2000 + year;
      }

      const newsletters = await loadNewsletters();
      
      // Find newsletter by matching year and month from date field
      const newsletter = newsletters.find(n => {
        const dateString = n.date || "";
        const dateParts = dateString.match(/^(\d{4})-(\d{2})-(\d{2})$/);
        if (dateParts) {
          const newsletterYear = parseInt(dateParts[1]);
          const newsletterMonth = parseInt(dateParts[2]);
          return newsletterYear === year && newsletterMonth === month;
        }
        return false;
      });
      
      if (!newsletter) {
        return res.status(404).json({ error: "Newsletter not found" });
      }

      // Find the actual PDF file that exists
      const actualPdfUrl = await findPdfFile(newsletter);
      const updatedNewsletter = { ...newsletter, pdf_url: actualPdfUrl || undefined };

      res.json(updatedNewsletter);
    } catch (error) {
      console.error("Newsletter fetch error:", error);
      res.status(500).json({ 
        error: "Failed to fetch newsletter",
        message: "Unable to retrieve newsletter data" 
      });
    }
  });


  // Get specific newsletter by slug or handle PDF filename (exclude index routes)
  app.get("/api/newsletters/:slug", async (req, res) => {
    console.log("🚨🚨🚨 HIT SLUG ROUTE with slug:", req.params.slug);
    try {
      const slug = req.params.slug;
      
      
      // Check if this is actually a number (year) that should be handled by year/month route
      if (/^\d+$/.test(slug)) {
        // This is likely part of a year/month URL pattern, let it pass through
        return res.status(404).json({ error: "Newsletter not found" });
      }
      
      const newsletters = await loadNewsletters();
      
      // First try to find newsletter by slug
      let newsletter = newsletters.find(n => 
        n.slug === slug || 
        n.slug === `${slug}.md` || 
        n.slug.replace('.md', '') === slug
      );
      
      if (newsletter) {
        // Found newsletter by slug, process normally
        
        // Find the actual PDF file that exists
        const actualPdfUrl = await findPdfFile(newsletter);
        newsletter = { ...newsletter, pdf_url: actualPdfUrl || undefined };

        // Try to load extracted content if available
        try {
          const extractedPath = path.join(process.cwd(), 'content/newsletters', `${slug}-extracted.md`);
          const extractedContent = await fs.readFile(extractedPath, 'utf-8');
          
          // Parse frontmatter and content
          const frontmatterMatch = extractedContent.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
          if (frontmatterMatch) {
            const [, frontmatterYaml, content] = frontmatterMatch;
            // Add extracted content to newsletter object
            newsletter = {
              ...newsletter,
              full_content: content,
              extracted_metadata: frontmatterYaml
            };
          }
        } catch (extractedError) {
          // Extracted content not available, continue with compressed data
          console.log(`No extracted content found for ${slug}`);
        }

        res.json(newsletter);
      } else {
        // Not found as newsletter slug, check if it's a PDF filename request
        const pdfFilename = slug.endsWith('.pdf') ? slug : `${slug}.pdf`;
        const filePath = path.join(process.cwd(), 'client/public/Newsletters', pdfFilename);
        
        try {
          await fs.access(filePath);
          // PDF file exists, redirect to it
          res.redirect(302, `/Newsletters/${pdfFilename}`);
          return;
        } catch {
          // Neither newsletter slug nor PDF filename found
          return res.status(404).json({ error: "Newsletter or PDF not found" });
        }
      }
    } catch (error) {
      console.error("Newsletter fetch error:", error);
      res.status(500).json({ 
        error: "Failed to fetch newsletter",
        message: "Unable to retrieve newsletter data" 
      });
    }
  });

  // Get extracted newsletter content by slug
  app.get("/api/newsletters/:slug/extracted", async (req, res) => {
    try {
      const slug = req.params.slug;
      
      // Try to load extracted content
      const extractedPath = path.join(process.cwd(), 'content/newsletters', `${slug}-extracted.md`);
      const extractedContent = await fs.readFile(extractedPath, 'utf-8');
      
      // Parse frontmatter and content
      const frontmatterMatch = extractedContent.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
      if (frontmatterMatch) {
        const [, frontmatterYaml, content] = frontmatterMatch;
        
        // Parse YAML frontmatter (simple parsing)
        const metadata: any = {};
        frontmatterYaml.split('\n').forEach(line => {
          const [key, ...valueParts] = line.split(':');
          if (key && valueParts.length > 0) {
            metadata[key.trim()] = valueParts.join(':').trim();
          }
        });
        
        res.json({
          slug,
          extracted_content: content,
          metadata,
          frontmatter: frontmatterYaml
        });
      } else {
        res.json({
          slug,
          extracted_content: extractedContent,
          metadata: {},
          frontmatter: ""
        });
      }
    } catch (error) {
      console.error("Extracted newsletter fetch error:", error);
      res.status(404).json({ 
        error: "Extracted newsletter not found",
        message: `No extracted content found for ${req.params.slug}` 
      });
    }
  });

  // Get specific newsletter by year/month (all 2-digit and 4-digit numbers treated as years)
  app.get("/api/newsletters/:year/:month", async (req, res) => {
    console.log("📅 YEAR/MONTH route hit with params:", req.params);
    try {
      let year = parseInt(req.params.year);
      const month = parseInt(req.params.month);
      
      if (isNaN(year) || isNaN(month) || month < 1 || month > 12) {
        return res.status(400).json({ error: "Invalid year or month" });
      }

      // Convert 2-digit years to 4-digit (25 -> 2025, 97 -> 1997)
      if (year < 100) {
        year = year > 50 ? 1900 + year : 2000 + year;
      }

      const newsletters = await loadNewsletters();
      
      // Find newsletter by matching year and month from date field
      const newsletter = newsletters.find(n => {
        const dateString = n.date || "";
        const dateParts = dateString.match(/^(\d{4})-(\d{2})-(\d{2})$/);
        if (dateParts) {
          const newsletterYear = parseInt(dateParts[1]);
          const newsletterMonth = parseInt(dateParts[2]);
          return newsletterYear === year && newsletterMonth === month;
        }
        return false;
      });
      
      if (!newsletter) {
        return res.status(404).json({ error: "Newsletter not found" });
      }

      // Find the actual PDF file that exists
      const actualPdfUrl = await findPdfFile(newsletter);
      const updatedNewsletter = { ...newsletter, pdf_url: actualPdfUrl || undefined };

      res.json(updatedNewsletter);
    } catch (error) {
      console.error("Newsletter fetch error:", error);
      res.status(500).json({ 
        error: "Failed to fetch newsletter",
        message: "Unable to retrieve newsletter data" 
      });
    }
  });

  // Direct PDF access by stub/filename
  app.get("/Newsletters/:filename", async (req, res) => {
    try {
      const filename = req.params.filename;
      const filePath = path.join(process.cwd(), 'client/public/Newsletters', filename);
      
      // Check if file exists directly
      try {
        await fs.access(filePath);
        // File exists, let static middleware handle it
        res.sendFile(filePath);
        return;
      } catch {
        // File doesn't exist, try to look up in newsletter index
        console.log(`Direct file ${filename} not found, checking newsletter index...`);
      }

      // Extract slug from filename (remove .pdf extension)
      const slug = filename.replace(/\.pdf$/, '');
      
      // Load newsletters and try to find by slug
      const newsletters = await loadNewsletters();
      const newsletter = newsletters.find(n => n.slug === slug);
      
      if (newsletter) {
        // Found newsletter, get the actual PDF file
        const actualPdfUrl = await findPdfFile(newsletter);
        if (!actualPdfUrl) {
          return res.status(404).json({ error: "PDF file not available for this newsletter" });
        }
        const actualFilename = path.basename(actualPdfUrl);
        const actualFilePath = path.join(process.cwd(), 'client/public/Newsletters', actualFilename);
        
        try {
          await fs.access(actualFilePath);
          res.sendFile(actualFilePath);
          return;
        } catch {
          console.log(`Actual PDF file ${actualFilename} not found either`);
        }
      }
      
      // Still not found, return 404
      res.status(404).json({ error: "PDF file not found" });
    } catch (error) {
      console.error("PDF fetch error:", error);
      res.status(500).json({ 
        error: "Failed to fetch PDF",
        message: "Unable to retrieve PDF file" 
      });
    }
  });

  // Admin endpoint: Migrate JSON data to CMS markdown files
  app.post("/api/admin/migrate-newsletters", async (req, res) => {
    try {
      console.log("🔄 Starting newsletter migration to CMS...");
      
      // Run the migration script directly
      const { migrateJsonToCms } = await import('../scripts/migrate-json-to-cms.cjs');
      await migrateJsonToCms();
      
      res.json({
        success: true,
        migrated: 0, // Will be logged in console
        skipped: 0,
        message: "Migration completed - check console for details"
      });
      
    } catch (error) {
      console.error("❌ Migration error:", error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown migration error'
      });
    }
  });

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  const httpServer = createServer(app);
  return httpServer;
}
