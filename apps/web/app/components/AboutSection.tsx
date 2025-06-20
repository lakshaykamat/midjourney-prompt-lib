import Image from "next/image";

export default function AboutSection() {
  return (
    <section className="w-full max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-8 py-16 px-4">
      <div className="flex-1 relative w-full h-60 md:h-72">
        <Image
          src="/about-illustration.png"
          alt="AI Art Library"
          fill
          className="object-contain rounded-2xl shadow-xl"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
      <div className="flex-1">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 font-display">About Image Prompt Lib</h2>
        <p className="text-lg text-zinc-700 dark:text-zinc-200 mb-6">
          <span className="font-semibold">Image Prompt Lib</span> is a community-driven, design-forward collection of prompts for AI image generation tools like <span className="font-bold text-pink-500">MidJourney</span>, <span className="font-bold text-blue-500">DALL·E</span>, and more.
        </p>
        <p className="text-md text-zinc-600 dark:text-zinc-400">
          Discover styles, techniques, and creative concepts curated by artists and technologists. Get inspired, remix, and share prompts that make your art stand out.
        </p>
      </div>
    </section>
  );
}