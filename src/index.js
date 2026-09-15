/**
 * AI Avatar Generator Worker
 * Cloudflare Worker for generating AI avatars
 */

export default {
  async fetch(request, env, ctx) {
    return new Response('AI Avatar Generator - Cloudflare Worker', {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  },
};
