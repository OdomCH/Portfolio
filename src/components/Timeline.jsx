import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  HiOutlineAcademicCap,
  HiOutlineDocumentCheck,
  HiOutlineBriefcase,
  HiOutlineComputerDesktop,
} from "react-icons/hi2";

// ---------------------------------------------------------
// Timeline data, in chronological order (oldest first, since
// that's how the line reads top to bottom). Each entry has a
// "type" used only to pick a color accent, so milestones from
// the same category (e.g. both Education entries) feel visually
// related even though they're not grouped into separate lists.
// Add or remove entries here — the line and card positions
// adjust automatically to however many items exist.
// ---------------------------------------------------------
const TIMELINE = [
  {
    id: 1,
    type: "education",
    icon: HiOutlineAcademicCap,
    date: "2023 — 2026",
    title: "Bachelor's Degree, Computer Science",
    place: "Beltei International of University",
    description:
      "Studied core computer science fundamentals including data structures, algorithms, databases, and software engineering principles.",
  },
  {
    id: 2,
    type: "education",
    icon: HiOutlineDocumentCheck,
    date: "2024",
    title: "Spring Eaducation Certification",
    place: "Marketing and Sales",
    description:
      "Has completed String internship Program (Batch 30). The intern demonstrated commitment and good team spirit during the internship.",
  }
];

// Color accent per category — keeps Education and Experience
// visually distinct without needing separate timelines.
const TYPE_STYLES = {
  education: {
    iconColor: "text-violet-300",
    ring: "from-violet-500 to-violet-300",
    badge: "border-violet-400/30 bg-violet-500/10 text-violet-300",
  },
  experience: {
    iconColor: "text-cyan-300",
    ring: "from-cyan-400 to-cyan-200",
    badge: "border-cyan-400/30 bg-cyan-500/10 text-cyan-300",
  },
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
};

const headingVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

// ---------------------------------------------------------
// TimelineItem — one milestone: an icon node sitting on the
// vertical line, and a glass card beside it. On desktop, items
// alternate left/right of the centered line; on mobile every
// item sits on the same side since there's no room to alternate.
// ---------------------------------------------------------
function TimelineItem({ entry, index, isLast }) {
  const isLeft = index % 2 === 0; // alternate sides on desktop
  const styles = TYPE_STYLES[entry.type];
  const Icon = entry.icon;

  // Each card animates in from whichever side it's slid in
  // from, fading and easing into place as it scrolls into view.
  const cardVariants = {
    hidden: { opacity: 0, x: isLeft ? -40 : 40, y: 16 },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className={`relative flex flex-col gap-6 pl-16 sm:pl-20 md:flex-row md:gap-0 md:pl-0 ${
        isLast ? "" : "pb-14"
      }`}
    >
      {/* ---------- ICON NODE ON THE LINE ---------- */}
      <div className="absolute left-0 top-0 flex h-12 w-12 items-center justify-center sm:h-14 sm:w-14 md:left-1/2 md:-translate-x-1/2">
        {/* Soft glow behind the icon, tinted by category */}
        <div
          className={`absolute inset-0 rounded-full bg-gradient-to-br ${styles.ring} opacity-30 blur-md`}
        />
        <div className="relative flex h-full w-full items-center justify-center rounded-full border border-white/15 bg-[#0c0a14] backdrop-blur-xl">
          <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${styles.iconColor}`} />
        </div>
      </div>

      {/* ---------- DESKTOP SPACER (keeps alternating sides aligned) ---------- */}
      <div className="hidden md:block md:w-1/2" />

      {/* ---------- CARD ---------- */}
      <motion.div
        variants={cardVariants}
        className={`md:w-1/2 ${
          isLeft ? "md:order-first md:pr-12 md:text-right" : "md:pl-12"
        }`}
      >
        <div className="group rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.07] hover:shadow-[0_16px_40px_rgba(124,58,237,0.18)]">
          <span
            className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${styles.badge}`}
          >
            {entry.date}
          </span>

          <h3 className="mt-3 font-display text-lg font-semibold text-white sm:text-xl">
            {entry.title}
          </h3>
          <p className="mt-1 text-sm font-medium text-white/50">
            {entry.place}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-white/55">
            {entry.description}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Timeline() {
  // Ref on the track wrapping all timeline items — used to
  // measure scroll progress through *this specific section*,
  // not the whole page, so the line fills exactly as the
  // timeline scrolls through the viewport.
  const trackRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start center", "end center"],
  });

  // Maps scroll progress (0 to 1) to the line's fill height
  // (0% to 100%) — this is what makes the vertical line animate
  // smoothly as the user scrolls, rather than just appearing
  // fully drawn on load.
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section
      id="timeline"
      className="relative overflow-hidden px-6 py-24 sm:px-10 lg:px-16"
    >
      {/* Background — same dark gradient + glow system as the
          rest of the page. */}
      <div className="absolute inset-0 -z-20 bg-gradient-to-b from-[#0a0a0f] via-[#0d0b16] to-[#0a0a0f]" />
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/4 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-violet-600/15 blur-[130px]" />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="mx-auto max-w-5xl"
      >
        {/* ---------- SECTION HEADING ---------- */}
        <motion.div variants={headingVariants} className="mb-16 text-center">
          <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-sm font-medium text-white/60 backdrop-blur-md">
            Journey
          </span>
          <h2 className="mt-5 font-display text-4xl font-semibold text-white sm:text-5xl">
            Education &amp; Experience
          </h2>
          <p className="mx-auto mt-3 max-w-md text-center text-white/50">
            The path that led from learning the fundamentals to building
            real products.
          </p>
        </motion.div>

        {/* ===========================================================
            TIMELINE TRACK
            Line sits at left edge on mobile (16/20px in), centered
            on desktop (md:left-1/2). Two layers: a faint static
            track showing the full length, and a gradient fill on
            top that grows with scroll progress.
        =========================================================== */}
        <div ref={trackRef} className="relative">
          {/* Static track — full height, low opacity, always visible
              so the unscrolled portion of the line still reads as
              part of the timeline rather than empty space. */}
          <div className="absolute left-6 top-0 h-full w-px -translate-x-1/2 bg-white/10 sm:left-7 md:left-1/2" />

          {/* Animated fill — grows from 0% to 100% height in sync
              with scroll progress through this section. */}
          <motion.div
            style={{ height: lineHeight }}
            className="absolute left-6 top-0 w-px -translate-x-1/2 bg-gradient-to-b from-violet-500 via-cyan-400 to-violet-400 sm:left-7 md:left-1/2"
          />

          {TIMELINE.map((entry, index) => (
            <TimelineItem
              key={entry.id}
              entry={entry}
              index={index}
              isLast={index === TIMELINE.length - 1}
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
}