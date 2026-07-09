import React, { useState, useEffect, useRef } from "react";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import {
  HiOutlineAcademicCap,
  HiOutlineBriefcase,
  HiOutlineLanguage,
  HiOutlineMapPin,
} from "react-icons/hi2";
import { HiOutlineArrowDownTray } from "react-icons/hi2";
import profilePhoto from "../assets/profile1.JPG";

// ---------------------------------------------------------
// Stat data — the three animated counters at the bottom of
// the section. "value" is the number it counts up to, "suffix"
// is anything appended after (like "+"), and "label" is the
// caption underneath. Add/remove entries here to change the row.
// ---------------------------------------------------------
const STATS = [
  { value: 4, suffix: "+", label: "Years Learning" },
  { value: 2, suffix: "+", label: "Projects Completed" },
  { value: 17, suffix: "+", label: "Technologies Learned" },
];

// ---------------------------------------------------------
// Info rows — Education, Experience, Languages, Location.
// Each one pairs an icon with a label/value so they render
// consistently in a loop instead of four hand-written blocks.
// Edit the "value" strings to match your real details.
// ---------------------------------------------------------
const INFO_ITEMS = [
  {
    icon: HiOutlineAcademicCap,
    label: "Education",
    value: "B.Sc. in Computer Science",
  },
  {
    icon: HiOutlineBriefcase,
    label: "Experience",
    value: "1 Years as a Full Stack Developer",
  },
  {
    icon: HiOutlineLanguage,
    label: "Languages",
    value: "English, Khmer",
  },
  {
    icon: HiOutlineMapPin,
    label: "Location",
    value: "Phnom Penh, Cambodia",
  },
];

// ---------------------------------------------------------
// Framer Motion variants for the staggered entrance — same
// pattern used in Navbar/Hero so every section in the page
// animates the same way and feels like one cohesive system.
// ---------------------------------------------------------
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

// ---------------------------------------------------------
// StatCounter — a single animated number. Uses Framer Motion's
// useSpring to drive the count-up smoothly, and useInView so it
// only starts counting once it's actually scrolled into view
// (instead of animating immediately on page load, off-screen).
// ---------------------------------------------------------
function StatCounter({ value, suffix, label, delay = 0 }) {
  const ref = useRef(null);
  // `once: true` means it only triggers the first time it enters
  // view — re-scrolling past it won't restart the count.
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  // motionValue holds the raw number; spring smooths the motion
  // from 0 up to the target instead of jumping straight there.
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { duration: 1.8, bounce: 0 });

  // Displayed text — kept in regular React state since Tailwind/
  // JSX can't read a Framer Motion value directly as text.
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (isInView) {
      // Small delay so each card's count-up starts slightly after
      // the previous one, echoing the staggered fade-in above it.
      const timer = setTimeout(() => motionValue.set(value), delay);
      return () => clearTimeout(timer);
    }
  }, [isInView, value, delay, motionValue]);

  useEffect(() => {
    // Subscribe to the spring's live value and round it for display.
    const unsubscribe = springValue.on("change", (latest) => {
      setDisplayValue(Math.round(latest));
    });
    return unsubscribe;
  }, [springValue]);

  return (
    <div
      ref={ref}
      className="group rounded-3xl border border-white/10 bg-white/4 p-6 text-center backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.07] sm:p-8"
    >
      <p className="font-display text-4xl font-semibold text-white sm:text-5xl">
        <span className="bg-linear-to-r from-violet-400 to-cyan-300 bg-clip-text text-transparent">
          {displayValue}
          {suffix}
        </span>
      </p>
      <p className="mt-2 text-sm font-medium text-white/50 sm:text-base">
        {label}
      </p>
    </div>
  );
}

