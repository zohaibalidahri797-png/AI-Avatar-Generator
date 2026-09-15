// Empty module stub used by vite.config.ts to alias `sharp` away in
// Cloudflare Workers builds. `sharp` is a native Node dependency that the
// vinext/Workers build cannot bundle; nothing in src/ imports it directly
// (verified), so an empty stub keeps the Workers graph clean.
const stub = {};
export default stub;
