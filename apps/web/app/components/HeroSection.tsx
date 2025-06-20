'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FiSearch } from 'react-icons/fi';

export default function Hero() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <section className="relative px-4 flex flex-col items-center justify-center min-h-[70vh] w-full bg-gradient-to-br from-zinc-900 to-black text-white rounded-b-3xl overflow-hidden">
      {/* Abstract background shape */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <svg className="absolute left-1/4 top-1/4 w-96 h-96 opacity-20 blur-2xl" viewBox="0 0 400 400">
          <ellipse cx="200" cy="200" rx="180" ry="140" fill="#fff" fillOpacity={0.05} />
        </svg>
      </div>

      <motion.div
        className="relative w-full z-10 flex flex-col items-center text-center gap-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight drop-shadow-lg font-display">
          Discover AI Image Prompts that Inspire
        </h1>
        <p className="text-lg md:text-2xl mt-2 max-w-2xl font-medium text-zinc-300">
          Explore a hand-curated library of MidJourney prompts and artistic styles.
        </p>

        {/* Search Form */}
        <form
          onSubmit={handleSearch}
          className="flex w-full max-w-5xl gap-2 mt-4"
        >
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
              <FiSearch size={22} />
            </span>
            <input
              type="text"
              placeholder="Find your prompt"
              className="w-full pl-10 pr-4 py-3 rounded-l-lg bg-zinc-900 border border-zinc-700 text-white text-lg outline-none focus:ring-2 focus:ring-white transition placeholder:text-zinc-400"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 rounded-r-lg bg-white text-black font-semibold text-lg border border-zinc-700 border-l-0 hover:bg-zinc-200 transition"
          >
            Search
          </button>
        </form>
      </motion.div>
    </section>
  );
}
