/**
 * Cloudflare Worker for edgeofthearctic.is (local hub).
 * Serves the static site in ./site plus a dynamic robots.txt + sitemap, and
 * 301-redirects the old Norðurhjari-portal URLs to the new pages.
 * robots blocks crawlers on the *.workers.dev preview, allows on the real domain.
 */
const SITEMAP_PATHS = ["/", "/eat/", "/stay/", "/explore/", "/contact/"];

/**
 * 301 redirects: the domain (edgeofthearctic.is) is unchanged, so its Google
 * history carries over. The old portal's pages map to the new local pages;
 * the many attraction pages all fold into the area guide (/explore/).
 */
const REDIRECTS = {
  "/where-to-dine": "/eat/",
  "/where-to-stay": "/stay/",
  "/places-to-see-2": "/explore/",
  "/places-to-see": "/explore/",
  "/things-to-do-2": "/explore/",
  "/where-to-get-there": "/contact/",
  "/edgeofthearctic-2": "/",
  // individual attraction pages → the area guide
  "/dettifoss-4": "/explore/",
  "/asbyrgi": "/explore/",
  "/godafoss-waterfall": "/explore/",
  "/husavik": "/explore/",
  "/dimmuborgir": "/explore/",
  "/jokulsargljufur": "/explore/",
  "/raudanes-point": "/explore/",
  "/arctic-henge": "/explore/",
  "/raudinupur": "/explore/",
  "/skalar-at-langanes": "/explore/",
  "/the-highlands": "/explore/",
  "/vaglaskogur-forest": "/explore/",
  "/pallurinn-a-skoruvikurbjargi": "/explore/",
  "/digranes-viti": "/explore/",
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const isTempHost = url.hostname.endsWith(".workers.dev");

    const cleanPath = url.pathname.replace(/\/$/, "") || "/";
    const redirectTo = REDIRECTS[cleanPath];
    if (redirectTo) {
      return Response.redirect(url.origin + redirectTo, 301);
    }

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
