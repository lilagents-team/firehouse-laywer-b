import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronRight, ExternalLink } from "lucide-react";

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

interface TopicTree {
  [topic: string]: {
    subtopics: {
      [subtopic: string]: Comment[];
    };
    totalComments: number;
  };
}

export default function NewsletterComments() {
  const [topicTree, setTopicTree] = useState<TopicTree>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set());
  const [totalComments, setTotalComments] = useState(0);

  // Load all comments and build tree structure
  useEffect(() => {
    const loadCommentsTree = async () => {
      setLoading(true);
      setError(null);

      try {
        // Load all comments without pagination (use very high limit to get all ~1500 comments)
        const response = await fetch('/api/comments?limit=5000');
        
        if (!response.ok) {
          if (response.status === 404) {
            setTopicTree({});
            setTotalComments(0);
            setError(null);
            return;
          }
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Server returned non-JSON response');
        }

        const data = await response.json();
        const comments = data.comments || [];
        
        console.log('Newsletter Index: Loaded', comments.length, 'comments');
        
        // Build topic tree structure
        const tree: TopicTree = {};
        let total = 0;

        comments.forEach((comment: Comment) => {
          const topic = comment.topic || 'Uncategorized';
          const subtopic = comment.subtopic || 'General';

          if (!tree[topic]) {
            tree[topic] = {
              subtopics: {},
              totalComments: 0
            };
          }

          if (!tree[topic].subtopics[subtopic]) {
            tree[topic].subtopics[subtopic] = [];
          }

          tree[topic].subtopics[subtopic].push(comment);
          tree[topic].totalComments++;
          total++;
        });

        setTopicTree(tree);
        setTotalComments(total);
      } catch (error) {
        console.error('Error loading comments:', error);
        if (error instanceof Error && error.message.includes('JSON')) {
          setError('Comments system not available - API may not be configured');
        } else {
          setError(error instanceof Error ? error.message : 'Failed to load comments');
        }
      } finally {
        setLoading(false);
      }
    };

    loadCommentsTree();
  }, []);

  const toggleTopic = (topic: string) => {
    const newExpanded = new Set(expandedTopics);
    if (newExpanded.has(topic)) {
      newExpanded.delete(topic);
    } else {
      newExpanded.add(topic);
    }
    setExpandedTopics(newExpanded);
  };


  if (error) {
    return (
      <Card className="p-8 bg-urban-medium border-neon-orange distressed-border urban-shadow-lg">
        <CardContent className="p-0">
          <h3 className="text-2xl font-bebas font-bold text-white mb-4 tracking-wider text-shadow-gritty">
            NEWSLETTER INDEX
          </h3>
          <div className="text-center py-8">
            <p className="text-red-400 mb-4">{error}</p>
            <p className="text-gray-300 text-sm mb-4">
              The legal insights index will be available once the data is properly loaded.
            </p>
            <Button 
              onClick={() => window.location.reload()}
              className="bg-neon-orange text-white hover:bg-red-600"
            >
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="p-8 bg-urban-medium border-neon-orange distressed-border urban-shadow-lg">
      <CardContent className="p-0">
        <div className="mb-6">
          <h3 className="text-2xl font-bebas font-bold text-white tracking-wider text-shadow-gritty">
            NEWSLETTER INDEX
            <span className="block text-base font-montserrat text-neon-orange mt-1 font-semibold">
              {totalComments} Legal Insights by Topic
            </span>
          </h3>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-200 font-montserrat">Loading topics...</p>
          </div>
        ) : Object.keys(topicTree).length > 0 ? (
          <div className="space-y-2">
            {Object.entries(topicTree)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([topic, topicData]) => (
                <div key={topic} className="border border-gray-600 rounded-lg overflow-hidden">
                  <div className="flex items-center justify-between p-4 bg-urban-light hover:bg-urban-medium transition-colors">
                    <div className="flex items-center space-x-3 flex-1">
                      <button
                        onClick={() => toggleTopic(topic)}
                        className="flex items-center space-x-2 hover:text-neon-orange transition-colors"
                      >
                        {expandedTopics.has(topic) ? (
                          <ChevronDown className="w-4 h-4 text-neon-orange" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                      <Link 
                        to={`/index?topic=${encodeURIComponent(topic)}`}
                        className="text-white font-semibold font-montserrat hover:text-neon-orange transition-colors flex-1"
                      >
                        {topic}
                      </Link>
                    </div>
                    <Badge className="bg-neon-orange text-black">
                      {topicData.totalComments}
                    </Badge>
                  </div>
                  
                  {expandedTopics.has(topic) && (
                    <div className="bg-urban-dark border-t border-gray-600">
                      {Object.entries(topicData.subtopics)
                        .sort(([a], [b]) => a.localeCompare(b))
                        .map(([subtopic, comments]) => (
                          <div key={`${topic}-${subtopic}`} className="border-b border-gray-700 last:border-b-0">
                            <Link 
                              to={`/index?topic=${encodeURIComponent(topic)}${subtopic !== 'General' ? `&subtopic=${encodeURIComponent(subtopic)}` : ''}`}
                              className="flex items-center justify-between p-4 hover:bg-urban-light transition-colors group"
                            >
                              <div className="flex items-center space-x-3">
                                <Badge variant="outline" className="text-gray-300 border-gray-500 group-hover:border-neon-orange group-hover:text-neon-orange transition-colors">
                                  {subtopic === 'General' ? `General ${topic}` : subtopic}
                                </Badge>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="text-xs text-gray-400 group-hover:text-neon-orange transition-colors">
                                  {comments.length} insight{comments.length !== 1 ? 's' : ''}
                                </span>
                                <ExternalLink className="w-3 h-3 text-gray-400 group-hover:text-neon-orange transition-colors" />
                              </div>
                            </Link>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-300">No legal insights available.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}