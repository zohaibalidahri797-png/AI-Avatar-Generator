/** Avatar style catalog shared by the generator tool, landing pages and navigation. */

export interface SubstyleOption {
  name: string;
  prompt: string;
}

export interface StyleGroup {
  id: string;
  label: string;
  icon: string; // lucide icon key
  tagline: string;
  landingHref: string;
  substyles: SubstyleOption[];
}

export const STYLE_GROUPS: StyleGroup[] = [
  {
    id: 'realistic',
    label: 'Realistic',
    icon: 'camera',
    tagline: 'True-to-life AI portraits',
    landingHref: '/ai-portrait-generator',
    substyles: [
      { name: 'Realistic Avatar', prompt: 'photorealistic portrait avatar with natural skin texture and lifelike detail' },
      { name: 'Realistic Portrait', prompt: 'photorealistic close portrait, sharp focus, lifelike detail, natural look' },
      { name: 'Cinematic Portrait', prompt: 'cinematic film-look portrait with dramatic color grading and shallow depth of field' },
      { name: 'Studio Portrait', prompt: 'professional studio portrait on a seamless backdrop with a professional lighting setup' },
    ],
  },
  {
    id: 'professional',
    label: 'Professional',
    icon: 'briefcase',
    tagline: 'Business-ready headshots',
    landingHref: '/ai-headshot-generator',
    substyles: [
      { name: 'Professional Avatar', prompt: 'polished professional avatar portrait, business-casual look, clean composition' },
      { name: 'Business Avatar', prompt: 'business portrait avatar with smart attire and a confident corporate look' },
      { name: 'Corporate Avatar', prompt: 'corporate headshot portrait, formal attire, trustworthy executive appearance' },
      { name: 'Executive Avatar', prompt: 'executive portrait avatar, premium formal styling, authoritative yet approachable' },
      { name: 'Professional Headshot', prompt: 'professional headshot photograph, business attire, neutral background, recruiting-ready quality' },
    ],
  },
  {
    id: 'cartoon',
    label: 'Cartoon',
    icon: 'palette',
    tagline: 'Fun illustrated looks',
    landingHref: '/ai-cartoon-avatar-generator',
    substyles: [
      { name: 'Cartoon Avatar', prompt: 'cartoon avatar illustration with bold clean outlines and flat vibrant colors' },
      { name: 'Cute Cartoon', prompt: 'cute cartoon avatar with soft rounded shapes, kawaii-inspired charm and pastel colors' },
      { name: 'Comic Avatar', prompt: 'comic book style avatar with dynamic ink lines, halftone shading and punchy colors' },
      { name: 'Creative Cartoon', prompt: 'creative cartoon avatar with playful stylized proportions and a modern illustration finish' },
    ],
  },
  {
    id: 'anime',
    label: 'Anime',
    icon: 'sparkles',
    tagline: 'Manga-inspired portraits',
    landingHref: '/ai-anime-avatar-generator',
    substyles: [
      { name: 'Anime Avatar', prompt: 'anime style avatar portrait, expressive eyes, clean cel shading, vibrant colors' },
      { name: 'Manga-Inspired', prompt: 'manga-inspired monochrome portrait with crisp ink lines and screentone shading' },
      { name: 'Fantasy Anime', prompt: 'fantasy anime portrait with magical accents, glowing elements and rich colors' },
      { name: 'Modern Anime', prompt: 'modern anime portrait with contemporary styling, soft gradients and clean composition' },
    ],
  },
  {
    id: '3d',
    label: '3D',
    icon: 'boxes',
    tagline: 'Stylized 3D characters',
    landingHref: '/ai-3d-avatar-generator',
    substyles: [
      { name: '3D Avatar', prompt: 'stylized 3D avatar render with smooth shading and soft global illumination' },
      { name: '3D Character', prompt: '3D character render with friendly stylized proportions and polished surfaces' },
      { name: '3D Portrait', prompt: '3D portrait render with soft studio lighting and a premium toy-like finish' },
      { name: '3D Gaming Avatar', prompt: '3D gaming avatar render with a stylized game-character look and dramatic lighting' },
    ],
  },
  {
    id: 'gaming',
    label: 'Gaming',
    icon: 'gamepad-2',
    tagline: 'Esports-ready PFPs',
    landingHref: '/ai-gaming-avatar-generator',
    substyles: [
      { name: 'Gaming Avatar', prompt: 'gaming avatar portrait with a bold digital-art style and dramatic accent lighting' },
      { name: 'Gamer PFP', prompt: 'gamer profile picture with edgy modern styling and vibrant neon accents' },
      { name: 'Esports Avatar', prompt: 'esports team-style avatar with intense expression, jersey vibes and dramatic rim lighting' },
      { name: 'Fantasy Gaming', prompt: 'fantasy gaming avatar with armor, mystical elements and epic lighting' },
      { name: 'Futuristic Gaming', prompt: 'futuristic sci-fi gaming avatar with cyberpunk accents, holographic elements and neon glow' },
    ],
  },
  {
    id: 'social',
    label: 'Social Media',
    icon: 'share-2',
    tagline: 'Platform-perfect profiles',
    landingHref: '/social-media-avatar-generator',
    substyles: [
      { name: 'YouTube Avatar', prompt: 'bright YouTube-friendly avatar portrait with a cheerful, clickable look' },
      { name: 'TikTok Avatar', prompt: 'trendy TikTok-style avatar portrait with energetic colors and Gen-Z styling' },
      { name: 'Discord Avatar', prompt: 'Discord-ready avatar portrait that stays crisp and readable at small sizes' },
      { name: 'Instagram PFP', prompt: 'aesthetic Instagram profile picture with stylish colors and a polished look' },
      { name: 'Influencer Avatar', prompt: 'influencer-style avatar portrait with a vibrant gradient background and fashion-forward styling' },
    ],
  },
];

