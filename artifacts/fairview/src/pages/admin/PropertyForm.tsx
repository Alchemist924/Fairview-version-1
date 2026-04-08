import { useState, useEffect, useRef } from "react";
import { Link, useParams, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import {
  fetchPropertyBySlug,
  createProperty,
  updateProperty,
  uploadPropertyImage,
} from "@/lib/supabase-properties";
import type { Property } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, ArrowLeft, Upload, X, Plus } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL as string | undefined;

const PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='150' viewBox='0 0 200 150'%3E%3Crect width='200' height='150' fill='%23e5e7eb'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af' font-size='12' font-family='sans-serif'%3ENo Image%3C/text%3E%3C/svg%3E";

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

interface ImageUploadProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
}

function ImageUpload({ label, value, onChange }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadPropertyImage(file);
      onChange(url);
    } catch (err) {
      toast({
        title: "Upload failed",
        description: err instanceof Error ? err.message : "Check that the 'property-images' bucket exists in Supabase Storage and is set to Public.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="flex gap-3 items-start">
        <div className="w-28 h-20 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
          <img
            src={value || PLACEHOLDER}
            alt={label}
            className="w-full h-full object-cover"
            onError={(e) => { (e.currentTarget as HTMLImageElement).src = PLACEHOLDER; }}
          />
        </div>
        <div className="flex-1 space-y-2">
          <Input
            placeholder="Paste image URL..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="text-sm"
          />
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-2 text-xs"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
              {uploading ? "Uploading..." : "Upload file"}
            </Button>
            {value && (
              <Button type="button" variant="ghost" size="sm" className="text-xs text-red-500" onClick={() => onChange("")}>
                Clear
              </Button>
            )}
          </div>
          <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </div>
      </div>
    </div>
  );
}

function GalleryUpload({ images, onChange }: { images: string[]; onChange: (imgs: string[]) => void }) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploading(true);
    try {
      const urls = await Promise.all(files.map(uploadPropertyImage));
      onChange([...images, ...urls].slice(0, 5));
    } catch (err) {
      toast({
        title: "Upload failed",
        description: err instanceof Error ? err.message : "Check that the 'property-images' bucket exists in Supabase Storage and is set to Public.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Gallery (up to 5 images)</label>
      <div className="flex flex-wrap gap-2 mb-3">
        {images.map((img, i) => (
          <div key={i} className="relative w-24 h-20 rounded-lg overflow-hidden border border-gray-200 bg-gray-100 group">
            <img src={img || PLACEHOLDER} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover"
              onError={(e) => { (e.currentTarget as HTMLImageElement).src = PLACEHOLDER; }} />
            <button
              type="button"
              onClick={() => onChange(images.filter((_, idx) => idx !== i))}
              className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
        {images.length < 5 && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="w-24 h-20 rounded-lg border-2 border-dashed border-gray-300 hover:border-primary flex flex-col items-center justify-center text-gray-400 hover:text-primary transition-colors text-xs gap-1"
          >
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            {uploading ? "Uploading" : "Add"}
          </button>
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFiles} />
      <p className="text-xs text-muted-foreground">Click the + to upload. Hover an image to remove it.</p>
    </div>
  );
}

type FormData = {
  slug: string;
  title: string;
  price: string;
  location: string;
  size: string;
  category: string;
  listingType: string;
  mainImage: string;
  gallery: string[];
  videoUrl: string;
  description: string;
  features: string[];
};

const EMPTY: FormData = {
  slug: "", title: "", price: "", location: "", size: "",
  category: "apartment", listingType: "rent",
  mainImage: "", gallery: [], videoUrl: "", description: "", features: [""],
};

export default function PropertyForm() {
  const { slug } = useParams<{ slug?: string }>();
  const isEditing = Boolean(slug);
  const [, setLocation] = useLocation();
  const { user, isLoading: authLoading } = useAuth();
  const [form, setForm] = useState<FormData>(EMPTY);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [slugManual, setSlugManual] = useState(false);
  const ADMIN_EMAIL_VAL = ADMIN_EMAIL;
  const isAdmin = !ADMIN_EMAIL_VAL || (user?.email && user.email === ADMIN_EMAIL_VAL);

  useEffect(() => {
    if (authLoading) return;
    if (!user || !isAdmin) { setLocation("/login"); return; }
    if (isEditing && slug) {
      fetchPropertyBySlug(slug).then((p) => {
        if (!p) { setLocation("/admin-panel"); return; }
        setForm({
          slug: p.slug, title: p.title, price: p.price,
          location: p.location, size: p.size, category: p.category,
          listingType: p.listingType, mainImage: p.mainImage,
          gallery: p.gallery, videoUrl: p.videoUrl,
          description: p.description,
          features: p.features.length ? p.features : [""],
        });
        setSlugManual(true);
        setLoading(false);
      });
    }
  }, [user, authLoading]);

  function set<K extends keyof FormData>(key: K, val: FormData[K]) {
    setForm((prev) => ({ ...prev, [key]: val }));
  }

  function handleTitleChange(title: string) {
    setForm((prev) => ({
      ...prev,
      title,
      slug: slugManual ? prev.slug : slugify(title),
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.slug.trim()) {
      toast({ title: "Required", description: "Title and slug are required.", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      const payload = {
        slug: form.slug,
        title: form.title,
        price: form.price,
        location: form.location,
        size: form.size,
        category: form.category as Property["category"],
        listingType: form.listingType as Property["listingType"],
        mainImage: form.mainImage,
        gallery: form.gallery.filter(Boolean),
        videoUrl: form.videoUrl,
        description: form.description,
        features: form.features.filter(Boolean),
        reviews: undefined,
      };
      if (isEditing && slug) {
        await updateProperty(slug, payload);
        toast({ title: "Saved", description: "Property updated successfully." });
      } else {
        await createProperty(payload);
        toast({ title: "Created", description: "New property added successfully." });
      }
      setLocation("/admin-panel");
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to save property.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  }

  if (authLoading || loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  const label = (text: string, required = false) => (
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {text}{required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );

  const inputClass = "w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white";
  const selectClass = "w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-4">
          <Link href="/admin-panel">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" /> Back
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-primary">
            {isEditing ? "Edit Property" : "Add Property"}
          </h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <form onSubmit={handleSubmit} className="space-y-8">

          {/* Basic info */}
          <div className="bg-white rounded-2xl border border-border shadow-sm p-6 space-y-5">
            <h2 className="font-semibold text-foreground text-base border-b pb-3">Basic Information</h2>

            <div>
              {label("Title", true)}
              <input className={inputClass} value={form.title} onChange={(e) => handleTitleChange(e.target.value)} placeholder="e.g. 2 Bedroom Flat – Oke Ogbo" required />
            </div>

            <div>
              {label("Slug (URL ID)", true)}
              <input className={inputClass} value={form.slug}
                onChange={(e) => { setSlugManual(true); set("slug", slugify(e.target.value)); }}
                placeholder="e.g. 2bed-flat-oke-ogbo" required />
              <p className="text-xs text-muted-foreground mt-1">Auto-generated from title. No spaces or special characters.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                {label("Category", true)}
                <select className={selectClass} value={form.category} onChange={(e) => set("category", e.target.value)}>
                  <option value="apartment">Apartment</option>
                  <option value="shop">Shop / Commercial</option>
                  <option value="land">Land</option>
                  <option value="property">House / Property</option>
                </select>
              </div>
              <div>
                {label("Listing Type", true)}
                <select className={selectClass} value={form.listingType} onChange={(e) => set("listingType", e.target.value)}>
                  <option value="rent">For Rent</option>
                  <option value="lease">For Lease</option>
                  <option value="sale">For Sale</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                {label("Price", true)}
                <input className={inputClass} value={form.price} onChange={(e) => set("price", e.target.value)} placeholder="e.g. ₦350,000/year" required />
              </div>
              <div>
                {label("Size")}
                <input className={inputClass} value={form.size} onChange={(e) => set("size", e.target.value)} placeholder="e.g. 3 Bedrooms or 120sqm" />
              </div>
            </div>

            <div>
              {label("Location")}
              <input className={inputClass} value={form.location} onChange={(e) => set("location", e.target.value)} placeholder="e.g. Oke Ogbo, Ile Ife" />
            </div>

            <div>
              {label("Description")}
              <textarea
                className={`${inputClass} min-h-[100px] resize-y`}
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                placeholder="Describe the property..."
              />
            </div>
          </div>

          {/* Media */}
          <div className="bg-white rounded-2xl border border-border shadow-sm p-6 space-y-6">
            <h2 className="font-semibold text-foreground text-base border-b pb-3">Images &amp; Video</h2>
            <ImageUpload label="Main Image" value={form.mainImage} onChange={(v) => set("mainImage", v)} />
            <GalleryUpload images={form.gallery} onChange={(imgs) => set("gallery", imgs)} />
            <div>
              {label("Video URL")}
              <input
                className={inputClass}
                value={form.videoUrl}
                onChange={(e) => set("videoUrl", e.target.value)}
                placeholder="https://www.youtube.com/watch?v=... or embed URL"
              />
              <p className="text-xs text-muted-foreground mt-1">Paste any YouTube URL — it will be converted to an embed automatically.</p>
            </div>
          </div>

          {/* Features */}
          <div className="bg-white rounded-2xl border border-border shadow-sm p-6 space-y-4">
            <h2 className="font-semibold text-foreground text-base border-b pb-3">Features</h2>
            <div className="space-y-2">
              {form.features.map((f, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    className={`${inputClass} flex-1`}
                    value={f}
                    onChange={(e) => {
                      const updated = [...form.features];
                      updated[i] = e.target.value;
                      set("features", updated);
                    }}
                    placeholder={`Feature ${i + 1}, e.g. Running Water`}
                  />
                  <Button
                    type="button" variant="ghost" size="sm"
                    className="text-red-400 hover:text-red-600 shrink-0"
                    onClick={() => set("features", form.features.filter((_, idx) => idx !== i))}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
            <Button type="button" variant="outline" size="sm" className="gap-2"
              onClick={() => set("features", [...form.features, ""])}>
              <Plus className="w-3.5 h-3.5" /> Add feature
            </Button>
          </div>

          {/* Submit */}
          <div className="flex gap-3 justify-end">
            <Link href="/admin-panel">
              <Button type="button" variant="outline">Cancel</Button>
            </Link>
            <Button type="submit" disabled={saving} className="gap-2 bg-primary hover:bg-primary/90 min-w-[120px]">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {saving ? "Saving..." : isEditing ? "Save Changes" : "Add Property"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
