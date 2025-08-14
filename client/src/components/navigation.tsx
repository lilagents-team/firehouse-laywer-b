import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navigation() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Newsletter", href: "/newsletter" },
    { name: "Practice Areas", href: "/practice-areas" },
    { name: "Attorneys", href: "/attorneys" },
    { name: "Contact Us", href: "/contact" },
  ];

  const isActive = (href: string) => {
    if (href === "/" && location === "/") return true;
    if (href !== "/" && location.startsWith(href)) return true;
    return false;
  };

  return (
    <nav className="bg-urban-dark urban-shadow-lg sticky top-0 z-50 border-b border-neon-orange">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <div>
                <h1 className="text-2xl font-bebas font-bold text-white tracking-wider text-shadow-gritty">ERIC T. QUINN, P.S.</h1>
                <p className="text-sm text-neon-orange font-montserrat uppercase tracking-wide">THE FIREHOUSE LAWYER</p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-3 py-2 text-sm font-montserrat font-medium transition-all duration-300 ${
                    isActive(item.href)
                      ? "text-neon-orange border-b-2 border-neon-orange"
                      : "text-red-300 hover:text-neon-orange hover:scale-105"
                  }`}
                  data-testid={`nav-link-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {item.name.toUpperCase()}
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-neon-orange hover:text-red-400"
              data-testid="mobile-menu-toggle"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>
      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-urban-medium border-t border-neon-orange">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 font-montserrat font-medium uppercase tracking-wide hover:bg-urban-light transition-all duration-300 ${
                  isActive(item.href) ? "text-neon-orange bg-urban-light" : "text-orange-300 hover:text-neon-orange"
                }`}
                data-testid={`mobile-nav-link-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
