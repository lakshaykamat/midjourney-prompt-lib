import { FiSearch } from "react-icons/fi";

type Props = {
  value: string;
  onChange: (value: string) => void;
  resultCount: number;
};

export default function SearchBar({ value, onChange, resultCount }: Props) {
  return (
    <div className="sticky top-0 z-20 bg-zinc-950 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-md mb-4 border border-zinc-800">
      <div className="relative flex-1 w-full">
        <FiSearch className="absolute left-3 top-3 text-zinc-500" size={20} />
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          className="pl-10 pr-4 py-2 w-full rounded-lg border border-zinc-700 bg-zinc-900 text-white outline-none focus:ring-2 focus:ring-white transition"
          placeholder="Search prompts, keywords..."
        />
      </div>
      <div className="text-sm text-zinc-300 whitespace-nowrap">
        {resultCount} result{resultCount !== 1 ? "s" : ""}
      </div>
    </div>
  );
}
