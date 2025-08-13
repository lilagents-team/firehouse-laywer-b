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
      <div className="bg-fire-navy py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">Contact Us</h1>
          <p className="text-xl text-gray-200">Ready to discuss your legal needs? We're here to help.</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="lg:grid lg:grid-cols-2 lg:gap-16">
          {/* Contact Form */}
          <Card className="p-8">
            <CardContent className="p-0">
              <h2 className="text-2xl font-bold text-fire-navy mb-6">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="organization">Fire District/Organization</Label>
                  <Input
                    id="organization"
                    value={formData.organization}
                    onChange={(e) => handleInputChange("organization", e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="subject">Subject</Label>
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
                  <Label htmlFor="message">Message</Label>
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
                  className="w-full bg-fire-red hover:bg-red-700"
                >
                  {isLoading ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="mt-12 lg:mt-0 space-y-8">
            {/* Attorney Contact Cards */}
            <Card className="p-8">
              <CardContent className="p-0">
                <h3 className="text-xl font-bold text-fire-navy mb-6">Contact the Firehouse Lawyer Today!</h3>
                
                <div className="space-y-6">
                  <div className="border-b border-gray-200 pb-6">
                    <h4 className="font-bold text-fire-navy mb-3">Eric T. Quinn</h4>
                    <div className="space-y-2">
                      <a href="tel:12535906628" className="flex items-center space-x-3 text-warm-gray hover:text-fire-red transition-colors">
                        <Phone className="w-5 h-5" />
                        <span>(253) 590-6628</span>
                      </a>
                      <a href="mailto:ericquinn@firehouselawyer2.com" className="flex items-center space-x-3 text-warm-gray hover:text-fire-red transition-colors">
                        <Mail className="w-5 h-5" />
                        <span>ericquinn@firehouselawyer2.com</span>
                      </a>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-fire-navy mb-3">Joseph F. Quinn, Of Counsel</h4>
                    <div className="space-y-2">
                      <a href="tel:12535763232" className="flex items-center space-x-3 text-warm-gray hover:text-fire-red transition-colors">
                        <Phone className="w-5 h-5" />
                        <span>(253) 576-3232</span>
                      </a>
                      <a href="mailto:joequinn@firehouselawyer.com" className="flex items-center space-x-3 text-warm-gray hover:text-fire-red transition-colors">
                        <Mail className="w-5 h-5" />
                        <span>joequinn@firehouselawyer.com</span>
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Office Location */}
            <Card className="p-8">
              <CardContent className="p-0">
                <h3 className="text-xl font-bold text-fire-navy mb-4">Office Location</h3>
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-fire-red mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-fire-navy">Mailing Address:</p>
                    <p className="text-warm-gray">7403 Lakewood Drive West, Suite # 11</p>
                    <p className="text-warm-gray">Lakewood, WA 98499-7951</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Office Hours */}
            <Card className="bg-fire-navy text-white p-8">
              <CardContent className="p-0">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  Office Hours
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
                <p className="text-red-100 text-sm mt-4">Emergency consultations available 24/7 for critical fire service matters.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
