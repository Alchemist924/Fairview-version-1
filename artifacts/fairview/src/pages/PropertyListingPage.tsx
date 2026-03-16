import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { PropertyCard } from "@/components/PropertyCard";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { MOCK_PROPERTIES, MOCK_REVIEWS, PropertyCategory } from "@/lib/mock-data";
import { Star } from "lucide-react";

interface ListingPageProps {
  title: string;
  intro: string;
  category: PropertyCategory;
  showReviews?: boolean;
}

export default function PropertyListingPage({ title, intro, category, showReviews = false }: ListingPageProps) {
  const [search, setSearch] = useState("");
  
  const properties = MOCK_PROPERTIES.filter(p => p.category === category);
  const filtered = properties.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase()) || 
    p.location.toLowerCase().includes(search.toLowerCase()) ||
    p.price.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <div className="bg-gray-50 py-12 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-display font-bold text-primary mb-4">{title}</h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl">{intro}</p>
          
          <div className="relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input 
              placeholder="Search by location, price, or keyword..." 
              className="pl-12 h-14 rounded-2xl bg-white border-gray-200 shadow-sm text-lg focus-visible:ring-accent"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {filtered.length > 0 ? (
          filtered.map(prop => (
            <div key={prop.id}>
              <PropertyCard property={prop} />
              
              {showReviews && (
                <div className="mt-8 bg-white p-8 rounded-2xl border shadow-sm">
                  <h4 className="font-display font-bold text-xl mb-6">Verified Tenant Reviews</h4>
                  <div className="grid md:grid-cols-3 gap-6">
                    {MOCK_REVIEWS.map((rev, i) => (
                      <div key={i} className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                        <div className="flex gap-1 mb-3">
                          {[...Array(rev.rating)].map((_, idx) => <Star key={idx} className="w-4 h-4 fill-accent text-accent" />)}
                        </div>
                        <p className="text-gray-700 text-sm mb-4">"{rev.text}"</p>
                        <p className="font-bold text-sm text-primary">{rev.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
            <h3 className="text-xl font-bold text-gray-400">No properties found matching your search.</h3>
          </div>
        )}
      </div>
    </Layout>
  );
}
