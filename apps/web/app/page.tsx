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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const promptRes = await getPrompts();
        const tagRes = await getTrendingTags();

        setPrompts(promptRes || []);
        setTrendingTags(tagRes || []);
      } catch (err) {
        console.error('Error loading data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-zinc-900 dark:bg-zinc-950 min-h-screen flex flex-col">
      <Hero />

      <div className="max-w-6xl mx-auto w-full px-4">
        <TrendingTagsCarousel tags={trendingTags} />

        <section id="prompts" className="py-8">
          <PromptGallery prompts={prompts} loading={loading} maxLimit={20} />
        </section>

        <NewsletterSection />
      </div>

      <Footer />
    </div>
  );
}
