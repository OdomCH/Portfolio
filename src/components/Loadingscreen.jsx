import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";

// ---------------------------------------------------------
// LoadingScreen
//
// Sits on top of the entire app (fixed, z-[999]) until the
// page is ready, then fades out and unmounts so it's
// completely removed from the DOM — no lingering overhead.
//
// How the timing works:
// 1. A fake progress value counts from 0 → 100 over ~2s
//    using a spring so it eases naturally rather than ticking
//    mechanically.
// 2. When progress hits 100, we wait a short beat (400ms)
//    then flip `isVisible` to false.
// 3. AnimatePresence catches that and plays the exit animation
//    (full-screen fade out) before removing the element.
// ---------------------------------------------------------
export default function LoadingScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [displayPercent, setDisplayPercent] = useState(0);

  // Raw motion value for progress (0–100). We drive it
  // to 100 after a tiny delay so the spring has something
  // to animate toward.
  const progress = useMotionValue(0);

  // Spring turns the raw jumps into a smooth, physics-based
  // curve. stiffness and damping are tuned so it accelerates
  // quickly but doesn't overshoot past 100.
  const smoothProgress = useSpring(progress, {
    stiffness: 60,
    damping: 18,
    restDelta: 0.1,
  });

  useEffect(() => {
    // Subscribe to the spring value so we can read it as
    // plain numbers for the percentage text and bar width.
    const unsubscribe = smoothProgress.on("change", (latest) => {
      const clamped = Math.min(100, Math.round(latest));
      setDisplayPercent(clamped);

      // Once the spring settles at 100, give the user a
      // brief moment to see it complete before fading out.
      if (clamped >= 100) {
        setTimeout(() => setIsVisible(false), 400);
      }
    });

    // Kick the progress to 100 after a short pause so the
    // initial logo animations have time to play first.
    const timer = setTimeout(() => progress.set(100), 300);

    return () => {
      unsubscribe();
      clearTimeout(timer);
    };
  }, [progress, smoothProgress]);

  return (
    // AnimatePresence watches isVisible — when it flips to false
    // the child plays its exit animation before being removed.
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.7, ease: "easeInOut" } }}
          className="fixed inset-0 z-[999] flex flex-col items-center justify-center overflow-hidden bg-[#0a0a0f]"
        >
          {/* =====================================================
              BACKGROUND GLOWS
              Same ambient blobs used in every section, so the
              loader already feels "inside" the portfolio before
              it even finishes loading.
          ===================================================== */}
          <div className="pointer-events-none absolute inset-0">
            <motion.div
              animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.35, 0.2] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/25 blur-[130px]"
            />
            <motion.div
              animate={{ scale: [1.1, 1, 1.1], opacity: [0.15, 0.25, 0.15] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute left-1/2 top-1/2 h-[350px] w-[350px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/20 blur-[100px]"
            />
          </div>

          {/* =====================================================
              CENTER CONTENT
          ===================================================== */}
          <div className="relative flex flex-col items-center gap-12">

            {/* ---------- ANIMATED LOGO ---------- */}
            <div className="flex flex-col items-center gap-3">
              {/* The logo fades in and slides up from below */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="relative"
              >
                {/* Soft glow sitting behind the text */}
                <div className="absolute inset-0 -z-10 blur-2xl">
                  <div className="h-full w-full bg-gradient-to-r from-violet-500/40 to-cyan-400/40" />
                </div>

                <h1 className="font-display text-6xl font-semibold tracking-tight text-white sm:text-7xl">
                  Odom
                  {/* Each letter of ".dev" cascades in one by one */}
                  <span className="bg-gradient-to-r from-violet-400 to-cyan-300 bg-clip-text text-transparent">
                    {['.','d','e','v'].map((char, i) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.4,
                          delay: 0.4 + i * 0.08,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                      >
                        {char}
                      </motion.span>
                    ))}
                  </span>
                </h1>
              </motion.div>

              {/* Tagline fades in after the logo */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.9 }}
                className="text-sm font-medium tracking-[0.2em] text-white/40 uppercase"
              >
                Full Stack Developer
              </motion.p>
            </div>

            {/* ---------- PROGRESS BAR + PERCENTAGE ---------- */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex w-64 flex-col items-end gap-2 sm:w-80"
            >
              {/* Percentage number */}
              <span className="font-display text-xs font-medium tabular-nums text-white/40">
                {displayPercent}%
              </span>

              {/* Track */}
              <div className="relative h-[3px] w-full overflow-hidden rounded-full bg-white/[0.08]">
                {/* Gradient fill — width is driven by displayPercent
                    so it's always in sync with the spring value. */}
                <motion.div
                  style={{ width: `${displayPercent}%` }}
                  className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-violet-500 to-cyan-400"
                />

                {/* Moving glow at the leading edge of the bar —
                    the "glowing effects" requirement. It's a small
                    blurred dot that rides the right end of the fill. */}
                <motion.div
                  style={{ left: `${displayPercent}%` }}
                  className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-300 blur-md opacity-80"
                />
              </div>
            </motion.div>

          </div>

          {/* Bottom credit line */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="absolute bottom-10 text-xs text-white/20 tracking-widest uppercase"
          >
            Portfolio 2025
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}