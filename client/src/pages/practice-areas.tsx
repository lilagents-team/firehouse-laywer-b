import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

export default function PracticeAreas() {
  const practiceAreas = [
    {
      title: "Open Public Meetings",
      description: "The Open Public Meetings Act (OPMA) requires that all meetings of a governing body of an agency be open to the public, with limited exceptions. We have more than thirty years' experience with such issues.",
      searchTerm: "OPMA"
    },
    {
      title: "HIPAA Compliance",
      description: "Washington and federal law are both very protective of the medical information of individual persons. We address the intricacies of these laws to avoid consequences of improper disclosure.",
      searchTerm: "HIPAA"
    },
    {
      title: "Personnel/Labor Matters",
      description: "We work in a fire station, and keep our doors open. Labor questions arise all the time, covering worker's compensation, employment discrimination, workplace safety, and collective bargaining.",
      searchTerm: "employment law"
    },
    {
      title: "Financial Management",
      description: "Property taxes and other financial issues can be baffling. After more than thirty years in local government, we have considerable expertise with property taxes, fire benefit charges, and procurement.",
      searchTerm: "budget finance"
    }
  ];

  return (
    <div>
      <div className="bg-urban-dark py-16 urban-grid">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl lg:text-6xl font-bebas font-bold text-white mb-4 tracking-wider text-shadow-gritty">PRACTICE AREAS</h1>
          <p className="text-xl text-gray-200 font-montserrat">Comprehensive legal services for fire districts, regional fire authorities, and public agencies in general.</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-urban-gray urban-concrete min-h-screen">
        {/* Mergers and Consolidations */}
        <Card className="p-8 mb-8 bg-urban-medium border-neon-orange distressed-border urban-shadow-lg">
          <CardContent className="p-0">
            <div className="lg:grid lg:grid-cols-3 lg:gap-8 items-start">
              <div className="lg:col-span-2">
                <h2 className="text-3xl lg:text-4xl font-bebas font-bold text-white mb-4 tracking-wider text-shadow-gritty">MERGERS AND CONSOLIDATIONS</h2>
                <p className="text-gray-100 mb-4 leading-relaxed font-montserrat">
                  Mergers and Consolidations require a skilled attorney who understands not only their legal implications, 
                  but their political implications as well. Although Mergers and Consolidations has been a hot topic at many 
                  conferences in recent years, Mr. Quinn has actually been very active in consolidation and merger work since 1990.
                </p>
                <p className="text-gray-100 mb-4 leading-relaxed font-montserrat">
                  He was personally very involved and remains involved in the following agencies formed as a result of such alliances: 
                  Central Pierce Fire & Rescue, East Pierce Fire & Rescue, West Pierce Fire & Rescue, Valley Regional Fire Authority, 
                  Riverside Fire Authority (Centralia area), West Thurston Regional Fire Authority, South King Fire & Rescue, and the list goes on and on.
                </p>
                <ul className="text-gray-100 space-y-2 font-montserrat">
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-5 h-5 text-neon-orange mt-0.5 flex-shrink-0" />
                    <span>Legal framework development</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-5 h-5 text-neon-orange mt-0.5 flex-shrink-0" />
                    <span>Political strategy consultation</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-5 h-5 text-neon-orange mt-0.5 flex-shrink-0" />
                    <span>Implementation oversight</span>
                  </li>
                </ul>
                <div className="mt-6">
                  <Button 
                    asChild
                    variant="outline" 
                    className="border-neon-orange text-white hover:bg-red-600 hover:text-white font-montserrat font-semibold"
                  >
                    <Link to={`/newsletter?search=${encodeURIComponent("mergers consolidations")}`}>
                      View Related Newsletters →
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="mt-8 lg:mt-0">
                <div className="relative bg-urban-light urban-shadow-lg p-2" style={{ clipPath: 'polygon(0 0, 95% 0, 100% 95%, 5% 100%)' }}>
                  <div className="relative overflow-hidden" style={{ clipPath: 'polygon(0 0, 95% 0, 100% 95%, 5% 100%)' }}>
                    <img 
                      src="https://images.unsplash.com/photo-1600622269746-258d4124170a?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                      alt="Business handshake representing mergers and consolidations" 
                      className="w-full h-64 object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent"></div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Public Records Act */}
        <Card className="p-8 mb-8 bg-urban-medium border-neon-orange distressed-border urban-shadow-lg">
          <CardContent className="p-0">
            <div className="lg:grid lg:grid-cols-3 lg:gap-8 items-start">
              <div className="order-2 lg:order-1 mt-8 lg:mt-0">
                <div className="relative bg-urban-light urban-shadow-lg p-2" style={{ clipPath: 'polygon(5% 0, 100% 0, 95% 100%, 0% 100%)' }}>
                  <div className="relative overflow-hidden" style={{ clipPath: 'polygon(5% 0, 100% 0, 95% 100%, 0% 100%)' }}>
                    <img 
                      src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                      alt="Legal documents and office" 
                      className="w-full h-64 object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tl from-black/20 to-transparent"></div>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-2 order-1 lg:order-2">
                <h2 className="text-3xl lg:text-4xl font-bebas font-bold text-white mb-4 tracking-wider text-shadow-gritty">PUBLIC RECORDS ACT</h2>
                <p className="text-gray-100 mb-4 leading-relaxed font-montserrat">
                  The Washington Public Records Act (PRA) is another "sunshine law" mandating government transparency. Much like the OPMA, 
                  this law is construed broadly and its exemptions are construed narrowly. This growing area of law requires that your staff 
                  be well trained on the intricacies of the PRA.
                </p>
                <p className="text-gray-100 mb-4 leading-relaxed font-montserrat">
                  We deal with PRA issues in this office, practically on a daily basis, so we know when to claim an exemption and when not to claim an exemption. 
                  We provide comprehensive training and ongoing support.
                </p>
                <ul className="text-gray-100 space-y-2 font-montserrat">
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-5 h-5 text-neon-orange mt-0.5 flex-shrink-0" />
                    <span>PRA compliance training</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-5 h-5 text-neon-orange mt-0.5 flex-shrink-0" />
                    <span>Request response strategies</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-5 h-5 text-neon-orange mt-0.5 flex-shrink-0" />
                    <span>Exemption analysis</span>
                  </li>
                </ul>
                <div className="mt-6">
                  <Button 
                    asChild
                    variant="outline" 
                    className="border-neon-orange text-white hover:bg-red-600 hover:text-white font-montserrat font-semibold"
                  >
                    <Link to={`/newsletter?search=${encodeURIComponent("Public Records Act")}`}>
                      View Related Newsletters →
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Practice Areas Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {practiceAreas.map((area, index) => (
            <Card key={index} className="p-8 bg-urban-medium border-neon-orange distressed-border urban-shadow hover:urban-shadow-lg transition-all duration-300 hover:scale-105" data-testid={`practice-area-detail-${index}`}>
              <CardContent className="p-0">
                <h3 className="text-3xl lg:text-4xl font-bebas font-bold text-white mb-4 tracking-wider text-shadow-gritty">{area.title.toUpperCase()}</h3>
                <p className="text-gray-100 mb-4 font-montserrat">{area.description}</p>
                <Button 
                  asChild
                  variant="link" 
                  className="text-neon-orange hover:text-red-400 p-0 font-montserrat font-semibold uppercase tracking-wide transition-all duration-300"
                  data-testid={`button-learn-more-${index}`}
                >
                  <Link to={`/newsletter?search=${encodeURIComponent(area.searchTerm)}`}>
                    Learn More →
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Board Retreats Special Section */}
        <Card className="bg-urban-medium border-neon-orange p-8 mt-8 distressed-border urban-shadow-lg relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-urban-dark/90 via-urban-medium/80 to-transparent"></div>
          <CardContent className="p-0 relative z-10">
            <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
              <div>
                <h3 className="text-3xl lg:text-4xl font-bebas font-bold mb-4 tracking-wider text-shadow-gritty text-white">BOARD RETREATS</h3>
                <p className="text-gray-200 mb-6 leading-relaxed font-montserrat">
                  Eric and Joe Quinn facilitate annual Board retreats to train commissioners and administration about governance issues 
                  and working as a team, as is absolutely crucial in the fire service and government in general.
                </p>
                <Button 
                  asChild 
                  className="bg-neon-orange text-white hover:bg-red-600 hover:text-white font-montserrat font-semibold uppercase tracking-wide hover:scale-105 transition-all duration-300 urban-shadow-lg"
                  data-testid="button-schedule-retreat"
                >
                  <Link href="/contact">
                    Schedule a Retreat
                  </Link>
                </Button>
              </div>
              <div className="mt-8 lg:mt-0">
                <div className="relative bg-urban-light urban-shadow-lg p-2" style={{ clipPath: 'polygon(0 0, 95% 0, 100% 95%, 5% 100%)' }}>
                  <div className="relative overflow-hidden" style={{ clipPath: 'polygon(0 0, 95% 0, 100% 95%, 5% 100%)' }}>
                    <img 
                      src="https://images.unsplash.com/photo-1529070538774-1843cb3265df?q=80&w=1170" 
                      alt="Fire department building" 
                      className="w-full h-64 object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent"></div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
