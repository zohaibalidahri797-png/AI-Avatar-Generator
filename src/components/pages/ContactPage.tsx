'use client';

import { useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  Clock3,
  ListChecks,
  Mail,
  ShieldCheck,
  Wand2,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import PageHero from '@/components/shared/PageHero';
import CTABanner from '@/components/shared/CTABanner';
import { Link } from '@/lib/router';
import { useSeo } from '@/lib/seo';
import { site } from '@/lib/site';
import { toast } from '@/hooks/use-toast';

const TOPICS = [
  'General question',
  'Technical support',
  'Feedback',
  'Feature request',
  'Privacy request',
] as const;

type Topic = (typeof TOPICS)[number];
type FieldName = 'name' | 'email' | 'topic' | 'message';
type Errors = Partial<Record<FieldName, string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function FieldError({ message, id }: { message?: string; id: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="text-xs font-medium text-destructive">
      {message}
    </p>
  );
}

function InfoCard({
  icon: Icon,
  title,
  children,
}: {
  icon: LucideIcon;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border bg-card p-6 shadow-sm card-hover">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-primary">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <h2 className="mt-4 font-bold tracking-tight">{title}</h2>
      <div className="mt-2 text-sm leading-relaxed text-muted-foreground">{children}</div>
    </div>
  );
}

export default function ContactPage() {
  useSeo({
    title: 'Contact Us — AvatarForge Support & Feedback | AvatarForge',
    description:
      'Contact the AvatarForge team for general questions, technical support, feedback, feature requests or privacy requests.',
    path: '/contact',
  });

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState<Topic | ''>('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Errors>({});

  const validate = (): boolean => {
    const next: Errors = {};
    if (!name.trim()) next.name = 'Please enter your name.';
    if (!email.trim()) next.email = 'Please enter your email address.';
    else if (!EMAIL_PATTERN.test(email.trim()))
      next.email = 'That email address does not look valid.';
    if (!topic) next.topic = 'Please choose a topic.';
    if (!message.trim()) next.message = 'Please write a short message.';
    else if (message.trim().length < 10)
      next.message = 'Please add a little more detail (at least 10 characters).';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    if (!site.contactEmail) {
      // No support email is configured for this deployment — say so honestly
      // instead of opening a broken mailto link.
      toast({
        title: 'Email is not available yet',
        description:
          'This deployment has no support email configured. Please reach us through one of the other channels listed on this page.',
      });
      return;
    }

    const subject = `[${site.name}] ${topic} — ${name.trim()}`;
    const body = [
      message.trim(),
      '',
      '—',
      `Reply-to: ${email.trim()}`,
      `Sent via the ${site.name} contact form`,
    ].join('\n');

    const mailto = `mailto:${site.contactEmail}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    // Hand the message to the user's own email client — nothing is sent or stored by this site.
    window.location.href = mailto;

    toast({
      title: 'Opening your email client',
      description: 'Your message is ready to send — nothing is stored on our servers.',
    });
  };

  return (
    <>
      <PageHero
        badge="Contact"
        title="Get in touch"
        description="Questions, feedback or feature ideas — we read everything."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Contact' }]}
      />

      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-8 lg:grid-cols-5">
            {/* Contact form */}
            <div className="lg:col-span-3">
              <div className="rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
                <h2 className="text-xl font-extrabold tracking-tight sm:text-2xl">
                  Send us a message
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Fill in the form below and your email app will open with everything pre-written.
                </p>

                <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="contact-name">
                        Name <span className="text-destructive" aria-hidden="true">*</span>
                      </Label>
                      <Input
                        id="contact-name"
                        name="name"
                        autoComplete="name"
                        placeholder="Your name"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          if (errors.name) setErrors((p) => ({ ...p, name: undefined }));
                        }}
                        aria-invalid={Boolean(errors.name)}
                        aria-describedby={errors.name ? 'contact-name-error' : undefined}
                      />
                      <FieldError message={errors.name} id="contact-name-error" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact-email">
                        Email <span className="text-destructive" aria-hidden="true">*</span>
                      </Label>
                      <Input
                        id="contact-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (errors.email) setErrors((p) => ({ ...p, email: undefined }));
                        }}
                        aria-invalid={Boolean(errors.email)}
                        aria-describedby={errors.email ? 'contact-email-error' : undefined}
                      />
                      <FieldError message={errors.email} id="contact-email-error" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contact-topic">
                      Topic <span className="text-destructive" aria-hidden="true">*</span>
                    </Label>
                    <Select
                      value={topic || undefined}
                      onValueChange={(value) => {
                        setTopic(value as Topic);
                        if (errors.topic) setErrors((p) => ({ ...p, topic: undefined }));
                      }}
                    >
                      <SelectTrigger
                        id="contact-topic"
                        aria-invalid={Boolean(errors.topic)}
                        aria-describedby={errors.topic ? 'contact-topic-error' : undefined}
                        className="w-full"
                      >
                        <SelectValue placeholder="Choose a topic" />
                      </SelectTrigger>
                      <SelectContent>
                        {TOPICS.map((t) => (
                          <SelectItem key={t} value={t}>
                            {t}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FieldError message={errors.topic} id="contact-topic-error" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contact-message">
                      Message <span className="text-destructive" aria-hidden="true">*</span>
                    </Label>
                    <Textarea
                      id="contact-message"
                      name="message"
                      rows={6}
                      placeholder="Tell us what is on your mind — the more detail, the faster we can help."
                      value={message}
                      onChange={(e) => {
                        setMessage(e.target.value);
                        if (errors.message) setErrors((p) => ({ ...p, message: undefined }));
                      }}
                      aria-invalid={Boolean(errors.message)}
                      aria-describedby={errors.message ? 'contact-message-error' : undefined}
                    />
                    <FieldError message={errors.message} id="contact-message-error" />
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full gap-2 bg-gradient-to-r from-primary to-fuchsia-500 text-white shadow-md sm:w-auto"
                    >
                      <Wand2 className="h-4 w-4" aria-hidden="true" />
                      Send message
                    </Button>
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      <span className="text-destructive" aria-hidden="true">
                        *
                      </span>{' '}
                      Required fields.
                    </p>
                  </div>
                </form>

                <p className="mt-6 rounded-xl bg-accent/60 p-3 text-xs leading-relaxed text-muted-foreground">
                  Honest note: this form opens your email client — we never store messages on this
                  site. Your draft is composed locally and sent from your own address.
                </p>
              </div>
            </div>

            {/* Info cards */}
            <div className="space-y-6 lg:col-span-2">
              <InfoCard icon={Mail} title="Email us">
                {site.contactEmail ? (
                  <a
                    href={`mailto:${site.contactEmail}`}
                    className="font-semibold text-primary transition-colors hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {site.contactEmail}
                  </a>
                ) : (
                  <p className="font-semibold text-primary">Not configured yet</p>
                )}
                <p className="mt-1.5">The direct route — the contact form simply pre-fills it.</p>
              </InfoCard>

              <InfoCard icon={Clock3} title="Response time">
                We usually reply within 2–3 business days. Privacy requests get the same care and
                the same inbox.
              </InfoCard>

              <InfoCard icon={ListChecks} title="What to include">
                <ul className="list-disc space-y-1.5 pl-4">
                  <li>The page or tool you were using</li>
                  <li>Your browser and device</li>
                  <li>A short description of what happened</li>
                  <li>A screenshot if relevant</li>
                </ul>
              </InfoCard>

              <InfoCard icon={ShieldCheck} title="Privacy requests">
                Want your data deleted or have a question about how photos are handled? Choose
                “Privacy request” as the topic, or read the{' '}
                <Link
                  href="/privacy-policy"
                  className="font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Privacy Policy
                </Link>{' '}
                first — it explains what is collected and how deletion works.
              </InfoCard>
            </div>
          </div>
        </div>
      </section>

      <CTABanner
        title="Prefer to skip the inbox?"
        text="The generator needs no account and no support ticket — upload a photo and create your avatar right now."
        primaryLabel="Open the avatar generator"
        primaryHref="/ai-avatar-generator"
        secondaryLabel="Read the FAQ"
        secondaryHref="/faq"
      />
    </>
  );
}
