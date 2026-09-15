import { site } from './site';
import type { LegalDoc } from './types';

/**
 * Legal documents for AvatarForge.
 *
 * Content is written for THIS product specifically: a free, accountless,
 * browser-based AI avatar generator that forwards uploaded photos to a
 * third-party AI image service over HTTPS and returns a downloadable PNG.
 * No newsletters, no ad networks, no user galleries — and the copy below
 * never pretends otherwise.
 */

/**
 * Support contact used inside legal copy. When no support email is configured
 * (NEXT_PUBLIC_SUPPORT_EMAIL), the sentences fall back to the contact page
 * instead of printing an invented address.
 */
const emailLine = site.contactEmail
  ? `email ${site.contactEmail}`
  : 'reach us through the contact page on this site';

export const LEGAL_DOCS: Record<'privacy-policy' | 'terms' | 'disclaimer' | 'cookie-policy', LegalDoc> = {
  'privacy-policy': {
    slug: 'privacy-policy',
    title: 'Privacy Policy',
    metaTitle: 'Privacy Policy',
    metaDescription:
      'How AvatarForge handles the photos you upload, the avatars we generate and the minimal data we store. No accounts, no ads, no public galleries.',
    updated: '2025-12-01',
    intro:
      'This policy explains what AvatarForge collects, how your photos are processed when you generate an avatar, and the choices you have. We are able to keep it short because our data practices are simple: there are no accounts, no advertising and no public galleries.',
    sections: [
      {
        heading: 'What we collect',
        paragraphs: [
          'AvatarForge is an accountless, browser-based tool. When you generate an avatar, the only content we receive is the photo you upload together with the style and customization options you selected. We do not ask for your name, email address or payment details, because there is nothing to register for and nothing to pay for.',
          'A small amount of technical data may be processed as part of any ordinary web request, such as your IP address and browser user agent, which can appear in server logs.',
        ],
        list: [
          'The photo you upload for a generation request',
          'The style, background, lighting, expression and framing options you select',
          'Essential technical logs (for example IP address and user agent) kept for security and abuse prevention',
        ],
      },
      {
        heading: 'How photo processing works',
        paragraphs: [
          'When you press the generate button, your photo is transmitted over an encrypted HTTPS connection to our backend. There it is combined with your chosen style options and forwarded to a third-party AI image service, which re-renders your likeness in the selected style. The finished avatar is returned to your browser and displayed in the studio.',
          'This processing is performed solely to produce the avatar you asked for. Your photo is not used to train models, not added to any public gallery and not used to build marketing or advertising profiles.',
        ],
      },
      {
        heading: 'Data retention',
        paragraphs: [
          'AvatarForge does not maintain user galleries, portfolios or accounts, so there is no profile where your images are stored. Uploads and generated avatars are not intentionally persisted beyond what is technically required to complete your generation request and deliver the result to your browser.',
          'Because the service runs without accounts, we cannot retrieve or re-deliver an avatar after your session ends. What you keep is what you download — so save the files you like.',
        ],
      },
      {
        heading: 'Third-party AI providers',
        paragraphs: [
          'Avatar generation relies on third-party AI image services. When you generate an avatar, your photo and style parameters are passed to these providers as a necessary part of producing the result. We do not sell or share your data with advertisers, data brokers or any party beyond what generation requires.',
        ],
      },
      {
        heading: 'Analytics and advertising',
        paragraphs: [
          'No third-party analytics or advertising scripts are currently integrated into this site. We do not run remarketing pixels, cross-site trackers or ad networks. If that ever changes, this policy and our Cookie Policy will be updated first, and the change will be described in plain language.',
        ],
      },
      {
        heading: 'Your rights and choices',
        paragraphs: [
          'You do not need an account to control your data, because almost nothing about you is stored by us in the first place. The photo you upload never leaves your device until you press generate, and you can clear the theme preference and cookie-notice acknowledgement from your browser storage at any time.',
          'If you have a specific request — for example, you want to ask whether data connected to a particular generation can be removed — email us and we will answer concretely rather than with boilerplate.',
        ],
      },
      {
        heading: "Children's privacy",
        paragraphs: [
          'AvatarForge is not directed to children under the age of 13, and we do not knowingly collect personal information from children. Because the service runs without accounts, we never ask for age or identity data. If you believe a child has used the service in a way that concerns you, contact us and we will investigate.',
        ],
      },
      {
        heading: 'Changes to this policy',
        paragraphs: [
          'We may update this policy as the service evolves, for example if we add new tools or change AI providers. Material changes will be reflected in the "Last updated" date at the top of this page. Continued use of the site after a change means you accept the updated policy.',
        ],
      },
      {
        heading: 'Contact us',
        paragraphs: [
          site.contactEmail
            ? `Questions, requests or complaints about privacy can be sent to ${site.contactEmail}. We aim to respond within a reasonable timeframe. If you prefer a form, you can also reach us through the contact page on this site.`
            : 'Questions, requests or complaints about privacy can be sent through the contact page on this site. We aim to respond within a reasonable timeframe.',
        ],
      },
    ],
  },

  terms: {
    slug: 'terms',
    title: 'Terms & Conditions',
    metaTitle: 'Terms & Conditions',
    metaDescription:
      "The rules for using AvatarForge's free AI avatar generator: acceptable use, rights to uploaded photos, licensing of generated avatars and liability.",
    updated: '2025-12-01',
    intro:
      'These terms govern your use of AvatarForge, a free browser-based AI avatar generator. By using the site you agree to them, so we have written them as plainly as possible.',
    sections: [
      {
        heading: 'Acceptance of terms',
        paragraphs: [
          'By accessing or using AvatarForge you agree to these terms. If you do not agree, please do not use the service. You should be at least 13 years old to use the site, and if you use it on behalf of an organization you confirm that you are authorized to do so.',
        ],
      },
      {
        heading: 'What the service is',
        paragraphs: [
          'AvatarForge provides free online tools that transform an uploaded photo into a stylized AI avatar. The service is offered as-is, in the browser, without registration. We may add, change or remove tools and styles over time, and features that rely on third-party AI providers may occasionally be slow or unavailable.',
        ],
      },
      {
        heading: 'Acceptable use',
        paragraphs: [
          'You agree to use the service only for lawful purposes and only with photos you are allowed to use. Specifically, you agree not to:',
        ],
        list: [
          'Upload photos you do not own or do not have permission to use',
          'Create avatars intended to impersonate real people, public figures or organizations in a deceptive way',
          'Generate content that is illegal, harmful, hateful, harassing, sexually explicit or deceptive',
          'Attempt to overload, automate at scale or abuse the generation API, or bypass technical limits',
          'Resell the service itself or present the site as your own product',
        ],
      },
      {
        heading: 'AI-generated output and your license',
        paragraphs: [
          'Avatar generation is probabilistic: the same photo and settings can produce different results on each run, and the AI may exaggerate, smooth or reinterpret details. We do not guarantee that any output will look exactly the way you expected.',
          'Subject to these terms, you receive a personal, worldwide, royalty-free license to use the avatars you generate — including for commercial purposes such as business profiles, branding and channel art. This license does not extend to uses that violate the law or infringe the rights of others, and it does not transfer ownership of the underlying AI models or of the site itself.',
        ],
      },
      {
        heading: 'No warranty',
        paragraphs: [
          'The service is provided "as is" and "as available", without warranties of any kind, express or implied, including warranties of merchantability, fitness for a particular purpose and non-infringement. We do not warrant that the service will be uninterrupted or error-free, or that generated avatars will meet your expectations.',
        ],
      },
      {
        heading: 'Limitation of liability',
        paragraphs: [
          'To the maximum extent permitted by law, the operators of AvatarForge will not be liable for any indirect, incidental, special, consequential or punitive damages, or for any loss of data, profits or goodwill, arising from or related to your use of the service. You are responsible for keeping copies of the avatars you download.',
        ],
      },
      {
        heading: 'Availability and changes to the service',
        paragraphs: [
          'We may modify, suspend or discontinue any part of the service at any time, with or without notice. Because there are no accounts or paid plans, there are no refunds or service credits of any kind. We may also set reasonable technical limits on generation volume to keep the free service available for everyone.',
        ],
      },
      {
        heading: 'Governing law',
        paragraphs: [
          "These terms are governed by the laws of the operator's principal place of business. If any provision of these terms is found unenforceable, the remaining provisions stay in effect.",
        ],
      },
      {
        heading: 'Contact',
        paragraphs: [
          site.contactEmail
            ? `Questions about these terms can be sent to ${site.contactEmail}. For the practical side of using the tool, the FAQ page covers most day-to-day questions.`
            : 'Questions about these terms can be sent through the contact page on this site. For the practical side of using the tool, the FAQ page covers most day-to-day questions.',
        ],
      },
    ],
  },

  disclaimer: {
    slug: 'disclaimer',
    title: 'Disclaimer',
    metaTitle: 'Disclaimer',
    metaDescription:
      'AvatarForge results vary and examples are fictional AI images. Platform names are trademarks of their owners; this site is not affiliated with them.',
    updated: '2025-12-01',
    intro:
      'The information and tools on AvatarForge are provided for general informational and creative purposes. Please read this page before relying on anything you generate or read here.',
    sections: [
      {
        heading: 'Informational purpose',
        paragraphs: [
          'Content on this site — guides, blog posts, FAQ answers and descriptions — is general information about AI avatar tools. It is not a guarantee of results and may become outdated as the product or the underlying AI models change.',
        ],
      },
      {
        heading: 'AI results vary',
        paragraphs: [
          'AI image generation is inherently variable. The similarity of an avatar to the source photo, the accuracy of style details and the absence of artifacts cannot be guaranteed. Hands, accessories, hair and small text can render imperfectly, and some styles interpret a face more loosely than others. Always review an avatar before using it publicly.',
        ],
      },
      {
        heading: 'Example images are fictional',
        paragraphs: [
          'The portraits shown in our gallery and elsewhere on the site are AI-generated depictions of people who do not exist. They are not customers, employees or endorsements, and any resemblance to real persons is coincidental.',
        ],
      },
      {
        heading: 'Not professional advice',
        paragraphs: [
          'Nothing on this site constitutes legal, financial or professional advice. If you have questions about image rights, employer policies on AI-generated photos, or brand guidelines for your organization, consult a qualified professional before acting.',
        ],
      },
      {
        heading: 'Trademarks and platform names',
        paragraphs: [
          'YouTube, TikTok, Discord, Instagram, LinkedIn, Twitch and other platform names mentioned on this site are trademarks of their respective owners. They are referenced descriptively to explain where avatars can be used. AvatarForge is not affiliated with, endorsed by or sponsored by any of these platforms.',
        ],
      },
      {
        heading: 'External links',
        paragraphs: [
          'Where we link to external websites, we do so for convenience only. We do not control those sites and are not responsible for their content, availability or privacy practices.',
        ],
      },
      {
        heading: 'Contact',
        paragraphs: [
          `If you spot an error on this page or have a concern about content, ${emailLine} and we will look into it.`,
        ],
      },
    ],
  },

  'cookie-policy': {
    slug: 'cookie-policy',
    title: 'Cookie Policy',
    metaTitle: 'Cookie Policy',
    metaDescription:
      'The only data AvatarForge stores on your device is a cookie-notice acknowledgement and an optional theme preference. No ads, no analytics trackers.',
    updated: '2025-12-01',
    intro:
      'This policy describes the small amount of data AvatarForge keeps in your browser. There are no advertising cookies and no analytics trackers on this site.',
    sections: [
      {
        heading: 'What we store on your device',
        paragraphs: [
          'AvatarForge does not set traditional tracking cookies. Instead, the site stores two small entries in your browser local storage:',
        ],
        list: [
          'avatarforge-cookie-notice-acknowledged — records that you dismissed the cookie notice, so it does not reappear on every visit',
          'an optional theme preference (light or dark), stored only if you actively change the theme',
        ],
      },
      {
        heading: 'No advertising or analytics cookies',
        paragraphs: [
          'We currently integrate no third-party advertising networks, remarketing pixels or analytics services, so no third-party cookies are placed through this site. If that ever changes, this policy will be updated and the cookie notice will reflect it before the change goes live.',
        ],
      },
      {
        heading: 'Why we store this data',
        paragraphs: [
          'Both entries are strictly functional: they exist so the notice does not nag you repeatedly and so the site respects the theme you chose. Neither entry identifies you personally, and neither is shared with anyone.',
        ],
      },
      {
        heading: 'How to clear this data',
        paragraphs: [
          'You can clear local storage entries through your browser settings — typically under Privacy or Site Data for this domain. Clearing them has no side effects beyond the cookie notice appearing again and the theme resetting to your system default.',
        ],
      },
      {
        heading: 'Changes to this policy',
        paragraphs: [
          'If the data we store changes — for example because a new tool needs an additional preference — we will update this page and revise the "Last updated" date. Material additions will be announced through the cookie notice itself.',
        ],
      },
      {
        heading: 'Contact',
        paragraphs: [
          `Questions about storage on your device can be sent through ${site.contactEmail ? site.contactEmail : 'the contact page on this site'}.`,
        ],
      },
    ],
  },
};
