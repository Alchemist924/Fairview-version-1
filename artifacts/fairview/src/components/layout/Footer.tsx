import { Link } from "wouter";
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-3">
               <div className="bg-white p-2 rounded-lg">
                <img 
                  src={`${import.meta.env.BASE_URL}images/logo.png`} 
                  alt="Fairview Logo" 
                  className="h-8 w-8 object-contain" 
                />
               </div>
              <span className="font-display font-bold text-2xl tracking-tight">Fairview.</span>
            </Link>
            <p className="text-primary-foreground/80 leading-relaxed text-sm">
              Your trusted partner in Nigerian real estate. We connect property owners with genuine buyers and renters seamlessly.
            </p>
            <div className="flex gap-4">
              <a href="#" className="bg-primary-foreground/10 p-2 rounded-full hover:bg-accent hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="bg-primary-foreground/10 p-2 rounded-full hover:bg-accent hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="bg-primary-foreground/10 p-2 rounded-full hover:bg-accent hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-bold text-lg mb-6 text-accent">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link href="/property-owners" className="text-primary-foreground/80 hover:text-accent transition-colors">For Property Owners</Link></li>
              <li><Link href="/buyers-renters" className="text-primary-foreground/80 hover:text-accent transition-colors">For Buyers & Renters</Link></li>
              <li><Link href="/properties-for-sale" className="text-primary-foreground/80 hover:text-accent transition-colors">Properties for Sale</Link></li>
              <li><Link href="/lands-for-sale" className="text-primary-foreground/80 hover:text-accent transition-colors">Lands for Sale</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-display font-bold text-lg mb-6 text-accent">Company</h4>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-primary-foreground/80 hover:text-accent transition-colors">About Us</Link></li>
              <li><Link href="/faqs" className="text-primary-foreground/80 hover:text-accent transition-colors">FAQs</Link></li>
              <li><a href="#" className="text-primary-foreground/80 hover:text-accent transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-primary-foreground/80 hover:text-accent transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-bold text-lg mb-6 text-accent">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-primary-foreground/80">
                <MapPin className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <span>Building beside Phiam Pharmacy, Parakin, Ile Ife, Osun State.</span>
              </li>
              <li className="flex items-center gap-3 text-primary-foreground/80">
                <Phone className="w-5 h-5 text-accent shrink-0" />
                <span>+234 800 000 0000</span>
              </li>
              <li className="flex items-center gap-3 text-primary-foreground/80">
                <Mail className="w-5 h-5 text-accent shrink-0" />
                <span>hello@fairviewrealty.ng</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-primary-foreground/20 text-center text-primary-foreground/60 text-sm">
          <p>© {new Date().getFullYear()} Fairview Realty. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
