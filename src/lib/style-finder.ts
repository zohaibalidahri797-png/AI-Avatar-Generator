import { STYLE_GROUPS } from './avatar-styles';

/**
 * "Style Finder" quiz — a small, honest recommendation engine.
 *
 * It is rule-based scoring over the real style families (no AI, no fake
 * personalization): each answer adds weight to the families it genuinely
 * suits, and the result recommends the top family plus two alternates with
 * links straight into the matching generator pages.
 */

export type FamilyId = (typeof STYLE_GROUPS)[number]['id'];

export interface QuizOption {
  id: string;
  label: string;
  hint: string;
  /** Weight added to each style family id when chosen. */
  weights: Partial<Record<FamilyId, number>>;
}

export interface QuizQuestion {
  id: string;
  title: string;
  subtitle: string;
  options: QuizOption[];
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'where',
    title: 'Where will you use your avatar?',
    subtitle: 'Different platforms reward different looks — this shapes the whole result.',
    options: [
      {
        id: 'work',
        label: 'Work & professional networks',
        hint: 'LinkedIn, company pages, speaker bios',
        weights: { professional: 3, realistic: 2, social: 1 },
      },
      {
        id: 'gaming',
        label: 'Gaming & streaming',
        hint: 'Discord, Twitch, team profiles',
        weights: { gaming: 3, '3d': 2, anime: 1 },
      },
      {
        id: 'social',
        label: 'Social media & messaging',
        hint: 'Instagram, TikTok, YouTube, WhatsApp',
        weights: { social: 3, cartoon: 1, '3d': 1, realistic: 1 },
      },
      {
        id: 'creative',
        label: 'Creative & fan communities',
        hint: 'Art forums, fandoms, role-play servers',
        weights: { anime: 3, cartoon: 2, gaming: 1 },
      },
      {
        id: 'everywhere',
        label: 'A bit of everything',
        hint: 'One avatar that fits most places',
        weights: { realistic: 2, '3d': 2, social: 2, cartoon: 1 },
      },
    ],
  },
  {
    id: 'vibe',
    title: 'Which look feels most like you?',
    subtitle: 'Pick the rendering style you would be happy to stare at every day.',
    options: [
      {
        id: 'lifelike',
        label: 'True to life',
        hint: 'Believable, like a well-taken photo',
        weights: { realistic: 3, professional: 1 },
      },
      {
        id: 'polished',
        label: 'Polished & businesslike',
        hint: 'Smart attire, trustworthy feel',
        weights: { professional: 3, realistic: 1 },
      },
      {
        id: 'illustrated',
        label: 'Illustrated & colorful',
        hint: 'Bold lines, flat colors, personality',
        weights: { cartoon: 3, social: 1 },
      },
      {
        id: 'animated',
        label: 'Anime energy',
        hint: 'Expressive eyes, cel shading, drama',
        weights: { anime: 3, gaming: 1 },
      },
      {
        id: 'dimensional',
        label: 'Dimensional & toy-like',
        hint: 'Smooth 3D render with soft light',
        weights: { '3d': 3, gaming: 1, social: 1 },
      },
      {
        id: 'edgy',
        label: 'Bold & dramatic',
        hint: 'Neon accents, intense lighting',
        weights: { gaming: 3, '3d': 1 },
      },
    ],
  },
  {
    id: 'boldness',
    title: 'How bold should the final avatar be?',
    subtitle: 'This tunes the balance between understated and statement-making.',
    options: [
      {
        id: 'understated',
        label: 'Understated & clean',
        hint: 'Quiet confidence, neutral backgrounds',
        weights: { professional: 2, realistic: 2 },
      },
      {
        id: 'balanced',
        label: 'Balanced',
        hint: 'Some color and character, nothing loud',
        weights: { '3d': 1, social: 1, cartoon: 1, realistic: 1, anime: 1 },
      },
      {
        id: 'statement',
        label: 'Statement-making',
        hint: 'Vivid gradients, glow, drama',
        weights: { gaming: 2, social: 2, anime: 1 },
      },
    ],
  },
];

