import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Canonical URLs carry a trailing slash (e.g. /ai-avatar-generator/) so the
  // sitemap, canonical tags and address bar all agree on one URL convention.
  trailingSlash: true,
};

export default nextConfig;
