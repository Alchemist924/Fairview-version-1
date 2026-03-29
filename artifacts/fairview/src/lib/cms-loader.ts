import type { Property, PropertyCategory, ListingType, Review } from "./mock-data";

type RawPropertyData = {
  slug: string;
  title: string;
  price: string;
  location: string;
  size: string;
  category: string;
  listingType: string;
  mainImage: string;
  gallery: unknown;
  videoUrl?: string;
  description: string;
  features: unknown;
  reviews?: Array<{ name: string; text: string; rating: number }>;
};

// Vite eagerly imports all JSON files from the content directory.
// In dev, HMR picks up new files automatically.
// In production, files are bundled at build time.
const modules = import.meta.glob<{ default: RawPropertyData }>(
  "../content/properties/*.json",
  { eager: true }
);

function normaliseStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => {
    if (typeof item === "string") return item;
    if (typeof item === "object" && item !== null) {
      // CMS list-with-fields produces objects; unwrap common keys
      const obj = item as Record<string, unknown>;
      return String(obj.image ?? obj.url ?? obj.feature ?? Object.values(obj)[0] ?? "");
    }
    return String(item);
  });
}

export function loadPropertiesFromCMS(): Property[] {
  return Object.values(modules).map((mod) => {
    const raw: RawPropertyData = (mod as { default: RawPropertyData }).default ?? (mod as unknown as RawPropertyData);

    const reviews: Review[] | undefined = Array.isArray(raw.reviews) && raw.reviews.length > 0
      ? raw.reviews.map((r) => ({
          name: String(r.name ?? ""),
          text: String(r.text ?? ""),
          rating: Number(r.rating ?? 5),
        }))
      : undefined;

    return {
      id: raw.slug,
      slug: raw.slug,
      title: raw.title,
      price: raw.price,
      location: raw.location,
      size: raw.size,
      category: raw.category as PropertyCategory,
      listingType: raw.listingType as ListingType,
      mainImage: raw.mainImage,
      gallery: normaliseStringArray(raw.gallery),
      videoUrl: raw.videoUrl ?? "",
      description: raw.description,
      features: normaliseStringArray(raw.features),
      reviews,
    } satisfies Property;
  });
}
