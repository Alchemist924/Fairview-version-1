import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Link, useLocation } from "wouter";
import { ArrowRight, Search, Key, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { SearchAutocompleteInput } from "@/components/SearchAutocompleteInput";
import { fetchPropertiesFromSupabase } from "@/lib/supabase-properties";
import type { Property } from "@/lib/mock-data";
import { trackMetaEvent } from "@/lib/meta-pixel";
import type { AutocompleteSuggestion } from "@/lib/search-engine";

const WHATSAPP_TESTIMONIALS = [
  { src: "images/whatsapp-review-1.jpg", alt: "WhatsApp feedback from a Fairview user" },
  { src: "images/whatsapp-review-2.jpg", alt: "WhatsApp feedback from a Fairview user" },
  { src: "images/whatsapp-review-3.jpg", alt: "WhatsApp feedback from a Fairview user" },
];

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

export default function Home() {
  const [emblaRef] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 5000 })]);
  const [, setLocation] = useLocation();
  const [heroSearch, setHeroSearch] = useState("");
  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    fetchPropertiesFromSupabase()
      .then(setProperties)
      .catch(() => {});
  }, []);

  const handleHeroSearch = (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    trackMetaEvent("Search", { search_string: trimmed });
    setLocation(`/properties-for-sale?search=${encodeURIComponent(trimmed)}`);
  };

  /**
   * Called when the user explicitly selects a suggestion from the dropdown.
   * Routes based on the suggestion's type and its pre-computed slug / route.
   */
  const handleSelectSuggestion = (suggestion: AutocompleteSuggestion) => {
    // Always fire the existing Search event — preserves Meta tracking
    trackMetaEvent("Search", {
      search_string: suggestion.text,
      content_category: suggestion.type === "category" ? suggestion.text : undefined,
    });

    if (suggestion.type === "property" && suggestion.slug) {
      // Individual property → open its detail page directly
      setLocation(`/property/${suggestion.slug}`);
    } else if (suggestion.type === "category" && suggestion.route) {
      // Named category → go to its canonical listing page
      setLocation(suggestion.route);
    } else {
      // Location or feature keyword → fall back to keyword search
      handleHeroSearch(suggestion.text);
    }
  };

  return (
    <Layout>
      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src={`${import.meta.env.BASE_URL}images/hero-city.png`} 
            alt="Nigerian Cityscape" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-white pt-20">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <p className="text-xl md:text-2xl font-semibold text-white mb-2 leading-snug">
              Own a property in Ile Ife? Let's put it in front of ready clients.
            </p>
            <p className="text-lg md:text-xl text-gray-200 mb-6 leading-relaxed max-w-xl">
              In need of a property or space? View trusted listings or get matching ones sent straight to your phone.
            </p>

            <div className="mb-8 max-w-xl">
              <form onSubmit={(e) => { e.preventDefault(); handleHeroSearch(heroSearch); }}>
                <SearchAutocompleteInput
                  value={heroSearch}
                  onChange={setHeroSearch}
                  onSearch={handleHeroSearch}
                  onSelectSuggestion={handleSelectSuggestion}
                  properties={properties}
                  placeholder="Search location, property type, bedrooms... (e.g. Ipetumodu, 4 bedroom, Fasina)"
                  className="text-gray-900 shadow-2xl"
                />
              </form>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <Link href="/buyers-renters">
                <Button size="lg" className="w-full sm:w-auto text-lg h-14 px-8 bg-accent hover:bg-accent/90 text-white border-none shadow-xl shadow-accent/20 rounded-xl">
                  <Search className="mr-2 w-5 h-5" />
                  Buyer / Renter
                </Button>
              </Link>
              <Link href="/property-owners">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg h-14 px-8 bg-white/10 hover:bg-white/20 text-white border-white/30 backdrop-blur-sm rounded-xl">
                  <Key className="mr-2 w-5 h-5" />
                  Property Owner
                </Button>
              </Link>
            </div>

            <div className="border-t border-white/20 pt-6 max-w-xl">
              <p className="text-base text-gray-300 leading-relaxed">
                We know you're busy — so we bring verified properties in Ife to one screen. Simple process, no exorbitant fees, transparent dealings.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl font-display font-bold text-primary mb-4">How Fairview Works</h2>
            <p className="text-muted-foreground text-lg">A simple, transparent process — whether you're listing or looking.</p>
          </div>

          {/* Buyers/Renters subsection */}
          <div className="mb-20">
            <div className="flex items-center gap-4 mb-10">
              <div className="flex-1 h-px bg-gray-200"></div>
              <div className="text-center">
                <span className="inline-block bg-accent/10 text-accent text-xs font-bold uppercase tracking-widest px-4 py-1 rounded-full mb-2">For Buyers & Renters</span>
                <h3 className="text-3xl font-display font-bold text-primary">Browse · Book · Buy</h3>
              </div>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            <div className="mb-10 rounded-2xl overflow-hidden shadow-md">
              <img
                src={`${import.meta.env.BASE_URL}images/browse-book-buy.png`}
                alt="Browse, Book and Buy with Fairview"
                className="w-full object-cover"
              />
            </div>

            <ol className="space-y-4 max-w-2xl mx-auto text-lg text-foreground">
              <li className="flex gap-3">
                <span className="font-bold text-accent shrink-0">1)</span>
                <span><span className="font-bold">Browse:</span> Explore available properties online.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-accent shrink-0">2)</span>
                <span><span className="font-bold">Book:</span> Book a physical or virtual inspection on your phone.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-accent shrink-0">3)</span>
                <span><span className="font-bold">Buy:</span> Rent or Buy after confirmation.</span>
              </li>
            </ol>
            <div className="flex justify-center mt-8">
              <Link href="/buyers-renters">
                <Button size="lg" className="text-lg h-14 px-8 bg-accent hover:bg-accent/90 text-white border-none shadow-xl shadow-accent/20 rounded-xl">
                  <Search className="mr-2 w-5 h-5" />
                  Buyer / Renter
                </Button>
              </Link>
            </div>
          </div>

          {/* Property Owners subsection */}
          <div>
            <div className="flex items-center gap-4 mb-10">
              <div className="flex-1 h-px bg-gray-200"></div>
              <div className="text-center">
                <span className="inline-block bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest px-4 py-1 rounded-full mb-2">For Property Owners</span>
                <h3 className="text-3xl font-display font-bold text-primary">List · Verify · Sell</h3>
              </div>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            <div className="mb-10 rounded-2xl overflow-hidden shadow-md">
              <img
                src={`${import.meta.env.BASE_URL}images/list-verify-sell.png`}
                alt="List, Verify and Sell with Fairview"
                className="w-full object-cover"
              />
            </div>

            <ol className="space-y-4 max-w-2xl mx-auto text-lg text-foreground">
              <li className="flex gap-3">
                <span className="font-bold text-primary shrink-0">1)</span>
                <span>Add your property details and book a convenient inspection time.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-primary shrink-0">2)</span>
                <span>We visit and capture your property professionally.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-primary shrink-0">3)</span>
                <span>Once ownership is confirmed, we begin marketing to serious buyers or renters.</span>
              </li>
            </ol>
            <div className="flex justify-center mt-8">
              <Link href="/property-owners">
                <Button size="lg" className="text-lg h-14 px-8 bg-primary hover:bg-primary/90 text-white border-none shadow-xl shadow-primary/20 rounded-xl">
                  <Key className="mr-2 w-5 h-5" />
                  Property Owner
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 bg-primary text-primary-foreground overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-14 text-center md:text-left">
            <h2 className="text-4xl font-display font-bold mb-3">Real Feedback From People We've Helped</h2>
            <p className="text-primary-foreground/80 text-lg md:text-xl font-medium">Reviews from Property owners, buyers and renters</p>
          </div>

          <div className="embla" ref={emblaRef}>
            <div className="embla__container flex items-stretch">
              {WHATSAPP_TESTIMONIALS.map((t, i) => (
                <div className="embla__slide flex-[0_0_85%] sm:flex-[0_0_70%] md:flex-[0_0_33.333%] pl-4 md:pl-6" key={i}>
                  <div className="bg-white/5 border border-white/10 rounded-3xl p-3 h-full backdrop-blur-md shadow-2xl hover:border-white/20 transition-all flex flex-col justify-center items-center">
                    <img
                      src={`${import.meta.env.BASE_URL}${t.src}`}
                      alt={t.alt}
                      loading="lazy"
                      className="w-full h-auto rounded-2xl object-contain max-h-[480px]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-12">
            <Link href="/buyers-renters">
              <Button size="lg" className="w-full sm:w-auto text-lg h-14 px-8 bg-accent hover:bg-accent/90 text-white border-none shadow-xl shadow-accent/20 rounded-xl">
                <Search className="mr-2 w-5 h-5" />
                Buyer / Renter
              </Button>
            </Link>
            <Link href="/property-owners">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg h-14 px-8 bg-white/10 hover:bg-white/20 text-white border-white/30 backdrop-blur-sm rounded-xl">
                <Key className="mr-2 w-5 h-5" />
                Property Owner
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ABOUT US */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <h2 className="text-4xl font-display font-bold text-primary mb-6">Registered & Verified</h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                We understand the real challenges of buying, selling or renting property in Ile Ife — because we've been there for years.
                We're not just here to showcase properties — we're here to make your journey simpler, less expensive and less stressful.
                Property transactions don't have to be complicated.
              </p>
              
              <div className="bg-white p-4 rounded-2xl shadow-md border border-gray-100 mb-8 max-w-sm">
                <img 
                  src={`${import.meta.env.BASE_URL}images/cac-cert.png`} 
                  alt="CAC Registration Certificate" 
                  className="w-full rounded-xl object-cover"
                />
                <p className="text-center text-xs font-medium text-gray-500 mt-3 uppercase tracking-wider">Official CAC Certification</p>
              </div>

              <Link href="/about">
                <Button className="rounded-full px-8 bg-primary hover:bg-primary/90">
                  Learn more about us <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </motion.div>
            
            <div className="flex flex-col gap-4 justify-center">
              <div className="bg-primary text-white p-8 rounded-3xl shadow-lg text-center">
                <h3 className="text-5xl font-display font-bold mb-2">100%</h3>
                <p className="text-sm font-medium text-white/70 uppercase tracking-wide">Verified Listings</p>
              </div>
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center">
                <h3 className="text-5xl font-display font-bold text-accent mb-2">24/7</h3>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Support Team</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
