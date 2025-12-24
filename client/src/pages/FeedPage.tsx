import { useEffect, useRef } from "react";
import {
  Container,
  Typography,
  Box,
  Skeleton,
} from "@mui/material";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchFeed } from "../api/feed";
import ActivityCard from "../components/ActivityCard";

export default function FeedPage() {
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["feed"],
    queryFn: ({ pageParam }) => fetchFeed(pageParam),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const items = data?.pages.flatMap((p) => p.items) ?? [];

  useEffect(() => {
    if (!hasNextPage || !loadMoreRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage]);

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Claim Activity Feed
      </Typography>

      <Typography color="text.secondary" mb={3}>
        Track your health and dental claim progress
      </Typography>

      {/* Initial load skeleton */}
      {isLoading &&
        Array.from({ length: 4 }).map((_, i) => (
          <Skeleton
            key={i}
            variant="rectangular"
            height={80}
            sx={{ borderRadius: 2, mb: 2 }}
          />
        ))}

      {/* Feed items */}
      {items.map((e) => (
        <ActivityCard
          key={e.id}
          type={e.type}
          message={e.message}
          userId={e.user_id}
          createdAt={e.created_at}
        />
      ))}

      {/* Infinite scroll loading */}
      {isFetchingNextPage &&
        Array.from({ length: 2 }).map((_, i) => (
          <Skeleton
            key={i}
            variant="rectangular"
            height={80}
            sx={{ borderRadius: 2, mb: 2 }}
          />
        ))}

      {/* Sentinel */}
      <Box ref={loadMoreRef} height={1} />
    </Container>
  );
}
