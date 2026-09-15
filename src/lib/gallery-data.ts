import type { GalleryImage } from './types';

/**
 * Example AI avatars shown in the gallery and on the homepage.
 * All portraits depict fictional, AI-generated people.
 */
export const GALLERY_IMAGES: GalleryImage[] = [
  {
    src: '/images/avatars/realistic.png',
    alt: 'AI-generated realistic studio portrait avatar of a fictional woman with soft lighting',
    category: 'Realistic',
    label: 'Realistic Studio Portrait',
  },
  {
    src: '/images/avatars/professional.png',
    alt: 'AI-generated professional headshot avatar of a fictional man in a blazer',
    category: 'Professional',
    label: 'Professional Headshot',
  },
  {
    src: '/images/avatars/business.png',
    alt: 'AI-generated corporate avatar of a fictional businesswoman in a modern office',
    category: 'Business',
    label: 'Corporate Office Portrait',
  },
  {
    src: '/images/avatars/anime.png',
    alt: 'AI-generated anime style avatar of a fictional character with expressive eyes',
    category: 'Anime',
    label: 'Anime Portrait',
  },
  {
    src: '/images/avatars/cartoon.png',
    alt: 'AI-generated cartoon avatar illustration of a friendly fictional man',
    category: 'Cartoon',
    label: 'Playful Cartoon Avatar',
  },
  {
    src: '/images/avatars/gaming.png',
    alt: 'AI-generated esports gaming avatar with neon purple lighting and a headset',
    category: 'Gaming',
    label: 'Esports Gaming Avatar',
  },
  {
    src: '/images/avatars/three-d.png',
    alt: 'AI-generated stylized 3D character avatar render',
    category: '3D',
    label: '3D Character Render',
  },
  {
    src: '/images/avatars/social.png',
    alt: 'AI-generated vibrant social media profile avatar of a fictional influencer',
    category: 'Social Media',
    label: 'Colorful Influencer PFP',
  },
  {
    src: '/images/avatars/fantasy.png',
    alt: 'AI-generated fantasy character avatar with ornate armor and glowing accents',
    category: 'Character',
    label: 'Fantasy Character Avatar',
  },
  {
    src: '/images/avatars/face.png',
    alt: 'AI-generated fictional face portrait of a person who does not exist',
    category: 'Realistic',
    label: 'AI Fictional Face',
  },
  {
    src: '/images/avatars/anime-2.png',
    alt: 'AI-generated anime avatar of a fictional young man with crimson hair and amber eyes',
    category: 'Anime',
    label: 'Anime Character Portrait',
  },
  {
    src: '/images/avatars/social-2.png',
    alt: 'AI-generated vibrant social media avatar of a fictional woman with teal hair and glasses',
    category: 'Social Media',
    label: 'Creative Teal-Hair PFP',
  },
  {
    src: '/images/avatars/character-2.png',
    alt: 'AI-generated fantasy elf mage avatar with silver hair and violet magic accents',
    category: 'Character',
    label: 'Elf Mage Character',
  },
  {
    src: '/images/avatars/business-2.png',
    alt: 'AI-generated corporate avatar of a fictional businessman in a charcoal suit',
    category: 'Business',
    label: 'Executive Office Portrait',
  },
  {
    src: '/images/avatars/cartoon-2.png',
    alt: 'AI-generated cute cartoon avatar of a fictional woman with a warm smile',
    category: 'Cartoon',
    label: 'Cute Cartoon Portrait',
  },
  {
    src: '/images/avatars/gaming-2.png',
    alt: 'AI-generated gaming avatar of a fictional woman with headphones and neon lighting',
    category: 'Gaming',
    label: 'Neon Gamer Portrait',
  },
  {
    src: '/images/avatars/three-d-2.png',
    alt: 'AI-generated stylized 3D avatar render of a fictional man with soft lighting',
    category: '3D',
    label: 'Friendly 3D Render',
  },
  {
    src: '/images/avatars/professional-2.png',
    alt: 'AI-generated professional headshot avatar of a fictional woman in a blazer',
    category: 'Professional',
    label: 'Business Blazer Headshot',
  },
  {
    src: '/images/avatars/realistic-3.png',
    alt: 'AI-generated realistic studio portrait avatar of a fictional man with a short beard in golden light',
    category: 'Realistic',
    label: 'Golden Hour Portrait',
  },
  {
    src: '/images/avatars/anime-3.png',
    alt: 'AI-generated anime avatar of a fictional girl with silver-lavender hair and cherry blossoms',
    category: 'Anime',
    label: 'Sakura Anime Portrait',
  },
  {
    src: '/images/avatars/gaming-3.png',
    alt: 'AI-generated gaming avatar of a fictional man with an undercut and neon arena lighting',
    category: 'Gaming',
    label: 'Arena Gamer Portrait',
  },
  {
    src: '/images/avatars/three-d-3.png',
    alt: 'AI-generated stylized 3D avatar render of a fictional woman with auburn hair and freckles',
    category: '3D',
    label: 'Warm 3D Character',
  },
  {
    src: '/images/avatars/social-3.png',
    alt: 'AI-generated vibrant social media avatar of a fictional man with sunglasses on a bold gradient',
    category: 'Social Media',
    label: 'Bold Gradient PFP',
  },
  {
    src: '/images/avatars/character-3.png',
    alt: 'AI-generated fantasy orc warrior avatar with silver armor and glowing amber eyes',
    category: 'Character',
    label: 'Orc Warrior Persona',
  },
];

