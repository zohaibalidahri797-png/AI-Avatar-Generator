'use client';

import { format, parseISO } from 'date-fns';
import { FileText, Lock, ShieldCheck } from 'lucide-react';
import PageHero from '@/components/shared/PageHero';
import { Button } from '@/components/ui/button';
import { LEGAL_DOCS } from '@/lib/legal-data';
import { Link } from '@/lib/router';
import { site } from '@/lib/site';
import { useSeo } from '@/lib/seo';

type LegalSlug = keyof typeof LEGAL_DOCS;

const ALL_SLUGS: LegalSlug[] = ['privacy-policy', 'terms', 'disclaimer', 'cookie-policy'];

/** Extracts the first sentence of the intro for the hero description (intros avoid "e.g." style periods). */
function firstSentence(text: string): string {
  const end = text.indexOf('. ');
  return end === -1 ? text : text.slice(0, end + 1);
}

export default function LegalPage({ doc }: { doc: LegalSlug }) {
  const docData = LEGAL_DOCS[doc];
  const formattedDate = format(parseISO(docData.updated), 'MMMM d, yyyy');

  useSeo({
    title: `${docData.metaTitle} | AvatarForge`,
    description: docData.metaDescription,
    path: `/${doc}`,
  });

  return (
    <>
      <PageHero
        badge="Legal"
        title={docData.title}
        description={firstSentence(docData.intro)}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: docData.title },
        ]}
      />

      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto max-w-3xl">
            {/* Intro card */}
            <div className="rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-accent px-3 py-1 text-xs font-semibold text-primary">
                  <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                  Last updated: {formattedDate}
                </span>
              </div>
              <p className="mt-4 leading-relaxed text-muted-foreground">{docData.intro}</p>
            </div>

            {/* Document body */}
            <article aria-label={docData.title}>
              {docData.sections.map((section) => (
                <section key={section.heading}>
                  <h2 className="mt-10 text-xl font-bold tracking-tight sm:text-2xl">
                    {section.heading}
                  </h2>
                  {section.paragraphs?.map((paragraph, i) => (
                    <p
                      key={i}
                      className="mt-4 leading-relaxed text-muted-foreground"
                    >
                      {paragraph}
                    </p>
                  ))}
                  {section.list && (
                    <ul className="mt-4 space-y-2.5">
                      {section.list.map((item, i) => (
                        <li
                          key={i}
                          className="flex gap-2.5 leading-relaxed text-muted-foreground"
                        >
                          <span
                            className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
                            aria-hidden="true"
                          />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}
            </article>

            {/* Contact card */}
            <div className="mt-14 rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
              <div className="flex flex-col items-start gap-4 sm:flex-row">
                <span
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent text-primary"
                  aria-hidden="true"
                >
                  <Lock className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="text-xl font-bold tracking-tight">
                    Questions about this document?
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
                    The fastest way to reach us about {docData.title.toLowerCase()} matters is our{' '}
                    <Link
                      href="/contact"
                      className="font-medium text-primary underline-offset-4 hover:underline"
                    >
                      contact page
                    </Link>
                    {site.contactEmail && (
                      <>
                        {' '}
                        or write to{' '}
                        <a
                          href={`mailto:${site.contactEmail}`}
                          className="font-medium text-primary underline-offset-4 hover:underline"
                        >
                          {site.contactEmail}
                        </a>
                      </>
                    )}
                    .
                  </p>
                </div>
              </div>
            </div>

            {/* Other legal documents */}
            <nav aria-label="Other legal documents" className="mt-12">
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                Other legal documents
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {ALL_SLUGS.filter((slug) => slug !== doc).map((slug) => (
                  <Button key={slug} asChild variant="outline" size="sm" className="rounded-full">
                    <Link href={`/${slug}`}>
                      <FileText className="h-3.5 w-3.5" aria-hidden="true" />
                      {LEGAL_DOCS[slug].title}
                    </Link>
                  </Button>
                ))}
              </div>
            </nav>
          </div>
        </div>
      </section>
    </>
  );
}
