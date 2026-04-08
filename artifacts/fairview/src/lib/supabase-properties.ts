import { supabase } from "./supabase";
import type { Property } from "./mock-data";

type Review = { name: string; text: string; rating: number };

type PropertyRow = {
  id: string;
  slug: string;
  title: string;
  price: string;
  location: string;
  size: string;
  category: string;
  listing_type: string;
  main_image: string;
  gallery: string[];
  video_url: string;
  description: string;
  features: string[];
  reviews: Review[];
  created_at: string;
};

function rowToProperty(row: PropertyRow): Property {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    price: row.price,
    location: row.location,
    size: row.size,
    category: row.category as Property["category"],
    listingType: row.listing_type as Property["listingType"],
    mainImage: row.main_image ?? "",
    gallery: row.gallery ?? [],
    videoUrl: row.video_url ?? "",
    description: row.description ?? "",
    features: row.features ?? [],
    reviews: row.reviews?.length ? row.reviews : undefined,
  };
}

export async function fetchPropertiesFromSupabase(): Promise<Property[]> {
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data as PropertyRow[]).map(rowToProperty);
}

export async function fetchPropertyBySlug(slug: string): Promise<Property | null> {
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) return null;
  return rowToProperty(data as PropertyRow);
}

export async function createProperty(
  property: Omit<Property, "id">
): Promise<Property> {
  const { data, error } = await supabase
    .from("properties")
    .insert({
      slug: property.slug,
      title: property.title,
      price: property.price,
      location: property.location,
      size: property.size,
      category: property.category,
      listing_type: property.listingType,
      main_image: property.mainImage,
      gallery: property.gallery,
      video_url: property.videoUrl,
      description: property.description,
      features: property.features,
      reviews: property.reviews ?? [],
    })
    .select()
    .single();

  if (error) throw error;
  return rowToProperty(data as PropertyRow);
}

export async function updateProperty(
  slug: string,
  property: Omit<Property, "id">
): Promise<Property> {
  const { data, error } = await supabase
    .from("properties")
    .update({
      slug: property.slug,
      title: property.title,
      price: property.price,
      location: property.location,
      size: property.size,
      category: property.category,
      listing_type: property.listingType,
      main_image: property.mainImage,
      gallery: property.gallery,
      video_url: property.videoUrl,
      description: property.description,
      features: property.features,
      reviews: property.reviews ?? [],
    })
    .eq("slug", slug)
    .select()
    .single();

  if (error) throw error;
  return rowToProperty(data as PropertyRow);
}

export async function deleteProperty(slug: string): Promise<void> {
  const { error } = await supabase.from("properties").delete().eq("slug", slug);
  if (error) throw error;
}

export async function uploadPropertyImage(file: File): Promise<string> {
  const ext = file.name.split(".").pop() ?? "jpg";
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { data, error } = await supabase.storage
    .from("property-images")
    .upload(filename, file, { cacheControl: "3600", upsert: false });

  if (error) throw error;

  const { data: urlData } = supabase.storage
    .from("property-images")
    .getPublicUrl(data.path);

  return urlData.publicUrl;
}
