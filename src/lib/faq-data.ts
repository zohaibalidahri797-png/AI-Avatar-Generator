import type { FaqItem } from './types';

/**
 * Frequently asked questions shown on the FAQ page.
 *
 * FAQ_GROUPS is the source of truth; FAQS is derived from it so that every
 * question appears exactly once across the groups.
 */

const GETTING_STARTED: FaqItem[] = [
  {
    question: 'What is an AI Avatar Generator?',
    answer:
      'An AI avatar generator is an online tool that turns an ordinary photo into a stylized portrait using artificial intelligence. AvatarForge runs entirely in your browser: you upload a photo, choose one of 31 art styles, fine-tune options like background, lighting, expression and framing, then download the finished avatar as a PNG. It is free to use and requires no account.',
  },
  {
    question: 'How does an AI Avatar Generator work?',
    answer:
      'You start by uploading a clear photo of a face, which the AI model analyzes for structure, features and lighting. The model then re-renders that likeness in the art style you picked, while respecting your customization choices for background, lighting, expression and framing. When generation finishes, the avatar appears in the studio ready to preview and download.',
  },
  {
    question: 'Can I create an avatar from my selfie?',
    answer:
      'Yes — selfies are the most common starting point. Upload a JPG, PNG or WebP photo up to 10 MB straight from your phone or computer, pick a style, and the AI rebuilds your likeness as a stylized portrait. A recent selfie taken in even light with your whole face visible gives the sharpest results.',
  },
  {
    question: 'What type of photo should I upload?',
    answer:
      'Upload a clear, well-lit, front-facing photo where the face is unobstructed and fills a good part of the frame — JPG, PNG or WebP up to 10 MB. Avoid heavy filters, sunglasses, masks, strong shadows and group shots, because they make it harder for the AI to read your features. A plain background also helps the model focus on you.',
  },
  {
    question: 'How can I get better avatar results?',
    answer:
      'Start with the best possible source photo: sharp focus, natural light, a neutral expression and no hair covering the face. Choose a style that matches your goal — a corporate headshot for work, an anime look for gaming communities — and fine-tune the background, lighting and framing options before generating. If the first result is not quite right, adjust one setting at a time and regenerate.',
  },
];

const STYLES_CUSTOMIZATION: FaqItem[] = [
  {
    question: 'Can I create a professional avatar?',
    answer:
      'Yes. The Professional & Corporate style group is built for business contexts — clean studio-style lighting, neutral backgrounds and business-appropriate attire rendered by the AI. It works well for LinkedIn, company team pages, email signatures and speaker profiles.',
  },
  {
    question: 'Can I create an anime avatar?',
    answer:
      'Yes, anime is one of the most popular categories on AvatarForge. Pick a substyle from the Anime & Manga group — from classic cel-shaded looks to modern anime portraits — then adjust the background and lighting to set the mood. Your facial features stay recognizable while everything is redrawn in anime form.',
  },
  {
    question: 'Can I create a gaming avatar?',
    answer:
      'Yes. The Gaming & Fantasy group includes cyberpunk, warrior and sci-fi looks designed for streamers and players. Pair one with a dark or neon background and dramatic lighting, then download the PNG for Twitch, Discord, Steam or your game launcher profile.',
  },
  {
    question: 'Can I create a YouTube profile picture?',
    answer:
      'Yes. Generate your avatar with a bold style and a clean or colorful background, then download the PNG. YouTube shows channel avatars as a small circle, so a simple background and a tightly framed face read best at that size — the framing options in the studio help you center the subject.',
  },
  {
    question: 'Can I create a Discord PFP?',
    answer:
      'Absolutely. Discord profile pictures are small and circular, so choose a style with strong contrast — anime, gaming and cartoon styles all work well — and use the framing and background options to keep the face prominent. Download the PNG and upload it directly in your Discord user settings.',
  },
  {
    question: 'Can I create a LinkedIn profile picture?',
    answer:
      'Yes. For LinkedIn, pick a style from the Professional & Corporate group with a neutral background and soft studio lighting so the result reads like a real headshot. Since recruiters and clients will see it, avoid heavily stylized looks on this network and keep the expression friendly but composed.',
  },
  {
    question: 'Can I change the avatar background?',
    answer:
      'Yes. Background is a core customization option in the studio: after choosing a style you can select solid studio colors, gradients and scene-style backgrounds before generating. Combined with the lighting options, this lets you match the avatar to the platform where it will be used.',
  },
];

