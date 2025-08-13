import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface NewsletterSubscriptionProps {
  variant?: "default" | "sidebar";
}

export default function NewsletterSubscription({ variant = "default" }: NewsletterSubscriptionProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    
    try {
      // TODO: Implement newsletter subscription API call
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      toast({
        title: "Subscribed successfully!",
        description: "You'll receive our monthly newsletter with the latest fire service legal insights.",
      });
      
      setEmail("");
    } catch (error) {
      toast({
        title: "Subscription failed",
        description: "Please try again later or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (variant === "sidebar") {
    return (
      <div className="bg-urban-dark text-white p-8 distressed-border urban-shadow-lg urban-concrete">
        <h3 className="text-xl font-bebas font-bold mb-4 tracking-wider text-shadow-gritty">SUBSCRIBE TO UPDATES</h3>
        <p className="text-gray-200 mb-6 font-montserrat">
          Receive our monthly newsletter for our expert insights!
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-urban-gray border-neon-orange text-white placeholder:text-gray-400 font-montserrat"
            required
            data-testid="input-newsletter-email-sidebar"
          />
          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-neon-orange hover:bg-orange-600 text-black hover:text-white urban-shadow border border-neon-orange font-montserrat font-semibold uppercase tracking-wide"
            data-testid="button-subscribe-sidebar"
          >
            {isLoading ? "Subscribing..." : "Subscribe Now"}
          </Button>
        </form>
      </div>
    );
  }

  return (
    <section className="py-20 bg-urban-dark urban-grid">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl lg:text-5xl font-bebas font-bold text-white mb-4 tracking-wider text-shadow-gritty">STAY INFORMED</h2>
        <p className="text-xl text-gray-200 mb-8 font-montserrat">
          Subscribe to our monthly newsletter for the latest updates on laws impacting fire departments and public agencies in general.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 bg-urban-gray border-neon-orange text-white placeholder:text-gray-400 font-montserrat"
            required
            data-testid="input-newsletter-email"
          />
          <Button 
            type="submit" 
            disabled={isLoading}
            className="bg-neon-orange hover:bg-orange-600 px-8 py-3 urban-shadow border border-neon-orange font-montserrat font-semibold uppercase tracking-wide hover:scale-105 transition-all duration-300 text-black hover:text-white"
            data-testid="button-subscribe"
          >
            {isLoading ? "Subscribing..." : "Subscribe"}
          </Button>
        </form>
      </div>
    </section>
  );
}
