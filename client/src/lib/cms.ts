import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

// For server build of rss.xml
import { promises as fs } from 'fs';
import path from 'path';

export interface PageContent {
  [key: string]: any;
  content?: string;
}

export interface AttorneyProfile {
  name: string;
  title: string;
  phone: string;
  email: string;
  bio: string;
  education?: string;
  experience?: string;
  bar_admissions?: string;
  photo?: string;
  order: number;
}

export interface PracticeArea {
  title: string;
  description: string;
  content: string;
  icon: string;
  order: number;
}

export interface NewsletterIssue {
  // Basic Information
  title: string;
  volume: number;
  edition: number;
  date: string;
  summary: string;
  
  // Searchable Metadata
  keywords: string[];
  topics: string[];
  
  // Legal References
  legal_cases?: string[];
  legal_statutes?: string[];
  
  // Content Analysis
  key_findings?: string[];
  recommendations?: string[];
  
  // Technical Details
  newsletter_pdf?: string; // File upload path
  source_pdf?: string; // Manual filename entry
  content: string;
  featured: boolean;
  metadata_quality: 'high' | 'medium' | 'low';
  slug?: string;
  
  // Computed/Legacy Fields (for backward compatibility)
  pdf_url?: string;
  description?: string; // Will map to summary
}

export interface SiteSettings {
  site_title: string;
  site_description: string;
  firm_name: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  office_hours: string;
  social: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
  };
}

// Cache for content to avoid repeated file reads
const contentCache = new Map<string, any>();

async function fetchContent(contentPath: string, isServer: boolean = false): Promise<string> {
  const cacheKey = contentPath;
  
  if (contentCache.has(cacheKey)) {
    return contentCache.get(cacheKey);
  }

  try {
    if (isServer) {
      const filePath = path.join(process.cwd(), contentPath);
      const content = await fs.readFile(filePath, 'utf-8');
      contentCache.set(cacheKey, content);
      return content;
    } else {
      const response = await fetch(contentPath);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${contentPath}: ${response.status}`);
      }
      const content = await response.text();
      contentCache.set(cacheKey, content);
      return content;
    }
  } catch (error) {
    console.error(`Error fetching content from ${contentPath}:`, error);
    return '';
  }
}

async function processMarkdown(content: string): Promise<string> {
  const result = await remark().use(html).process(content);
  return result.toString();
}

export async function getPageContent(pageName: string): Promise<PageContent> {
  try {
    const content = await fetchContent(`/content/pages/${pageName}.md`);
    if (!content) return {};
    
    const { data, content: markdownContent } = matter(content);
    
    // Process markdown content if it exists
    const processedContent = markdownContent ? await processMarkdown(markdownContent) : '';
    
    return {
      ...data,
      content: processedContent
    };
  } catch (error) {
    console.error(`Error loading page content for ${pageName}:`, error);
    return {};
  }
}

export async function getAttorneyProfiles(): Promise<AttorneyProfile[]> {
  try {
    // In a real implementation, you'd fetch a directory listing or have a known list
    const attorneyFiles = ['eric-quinn', 'joseph-quinn'];
    const attorneys: AttorneyProfile[] = [];
    
    for (const fileName of attorneyFiles) {
      try {
        const content = await fetchContent(`/content/attorneys/${fileName}.md`);
        if (content) {
          const { data } = matter(content);
          attorneys.push(data as AttorneyProfile);
        }
      } catch (error) {
        console.error(`Error loading attorney ${fileName}:`, error);
      }
    }
    
    return attorneys.sort((a, b) => (a.order || 0) - (b.order || 0));
  } catch (error) {
    console.error('Error loading attorney profiles:', error);
    return [];
  }
}

export async function getPracticeAreas(): Promise<PracticeArea[]> {
  try {
    const practiceAreaFiles = [
      'mergers-consolidations',
      'public-records',
      'personnel-matters',
      'hipaa-compliance',
      'financial-management',
      'contract-review'
    ];
    const practiceAreas: PracticeArea[] = [];
    
    for (const fileName of practiceAreaFiles) {
      try {
        const content = await fetchContent(`/content/practice-areas/${fileName}.md`);
        if (content) {
          const { data, content: markdownContent } = matter(content);
          const processedContent = markdownContent ? await processMarkdown(markdownContent) : '';
          
          practiceAreas.push({
            ...data,
            content: processedContent
          } as PracticeArea);
        }
      } catch (error) {
        console.error(`Error loading practice area ${fileName}:`, error);
      }
    }
    
    return practiceAreas.sort((a, b) => (a.order || 0) - (b.order || 0));
  } catch (error) {
    console.error('Error loading practice areas:', error);
    return [];
  }
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  try {
    const content = await fetchContent('/content/settings/general.md');
    if (!content) return null;
    
    const { data } = matter(content);
    return data as SiteSettings;
  } catch (error) {
    console.error('Error loading site settings:', error);
    return null;
  }
}

export async function getNewsletterIssues(isServer: boolean = false): Promise<NewsletterIssue[]> {
  try {
    let files: string[];
    if (isServer) {
      const contentDir = path.join(process.cwd(), 'content/newsletters');
      files = await fs.readdir(contentDir);
    } else {
      // Client-side: Use an API endpoint or known files
      files = ['issue-2025-01', 'issue-2025-02']; // Update with actual files or fetch from /api/newsletters
    }
    
    const newsletters: NewsletterIssue[] = await Promise.all(
      files
        .filter(file => file.endsWith('.md'))
        .map(async file => {
          const fileName = file.replace(/\.md$/, '');
          const content = await fetchContent(`/content/newsletters/${fileName}.md`, isServer);
          if (content) {
            const { data, content: markdownContent } = matter(content);
            const processedContent = markdownContent ? await processMarkdown(markdownContent) : '';
            return {
              // Basic Information
              title: data.title || 'Untitled',
              volume: data.volume || 0,
              edition: data.edition || 0,
              date: data.date || new Date().toISOString(),
              summary: data.summary || data.description || '',
              
              // Searchable Metadata
              keywords: Array.isArray(data.keywords) ? data.keywords : (data.keywords ? [data.keywords] : []),
              topics: Array.isArray(data.topics) ? data.topics : (data.topics ? [data.topics] : []),
              
              // Legal References
              legal_cases: Array.isArray(data.legal_cases) ? data.legal_cases : undefined,
              legal_statutes: Array.isArray(data.legal_statutes) ? data.legal_statutes : undefined,
              
              // Content Analysis  
              key_findings: Array.isArray(data.key_findings) ? data.key_findings : undefined,
              recommendations: Array.isArray(data.recommendations) ? data.recommendations : undefined,
              
              // Technical Details
              newsletter_pdf: data.newsletter_pdf || undefined,
              source_pdf: data.source_pdf || undefined,
              content: processedContent,
              featured: data.featured || false,
              metadata_quality: data.metadata_quality || 'medium',
              slug: data.slug || fileName,
              
              // Computed/Legacy Fields - prioritize uploaded file, then manual entry
              pdf_url: data.newsletter_pdf || (data.source_pdf ? `/Newsletters/${data.source_pdf}` : data.pdf_url),
              description: data.summary || data.description || ''
            };
          }
          return null;
        })
    );
    
    return newsletters
      .filter((item): item is NewsletterIssue => item !== null)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error('Error loading newsletters:', error);
    return [];
  }
}

// Utility function to clear cache (useful for development)
export function clearContentCache() {
  contentCache.clear();
}