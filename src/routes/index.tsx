import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FallingHearts, MusicPlayer, ParticleField } from "@/components/ambient";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Para Elizandra ❤️ — Feliz Dia das Mães" },
      { name: "description", content: "Uma carta cinematográfica e emocional para a mulher mais importante da minha vida." },
      { property: "og:title", content: "Para a mulher mais importante da minha vida ❤️" },
      { property: "og:description", content: "Uma surpresa de Dia das Mães para Elizandra." },
    ],
  }),
  component: Index,
});

const LETTER = `Mãe, eu não sou bom com palavras nem em expressar meus sentimentos, mas hoje vim aqui mostrar todo o meu carinho e o amor que tenho pela senhora. Mãe, quero que saiba que a senhora é a pessoa deste mundo que eu mais amo, e a quem eu tenho mais vontade de retribuir tudo o que já fez. Meus sonhos e meus pensamentos são todos imaginando como vou ajudá-la futuramente. Se hoje sou o homem que sou, é por causa da senhora; tudo o que me disse e me ensinou irei levar até o meu último suspiro aqui na Terra.

Mãe, sei que ultimamente não costumo dar cheiro, beijar a senhora ou dizer que a amo. Ao longo desse tempo, tive que lidar muito com a minha mente, e mal sabia que o meu refúgio para o fim dessa guerra foi aquele abraço apertado que a senhora me deu quando eu desabafei.

Mãe, eu quero que saiba que, independentemente do que acontecer, o meu amor e a minha admiração pela senhora serão infinitos.

Quero também agradecer por nunca ter deixado nos faltar comida, roupa e amor. Sei que o Dia das Mães é todos os dias, mas vi a necessidade de falar e escrever o que eu sinto.

Eu te amo muito, minha mãe, meu porto seguro, minha rainha.❤️`;

function HeartIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <defs>
        <linearGradient id="heart-grad" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.82 0.22 10)" />
          <stop offset="100%" stopColor="oklch(0.55 0.24 18)" />
        </linearGradient>
      </defs>
      <path
        d="M12 21s-7-4.5-9.5-9C.5 8 3 4 7 4c2 0 3.5 1 5 3 1.5-2 3-3 5-3 4 0 6.5 4 4.5 8-2.5 4.5-9.5 9-9.5 9z"
        fill="url(#heart-grad)"
      />
    </svg>
  );
}

function playClick() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.frequency.value = 660;
    o.type = "sine";
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.5);
    o.connect(g).connect(ctx.destination);
    o.start();
    o.stop(ctx.currentTime + 0.5);
  } catch {/* ignore */}
}

type Stage = "intro1" | "intro2" | "welcome" | "letter" | "ending";

