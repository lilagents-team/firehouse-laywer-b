import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle, Upload, ExternalLink, FileText, Calendar, Tag } from 'lucide-react';

interface NewsletterCacheItem {
  volume: number;
  edition: number;
  title: string;
  date: string | null;
  summary: string;
  keywords: string[];
  topics: string[];
  corruption_detected: boolean;
  corruption_notes: string;
  pdf_url: string | null;
  slug: string;
  metadata_quality?: string;
}

interface CacheData {
  newsletters: NewsletterCacheItem[];
  total_count: number;
  last_updated: string;
  cache_version: string;
}

export default function AdminNewsletters() {
  const [cacheData, setCacheData] = useState<CacheData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [migrationStatus, setMigrationStatus] = useState<string | null>(null);

  useEffect(() => {
    loadCacheData();
  }, []);

  const loadCacheData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/newsletters/index');
      if (!response.ok) throw new Error(`Failed to load cache: ${response.status}`);
      
      const data = await response.json();
      setCacheData(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const triggerMigration = async () => {
    try {
      setMigrationStatus('Starting migration...');
      
      // This would call a backend endpoint to run the migration script
      const response = await fetch('/api/admin/migrate-newsletters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) {
        throw new Error(`Migration failed: ${response.status}`);
      }
      
      const result = await response.json();
      setMigrationStatus(`Migration completed: ${result.migrated} files migrated, ${result.skipped} skipped`);
      
      // Reload cache data
      setTimeout(() => {
        loadCacheData();
        setMigrationStatus(null);
      }, 2000);
      
    } catch (err) {
      setMigrationStatus(`Migration error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-urban-gray urban-concrete flex items-center justify-center">
        <div className="text-white text-xl font-bebas tracking-wider">Loading newsletter cache...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-urban-gray urban-concrete flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bebas font-bold text-white mb-4 tracking-wider">CACHE LOAD ERROR</h1>
          <p className="text-gray-200 mb-6">{error}</p>
          <Button onClick={loadCacheData} className="bg-neon-orange text-white hover:bg-red-600">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-urban-gray urban-concrete">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-8">
          <h1 className="text-4xl font-bebas font-bold text-white mb-4 tracking-wider">
            NEWSLETTER CACHE ADMIN
          </h1>
          <p className="text-gray-200 text-lg max-w-3xl">
            View and manage existing newsletter data. Migrate JSON cache entries to CMS for editing.
          </p>
        </div>

        {/* Cache Info Card */}
        <Card className="mb-8 bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white font-bebas tracking-wide">Cache Information</CardTitle>
            <CardDescription className="text-gray-300">
              Current newsletter data cache status
            </CardDescription>
          </CardHeader>
          <CardContent className="text-white space-y-2">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-2xl font-bold text-neon-orange">{cacheData?.total_count || 0}</div>
                <div className="text-sm text-gray-300">Total Newsletters</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-400">
                  {cacheData?.newsletters.filter(n => !n.corruption_detected).length || 0}
                </div>
                <div className="text-sm text-gray-300">Clean Records</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-400">
                  {cacheData?.newsletters.filter(n => n.corruption_detected).length || 0}
                </div>
                <div className="text-sm text-gray-300">Flagged Records</div>
              </div>
              <div>
                <div className="text-sm font-mono text-blue-400">{cacheData?.cache_version}</div>
                <div className="text-sm text-gray-300">Cache Version</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Migration Controls */}
        <Card className="mb-8 bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white font-bebas tracking-wide flex items-center gap-2">
              <Upload className="w-5 h-5" />
              CMS Migration
            </CardTitle>
            <CardDescription className="text-gray-300">
              Convert JSON cache entries to editable CMS markdown files
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Button 
                onClick={triggerMigration}
                disabled={!!migrationStatus}
                className="bg-neon-orange text-white hover:bg-red-600"
              >
                <Upload className="w-4 h-4 mr-2" />
                Migrate to CMS
              </Button>
              
              <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                <ExternalLink className="w-4 h-4 mr-2" />
                Open CMS Admin
              </Button>
            </div>
            
            {migrationStatus && (
              <div className="mt-4 p-3 bg-blue-900/50 border border-blue-600 rounded">
                <p className="text-blue-200">{migrationStatus}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Newsletter List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bebas font-bold text-white mb-4 tracking-wider">
            CACHED NEWSLETTERS ({cacheData?.total_count || 0})
          </h2>
          
          {cacheData?.newsletters.slice(0, 10).map((newsletter, index) => (
            <Card key={newsletter.slug} className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-white">{newsletter.title}</h3>
                      <Badge variant={newsletter.corruption_detected ? "destructive" : "default"} className="text-xs">
                        {newsletter.corruption_detected
                          ? `${newsletter.pdf_url || 'No PDF'} (Corrupted)`
                          : (isNaN(newsletter.volume) || isNaN(newsletter.edition))
                            ? `${newsletter.pdf_url || 'No PDF'} (Invalid Vol/Ed)`
                            : `Vol ${newsletter.volume} Ed ${newsletter.edition}`
                        }
                      </Badge>
                      {newsletter.corruption_detected && (
                        <Badge variant="destructive" className="text-xs">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          Data Issues
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-gray-300 mb-3 line-clamp-2">{newsletter.summary}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {newsletter.date ? new Date(newsletter.date).toLocaleDateString() : 'No date'}
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        {newsletter.pdf_url ? 'PDF Available' : 'No PDF'}
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Tag className="w-4 h-4" />
                        {newsletter.keywords.length} keywords
                      </div>
                    </div>
                    
                    {newsletter.corruption_detected && (
                      <div className="mt-3 p-2 bg-red-900/50 border border-red-600 rounded">
                        <p className="text-red-200 text-sm">{newsletter.corruption_notes}</p>
                      </div>
                    )}
                    
                    {newsletter.topics.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1">
                        {newsletter.topics.map((topic, i) => (
                          <Badge key={i} variant="outline" className="text-xs border-gray-600 text-gray-300">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col gap-2 ml-4">
                    <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                      View Details
                    </Button>
                    <Button size="sm" className="bg-neon-orange text-white hover:bg-red-600">
                      Edit in CMS
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {cacheData && cacheData.newsletters.length > 10 && (
            <div className="text-center mt-6">
              <p className="text-gray-300">Showing first 10 newsletters. Total: {cacheData.total_count}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}