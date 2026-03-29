export type ListingType = "rent" | "lease" | "sale";
export type PropertyCategory = "land" | "property" | "apartment" | "shop";

export type Review = {
  name: string;
  rating: number;
  text: string;
};

export interface Property {
  id: string;
  slug: string;
  title: string;
  category: PropertyCategory;
  listingType: ListingType;
  price: string;
  location: string;
  size: string;
  description: string;
  features: string[];
  mainImage: string;
  gallery: string[];
  videoUrl: string;
  reviews?: Review[];
}
