import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import NewsletterSubscription from "@/components/newsletter-subscription";
import { 
  Building2, 
  FileText, 
  Users, 
  Shield, 
  DollarSign, 
  ClipboardCheck,
  Calendar,
  Bell
} from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";

// Import local images
import bog1 from "../assets/images/bog-1.jpg";
import joe3 from "../assets/images/joe-3.jpg";
import plant from "../assets/images/plant.jpg";
import rainier from "../assets/images/rainier.jpg";
import joeFiretruck from "../assets/images/joe-with-firetruck.jpg";

export default function Home() {
  const [, setLocation] = useLocation();
  
  const heroImages = [
    { src: bog1, alt: "Pacific Northwest landscape" },
    { src: joe3, alt: "Legal professional" },
    { src: plant, alt: "Pacific Northwest nature" },
    { src: rainier, alt: "Mount Rainier landscape" }
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [heroImages.length]);

  const handlePracticeAreaClick = (searchTerm: string) => {
    setLocation(`/newsletter?search=${encodeURIComponent(searchTerm)}`);
  };


  const practiceAreas = [
    {
      icon: Building2,
      title: "Mergers and Consolidations",
      description: "Expert guidance through complex fire district mergers and consolidations with political and legal implications.",
      searchTerm: "mergers consolidations"
    },
    {
      icon: FileText,
      title: "Public Records & OPMA",
      description: "Navigate public records requests and open meeting requirements with confidence and compliance.",
      searchTerm: "OPMA Public Records"
    },
    {
      icon: Users,
      title: "Personnel Matters",
      description: "Complete support for employment law, collective bargaining, and workplace policy issues.",
      searchTerm: "employment law"
    },
    {
      icon: Shield,
      title: "HIPAA Compliance",
      description: "Protect medical information and ensure compliance with federal and state health privacy laws.",
      searchTerm: "HIPAA"
    },
    {
      icon: DollarSign,
      title: "Public Finances",
      description: "Expert advice on property taxes, fire benefit charges, and financial compliance matters.",
      searchTerm: "budget finance"
    },
    {
      icon: ClipboardCheck,
      title: "Contract Review",
      description: "Comprehensive contract drafting and review for mutual aid agreements and procurement.",
      searchTerm: "contract law"
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-urban-dark overflow-hidden urban-grid">
        <div className="absolute inset-0">
          <div className="relative w-full h-full">
            {heroImages.map((image, index) => (
              <img 
                key={index}
                src={image.src} 
                alt={image.alt}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                  index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                } ${
                  index === 1 ? 'lg:object-top object-center' : 'object-center'
                }`}
              />
            ))}
          </div>
          {/* Urban overlay with texture - Balanced for text readability */}
          <div className="absolute inset-0 bg-black/70 urban-concrete"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-transparent to-black/40"></div>
        </div>

        {/* Carousel Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-3 h-3 transition-all duration-300 ${
                index === currentImageIndex 
                  ? 'bg-neon-orange scale-125' 
                  : 'bg-white/50 hover:bg-neon-orange/75 scale-100'
              }`}
              style={{ clipPath: 'polygon(0 0, 100% 0, 85% 100%, 0% 100%)' }}
              aria-label={`Go to slide ${index + 1}`}
              data-testid={`hero-indicator-${index}`}
            />
          ))}
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="lg:w-2/3">
            <h1 className="text-4xl lg:text-7xl font-bebas font-bold text-white mb-6 leading-tight text-shadow-gritty tracking-wider">
              REPRESENTING THE <span className="text-neon-orange text-shadow-gritty">FIRE SERVICE</span> WITH EXCELLENCE
            </h1>
            <p className="text-xl text-gray-200 mb-8 leading-relaxed font-montserrat text-shadow-gritty">
              At Eric T. Quinn, P.S., we have a common goal: providing specialized legal counsel to fire districts, 
              regional fire authorities, and public agencies across the Pacific Northwest.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                asChild 
                size="lg" 
                className="bg-neon-orange hover:bg-red-600 urban-shadow-lg border border-neon-orange hover:scale-105 transition-all duration-300 font-montserrat font-semibold uppercase tracking-wide text-white hover:text-white"
                data-testid="button-explore-practice-areas"
              >
                <Link href="/practice-areas">
                  Explore Our Practice Areas
                </Link>
              </Button>
              <Button 
                asChild 
                variant="outline" 
                size="lg" 
                className="border-neon-orange text-white hover:bg-red-600 hover:text-white bg-transparent urban-shadow-lg hover:scale-105 transition-all duration-300 font-montserrat font-semibold uppercase tracking-wide"
                data-testid="button-schedule-consultation"
              >
                <Link href="/contact">
                  Schedule Consultation
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-urban-medium urban-concrete">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            <div>
              <h2 className="text-3xl lg:text-5xl font-bebas font-bold text-white mb-6 tracking-wider text-shadow-gritty">
                SPECIALIZED LEGAL COUNSEL FOR FIRE SERVICE AND PUBLIC AGENCIES
              </h2>
              <p className="text-lg text-gray-300 mb-6 leading-relaxed font-montserrat">
                Managing a government agency is no easy task. Every day you address many challenges, and we will help you solve them. 
                We understand that the ultimate goal of the fire service is to ensure the safety and wellness of every person.
              </p>
              <p className="text-lg text-gray-300 mb-8 leading-relaxed font-montserrat">
                But that does not come without a cost to management. You may face an employee who alleges discrimination; 
                a citizen who makes numerous public records requests; or the passage of an excess levy, which requires not only 
                political will, but financial and organizational expertise.
              </p>
              <Button 
                asChild 
                variant="link" 
                className="text-neon-orange hover:text-red-400 p-0 font-montserrat font-semibold uppercase tracking-wide transition-all duration-300"
                data-testid="link-meet-attorneys"
              >
                <Link href="/attorneys">
                  Meet Our Attorneys →
                </Link>
              </Button>
            </div>
            <div className="mt-10 lg:mt-0">
              <div className="relative bg-urban-light urban-shadow-lg p-2" style={{ clipPath: 'polygon(0 0, 95% 0, 100% 95%, 5% 100%)' }}>
                <div className="relative overflow-hidden" style={{ clipPath: 'polygon(0 0, 95% 0, 100% 95%, 5% 100%)' }}>
                  <img 
                    src={joeFiretruck} 
                    alt="Joseph Quinn with vintage fire truck" 
                    className="w-full h-96 object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Practice Areas Preview */}
      <section className="py-20 bg-urban-gray urban-grid">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bebas font-bold text-white mb-4 tracking-wider text-shadow-gritty">OUR PRACTICE AREAS</h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto font-montserrat">
              Comprehensive legal services tailored specifically for fire districts, regional fire authorities, and public agencies.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {practiceAreas.map((area, index) => (
              <Card 
                key={index} 
                className="bg-urban-light border-neon-orange hover:border-red-400 urban-shadow hover:urban-shadow-lg transition-all duration-300 hover:scale-105 distressed-border cursor-pointer" 
                data-testid={`practice-area-card-${index}`}
                onClick={() => handlePracticeAreaClick(area.searchTerm)}
              >
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-neon-orange rounded-none flex items-center justify-center mb-6 urban-shadow-lg hover:bg-red-600 transition-all duration-300 hover:scale-110" style={{ clipPath: 'polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%)' }}>
                    <area.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-bebas font-bold text-white mb-3 tracking-wider text-shadow-gritty">{area.title.toUpperCase()}</h3>
                  <p className="text-gray-300 font-montserrat">{area.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button 
              asChild 
              size="lg" 
              className="bg-neon-orange hover:bg-red-600 urban-shadow-lg border border-neon-orange hover:scale-105 transition-all duration-300 font-montserrat font-semibold uppercase tracking-wide text-white hover:text-white"
              data-testid="button-view-all-practice-areas"
            >
              <Link href="/practice-areas">
                View All Practice Areas
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Announcements Section */}
      <section className="py-20 bg-urban-medium urban-concrete">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bebas font-bold text-white mb-4 tracking-wider text-shadow-gritty">ANNOUNCEMENTS</h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto font-montserrat">
              Stay updated with our latest programs, events, and educational opportunities.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Services for All Public Agencies */}
            <Card className="bg-urban-light border-neon-orange hover:border-red-400 urban-shadow hover:urban-shadow-lg transition-all duration-300 hover:scale-105 distressed-border" data-testid="announcement-card-public-agencies">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-neon-orange rounded-none flex items-center justify-center mb-6 urban-shadow-lg hover:bg-red-600 transition-all duration-300 hover:scale-110" style={{ clipPath: 'polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%)' }}>
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl lg:text-3xl font-bebas font-bold text-white mb-3 tracking-wider text-shadow-gritty">SERVING ALL PUBLIC AGENCIES</h3>
                <p className="text-gray-300 mb-4 leading-relaxed font-montserrat">
                  Are you not with a fire district or regional fire authority? Don't fret. Our skills transfer to any 
                  type of municipal corporation, such as a school district, city or public utility district, to name a few!
                </p>
                <div className="text-sm text-white bg-neon-orange/20 px-3 py-2 rounded font-montserrat font-semibold uppercase tracking-wide">
                  Contact us to discuss your agency's needs
                </div>
              </CardContent>
            </Card>

            {/* Municipal Roundtable */}
            <Card className="bg-urban-light border-neon-orange hover:border-red-400 urban-shadow hover:urban-shadow-lg transition-all duration-300 hover:scale-105 distressed-border" data-testid="announcement-card-roundtable">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-neon-orange rounded-none flex items-center justify-center mb-6 urban-shadow-lg hover:bg-red-600 transition-all duration-300 hover:scale-110" style={{ clipPath: 'polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%)' }}>
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl lg:text-3xl font-bebas font-bold text-white mb-3 tracking-wider text-shadow-gritty">MUNICIPAL ROUNDTABLE</h3>
                <p className="text-gray-300 mb-4 leading-relaxed font-montserrat">
                  Join us every three months for our Municipal Roundtable sessions, where we discuss current 
                  legal issues affecting fire departments and public agencies across the region.
                </p>
                <div className="text-sm text-white bg-neon-orange/20 px-3 py-2 rounded font-montserrat font-semibold uppercase tracking-wide">
                  Next session: Contact us for dates
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Button 
              asChild 
              size="lg" 
              variant="outline" 
              className="border-neon-orange text-white hover:bg-red-600 hover:text-white urban-shadow-lg hover:scale-105 transition-all duration-300 font-montserrat font-semibold uppercase tracking-wide"
              data-testid="button-contact-event-details"
            >
              <Link href="/contact">
                Contact Us for Event Details
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <NewsletterSubscription />
    </div>
  );
}
