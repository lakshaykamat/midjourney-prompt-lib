// components/PromptGallery.tsx
import Masonry from "react-masonry-css";
import PromptCard from "./PromptCard";
import { Prompt } from "../lib/getPrompts";
import SkeletonCard from "./SkeletonCard";

const breakpointColumnsObj = {
  default: 3,
  1024: 3,
  768: 2,
  500: 1,
};

type Props = {
  prompts: Prompt[];
  loading?: boolean;
  maxLimit?: number;
};

export default function PromptGallery({ prompts, loading = false, maxLimit }: Props) {
  const displayPrompts = maxLimit ? prompts.slice(0, maxLimit) : prompts;

  return (
    <Masonry
      breakpointCols={breakpointColumnsObj}
      className="flex w-auto gap-4"
      columnClassName="masonry-column flex flex-col gap-4"
    >
      {loading
        ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
        : displayPrompts.map((prompt) =>
            prompt?.images?.original ? (
              <PromptCard key={prompt._id || prompt.slug} prompt={prompt} />
            ) : null
          )}
    </Masonry>
  );
}
