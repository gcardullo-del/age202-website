"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ArrowUpRight,
  Box,
  LoaderCircle,
  Search,
  Shirt,
  UserRound,
  X,
} from "lucide-react";

type MuseumSearchResultType =
  | "PLAYER"
  | "ARTIFACT"
  | "BRAND";

type MuseumSearchResult = {
  id: string;
  type: MuseumSearchResultType;
  title: string;
  subtitle: string | null;
  href: string;
  imageUrl: string | null;
  keywords: string[];
};

type MuseumSearchResponse = {
  query: string;
  results: MuseumSearchResult[];
  total: number;
  error?: string;
};

type GlobalMuseumSearchProps = {
  open: boolean;
  onClose: () => void;
};

const MIN_QUERY_LENGTH = 2;
const SEARCH_DELAY = 220;

const resultTypeLabels: Record<
  MuseumSearchResultType,
  string
> = {
  PLAYER: "Player",
  ARTIFACT: "Artifact",
  BRAND: "Brand",
};

function ResultIcon({
  type,
}: {
  type: MuseumSearchResultType;
}) {
  if (type === "PLAYER") {
    return (
      <UserRound
        size={18}
        strokeWidth={1.7}
      />
    );
  }

  if (type === "ARTIFACT") {
    return (
      <Shirt
        size={18}
        strokeWidth={1.7}
      />
    );
  }

  return (
    <Box
      size={18}
      strokeWidth={1.7}
    />
  );
}

function HighlightMatch({
  text,
  query,
}: {
  text: string;
  query: string;
}) {
  const normalizedQuery =
    query.trim();

  if (!normalizedQuery) {
    return <>{text}</>;
  }

  const lowerText =
    text.toLocaleLowerCase();

  const lowerQuery =
    normalizedQuery.toLocaleLowerCase();

  const parts: Array<{
    value: string;
    match: boolean;
  }> = [];

  let cursor = 0;

  while (cursor < text.length) {
    const matchIndex =
      lowerText.indexOf(
        lowerQuery,
        cursor,
      );

    if (matchIndex === -1) {
      parts.push({
        value:
          text.slice(cursor),
        match: false,
      });

      break;
    }

    if (matchIndex > cursor) {
      parts.push({
        value:
          text.slice(
            cursor,
            matchIndex,
          ),
        match: false,
      });
    }

    parts.push({
      value:
        text.slice(
          matchIndex,
          matchIndex +
            normalizedQuery.length,
        ),
      match: true,
    });

    cursor =
      matchIndex +
      normalizedQuery.length;
  }

  return (
    <>
      {parts.map(
        (part, index) =>
          part.match ? (
            <mark
              key={`${part.value}-${index}`}
              className="rounded-[3px] bg-[#d7ff00]/15 px-[1px] text-[#d7ff00]"
            >
              {part.value}
            </mark>
          ) : (
            <span
              key={`${part.value}-${index}`}
            >
              {part.value}
            </span>
          ),
      )}
    </>
  );
}

