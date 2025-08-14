import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    organization: "",
    subject: "",
    message: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // TODO: Implement contact form submission
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      toast({
        title: "Message sent successfully!",
        description: "We'll get back to you within 24 hours.",
      });
      
      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        organization: "",
        subject: "",
        message: ""
      });
    } catch (error) {
      toast({
        title: "Failed to send message",
        description: "Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div>
      <div className="bg-urban-dark py-16 urban-grid">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl lg:text-6xl font-bebas font-bold text-white mb-4 tracking-wider text-shadow-gritty">CONTACT US</h1>
          <p className="text-xl text-gray-200 font-montserrat">Ready to discuss your legal needs? We're here to help.</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-urban-gray urban-concrete min-h-screen">
        <div className="lg:grid lg:grid-cols-2 lg:gap-16">
          {/* Contact Form */}
          <Card className="p-8 bg-urban-medium border-neon-orange distressed-border urban-shadow-lg">
            <CardContent className="p-0">
              <h2 className="text-3xl lg:text-4xl font-bebas font-bold text-white mb-6 tracking-wider text-shadow-gritty">SEND US A MESSAGE</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="firstName" className="text-gray-100 font-montserrat">First Name</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-gray-100 font-montserrat">Last Name</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="email" className="text-gray-100 font-montserrat">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone" className="text-gray-100 font-montserrat">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="organization" className="text-gray-100 font-montserrat">Fire District/Organization</Label>
                  <Input
                    id="organization"
                    value={formData.organization}
                    onChange={(e) => handleInputChange("organization", e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="subject" className="text-gray-100 font-montserrat">Subject</Label>
                  <Select value={formData.subject} onValueChange={(value) => handleInputChange("subject", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a topic" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mergers">Mergers and Consolidations</SelectItem>
                      <SelectItem value="public-records">Public Records</SelectItem>
                      <SelectItem value="personnel">Personnel Matters</SelectItem>
                      <SelectItem value="hipaa">HIPAA Compliance</SelectItem>
                      <SelectItem value="meetings">Open Meetings</SelectItem>
                      <SelectItem value="financial">Financial Management</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="message" className="text-gray-100 font-montserrat">Message</Label>
                  <Textarea
                    id="message"
                    rows={6}
                    placeholder="Please describe your legal needs..."
                    value={formData.message}
                    onChange={(e) => handleInputChange("message", e.target.value)}
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-neon-orange text-white hover:bg-red-600 hover:text-white"
                >
                  {isLoading ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="mt-12 lg:mt-0 space-y-8">
            {/* Attorney Contact Cards */}
            <Card className="p-8 bg-urban-medium border-neon-orange distressed-border urban-shadow-lg">
              <CardContent className="p-0">
                <h3 className="text-2xl lg:text-3xl font-bebas font-bold text-white mb-6 tracking-wider text-shadow-gritty">CONTACT THE FIREHOUSE LAWYER TODAY!</h3>
                
                <div className="space-y-6">
                  <div className="border-b border-gray-200 pb-6">
                    <h4 className="text-xl font-bebas font-bold text-white mb-3 tracking-wider">ERIC T. QUINN</h4>
                    <div className="space-y-2">
                      <a href="tel:12535906628" className="flex items-center space-x-3 text-warm-gray hover:text-neon-orange transition-colors">
                        <Phone className="w-5 h-5" />
                        <span>(253) 590-6628</span>
                      </a>
                      <a href="mailto:ericquinn@firehouselawyer2.com" className="flex items-center space-x-3 text-warm-gray hover:text-neon-orange transition-colors">
                        <Mail className="w-5 h-5" />
                        <span>ericquinn@firehouselawyer2.com</span>
                      </a>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-xl font-bebas font-bold text-white mb-3 tracking-wider">JOSEPH F. QUINN, OF COUNSEL</h4>
                    <div className="space-y-2">
                      <a href="tel:12535763232" className="flex items-center space-x-3 text-warm-gray hover:text-neon-orange transition-colors">
                        <Phone className="w-5 h-5" />
                        <span>(253) 576-3232</span>
                      </a>
                      <a href="mailto:joequinn@firehouselawyer.com" className="flex items-center space-x-3 text-warm-gray hover:text-neon-orange transition-colors">
                        <Mail className="w-5 h-5" />
                        <span>joequinn@firehouselawyer.com</span>
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Office Location */}
            <Card className="p-8 bg-urban-medium border-neon-orange distressed-border urban-shadow-lg">
              <CardContent className="p-0">
                <h3 className="text-2xl lg:text-3xl font-bebas font-bold text-white mb-4 tracking-wider text-shadow-gritty">OFFICE LOCATION</h3>
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-neon-orange mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-100 font-montserrat">Mailing Address:</p>
                    <p className="text-gray-100 font-montserrat">7403 Lakewood Drive West, Suite # 11</p>
                    <p className="text-gray-100 font-montserrat">Lakewood, WA 98499-7951</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Office Hours */}
            <Card className="bg-fire-navy text-white p-8 border-neon-orange">
              <CardContent className="p-0">
                <h3 className="text-2xl lg:text-3xl font-bebas font-bold mb-4 tracking-wider text-shadow-gritty flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  OFFICE HOURS
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Monday - Friday:</span>
                    <span>8:00 AM - 5:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday:</span>
                    <span>By Appointment</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday:</span>
                    <span>Closed</span>
                  </div>
                </div>
                <p className="text-orange-100 text-sm mt-4">Emergency consultations available 24/7 for critical fire service matters.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
