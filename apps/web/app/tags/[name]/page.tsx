"use client";

import { useEffect, useState } from "react";
import { useParams, notFound } from "next/navigation";
import PromptGallery from "../../components/PromptGallery";
import { getPromptByTag } from "../../lib/getPromptByTag";
import { Tag } from "../../lib/getTrendingTags";
import { Prompt } from "../../lib/getPrompts";

export default function TagPage() {
  const params = useParams();
  const tag = decodeURIComponent(params.name as string);
  const [tagPrompts, setTagPrompts] = useState<Prompt[]|false>(false);

  useEffect(() => {
    const fetchPrompts = async () => {
      const data = await getPromptByTag(tag);
      setTagPrompts(data);
    };

    fetchPrompts();
  }, [tag]);

  if (tagPrompts === null) {
    return (
      <div className="bg-zinc-900 min-h-screen text-zinc-400 flex items-center justify-center">
        <h1 className="text-xl">Loading prompts for #{tag}...</h1>
      </div>
    );
  }

  if (tagPrompts && tagPrompts.length === 0) {
    return (
      <div className="bg-zinc-900 min-h-screen text-zinc-400 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">
            No prompts found for <span className="text-white">#{tag}</span>
          </h1>
          <p>Try another tag or explore the library.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 min-h-screen text-white">
      {/* Header */}
      <div className="bg-zinc-950 w-full py-6 px-4 shadow-sm">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold">
            <span className="text-white px-4 py-2 inline-block">
              #{tag}
            </span>
          </h1>
        </div>
      </div>

      {/* Prompt Grid */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <PromptGallery maxLimit={30} prompts={tagPrompts || []} />
      </div>
    </div>
  );
}
