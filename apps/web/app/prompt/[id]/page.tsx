"use client";

import { useParams, notFound } from "next/navigation";
import { useEffect, useState } from "react";
import TagBadge from "../../components/TagBadge";
import PromptCard from "../../components/PromptCard";
import PromptGallery from "../../components/PromptGallery";
import { getPrompt } from "../../lib/getPrompt";
import { getPrompts, Prompt } from "../../lib/getPrompts";
import CopyPromptButton from "../../components/CopyButton";

export default function PromptPage() {
  const params = useParams();
  const slug = decodeURIComponent(params.id as string);

  const [prompt, setPrompt] = useState<Prompt | null>(null);
  const [morePrompts, setMorePrompts] = useState<Prompt[] | null>(null);


  useEffect(() => {
    const fetchData = async () => {
      const fetchedPrompt = await getPrompt(slug);
      const fetchedMore = await getPrompts();
      setPrompt(fetchedPrompt === false ? null : fetchedPrompt);
      setMorePrompts(fetchedMore === false ? null : fetchedMore);
    };
    fetchData();
  }, [slug]);

  if (!prompt || !morePrompts) {
    return (
      <div className="bg-zinc-900 text-white min-h-screen flex items-center justify-center">
        <h1 className="text-xl">Loading prompt...</h1>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 text-white min-h-screen">
      {/* Header */}
      <div className="bg-zinc-950 py-6 shadow-md">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Prompt Library</h1>
          <input
            type="text"
            placeholder="Search prompts..."
            className="px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white w-64 placeholder:text-zinc-400"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto w-full px-4 py-12 grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left: Prompt Card */}
        <div>
          <PromptCard prompt={prompt} />
        </div>

        {/* Right: Prompt Details */}
        <div>
          <h1 className="text-4xl font-bold mb-4">{prompt.title}</h1>

          {/* Prompt Text */}
          <div className="bg-zinc-800 text-zinc-200 rounded-xl p-6 border border-zinc-700 mb-6">
            <h2 className="font-semibold mb-2 text-lg">Prompt</h2>
            <pre className="whitespace-pre-wrap break-words text-base font-mono">
              {prompt.prompt}
            </pre>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {prompt.tags.map((tag: any) => (
              <TagBadge
                key={tag._id || tag}
                tag={tag.name || tag}
                href={`/tags/${encodeURIComponent(tag.name || tag)}`}
              />
            ))}
          </div>


          <CopyPromptButton promptText={prompt.prompt}/>
        </div>
      </div>

      {/* More Prompts Section */}
      <div className="max-w-7xl mx-auto w-full px-4 py-12">
        <h2 className="text-2xl font-bold mb-6 text-white">More Prompts</h2>
        <PromptGallery maxLimit={10} prompts={morePrompts} />
      </div>
    </div>
  );
}



