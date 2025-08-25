import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useScrollToTop } from "./hooks/use-scroll-to-top";
import Navigation from "./components/navigation";
import Footer from "./components/footer";
import Home from "./pages/home";
import Newsletter from "./pages/newsletter";
import NewsletterDetail from "./pages/newsletter-detail";
import AdminNewsletters from "./pages/admin-newsletters";
import PracticeAreas from "./pages/practice-areas";
import Attorneys from "./pages/attorneys";
import Contact from "./pages/contact";
import NotFound from "./pages/not-found";
import { useEffect } from 'react';

// Admin component that shows admin info
function AdminInfo() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md p-8 bg-white rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold text-fire-navy mb-4">Sveltia CMS Admin</h1>
        <p className="text-warm-gray mb-6">
          Access the modern, fast content management system powered by Sveltia CMS:
        </p>
        <a 
          href="/admin/index.html" 
          className="inline-block bg-fire-red text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
        >
          Launch Sveltia CMS →
        </a>
        <p className="text-sm text-warm-gray mt-4">
          Requires GitHub authentication. Sveltia CMS offers improved performance, better UX, and enhanced features compared to Decap CMS.
        </p>
        <p className="text-xs text-warm-gray mt-2 border-t pt-2">
          Note: On static deployments, backend features like contact forms may not be available.
        </p>
      </div>
    </div>
  );
}

function Router() {
  useScrollToTop();

  useEffect(() => {
    // Add RSS link to document head
    const existingLink = document.querySelector('link[rel="alternate"][type="application/rss+xml"]');
    if (!existingLink) {
      const link = document.createElement('link');
      link.rel = 'alternate';
      link.type = 'application/rss+xml';
      link.title = 'Firehouse Lawyer Newsletter';
      link.href = '/rss.xml';
      document.head.appendChild(link);
      return () => {
        document.head.removeChild(link);
      };
    }
  }, []);

  
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/newsletter" component={Newsletter} />
          <Route path="/newsletter/v/:volume/:edition" component={NewsletterDetail} />
          <Route path="/newsletter/:year/:month" component={NewsletterDetail} />
          <Route path="/newsletter/:slug" component={NewsletterDetail} />
          <Route path="/Newsletters" component={Newsletter} />
          <Route path="/Newsletters/:filename" component={({params}) => {
            // If filename ends with .pdf, trigger download
            if (params.filename?.endsWith('.pdf')) {
              window.location.href = `/Newsletters/${params.filename}`;
              return <div className="min-h-screen bg-urban-gray flex items-center justify-center">
                <div className="text-white text-xl font-bebas tracking-wider">DOWNLOADING PDF...</div>
              </div>;
            }
            // Otherwise treat as slug (will handle PDF filename fallback via API)
            return <NewsletterDetail />;
          }} />
          <Route path="/Newsletters/v/:volume/:edition" component={NewsletterDetail} />
          <Route path="/Newsletters/:year/:month" component={NewsletterDetail} />
          <Route path="/practice-areas" component={PracticeAreas} />
          <Route path="/attorneys" component={Attorneys} />
          <Route path="/contact" component={Contact} />
          <Route path="/admin" component={AdminInfo} />
          <Route path="/admin/newsletters" component={AdminNewsletters} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
