'use client';

import { useEffect, useRef, useState } from 'react';
import { getSearchPrompt } from '../lib/getSearchPrompt';
import SearchBar from '../components/SearchBar';
import PromptGallery from '../components/PromptGallery';
import { Prompt } from '../lib/getPrompts';

export default function SearchPage() {
  const [search, setSearch] = useState('');
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Get query param from URL manually (after mount)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const query = params.get('q') || '';
    setSearch(query);
    fetchPrompts(query);
  }, []);

  const fetchPrompts = async (query: string) => {
    try {
      setLoading(true);
      const result = await getSearchPrompt(query);
      if (result) {
        setPrompts(result);
        setError(null);
      } else {
        setPrompts([]);
        setError('Failed to load prompts.');
      }
    } catch (err) {
      console.error(err);
      setPrompts([]);
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  // Debounced refetch on input change
  useEffect(() => {
    if (!search) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchPrompts(search);
    }, 500);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [search]);

  return (
    <div className="min-h-screen bg-zinc-950 py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-white">Search Prompts</h1>

        {error ? (
          <div className="text-red-500 text-center">{error}</div>
        ) : (
          <>
            <SearchBar
              value={search}
              onChange={setSearch}
              resultCount={prompts.length}
            />

            {loading ? (
              <div className="text-zinc-400 text-lg py-16 text-center">
                Loading prompts...
              </div>
            ) : prompts.length === 0 ? (
              <div className="text-zinc-400 text-lg py-16 text-center">
                No prompts found.
              </div>
            ) : (
              <PromptGallery prompts={prompts} loading={loading} maxLimit={50} />
            )}
          </>
        )}
      </div>
    </div>
  );
}
