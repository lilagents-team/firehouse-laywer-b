import { useState, useEffect } from "react";
import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, ExternalLink, ArrowLeft, AlertTriangle } from "lucide-react";

interface CompressedNewsletter {
  volume: number;
  edition: number;
  title: string;
  date: string;
  summary: string;
  description?: string;
  keywords: string[];
  topics: string[];
  legal_cases?: string[];
  legal_statutes?: string[];
  categories?: string[];
  tags?: string[];
  compressed_content: string;
  search_text: string;
  search_keywords?: string;
  corruption_detected: boolean;
  corruption_notes: string;
  pdf_url?: string;
  slug?: string;
  metadata_quality?: string;
  processed_date?: string;
  source_pdf?: string;
}

export default function NewsletterDetail() {
  const params = useParams<{ 
    slug?: string; 
    volume?: string; 
    edition?: string; 
    year?: string; 
    month?: string;
    filename?: string;
  }>();
  
  console.log("🎯 Newsletter component loaded with params:", params);
  const [newsletter, setNewsletter] = useState<CompressedNewsletter | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadNewsletter = async () => {
      let apiUrl: string;
      
      // Determine which route pattern is being used
      if (params.volume && params.edition) {
        // Volume/edition route: /newsletter/v/13/4
        apiUrl = import.meta.env.PROD ? `/api/newsletters/v/${params.volume}/${params.edition}.json` : `/api/newsletters/v/${params.volume}/${params.edition}`;
      } else if (params.year && params.month) {
        // Year/month route: /newsletter/2015/4
        apiUrl = import.meta.env.PROD ? `/api/newsletters/${params.year}/${params.month}.json` : `/api/newsletters/${params.year}/${params.month}`;
      } else if (params.slug) {
        // Slug route: /newsletter/v13n04apr2015
        apiUrl = import.meta.env.PROD ? `/api/newsletters/${params.slug}.json` : `/api/newsletters/${params.slug}`;
      } else if (params.filename) {
        // Filename route: /Newsletters/somefilename (without .pdf)
        apiUrl = import.meta.env.PROD ? `/api/newsletters/${params.filename}.json` : `/api/newsletters/${params.filename}`;
      } else {
        setError("Invalid newsletter parameters");
        setLoading(false);
        return;
      }

      try {
        console.log("🌐 Frontend calling API:", apiUrl);
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`Newsletter not found (${response.status})`);
        }
        
        const data = await response.json();
        console.log("📧 Frontend received:", data.corruption_detected, data.corruption_notes);
        setNewsletter(data);
      } catch (error) {
        console.error('Failed to load newsletter:', error);
        setError(error instanceof Error ? error.message : 'Failed to load newsletter');
      } finally {
        setLoading(false);
      }
    };

    loadNewsletter();
  }, [params.slug, params.volume, params.edition, params.year, params.month, params.filename]);

  if (loading) {
    return (
      <div className="min-h-screen bg-urban-gray urban-concrete flex items-center justify-center">
        <div className="text-white text-xl font-bebas tracking-wider">LOADING NEWSLETTER...</div>
      </div>
    );
  }

  if (error || !newsletter) {
    return (
      <div className="min-h-screen bg-urban-gray urban-concrete flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bebas font-bold text-white mb-4 tracking-wider">NEWSLETTER NOT FOUND</h1>
          <p className="text-gray-200 mb-6">{error}</p>
          <Button asChild className="bg-neon-orange text-white hover:bg-red-600">
            <Link to="/newsletter">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Newsletter Archive
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  // Format the date for display - parse manually to avoid timezone issues
  const formattedDate = (() => {
    if (!newsletter.date) return 'Date not available';
    
    const dateParts = newsletter.date.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (dateParts) {
      const year = parseInt(dateParts[1]);
      const month = parseInt(dateParts[2]) - 1; // Month is 0-indexed
      const day = parseInt(dateParts[3]);
      const dateObj = new Date(year, month, day);
      return dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long'
      });
    }
    return newsletter.date;
  })();

  return (
    <div>
      <div className="bg-urban-dark py-16 urban-grid">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-4">
            <Link 
              to="/newsletter" 
              className="text-neon-orange hover:text-red-400 transition-colors mr-4"
            >
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div>
              <p className="text-neon-orange text-sm font-montserrat uppercase tracking-wide">
                Volume {newsletter.volume}, Edition {newsletter.edition}
              </p>
              <h1 className="text-4xl lg:text-6xl font-bebas font-bold text-white mb-2 tracking-wider text-shadow-gritty">
                {newsletter.title}
              </h1>
            </div>
          </div>
          <p className="text-xl text-gray-200 font-montserrat">{formattedDate}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-urban-gray urban-concrete min-h-screen">
        
        {/* Corruption Warning */}
        {newsletter.corruption_detected && (
          <div className="bg-yellow-900 border border-yellow-600 rounded-lg p-6 mb-8">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-6 h-6 text-yellow-400 mt-1 flex-shrink-0" />
              <div>
                <h2 className="text-yellow-200 font-bebas font-bold text-lg tracking-wider mb-2">
                  CONTENT ISSUES DETECTED
                </h2>
                <p className="text-yellow-100 font-montserrat leading-relaxed">
                  {newsletter.corruption_notes || "This document may have conversion issues affecting readability. The content below represents our best effort extraction from the original PDF."}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="lg:grid lg:grid-cols-3 lg:gap-12">
          <div className="lg:col-span-2">
            <div className="mb-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl lg:text-3xl font-bebas font-bold text-white mb-4 tracking-wider text-shadow-gritty">
                    NEWSLETTER CONTENT
                  </h2>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {newsletter.topics.map((topic, index) => (
                      <Link key={index} to={`/archive?search=${encodeURIComponent(topic)}`}>
                        <Badge className="bg-neon-orange text-black text-xs hover:bg-red-600 hover:text-white transition-colors cursor-pointer">
                          {topic}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                </div>
                {newsletter.corruption_detected && (
                  <AlertTriangle className="w-6 h-6 text-yellow-400 mt-2" />
                )}
              </div>

              <div className="prose prose-lg max-w-none">
                <div className="mb-8">
                  <h3 className="text-xl font-bebas font-bold text-white mb-4 tracking-wider text-shadow-gritty">
                    SUMMARY
                  </h3>
                  <p className="text-gray-100 mb-6 leading-relaxed font-montserrat">
                    {newsletter.summary}
                  </p>
                </div>

                {newsletter.description && (
                  <div className="mb-8">
                    <h3 className="text-xl font-bebas font-bold text-white mb-4 tracking-wider text-shadow-gritty">
                      DESCRIPTION
                    </h3>
                    <p className="text-gray-100 mb-6 leading-relaxed font-montserrat">
                      {newsletter.description}
                    </p>
                  </div>
                )}

                <div className="mb-8">
                  <h3 className="text-xl font-bebas font-bold text-white mb-4 tracking-wider text-shadow-gritty">
                    CONTENT PREVIEW
                  </h3>
                  <p className="text-gray-100 mb-6 leading-relaxed font-montserrat whitespace-pre-line">
                    {newsletter.compressed_content}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                {newsletter.pdf_url ? (
                  <Button asChild className="bg-neon-orange text-white hover:bg-red-600 hover:text-white">
                    <a href={newsletter.pdf_url} target="_blank" rel="noopener noreferrer">
                      <Download className="w-4 h-4 mr-2" />
                      Read Full Issue (PDF)
                    </a>
                  </Button>
                ) : (
                  <div className="text-gray-400 font-montserrat text-sm">
                    {!newsletter.filename ? "Invalid Filename" : "PDF not available for this newsletter"}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="mt-12 lg:mt-0 space-y-8">
            {/* Keywords */}
            {newsletter.keywords && newsletter.keywords.length > 0 && (
              <div className="bg-urban-medium p-6 rounded-lg border border-neon-orange distressed-border urban-shadow-lg">
                <h3 className="text-xl font-bebas font-bold text-white mb-4 tracking-wider text-shadow-gritty">
                  KEYWORDS
                </h3>
                <div className="flex flex-wrap gap-2">
                  {newsletter.keywords.map((keyword, index) => (
                    <Link key={index} to={`/archive?search=${encodeURIComponent(keyword)}`}>
                      <Badge variant="outline" className="text-xs border-neon-orange text-white hover:bg-neon-orange hover:text-black transition-colors cursor-pointer">
                        {keyword}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Legal Cases */}
            {newsletter.legal_cases && newsletter.legal_cases.length > 0 && (
              <div className="bg-urban-medium p-6 rounded-lg border border-neon-orange distressed-border urban-shadow-lg">
                <h3 className="text-xl font-bebas font-bold text-white mb-4 tracking-wider text-shadow-gritty">
                  LEGAL CASES
                </h3>
                <div className="flex flex-wrap gap-2">
                  {newsletter.legal_cases.map((case_name, index) => (
                    <Link key={index} to={`/archive?search=${encodeURIComponent(case_name)}`}>
                      <Badge variant="outline" className="text-xs border-blue-400 text-blue-300 hover:bg-blue-400 hover:text-black transition-colors cursor-pointer">
                        {case_name}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Legal Statutes */}
            {newsletter.legal_statutes && newsletter.legal_statutes.length > 0 && (
              <div className="bg-urban-medium p-6 rounded-lg border border-neon-orange distressed-border urban-shadow-lg">
                <h3 className="text-xl font-bebas font-bold text-white mb-4 tracking-wider text-shadow-gritty">
                  LEGAL STATUTES
                </h3>
                <div className="flex flex-wrap gap-2">
                  {newsletter.legal_statutes.map((statute, index) => (
                    <Link key={index} to={`/archive?search=${encodeURIComponent(statute)}`}>
                      <Badge variant="outline" className="text-xs border-purple-400 text-purple-300 hover:bg-purple-400 hover:text-black transition-colors cursor-pointer">
                        {statute}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Categories */}
            {newsletter.categories && newsletter.categories.length > 0 && (
              <div className="bg-urban-medium p-6 rounded-lg border border-neon-orange distressed-border urban-shadow-lg">
                <h3 className="text-xl font-bebas font-bold text-white mb-4 tracking-wider text-shadow-gritty">
                  CATEGORIES
                </h3>
                <div className="flex flex-wrap gap-2">
                  {newsletter.categories.map((category, index) => (
                    <Link key={index} to={`/archive?search=${encodeURIComponent(category)}`}>
                      <Badge variant="outline" className="text-xs border-green-400 text-green-300 hover:bg-green-400 hover:text-black transition-colors cursor-pointer">
                        {category}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </div>
            )}


            {/* Tags */}
            {newsletter.tags && newsletter.tags.length > 0 && (
              <div className="bg-urban-medium p-6 rounded-lg border border-neon-orange distressed-border urban-shadow-lg">
                <h3 className="text-xl font-bebas font-bold text-white mb-4 tracking-wider text-shadow-gritty">
                  TAGS
                </h3>
                <div className="flex flex-wrap gap-2">
                  {newsletter.tags.map((tag, index) => (
                    <Link key={index} to={`/archive?search=${encodeURIComponent(tag)}`}>
                      <Badge variant="outline" className="text-xs border-orange-400 text-orange-300 hover:bg-orange-400 hover:text-black transition-colors cursor-pointer">
                        {tag}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </div>
            )}


            {/* Navigation */}
            <div className="bg-urban-medium p-6 rounded-lg border border-neon-orange distressed-border urban-shadow-lg">
              <h3 className="text-xl font-bebas font-bold text-white mb-4 tracking-wider text-shadow-gritty">
                NAVIGATION
              </h3>
              <div className="space-y-3">
                <Button asChild variant="outline" className="w-full justify-start border-neon-orange text-white hover:bg-red-600">
                  <Link to="/newsletter">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Archive
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start border-neon-orange text-white hover:bg-red-600">
                  <Link to="/newsletter#subscribe">
                    Subscribe to Newsletter
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}