const SUPABASE_URL = "https://fucljiyczkpajddyykmd.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_W6zFBz2oZRbh0YN-7v-4Iw_YyF1UpDW";
const BASE_URL = "https://ifeproperties.space";

interface PropertyRow {
  slug: string;
  created_at: string;
}

export const handler = async () => {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/properties?select=slug,created_at&order=created_at.desc`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
      }
    );

    let properties: PropertyRow[] = [];
    if (res.ok) {
      properties = (await res.json()) as PropertyRow[];
    }

    const staticRoutes = [
      { path: "", priority: "1.0", changefreq: "daily" },
      { path: "lands-for-sale", priority: "0.9", changefreq: "daily" },
      { path: "properties-for-sale", priority: "0.9", changefreq: "daily" },
      { path: "apartments-for-rent", priority: "0.9", changefreq: "daily" },
      { path: "shops-for-lease", priority: "0.9", changefreq: "daily" },
      { path: "property-owners", priority: "0.8", changefreq: "weekly" },
      { path: "buyers-renters", priority: "0.8", changefreq: "weekly" },
      { path: "about", priority: "0.6", changefreq: "monthly" },
      { path: "faqs", priority: "0.5", changefreq: "monthly" },
    ];

    const todayDate = new Date().toISOString().split("T")[0];

    const xmlUrls = [
      ...staticRoutes.map((r) => {
        const urlPath = r.path ? `${BASE_URL}/${r.path}` : BASE_URL;
        return `  <url>
    <loc>${urlPath}</loc>
    <lastmod>${todayDate}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`;
      }),
      ...properties.map((p) => {
        const lastMod = p.created_at ? p.created_at.split("T")[0] : todayDate;
        return `  <url>
    <loc>${BASE_URL}/property/${p.slug}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
      }),
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlUrls.join("\n")}
</urlset>`;

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=0, must-revalidate",
      },
      body: xml,
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "text/plain" },
      body: "Error generating sitemap",
    };
  }
};
