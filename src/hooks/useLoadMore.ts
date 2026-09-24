import { Pokemon } from "@/types/types";
import { useEffect, useMemo, useRef, useState } from "react";

interface UseLoadMoreResults {
  pokemons: Pokemon[];
  isLoading: boolean;
  hasMore: boolean;
  sentinelRef: React.RefObject<HTMLDivElement | null>;
}

export function useLoadMore(
  allPokemon: () => Promise<Pokemon[]>,
  query: string = "",
  batchSize: number = 20,
): UseLoadMoreResults {
  const [pokedex, setPokedex] = useState<Pokemon[]>([]);
  const [visible, setVisible] = useState(batchSize);
  const [isLoading, setIsLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const hasFetchedInitially = useRef(false);

  useEffect(() => {
    if (hasFetchedInitially.current) return;
    hasFetchedInitially.current = true;

    allPokemon().then((data) => {
      setPokedex(data);
      setIsLoading(false);
    });
  }, [allPokemon]);

  const filtered = useMemo(() => {
    if (!query) return pokedex;
    return pokedex.filter((p) =>
      p.name.toLowerCase().includes(query.toLowerCase()),
    );
  }, [query, pokedex]);

  useEffect(() => {
    setVisible(batchSize);
  }, [query, batchSize]);

  const pokemons = filtered.slice(0, visible);
  const hasMore = visible < filtered.length;

  useEffect(() => {
    if (!hasMore) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setVisible((prev) => prev + batchSize);
      }
    });

    const el = sentinelRef.current;
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, batchSize]);

  return { pokemons, isLoading, hasMore, sentinelRef };
}