export default function GlobalMuseumSearch({
  open,
  onClose,
}: GlobalMuseumSearchProps) {
  const router = useRouter();

  const [
    activeIndex,
    setActiveIndex,
  ] = useState(0);

  const [
    query,
    setQuery,
  ] = useState("");

  const [
    results,
    setResults,
  ] = useState<MuseumSearchResult[]>(
    [],
  );

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState<string | null>(
    null,
  );

  const inputRef =
    useRef<HTMLInputElement>(
      null,
    );

  const listboxId =
    useId();

  const resultRefs =
    useRef<
      Array<HTMLAnchorElement | null>
    >([]);

  const normalizedQuery =
    query.trim();

  const canSearch =
    normalizedQuery.length >=
    MIN_QUERY_LENGTH;

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    const focusFrame =
      window.requestAnimationFrame(
        () => {
          inputRef.current?.focus();
        },
      );

    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      window.cancelAnimationFrame(
        focusFrame,
      );

      document.body.style.overflow =
        previousOverflow;

      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [
    open,
    onClose,
  ]);

  useEffect(() => {
    if (
      !open ||
      !canSearch
    ) {
      return;
    }

    const controller =
      new AbortController();

    const timer =
      window.setTimeout(
        async () => {
          try {
            setLoading(true);
            setError(null);

            const response =
              await fetch(
                `/api/search?q=${encodeURIComponent(
                  normalizedQuery,
                )}`,
                {
                  signal:
                    controller.signal,
                  cache: "no-store",
                },
              );

            const payload =
              (await response.json()) as
                MuseumSearchResponse;

            if (!response.ok) {
              throw new Error(
                payload.error ||
                  "Museum search failed.",
              );
            }

            setResults(
              payload.results ?? [],
            );
          } catch (searchError) {
            if (
              searchError instanceof
                DOMException &&
              searchError.name ===
                "AbortError"
            ) {
              return;
            }

            setResults([]);
            setError(
              "Search is temporarily unavailable.",
            );
          } finally {
            if (
              !controller.signal.aborted
            ) {
              setLoading(false);
            }
          }
        },
        SEARCH_DELAY,
      );

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [
    canSearch,
    normalizedQuery,
    open,
  ]);

  useEffect(() => {
    if (open) {
      return;
    }

    const frame =
      window.requestAnimationFrame(
        () => {
          setQuery("");
          setResults([]);
          setLoading(false);
          setError(null);
        },
      );

    return () => {
      window.cancelAnimationFrame(
        frame,
      );
    };
  }, [
    open,
  ]);

  const visibleResults =
    canSearch
      ? results
      : [];

  const visibleError =
    canSearch
      ? error
      : null;

  const visibleLoading =
    canSearch &&
    loading;

  useEffect(() => {
    if (!open) {
      return;
    }

    const frame =
      window.requestAnimationFrame(
        () => {
          setActiveIndex(0);
        },
      );

    return () => {
      window.cancelAnimationFrame(
        frame,
      );
    };
  }, [
    open,
    normalizedQuery,
  ]);

  const openResult =
    useCallback(
      (result: MuseumSearchResult) => {
        onClose();
        router.push(result.href);
      },
      [
        onClose,
        router,
      ],
    );

  useEffect(() => {
    if (
      !open ||
      visibleResults.length === 0
    ) {
      return;
    }

    const handleNavigationKeyDown = (
      event: KeyboardEvent,
    ) => {
      if (event.key === "ArrowDown") {
        event.preventDefault();

        setActiveIndex(
          (current) =>
            (current + 1) %
            visibleResults.length,
        );

        return;
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();

        setActiveIndex(
          (current) =>
            (current -
              1 +
              visibleResults.length) %
            visibleResults.length,
        );

        return;
      }

      if (event.key === "Enter") {
        const selectedResult =
          visibleResults[
            activeIndex
          ];

        if (!selectedResult) {
          return;
        }

        event.preventDefault();

        openResult(
          selectedResult,
        );
      }
    };

    window.addEventListener(
      "keydown",
      handleNavigationKeyDown,
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleNavigationKeyDown,
      );
    };
  }, [
    activeIndex,
    open,
    openResult,
    visibleResults,
  ]);

  useEffect(() => {
    const activeElement =
      resultRefs.current[
        activeIndex
      ];

    if (!activeElement) {
      return;
    }

    activeElement.scrollIntoView({
      block: "nearest",
      inline: "nearest",
    });
  }, [
    activeIndex,
  ]);

  const groupedResults =
    useMemo(() => {
      return [
        "PLAYER",
        "ARTIFACT",
        "BRAND",
      ].map((type) => ({
        type:
          type as MuseumSearchResultType,
        items:
          visibleResults.filter(
            (result) =>
              result.type === type,
          ),
      }));
    }, [
      visibleResults,
    ]);

  const resultIndexMap =
    useMemo(() => {
      return new Map(
        visibleResults.map(
          (result, index) => [
            `${result.type}-${result.id}`,
            index,
          ],
        ),
      );
    }, [
      visibleResults,
    ]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[100] bg-[#020610]/96 px-4 py-4 backdrop-blur-2xl sm:px-8 sm:py-8"
      role="dialog"
      aria-modal="true"
      aria-label="Search AGE202 museum"
    >
      <button
        type="button"
        aria-label="Close museum search"
        onClick={onClose}
        className="absolute inset-0 cursor-default"
      />

      <div className="relative mx-auto flex max-h-[calc(100svh-2rem)] w-full max-w-4xl flex-col overflow-hidden rounded-[28px] border border-white/10 bg-[#07101F] shadow-2xl shadow-black/60 sm:max-h-[calc(100svh-4rem)]">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 sm:px-6">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[.28em] text-[#d7ff00]">
              Global Museum Search
            </p>

            <p className="mt-1 text-xs text-white/35">
              Players, artifacts and brands.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-white/70 transition hover:border-[#d7ff00]/50 hover:text-[#d7ff00]"
          >
            <X
              size={18}
              strokeWidth={1.8}
            />
          </button>
        </div>

        <div className="border-b border-white/10 p-4 sm:p-6">
          <label className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[.04] px-4 py-3.5 transition focus-within:border-[#d7ff00]/55 focus-within:bg-white/[.055] sm:px-5 sm:py-4">
            {visibleLoading ? (
              <LoaderCircle
                size={21}
                className="shrink-0 animate-spin text-[#d7ff00]"
                aria-hidden="true"
              />
            ) : (
              <Search
                size={21}
                className="shrink-0 text-[#d7ff00]"
                strokeWidth={1.7}
                aria-hidden="true"
              />
            )}

            <input
              ref={inputRef}
              value={query}
              onChange={(event) =>
                setQuery(
                  event.target.value,
                )
              }
              placeholder="Search Federer, Nike, Indian Wells..."
              autoComplete="off"
              spellCheck={false}
              role="combobox"
              aria-autocomplete="list"
              aria-expanded={
                canSearch &&
                visibleResults.length > 0
              }
              aria-controls={listboxId}
              aria-activedescendant={
                visibleResults[
                  activeIndex
                ]
                  ? `${listboxId}-option-${activeIndex}`
                  : undefined
              }
              className="min-w-0 flex-1 bg-transparent text-base font-medium text-white outline-none placeholder:text-white/25 sm:text-lg"
            />

            <span className="hidden rounded-lg border border-white/10 bg-white/[.04] px-2 py-1 text-[10px] font-bold uppercase tracking-[.1em] text-white/35 sm:inline-flex">
              Esc
            </span>
          </label>

          <div className="mt-3 flex items-center justify-between gap-4 px-1">
            <p className="text-xs text-white/30">
              Type at least{" "}
              {MIN_QUERY_LENGTH} characters.
            </p>

            <p className="hidden text-[10px] font-bold uppercase tracking-[.16em] text-white/25 sm:block">
              AGE202 Museum Engine
            </p>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
          {!canSearch ? (
            <div className="grid min-h-56 place-items-center py-10 text-center">
              <div>
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-[#d7ff00]/15 bg-[#d7ff00]/[.06] text-[#d7ff00]">
                  <Search
                    size={23}
                    strokeWidth={1.6}
                  />
                </div>

                <p className="mt-5 text-lg font-black uppercase tracking-[-.02em] text-white">
                  Search the museum
                </p>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/35">
                  Find players, published
                  museum artifacts and
                  tennis brands from one
                  place.
                </p>
              </div>
            </div>
          ) : visibleError ? (
            <div className="grid min-h-56 place-items-center py-10 text-center">
              <div>
                <p className="text-lg font-black uppercase text-white">
                  Search unavailable
                </p>

                <p className="mt-2 text-sm text-white/35">
                  {visibleError}
                </p>
              </div>
            </div>
          ) : visibleLoading &&
            visibleResults.length === 0 ? (
            <div className="grid min-h-56 place-items-center py-10">
              <div className="flex items-center gap-3 text-sm font-bold uppercase tracking-[.16em] text-white/40">
                <LoaderCircle className="h-5 w-5 animate-spin text-[#d7ff00]" />
                Searching museum
              </div>
            </div>
          ) : visibleResults.length === 0 ? (
            <div className="grid min-h-56 place-items-center py-10 text-center">
              <div>
                <p className="text-lg font-black uppercase tracking-[-.02em] text-white">
                  No museum entry found
                </p>

                <p className="mt-2 text-sm text-white/35">
                  No result for “
                  {normalizedQuery}”.
                </p>
              </div>
            </div>
          ) : (
            <div
              id={listboxId}
              role="listbox"
              aria-label="Museum search results"
              className="space-y-7"
            >
              {groupedResults.map(
                (group) => {
                  if (
                    group.items.length ===
                    0
                  ) {
                    return null;
                  }

                  return (
                    <section
                      key={group.type}
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <p className="text-[10px] font-black uppercase tracking-[.24em] text-[#d7ff00]">
                          {
                            resultTypeLabels[
                              group.type
                            ]
                          }
                          {group.items.length >
                          1
                            ? "s"
                            : ""}
                        </p>

                        <span className="text-[10px] font-bold tabular-nums text-white/25">
                          {
                            group.items
                              .length
                          }
                        </span>
                      </div>

                      <div className="space-y-2">
                        {group.items.map(
                          (result) => (
                            <Link
                              key={`${result.type}-${result.id}`}
                              ref={(element) => {
                                const index =
                                  resultIndexMap.get(
                                    `${result.type}-${result.id}`,
                                  );

                                if (
                                  index !== undefined
                                ) {
                                  resultRefs.current[
                                    index
                                  ] = element;
                                }
                              }}
                              id={`${listboxId}-option-${
                                resultIndexMap.get(
                                  `${result.type}-${result.id}`,
                                ) ?? 0
                              }`}
                              role="option"
                              aria-selected={
                                resultIndexMap.get(
                                  `${result.type}-${result.id}`,
                                ) ===
                                activeIndex
                              }
                              href={
                                result.href
                              }
                              onClick={
                                onClose
                              }
                              onMouseEnter={() => {
                                const index =
                                  resultIndexMap.get(
                                    `${result.type}-${result.id}`,
                                  );

                                if (
                                  index !== undefined
                                ) {
                                  setActiveIndex(
                                    index,
                                  );
                                }
                              }}
                              className={`group flex items-center gap-4 rounded-2xl border p-3 transition sm:p-4 ${
                                resultIndexMap.get(
                                  `${result.type}-${result.id}`,
                                ) ===
                                activeIndex
                                  ? "border-[#d7ff00]/45 bg-white/[.065] shadow-lg shadow-black/20"
                                  : "border-white/[.07] bg-white/[.025] hover:border-[#d7ff00]/35 hover:bg-white/[.055]"
                              }`}
                            >
                              <div className="relative grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-xl border border-white/10 bg-[#0B1526] text-[#d7ff00]">
                                {result.imageUrl ? (
                                  <Image
                                    src={
                                      result.imageUrl
                                    }
                                    alt=""
                                    fill
                                    sizes="56px"
                                    className="object-cover"
                                  />
                                ) : (
                                  <ResultIcon
                                    type={
                                      result.type
                                    }
                                  />
                                )}
                              </div>

                              <div className="min-w-0 flex-1">
                                <p className="truncate text-[10px] font-bold uppercase tracking-[.16em] text-[#d7ff00]/75">
                                  {
                                    resultTypeLabels[
                                      result.type
                                    ]
                                  }
                                </p>

                                <p className="mt-1 truncate text-base font-black tracking-[-.02em] text-white transition group-hover:text-[#d7ff00]">
                                  <HighlightMatch
                                    text={
                                      result.title
                                    }
                                    query={
                                      normalizedQuery
                                    }
                                  />
                                </p>

                                {result.subtitle ? (
                                  <p className="mt-1 truncate text-xs text-white/35">
                                    <HighlightMatch
                                      text={
                                        result.subtitle
                                      }
                                      query={
                                        normalizedQuery
                                      }
                                    />
                                  </p>
                                ) : null}
                              </div>

                              <ArrowUpRight
                                size={18}
                                className="shrink-0 text-white/25 transition group-hover:text-[#d7ff00]"
                                strokeWidth={1.7}
                                aria-hidden="true"
                              />
                            </Link>
                          ),
                        )}
                      </div>
                    </section>
                  );
                },
              )}
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/10 px-4 py-3 text-[9px] font-bold uppercase tracking-[.12em] text-white/25 sm:px-6 sm:text-[10px] sm:tracking-[.14em]">
          <span>
            {visibleResults.length > 0
              ? `${visibleResults.length} results`
              : "AGE202"}
          </span>

          <span>
            ↑ ↓ Navigate · Enter Open · Esc Close
          </span>
        </div>
      </div>
    </div>
  );
}