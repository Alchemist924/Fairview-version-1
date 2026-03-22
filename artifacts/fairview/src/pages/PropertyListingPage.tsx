import { useState } from "react";
import { ReactNode } from "react";
import { Layout } from "@/components/layout/Layout";
import { PropertyCard } from "@/components/PropertyCard";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { MOCK_PROPERTIES, MOCK_REVIEWS, PropertyCategory } from "@/lib/mock-data";

interface ListingPageProps {
  title: string;
  intro: ReactNode;
  category: PropertyCategory;
  showReviews?: boolean;
  hideComments?: boolean;
}

export default function PropertyListingPage({ title, intro, category, showReviews = false, hideComments = false }: ListingPageProps) {
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
          <div className="text-lg text-muted-foreground mb-8 max-w-2xl">{intro}</div>

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
            <PropertyCard
              key={prop.id}
              property={prop}
              reviews={showReviews ? MOCK_REVIEWS : undefined}
              hideComments={hideComments}
            />
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
