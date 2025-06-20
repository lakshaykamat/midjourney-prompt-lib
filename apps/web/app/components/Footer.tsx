import Link from "next/link";
import { FaGithub, FaTwitter } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="mt-12 bg-zinc-950 text-zinc-300 py-8 rounded-t-3xl border-t border-zinc-800">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 px-6">
        <div className="flex items-center gap-3">
          {/* Monochrome Logo/icon */}
          <div className="w-8 h-8 bg-zinc-900 border border-zinc-700 rounded-full flex items-center justify-center font-extrabold text-lg shadow-lg">
            <span role="img" aria-label="Sparkle" className="text-white">✨</span>
          </div>
          <span className="font-bold text-lg text-white">Image Prompt Lib</span>
        </div>
        <ul className="flex items-center gap-6 text-sm">
          <li>
            <Link href="https://github.com/lakshaykamat/image-prompt-lib" target="_blank" rel="noopener">
              <span className="inline-flex items-center gap-1 hover:underline hover:text-white transition-colors">
                <FaGithub className="inline" /> GitHub
              </span>
            </Link>
          </li>
          <li>
            <Link href="/terms" className="hover:underline hover:text-white transition-colors">Terms</Link>
          </li>
          <li>
            <Link href="/contact" className="hover:underline hover:text-white transition-colors">Contact</Link>
          </li>
          <li>
            <Link href="https://twitter.com/lakshaykamat" target="_blank" rel="noopener">
              <span className="inline-flex items-center gap-1 hover:underline hover:text-white transition-colors">
                <FaTwitter className="inline" /> Twitter
              </span>
            </Link>
          </li>
        </ul>
        <span className="text-xs text-zinc-500 mt-3 md:mt-0">
          Built with <span className="text-white">❤️</span> by Lakshay Kamat
        </span>
      </div>
    </footer>
  );
}