import { useEffect, useState, useCallback } from "react";
import { api } from "../api/http";
import { Wish } from "../types";
import WishCard from "../components/WishCard";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import { io, Socket } from "socket.io-client";

const PAGE_SIZE = 10;

export default function Home() {
  const [allWishes, setAllWishes] = useState<Wish[]>([]);
  const [displayCount, setDisplayCount] = useState(PAGE_SIZE);

  // fetch once
  useEffect(() => {
    api.get<Wish[]>("/wishes").then((res) => setAllWishes(res.data));
  }, []);

  // realtime socket
  useEffect(() => {
    const socket: Socket = io("http://localhost:4000");
    socket.on("wish:new", (wish: Wish) => {
      setAllWishes((prev) => [wish, ...prev]);
    });
    socket.on("wish:like", (data: { wishId: string; likes: number }) => {
      setAllWishes((prev) =>
        prev.map((w) =>
          w.id === data.wishId ? { ...w, likes: data.likes } : w
        )
      );
    });
    socket.on("comment:new", (comment) => {
      // ignore for now
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  const loadMore = useCallback(() => {
    setDisplayCount((prev) => Math.min(prev + PAGE_SIZE, allWishes.length));
  }, [allWishes.length]);

  const sentinelRef = useInfiniteScroll(loadMore);

  const wishes = allWishes.slice(0, displayCount);

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 lg:py-14">
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-3xl font-semibold">Wish Feed</h1>
      </div>

      <div className="lg:flex lg:gap-10">
        <main className="flex-1">
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {wishes.map((w) => (
              <WishCard key={w.id} wish={w} />
            ))}
          </div>
          {wishes.length === 0 && (
            <p className="mt-6 text-neutral-400">
              No wishes yet. Be the first!
            </p>
          )}
          <div ref={sentinelRef} className="h-10" />
        </main>
      </div>
    </div>
  );
}