export function getStyleGroup(id: string): StyleGroup | undefined {
  return STYLE_GROUPS.find((g) => g.id === id);
}

export function getSubstyle(groupId: string, name: string): SubstyleOption | undefined {
  const group = getStyleGroup(groupId);
  return group?.substyles.find((s) => s.name === name);
}

/* ------------------------------ Customization options ----------------------------- */

export interface PromptOption {
  name: string;
  prompt: string;
}

export const BACKGROUND_OPTIONS: PromptOption[] = [
  { name: 'Original', prompt: 'keep the original background context of the photo' },
  { name: 'Studio', prompt: 'clean neutral studio backdrop' },
  { name: 'Office', prompt: 'modern professional office background, softly blurred' },
  { name: 'Gradient', prompt: 'smooth colorful gradient background' },
  { name: 'Abstract', prompt: 'abstract artistic background with soft organic shapes' },
  { name: 'Gaming', prompt: 'dark gaming setup background with neon accent lighting' },
  { name: 'Nature', prompt: 'outdoor nature background with soft greenery, gently blurred' },
  { name: 'City', prompt: 'urban cityscape background at dusk, gently blurred' },
  { name: 'Solid Color', prompt: 'plain solid color background' },
  { name: 'Transparent', prompt: 'clean plain white background suitable for cutout' },
];

export const LIGHTING_OPTIONS: PromptOption[] = [
  { name: 'Natural', prompt: 'soft natural window lighting' },
  { name: 'Studio', prompt: 'even professional studio lighting' },
  { name: 'Soft', prompt: 'soft diffused flattering light' },
  { name: 'Cinematic', prompt: 'cinematic rim lighting with gentle contrast' },
];

export const EXPRESSION_OPTIONS: PromptOption[] = [
  { name: 'Friendly', prompt: 'warm friendly smile' },
  { name: 'Confident', prompt: 'confident assured expression' },
  { name: 'Professional', prompt: 'calm professional expression' },
  { name: 'Serious', prompt: 'serious focused expression' },
  { name: 'Creative', prompt: 'playful creative expression' },
];

export const FRAMING_OPTIONS = ['Square', 'Portrait', 'Circle', 'Rounded'] as const;
export type Framing = (typeof FRAMING_OPTIONS)[number];

/** Suggested download filename per style group (PRD §45). */
export function suggestedFilename(groupId: string, substyle: string): string {
  const id = groupId === 'professional' ? 'professional-avatar' : groupId === 'social' ? 'ai-pfp' : 'ai-avatar';
  const slug = substyle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  return `${id}-${slug}.png`;
}
