'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { Search, Clock, ArrowUpRight, BookOpen } from 'lucide-react';
import { Post } from '@/lib/schemas';
import { formatDateReadable } from '@/lib/utils';

export function JournalFilterGrid({ posts }: { posts: Post[] }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = useMemo(() => {
    const unique = Array.from(new Set(posts.map((p) => p.category_name)));
    return ['All', ...unique];
  }, [posts]);

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesCat =
        selectedCategory === 'All' || post.category_name === selectedCategory;
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q) ||
        post.category_name.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [posts, selectedCategory, searchQuery]);

  return (
    <div className="space-y-10">
      <div className="rounded-card border border-border bg-raised/80 p-4 sm:p-5 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        <div
          role="tablist"
          aria-label="Filter articles by category"
          className="flex flex-wrap items-center gap-2"
        >
          {categories.map((cat) => {
            const active = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 rounded-xl text-xs font-mono transition-colors ${
                  active
                    ? 'bg-accent text-canvas font-semibold'
                    : 'bg-canvas border border-border text-muted hover:text-fg'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        <div className="relative min-w-[240px] sm:min-w-[300px]">
          <Search
            className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            aria-hidden="true"
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search field notes & articles..."
            aria-label="Search journal articles"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-canvas text-sm text-fg placeholder:text-muted/60 focus:border-accent"
          />
        </div>
      </div>

      {filteredPosts.length === 0 ? (
        <div className="rounded-card border border-border bg-raised/60 p-12 text-center space-y-3">
          <BookOpen className="w-6 h-6 text-accent mx-auto" aria-hidden="true" />
          <h3 className="text-lg font-semibold text-fg">No Matching Journal Entries</h3>
          <p className="text-sm text-muted max-w-md mx-auto">
            Try clearing your search term or selecting a broader category above.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              className="group rounded-card border border-border bg-raised/90 p-7 flex flex-col justify-between space-y-6 hover:border-accent/70 transition-colors"
            >
              <div className="space-y-3.5">
                <div className="flex items-center justify-between gap-2 text-xs font-mono text-muted">
                  <span className="text-accent">{post.category_name}</span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>{post.reading_time_minutes} min read</span>
                  </span>
                </div>

                <h2 className="text-xl font-semibold text-fg group-hover:text-accent transition-colors leading-snug">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h2>

                <p className="text-sm text-muted leading-relaxed">{post.excerpt}</p>
              </div>

              <div className="space-y-4 pt-2">
                {post.tags_list && post.tags_list.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {post.tags_list.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-0.5 rounded-md text-[11px] font-mono bg-canvas border border-border text-muted"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                ) : null}

                <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs font-mono text-muted">
                  <span>{formatDateReadable(post.published_at)}</span>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1 text-sm font-sans font-medium text-fg hover:text-accent"
                  >
                    <span>Read Article</span>
                    <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

