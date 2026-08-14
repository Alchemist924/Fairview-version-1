import { useState, useEffect, useMemo } from "react";
import { ReactNode } from "react";
import { Link } from "wouter";
import { Layout } from "@/components/layout/Layout";
import { PropertyCard } from "@/components/PropertyCard";
import { EmptyListingState } from "@/components/EmptyListingState";
import { SearchAutocompleteInput } from "@/components/SearchAutocompleteInput";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Loader2, Search, RefreshCw, Landmark, Home, Building2, Store } from "lucide-react";
import { fetchPropertiesFromSupabase } from "@/lib/supabase-properties";
import { searchProperties } from "@/lib/search-engine";
import type { Property, PropertyCategory, ListingType } from "@/lib/mock-data";

const PAGE_SIZE = 6;

interface ListingPageProps {
  title: string;
  intro: ReactNode;
  filterCategory?: PropertyCategory;
  filterListingType?: ListingType;
  excludeCategory?: PropertyCategory;
}

export default function PropertyListingPage({
  title,
  intro,
  filterCategory,
  filterListingType,
  excludeCategory,
}: ListingPageProps) {
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize search from URL search parameters if available
  const [search, setSearch] = useState(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      return params.get("search") || "";
    }
    return "";
  });

  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchPropertiesFromSupabase()
      .then((props) => {
        setAllProperties(props);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Failed to load properties.");
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search, filterCategory, filterListingType, excludeCategory]);

  const categoryProperties = useMemo(() => {
    return allProperties
      .filter((p) => !filterCategory || p.category === filterCategory)
      .filter((p) => !excludeCategory || p.category !== excludeCategory)
      .filter((p) => !filterListingType || p.listingType === filterListingType);
  }, [allProperties, filterCategory, filterListingType, excludeCategory]);

  // Execute intelligent search engine scoring
  const searchResult = useMemo(() => {
    return searchProperties(categoryProperties, search);
  }, [categoryProperties, search]);

  const activePropertyList = searchResult.exactMatches.length > 0
    ? searchResult.exactMatches
    : searchResult.closeMatches;

  const isShowingCloseMatches = searchResult.exactMatches.length === 0 && searchResult.closeMatches.length > 0;

  const totalPages = Math.max(1, Math.ceil(activePropertyList.length / PAGE_SIZE));
  const paginated = activePropertyList.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <Layout>
      <div className="bg-gray-50 py-12 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-display font-bold text-primary mb-4">{title}</h1>
          <div className="text-lg text-muted-foreground mb-8 max-w-2xl">{intro}</div>

          <div className="max-w-2xl">
            <SearchAutocompleteInput
              value={search}
              onChange={setSearch}
              properties={allProperties}
              placeholder="Search by location, bedroom count, type (e.g. Ipetumodu, 4 bedroom, Fasina)"
            />
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {loading ? (
          <div className="flex justify-center items-center py-32">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-red-200">
            <h3 className="text-xl font-bold text-red-400">Could not load properties.</h3>
            <p className="text-sm text-muted-foreground mt-2">{error}</p>
          </div>
        ) : categoryProperties.length === 0 ? (
          <EmptyListingState categoryTitle={title} />
        ) : activePropertyList.length > 0 ? (
          <>
            {isShowingCloseMatches && (
              <div className="mb-10 p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-4">
                <div className="p-2 rounded-xl bg-amber-100 shrink-0">
                  <Search className="w-5 h-5 text-amber-700" />
                </div>
                <div>
                  <h4 className="font-bold text-base">No exact matches found for "{search}"</h4>
                  <p className="text-sm text-amber-800/90 mt-1">
                    Here are relevant property options in Ile-Ife that closely match your query:
                  </p>
                </div>
              </div>
            )}

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
              Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, activePropertyList.length)} of {activePropertyList.length} propert{activePropertyList.length === 1 ? "y" : "ies"}
            </p>
          </>
        ) : (
          <div className="text-center py-16 px-6 bg-white rounded-3xl border border-dashed border-gray-300 shadow-sm max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-gray-100 text-gray-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 opacity-60" />
            </div>
            <h3 className="text-2xl font-display font-bold text-gray-800 mb-2">No properties match your search</h3>
            <p className="text-muted-foreground mb-8">
              We couldn't find any properties matching <span className="font-semibold text-gray-700">"{search}"</span>.
            </p>

            <div className="space-y-4">
              <Button
                variant="default"
                onClick={() => setSearch("")}
                className="bg-primary hover:bg-primary/90 text-white rounded-xl h-12 px-6 gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Clear Search &amp; View All
              </Button>

              <div className="pt-6 border-t border-gray-100">
                <p className="text-xs uppercase tracking-wider font-semibold text-gray-400 mb-4">Explore by Category</p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Link href="/lands-for-sale">
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl border border-gray-200 transition-colors cursor-pointer">
                      <Landmark className="w-4 h-4 text-green-600" />
                      Lands for Sale
                    </span>
                  </Link>
                  <Link href="/apartments-for-rent">
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl border border-gray-200 transition-colors cursor-pointer">
                      <Home className="w-4 h-4 text-orange-600" />
                      Apartments for Rent
                    </span>
                  </Link>
                  <Link href="/properties-for-sale">
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl border border-gray-200 transition-colors cursor-pointer">
                      <Building2 className="w-4 h-4 text-blue-600" />
                      Properties for Sale
                    </span>
                  </Link>
                  <Link href="/shops-for-lease">
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl border border-gray-200 transition-colors cursor-pointer">
                      <Store className="w-4 h-4 text-purple-600" />
                      Shops for Lease
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
