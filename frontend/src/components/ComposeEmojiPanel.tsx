import { useCallback, useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { ChevronRight, Search, X } from "lucide-react";
import {
  EMOJI_CATEGORIES,
  filterEmojiCategories,
  filterEmojiList,
  type EmojiCategory,
} from "../lib/composeEmojis";
import { getRecentEmojis, pushRecentEmoji } from "../lib/recentEmojis";
import { AppIcon } from "./ui/icon";

type EmojiTab = "all" | "emoji";

const TABS: { id: EmojiTab; label: string }[] = [
  { id: "all", label: "Tout" },
  { id: "emoji", label: "Émoticônes" },
];

const PREVIEW_COUNT = 8;

interface ComposeEmojiPanelProps {
  open: boolean;
  panelRef: RefObject<HTMLDivElement | null>;
  onPick: (emoji: string) => void;
}

function EmojiButton({ emoji, onPick }: { emoji: string; onPick: (emoji: string) => void }) {
  const handlePick = () => {
    pushRecentEmoji(emoji);
    onPick(emoji);
  };

  return (
    <button
      type="button"
      className="media-picker-emoji"
      onPointerDown={(e) => e.preventDefault()}
      onClick={handlePick}
      aria-label={`Insérer ${emoji}`}
    >
      <span className="media-picker-glyph" aria-hidden>
        {emoji}
      </span>
    </button>
  );
}

function EmojiGrid({
  emojis,
  onPick,
}: {
  emojis: readonly string[];
  onPick: (emoji: string) => void;
}) {
  return (
    <div className="media-picker-grid">
      {emojis.map((emoji) => (
        <EmojiButton key={emoji} emoji={emoji} onPick={onPick} />
      ))}
    </div>
  );
}

function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="media-picker-empty">
      <p className="media-picker-empty-title">{title}</p>
      <p className="media-picker-empty-text">{description}</p>
    </div>
  );
}

