import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import NewsletterSubscription from "@/components/newsletter-subscription";
import NewsletterComments from "@/components/newsletter-comments";
import { Download, ExternalLink, CheckCircle, Archive } from "lucide-react";

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

export default function Newsletter() {
  const [loading, setLoading] = useState(true);
  const [latestNewsletter, setLatestNewsletter] = useState<CompressedNewsletter | null>(null);

  // Load newsletter data from API
  useEffect(() => {
    const loadNewsletters = async () => {
      try {
        // Load newsletter index from API
        const indexResponse = await fetch(import.meta.env.PROD ? '/api/newsletters/index.json' : '/api/newsletters/index');
        if (!indexResponse.ok) {
          throw new Error(`HTTP ${indexResponse.status}`);
        }
        
        const indexData = await indexResponse.json();
        
        // Set the latest newsletter as the first one (most recent)
        if (indexData.newsletters.length > 0) {
          const latest = indexData.newsletters[0];
          // Get full details for latest newsletter
          const detailResponse = await fetch(import.meta.env.PROD ? `/api/newsletters/v/${latest.volume}/${latest.edition}.json` : `/api/newsletters/v/${latest.volume}/${latest.edition}`);
          if (detailResponse.ok) {
            const latestDetails = await detailResponse.json();
            setLatestNewsletter(latestDetails);
          } else {
            // Use basic info from index if details fail
            setLatestNewsletter({
              ...latest,
              compressed_content: "Recent legal updates for fire service administrators",
              search_text: latest.summary,
              pdf_url: undefined
            });
          }
        }
      } catch (error) {
        console.error('Loading newsletters from API failed:', error);
        // Fallback to static data
        setLatestNewsletter({
          volume: 25,
          edition: 7,
          title: "Special-Meeting Notices Are Key",
          date: "2025-07-15",
          summary: "This month's newsletter covers critical updates for fire service administrators and commissioners. We examine recent OPMA cases that clarify requirements for special meeting notices, ensuring your agency maintains compliance with transparency laws.",
          keywords: ["OPMA", "special meetings", "transparency", "fire service", "compliance"],
          topics: ["Open Government", "Public Meetings", "Legal Compliance"],
          compressed_content: "Recent OPMA cases provide important guidance on proper notice procedures for special meetings",
          search_text: "OPMA special meetings notice procedures fire districts transparency laws compliance fire service administrators commissioners",
          corruption_detected: false,
          corruption_notes: "",
          pdf_url: "https://firehouselawyer.com/Newsletters/July2025FINAL.pdf"
        });
        
      } finally {
        setLoading(false);
      }
    };

    loadNewsletters();
  }, []);

  const benefits = [
    "Monthly legal updates",
    "Case law analysis",
    "Legislative changes",
    "Best practices guidance"
  ];

  return (
    <div>
      <div className="bg-urban-dark py-16 urban-grid">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl lg:text-6xl font-bebas font-bold text-white mb-4 tracking-wider text-shadow-gritty">OUR NEWSLETTER</h1>
          <p className="text-xl text-gray-200 font-montserrat">Stay updated on laws impacting fire departments and other public agencies.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-urban-gray urban-concrete min-h-screen">
        <div className="lg:grid lg:grid-cols-3 lg:gap-12">
          <div className="lg:col-span-2">
            {/* Latest Issue */}
            {latestNewsletter && (
              <Card className="p-8 mb-8 bg-urban-medium border-neon-orange distressed-border urban-shadow-lg">
                <CardContent className="p-0">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h2 className="text-2xl lg:text-3xl font-bebas font-bold text-white mb-4 tracking-wider text-shadow-gritty">
                        LATEST ISSUE - {(() => {
                          if (!latestNewsletter.date) {
                            return 'RECENT';
                          }
                          // Parse YYYY-MM-DD format manually to avoid timezone issues
                          const dateParts = latestNewsletter.date.match(/^(\d{4})-(\d{2})-(\d{2})$/);
                          if (dateParts) {
                            const year = parseInt(dateParts[1]);
                            const month = parseInt(dateParts[2]) - 1;
                            const day = parseInt(dateParts[3]);
                            const dateObj = new Date(year, month, day);
                            return `${dateObj.toLocaleDateString('en-US', { month: 'long' }).toUpperCase()} ${dateObj.getFullYear()}`;
                          }
                          return 'RECENT';
                        })()}
                      </h2>
                      <p className="text-gray-200 font-montserrat text-lg">
                        {Array.isArray(latestNewsletter.title) 
                          ? latestNewsletter.title.join(', ') 
                          : latestNewsletter.title}
                      </p>
                    </div>
                    <Badge className="bg-neon-orange text-black">NEW</Badge>
                  </div>
                  <p className="text-gray-100 mb-6 leading-relaxed font-montserrat">
                    {Array.isArray(latestNewsletter.summary) 
                      ? latestNewsletter.summary.join(' ') 
                      : latestNewsletter.summary}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    {latestNewsletter.pdf_url && (
                      <Button asChild className="bg-neon-orange text-white hover:bg-red-600 hover:text-white">
                        <a href={latestNewsletter.pdf_url} target="_blank" rel="noopener noreferrer">
                          <Download className="w-4 h-4 mr-2" />
                          Read Full Issue (PDF)
                        </a>
                      </Button>
                    )}
                    <Button asChild variant="outline" className="border-neon-orange text-white hover:bg-red-600 hover:text-white">
                      <Link to={`/newsletter/${latestNewsletter.slug || `v/${latestNewsletter.volume}/${latestNewsletter.edition}`}`}>
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Online
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {loading && (
              <Card className="p-8 mb-8 bg-urban-medium border-neon-orange distressed-border urban-shadow-lg">
                <CardContent className="p-0">
                  <div className="flex items-center justify-center py-8">
                    <p className="text-gray-200 font-montserrat">Loading latest newsletter...</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Newsletter Index */}
            <NewsletterComments />
          </div>

          {/* Subscription Sidebar */}
          <div className="mt-12 lg:mt-0 space-y-8">
            <NewsletterSubscription variant="sidebar" />

            {/* Browse Archive */}
            <Card className="p-8 bg-urban-medium border-neon-orange distressed-border urban-shadow-lg">
              <CardContent className="p-0">
                <h3 className="text-2xl font-bebas font-bold text-white mb-4 tracking-wider text-shadow-gritty">
                  BROWSE ARCHIVE
                </h3>
                <p className="text-gray-200 font-montserrat mb-6">
                  Search our complete collection of legal updates and analysis from past issues.
                </p>
                <Button asChild className="bg-neon-orange text-white hover:bg-red-600 hover:text-white w-full">
                  <Link to="/archive">
                    <Archive className="w-4 h-4 mr-2" />
                    View Full Archive
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Newsletter Benefits */}
            <Card className="p-8 bg-urban-medium border-neon-orange distressed-border urban-shadow-lg">
              <CardContent className="p-0">
                <h3 className="text-2xl font-bebas font-bold text-white mb-4 tracking-wider text-shadow-gritty">WHAT YOU'LL GET</h3>
                <ul className="space-y-3">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-neon-orange mt-0.5 flex-shrink-0" />
                      <span className="text-gray-100 font-montserrat">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

    </div>
  );
}