function Index() {
  const [stage, setStage] = useState<Stage>("intro1");
  const [typed, setTyped] = useState("");
  const [showEnding, setShowEnding] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setStage("intro2"), 4200);
    const t2 = setTimeout(() => setStage("welcome"), 8200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  useEffect(() => {
    if (stage !== "letter") return;
    let i = 0;
    setTyped("");
    const id = setInterval(() => {
      i++;
      setTyped(LETTER.slice(0, i));
      if (i >= LETTER.length) {
        clearInterval(id);
        setTimeout(() => setShowEnding(true), 1500);
      }
    }, 12);
    return () => clearInterval(id);
  }, [stage]);

  const openSurprise = () => {
    playClick();
    setStage("letter");
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <ParticleField density={50} />
      <FallingHearts count={14} />
      <MusicPlayer />

      <AnimatePresence mode="wait">
        {stage === "intro1" && (
          <motion.section
            key="intro1"
            className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 text-center"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.2 }}
          >
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.4, ease: "easeOut" }}
              className="mb-10"
            >
              <HeartIcon className="w-24 h-24 animate-heart-pulse" />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20, letterSpacing: "0.4em" }}
              animate={{ opacity: 1, y: 0, letterSpacing: "0.05em" }}
              transition={{ delay: 1.2, duration: 2.2, ease: "easeOut" }}
              className="font-display text-3xl md:text-5xl font-light text-foreground/95 max-w-2xl text-glow leading-snug italic"
            >
              Para a mulher mais importante da minha vida ❤️
            </motion.h1>
          </motion.section>
        )}

        {stage === "intro2" && (
          <motion.section
            key="intro2"
            className="relative z-10 min-h-screen flex items-center justify-center px-6 text-center"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.5 }}
          >
            <motion.h1
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 2, ease: "easeOut" }}
              className="font-hand text-5xl md:text-7xl text-glow text-rose-glow"
              style={{ color: "oklch(0.85 0.18 12)" }}
            >
              Bem-vinda, Elizandra ❤️
            </motion.h1>
          </motion.section>
        )}

        {stage === "welcome" && (
          <motion.section
            key="welcome"
            className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 text-center gap-12"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.05 }} transition={{ duration: 1.2 }}
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1.4 }}
              className="space-y-6"
            >
              <HeartIcon className="w-20 h-20 mx-auto animate-heart-pulse" />
              <h2 className="font-hand text-4xl md:text-6xl" style={{ color: "oklch(0.88 0.16 12)" }}>
                Elizandra ❤️
              </h2>
              <p className="font-display italic text-lg md:text-2xl text-foreground/80 max-w-md mx-auto">
                Tem algo preparado especialmente para você...
              </p>
            </motion.div>

            <motion.button
              onClick={openSurprise}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 1 }}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.96 }}
              className="animate-btn-glow gradient-rose text-white font-display text-xl md:text-2xl tracking-wide px-12 py-5 rounded-full relative overflow-hidden group"
            >
              <span className="relative z-10 flex items-center gap-3">
                Ver surpresa
                <HeartIcon className="w-6 h-6" />
              </span>
              <span className="absolute inset-0 bg-white/20 translate-x-[-120%] group-hover:translate-x-[120%] transition-transform duration-700" />
            </motion.button>
          </motion.section>
        )}

        {stage === "letter" && (
          <motion.section
            key="letter"
            className="relative z-10 min-h-screen flex flex-col items-center justify-start px-5 py-14 gap-10"
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.4, ease: "easeOut" }}
          >
            <motion.div
              initial={{ y: 40, opacity: 0, rotateX: -10 }}
              animate={{ y: 0, opacity: 1, rotateX: 0 }}
              transition={{ duration: 1.6, ease: "easeOut" }}
              className="glass-paper rounded-3xl px-7 py-10 md:px-14 md:py-14 max-w-2xl w-full relative"
              style={{ boxShadow: "0 30px 80px -20px oklch(0 0 0 / 0.7), 0 0 60px oklch(0.6 0.2 12 / 0.25)" }}
            >
              <div className="absolute -top-5 left-1/2 -translate-x-1/2">
                <HeartIcon className="w-10 h-10 animate-heart-pulse" />
              </div>
              <h2 className="font-hand text-3xl md:text-4xl text-center mb-6" style={{ color: "oklch(0.35 0.18 18)" }}>
                Para minha mãe
              </h2>
              <p className="font-hand text-xl md:text-2xl leading-relaxed whitespace-pre-line" style={{ color: "oklch(0.25 0.08 20)" }}>
                {typed}
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity }}
                  className="inline-block w-0.5 h-6 bg-[oklch(0.4_0.18_18)] align-middle ml-0.5"
                />
              </p>
            </motion.div>

            {showEnding && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2 }}
                className="flex flex-col items-center gap-8 pb-10"
              >
                <Link
                  to="/galeria"
                  onClick={playClick}
                  className="animate-btn-glow gradient-rose text-white font-display text-lg md:text-xl tracking-wide px-10 py-4 rounded-full hover:scale-105 transition-transform inline-flex items-center gap-3"
                >
                  Galeria de Fotos
                  <HeartIcon className="w-5 h-5" />
                </Link>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5, duration: 2 }}
                  className="text-center space-y-4"
                >
                  <HeartIcon className="w-14 h-14 mx-auto animate-heart-pulse" />
                  <p className="font-hand text-3xl md:text-5xl text-glow" style={{ color: "oklch(0.85 0.18 12)" }}>
                    Obrigado por tudo, mãe ❤️
                  </p>
                </motion.div>
              </motion.div>
            )}
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}
