"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { lessons } from "@/lib/lessons";

// URL Formspree formuláře, např. "https://formspree.io/f/abcdwxyz"
// Vytvoříte na https://formspree.io po registraci a založení formuláře.
const FORMSPREE_ENDPOINT = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT ?? "";

export default function PricingForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [lessonId, setLessonId] = useState(lessons[0].id);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError("");

    const selectedLesson = lessons.find((l) => l.id === lessonId);

    try {
      if (FORMSPREE_ENDPOINT) {
        // --- Varianta A: odeslání přes Formspree ---
        const response = await fetch(FORMSPREE_ENDPOINT, {
          method: "POST",
          headers: { Accept: "application/json" },
          body: JSON.stringify({
            jmeno: name,
            email,
            lekce: selectedLesson?.title,
            cena: selectedLesson?.price,
          }),
        });

        if (!response.ok) {
          throw new Error("Odeslání se nezdařilo, zkuste to prosím znovu.");
        }
      } else {
        // --- Varianta B: odeslání přes vlastní API route (Resend) ---
        // Pokud nemáte Formspree, použije se /api/objednavka (viz
        // src/app/api/objednavka/route.ts), který odešle e-mail přes Resend.
        const response = await fetch("/api/objednavka", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jmeno: name,
            email,
            lekce: selectedLesson?.title,
            cena: selectedLesson?.price,
          }),
        });

        if (!response.ok) {
          throw new Error("Odeslání se nezdařilo, zkuste to prosím znovu.");
        }
      }

      // Přesměrování na děkovnou stránku s e-mailem v query parametru
      router.push(`/dekujeme?email=${encodeURIComponent(email)}`);
    } catch (err) {
      setStatus("error");
      setError(
        err instanceof Error
          ? err.message
          : "Něco se pokazilo, zkuste to prosím znovu."
      );
    }
  }

  return (
    <section id="cenik" className="bg-sand py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-16 text-center">
          <p className="mb-3 text-sm uppercase tracking-[0.3em] text-accent-dark">
            Ceník
          </p>
          <h2 className="font-serif text-4xl sm:text-5xl">Lekce a balíčky</h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {lessons.map((lesson, i) => (
            <motion.div
              key={lesson.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="rounded-2xl bg-background p-6 shadow-sm ring-1 ring-line"
            >
              <h3 className="font-serif text-2xl">{lesson.title}</h3>
              <p className="mt-2 text-sm text-foreground/70">
                {lesson.description}
              </p>
              <p className="mt-4 font-serif text-3xl text-accent-dark">
                {lesson.price}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          onSubmit={handleSubmit}
          className="mx-auto mt-16 max-w-xl rounded-2xl bg-background p-8 shadow-sm ring-1 ring-line"
        >
          <h3 className="mb-6 font-serif text-2xl text-center">
            Objednávkový formulář
          </h3>

          <div className="flex flex-col gap-4">
            <div>
              <label htmlFor="jmeno" className="mb-1 block text-sm">
                Jméno a příjmení
              </label>
              <input
                id="jmeno"
                name="jmeno"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-line bg-background px-4 py-2 outline-none focus:border-accent-dark"
                placeholder="Jana Nováková"
              />
            </div>

            <div>
              <label htmlFor="email" className="mb-1 block text-sm">
                E-mail
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-line bg-background px-4 py-2 outline-none focus:border-accent-dark"
                placeholder="jana@email.cz"
              />
            </div>

            <div>
              <label htmlFor="lekce" className="mb-1 block text-sm">
                Výběr lekce / balíčku
              </label>
              <select
                id="lekce"
                name="lekce"
                value={lessonId}
                onChange={(e) => setLessonId(e.target.value)}
                className="w-full rounded-lg border border-line bg-background px-4 py-2 outline-none focus:border-accent-dark"
              >
                {lessons.map((lesson) => (
                  <option key={lesson.id} value={lesson.id}>
                    {lesson.title} — {lesson.price}
                  </option>
                ))}
              </select>
            </div>

            {status === "error" && (
              <p className="text-sm text-red-600">{error}</p>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
              className="mt-2 rounded-full bg-accent-dark px-8 py-3 text-sm uppercase tracking-widest text-white transition-colors hover:bg-accent disabled:opacity-60"
            >
              {status === "loading" ? "Odesílám…" : "Objednat"}
            </button>
          </div>
        </motion.form>
      </div>
    </section>
  );
}
