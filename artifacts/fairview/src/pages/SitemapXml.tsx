import { useEffect, useState } from "react";
import { fetchPropertiesFromSupabase } from "@/lib/supabase-properties";

const BASE_URL = "https://ifeproperties.space";

export default function SitemapXml() {
  const [xmlContent, setXmlContent] = useState<string>("");

  useEffect(() => {
    async function loadSitemap() {
      try {
        const properties = await fetchPropertiesFromSupabase();
        const todayDate = new Date().toISOString().split("T")[0];

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

        const xmlUrls = [
          ...staticRoutes.map((r) => {
            const urlPath = r.path ? `${BASE_URL}/${r.path}` : BASE_URL;
            return `  <url>\n    <loc>${urlPath}</loc>\n    <lastmod>${todayDate}</lastmod>\n    <changefreq>${r.changefreq}</changefreq>\n    <priority>${r.priority}</priority>\n  </url>`;
          }),
          ...properties.map((p) => {
            return `  <url>\n    <loc>${BASE_URL}/property/${p.slug}</loc>\n    <lastmod>${todayDate}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>`;
          }),
        ];

        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${xmlUrls.join("\n")}\n</urlset>`;

        setXmlContent(xml);
      } catch (err) {
        setXmlContent("<?xml version=\"1.0\" encoding=\"UTF-8\"?><error>Failed to load sitemap</error>");
      }
    }

    loadSitemap();
  }, []);

  return (
    <pre style={{ margin: 0, padding: "16px", fontFamily: "monospace", whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
      {xmlContent}
    </pre>
  );
}
