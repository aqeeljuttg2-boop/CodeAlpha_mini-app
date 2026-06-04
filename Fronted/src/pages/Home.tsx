/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { PostCard } from '../components/PostCard';
import { CreatePost } from '../components/CreatePost';
import { Loader } from '../components/Loader';
import { Radio } from 'lucide-react';

export const Home: React.FC = () => {
  const { posts, isLoadingPosts, fetchPosts } = useApp();
  
  // Infinite Scroll States
  const [visiblePosts, setVisiblePosts] = useState<typeof posts>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isInfiniteLoading, setIsInfiniteLoading] = useState(false);
  
  const bottomRef = useRef<HTMLDivElement>(null);

  // Sync initial posts
  useEffect(() => {
    setVisiblePosts(posts.slice(0, 3));
    setPage(1);
    setHasMore(posts.length > 3);
  }, [posts]);

  // Infinite Scroll Trigger
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isInfiniteLoading && !isLoadingPosts) {
          loadMorePosts();
        }
      },
      { threshold: 0.8 }
    );

    if (bottomRef.current) {
      observer.observe(bottomRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [visiblePosts, hasMore, isInfiniteLoading, isLoadingPosts]);

  const loadMorePosts = () => {
    setIsInfiniteLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      const nextBatchIndex = page * 3;
      const nextBatch = posts.slice(nextBatchIndex, nextBatchIndex + 3);
      
      if (nextBatch.length > 0) {
        setVisiblePosts((prev) => [...prev, ...nextBatch]);
        setPage((prev) => prev + 1);
        setHasMore(posts.length > nextBatchIndex + 3);
      } else {
        setHasMore(false);
      }
      setIsInfiniteLoading(false);
    }, 800);
  };

  const handleRefreshFeed = async () => {
    await fetchPosts();
  };

  return (
    <div className="w-full flex flex-col">
      {/* Feed Stage Title Indicator */}
      <div className="flex items-center justify-between mb-4.5 px-1 select-none shrink-0">
        <h2 className="text-[17px] font-black text-zinc-900 dark:text-zinc-50 tracking-tight font-sans">
          Your Feed
        </h2>
        <div className="flex items-center gap-1.5 text-[10.5px] font-bold text-zinc-400 uppercase tracking-widest">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Sync Realtime</span>
        </div>
      </div>

      {/* Publisher trigger */}
      <CreatePost placeholder="Share your latest engineering breakthrough or creative spark..." />

      {/* Core Lists */}
      {isLoadingPosts ? (
        <Loader type="post-skeleton" count={2} />
      ) : posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-850 rounded-2xl text-center gap-3">
          <span className="text-4xl">📭</span>
          <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
            Feed workspace empty
          </h4>
          <p className="text-xs text-zinc-450 dark:text-zinc-500 max-w-xs mt-0.5 leading-relaxed">
            There are no posts visible. Publish a new post above, or search for other creators in the explore segment!
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4.5">
          {visiblePosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}

          {/* Infinite Scroll loading indicators */}
          {isInfiniteLoading && (
            <div className="mt-2.5">
              <Loader type="post-skeleton" count={1} />
            </div>
          )}

          {/* Observer Target node */}
          <div ref={bottomRef} className="h-6" />

          {/* End of Feed notice */}
          {!hasMore && posts.length > 0 && (
            <div className="py-8 text-center select-none">
              <p className="text-[11px] font-bold text-zinc-450 dark:text-zinc-600 uppercase tracking-widest flex items-center justify-center gap-2">
                <Radio className="w-3.5 h-3.5" />
                <span>You have caught up with all updates!</span>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default Home;
