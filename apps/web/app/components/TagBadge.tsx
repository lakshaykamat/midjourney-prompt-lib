import Link from "next/link";

export type TagBadgeProps = {
  tag: string;
  href?: string;
  onClick?: () => void;
  highlight?: boolean;
  className?: string;
};

export default function TagBadge({ tag, href, onClick, highlight, className }: TagBadgeProps) {
  const base = `inline-block px-3 py-1 text-xs font-semibold rounded-full border border-zinc-700 bg-zinc-900 text-white transition-all 
    ${highlight ? "ring-2 ring-white scale-105" : "hover:scale-105 hover:ring-2 hover:ring-white"}
    cursor-pointer select-none ${className || ""}`;
  const content = <span className={base}>#{tag}</span>;

  if (href) return <Link href={href}>{content}</Link>;
  return <span onClick={onClick}>{content}</span>;
}