/**
 * Cloudflare Worker for edgeofthearctic.is (local hub).
 * Serves the static site in ../site-is and a dynamic robots.txt + sitemap.
 * robots blocks crawlers on the *.workers.dev preview, allows on the real domain.
 */
const SITEMAP_PATHS = ["/", "/eat/", "/stay/", "/explore/", "/contact/"];
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const isTempHost = url.hostname.endsWith(".workers.dev");
    if (url.pathname === "/robots.txt") {
      const body = isTempHost ? "User-agent: *\nDisallow: /\n"
        : `User-agent: *\nAllow: /\n\nSitemap: ${url.origin}/sitemap.xml\n`;
      return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
    }
    if (url.pathname === "/sitemap.xml") {
      const urls = SITEMAP_PATHS.map((p) => `  <url><loc>${url.origin}${p}</loc></url>`).join("\n");
      return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
        { headers: { "Content-Type": "application/xml; charset=utf-8" } });
    }
    return env.ASSETS.fetch(request);
  },
};
