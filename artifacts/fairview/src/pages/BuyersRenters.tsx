import { Layout } from "@/components/layout/Layout";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Building2, Home, Landmark, Store, ArrowRight } from "lucide-react";
import propertiesForSaleImg from "@assets/1771996029297_1774099972125.png";
import apartmentsForRentImg from "@assets/1771996059819_1774100076470.png";
import landsForSaleImg from "@assets/1771995931088_1774100153533.png";

export default function BuyersRenters() {
  const categories = [
    { title: "Properties for Sale", path: "/properties-for-sale", icon: Building2, color: "bg-blue-50 text-blue-600", image: propertiesForSaleImg },
    { title: "Apartments for Rent", path: "/apartments-for-rent", icon: Home, color: "bg-orange-50 text-orange-600", image: apartmentsForRentImg },
    { title: "Lands for Sale", path: "/lands-for-sale", icon: Landmark, color: "bg-green-50 text-green-600", image: landsForSaleImg },
    { title: "Shops for Lease", path: "/shops-for-lease", icon: Store, color: "bg-purple-50 text-purple-600", image: "https://images.unsplash.com/photo-1582036573752-fb51654e5659?w=600&q=80" },
  ];

  return (
    <Layout>
      <section className="bg-primary text-white pt-24 pb-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">Find Your Next Home or Space</h1>
          <p className="text-lg md:text-xl text-primary-foreground/80 leading-relaxed">
            Whether you are buying your first home, renting a cozy apartment, or securing a commercial space for your business, we make the search effortless.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 mb-24">
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100 flex flex-col md:flex-row gap-12 items-center">
          <div className="flex-1">
            <h2 className="text-3xl font-display font-bold text-primary mb-8">How to Find Property</h2>
            <div className="space-y-8">
              {[
                { step: "01", title: "Select a Category", desc: "Choose from our verified listings of lands, houses, apartments, or shops below." },
                { step: "02", title: "Review & Ask", desc: "View detailed photos, watch the virtual tour video, and read/ask questions in the comments section." },
                { step: "03", title: "Book Inspection", desc: "Click the Virtual or Physical inspection buttons to instantly connect with our agents on WhatsApp." }
              ].map((s) => (
                <div key={s.step} className="flex gap-6">
                  <div className="font-display text-4xl font-bold text-accent opacity-50 shrink-0">{s.step}</div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">{s.title}</h4>
                    <p className="text-gray-600">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1">
            <img 
              src={`${import.meta.env.BASE_URL}images/find-property.png`} 
              alt="Finding property" 
              className="w-full rounded-2xl shadow-md"
            />
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <h2 className="text-3xl font-display font-bold text-center text-primary mb-12">Browse by Category</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {categories.map((cat, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              key={cat.title}
            >
              <Link href={cat.path}>
                <div className="group relative overflow-hidden rounded-3xl aspect-[4/3] cursor-pointer">
                  <img src={cat.image} alt={cat.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                  
                  <div className="absolute bottom-0 left-0 w-full p-8 flex items-end justify-between">
                    <div>
                      <div className={`inline-flex p-3 rounded-2xl mb-4 ${cat.color} backdrop-blur-md bg-white/90 shadow-sm`}>
                        <cat.icon className="w-6 h-6" />
                      </div>
                      <h3 className="text-3xl font-display font-bold text-white">{cat.title}</h3>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-accent text-white flex items-center justify-center transform translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all">
                      <ArrowRight className="w-6 h-6" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </Layout>
  );
}
