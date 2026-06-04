/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { UserCard } from '../components/UserCard';
import { PostCard } from '../components/PostCard';
import { Loader } from '../components/Loader';
import { Search, Compass, TrendingUp, Users, MessageSquare, X } from 'lucide-react';
import { User, Post } from '../types';

export const Explore: React.FC = () => {
  const { suggestedUsers, trendingTags, triggerSearch } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const queryParam = searchParams.get('q') || '';
  const [searchVal, setSearchVal] = useState(queryParam);
  
  const [searchedUsers, setSearchedUsers] = useState<User[]>([]);
  const [searchedPosts, setSearchedPosts] = useState<Post[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeTab, setActiveTab] = useState<'creators' | 'posts'>('creators');

  useEffect(() => {
    setSearchVal(queryParam);
    if (queryParam.trim()) {
      executeSearch(queryParam.trim());
    } else {
      setSearchedUsers([]);
      setSearchedPosts([]);
    }
  }, [queryParam]);

  const executeSearch = async (term: string) => {
    setIsSearching(true);
    const results = await triggerSearch(term);
    setSearchedUsers(results.users || []);
    setSearchedPosts(results.posts || []);
    setIsSearching(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      setSearchParams({ q: searchVal.trim() });
    } else {
      setSearchParams({});
    }
  };

  const handleClear = () => {
    setSearchVal('');
    setSearchParams({});
  };

  const handleHashtagClick = (tag: string) => {
    setSearchVal(tag);
    setSearchParams({ q: tag });
  };

  return (
    <div className="w-full flex flex-col">
      {/* Page Title */}
      <div className="flex items-center gap-2.5 mb-6 px-1 select-none shrink-0">
        <Compass className="w-5.5 h-5.5 text-blue-600 dark:text-blue-500" strokeWidth={2.5} />
        <h2 className="text-[17px] font-black text-zinc-900 dark:text-zinc-50 tracking-tight font-sans">
          Discover ConnectHub
        </h2>
      </div>

      {/* Embedded Search Form */}
      <form onSubmit={handleSearchSubmit} className="relative flex items-center mb-6 shrink-0 w-full">
        <Search className="absolute left-4 w-4.5 h-4.5 text-zinc-400 dark:text-zinc-500 pointer-events-none" />
        <input
          type="text"
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
          placeholder="Search engineers, designers, hashtags, keywords..."
          className="
            w-full rounded-2xl border border-zinc-200 dark:border-zinc-850 bg-white dark:bg-zinc-900
            text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 pl-11.5 pr-11 py-3 text-sm
            outline-none transition-all focus:border-blue-500 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10
          "
        />
        {searchVal && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-4 p-1 rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-850 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </form>

      {/* SEARCHING RESULTS VIEW */}
      {queryParam.trim() ? (
        <div className="flex flex-col gap-5">
          {isSearching ? (
            <Loader type="post-skeleton" count={1} />
          ) : (
            <>
              {/* Tabs for results */}
              <div className="flex border-b border-zinc-105 dark:border-zinc-850 select-none">
                <button
                  onClick={() => setActiveTab('creators')}
                  className={`
                    px-5 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2
                    ${activeTab === 'creators'
                      ? 'border-blue-600 text-blue-650 dark:border-blue-500 dark:text-blue-400 font-extrabold'
                      : 'border-transparent text-zinc-505 dark:text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
                    }
                  `}
                >
                  <Users className="w-4 h-4" />
                  <span>People ({searchedUsers.length})</span>
                </button>
                <button
                  onClick={() => setActiveTab('posts')}
                  className={`
                    px-5 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2
                    ${activeTab === 'posts'
                      ? 'border-blue-600 text-blue-650 dark:border-blue-500 dark:text-blue-400 font-extrabold'
                      : 'border-transparent text-zinc-505 dark:text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
                    }
                  `}
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Posts ({searchedPosts.length})</span>
                </button>
              </div>

              {/* Creators Results */}
              {activeTab === 'creators' && (
                <div className="flex flex-col gap-3 animate-in fade-in duration-200">
                  {searchedUsers.length === 0 ? (
                    <div className="text-center py-12 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-850 rounded-2xl">
                      <p className="text-sm font-semibold text-zinc-450 dark:text-zinc-550">
                        No matching creators found for "{queryParam}"
                      </p>
                    </div>
                  ) : (
                    searchedUsers.map((u) => <UserCard key={u.id} user={u} showBio={true} />)
                  )}
                </div>
              )}

              {/* Posts Results */}
              {activeTab === 'posts' && (
                <div className="flex flex-col gap-4 animate-in fade-in duration-200">
                  {searchedPosts.length === 0 ? (
                    <div className="text-center py-12 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-850 rounded-2xl">
                      <p className="text-sm font-semibold text-zinc-455 dark:text-zinc-550">
                        No matching conversations found for "{queryParam}"
                      </p>
                    </div>
                  ) : (
                    searchedPosts.map((p) => <PostCard key={p.id} post={p} />)
                  )}
                </div>
              )}
            </>
          )}
        </div>
      ) : (
        /* DISCOVERY HOME VIEW (No search term) */
        <div className="flex flex-col gap-6.5 animate-in fade-in duration-300 select-none">
          
          {/* Trending hashtags list (for explore center) */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-850 p-5 rounded-2xl shadow-xs">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4.5 h-4.5 text-blue-600 dark:text-blue-500" strokeWidth={2.5} />
              <h3 className="text-sm font-extrabold text-zinc-900 dark:text-zinc-100 capitalize">
                Trending on ConnectHub
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {trendingTags.map((t, idx) => (
                <button
                  key={t.id}
                  onClick={() => handleHashtagClick(t.tag)}
                  className="
                    flex items-center justify-between p-3.5 bg-zinc-50 dark:bg-zinc-950/60 hover:bg-blue-50/40
                    dark:hover:bg-blue-500/5 rounded-xl border border-zinc-100 dark:border-zinc-850 transition-all text-left group cursor-pointer
                  "
                >
                  <div className="flex flex-col min-w-0 pr-2">
                    <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:underline">
                      #{t.tag}
                    </span>
                    <span className="text-[10px] text-zinc-400 dark:text-zinc-550 mt-1 font-semibold">
                      {t.postsCount.toLocaleString()} conversations
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-zinc-400 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-850 px-2.5 py-1 rounded-lg">
                    #{idx + 1}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Recommended Creators list */}
          <div className="flex flex-col gap-3.5">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-sm font-extrabold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <Users className="w-4.5 h-4.5 text-blue-600 dark:text-blue-500" strokeWidth={2.5} />
                <span>Suggested Creators</span>
              </h3>
            </div>

            <div className="flex flex-col gap-3">
              {suggestedUsers.length === 0 ? (
                <div className="text-center py-6 bg-white dark:bg-zinc-900 border border-zinc-150 rounded-2xl">
                  <p className="text-xs text-zinc-450">You are following all available creators!</p>
                </div>
              ) : (
                suggestedUsers.map((u) => <UserCard key={u.id} user={u} showBio={true} />)
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Explore;
