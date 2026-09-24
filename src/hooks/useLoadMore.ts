import { Pokemon } from "@/types/types";
import { useCallback, useEffect, useRef, useState } from "react";

interface UseLoadMoreResults {
  pokemons: Pokemon[];
  isLoading: boolean;
  hasMore: boolean;
  sentinelRef: React.RefObject<HTMLDivElement | null>;
}

export function useLoadMore(
  allPokemon: (offset: number) => Promise<Pokemon[]>,
): UseLoadMoreResults {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [offset, setOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const loadMore = useCallback(async (): Promise<void> => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const data = await allPokemon(offset);
      setPokemons((prev) => {
        const existingName = new Set(prev.map((p) => p.name));
        const newItems = data.filter((p) => !existingName.has(p.name));
        return [...prev, ...newItems];
      });
      setOffset((prev) => prev + 20);
      setHasMore(data.length === 20);
    } catch (err) {
      console.error("Failed to load batch", err);
    } finally {
      setIsLoading(false);
    }
  }, [allPokemon, offset, isLoading, hasMore]);

  const hasFetchedInitially = useRef(false);
  useEffect(() => {
    if (hasFetchedInitially.current) return;
    hasFetchedInitially.current = true;
    loadMore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (!hasMore) return;
    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
    );
    const el = sentinelRef.current;
    if (el) observer.observe(el);

    return () => observer.disconnect();
  }, [loadMore, hasMore]);
  return { pokemons, isLoading, hasMore, sentinelRef };
}
