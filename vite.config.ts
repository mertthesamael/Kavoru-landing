import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig, loadEnv } from "vite";

function seoPlugin(siteUrl: string) {
  const normalized = siteUrl.replace(/\/$/, "");

  return {
    name: "kavoru-seo",
    transformIndexHtml(html: string) {
      return html.replaceAll("__SITE_URL__", normalized);
    },
    closeBundle() {
      const outDir = resolve("dist");

      writeFileSync(
        resolve(outDir, "robots.txt"),
        `User-agent: *\nAllow: /\n\nSitemap: ${normalized}/sitemap.xml\n`,
      );

      writeFileSync(
        resolve(outDir, "sitemap.xml"),
        `<?xml version="1.0" encoding="UTF-8"?>\n` +
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
          `  <url>\n` +
          `    <loc>${normalized}/</loc>\n` +
          `    <changefreq>monthly</changefreq>\n` +
          `    <priority>1.0</priority>\n` +
          `  </url>\n` +
          `</urlset>\n`,
      );
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const siteUrl = env.SITE_URL || "https://kavoru.dev";

  return {
    root: ".",
    build: {
      outDir: "dist",
    },
    plugins: [seoPlugin(siteUrl)],
  };
});
