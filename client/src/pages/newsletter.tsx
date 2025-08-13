import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import NewsletterSubscription from "@/components/newsletter-subscription";
import { Download, ExternalLink, CheckCircle, Search } from "lucide-react";

export default function Newsletter() {
  const [subscriptionEmail, setSubscriptionEmail] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const archiveIssues = [
    {
      title: "June 2025 - Personnel Policy Updates",
      description: "New guidelines for employee handbook revisions and disciplinary procedures",
      date: "June 2025"
    },
    {
      title: "May 2025 - Budget Season Compliance",
      description: "Essential requirements for annual budget processes and financial reporting",
      date: "May 2025"
    },
    {
      title: "April 2025 - OPMA Best Practices",
      description: "Recent case law affecting public meetings and transparency requirements",
      date: "April 2025"
    },
    {
      title: "March 2025 - Fire Safety Regulations",
      description: "Updated fire safety codes and emergency response protocols",
      date: "March 2025"
    },
    {
      title: "February 2025 - Labor Law Changes",
      description: "New overtime regulations and collective bargaining updates",
      date: "February 2025"
    },
    {
      title: "January 2025 - Equipment Procurement",
      description: "Guidelines for purchasing fire department equipment and vehicles",
      date: "January 2025"
    },
    {
      title: "December 2024 - Pension Updates",
      description: "Changes to firefighter pension plans and retirement benefits",
      date: "December 2024"
    },
    {
      title: "November 2024 - Training Requirements",
      description: "Mandatory training programs and certification standards",
      date: "November 2024"
    }
  ];

  const filteredIssues = archiveIssues.filter(issue =>
    issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    issue.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const benefits = [
    "Monthly legal updates",
    "Case law analysis",
    "Legislative changes",
    "Best practices guidance"
  ];

  return (
    <div>
      <div className="bg-fire-navy py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">Our Newsletter</h1>
          <p className="text-xl text-gray-200">Stay updated laws impacting fire departments and other public agencies.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="lg:grid lg:grid-cols-3 lg:gap-12">
          <div className="lg:col-span-2">
            {/* Latest Issue */}
            <Card className="p-8 mb-8">
              <CardContent className="p-0">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-fire-navy mb-2">Latest Issue - July 2025</h2>
                    <p className="text-warm-gray">Special-Meeting Notices Are Key</p>
                  </div>
                  <Badge className="bg-neon-orange text-black">NEW</Badge>
                </div>
                <p className="text-warm-gray mb-6 leading-relaxed">
                  Today we discuss two OPMA cases involving notices of special meetings; we also consider apprenticeship 
                  requirements in public-works contracts, deductions from leave banks of FLSA-exempt employees, "reverse discrimination," 
                  and some miscellaneous laws.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild className="bg-neon-orange text-black hover:bg-orange-600 hover:text-white">
                    <a href="https://firehouselawyer.com/Newsletters/July2025FINAL.pdf" target="_blank" rel="noopener noreferrer">
                      <Download className="w-4 h-4 mr-2" />
                      Read Full Issue (PDF)
                    </a>
                  </Button>
                  <Button variant="outline" className="border-neon-orange text-neon-orange hover:bg-neon-orange hover:text-black">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Online
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Newsletter Archive */}
            <Card className="p-8">
              <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                  <h3 className="text-xl font-bold text-fire-navy">Newsletter Archive</h3>
                  <div className="relative w-full sm:w-auto sm:min-w-[300px]">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      type="text"
                      placeholder="Search archive..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                      data-testid="input-search-archive"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  {filteredIssues.length > 0 ? (
                    filteredIssues.map((issue, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-neon-orange transition-colors" data-testid={`card-archive-${index}`}>
                        <div>
                          <h4 className="font-semibold text-fire-navy">{issue.title}</h4>
                          <p className="text-sm text-warm-gray">{issue.description}</p>
                        </div>
                        <Button variant="ghost" size="icon" className="text-neon-orange hover:text-orange-600 bg-[#ffffff00]" data-testid={`button-download-${index}`}>
                          <Download className="w-5 h-5" />
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-warm-gray">No newsletters found matching your search.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Subscription Sidebar */}
          <div className="mt-12 lg:mt-0 space-y-8">
            <NewsletterSubscription variant="sidebar" />

            {/* Newsletter Benefits */}
            <Card className="p-8">
              <CardContent className="p-0">
                <h3 className="text-xl font-bold text-fire-navy mb-4">What You'll Get</h3>
                <ul className="space-y-3">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-neon-orange mt-0.5 flex-shrink-0" />
                      <span className="text-warm-gray">{benefit}</span>
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
