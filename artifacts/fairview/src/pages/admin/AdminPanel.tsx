import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { fetchPropertiesFromSupabase, deleteProperty } from "@/lib/supabase-properties";
import type { Property } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Pencil, Trash2, LogOut, AlertTriangle, ExternalLink } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL as string | undefined;

const SETUP_SQL = `-- Run this in your Supabase SQL Editor:

create table if not exists properties (
  id uuid default gen_random_uuid() primary key,
  slug text not null unique,
  title text not null,
  price text not null,
  location text not null,
  size text not null,
  category text not null,
  listing_type text not null,
  main_image text not null default '',
  gallery text[] not null default '{}',
  video_url text not null default '',
  description text not null default '',
  features text[] not null default '{}',
  reviews jsonb not null default '[]',
  created_at timestamptz default now() not null
);

alter table properties enable row level security;

create policy "Public read" on properties for select using (true);
create policy "Auth write" on properties for all using (auth.role() = 'authenticated');`;

function SetupGuide() {
  const [copied, setCopied] = useState(false);
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8">
        <div className="flex items-start gap-4">
          <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-1" />
          <div className="flex-1">
            <h2 className="text-xl font-bold text-amber-900 mb-2">One-time Supabase setup required</h2>
            <p className="text-amber-800 mb-6 leading-relaxed">
              The properties table doesn't exist in your Supabase database yet. Run the SQL below once in your
              Supabase dashboard, then refresh this page.
            </p>
            <div className="mb-4">
              <h3 className="font-semibold text-amber-900 mb-2">Steps:</h3>
              <ol className="text-amber-800 space-y-1 text-sm list-decimal list-inside">
                <li>Go to your <strong>Supabase dashboard → SQL Editor</strong></li>
                <li>Paste the SQL below and click <strong>Run</strong></li>
                <li>Go to <strong>Storage → New bucket</strong>, name it <code className="bg-amber-100 px-1 rounded">property-images</code>, set it to <strong>Public</strong></li>
                <li>Come back here and refresh</li>
              </ol>
            </div>
            <div className="relative">
              <pre className="bg-amber-100 border border-amber-300 rounded-xl p-4 text-xs text-amber-900 overflow-x-auto whitespace-pre-wrap font-mono">
                {SETUP_SQL}
              </pre>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(SETUP_SQL);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="absolute top-3 right-3 bg-amber-600 hover:bg-amber-700 text-white text-xs px-3 py-1.5 rounded-lg transition-colors"
              >
                {copied ? "Copied!" : "Copy SQL"}
              </button>
            </div>
            <div className="mt-4 p-4 bg-amber-100 rounded-xl border border-amber-200">
              <p className="text-amber-800 text-sm font-semibold mb-1">Also set this Netlify environment variable:</p>
              <code className="text-amber-900 font-mono text-sm">VITE_ADMIN_EMAIL = your-email@example.com</code>
              <p className="text-amber-700 text-xs mt-1">Use the email you log in to this site with. This restricts admin access to only that account.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminPanel() {
  const { user, isLoading: authLoading, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tableReady, setTableReady] = useState(true);
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);

  const isAdmin = !ADMIN_EMAIL || (user?.email && user.email === ADMIN_EMAIL);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLocation("/login");
      return;
    }
    if (!isAdmin) {
      setError("You don't have admin access to this panel.");
      setLoading(false);
      return;
    }
    loadProperties();
  }, [user, authLoading]);

  async function loadProperties() {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchPropertiesFromSupabase();
      setProperties(data);
      setTableReady(true);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      if (msg.includes("relation") && msg.includes("does not exist")) {
        setTableReady(false);
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(slug: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setDeletingSlug(slug);
    try {
      await deleteProperty(slug);
      setProperties((prev) => prev.filter((p) => p.slug !== slug));
      toast({ title: "Deleted", description: `"${title}" has been removed.` });
    } catch (e: unknown) {
      toast({ title: "Error", description: e instanceof Error ? e.message : "Failed to delete.", variant: "destructive" });
    } finally {
      setDeletingSlug(null);
    }
  }

  if (authLoading || (loading && !error)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!tableReady) return <SetupGuide />;

  const CATEGORY_LABELS: Record<string, string> = {
    apartment: "Apartment", shop: "Shop", land: "Land", property: "House",
  };
  const TYPE_COLOURS: Record<string, string> = {
    rent: "bg-blue-100 text-blue-700",
    lease: "bg-purple-100 text-purple-700",
    sale: "bg-green-100 text-green-700",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div>
            <Link href="/">
              <span className="text-sm text-muted-foreground hover:text-primary cursor-pointer transition-colors">← Back to site</span>
            </Link>
            <h1 className="text-2xl font-bold text-primary mt-1">Fairview Admin</h1>
          </div>
          <div className="flex items-center gap-3">
            {user && <span className="text-sm text-muted-foreground hidden sm:block">{user.email}</span>}
            <Button variant="outline" size="sm" onClick={() => logout()} className="gap-2">
              <LogOut className="w-4 h-4" /> Sign out
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        {/* Error state */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-red-700 text-sm">{error}</div>
        )}

        {/* Actions bar */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Properties</h2>
            <p className="text-sm text-muted-foreground mt-0.5">{properties.length} listing{properties.length !== 1 ? "s" : ""}</p>
          </div>
          <Link href="/admin-panel/new">
            <Button className="gap-2 bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4" /> Add Property
            </Button>
          </Link>
        </div>

        {/* Property list */}
        {properties.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-gray-300 py-24 text-center">
            <p className="text-muted-foreground mb-4">No properties yet.</p>
            <Link href="/admin-panel/new">
              <Button className="gap-2">
                <Plus className="w-4 h-4" /> Add your first property
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {properties.map((p) => (
              <div key={p.slug} className="bg-white rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow p-4 sm:p-5">
                <div className="flex gap-4 items-center">
                  {/* Thumbnail */}
                  <div className="w-20 h-16 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                    {p.mainImage ? (
                      <img src={p.mainImage} alt={p.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No image</div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground truncate">{p.title}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${TYPE_COLOURS[p.listingType] ?? "bg-gray-100 text-gray-600"}`}>
                        {p.listingType}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-gray-100 text-gray-600">
                        {CATEGORY_LABELS[p.category] ?? p.category}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{p.location} · {p.price}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <Link href={`/property/${p.slug}`}>
                      <Button variant="ghost" size="sm" title="View on site">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Link href={`/admin-panel/edit/${p.slug}`}>
                      <Button variant="outline" size="sm" className="gap-1.5">
                        <Pencil className="w-3.5 h-3.5" /> Edit
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1.5 text-red-600 border-red-200 hover:bg-red-50"
                      onClick={() => handleDelete(p.slug, p.title)}
                      disabled={deletingSlug === p.slug}
                    >
                      {deletingSlug === p.slug
                        ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        : <Trash2 className="w-3.5 h-3.5" />}
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
