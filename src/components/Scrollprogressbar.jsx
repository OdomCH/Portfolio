import { useScroll, useSpring, motion } from "framer-motion";

// ---------------------------------------------------------
// ScrollProgressBar
//
// Fixed at the very top of the viewport (above the navbar),
// fills left to right as the user scrolls the page.
//
// useScroll gives us a raw 0–1 value based on scroll position.
// useSpring smooths it so the bar doesn't jerk — it follows
// the scroll with a slight lag that feels more physical.
// scaleX is used instead of width so the transform happens
// on the GPU (no layout recalculation every frame).
// ---------------------------------------------------------
export default function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 22,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{
        scaleX,
        transformOrigin: "left",
      }}
      className="fixed top-0 left-0 right-0 z-[60] h-[3px] bg-gradient-to-r from-violet-500 via-fuchsia-400 to-cyan-400"
    />
  );
}