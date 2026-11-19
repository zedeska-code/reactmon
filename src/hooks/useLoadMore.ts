import { getSummaries } from "@/api/actions";
import { Pokemons, PokemonSummary } from "@/types/types";
import { useEffect, useMemo, useRef, useState } from "react";

export function useLoadMore(
  pokemonNames: string[],
  firstBatch: PokemonSummary[],
  batchSize: number = 20,
) {
  const [query, setQueryState] = useState("");
  const [visible, setVisible] = useState(batchSize);
  const [loaded, setLoaded] = useState<Record<string, PokemonSummary>>(() =>
    Object.fromEntries(firstBatch.map((r) => [r.name, r])),
  );

  const pending = useRef(new Set<string>());
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const setQuery = (q: string) => {
    setQueryState(q);
    setVisible(batchSize);
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? pokemonNames.filter((p) => p.includes(q)) : pokemonNames;
  }, [pokemonNames, query]);

  const visiblePokemons = useMemo(
    () => filtered.slice(0, visible),
    [filtered, visible],
  );

  const hasMore = visible < filtered.length;

  useEffect(() => {
    const toFetch = visiblePokemons.filter(
      (p) => !loaded[p] && !pending.current.has(p),
    );
    if (toFetch.length === 0) return;

    toFetch.forEach((p) => pending.current.add(p));
    getSummaries(toFetch)
      .then((summaries) => {
        setLoaded((prev) => {
          const next = { ...prev };
          summaries.forEach((s) => (next[s.name] = s));
          return next;
        });
      })
      .catch(() => {
        toFetch.forEach((p) => pending.current.delete(p)); // allow a retry
      });
  }, [visiblePokemons, loaded]);

  useEffect(() => {
    if (!hasMore) return;
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) setVisible((prev) => prev + batchSize);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, batchSize, visiblePokemons.length]);

  return { query, setQuery, visiblePokemons, loaded, hasMore, sentinelRef };
}
