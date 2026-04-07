import { useMemo } from "react";
import { useParams, Link } from "wouter";
import { Layout } from "@/components/layout/Layout";
import { loadPropertiesFromCMS } from "@/lib/cms-loader";
import { MapPin, Maximize, ArrowLeft, Tag, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { CommentSection } from "@/components/CommentSection";

const PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23e5e7eb'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af' font-size='16' font-family='sans-serif'%3ENo Image%3C/text%3E%3C/svg%3E";

function getEmbedUrl(url: string): string {
  if (!url) return "";
  if (url.includes("/embed/")) return url;
  const match = url.match(/[?&]v=([^&]+)/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : url;
}

const CATEGORY_LABELS: Record<string, string> = {
  apartment: "Apartment",
  shop: "Shop / Commercial",
  land: "Land",
  property: "House / Property",
};

const LISTING_TYPE_LABELS: Record<string, string> = {
  rent: "For Rent",
  lease: "For Lease",
  sale: "For Sale",
};

const LISTING_TYPE_COLOURS: Record<string, string> = {
  rent: "bg-blue-100 text-blue-700",
  lease: "bg-purple-100 text-purple-700",
  sale: "bg-green-100 text-green-700",
};

export default function PropertyDetail() {
  const { slug } = useParams<{ slug: string }>();

  const property = useMemo(() => {
    const all = loadPropertiesFromCMS();
    return all.find((p) => p.slug === slug) ?? null;
  }, [slug]);

  if (!property) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 px-4">
          <div className="text-center">
            <h1 className="text-3xl font-display font-bold text-primary mb-3">
              Property not found
            </h1>
            <p className="text-muted-foreground mb-8">
              The property you're looking for doesn't exist or may have been removed.
            </p>
            <Link href="/">
              <Button className="rounded-xl gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  console.log("[PropertyDetail]", property.slug, {
    mainImage: property.mainImage,
    gallery: property.gallery,
    videoUrl: property.videoUrl,
  });

  const embedUrl = getEmbedUrl(property.videoUrl);

  return (
    <Layout>
      {/* Back navigation */}
      <div className="bg-gray-50 border-b py-4">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to listings
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-card rounded-2xl overflow-hidden shadow-xl border border-border/50">

          {/* Hero image */}
          <div className="relative w-full h-72 md:h-96 overflow-hidden bg-gray-200">
            <img
              src={property.mainImage || PLACEHOLDER}
              alt={property.title}
              className="w-full h-full object-cover"
              onError={(e) => { (e.currentTarget as HTMLImageElement).src = PLACEHOLDER; }}
            />
            {/* Price badge */}
            <div className="absolute top-4 left-4 bg-accent text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg">
              {property.price}
            </div>
          </div>

          {/* Gallery strip */}
          {property.gallery.length > 0 && (
            <div className="grid grid-cols-3 gap-1 bg-gray-100">
              {property.gallery.slice(0, 3).map((img, i) => (
                <div key={i} className="overflow-hidden h-28">
                  <img
                    src={img || PLACEHOLDER}
                    alt={`Gallery ${i + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = PLACEHOLDER; }}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Video tour */}
          {embedUrl && (
            <div className="relative w-full aspect-video bg-black">
              <iframe
                src={embedUrl}
                title="Property Video Tour"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
              <div className="absolute bottom-3 left-3 text-xs text-white font-medium bg-black/60 px-3 py-1 rounded-full backdrop-blur-sm">
                Video Tour
              </div>
            </div>
          )}

          {/* Detail body */}
          <div className="p-6 md:p-10">

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                <Home className="w-3.5 h-3.5" />
                {CATEGORY_LABELS[property.category] ?? property.category}
              </span>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${LISTING_TYPE_COLOURS[property.listingType] ?? "bg-gray-100 text-gray-700"}`}>
                <Tag className="w-3.5 h-3.5" />
                {LISTING_TYPE_LABELS[property.listingType] ?? property.listingType}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              {property.title}
            </h1>

            {/* Price */}
            <p className="text-2xl font-bold text-accent mb-6">{property.price}</p>

            {/* Meta info */}
            <div className="flex flex-wrap gap-6 text-sm text-muted-foreground mb-8 pb-8 border-b">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-accent shrink-0" />
                {property.location}
              </span>
              <span className="flex items-center gap-1.5">
                <Maximize className="w-4 h-4 text-accent shrink-0" />
                {property.size}
              </span>
            </div>

            {/* Description */}
            {property.description && (
              <div className="mb-8">
                <h2 className="text-lg font-display font-bold text-primary mb-3">About this property</h2>
                <p className="text-muted-foreground leading-relaxed" style={{ whiteSpace: "pre-line" }}>{property.description ?? ""}</p>
              </div>
            )}

            {/* Features */}
            {property.features.length > 0 && (
              <div className="mb-10">
                <h2 className="text-lg font-display font-bold text-primary mb-3">Features</h2>
                <div className="flex flex-wrap gap-2">
                  {property.features.map((f) => (
                    <span
                      key={f}
                      className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-xs font-medium"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Inspection buttons */}
            <div className="flex flex-wrap gap-3 pt-6 border-t mb-10">
              <WhatsAppButton
                label="Virtual Inspection"
                variant="outline"
                message={`Hi,\nI would like to book an inspection\nProperty: ${property.title}\nLocation: ${property.location}\nBooking Type: Virtual Inspection`}
              />
              <WhatsAppButton
                label="Physical Inspection"
                variant="accent"
                message={`Hi,\nI would like to book an inspection\nProperty: ${property.title}\nLocation: ${property.location}\nBooking Type: Physical Inspection`}
              />
            </div>

            {/* Comments */}
            <CommentSection propertyId={property.slug} />
          </div>
        </div>
      </div>
    </Layout>
  );
}
