// Next's basePath config only rewrites framework-managed assets (next/image,
// next/link). Plain <img src="/images/..."> tags need the prefix by hand, or
// they 404 on GitHub Pages where the site is served from /tdi-workspace/.

export const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export function withBasePath(path) {
  return `${basePath}${path}`;
}
