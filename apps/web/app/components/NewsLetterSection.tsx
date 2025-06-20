import { useState } from "react";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Replace with real sending logic
    setSent(true);
  }

  return (
    <section className="w-full bg-zinc-950 text-white py-12 flex flex-col items-center rounded-2xl my-12 px-4 border border-zinc-800 shadow-lg">
      <h3 className="text-2xl font-bold mb-3 text-white text-center">Get New Prompts Weekly</h3>
      <p className="text-zinc-400 mb-6 text-center">
        Join our newsletter to receive the latest AI image prompts and creative tips.
      </p>
      <form
        className="flex flex-col md:flex-row gap-2 w-full max-w-md"
        onSubmit={handleSubmit}
      >
        <input
          type="email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
          disabled={sent}
          placeholder="Your email address"
          className="flex-1 px-4 py-3 rounded-l-lg border border-zinc-700 bg-zinc-900 text-white outline-none focus:ring-2 focus:ring-white transition placeholder:text-zinc-500"
        />
        <button
          type="submit"
          disabled={sent}
          className="px-6 py-3 rounded-r-lg bg-white text-black font-semibold border border-zinc-700 border-l-0 hover:bg-zinc-200 transition disabled:opacity-60"
        >
          {sent ? "Subscribed!" : "Subscribe"}
        </button>
      </form>
      <a
        href="https://forms.gle/your-feedback-link"
        target="_blank"
        rel="noopener"
        className="mt-4 text-zinc-300 hover:underline font-medium transition"
      >
        Suggest a Prompt
      </a>
    </section>
  );
} 