export function ComposeEmojiPanel({ open, panelRef, onPick }: ComposeEmojiPanelProps) {
  const [tab, setTab] = useState<EmojiTab>("all");
  const [query, setQuery] = useState("");
  const [focusCategory, setFocusCategory] = useState<string | null>(null);
  const [recent, setRecent] = useState<string[]>(() => getRecentEmojis());
  const searchRef = useRef<HTMLInputElement>(null);

  const filteredCategories = useMemo(
    () => filterEmojiCategories(EMOJI_CATEGORIES, query),
    [query],
  );

  const filteredRecent = useMemo(
    () => filterEmojiList(recent, query),
    [recent, query],
  );

  useEffect(() => {
    if (!open) {
      setTab("all");
      setQuery("");
      setFocusCategory(null);
      return;
    }

    setRecent(getRecentEmojis());
  }, [open]);

  useEffect(() => {
    if (tab === "emoji" && !focusCategory) {
      setFocusCategory(EMOJI_CATEGORIES[0]?.id ?? null);
    }
  }, [tab, focusCategory]);

  useEffect(() => {
    if (!open) return;

    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    if (isMobile) return;

    const id = window.requestAnimationFrame(() => {
      searchRef.current?.focus({ preventScroll: true });
    });
    return () => window.cancelAnimationFrame(id);
  }, [open]);

  const activeCategory = useMemo(() => {
    if (!focusCategory) return EMOJI_CATEGORIES[0];
    return EMOJI_CATEGORIES.find((category) => category.id === focusCategory) ?? EMOJI_CATEGORIES[0];
  }, [focusCategory]);

  const openCategory = useCallback((categoryId: string) => {
    setFocusCategory(categoryId);
    setTab("emoji");
    setQuery("");
  }, []);

  const renderCategorySection = (category: EmojiCategory, preview = false) => {
    const emojis =
      preview && !query.trim() ? category.emojis.slice(0, PREVIEW_COUNT) : category.emojis;

    return (
      <section key={category.id} className="media-picker-section">
        <div className="media-picker-section-head">
          <h3 className="media-picker-section-title">{category.label}</h3>
          {preview && !query.trim() && category.emojis.length > PREVIEW_COUNT && (
            <button
              type="button"
              className="media-picker-show-all"
              onClick={() => openCategory(category.id)}
            >
              Tout afficher
              <AppIcon icon={ChevronRight} size="sm" aria-hidden />
            </button>
          )}
        </div>
        {preview ? (
          <div className="media-picker-row">
            {emojis.map((emoji) => (
              <EmojiButton key={`${category.id}-${emoji}`} emoji={emoji} onPick={onPick} />
            ))}
          </div>
        ) : (
          <EmojiGrid emojis={emojis} onPick={onPick} />
        )}
      </section>
    );
  };

  return (
    <div
      id="emoji-picker-panel"
      ref={panelRef}
      className="media-picker"
      role="dialog"
      aria-modal="true"
      aria-label="Insérer un emoji"
      onPointerDown={(e) => e.stopPropagation()}
    >
      <div className="media-picker-handle" aria-hidden>
        <span className="media-picker-handle-bar" />
      </div>

      <div className="media-picker-tabs" role="tablist" aria-label="Catégories d'emojis">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={tab === item.id}
            className={`media-picker-tab ${tab === item.id ? "media-picker-tab-active" : ""}`}
            onClick={() => {
              setTab(item.id);
              if (item.id === "emoji") {
                setFocusCategory((current) => current ?? EMOJI_CATEGORIES[0]?.id ?? null);
              } else {
                setFocusCategory(null);
              }
            }}
          >
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      <div className="media-picker-search-wrap">
        <AppIcon icon={Search} size="sm" className="media-picker-search-icon" aria-hidden />
        <input
          ref={searchRef}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher un emoji…"
          className="media-picker-search"
          aria-label="Rechercher un emoji"
          enterKeyHint="search"
        />
        {query && (
          <button
            type="button"
            className="media-picker-search-clear"
            onClick={() => {
              setQuery("");
              searchRef.current?.focus();
            }}
            aria-label="Effacer la recherche"
          >
            <AppIcon icon={X} size="sm" />
          </button>
        )}
      </div>

      {tab === "emoji" && !query.trim() && (
        <div className="media-picker-category-nav" role="navigation" aria-label="Catégories">
          {EMOJI_CATEGORIES.map((category) => (
            <button
              key={category.id}
              type="button"
              className={`media-picker-category-pill ${focusCategory === category.id ? "media-picker-category-pill-active" : ""}`}
              onClick={() => setFocusCategory(category.id)}
            >
              {category.label}
            </button>
          ))}
        </div>
      )}

      <div className="media-picker-body">
        {tab === "all" && (
          <div className="media-picker-sections">
            {filteredRecent.length > 0 && (
              <section className="media-picker-section">
                <div className="media-picker-section-head">
                  <h3 className="media-picker-section-title">Récents</h3>
                </div>
                <div className="media-picker-row">
                  {filteredRecent.map((emoji) => (
                    <EmojiButton key={`recent-${emoji}`} emoji={emoji} onPick={onPick} />
                  ))}
                </div>
              </section>
            )}

            {filteredCategories.length === 0 ? (
              <EmptyState title="Aucun résultat" description="Essayez « rire », « coeur » ou un emoji." />
            ) : (
              filteredCategories.map((category) => renderCategorySection(category, true))
            )}
          </div>
        )}

        {tab === "emoji" && (
          <div className="media-picker-sections">
            {filteredCategories.length === 0 ? (
              <EmptyState title="Aucun résultat" description="Essayez « rire », « coeur » ou un emoji." />
            ) : query.trim() ? (
              filteredCategories.map((category) => (
                <section key={category.id} className="media-picker-section">
                  <h3 className="media-picker-section-title">{category.label}</h3>
                  <EmojiGrid emojis={category.emojis} onPick={onPick} />
                </section>
              ))
            ) : (
              <section className="media-picker-section">
                <h3 className="media-picker-section-title">{activeCategory?.label}</h3>
                <EmojiGrid emojis={activeCategory?.emojis ?? []} onPick={onPick} />
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