const DOWNLOADS_FORMATS: FaqItem[] = [
  {
    question: 'Can I create multiple avatar styles?',
    answer:
      'Yes, and it is encouraged. Every generation is independent, so you can run the same photo through several styles — for example a corporate headshot, an anime portrait and a cyberpunk look — and download all of them. Changing styles or options never affects avatars you already generated.',
  },
  {
    question: 'Can I download my avatar?',
    answer:
      'Yes. As soon as a generation finishes, a download button appears next to the preview and saves the avatar as a high-resolution PNG to your device. Downloads are free, there is no watermark, and you can re-download or generate as many variations as you like.',
  },
  {
    question: 'Which image formats are supported?',
    answer:
      'You can upload JPG, PNG and WebP photos up to 10 MB as source images. Generated avatars are delivered as PNG files, which keep edges and details crisp and work everywhere from social platforms to team wikis. If your photo is in another format such as HEIC, convert it to JPG first.',
  },
  {
    question: 'How long does generation take?',
    answer:
      'Most avatars are ready within seconds, though exact timing depends on server load and the complexity of the chosen style. The studio shows a live progress state while the AI works, so you always know what is happening. If a request ever fails, simply try again.',
  },
  {
    question: 'Is the AI Avatar Generator free?',
    answer:
      'Yes, AvatarForge is completely free. You can generate and download avatars at no cost, with no watermark and no paywall in front of the download button. There is nothing to subscribe to, because there are no accounts in the first place.',
  },
  {
    question: 'Do you support dark mode and mobile?',
    answer:
      'Yes on both counts. The whole site — including the avatar studio — is fully responsive and works on phones, tablets and desktops, and it includes a proper dark mode that follows your system preference or the toggle in the header. Your theme choice is remembered locally on your device.',
  },
];

const ACCOUNTS_PRIVACY_USAGE: FaqItem[] = [
  {
    question: 'Do I need an account?',
    answer:
      'No. AvatarForge has no accounts, logins or passwords — you open the site, upload a photo and start generating. Because there is no account, nothing you create is stored in a profile gallery on our side; what you keep is what you download.',
  },
  {
    question: 'Is signup required?',
    answer:
      'No signup, no email address and no credit card are required. The full flow — upload, style selection, customization, generation and download — works anonymously in your browser. This also means we cannot recover anything on your behalf, since we never collect contact details.',
  },
  {
    question: 'Can I use my avatar on social media?',
    answer:
      'Yes. The downloaded PNG works anywhere a profile image can be uploaded: Instagram, TikTok, YouTube, Discord, X, Telegram, WhatsApp and more. If a platform crops avatars into a circle, use the studio framing options to keep the face centered before you download.',
  },
  {
    question: 'Can I use an AI avatar for a business profile?',
    answer:
      'Yes. Avatars generated with AvatarForge can be used for company team pages, staff directories, Slack or Teams profiles and similar contexts, as long as you have the rights to the source photo. For brand-critical assets like an official logo, a professionally shot photo is still the better tool — an AI avatar is a stylized portrait, not a photograph of record.',
  },
  {
    question: 'What happens to my uploaded photo?',
    answer:
      'When you press generate, your photo is sent over an encrypted HTTPS connection to our backend, combined with your chosen style options, and processed by a third-party AI image service to produce the avatar. Your uploads are not added to any public gallery and are not used to build marketing profiles. Full details, including retention, are in our Privacy Policy.',
  },
  {
    question: 'Can I use my avatar commercially?',
    answer:
      'Yes — under our Terms you receive a broad license to use the avatars you generate, including commercial uses such as branding and business profiles. Two conditions apply: you must hold the rights to the source photo you upload, and you may not use generated images to impersonate real people or deceive others.',
  },
];

export const FAQ_GROUPS: { title: string; questions: FaqItem[] }[] = [
  { title: 'Getting started', questions: GETTING_STARTED },
  { title: 'Styles & customization', questions: STYLES_CUSTOMIZATION },
  { title: 'Downloads & formats', questions: DOWNLOADS_FORMATS },
  { title: 'Accounts, privacy & usage', questions: ACCOUNTS_PRIVACY_USAGE },
];

/** Flat list of all questions — derived from the groups so nothing is duplicated or missing. */
export const FAQS: FaqItem[] = FAQ_GROUPS.flatMap((group) => group.questions);
