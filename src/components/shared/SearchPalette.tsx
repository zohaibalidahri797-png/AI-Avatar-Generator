'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  FileText,
  GalleryHorizontalEnd,
  HelpCircle,
  Home,
  Layers,
  Palette,
  Search,
  Sparkles,
  Wand2,
} from 'lucide-react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { NAV_EVENT, useRouter } from '@/lib/router';
import { cn } from '@/lib/utils';
import { filterSearchEntries, SEARCH_ENTRIES, type SearchGroup } from '@/lib/search-index';

/**
 * Global search palette (Ctrl/⌘+K).
 * Indexes pages, generators, style families, gallery categories, guides and FAQs.
 * Opened via keyboard shortcut, the header button, or the `avatarforge:open-search`
 * CustomEvent so any page can invite users to search.
 */

const GROUP_ICONS: Record<SearchGroup, React.ReactNode> = {
  Pages: <Home className="h-4 w-4" aria-hidden="true" />,
  Generators: <Wand2 className="h-4 w-4" aria-hidden="true" />,
  'Style families': <Palette className="h-4 w-4" aria-hidden="true" />,
  Gallery: <GalleryHorizontalEnd className="h-4 w-4" aria-hidden="true" />,
  Guides: <BookOpen className="h-4 w-4" aria-hidden="true" />,
  FAQ: <HelpCircle className="h-4 w-4" aria-hidden="true" />,
};

const QUICK_LINKS = SEARCH_ENTRIES.filter((e) =>
  ['page-tool', 'page-style-finder', 'page-photo-editor', 'gallery-hub', 'page-faq'].includes(e.id)
);

const EMPTY_GROUP_ORDER: SearchGroup[] = ['Pages', 'Generators', 'Guides'];