export const GALLERY_CATEGORIES = [
  'All',
  'Realistic',
  'Professional',
  'Business',
  'Anime',
  'Cartoon',
  'Gaming',
  '3D',
  'Social Media',
  'Character',
];

/* ----------------------------- category pages ----------------------------- */

/** URL slug for a gallery category name (e.g. "Social Media" → "social-media"). */
export function categorySlug(category: string): string {
  return category
    .toLowerCase()
    .replace(/^3d$/, '3d')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export interface GalleryCategoryMeta {
  slug: string;
  label: string;
  metaTitle: string;
  metaDescription: string;
  intro: string[];
  tips: string[];
  /** Landing page that generates this style family. */
  generatorHref: string;
  generatorLabel: string;
}

const GENERATOR_DEFAULT = {
  generatorHref: '/ai-avatar-generator',
  generatorLabel: 'Open the AI Avatar Generator',
};

/** Hand-written SEO copy for each gallery category page (#/gallery/:slug). */
export const GALLERY_CATEGORY_PAGES: GalleryCategoryMeta[] = [
  {
    slug: 'realistic',
    label: 'Realistic',
    metaTitle: 'Realistic AI Avatar Examples — Lifelike AI Portraits | AvatarForge',
    metaDescription:
      'Browse lifelike realistic AI avatar examples — natural skin texture, studio lighting and believable detail. Create your own realistic AI portrait free.',
    intro: [
      'Realistic AI avatars keep the proportions, skin texture and lighting of a true photograph while still being generated from your uploaded photo. The three examples below show how far the style can go — from a soft studio portrait to a golden-hour look to a completely fictional face that looks like it came straight from a camera.',
      'This family works well when you want a profile picture that reads as "you" on professional networks, personal websites and social profiles where a heavily stylized drawing would feel out of place.',
    ],
    tips: [
      'Start from a sharp, evenly lit photo — realistic styles preserve fine detail, so soft or grainy input shows in the result.',
      'Neutral or studio backgrounds keep the focus on the face and match most profile-picture slots.',
      'Try identity-preserving options like Studio Portrait first, then compare with Cinematic Portrait for more drama.',
    ],
    ...GENERATOR_DEFAULT,
  },
  {
    slug: 'professional',
    label: 'Professional',
    metaTitle: 'Professional AI Avatar Examples — Headshots for Work | AvatarForge',
    metaDescription:
      'See professional AI avatar and headshot examples with business attire and clean backdrops. Create a polished work profile picture free, no signup.',
    intro: [
      'Professional AI avatars are built for the places where a selfie is not enough: LinkedIn, company team pages, speaker bios, email signatures and press kits. The examples below show the typical result — business attire, a clean backdrop and confident, recruiting-ready lighting.',
      'Unlike a costume or filter, the generator redraws the portrait around your face, so clothing and background change while you stay recognizably yourself.',
    ],
    tips: [
      'Pair the Professional family with the Office or Studio background option for the most classic headshot look.',
      'Square framing works best on LinkedIn and most business platforms — you can export at 800px in one click.',
      'Keep the Friendly or Confident expression for approachable professional profiles.',
    ],
    generatorHref: '/ai-headshot-generator',
    generatorLabel: 'Try the AI Headshot Generator',
  },
  {
    slug: 'business',
    label: 'Business',
    metaTitle: 'Business AI Avatar Examples — Corporate Portraits | AvatarForge',
    metaDescription:
      'Browse corporate AI avatar examples for business profiles, company pages and executive bios. Generate a business avatar from your photo — free.',
    intro: [
      'The Business family sits between the formal Professional styles and everyday portraits: smart attire, modern office settings and a confident corporate look that fits company websites, pitch decks and client-facing profiles.',
      'The two examples below show how the same family can cover both a modern office portrait and a formal executive portrait.',
    ],
    tips: [
      'Use the Office background for modern startups and the Studio background for more formal companies.',
      'Business avatars pair well with the Square framing used by LinkedIn, Slack and email tools.',
      'Generate one avatar per team member with matching backgrounds for a consistent company page.',
    ],
    generatorHref: '/professional-ai-avatar',
    generatorLabel: 'Try the Professional AI Avatar tool',
  },
  {
    slug: 'anime',
    label: 'Anime',
    metaTitle: 'Anime AI Avatar Examples — Anime-Style PFPs | AvatarForge',
    metaDescription:
      'Browse anime AI avatar examples — expressive eyes, cel shading and vibrant colors. Turn your photo into an anime-style PFP free, no signup needed.',
    intro: [
      'Anime AI avatars translate your photo into a hand-drawn-feeling illustration: enlarged expressive eyes, clean cel shading and vibrant color palettes. The three examples below show the range, from a classic character portrait to bolder fantasy-leaning looks.',
      'Anime is one of the most popular profile-picture styles for Discord, gaming platforms and creative communities because it is recognizable at very small sizes.',
    ],
    tips: [
      'Anime styles stay readable at tiny sizes — ideal for Discord and chat apps where avatars render at 32px.',
      'Gradient or abstract backgrounds complement the flat cel-shaded look better than photorealistic scenes.',
      'These are generic manga-inspired styles generated from your photo — not copies of existing copyrighted characters.',
    ],
    generatorHref: '/ai-anime-avatar-generator',
    generatorLabel: 'Try the AI Anime Avatar Generator',
  },
  {
    slug: 'cartoon',
    label: 'Cartoon',
    metaTitle: 'Cartoon AI Avatar Examples — Cartoon Versions of You | AvatarForge',
    metaDescription:
      'Browse cartoon AI avatar examples with bold outlines and playful colors. Turn your photo into a cartoon avatar for any profile — free and online.',
    intro: [
      'Cartoon AI avatars redraw you with clean outlines, simplified shapes and vibrant flat colors. The result feels friendly and approachable, which is why cartoon avatars are a favorite for personal brands, podcasts, communities and family group chats.',
      'The examples below show two directions: a classic bold-outline cartoon and a softer, cuter take.',
    ],
    tips: [
      'Cartoon styles forgive imperfect source photos — they simplify detail instead of preserving it.',
      'Try the Solid Color or Gradient background so the bold outline style really pops.',
      'Cute Cartoon suits pastel-themed profiles; Cartoon Avatar suits high-contrast, playful brands.',
    ],
    generatorHref: '/ai-cartoon-avatar-generator',
    generatorLabel: 'Try the AI Cartoon Avatar Generator',
  },
  {
    slug: 'gaming',
    label: 'Gaming',
    metaTitle: 'Gaming AI Avatar Examples — Esports & Gamer PFPs | AvatarForge',
    metaDescription:
      'Browse gaming AI avatar examples with neon lighting, esports energy and headset vibes. Create a gamer PFP for Discord, Twitch and Steam — free.',
    intro: [
      'Gaming AI avatars bring esports energy to your profile: dramatic rim lighting, neon accents and confident poses that read well on dark-mode interfaces like Discord, Twitch and Steam.',
      'The three examples below show classic treatments — an esports jersey look, a neon headphone portrait and a stadium-arena vibe, all generated from ordinary photos.',
    ],
    tips: [
      'Pair the Gaming family with the Gaming background option for cohesive neon-on-dark results.',
      'Circle framing matches Discord perfectly — the Discord export preset applies it in one click.',
      'Esports Avatar suits team rosters; Gamer PFP suits solo streamers and community members.',
    ],
    generatorHref: '/ai-gaming-avatar-generator',
    generatorLabel: 'Try the AI Gaming Avatar Generator',
  },
  {
    slug: '3d',
    label: '3D',
    metaTitle: '3D AI Avatar Examples — Stylized 3D Character Renders | AvatarForge',
    metaDescription:
      'Browse 3D AI avatar examples — smooth stylized character renders with soft lighting. Turn your photo into a 3D-style avatar free, no signup.',
    intro: [
      '3D AI avatars render your likeness as a stylized character model — smooth shading, soft global illumination and the polished, toy-like finish you would expect from an animated film or a modern game launcher.',
      'The three examples below show the signature look: friendly proportions with premium studio lighting and soft gradient backdrops.',
    ],
    tips: [
      '3D renders love soft backgrounds — Studio or Gradient keeps the model as the hero.',
      'The rounded, friendly shapes survive tiny profile sizes better than photorealism.',
      '3D Gaming Avatar adds dramatic lighting if you want the render to feel more cinematic.',
    ],
    generatorHref: '/ai-3d-avatar-generator',
    generatorLabel: 'Try the AI 3D Avatar Generator',
  },
  {
    slug: 'social-media',
    label: 'Social Media',
    metaTitle: 'Social Media AI Avatar Examples — Colorful PFPs | AvatarForge',
    metaDescription:
      'Browse social media AI avatar examples with vibrant colors and trend-aware styling. Create a colorful PFP for Instagram, TikTok and X — free.',
    intro: [
      'The Social Media family is tuned for feeds: vibrant gradient backgrounds, fashion-forward styling and colors designed to stand out between photos and videos on Instagram, TikTok, X and WhatsApp.',
      'The three examples below show the range, from an influencer-style gradient portrait to bold, creative takes.',
    ],
    tips: [
      'Export at 1080px for Instagram or 400px for X using the platform presets in the generator.',
      'Vibrant Gradient backgrounds echo your highlight covers and story rings for a cohesive profile.',
      'Regenerate with a different expression to A/B test which PFP gets the better reaction.',
    ],
    generatorHref: '/social-media-avatar-generator',
    generatorLabel: 'Try the Social Media Avatar Generator',
  },
  {
    slug: 'character',
    label: 'Character',
    metaTitle: 'AI Character Avatar Examples — Fantasy & Original Characters | AvatarForge',
    metaDescription:
      'Browse fantasy and character AI avatar examples — armor, magic and original personas. Create an original AI character avatar from your photo, free.',
    intro: [
      'Character AI avatars turn your photo into an original persona: enchanted armor, mystical accents and epic lighting. These are original characters generated from your features — not existing copyrighted heroes.',
      'The three examples below show how far the transformation can go while keeping a trace of the person underneath.',
    ],
    tips: [
      'Great for RPG communities, Dungeon & Dragons campaigns, fan forums and creative writing profiles.',
      'Fantasy Gaming with the Abstract background gives the most dramatic, storybook feel.',
      'Because results are original characters, they are safe to use as unique roleplay identities.',
    ],
    generatorHref: '/ai-character-avatar-generator',
    generatorLabel: 'Try the AI Character Avatar Generator',
  },
];

/** Look up a category page by slug; returns undefined for unknown slugs. */
export function getGalleryCategoryPage(slug: string): GalleryCategoryMeta | undefined {
  return GALLERY_CATEGORY_PAGES.find((c) => c.slug === slug);
}
