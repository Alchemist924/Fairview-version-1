import { useState, useEffect, useMemo } from "react";
import { ReactNode } from "react";
import { Layout } from "@/components/layout/Layout";
import { PropertyCard } from "@/components/PropertyCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { loadPropertiesFromCMS } from "@/lib/cms-loader";
import type { Property, PropertyCategory, ListingType } from "@/lib/mock-data";

const PAGE_SIZE = 6;

interface ListingPageProps {
  title: string;
  intro: ReactNode;
  filterCategory?: PropertyCategory;
  filterListingType?: ListingType;
}

export default function PropertyListingPage({
  title,
  intro,
  filterCategory,
  filterListingType,
}: ListingPageProps) {
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    // loadPropertiesFromCMS is synchronous (import.meta.glob eager)
    // but wrapped in useEffect so state updates work correctly
    const props = loadPropertiesFromCMS();
    setAllProperties(props);
    setLoading(false);
  }, []);

  // Reset to first page whenever filters or search changes
  useEffect(() => {
    setPage(1);
  }, [search, filterCategory, filterListingType]);

  const filtered = useMemo(() => {
    return allProperties
      .filter((p) => !filterCategory || p.category === filterCategory)
      .filter((p) => !filterListingType || p.listingType === filterListingType)
      .filter((p) => {
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return (
          p.title.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q) ||
          p.price.toLowerCase().includes(q)
        );
      });
  }, [allProperties, filterCategory, filterListingType, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

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
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {loading ? (
          <div className="flex justify-center items-center py-32">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : paginated.length > 0 ? (
          <>
            <div className="space-y-16">
              {paginated.map((prop) => (
                <PropertyCard
                  key={prop.slug}
                  property={prop}
                  reviews={prop.reviews}
                  hideComments={prop.listingType === "rent" || prop.listingType === "lease"}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-16 flex items-center justify-center gap-4">
                <Button
                  variant="outline"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="rounded-xl h-11 px-5 gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>

                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                    <button
                      key={n}
                      onClick={() => setPage(n)}
                      className={`w-10 h-10 rounded-full text-sm font-semibold transition-colors ${
                        n === page
                          ? "bg-primary text-white"
                          : "text-gray-500 hover:bg-gray-100"
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="rounded-xl h-11 px-5 gap-2"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}

            <p className="text-center text-sm text-muted-foreground mt-4">
              Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} propert{filtered.length === 1 ? "y" : "ies"}
            </p>
          </>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
            <h3 className="text-xl font-bold text-gray-400">No properties found matching your search.</h3>
          </div>
        )}
      </div>
    </Layout>
  );
}