export interface QuizResult {
  /** Top-scoring family. */
  family: (typeof STYLE_GROUPS)[number];
  /** Two runner-up families, same score order. */
  alternates: (typeof STYLE_GROUPS)[number][];
  /** Human-readable reasons derived from the actual answers. */
  reasons: string[];
}

const FAMILY_REASONS: Record<FamilyId, { where: string; vibe: string; bold: string }> = {
  realistic: {
    where: 'reads as “you” on platforms where a believable photo matters',
    vibe: 'keeps lifelike skin texture and lighting',
    bold: 'stays believable while your customization adds mood',
  },
  professional: {
    where: 'meets the expectations of recruiters and professional networks',
    vibe: 'projects a polished, business-ready appearance',
    bold: 'keeps things composed and trustworthy',
  },
  cartoon: {
    where: 'makes profiles friendly and approachable',
    vibe: 'brings bold outlines and colorful personality',
    bold: 'carries playful energy without going over the top',
  },
  anime: {
    where: 'fits creative and fan communities perfectly',
    vibe: 'delivers expressive anime eyes and clean cel shading',
    bold: 'takes drama and glow beautifully',
  },
  '3d': {
    where: 'stands out with a dimensional, collectible feel',
    vibe: 'gives you a smooth stylized 3D render',
    bold: 'balances character with a polished finish',
  },
  gaming: {
    where: 'is built for gaming and streaming profiles',
    vibe: 'brings dramatic lighting and esports energy',
    bold: 'goes all-in on neon, glow and intensity',
  },
  social: {
    where: 'is tuned for platform profile-picture slots',
    vibe: 'keeps colors bright and clickable',
    bold: 'loves vivid gradients and vibrant styling',
  },
};

/** Score the answers and return the recommended family + two alternates. */
export function scoreQuiz(answers: Record<string, string>): QuizResult | null {
  const scores = new Map<FamilyId, number>();

  QUIZ_QUESTIONS.forEach((q) => {
    const option = q.options.find((o) => o.id === answers[q.id]);
    if (!option) return;
    for (const [family, weight] of Object.entries(option.weights)) {
      scores.set(family as FamilyId, (scores.get(family as FamilyId) ?? 0) + (weight ?? 0));
    }
  });

  if (scores.size === 0) return null;

  const ranked = [...scores.entries()].sort((a, b) => b[1] - a[1]);
  const topId = ranked[0][0];
  const family = STYLE_GROUPS.find((g) => g.id === topId);
  if (!family) return null;

  const alternates = ranked
    .slice(1, 3)
    .map(([id]) => STYLE_GROUPS.find((g) => g.id === id))
    .filter((g): g is (typeof STYLE_GROUPS)[number] => Boolean(g));

  const reasons: string[] = [];
  if (answers.where) {
    const whereOpt = QUIZ_QUESTIONS[0].options.find((o) => o.id === answers.where);
    if (whereOpt) {
      reasons.push(`“${whereOpt.label}” — this family ${FAMILY_REASONS[topId].where}.`);
    }
  }
  if (answers.vibe) {
    const vibeOpt = QUIZ_QUESTIONS[1].options.find((o) => o.id === answers.vibe);
    if (vibeOpt) {
      reasons.push(`“${vibeOpt.label}” — it ${FAMILY_REASONS[topId].vibe}.`);
    }
  }
  if (answers.boldness) {
    const boldOpt = QUIZ_QUESTIONS[2].options.find((o) => o.id === answers.boldness);
    if (boldOpt) {
      reasons.push(`“${boldOpt.label}” — ${FAMILY_REASONS[topId].bold}.`);
    }
  }

  return { family, alternates, reasons };
}

/** Generator link that pre-selects the family's flagship style. */
export function familyGeneratorHref(familyId: string): string {
  const group = STYLE_GROUPS.find((g) => g.id === familyId);
  if (!group) return '/ai-avatar-generator';
  const first = group.substyles[0];
  return `/ai-avatar-generator?style=${group.id}&substyle=${encodeURIComponent(first.name)}`;
}
