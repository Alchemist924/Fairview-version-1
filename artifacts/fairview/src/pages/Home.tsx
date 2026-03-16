import { Layout } from "@/components/layout/Layout";
import { Link } from "wouter";
import { ArrowRight, Search, Key, Building, CheckCircle2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

const TESTIMONIALS = [
  { name: "Oluwaseun Adebayo", role: "Home Buyer", text: "Fairview made finding my dream home in Lekki incredibly easy. Their transparent process gave me absolute peace of mind." },
  { name: "Chika Nwosu", role: "Property Investor", text: "As an investor, I need reliable data and quick inspections. Fairview's team is top-notch, responsive, and deeply knowledgeable." },
  { name: "Emeka Ofor", role: "Landlord", text: "Listing my properties on Fairview increased my occupancy rate to 100% within a month. Highly recommended for property owners." },
  { name: "Aisha Mohammed", role: "Tenant", text: "Found a beautiful apartment in Abuja through their platform. The virtual inspection saved me so much time!" },
];

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

export default function Home() {
  const [emblaRef] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 5000 })]);

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
            <span className="inline-block py-1 px-3 rounded-full bg-accent/20 text-accent font-semibold text-sm mb-6 backdrop-blur-sm border border-accent/30">
              Nigeria's Premium Real Estate Platform
            </span>
            <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight mb-6">
              Find your perfect space, <span className="text-accent">hassle-free.</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-10 leading-relaxed max-w-xl">
              Whether you're looking to buy, rent, or list your property, Fairview connects you with genuine opportunities across Nigeria.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
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
          </motion.div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-display font-bold text-primary mb-4">How Fairview Works</h2>
            <p className="text-muted-foreground text-lg">A simple, transparent process designed to get you the keys faster.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Search, title: "1. Search & Discover", desc: "Browse our curated list of verified lands, homes, and commercial spaces across Nigeria." },
              { icon: Building, title: "2. Inspect with Ease", desc: "Request a virtual tour immediately or schedule a physical inspection via WhatsApp." },
              { icon: CheckCircle2, title: "3. Close the Deal", desc: "Negotiate directly and finalize your paperwork securely with our trusted agents." }
            ].map((step, i) => (
              <motion.div 
                key={i}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={fadeIn}
                className="bg-gray-50 rounded-3xl p-8 border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1 group"
              >
                <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-colors">
                  <step.icon className="w-6 h-6 text-primary group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 bg-primary text-primary-foreground overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-4xl font-display font-bold mb-4">Trusted by Thousands</h2>
              <p className="text-primary-foreground/80 text-lg">Don't just take our word for it. Here's what our clients have to say based on their Google Reviews.</p>
            </div>
            <div className="flex items-center gap-1 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
              <Star className="w-5 h-5 fill-accent text-accent" />
              <Star className="w-5 h-5 fill-accent text-accent" />
              <Star className="w-5 h-5 fill-accent text-accent" />
              <Star className="w-5 h-5 fill-accent text-accent" />
              <Star className="w-5 h-5 fill-accent text-accent" />
              <span className="ml-2 font-bold">4.9/5 Average</span>
            </div>
          </div>

          <div className="embla" ref={emblaRef}>
            <div className="embla__container flex">
              {TESTIMONIALS.map((t, i) => (
                <div className="embla__slide flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.333%] pl-6" key={i}>
                  <div className="bg-white/5 border border-white/10 p-8 rounded-3xl h-full backdrop-blur-md">
                    <div className="flex gap-1 mb-6">
                      {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 fill-accent text-accent" />)}
                    </div>
                    <p className="text-lg leading-relaxed mb-8 italic">"{t.text}"</p>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-orange-400 flex items-center justify-center font-bold text-lg shadow-inner">
                        {t.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-white">{t.name}</h4>
                        <p className="text-sm text-primary-foreground/60">{t.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
                Fairview Realty is a fully registered and legally recognized real estate firm in Nigeria. 
                We prioritize absolute transparency, legal compliance, and customer security in every transaction. 
                Your investments are safe with a team that operates strictly by the books.
              </p>
              
              <div className="bg-white p-4 rounded-2xl shadow-md border border-gray-100 mb-8 max-w-sm transform -rotate-2 hover:rotate-0 transition-transform duration-300">
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
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4 pt-12">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 text-center">
                  <h3 className="text-4xl font-display font-bold text-accent mb-2">500+</h3>
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Properties Sold</p>
                </div>
                <div className="bg-primary text-white p-6 rounded-3xl shadow-lg text-center">
                  <h3 className="text-4xl font-display font-bold mb-2">100%</h3>
                  <p className="text-sm font-medium text-white/70 uppercase tracking-wide">Verified Listings</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 text-center">
                  <h3 className="text-4xl font-display font-bold text-accent mb-2">1k+</h3>
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Happy Tenants</p>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 text-center">
                  <h3 className="text-4xl font-display font-bold text-accent mb-2">24/7</h3>
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Support Team</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
