'use client';

import { useEffect, useState } from 'react';
import Hero from './components/HeroSection';
import TrendingTagsCarousel from './components/TrendingTags';
import Footer from './components/Footer';
import NewsletterSection from './components/NewsLetterSection';
import PromptGallery from './components/PromptGallery';
import { getPrompts, Prompt } from './lib/getPrompts';
import { getTrendingTags, Tag } from './lib/getTrendingTags';

export default function Home() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [trendingTags, setTrendingTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 30;
  const [displayLimit, setDisplayLimit] = useState(limit); // 👈 this grows

  const fetchPrompts = async (pageToFetch = 1) => {
    setLoading(true);
    try {
      const res = await getPrompts(pageToFetch, limit);
      if (res) {
        if (pageToFetch === 1) {
          setPrompts(res.data);
          setDisplayLimit(limit); // reset displayLimit
        } else {
          setPrompts((prev) => [...prev, ...res.data]);
          setDisplayLimit((prev) => prev + res.data.length); // increase it
        }
        setTotalPages(res.totalPages);
        setPage(pageToFetch);
      }
    } catch (err) {
      console.error('Error loading prompts', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrompts(1);
    getTrendingTags().then((tags) => {
      if (tags) setTrendingTags(tags);
    });
  }, []);

  const handleLoadMore = () => {
    fetchPrompts(page + 1);
  };

  return (
    <div className="bg-zinc-900 dark:bg-zinc-950 min-h-screen flex flex-col">
      <Hero />

      <div className="max-w-6xl mx-auto w-full px-4">
        <TrendingTagsCarousel tags={trendingTags} />

        <section id="prompts" className="py-8">
          <PromptGallery prompts={prompts} loading={loading} maxLimit={displayLimit} />

          {page < totalPages && (
            <div className="text-center mt-6">
              <button
                onClick={handleLoadMore}
                className="px-6 py-2 bg-white text-black rounded-lg hover:bg-zinc-200 transition"
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Load More'}
              </button>
            </div>
          )}
        </section>

        <NewsletterSection />
      </div>

      <Footer />
    </div>
  );
}
