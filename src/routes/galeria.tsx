import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { FallingHearts, MusicPlayer, ParticleField } from "@/components/ambient";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/galeria")({
  head: () => ({
    meta: [
      { title: "Galeria — Para Elizandra ❤️" },
      { name: "description", content: "Memórias eternizadas em uma galeria emocional." },
    ],
  }),
  component: Galeria,
});

type Photo = { src: string; caption?: string; uploaded?: boolean; path?: string };

const STATIC_PHOTOS: Photo[] = [
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

const CUTE_MESSAGES = [
  "Você é meu mundo 💖",
  "Minha eterna inspiração",
  "Amor da minha vida",
  "Meu maior presente",
  "Te amo além do infinito",
  "Meu coração é seu",
  "Luz dos meus dias",
  "Sorriso que cura tudo",
  "Mãe, meu porto seguro",
  "Para sempre comigo ❤️",
  "Você é amor em pessoa",
  "Minha rainha",
  "Saudade que vira sorriso",
  "Meu abraço favorito",
  "Você ilumina tudo ✨",
];

function hashString(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

const BUCKET = "galeria";
const MAX_DIM = 1600;
const JPEG_QUALITY = 0.85;

async function compressImage(file: File): Promise<Blob> {
  const dataUrl: string = await new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = reject;
    r.readAsDataURL(file);
  });
  const img: HTMLImageElement = await new Promise((resolve, reject) => {
    const i = new Image();
    i.onload = () => resolve(i);
    i.onerror = reject;
    i.src = dataUrl;
  });
  let { width, height } = img;
  if (width > MAX_DIM || height > MAX_DIM) {
    const ratio = Math.min(MAX_DIM / width, MAX_DIM / height);
    width = Math.round(width * ratio);
    height = Math.round(height * ratio);
  }
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0, width, height);
  return await new Promise<Blob>((resolve) =>
    canvas.toBlob((b) => resolve(b!), "image/jpeg", JPEG_QUALITY),
  );
}

function Galeria() {
  const [active, setActive] = useState<number | null>(null);
  const [uploads, setUploads] = useState<Photo[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const inputRef = useRef<HTMLInputElement>(null);

  const loadUploads = async () => {
    const { data, error } = await supabase.storage
      .from(BUCKET)
      .list("", { limit: 200, sortBy: { column: "created_at", order: "asc" } });
    if (error || !data) return;
    const items = data
      .filter((f) => f.name && !f.name.startsWith("."))
      .map((f) => {
        const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(f.name);
        const caption = CUTE_MESSAGES[hashString(f.name) % CUTE_MESSAGES.length];
        return { src: pub.publicUrl, uploaded: true, path: f.name, caption } as Photo;
      });
    setUploads(items);
  };

  useEffect(() => {
    loadUploads();
  }, []);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    setProgress({ done: 0, total: files.length });
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      if (!f.type.startsWith("image/")) continue;
      try {
        const blob = await compressImage(f);
        const name = `${Date.now()}-${i}-${Math.random().toString(36).slice(2, 8)}.jpg`;
        const { error } = await supabase.storage
          .from(BUCKET)
          .upload(name, blob, { contentType: "image/jpeg", upsert: false });
        if (error) console.error(error);
      } catch (e) {
        console.error("Erro ao processar imagem", e);
      }
      setProgress({ done: i + 1, total: files.length });
    }
    await loadUploads();
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  };

  const removeUpload = async (path?: string) => {
    if (!path) return;
    if (!confirm("Remover esta foto da galeria pública?")) return;
    const { error } = await supabase.storage.from(BUCKET).remove([path]);
    if (error) {
      alert("Não foi possível remover esta foto.");
      return;
    }
    setUploads((u) => u.filter((x) => x.path !== path));
  };

  const photos: Photo[] = [...STATIC_PHOTOS, ...uploads];

  return (
    <div className="relative min-h-screen w-full overflow-hidden pb-32">
      <ParticleField density={35} />
      <FallingHearts count={10} />
      <MusicPlayer />

      <header className="relative z-10 pt-14 pb-8 px-6 text-center">
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

      {/* Uploader */}
      <section className="relative z-10 px-6 max-w-2xl mx-auto mb-10">
        <div className="glass rounded-2xl p-5 md:p-6 text-center">
          <p className="font-display text-base md:text-lg text-foreground/85 mb-4">
            Adicione fotos à galeria pública
          </p>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            capture="environment"
            onChange={(e) => handleFiles(e.target.files)}
            className="hidden"
            id="photo-uploader"
          />
          <label
            htmlFor="photo-uploader"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full gradient-rose text-white font-display tracking-wide cursor-pointer animate-btn-glow active:scale-95 transition"
          >
            {uploading ? `Enviando ${progress.done}/${progress.total}...` : "📸 Escolher fotos"}
          </label>
          <p className="mt-3 text-xs text-foreground/60 font-display">
            As fotos ficam visíveis para todas as pessoas que abrirem a galeria.
          </p>
          {uploads.length > 0 && (
            <p className="mt-2 text-xs text-foreground/70">
              {uploads.length} foto(s) na galeria pública
            </p>
          )}
        </div>
      </section>

      <section className="relative z-10 px-4 max-w-5xl mx-auto">
        <div className="columns-2 md:columns-3 gap-4 md:gap-6 [column-fill:_balance]">
          {photos.map((p, i) => {
            const rotation = (i % 2 === 0 ? -1 : 1) * (Math.random() * 3 + 1);
            return (
              <motion.div
                key={p.path ?? p.src ?? i}
                initial={{ opacity: 0, y: 40, rotate: 0 }}
                whileInView={{ opacity: 1, y: 0, rotate: rotation }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.9, delay: Math.min(i * 0.05, 0.6), ease: "easeOut" }}
                whileHover={{ scale: 1.03, rotate: 0, y: -4 }}
                className="mb-4 md:mb-6 break-inside-avoid w-full bg-white p-3 pb-12 rounded-sm relative cursor-pointer group"
                style={{ boxShadow: "0 18px 40px -10px oklch(0 0 0 / 0.55), 0 0 0 1px oklch(0 0 0 / 0.05)" }}
                onClick={() => setActive(i)}
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
                {p.uploaded && (
                  <button
                    onClick={(e) => { e.stopPropagation(); removeUpload(p.path); }}
                    className="absolute top-1 right-1 size-7 rounded-full bg-black/70 text-white text-sm flex items-center justify-center opacity-0 group-hover:opacity-100 focus:opacity-100 transition"
                    aria-label="Remover foto"
                  >
                    ×
                  </button>
                )}
              </motion.div>
            );
          })}
        </div>
      </section>

      <AnimatePresence>
        {active !== null && photos[active] && (
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
                src={photos[active].src}
                alt={photos[active].caption ?? ""}
                onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACKS[active % FALLBACKS.length]; }}
                className="w-full h-auto"
              />
              {photos[active].caption && (
                <span className="absolute bottom-3 left-0 right-0 text-center font-hand text-2xl" style={{ color: "oklch(0.3 0.1 18)" }}>
                  {photos[active].caption}
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
