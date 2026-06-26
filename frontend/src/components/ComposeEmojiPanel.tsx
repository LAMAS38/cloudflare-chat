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
  onClose?: () => void;
  variant?: "mobile" | "desktop";
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

function CategoryPills({
  activeId,
  onSelect,
  compact = false,
  iconsOnly = false,
}: {
  activeId: string | null;
  onSelect: (id: string) => void;
  compact?: boolean;
  iconsOnly?: boolean;
}) {
  return (
    <div
      className={`media-picker-category-nav ${compact ? "media-picker-category-nav-compact" : ""} ${iconsOnly ? "media-picker-category-nav-icons" : ""}`}
      role="navigation"
      aria-label="Catégories"
    >
      {EMOJI_CATEGORIES.map((category) => (
        <button
          key={category.id}
          type="button"
          className={`media-picker-category-pill ${iconsOnly ? "media-picker-category-pill-icon-only" : ""} ${activeId === category.id ? "media-picker-category-pill-active" : ""}`}
          onClick={() => onSelect(category.id)}
          onPointerDown={(e) => e.preventDefault()}
          aria-label={category.label}
          title={category.label}
        >
          <span className="media-picker-category-pill-icon" aria-hidden>
            {category.emojis[0]}
          </span>
          {!iconsOnly && <span>{category.label}</span>}
        </button>
      ))}
    </div>
  );
}

export function ComposeEmojiPanel({
  open,
  panelRef,
  onPick,
  onClose,
  variant = "desktop",
}: ComposeEmojiPanelProps) {
  const isMobile = variant === "mobile";
  const [tab, setTab] = useState<EmojiTab>("all");
  const [query, setQuery] = useState("");
  const [focusCategory, setFocusCategory] = useState<string | null>(
    () => EMOJI_CATEGORIES[0]?.id ?? null,
  );
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

  const activeCategory = useMemo(() => {
    if (!focusCategory) return EMOJI_CATEGORIES[0];
    return EMOJI_CATEGORIES.find((category) => category.id === focusCategory) ?? EMOJI_CATEGORIES[0];
  }, [focusCategory]);

  useEffect(() => {
    if (!open) {
      setTab("all");
      setQuery("");
      setFocusCategory(EMOJI_CATEGORIES[0]?.id ?? null);
      return;
    }

    setRecent(getRecentEmojis());
  }, [open]);

  useEffect(() => {
    if (!open || isMobile) return;

    const id = window.requestAnimationFrame(() => {
      searchRef.current?.focus({ preventScroll: true });
    });
    return () => window.cancelAnimationFrame(id);
  }, [open, isMobile]);

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

  const renderMobileBody = () => {
    if (filteredCategories.length === 0) {
      return (
        <EmptyState title="Aucun résultat" description="Essayez « rire », « coeur » ou un emoji." />
      );
    }

    if (query.trim()) {
      return (
        <div className="media-picker-sections">
          {filteredCategories.map((category) => (
            <section key={category.id} className="media-picker-section">
              <h3 className="media-picker-section-title">{category.label}</h3>
              <EmojiGrid emojis={category.emojis} onPick={onPick} />
            </section>
          ))}
        </div>
      );
    }

    return (
      <div className="media-picker-sections media-picker-sections-mobile">
        {filteredRecent.length > 0 && (
          <section className="media-picker-section media-picker-section-recent">
            <div className="media-picker-row">
              {filteredRecent.map((emoji) => (
                <EmojiButton key={`recent-${emoji}`} emoji={emoji} onPick={onPick} />
              ))}
            </div>
          </section>
        )}
        <section className="media-picker-section">
          <EmojiGrid emojis={activeCategory?.emojis ?? []} onPick={onPick} />
        </section>
      </div>
    );
  };

  const renderDesktopBody = () => {
    if (tab === "all") {
      return (
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
      );
    }

    if (filteredCategories.length === 0) {
      return (
        <EmptyState title="Aucun résultat" description="Essayez « rire », « coeur » ou un emoji." />
      );
    }

    if (query.trim()) {
      return (
        <div className="media-picker-sections">
          {filteredCategories.map((category) => (
            <section key={category.id} className="media-picker-section">
              <h3 className="media-picker-section-title">{category.label}</h3>
              <EmojiGrid emojis={category.emojis} onPick={onPick} />
            </section>
          ))}
        </div>
      );
    }

    return (
      <section className="media-picker-section">
        <h3 className="media-picker-section-title">{activeCategory?.label}</h3>
        <EmojiGrid emojis={activeCategory?.emojis ?? []} onPick={onPick} />
      </section>
    );
  };

  const panel = (
    <div
      id="emoji-picker-panel"
      ref={panelRef}
      className={`media-picker ${isMobile ? "media-picker-mobile" : "media-picker-desktop"}`}
      role="dialog"
      aria-modal="true"
      aria-label="Insérer un emoji"
      onPointerDown={(e) => e.stopPropagation()}
    >
      <div className="media-picker-handle" aria-hidden>
        <span className="media-picker-handle-bar" />
      </div>

      {!isMobile && (
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
      )}

      {!isMobile && (
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
          {query ? (
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
          ) : null}
        </div>
      )}

      {isMobile && onClose && (
        <div className="media-picker-mobile-toolbar">
          <p className="media-picker-mobile-toolbar-title">Emojis</p>
          <button
            type="button"
            className="media-picker-search-close media-picker-mobile-toolbar-close"
            onPointerDown={(e) => e.preventDefault()}
            onClick={onClose}
            aria-label="Fermer le sélecteur d'emojis"
          >
            <AppIcon icon={X} size="sm" />
          </button>
        </div>
      )}

      {isMobile && !query.trim() && (
        <CategoryPills
          activeId={focusCategory}
          onSelect={setFocusCategory}
          compact
          iconsOnly
        />
      )}

      {!isMobile && tab === "emoji" && !query.trim() && (
        <CategoryPills activeId={focusCategory} onSelect={setFocusCategory} />
      )}

      <div className="media-picker-body">
        {isMobile ? renderMobileBody() : renderDesktopBody()}
      </div>
    </div>
  );

  if (!open) return null;

  return panel;
}
