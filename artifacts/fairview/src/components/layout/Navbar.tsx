import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Home, User, Building2, Landmark, Store, Key, HelpCircle, Info, LogIn, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { motion, AnimatePresence } from "framer-motion";

const LINKS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/property-owners", label: "Property Owners", icon: Key },
  { href: "/buyers-renters", label: "Buyers/Renters", icon: User },
  { href: "/lands-for-sale", label: "Lands for Sale", icon: Landmark },
  { href: "/properties-for-sale", label: "Properties for Sale", icon: Building2 },
  { href: "/apartments-for-rent", label: "Apartments for Rent", icon: Home },
  { href: "/shops-for-lease", label: "Shops for Lease", icon: Store },
  { href: "/faqs", label: "FAQs", icon: HelpCircle },
  { href: "/about", label: "About Fairview", icon: Info },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-border/50" : "bg-white"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <img 
              src={`${import.meta.env.BASE_URL}images/logo.png`} 
              alt="Fairview" 
              className="h-10 w-10 object-contain group-hover:scale-105 transition-transform" 
            />
            <span className="font-display font-bold text-2xl text-primary tracking-tight">Fairview</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden xl:flex items-center gap-1">
            {LINKS.slice(0, 5).map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  location === link.href 
                    ? "bg-primary/5 text-primary" 
                    : "text-muted-foreground hover:text-primary hover:bg-gray-50"
                }`}
              >
                {link.label}
              </Link>
            ))}
            
            {/* Dropdown for remaining links to save space */}
            <div className="relative group">
              <button className="px-4 py-2 rounded-full text-sm font-medium text-muted-foreground hover:text-primary hover:bg-gray-50 flex items-center gap-1">
                More <span className="text-xs">▼</span>
              </button>
              <div className="absolute top-full right-0 w-48 bg-white shadow-xl rounded-xl border border-border/50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all translate-y-2 group-hover:translate-y-0 pt-2 pb-2">
                {LINKS.slice(5).map((link) => (
                  <Link 
                    key={link.href} 
                    href={link.href}
                    className={`block px-4 py-2 text-sm ${
                      location === link.href ? "bg-primary/5 text-primary font-medium" : "text-gray-600 hover:bg-gray-50 hover:text-primary"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </nav>

          {/* Auth Button Desktop */}
          <div className="hidden xl:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-primary">Hi, {user.username}</span>
                <Button variant="outline" size="sm" onClick={() => logout()} className="rounded-full">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <Link href="/login">
                <Button className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-all">
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="xl:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-primary hover:bg-gray-100 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="xl:hidden bg-white border-t border-gray-100 overflow-hidden shadow-xl absolute w-full"
          >
            <div className="px-4 pt-2 pb-6 space-y-1 max-h-[80vh] overflow-y-auto">
              {LINKS.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                      location === link.href
                        ? "bg-primary/10 text-primary"
                        : "text-gray-700 hover:bg-gray-50 hover:text-primary"
                    }`}
                  >
                    <Icon className="w-5 h-5 opacity-70" />
                    {link.label}
                  </Link>
                );
              })}
              
              <div className="pt-4 mt-4 border-t border-gray-100 px-4">
                {user ? (
                  <Button variant="destructive" className="w-full justify-start" onClick={() => logout()}>
                    <LogOut className="w-5 h-5 mr-3" />
                    Logout ({user.username})
                  </Button>
                ) : (
                  <Link href="/login" className="block">
                    <Button className="w-full justify-start bg-primary text-primary-foreground">
                      <LogIn className="w-5 h-5 mr-3" />
                      Sign In / Register
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