export default function About() {
  return (
    <section
      id="about"
      className="relative overflow-hidden px-6 py-24 sm:px-10 lg:px-16"
    >
      {/* ===========================================================
          BACKGROUND LAYER
          Same dark gradient + glow blob treatment as Hero, but
          mirrored (glows on the opposite side) so the page doesn't
          feel like it's repeating itself as you scroll down.
      =========================================================== */}
      <div className="absolute inset-0 -z-20 bg-linear-to-b from-[#0a0a0f] via-[#0d0b16] to-[#0a0a0f]" />
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -right-32 top-0 h-105 w-105 rounded-full bg-cyan-500/20 blur-[110px]" />
        <div className="absolute -left-24 bottom-1/4 h-100 w-100 rounded-full bg-violet-600/20 blur-[110px]" />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="mx-auto max-w-6xl"
      >
        {/* ---------- SECTION HEADING ---------- */}
        <motion.div variants={itemVariants} className="mb-14 text-center">
          <span className="inline-flex items-center rounded-full border border-white/10 bg-white/4 px-4 py-1.5 text-sm font-medium text-white/60 backdrop-blur-md">
            About Me
          </span>
          <h2 className="mt-5 font-display text-4xl font-semibold text-white sm:text-5xl">
            Get to know me
          </h2>
        </motion.div>

        {/* ===========================================================
            MAIN GRID — photo on one side, details on the other.
            Stacks to a single column below the lg breakpoint.
        =========================================================== */}
        <div className="grid items-start gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          {/* ---------- LEFT: FLOATING PROFILE IMAGE ---------- */}
          <motion.div
            variants={itemVariants}
            className="flex justify-center lg:justify-start"
          >
            <motion.div
              animate={{ y: [0, -14, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              {/* Rotating gradient ring, same treatment as Hero so
                  the two photos read as part of one identity. */}
              <div className="absolute -inset-1.25 rounded-3xl bg-[conic-gradient(from_0deg,#7c3aed,#06b6d4,#7c3aed)] opacity-80 blur-[2px] animate-[spin_7s_linear_infinite]" />
              <div className="absolute inset-0 -z-10 rounded-3xl bg-linear-to-br from-violet-500/30 to-cyan-400/30 blur-3xl" />

              <div className="relative h-72 w-60 overflow-hidden rounded-3xl border-4 border-[#0a0a0f] sm:h-80 sm:w-64">
                <img
                  src={profilePhoto}
                  alt="Odom — portrait"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 rounded-3xl shadow-[inset_0_0_40px_rgba(0,0,0,0.35)]" />
              </div>
            </motion.div>
          </motion.div>

          {/* ---------- RIGHT: TEXT + INFO GRID ---------- */}
          <div className="flex flex-col gap-8">
            {/* About paragraph */}
            <motion.p
              variants={itemVariants}
              className="text-base leading-relaxed text-white/60 sm:text-lg"
            >
              I'm a full stack developer who enjoys turning ideas into clean,
              functional products. I care about details, from how an interface
              feels to how the code behind it is organized, and I'm always
              looking for the next thing to learn. Outside of writing code, I
              like exploring new tools and finding better ways to solve familiar
              problems.
            </motion.p>

            {/* Info grid — Education, Experience, Languages, Location.
                2 columns on tablet/desktop, 1 column on mobile. Each
                item is its own small glass card so the whole grid
                reads as a set rather than a plain list. */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-1 gap-4 sm:grid-cols-2"
            >
              {INFO_ITEMS.map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="group flex items-start gap-4 rounded-2xl border border-white/10 bg-white/4 p-5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.07]"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-violet-500/20 to-cyan-400/20 text-violet-300 transition-colors duration-300 group-hover:text-cyan-300">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-white/40">
                      {label}
                    </p>
                    <p className="mt-1 text-sm font-medium text-white sm:text-base">
                      {value}
                    </p>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Download Resume button */}
            <motion.div variants={itemVariants}>
              <a
                href="/Cheang_odom.pdf"
                download
                className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-liner-to-r from-violet-500 to-cyan-400 px-6 py-3 text-sm font-medium text-white shadow-[0_4px_24px_rgba(124,58,237,0.4)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_6px_32px_rgba(124,58,237,0.6)]"
              >
                <HiOutlineArrowDownTray className="h-4 w-4" />
                Download Resume
              </a>
            </motion.div>
          </div>
        </div>

        {/* ===========================================================
            ANIMATED STATISTICS CARDS
            3 columns on tablet/desktop, stacked on mobile. Each
            StatCounter independently watches its own scroll position
            and counts up once it enters view.
        =========================================================== */}
        <motion.div
          variants={itemVariants}
          className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-3"
        >
          {STATS.map((stat, index) => (
            <StatCounter key={stat.label} {...stat} delay={index * 150} />
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
