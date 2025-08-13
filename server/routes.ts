import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";

const contactFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  organization: z.string().optional(),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

const newsletterSubscriptionSchema = z.object({
  email: z.string().email("Valid email is required"),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Contact form submission
  app.post("/api/contact", async (req, res) => {
    try {
      const data = contactFormSchema.parse(req.body);
      
      // TODO: Implement email sending logic using nodemailer or similar
      // For now, we'll just log the contact form submission
      console.log("Contact form submission:", data);
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 500));
      
      res.json({ 
        success: true, 
        message: "Your message has been sent successfully. We'll get back to you within 24 hours." 
      });
    } catch (error) {
      console.error("Contact form error:", error);
      res.status(400).json({ 
        success: false, 
        message: "There was an error sending your message. Please try again." 
      });
    }
  });

  // Newsletter subscription
  app.post("/api/newsletter/subscribe", async (req, res) => {
    try {
      const data = newsletterSubscriptionSchema.parse(req.body);
      
      // TODO: Implement newsletter subscription logic
      // This could integrate with email marketing services like Mailchimp, ConvertKit, etc.
      console.log("Newsletter subscription:", data);
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 500));
      
      res.json({ 
        success: true, 
        message: "Successfully subscribed to the newsletter!" 
      });
    } catch (error) {
      console.error("Newsletter subscription error:", error);
      res.status(400).json({ 
        success: false, 
        message: "There was an error subscribing to the newsletter. Please try again." 
      });
    }
  });

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  const httpServer = createServer(app);
  return httpServer;
}
