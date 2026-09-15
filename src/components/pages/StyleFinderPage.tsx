'use client';

import { useCallback, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Compass,
  GalleryHorizontalEnd,
  RotateCcw,
  Sparkles,
  Wand2,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import CTABanner from '@/components/shared/CTABanner';
import PageHero from '@/components/shared/PageHero';
import { Link } from '@/lib/router';
import { useSeo } from '@/lib/seo';
import { cn } from '@/lib/utils';
import {
  familyGeneratorHref,
  QUIZ_QUESTIONS,
  scoreQuiz,
  type QuizResult,
} from '@/lib/style-finder';
import { categorySlug } from '@/lib/gallery-data';

/**
 * Style Finder — a three-question quiz that recommends an avatar style family.
 * Honest by design: rule-based scoring over real data, no fake personalization,
 * and the result links straight into the matching generator.
 */

const STORAGE_KEY = 'avatarforge-style-finder-answer';

export default function StyleFinderPage() {
  useSeo({
    title: 'Avatar Style Finder — Which AI Avatar Style Fits You? | AvatarForge',
    description:
      'Answer three quick questions and get an honest AI avatar style recommendation — realistic, professional, cartoon, anime, 3D, gaming or social media, with direct links to generate it free.',
    path: '/style-finder',
  });

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<QuizResult | null>(null);
  const reduceMotion = useReducedMotion();

  const question = QUIZ_QUESTIONS[step];
  const progress = result ? 100 : Math.round((step / QUIZ_QUESTIONS.length) * 100);

  const pick = (optionId: string) => {
    const next = { ...answers, [question.id]: optionId };
    setAnswers(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* storage unavailable — quiz still works for this visit */
    }
    if (step + 1 < QUIZ_QUESTIONS.length) {
      setStep(step + 1);
    } else {
      setResult(scoreQuiz(next));
    }
  };

  const back = () => {
    if (result) {
      setResult(null);
      return;
    }
    if (step > 0) setStep(step - 1);
  };

  const restart = useCallback(() => {
    setStep(0);
    setAnswers({});
    setResult(null);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const motionProps = useMemo(
    () =>
      reduceMotion
        ? { initial: false, animate: {}, exit: {} }
        : {
            initial: { opacity: 0, y: 16 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0, y: -16 },
          },
    [reduceMotion]
  );

  return (
    <>
      <PageHero
        badge="Style Finder"
        title="Which AI avatar style fits you?"
        description="Three quick questions, one honest recommendation. The quiz scores your answers against our real style families — no account, no photo needed, nothing stored on a server."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Style Finder' },
        ]}
      />

      <section className="mx-auto max-w-3xl px-4 pb-16 sm:px-6" aria-labelledby="quiz-heading">
        <h2 id="quiz-heading" className="sr-only">
          Avatar style quiz
        </h2>

        {/* Progress rail */}
        <div className="mb-8" aria-hidden="true">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <span>{result ? 'Your result' : `Question ${step + 1} of ${QUIZ_QUESTIONS.length}`}</span>
            <span>{progress}%</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-accent">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-fuchsia-500 transition-[width] duration-500 ease-out"
              style={{ width: `${Math.max(progress, 6)}%` }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div key={`q-${step}`} {...motionProps} transition={{ duration: 0.25 }}>
              <Card className="card-glow border-border/70">
                <CardContent className="p-6 sm:p-8">
                  <p className="eyebrow">Question {step + 1}</p>
                  <h3 className="mt-2 text-xl font-bold tracking-tight sm:text-2xl">
                    {question.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {question.subtitle}
                  </p>

                  <div
                    className="mt-6 grid gap-3"
                    role="group"
                    aria-label={question.title}
                  >
                    {question.options.map((option) => {
                      const selected = answers[question.id] === option.id;
                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => pick(option.id)}
                          aria-pressed={selected}
                          className={cn(
                            'group flex items-center justify-between gap-4 rounded-xl border bg-card px-4 py-3.5 text-left transition-all',
                            'hover:border-primary/50 hover:shadow-md hover:shadow-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                            selected && 'border-primary bg-primary/5'
                          )}
                        >
                          <span>
                            <span className="block text-sm font-semibold sm:text-base">
                              {option.label}
                            </span>
                            <span className="mt-0.5 block text-xs text-muted-foreground sm:text-sm">
                              {option.hint}
                            </span>
                          </span>
                          <span
                            className={cn(
                              'flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-muted-foreground transition-all',
                              'group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground',
                              selected && 'border-primary bg-primary text-primary-foreground'
                            )}
                            aria-hidden="true"
                          >
                            <ArrowRight className="h-4 w-4" />
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {step > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={back}
                      className="mt-5 gap-1.5 text-muted-foreground"
                    >
                      <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                      Previous question
                    </Button>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div key="result" {...motionProps} transition={{ duration: 0.25 }}>
              <Card className="gradient-ring border-border/70">
                <CardContent className="p-6 sm:p-8">
                  <p className="eyebrow">Your recommendation</p>
                  <h3 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
                    <span className="gradient-text">{result.family.label}</span> avatar styles
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
                    {result.family.tagline}. Based on your answers, this family is the strongest
                    match — and the two alternates below are worth a look too.
                  </p>

                  <ul className="mt-5 space-y-2.5">
                    {result.reasons.map((reason, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm leading-relaxed">
                        <CheckCircle2
                          className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                          aria-hidden="true"
                        />
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <Button
                      asChild
                      size="lg"
                      className="btn-sheen w-full gap-2 bg-gradient-to-r from-primary to-fuchsia-500 text-white shadow-lg shadow-primary/25 hover:opacity-90 sm:w-auto"
                    >
                      <Link href={familyGeneratorHref(result.family.id)}>
                        <Wand2 className="h-4 w-4" aria-hidden="true" />
                        Generate a {result.family.label.toLowerCase()} avatar
                      </Link>
                    </Button>
                    <Button asChild size="lg" variant="outline" className="w-full gap-2 sm:w-auto">
                      <Link href={`/gallery/${categorySlug(result.family.label)}`}>
                        <GalleryHorizontalEnd className="h-4 w-4" aria-hidden="true" />
                        See examples first
                      </Link>
                    </Button>
                  </div>

                  <div className="mt-8 border-t pt-6">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Also worth a try
                    </p>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      {result.alternates.map((alt) => (
                        <Link
                          key={alt.id}
                          href={familyGeneratorHref(alt.id)}
                          className="group flex items-center justify-between gap-3 rounded-xl border bg-card px-4 py-3 transition-all hover:border-primary/50 hover:shadow-md hover:shadow-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          <span>
                            <span className="block text-sm font-semibold">{alt.label}</span>
                            <span className="block text-xs text-muted-foreground">
                              {alt.tagline}
                            </span>
                          </span>
                          <ArrowRight
                            className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary"
                            aria-hidden="true"
                          />
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                    <p className="text-xs text-muted-foreground">
                      Answers stay in this browser only — retake anytime.
                    </p>
                    <Button variant="ghost" size="sm" onClick={restart} className="gap-1.5">
                      <RotateCcw className="h-4 w-4" aria-hidden="true" />
                      Retake the quiz
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Honesty note + helpful links */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <Card className="border-border/70">
            <CardContent className="flex items-start gap-3 p-5">
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent text-primary"
                aria-hidden="true"
              >
                <Compass className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-semibold">How this works</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  The quiz is a simple matching table, not an AI fortune teller: your picks add
                  points to the style families they genuinely suit, and the top scorer wins. Every
                  recommendation links to a real generator on this site.
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/70">
            <CardContent className="flex items-start gap-3 p-5">
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent text-primary"
                aria-hidden="true"
              >
                <Sparkles className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-semibold">Want the full picture?</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  Browse all{' '}
                  <Link
                    href="/categories"
                    className="font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    style categories
                  </Link>{' '}
                  or read{' '}
                  <Link
                    href="/blog/how-to-choose-the-right-ai-avatar-style"
                    className="font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    how to choose the right AI avatar style
                  </Link>{' '}
                  for a deeper comparison.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 flex justify-center">
          <Badge
            variant="secondary"
            className="max-w-full gap-1.5 whitespace-normal rounded-full px-3 py-1 text-center"
          >
            <CheckCircle2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            No signup · nothing uploaded · answers never leave your browser
          </Badge>
        </div>
      </section>

      <CTABanner
        title="Already know your style?"
        text="Skip the quiz and go straight to the generator — 31 styles across seven families, free and without signup."
        primaryLabel="Open the AI Avatar Generator"
        primaryHref="/ai-avatar-generator"
        secondaryLabel="Browse all styles"
        secondaryHref="/categories"
      />
    </>
  );
}
