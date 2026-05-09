import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { FallingHearts, MusicPlayer, ParticleField } from "@/components/ambient";

export const Route = createFileRoute("/galeria")({
  head: () => ({
    meta: [
      { title: "Galeria — Para Elisandra ❤️" },
      { name: "description", content: "Memórias eternizadas em uma galeria emocional." },
    ],
  }),
  component: Galeria,
});

// Add your photos to /public/imagens and reference them here.
// Filenames are relative to /public.
const PHOTOS: { src: string; caption?: string }[] = [
  { src: "/imagens/foto1.jpg", caption: "Meu lugar seguro" },
  { src: "/imagens/foto2.jpg", caption: "Seu sorriso" },
  { src: "/imagens/foto3.jpg", caption: "Meu maior amor" },
  { src: "/imagens/foto4.jpg", caption: "Sempre comigo" },
  { src: "/imagens/foto5.jpg", caption: "Minha rainha" },
  { src: "/imagens/foto6.jpg", caption: "Para sempre" },
];

const FALLBACKS = [
  "https://images.unsplash.com/photo-1581952976147-5a2d15560349?w=800",
  "https://images.unsplash.com/photo-1609220136736-443140cffec6?w=800",
  "https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?w=800",
  "https://images.unsplash.com/photo-1604881991720-f91add269bed?w=800",
  "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800",
  "https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?w=800",
];

function Galeria() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <div className="relative min-h-screen w-full overflow-hidden pb-32">
      <ParticleField density={35} />
      <FallingHearts count={10} />
      <MusicPlayer />

      <header className="relative z-10 pt-14 pb-10 px-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2 }}
          className="font-hand text-5xl md:text-7xl text-glow"
          style={{ color: "oklch(0.88 0.18 12)" }}
        >
          Nossas Memórias
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 1.4 }}
          className="font-display italic mt-4 text-lg text-foreground/70"
        >
          Cada momento ao seu lado é eterno ❤️
        </motion.p>
        <Link
          to="/"
          className="inline-block mt-6 text-sm font-display tracking-wide text-foreground/70 hover:text-foreground transition story-link"
        >
          ← Voltar à carta
        </Link>
      </header>

      <section className="relative z-10 px-4 max-w-5xl mx-auto">
        <div className="columns-2 md:columns-3 gap-4 md:gap-6 [column-fill:_balance]">
          {PHOTOS.map((p, i) => {
            const rotation = (i % 2 === 0 ? -1 : 1) * (Math.random() * 3 + 1);
            return (
              <motion.button
                key={i}
                onClick={() => setActive(i)}
                initial={{ opacity: 0, y: 40, rotate: 0 }}
                whileInView={{ opacity: 1, y: 0, rotate: rotation }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.9, delay: i * 0.08, ease: "easeOut" }}
                whileHover={{ scale: 1.03, rotate: 0, y: -4 }}
                className="mb-4 md:mb-6 break-inside-avoid w-full block bg-white p-3 pb-12 rounded-sm relative cursor-pointer"
                style={{ boxShadow: "0 18px 40px -10px oklch(0 0 0 / 0.55), 0 0 0 1px oklch(0 0 0 / 0.05)" }}
              >
                <img
                  src={p.src}
                  alt={p.caption ?? `Foto ${i + 1}`}
                  loading="lazy"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACKS[i % FALLBACKS.length]; }}
                  className="w-full h-auto object-cover"
                />
                {p.caption && (
                  <span className="absolute bottom-3 left-0 right-0 text-center font-hand text-lg" style={{ color: "oklch(0.3 0.1 18)" }}>
                    {p.caption}
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>
      </section>

      <AnimatePresence>
        {active !== null && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-6"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="bg-white p-4 pb-14 max-w-lg w-full relative"
              style={{ boxShadow: "0 40px 80px oklch(0 0 0 / 0.8)" }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={PHOTOS[active].src}
                alt={PHOTOS[active].caption ?? ""}
                onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACKS[active % FALLBACKS.length]; }}
                className="w-full h-auto"
              />
              {PHOTOS[active].caption && (
                <span className="absolute bottom-3 left-0 right-0 text-center font-hand text-2xl" style={{ color: "oklch(0.3 0.1 18)" }}>
                  {PHOTOS[active].caption}
                </span>
              )}
              <button
                onClick={() => setActive(null)}
                className="absolute -top-4 -right-4 size-10 rounded-full gradient-rose text-white text-xl flex items-center justify-center shadow-lg hover:scale-110 transition"
                aria-label="Fechar"
              >
                ×
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 2 }}
        className="relative z-10 mt-24 text-center px-6"
      >
        <p className="font-hand text-3xl md:text-5xl text-glow" style={{ color: "oklch(0.85 0.18 12)" }}>
          Te amo infinitamente, mãe ❤️
        </p>
      </motion.footer>
    </div>
  );
}
