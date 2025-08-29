import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, Calendar, FileText, ArrowLeft, AlertTriangle } from "lucide-react";

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

interface Comment {
  id: number;
  newsletter: string;
  volume_issue: string;
  year: number;
  month: number;
  topic: string;
  subtopic: string;
  content: string;
  relevance_to_fire_service: number;
  quality_rating: number;
  analysis_notes?: string;
}

export default function Index() {
  const [newsletters, setNewsletters] = useState<CompressedNewsletter[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [topic, setTopic] = useState<string>('');
  const [subtopic, setSubtopic] = useState<string>('');

  useEffect(() => {
    const loadData = async () => {
      // Get topic and subtopic from URL parameters
      const urlParams = new URLSearchParams(window.location.search);
      const topicParam = urlParams.get('topic');
      const subtopicParam = urlParams.get('subtopic');
      
      console.log('URL params - topic:', topicParam, 'subtopic:', subtopicParam);
      
      const currentTopic = topicParam ? decodeURIComponent(topicParam) : '';
      const currentSubtopic = subtopicParam ? decodeURIComponent(subtopicParam) : '';
      
      // Update state
      setTopic(currentTopic);
      setSubtopic(currentSubtopic);
      
      console.log('loadData called with topic:', currentTopic, 'subtopic:', currentSubtopic);
      if (!currentTopic) return;
      
      setLoading(true);
      setError(null);

      try {
        // Load all newsletters
        const newslettersResponse = await fetch('/api/newsletters/index');
        if (!newslettersResponse.ok) {
          throw new Error('Failed to load newsletters');
        }
        const newslettersData = await newslettersResponse.json();
        const allNewsletters = newslettersData.newsletters || [];

        // Load comments for this topic/subtopic
        const commentsParams = new URLSearchParams({
          topic: currentTopic,
          limit: '1000'
        });
        
        const commentsUrl = `/api/comments?${commentsParams}`;
        console.log('Making comments API call to:', commentsUrl);
        const commentsResponse = await fetch(commentsUrl);
        console.log('Comments response status:', commentsResponse.status, 'Content-Type:', commentsResponse.headers.get('content-type'));
        let topicComments: Comment[] = [];
        
        if (commentsResponse.ok) {
          const commentsData = await commentsResponse.json();
          topicComments = (commentsData.comments || []).filter((comment: Comment) => {
            const matchesTopic = comment.topic === currentTopic;
            const matchesSubtopic = !currentSubtopic || currentSubtopic === 'General' || comment.subtopic === currentSubtopic;
            return matchesTopic && matchesSubtopic;
          });
        }

        // Get newsletter filenames from comments
        const newsletterFiles = new Set(topicComments.map(comment => comment.newsletter));
        
        // Filter newsletters that have comments matching the topic/subtopic
        // Primary matching: only show newsletters that actually have matching comments
        const matchingNewsletters = allNewsletters.filter((newsletter: CompressedNewsletter) => {
          const slug = newsletter.slug || '';
          
          // Match by filename from comments (this is the authoritative source)
          const hasMatchingComment = Array.from(newsletterFiles).some(filename => {
            const baseFilename = filename.replace('.pdf', '');
            return slug.includes(baseFilename) || baseFilename.includes(slug);
          });
          
          return hasMatchingComment;
        });

        setNewsletters(matchingNewsletters);
        setComments(topicComments);
      } catch (error) {
        console.error('Error loading data:', error);
        setError(error instanceof Error ? error.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []); // Run once on component mount

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Date unknown';
    
    try {
      const dateParts = dateString.match(/^(\d{4})-(\d{2})-(\d{2})$/);
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
      return dateString;
    } catch (e) {
      return dateString;
    }
  };

  const formatMonth = (month: number) => {
    return new Date(2000, month - 1, 1).toLocaleDateString('en-US', { month: 'long' });
  };

  // Function to get PDF URL from comment's newsletter field
  const getPdfUrl = (comment: Comment): string | null => {
    if (!comment.newsletter) return null;
    
    // The comment.newsletter field contains the PDF filename (e.g., "v01n07nov1997.pdf")
    // We need to construct the URL path to this PDF
    const filename = comment.newsletter.replace('.pdf', '');
    
    // Try to find matching newsletter from our loaded data
    const matchingNewsletter = newsletters.find(newsletter => {
      if (!newsletter.slug && !newsletter.pdf_url) return false;
      
      // Check if slug matches the filename
      if (newsletter.slug && newsletter.slug === filename) {
        return true;
      }
      
      // Check if pdf_url contains the filename
      if (newsletter.pdf_url && newsletter.pdf_url.includes(filename)) {
        return true;
      }
      
      return false;
    });
    
    if (matchingNewsletter && matchingNewsletter.pdf_url) {
      return matchingNewsletter.pdf_url;
    }
    
    // Fallback: construct PDF URL from newsletter filename
    return `/Newsletters/${comment.newsletter}`;
  };

  if (!topic) {
    return (
      <div className="min-h-screen bg-urban-gray flex items-center justify-center">
        <Card className="p-8 bg-urban-medium border-neon-orange distressed-border urban-shadow-lg">
          <CardContent className="text-center">
            <h1 className="text-2xl font-bebas font-bold text-white mb-4 tracking-wider">
              TOPIC REQUIRED
            </h1>
            <p className="text-gray-200 mb-4">
              This page requires a topic parameter to display relevant newsletters.
            </p>
            <Button asChild className="bg-neon-orange text-white hover:bg-red-600">
              <Link to="/newsletter">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Newsletter
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-urban-dark py-16 urban-grid">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-4">
            <Button asChild variant="ghost" className="text-white hover:text-neon-orange mr-4">
              <Link to="/newsletter">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Link>
            </Button>
          </div>
          <h1 className="text-4xl lg:text-6xl font-bebas font-bold text-white mb-4 tracking-wider text-shadow-gritty">
            {topic.toUpperCase()}
          </h1>
          {subtopic && subtopic !== 'General' && (
            <p className="text-2xl text-neon-orange font-montserrat font-semibold mb-2">
              {subtopic}
            </p>
          )}
          <p className="text-xl text-gray-200 font-montserrat">
            Newsletters and legal insights covering this topic.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-urban-gray urban-concrete min-h-screen">
        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-200 font-montserrat text-xl">Loading newsletters and insights...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-400 text-xl mb-4">{error}</p>
            <Button 
              onClick={() => window.location.reload()}
              className="bg-neon-orange text-white hover:bg-red-600"
            >
              Try Again
            </Button>
          </div>
        ) : (
          <div>
            {/* Newsletters Section */}
            <Card className="p-8 mb-8 bg-urban-medium border-neon-orange distressed-border urban-shadow-lg">
                <CardContent className="p-0">
                  <h2 className="text-2xl font-bebas font-bold text-white mb-6 tracking-wider text-shadow-gritty">
                    RELATED NEWSLETTERS
                    <span className="block text-base font-montserrat text-neon-orange mt-1 font-semibold">
                      {newsletters.length} newsletters found
                    </span>
                  </h2>
                  
                  {newsletters.length > 0 ? (
                    <div className="space-y-4">
                      {newsletters.map((newsletter, index) => (
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
                                  {formatDate(newsletter.date)}
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
                                  {newsletter.topics.slice(0, 3).map((t, i) => (
                                    <Badge key={i} variant="outline" className="text-xs border-neon-orange text-neon-orange">
                                      {t}
                                    </Badge>
                                  ))}
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
                            <Badge variant="destructive" className="text-xs">
                              Content Issues Detected
                            </Badge>
                          )}
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-300">No newsletters found for this topic.</p>
                    </div>
                  )}
                </CardContent>
              </Card>

            {/* Legal Insights Table */}
            <Card className="p-8 bg-urban-medium border-neon-orange distressed-border urban-shadow-lg">
              <CardContent className="p-0">
                <h3 className="text-2xl font-bebas font-bold text-white mb-6 tracking-wider text-shadow-gritty">
                  LEGAL INSIGHTS
                  <span className="block text-base font-montserrat text-neon-orange mt-1 font-semibold">
                    {comments.length} insights
                  </span>
                </h3>
                
                {comments.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full table-auto">
                      <thead>
                        <tr className="border-b border-gray-600">
                          <th className="text-left py-3 px-4 text-xs font-semibold text-neon-orange uppercase tracking-wide">Date</th>
                          <th className="text-left py-3 px-4 text-xs font-semibold text-neon-orange uppercase tracking-wide">Volume</th>
                          <th className="text-left py-3 px-4 text-xs font-semibold text-neon-orange uppercase tracking-wide">Subtopic</th>
                          <th className="text-left py-3 px-4 text-xs font-semibold text-neon-orange uppercase tracking-wide">Content</th>
                          <th className="text-left py-3 px-4 text-xs font-semibold text-neon-orange uppercase tracking-wide">PDF</th>
                        </tr>
                      </thead>
                      <tbody>
                        {comments.map((comment, index) => (
                          <tr key={comment.id} className={`border-b border-gray-700 hover:bg-urban-light transition-colors ${
                            index % 2 === 0 ? 'bg-urban-dark/50' : 'bg-transparent'
                          }`}>
                            <td className="py-4 px-4 text-sm text-gray-300 font-montserrat">
                              <div className="flex items-center space-x-1">
                                <Calendar className="w-3 h-3 text-gray-400" />
                                <span>{formatMonth(comment.month)} {comment.year}</span>
                              </div>
                            </td>
                            <td className="py-4 px-4 text-sm text-gray-300 font-montserrat">
                              <div className="flex items-center space-x-1">
                                <FileText className="w-3 h-3 text-gray-400" />
                                <span>Vol. {comment.volume_issue}</span>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              {comment.subtopic && comment.subtopic !== '' ? (
                                <Badge variant="outline" className="text-gray-300 border-gray-500 text-xs">
                                  {comment.subtopic}
                                </Badge>
                              ) : (
                                <span className="text-gray-500 text-xs italic">General</span>
                              )}
                            </td>
                            <td className="py-4 px-4">
                              <div>
                                <p className="text-gray-200 text-sm leading-relaxed font-montserrat mb-2">
                                  {comment.content.length > 300 
                                    ? `${comment.content.substring(0, 300)}...` 
                                    : comment.content}
                                </p>
                                {comment.analysis_notes && (
                                  <div className="mt-2 p-3 bg-urban-dark rounded border-l-2 border-neon-orange">
                                    <p className="text-xs text-gray-300 italic">
                                      <strong className="text-neon-orange">Analysis:</strong> {comment.analysis_notes.length > 200 ? `${comment.analysis_notes.substring(0, 200)}...` : comment.analysis_notes}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              {(() => {
                                const pdfUrl = getPdfUrl(comment);
                                return pdfUrl ? (
                                  <Button asChild size="sm" className="bg-neon-orange text-white hover:bg-red-600 hover:text-white">
                                    <a href={pdfUrl} target="_blank" rel="noopener noreferrer" title="Download PDF">
                                      <Download className="w-3 h-3" />
                                    </a>
                                  </Button>
                                ) : (
                                  <span className="text-gray-500 text-xs italic">N/A</span>
                                );
                              })()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-300">No legal insights found for this topic.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}