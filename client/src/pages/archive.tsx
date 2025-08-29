import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Download, Search, AlertTriangle } from "lucide-react";

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
}

export default function Archive() {
  const [searchQuery, setSearchQuery] = useState("");
  const [newsletters, setNewsletters] = useState<CompressedNewsletter[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(15);

  // Handle URL search parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get('search');
    
    if (searchParam) {
      const decodedParam = decodeURIComponent(searchParam);
      setSearchQuery(decodedParam);
    } else {
      setSearchQuery('');
    }
  }, []);

  // Handle URL changes (for client-side navigation)
  useEffect(() => {
    const handleLocationChange = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const searchParam = urlParams.get('search');
      
      if (searchParam) {
        setSearchQuery(decodeURIComponent(searchParam));
      } else {
        setSearchQuery('');
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  // Load newsletter data from API
  useEffect(() => {
    const loadNewsletters = async () => {
      try {
        const indexResponse = await fetch(import.meta.env.PROD ? '/api/newsletters/index.json' : '/api/newsletters/index');
        if (!indexResponse.ok) {
          throw new Error(`HTTP ${indexResponse.status}`);
        }
        
        const indexData = await indexResponse.json();
        setNewsletters(indexData.newsletters);
      } catch (error) {
        console.error('Loading newsletters from API failed:', error);
        // Fallback data
        setNewsletters([
          {
            volume: 13,
            edition: 4,
            title: "Open Investigations and Employee Privacy",
            date: "2015-04-01",
            summary: "Supreme Court ruling in Predisik v. Spokane School District clarifies disclosure requirements for investigation records.",
            keywords: ["Predisik", "Public Records Act", "employee privacy", "investigations"],
            topics: ["Public Records", "Employment Law", "Privacy Rights"],
            compressed_content: "Supreme Court decision in Predisik v. Spokane School District",
            search_text: "Predisik Spokane School District Public Records Act employee privacy investigations",
            corruption_detected: false,
            corruption_notes: ""
          },
          {
            volume: 12,
            edition: 2,
            title: "Open Government Trainings Act Requirements [CORRUPTED]",
            date: "2014-06-01",
            summary: "Training requirements for elected officials - CONTENT PARTIALLY CORRUPTED",
            keywords: ["Open Government Trainings Act", "OPMA", "training"],
            topics: ["Open Government", "Training Requirements"],
            compressed_content: "Open Government Trainings Act (SB 5964) effective July 1, 2014",
            search_text: "Open Government Trainings Act SB 5964 OPMA PRA training elected officials",
            corruption_detected: true,
            corruption_notes: "Severe 3-column to 2-column conversion corruption detected"
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadNewsletters();
  }, []);

  // Enhanced multi-field search including dates
  const filteredNewsletters = newsletters.filter(newsletter => {
    const searchTerm = searchQuery.toLowerCase();
    
    // Standard field searches
    const titleMatch = (Array.isArray(newsletter.title) ? newsletter.title.join(' ') : newsletter.title || "").toLowerCase().includes(searchTerm);
    const summaryMatch = (Array.isArray(newsletter.summary) ? newsletter.summary.join(' ') : newsletter.summary || "").toLowerCase().includes(searchTerm);
    const keywordMatch = (newsletter.keywords || []).some(keyword => 
      (typeof keyword === 'string' ? keyword : String(keyword)).toLowerCase().includes(searchTerm)
    );
    const topicMatch = (newsletter.topics || []).some(topic => 
      (typeof topic === 'string' ? topic : String(topic)).toLowerCase().includes(searchTerm)
    );
    const searchTextMatch = (newsletter.search_text || "").toLowerCase().includes(searchTerm);
    
    // Date-based searches
    const dateString = newsletter.date || "";
    let dateMatch = false;
    
    if (dateString) {
      const dateParts = dateString.match(/^(\d{4})-(\d{2})-(\d{2})$/);
      if (dateParts) {
        const year = dateParts[1];
        const monthNum = dateParts[2];
        const dayNum = dateParts[3];
        
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
    
    return titleMatch || summaryMatch || keywordMatch || topicMatch || searchTextMatch || dateMatch;
  }).sort((a, b) => {
    // Sort search results by date (newest first)
    if (!a.date && !b.date) return 0;
    if (!a.date) return 1;
    if (!b.date) return -1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  // Reset pagination when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Calculate pagination
  const totalItems = filteredNewsletters.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedNewsletters = filteredNewsletters.slice(startIndex, endIndex);

  return (
    <div>
      <div className="bg-urban-dark py-16 urban-grid">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl lg:text-6xl font-bebas font-bold text-white mb-4 tracking-wider text-shadow-gritty">
            NEWSLETTER ARCHIVE
          </h1>
          <p className="text-xl text-gray-200 font-montserrat">
            Search and browse our complete collection of legal updates and analysis.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-urban-gray urban-concrete min-h-screen">
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          <div className="lg:col-span-3">
            {/* Search */}
            <Card className="p-8 mb-8 bg-urban-medium border-neon-orange distressed-border urban-shadow-lg">
              <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                  <h3 className="text-2xl font-bebas font-bold text-white tracking-wider text-shadow-gritty">
                    SEARCH ARCHIVE
                    <span className="block text-base font-montserrat text-neon-orange mt-1 font-semibold">
                      {totalItems} newsletters available
                    </span>
                  </h3>
                  <div className="relative w-full sm:w-auto sm:min-w-[400px]">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      type="text"
                      placeholder="Search by topic, case name, year, or keyword..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Results */}
            <Card className="p-8 bg-urban-medium border-neon-orange distressed-border urban-shadow-lg">
              <CardContent className="p-0">
                <div className="space-y-4">
                  {loading ? (
                    <div className="text-center py-8">
                      <p className="text-gray-200 font-montserrat">Loading newsletters...</p>
                    </div>
                  ) : paginatedNewsletters.length > 0 ? (
                    paginatedNewsletters.map((newsletter, index) => (
                      <Link
                        key={index}
                        to={`/newsletter/${newsletter.slug || `v/${newsletter.volume}/${newsletter.edition}`}`}
                        className="block bg-urban-light rounded-lg p-6 border border-gray-600 hover:border-neon-orange transition-colors group cursor-pointer"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1 pr-4">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-xs text-neon-orange font-montserrat font-semibold uppercase tracking-wide">
                                Vol. {newsletter.volume}, Ed. {newsletter.edition}
                              </span>
                              <span className="text-xs text-gray-400">•</span>
                              <span className="text-xs text-gray-300 font-montserrat">
                                {(() => {
                                  if (!newsletter.date) {
                                    return 'Date unknown';
                                  }
                                  const dateParts = newsletter.date.match(/^(\d{4})-(\d{2})-(\d{2})$/);
                                  if (dateParts) {
                                    const year = parseInt(dateParts[1]);
                                    const month = parseInt(dateParts[2]) - 1;
                                    const day = parseInt(dateParts[3]);
                                    const dateObj = new Date(year, month, day);
                                    return dateObj.toLocaleDateString('en-US', { 
                                      year: 'numeric', 
                                      month: 'long'
                                    });
                                  }
                                  return newsletter.date;
                                })()}
                              </span>
                            </div>
                            <h4 className="font-semibold text-white group-hover:text-neon-orange transition-colors text-lg leading-tight mb-2">
                              {Array.isArray(newsletter.title) ? newsletter.title.join(', ') : newsletter.title}
                            </h4>
                            <p className="text-sm text-warm-gray group-hover:text-gray-100 transition-colors leading-relaxed mb-3">
                              {Array.isArray(newsletter.summary) ? newsletter.summary.join(' ') : newsletter.summary}
                            </p>
                            {newsletter.topics && newsletter.topics.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {newsletter.topics.slice(0, 3).map((topic, i) => (
                                  <Badge key={i} variant="outline" className="text-xs border-neon-orange text-neon-orange">
                                    {topic}
                                  </Badge>
                                ))}
                                {newsletter.topics.length > 3 && (
                                  <Badge variant="outline" className="text-xs border-gray-500 text-gray-400">
                                    +{newsletter.topics.length - 3} more
                                  </Badge>
                                )}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center space-x-2 flex-shrink-0">
                            {newsletter.corruption_detected && (
                              <AlertTriangle className="w-4 h-4 text-yellow-400" title={newsletter.corruption_notes || "Content may be corrupted"} />
                            )}
                            <Download className="w-5 h-5 text-white group-hover:text-neon-orange transition-colors" />
                          </div>
                        </div>
                        {newsletter.corruption_detected && (
                          <div className="mt-2">
                            <Badge variant="destructive" className="text-xs">
                              Content Issues Detected
                            </Badge>
                          </div>
                        )}
                      </Link>
                    ))
                  ) : filteredNewsletters.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-warm-gray">No newsletters found matching your search.</p>
                      {searchQuery && (
                        <Button 
                          onClick={() => setSearchQuery('')} 
                          variant="outline"
                          className="mt-4 border-neon-orange text-white hover:bg-red-600"
                        >
                          Clear Search
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-warm-gray">No newsletters on this page.</p>
                    </div>
                  )}
                </div>
                
                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="mt-8 flex items-center justify-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="border-neon-orange text-white hover:bg-red-600 disabled:opacity-50"
                    >
                      Previous
                    </Button>
                    
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                        const showPage = page === 1 || 
                                        page === totalPages || 
                                        Math.abs(page - currentPage) <= 2;
                        
                        if (!showPage) {
                          if (page === 2 && currentPage > 4) {
                            return <span key={page} className="text-gray-400 px-2">...</span>;
                          }
                          if (page === totalPages - 1 && currentPage < totalPages - 3) {
                            return <span key={page} className="text-gray-400 px-2">...</span>;
                          }
                          return null;
                        }
                        
                        return (
                          <Button
                            key={page}
                            variant={page === currentPage ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(page)}
                            className={page === currentPage 
                              ? "bg-neon-orange text-black hover:bg-red-600"
                              : "border-neon-orange text-white hover:bg-red-600"
                            }
                          >
                            {page}
                          </Button>
                        );
                      })}
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="border-neon-orange text-white hover:bg-red-600 disabled:opacity-50"
                    >
                      Next
                    </Button>
                  </div>
                )}
                
                {/* Results Summary */}
                {filteredNewsletters.length > 0 && (
                  <div className="mt-4 text-center">
                    <p className="text-sm text-gray-300">
                      Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of {totalItems} newsletters
                      {searchQuery && ` matching "${searchQuery}"`}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="mt-12 lg:mt-0 space-y-8">
            <Card className="p-6 bg-urban-medium border-neon-orange distressed-border urban-shadow-lg">
              <CardContent className="p-0">
                <h3 className="text-xl font-bebas font-bold text-white mb-4 tracking-wider text-shadow-gritty">
                  POPULAR TOPICS
                </h3>
                <div className="space-y-2">
                  {['Public Records Act', 'OPMA', 'Employment Law', 'Civil Actions', 'Safety', 'Collective Bargaining'].map((topic) => (
                    <button
                      key={topic}
                      onClick={() => setSearchQuery(topic)}
                      className="block w-full text-left text-sm text-gray-300 hover:text-neon-orange hover:bg-urban-light p-2 rounded transition-colors"
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="p-6 bg-urban-medium border-neon-orange distressed-border urban-shadow-lg">
              <CardContent className="p-0">
                <h3 className="text-xl font-bebas font-bold text-white mb-4 tracking-wider text-shadow-gritty">
                  BROWSE BY YEAR
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {Array.from({length: 10}, (_, i) => 2025 - i).map((year) => (
                    <button
                      key={year}
                      onClick={() => setSearchQuery(year.toString())}
                      className="text-sm text-gray-300 hover:text-neon-orange hover:bg-urban-light p-2 rounded transition-colors text-center"
                    >
                      {year}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}