Let's restart from zero, but this time build in **TypeScript** — which actually
forces us to be _more_ explicit about the design decisions we glossed over in
JS (what shape is the data? what does the API return? what can be `null`?).
Typing things properly often _reveals_ architecture problems before you even
run the code. Let's go step by step.

## Step 1 — Before any code: what are the _shapes_ of data flowing through this system?

In JavaScript we could be loose about this. In TypeScript, we can't — we must decide upfront:

1. **What does one item look like?** Let's assume each item has at least an `id` and a `name` (adjust later to your real API).
2. **What does `fetchBatch` return?** An array of those items — but wrapped in a `Promise`, and we should decide: does it throw on error, or return something like `{ data, error }`? We'll keep throwing (simpler, and pairs well with `try/catch`).
3. **What does the hook expose to the component?** This needs its own explicit "return type" — items, loading state, hasMore, and a ref to attach.

Let's define these types first, since everything else depends on them.

```ts
// types.ts
export interface Item {
  id: string | number;
  name: string;
}
```

This single shared type is what lets TypeScript catch mismatches between the three files automatically — if the API changes shape, or the render code expects a field that doesn't exist, you'll get a compile error instead of a silent bug.

## Step 2 — File 1: `api.ts` — the network layer, typed

**Same reasoning as before:** this function's only job is "given an offset, return data." No React, no state. In TypeScript, we additionally get to declare _exactly_ what it promises to return — which becomes a contract the rest of the app can rely on.

```ts
// api.ts
import { Item } from "./types";

const BASE_URL = "https://api.example.com/data";

export async function fetchBatch(
  offset: number,
  limit: number = 20,
): Promise<Item[]> {
  const res = await fetch(`${BASE_URL}?offset=${offset}&limit=${limit}`);

  if (!res.ok) {
    throw new Error(`API request failed with status ${res.status}`);
  }

  const data: unknown = await res.json();

  // Defensive check: fetch's .json() returns `any` by default in TS,
  // which silently defeats type safety. Casting through `unknown` first
  // forces us to acknowledge we don't actually know the shape yet.
  if (!Array.isArray(data)) {
    throw new Error("Unexpected API response shape");
  }

  return data as Item[];
}
```

**Why the `unknown` step matters, specifically:** if we'd written `const data = await res.json()`, TypeScript infers `any` — which means no type-checking happens at all past that point, defeating the purpose of using TypeScript here. Going through `unknown` and validating (even minimally, with `Array.isArray`) means we've drawn a clear line: "past this point, I've verified enough to trust the type." In a production app you'd likely use a schema validator (`zod`, `io-ts`) here — but this shows the _principle_ without adding a dependency.

## Step 3 — File 2: `useLoadMore.ts` — deciding the hook's type signature first

Before writing the implementation, let's write its **type signature** — what goes in, what comes out. This is the TypeScript-specific discipline: design the contract before the body.

```ts
interface UseLoadMoreResult {
  items: Item[];
  isLoading: boolean;
  hasMore: boolean;
  sentinelRef: React.RefObject<HTMLDivElement>;
}

function useLoadMore(
  fetchBatch: (offset: number, limit: number) => Promise<Item[]>,
  limit?: number,
): UseLoadMoreResult {
  // ...
}
```

Notice what this signature _forces_ us to clarify, that we didn't have to in JS:

- `fetchBatch` isn't just "some function" — it's typed as `(offset: number, limit: number) => Promise<Item[]>`. This means **any** function matching that shape can be passed in — real API, mock for tests, a cached wrapper — and TypeScript will verify compatibility at the call site. This is dependency injection made explicit through types.
- `sentinelRef` is a `React.RefObject<HTMLDivElement>` — not just "a ref," but specifically a ref meant for a `div`. If you later try to attach it to a `<button>`, TypeScript will flag the mismatch.
- The return type is a **named interface**, not an inline object — meaning if you later add a field (say, `error: string | null`), you edit it in exactly one place and every consumer gets flagged if they need updating.

Now, the implementation:

```ts
// useLoadMore.ts
import { useState, useEffect, useCallback, useRef } from "react";
import { Item } from "./types";

interface UseLoadMoreResult {
  items: Item[];
  isLoading: boolean;
  hasMore: boolean;
  sentinelRef: React.RefObject<HTMLDivElement>;
}

export function useLoadMore(
  fetchBatch: (offset: number, limit: number) => Promise<Item[]>,
  limit: number = 20,
): UseLoadMoreResult {
  const [items, setItems] = useState<Item[]>([]);
  const [offset, setOffset] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // --- the actual fetch-and-append logic ---
  const loadMore = useCallback(async (): Promise<void> => {
    if (isLoading || !hasMore) return; // guard: no overlapping requests, no wasted calls

    setIsLoading(true);
    try {
      const data = await fetchBatch(offset, limit);
      setItems((prev) => [...prev, ...data]);
      setOffset((prev) => prev + limit);
      setHasMore(data.length === limit);
    } catch (err) {
      console.error("Failed to load batch:", err);
    } finally {
      setIsLoading(false);
    }
  }, [fetchBatch, offset, isLoading, hasMore, limit]);

  // --- initial load, once on mount ---
  useEffect(() => {
    loadMore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- scroll detection via IntersectionObserver ---
  useEffect(() => {
    if (!hasMore) return; // don't even bother observing if there's nothing left to load

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

  return { items, isLoading, hasMore, sentinelRef };
}
```

A few TypeScript-specific things worth pointing out here, since they're easy to trip on:

- **`useRef<HTMLDivElement>(null)`** — you must give `useRef` its type parameter explicitly here. Without it, TypeScript infers `useRef<null>`, and you won't be able to assign a real DOM element to it later. This is a very common first-time TS+React error.
- **`entries: IntersectionObserverEntry[]`** — the browser's own DOM typings already define this type; you don't need to write it yourself, but annotating it explicitly (rather than relying on inference) makes the callback self-documenting.
- **Why `sentinelRef` is `RefObject<HTMLDivElement>` and not `MutableRefObject`:** `useRef(null)` initialized with `null` and later attached via JSX (`ref={sentinelRef}`) gives you a read-only-from-the-outside ref — appropriate here, since the _consumer_ of this hook should attach it to a div, not mutate it manually.

## Step 4 — File 3: `ItemList.tsx` — the render layer

**Reasoning:** this component should know nothing about _how_ data arrives — only that it receives `items`, `isLoading`, `hasMore`, and a ref to place. This is what lets you swap the entire fetching/scrolling mechanism later without touching this file at all.

```tsx
// ItemList.tsx
import React from "react";
import { useLoadMore } from "./useLoadMore";
import { fetchBatch } from "./api";

export function ItemList(): JSX.Element {
  const { items, isLoading, hasMore, sentinelRef } = useLoadMore(fetchBatch);

  return (
    <div>
      <ul>
        {items.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>

      <div ref={sentinelRef} style={{ height: 1 }} />

      {isLoading && <p>Loading more…</p>}
      {!hasMore && <p>You've reached the end.</p>}
    </div>
  );
}
```

Notice how little this file needs to know. It destructures exactly four things from the hook and never touches `offset`, never imports `IntersectionObserver`, never constructs a URL. If tomorrow you replace `IntersectionObserver`-based scrolling with a "Load more" button instead, **this file might not need to change at all** — you'd just add a `<button onClick={loadMore}>` if you exposed `loadMore` too, but the rendering of `items` stays identical.

## Step 5 — Why the type boundary between files matters most here

Let's trace one deliberate safety net through all three files: suppose your backend team renames the `name` field to `label`.

- In **`types.ts`**, you update `Item` from `{ id, name }` to `{ id, label }`.
- **`api.ts`** doesn't change at all — it never referenced `.name` directly, it just returns `Item[]`.
- **`useLoadMore.ts`** doesn't change either — same reason.
- **`ItemList.tsx`** — TypeScript will immediately flag `item.name` as a compile error, pointing you _exactly_ to the one place that needs fixing.

This is the concrete payoff of typing the shared `Item` shape once and threading it through: a renamed or restructured field surfaces as a compiler error at the exact point of use, rather than as a silent `undefined` rendering as blank list items in production.

## Step 6 — Final file tree, for orientation

```
src/
  types.ts        ← shared Item interface
  api.ts          ← fetchBatch(offset, limit): Promise<Item[]>
  useLoadMore.ts  ← state + scroll-trigger behavior
  ItemList.tsx    ← pure rendering
```

---

A natural next question, now that types are in play: want to look at how you'd **generically type `useLoadMore<T>`** so it isn't locked to `Item` specifically — meaning the same hook could paginate _any_ data shape (comments, products, users) just by changing the type parameter at the call site?
