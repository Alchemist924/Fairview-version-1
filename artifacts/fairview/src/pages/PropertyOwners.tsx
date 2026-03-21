import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import addPropertyImg from "@assets/1772203784575_1774101672403.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

export default function PropertyOwners() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    type: "",
    location: "",
    description: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `Hello Fairview, I would like to list my property.
Name: ${formData.name}
Phone: ${formData.phone}
Property Type: ${formData.type}
Location: ${formData.location}
Description: ${formData.description}`;

    const url = `https://wa.me/2349164069005?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    setIsOpen(false);
  };

  return (
    <Layout>
      {/* Intro */}
      <section className="bg-primary text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">Partner with Fairview</h1>
          <p className="text-lg md:text-xl text-primary-foreground/80 leading-relaxed">
            Maximize your property's potential. We connect landlords and sellers with high-quality, verified clients while handling the marketing and legalities.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white"
          >
            <img
              src={addPropertyImg}
              alt="Steps to add property"
              className="w-full h-auto object-cover"
            />
          </motion.div>
          
          <div>
            <h2 className="text-3xl font-display font-bold mb-8 text-primary">How to List Your Property</h2>
            <div className="space-y-6 mb-10">
              {[
                "Submit your property details via our quick form.",
                "Our team will contact you to verify details and arrange an inspection.",
                "We professionally photograph and list your property on our network.",
                "We bring you verified buyers/renters and close the deal."
              ].map((step, i) => (
                <div key={i} className="flex gap-4 items-start bg-white p-4 rounded-xl shadow-sm border border-gray-50">
                  <div className="bg-accent/10 p-2 rounded-full mt-1">
                    <CheckCircle className="w-5 h-5 text-accent" />
                  </div>
                  <p className="text-lg font-medium text-gray-700">{step}</p>
                </div>
              ))}
            </div>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="w-full sm:w-auto px-8 py-6 text-lg rounded-xl shadow-xl shadow-primary/20">
                  Add Your Property Now
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-display text-primary">List Your Property</DialogTitle>
                  <DialogDescription>
                    Fill this quick form and our agents will contact you via WhatsApp immediately.
                  </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number (WhatsApp)</Label>
                    <Input id="phone" type="tel" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Property Type</Label>
                    <Select onValueChange={v => setFormData({...formData, type: v})} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Land">Land</SelectItem>
                        <SelectItem value="House/Duplex">House / Duplex</SelectItem>
                        <SelectItem value="Apartment">Apartment</SelectItem>
                        <SelectItem value="Commercial/Shop">Commercial / Shop</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location (City/State)</Label>
                    <Input id="location" required placeholder="e.g. Lekki, Lagos" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Brief Description</Label>
                    <Textarea id="description" required placeholder="Tell us about the size, features, and asking price..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                  </div>
                  <Button type="submit" className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white py-6 text-lg mt-4">
                    Submit via WhatsApp
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </section>

      {/* Closing */}
      <section className="bg-gray-50 py-20 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h3 className="text-2xl font-bold text-primary mb-4">Don't let your property sit empty.</h3>
          <p className="text-gray-600 mb-8">Join hundreds of smart landlords who trust Fairview to manage their listings with excellence and discretion.</p>
        </div>
      </section>
    </Layout>
  );
}
