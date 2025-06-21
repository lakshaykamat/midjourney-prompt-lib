import Image from "next/image";
import Link from "next/link";

type Props = { prompt: any };

export default function PromptCard({ prompt }: Props) {
  return (
    <Link href={`/prompt/${prompt._id}`} className="rounded overflow-hidden bg-zinc-950 border-zinc-400 shadow-md transition-transform duration-200">
      <Image
        src={prompt.images.original}
        alt={prompt.title}
        unoptimized
        className="w-full h-auto object-cover"
        width={0} // required by TS/Next but won't apply
        height={0} // same here, won't apply because of classNames
        sizes="100vw"
      />
    </Link>
  );
}