export default function SearchPalette() {
  const { navigate } = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const toggle = useCallback(() => setOpen((v) => !v), []);

  // Close the palette whenever the route changes (browser back/forward, or any
  // external navigation while the dialog is open) so it never sits stranded
  // over a new page. Subscribed as an external-system event, per React guidance.
  // The router fires `af:navigated` on every programmatic navigation and on
  // each pathname change; popstate covers back/forward directly.
  useEffect(() => {
    const close = () => {
      setOpen(false);
      setQuery('');
    };
    const onNav = (e: Event) => {
      if (e.type === NAV_EVENT || e.type === 'popstate') close();
    };
    window.addEventListener(NAV_EVENT, onNav);
    window.addEventListener('popstate', onNav);
    return () => {
      window.removeEventListener(NAV_EVENT, onNav);
      window.removeEventListener('popstate', onNav);
    };
  }, []);

  useEffect(() => {
    const onKeydown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        toggle();
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener('keydown', onKeydown);
    window.addEventListener('avatarforge:open-search', onOpen);
    return () => {
      window.removeEventListener('keydown', onKeydown);
      window.removeEventListener('avatarforge:open-search', onOpen);
    };
  }, [toggle]);

  const results = useMemo(() => filterSearchEntries(query), [query]);

  const grouped = useMemo(() => {
    const map = new Map<SearchGroup, typeof results>();
    for (const entry of results) {
      const list = map.get(entry.group) ?? [];
      list.push(entry);
      map.set(entry.group, list);
    }
    return map;
  }, [results]);

  const select = (href: string) => {
    setOpen(false);
    setQuery('');
    navigate(href);
  };

  const renderItems = (group: SearchGroup) => {
    const items = query ? grouped.get(group) ?? [] : [];
    if (!query) {
      // Idle state: curated quick links, one group at a time.
      if (group === 'Pages') {
        return QUICK_LINKS.map((e) => <ResultItem key={e.id} entry={e} onSelect={select} />);
      }
      if (group === 'Generators') {
        return SEARCH_ENTRIES.filter((e) => e.group === 'Generators')
          .slice(0, 4)
          .map((e) => <ResultItem key={e.id} entry={e} onSelect={select} />);
      }
      if (group === 'Guides') {
        return SEARCH_ENTRIES.filter((e) => e.group === 'Guides')
          .slice(0, 3)
          .map((e) => <ResultItem key={e.id} entry={e} onSelect={select} />);
      }
      return null;
    }
    const list = grouped.get(group);
    if (!list?.length) return null;
    return list.map((e) => <ResultItem key={e.id} entry={e} onSelect={select} />);
  };

  const groupsToShow: SearchGroup[] = query
    ? (['Pages', 'Generators', 'Style families', 'Gallery', 'Guides', 'FAQ'] as SearchGroup[]).filter(
        (g) => grouped.get(g)?.length
      )
    : EMPTY_GROUP_ORDER;

  return (
    <CommandDialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) setQuery('');
      }}
      title="Search AvatarForge"
      description="Search pages, generators, styles, gallery examples, guides and FAQs."
      className="sm:max-w-xl md:max-w-2xl"
    >
      <CommandInput
        placeholder="Search pages, styles, guides…"
        value={query}
        onValueChange={setQuery}
        aria-label="Search AvatarForge"
      />
      <CommandList className="max-h-[min(60vh,420px)]">
        {query && results.length === 0 && (
          <CommandEmpty>
            <span className="flex flex-col items-center gap-2 py-6 text-sm text-muted-foreground">
              <Search className="h-6 w-6 opacity-50" aria-hidden="true" />
              No matches for “{query}”. Try “pfp”, “anime”, “headshot” or “editor”.
            </span>
          </CommandEmpty>
        )}

        {groupsToShow.map((group, i) => (
          <div key={group}>
            {i > 0 && <CommandSeparator className="my-1" />}
            <CommandGroup
              heading={
                <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {GROUP_ICONS[group]}
                  {group}
                </span>
              }
            >
              {renderItems(group)}
            </CommandGroup>
          </div>
        ))}

        {!query && (
          <div className="px-4 pb-3 pt-1">
            <p className="text-xs text-muted-foreground">
              Type to search everything — or press <Kbd>Esc</Kbd> to close.
            </p>
          </div>
        )}
      </CommandList>
    </CommandDialog>
  );
}

function ResultItem({
  entry,
  onSelect,
}: {
  entry: (typeof SEARCH_ENTRIES)[number];
  onSelect: (href: string) => void;
}) {
  return (
    <CommandItem
      value={`${entry.title} ${entry.description} ${entry.keywords ?? ''}`}
      onSelect={() => onSelect(entry.href)}
      className="group gap-3 rounded-lg px-3 py-2.5 aria-selected:bg-accent"
    >
      <span
        className={cn(
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border bg-accent/60 text-primary',
          'group-aria-selected:border-primary/40 group-aria-selected:bg-primary/10'
        )}
        aria-hidden="true"
      >
        {entry.group === 'Guides' ? (
          <FileText className="h-4 w-4" />
        ) : entry.group === 'FAQ' ? (
          <HelpCircle className="h-4 w-4" />
        ) : entry.group === 'Gallery' ? (
          <Layers className="h-4 w-4" />
        ) : entry.href === '/style-finder' ? (
          <Sparkles className="h-4 w-4" />
        ) : (
          <Wand2 className="h-4 w-4" />
        )}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium">{entry.title}</span>
        <span className="block truncate text-xs text-muted-foreground">{entry.description}</span>
      </span>
      <ArrowRight
        className="h-4 w-4 shrink-0 -translate-x-1 text-primary opacity-0 transition-all group-aria-selected:translate-x-0 group-aria-selected:opacity-100"
        aria-hidden="true"
      />
    </CommandItem>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="rounded-md border bg-accent px-1.5 py-0.5 font-mono text-[10px] font-semibold text-muted-foreground">
      {children}
    </kbd>
  );
}
