'use client';

import {
  BookOpen,
  Camera,
  Cpu,
  Gamepad2,
  GraduationCap,
  HeartHandshake,
  Images,
  Lock,
  Mail,
  Palette,
  ShieldCheck,
  SlidersHorizontal,
  Store,
  TriangleAlert,
  User,
  Users,
  Wand2,
  Briefcase,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import PageHero from '@/components/shared/PageHero';
import CTABanner from '@/components/shared/CTABanner';
import { Link } from '@/lib/router';
import { useSeo } from '@/lib/seo';
import { site } from '@/lib/site';

function SectionHeading({
  kicker,
  title,
  description,
}: {
  kicker: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="text-xs font-semibold uppercase tracking-wider text-primary">{kicker}</p>
      <h2 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">{title}</h2>
      {description && (
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
          {description}
        </p>
      )}
    </div>
  );
}

const PAIN_POINTS = [
  {
    icon: Lock,
    title: 'Paywalled results',
    text: 'Most avatar tools let you upload a photo, do the work, and then hide the download behind a subscription or a one-off charge revealed at the last moment.',
  },
  {
    icon: Images,
    title: 'Watermarks everywhere',
    text: 'Free tiers that stamp their logo across the corner of your avatar force you to choose between a broken result and a payment for something that should simply be yours.',
  },
  {
    icon: User,
    title: 'Sign-up walls',
    text: 'Requiring an account, an email verification loop and a marketing consent checkbox just to export one image treats a 30-second task like a relationship.',
  },
];

const CAPABILITIES = [
  {
    icon: Palette,
    title: '31+ styles across 7 families',
    text: 'Realistic portraits, anime, cartoon, 3D, gaming, fantasy and illustrated looks — organized into style groups with substyles, so the range is wide without being overwhelming.',
  },
  {
    icon: Camera,
    title: 'Photo-to-avatar workflow',
    text: 'Upload a single photo and the AI redraws it in your chosen style while keeping the structure of your face, your hairstyle and your expression recognizable.',
  },
  {
    icon: SlidersHorizontal,
    title: 'Real customization',
    text: 'Background, lighting mood, expression and framing are adjustable per generation, so two people using the same style still get results that feel like their own.',
  },
  {
    icon: Wand2,
    title: 'Photo editor',
    text: 'A built-in editor lets you crop, adjust and prepare images before and after generation — one place for the whole avatar workflow instead of three tabs.',
  },
  {
    icon: BookOpen,
    title: 'Guides that respect your time',
    text: 'The blog and FAQ are written by the team that built the generator: practical steps, platform sizing rules and honest trade-offs, with no invented statistics.',
  },
  {
    icon: Images,
    title: 'A gallery of examples',
    text: 'Example renders for every style family show what each look actually produces before you spend a generation on it. All gallery portraits depict fictional people.',
  },
];

const AUDIENCES = [
  {
    icon: Users,
    title: 'Creators',
    text: 'Keep a consistent, recognizable persona across YouTube, TikTok and Discord without putting your real face everywhere.',
  },
  {
    icon: Briefcase,
    title: 'Professionals',
    text: 'Generate a clean, realistic headshot for LinkedIn and company pages when a photoshoot is not in the budget or the calendar.',
  },
  {
    icon: Gamepad2,
    title: 'Gamers',
    text: 'Forge a bold gaming identity that survives tiny chat icons, dark themes and the daily grind of active servers.',
  },
  {
    icon: GraduationCap,
    title: 'Students',
    text: 'Look polished on class forums, portfolios and early professional profiles without paying for portrait photography.',
  },
  {
    icon: Store,
    title: 'Small businesses',
    text: 'Give team pages and customer-facing accounts coherent, friendly avatars generated from the photos you already have.',
  },
];

export default function AboutPage() {
  useSeo({
    title: 'About AvatarForge — Our Mission & Approach | AvatarForge',
    description:
      'Why we built a free AI avatar generator, how it works, who it is for, our privacy and technology approach, and the limitations we are honest about.',
    path: '/about',
  });

  return (
    <>
      <PageHero
        badge="About us"
        title="Making great AI avatars accessible to everyone"
        description="AvatarForge is a free, browser-first AI avatar generator built on a simple belief: creating a great profile picture should take minutes, not money."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'About' }]}
      />

      {/* Why we built AvatarForge */}
      <section className="py-14 sm:py-20" aria-labelledby="why-we-built">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            kicker="Our mission"
            title="Why we built AvatarForge"
            description="Profile pictures are the first impression of the internet. They greet recruiters, teammates, communities and friends long before anyone reads a word you wrote — and until recently, getting a good one meant choosing between an expensive photoshoot and a compromised free tool."
          />
          <div className="mx-auto mt-10 grid max-w-5xl gap-6 md:grid-cols-3">
            {PAIN_POINTS.map((point) => (
              <div key={point.title} className="rounded-2xl border bg-card p-6 shadow-sm card-hover">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent text-primary">
                  <point.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 font-bold tracking-tight">{point.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{point.text}</p>
              </div>
            ))}
          </div>
          <p className="mx-auto mt-10 max-w-3xl text-center text-sm leading-relaxed text-muted-foreground sm:text-base">
            We wanted the alternative we kept looking for: a fast, free, browser-first generator
            where the upload is the only gate between you and a finished avatar. No watermark on
            your result, no account required, no reveal-the-price moment at download. Modern AI
            image models made that possible; our job was to wrap them in a workflow that respects
            your time and your privacy.
          </p>
        </div>
      </section>

      {/* What the platform provides */}
      <section className="py-14 sm:py-20" aria-labelledby="what-we-provide">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            kicker="The platform"
            title="What the platform provides"
            description="One coherent workspace for the entire avatar journey — styles, generation, editing, examples and education."
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {CAPABILITIES.map((cap) => (
              <div key={cap.title} className="rounded-2xl border bg-card p-6 shadow-sm card-hover">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-fuchsia-500 text-white">
                  <cap.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 font-bold tracking-tight">{cap.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{cap.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who it is for */}
      <section className="py-14 sm:py-20" aria-labelledby="who-its-for">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            kicker="Audience"
            title="Who it is for"
            description="Anyone who shows up online — which is to say, everyone. These are the groups we design for most explicitly."
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {AUDIENCES.map((aud) => (
              <div key={aud.title} className="rounded-2xl border bg-card p-6 shadow-sm card-hover">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-primary">
                    <aud.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="font-bold tracking-tight">{aud.title}</h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{aud.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy + technology */}
      <section className="py-14 sm:py-20" aria-labelledby="privacy-tech">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Privacy approach */}
            <div className="rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent text-primary">
                <ShieldCheck className="h-5 w-5" aria-hidden="true" />
              </span>
              <h2 id="privacy-tech" className="mt-4 text-xl font-extrabold tracking-tight sm:text-2xl">
                Our privacy approach
              </h2>
              <ul className="mt-4 list-disc space-y-2.5 pl-5 text-sm leading-relaxed text-foreground/90 marker:text-primary">
                <li>
                  Your photo is processed to generate the avatar you asked for. It is not stored as
                  part of an account, because there are no accounts — and not added to any gallery.
                </li>
                <li>No signup is required for any tool on the site.</li>
                <li>
                  Local storage on your device is limited to the essentials that make the app work,
                  such as remembering your theme preference. See our cookie policy for the details.
                </li>
                <li>
                  The full details of what we collect, why, and how to request deletion live in the
                  Privacy Policy — written to be read, not skimmed past.
                </li>
              </ul>
              <Link href="/privacy-policy" className="mt-5 inline-block">
                <Button variant="outline" size="sm" className="gap-2">
                  <Lock className="h-4 w-4" aria-hidden="true" />
                  Read the Privacy Policy
                </Button>
              </Link>
            </div>

            {/* Technology approach */}
            <div className="rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent text-primary">
                <Cpu className="h-5 w-5" aria-hidden="true" />
              </span>
              <h2 className="mt-4 text-xl font-extrabold tracking-tight sm:text-2xl">
                Our technology approach
              </h2>
              <ul className="mt-4 list-disc space-y-2.5 pl-5 text-sm leading-relaxed text-foreground/90 marker:text-primary">
                <li>
                  A modern web application: fast pages, light and dark themes, and a fully
                  responsive interface that works as well on a phone as on a desktop.
                </li>
                <li>
                  AI processing runs server-side behind a modular AI layer, so no API keys or model
                  credentials are ever exposed in your browser.
                </li>
                <li>
                  Progressive enhancement as a principle: the site is navigable and readable on its
                  own, and the AI tools layer on top of that solid base.
                </li>
                <li>
                  Style families and customization options are structured data, not hardcoded
                  prompts — which is how one photo can flow into dozens of consistent looks.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Honest limitations */}
      <section className="py-14 sm:py-20" aria-labelledby="limitations">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="rounded-3xl border bg-card p-6 shadow-sm sm:p-10">
            <div className="flex items-start gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-accent text-primary">
                <TriangleAlert className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <h2 id="limitations" className="text-xl font-extrabold tracking-tight sm:text-2xl">
                  Honest limitations
                </h2>
                <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                  Every AI tool has boundaries, and pretending otherwise helps nobody. Here is
                  exactly where AvatarForge stops being magic:
                </p>
              </div>
            </div>
            <ul className="mt-6 grid list-disc gap-3 pl-5 text-sm leading-relaxed text-foreground/90 marker:text-primary md:grid-cols-2 md:gap-x-8">
              <li>
                Results vary between generations — the process is probabilistic, so two runs with
                the same photo and settings will not be identical.
              </li>
              <li>
                Resemblance depends on the source photo: shadowed, angled or blurry inputs produce
                weaker likenesses no matter which style you choose.
              </li>
              <li>
                Generated faces may include artifacts — occasional oddities in hands, teeth, hair
                edges or accessories. Generate a few candidates and curate.
              </li>
              <li>
                Do not use avatars to impersonate real people or for deceptive purposes: no
                fake employee photos, no misrepresentation, no synthetic faces passed off as
                specific humans.
              </li>
              <li>
                The example gallery shows fictional people, not customers — we do not publish
                user images or claim endorsements.
              </li>
              <li>
                We do not promise photorealism on every style: some families are deliberately
                stylized, and that is the point.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-14 sm:py-20" aria-labelledby="contact-cta">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto max-w-3xl rounded-2xl border bg-card p-6 text-center shadow-sm sm:p-10">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-fuchsia-500 text-white">
              <Mail className="h-6 w-6" aria-hidden="true" />
            </span>
            <h2 className="mt-5 text-2xl font-extrabold tracking-tight sm:text-3xl">
              Talk to the team
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              Questions, feedback, bug reports or feature ideas — we read everything.
              {site.contactEmail ? ' The fastest route is email:' : ' Reach us through the contact page:'}
            </p>
            {site.contactEmail && (
              <a
                href={`mailto:${site.contactEmail}`}
                className="mt-4 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-accent px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-accent/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
                {site.contactEmail}
              </a>
            )}
            <div className="mt-6">
              <Link href="/contact">
                <Button className="gap-2 bg-gradient-to-r from-primary to-fuchsia-500 text-white shadow-md">
                  <HeartHandshake className="h-4 w-4" aria-hidden="true" />
                  Open the contact page
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <CTABanner
        title="See what all the fuss is about"
        text="Upload a photo, pick a style, and meet your AI avatar in seconds. Free, no signup, no watermarks."
        primaryLabel="Create your avatar now"
        primaryHref="/ai-avatar-generator"
        secondaryLabel="See how it works"
        secondaryHref="/how-it-works"
      />
    </>
  );
}
