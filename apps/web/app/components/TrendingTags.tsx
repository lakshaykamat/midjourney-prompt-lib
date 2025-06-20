import TagBadge from "./TagBadge";
import { useRef } from "react";
import { motion } from "framer-motion";
import { Tag} from "../lib/getTrendingTags"

type Props = {
  tags:Tag[]
};

export default function TrendingTagsCarousel({ tags }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div className="w-full py-4 overflow-x-auto scrollbar-hide">
      <motion.div
        ref={ref}
        className="flex gap-2 min-w-max px-2"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.05 } }
        }}
      >
        {tags.slice(0,10).map(tag => (
          <motion.div
            key={tag._id}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <TagBadge
              tag={tag.name}
              href={`/tags/${tag.name}`}
              className="transition-all border border-zinc-700 bg-zinc-900 text-white hover:bg-white hover:text-black hover:underline"
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}