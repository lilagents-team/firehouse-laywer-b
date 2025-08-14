import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Phone, Mail, CheckCircle } from "lucide-react";
import ericQuinnPhoto from "../assets/images/eric-quinn.jpg";
import josephQuinnPhoto from "../assets/images/joseph-quinn.jpg";

export default function Attorneys() {
  return (
    <div>
      <div className="bg-fire-navy py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">Our Attorneys</h1>
          <p className="text-xl text-gray-200">Experienced legal professionals dedicated to serving the fire service community.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Eric T. Quinn */}
        <Card className="p-8 mb-12 border-neon-orange">
          <CardContent className="p-0">
            <div className="lg:grid lg:grid-cols-3 lg:gap-12 items-start">
              <div className="lg:col-span-2">
                <h2 className="text-3xl font-bold text-fire-navy mb-4">Eric T. Quinn</h2>
                <p className="text-lg text-fire-red font-semibold mb-6">Principal Attorney</p>
                
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-fire-navy mb-4">Personal Background</h3>
                  <p className="text-warm-gray mb-4 leading-relaxed">
                    Eric Quinn was born in University Place, Washington in 1982, and has lived in the Pacific Northwest his whole life, 
                    aside from a one-year stint in Michigan for law school. He graduated from Pacific Lutheran University in 2006. 
                    He is a member of the Rotary Club of Lakewood. Eric loves the outdoors and is also a performance artist. 
                    He does, however, spend most of his non-attorney time with family.
                  </p>
                </div>

                <div className="mb-8">
                  <h3 className="text-xl font-bold text-fire-navy mb-4">Legal Education</h3>
                  <p className="text-warm-gray mb-4 leading-relaxed">
                    Eric graduated from the Seattle University School of Law, where he was a finalist in the second-year mock trial competition. 
                    He worked as a legal intern throughout all three years of his law school career.
                  </p>
                </div>

                <div className="mb-8">
                  <h3 className="text-xl font-bold text-fire-navy mb-4">Legal Background</h3>
                  <p className="text-warm-gray mb-4 leading-relaxed">
                    During his first year of law school, Eric worked at the State Appellate Defender's Office (SADO) in Detroit, Michigan. 
                    At SADO, he analyzed boxes (and boxes) of case files to determine if individuals had been wrongfully convicted of crimes 
                    based on faulty DNA evidence. After transferring to Seattle University for his second year of law school, he worked at 
                    the law firm of Patterson, Buchanan, Fobes, Leitch and Kalzer, P.S.
                  </p>
                </div>

                <div className="mb-8">
                  <h3 className="text-xl font-bold text-fire-navy mb-4">Bar Admissions</h3>
                  <p className="text-warm-gray">State of Washington, 2014</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild className="bg-neon-orange hover:bg-red-600 text-white hover:text-white">
                    <a href="tel:12535906628">
                      <Phone className="w-5 h-5 mr-2" />
                      (253) 590-6628
                    </a>
                  </Button>
                  <Button asChild variant="outline" className="border-neon-orange text-white hover:bg-red-600 hover:text-white">
                    <a href="mailto:ericquinn@firehouselawyer2.com">
                      <Mail className="w-5 h-5 mr-2" />
                      Email Eric
                    </a>
                  </Button>
                </div>
              </div>
              <div className="mt-8 lg:mt-0">
                <div className="relative bg-urban-light urban-shadow-lg p-2" style={{ clipPath: 'polygon(0 0, 95% 0, 100% 95%, 5% 100%)' }}>
                  <div className="relative overflow-hidden" style={{ clipPath: 'polygon(0 0, 95% 0, 100% 95%, 5% 100%)' }}>
                    <img 
                      src={ericQuinnPhoto} 
                      alt="Eric T. Quinn" 
                      className="w-full h-80 object-cover object-center"
                    />
                    <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h3 className="text-xl font-bebas font-bold tracking-wide text-shadow-gritty">ERIC T. QUINN</h3>
                      <p className="text-neon-orange font-montserrat font-semibold text-shadow-gritty">Principal Attorney</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Joseph F. Quinn */}
        <Card className="p-8 border-neon-orange">
          <CardContent className="p-0">
            <div className="lg:grid lg:grid-cols-3 lg:gap-12 items-start">
              <div className="order-2 lg:order-1 mt-8 lg:mt-0">
                <div className="relative bg-urban-light urban-shadow-lg p-2" style={{ clipPath: 'polygon(0 0, 95% 0, 100% 95%, 5% 100%)' }}>
                  <div className="relative overflow-hidden" style={{ clipPath: 'polygon(0 0, 95% 0, 100% 95%, 5% 100%)' }}>
                    <img 
                      src={josephQuinnPhoto} 
                      alt="Joseph F. Quinn" 
                      className="w-full h-80 object-cover object-center"
                    />
                    <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h3 className="text-xl font-bebas font-bold tracking-wide text-shadow-gritty">JOSEPH F. QUINN</h3>
                      <p className="text-neon-orange font-montserrat font-semibold text-shadow-gritty">Of Counsel</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-2 order-1 lg:order-2">
                <h2 className="text-3xl font-bold text-fire-navy mb-4">Joseph F. Quinn</h2>
                <p className="text-lg text-neon-orange font-semibold mb-6">Of Counsel</p>
                
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-fire-navy mb-4">Experience & Background</h3>
                  <p className="text-warm-gray mb-4 leading-relaxed">
                    Joseph F. Quinn represents virtually all of the Pierce County fire districts, among various other fire districts 
                    and regional fire authorities, along with 911 dispatch centers. He has argued before the United States Supreme Court. 
                    His extensive litigation and appellate experience, and his years spent as a commissioner of the Public Employment 
                    Relations Commission (appointed by Governor Booth Gardner, in 1986) is quite useful in this practice.
                  </p>
                </div>

                <div className="mb-8">
                  <h3 className="text-xl font-bold text-fire-navy mb-4">Notable Achievements</h3>
                  <ul className="text-warm-gray space-y-2">
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-5 h-5 text-neon-orange mt-0.5 flex-shrink-0" />
                      <span>Argued before the United States Supreme Court</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-5 h-5 text-neon-orange mt-0.5 flex-shrink-0" />
                      <span>Former Commissioner, Public Employment Relations Commission</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-5 h-5 text-neon-orange mt-0.5 flex-shrink-0" />
                      <span>Represents virtually all Pierce County fire districts</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-5 h-5 text-neon-orange mt-0.5 flex-shrink-0" />
                      <span>Extensive litigation and appellate experience</span>
                    </li>
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild className="bg-neon-orange hover:bg-red-600 text-white hover:text-white">
                    <a href="tel:12535763232">
                      <Phone className="w-5 h-5 mr-2" />
                      (253) 576-3232
                    </a>
                  </Button>
                  <Button asChild variant="outline" className="border-neon-orange text-white hover:bg-red-600 hover:text-white">
                    <a href="mailto:joequinn@firehouselawyer.com">
                      <Mail className="w-5 h-5 mr-2" />
                      Email Joe
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
