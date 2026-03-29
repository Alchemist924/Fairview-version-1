import { useState } from "react";
import { Link } from "wouter";
import { MapPin, Maximize, Star, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { Property, Review } from "@/lib/mock-data";
import { WhatsAppButton } from "./WhatsAppButton";
import { CommentSection } from "./CommentSection";

interface PropertyCardProps {
  property: Property;
  reviews?: Review[];
  hideComments?: boolean;
}

export function PropertyCard({ property, reviews, hideComments = false }: PropertyCardProps) {
  const [activeImage, setActiveImage] = useState(property.mainImage);
  const [reviewsOpen, setReviewsOpen] = useState(false);

  return (
    <div className="bg-card rounded-2xl overflow-hidden shadow-xl border border-border/50 transition-all hover:shadow-2xl">

      {/* Video — standalone full-width on top */}
      <div className="relative w-full aspect-video bg-black">
        <iframe
          src={property.videoUrl}
          title="Property Video Tour"
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
        <div className="absolute bottom-3 left-3 text-xs text-white font-medium bg-black/60 px-3 py-1 rounded-full backdrop-blur-sm">
          Video Tour
        </div>
      </div>

      {/* Image gallery row below video */}
      <div className="grid grid-cols-4 gap-1 bg-gray-100">
        <button
          onClick={() => setActiveImage(property.mainImage)}
          className="relative overflow-hidden group focus:outline-none h-32"
        >
          <img
            src={property.mainImage}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute top-2 left-2 bg-accent text-accent-foreground px-2 py-0.5 rounded-full text-xs font-bold shadow-md">
            {property.price}
          </div>
          {activeImage === property.mainImage && (
            <div className="absolute inset-0 ring-4 ring-inset ring-accent" />
          )}
        </button>

        {property.gallery.slice(0, 3).map((img, i) => (
          <button
            key={i}
            onClick={() => setActiveImage(img)}
            className="relative overflow-hidden group focus:outline-none h-32"
          >
            <img
              src={img}
              alt={`Gallery ${i + 1}`}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            {activeImage === img && (
              <div className="absolute inset-0 ring-4 ring-inset ring-accent" />
            )}
          </button>
        ))}
      </div>

      {/* Selected image preview */}
      <div className="relative w-full h-64 md:h-80 overflow-hidden bg-gray-200">
        <img
          src={activeImage}
          alt={property.title}
          className="w-full h-full object-cover transition-all duration-500"
        />
      </div>

      {/* Content */}
      <div className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
          <div>
            <Link href={`/property/${property.slug}`}>
              <h3 className="text-2xl font-display font-bold text-foreground mb-2 hover:text-accent transition-colors cursor-pointer inline-flex items-center gap-2 group">
                {property.title}
                <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-60 transition-opacity shrink-0" />
              </h3>
            </Link>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><MapPin className="w-4 h-4 text-accent" /> {property.location}</span>
              <span className="flex items-center gap-1"><Maximize className="w-4 h-4 text-accent" /> {property.size}</span>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
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
        </div>

        <div className="mb-8">
          <p className="text-muted-foreground leading-relaxed">{property.description}</p>
          <div className="flex flex-wrap gap-2 mt-4">
            {property.features.map(f => (
              <span key={f} className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-xs font-medium">
                {f}
              </span>
            ))}
          </div>
        </div>

        {/* Collapsible Tenant Reviews — shown only when reviews prop is provided */}
        {reviews && reviews.length > 0 && (
          <div className="border-t pt-6 mb-6">
            <button
              onClick={() => setReviewsOpen(prev => !prev)}
              className="flex items-center justify-between w-full group"
            >
              <div className="flex items-center gap-3">
                <h4 className="font-display font-bold text-lg">Verified Tenant Reviews</h4>
                <span className="text-xs bg-accent/10 text-accent font-semibold px-2 py-0.5 rounded-full">
                  {reviews.length}
                </span>
              </div>
              {reviewsOpen
                ? <ChevronUp className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                : <ChevronDown className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />}
            </button>

            {reviewsOpen && (
              <div className="mt-5 grid md:grid-cols-3 gap-4">
                {reviews.map((rev, i) => (
                  <div key={i} className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                    <div className="flex gap-1 mb-3">
                      {[...Array(rev.rating)].map((_, idx) => (
                        <Star key={idx} className="w-4 h-4 fill-accent text-accent" />
                      ))}
                    </div>
                    <p className="text-gray-700 text-sm mb-4">"{rev.text}"</p>
                    <p className="font-bold text-sm text-primary">{rev.name}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Comments */}
        {!hideComments && <CommentSection propertyId={property.id} />}
      </div>
    </div>
  );
}
