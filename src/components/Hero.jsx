import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiGithub, FiFacebook, FiMail, FiArrowRight, FiInstagram } from "react-icons/fi";
import { HiOutlineArrowDownTray } from "react-icons/hi2";
import profilePhoto from "../assets/profile.jpg";

// ---------------------------------------------------------
// Job titles that cycle through the typing effect. Edit this
// array to add/remove roles — the typing logic below handles
// any number of strings automatically.
// ---------------------------------------------------------
const JOB_TITLES = ["Full Stack Developer", "Software Engineer"];

// Social links — same pattern as Navbar.jsx so both stay
// easy to update together. Swap hrefs for your real profiles.
const SOCIAL_LINKS = [
  { icon: FiGithub, href: "https://github.com/OdomCH", label: "GitHub" },
  { icon: FiInstagram, href: "https://www.instagram.com/den_ie_?igsh=Z3ZrbW05MWt5cThv&utm_source=qr", label: "Instagram"},
  { icon: FiFacebook, href: "https://www.facebook.com/share/1CjezxNCu2/?mibextid=wwXIfr", label: "Facebook" },
  { icon: FiMail, href: "mailto:[domkx77@gmail.com]", label: "Email" },
];

// ---------------------------------------------------------
// Small custom hook that powers the typing effect.
// Cycles through `words`, typing each one out, pausing,
// deleting it, then moving to the next — looping forever.
// Pulled out as a hook (rather than inline state) so the
// JSX below stays readable and this logic is easy to test
// or reuse elsewhere if you add a typing effect somewhere else.
// ---------------------------------------------------------
function useTypingEffect(words, { typingSpeed = 80, deletingSpeed = 40, pauseDuration = 1800 } = {}) {
  const [wordIndex, setWordIndex] = useState(0);
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = words[wordIndex];

    // Decide what happens next based on where we are in the cycle:
    // typing forward, pausing at full word, or deleting backward.
    let timeout;

    if (!isDeleting && text === currentWord) {
      // Finished typing the word — wait, then start deleting.
      timeout = setTimeout(() => setIsDeleting(true), pauseDuration);
    } else if (isDeleting && text === "") {
      // Finished deleting — move to the next word and type again.
      setIsDeleting(false);
      setWordIndex((prev) => (prev + 1) % words.length);
    } else {
      // Either add or remove one character.
      const nextText = isDeleting
        ? currentWord.substring(0, text.length - 1)
        : currentWord.substring(0, text.length + 1);

      timeout = setTimeout(
        () => setText(nextText),
        isDeleting ? deletingSpeed : typingSpeed
      );
    }

    return () => clearTimeout(timeout);
  }, [text, isDeleting, wordIndex, words, typingSpeed, deletingSpeed, pauseDuration]);

  return text;
}

// ---------------------------------------------------------
// Framer Motion variants for the staggered entrance.
// Defined once outside the component so they aren't
// recreated on every render.
// ---------------------------------------------------------
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12, // each child animates 0.12s after the previous
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

export default function Hero() {
  const typedTitle = useTypingEffect(JOB_TITLES);

  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center overflow-hidden px-6 pt-28 pb-20 sm:px-10 lg:px-16"
    >
      {/* ===========================================================
          BACKGROUND LAYER
          - Base dark gradient gives the section depth instead of
            a flat black, which is what makes the glass elements
            on top of it actually look like glass.
          - Two large blurred color blobs are the "glowing circles."
          - A faint grid overlay adds texture without competing —
            this is the restrained "one accessory removed" pass.
      =========================================================== */}
      <div className="absolute inset-0 -z-20 bg-gradient-to-b from-[#0a0a0f] via-[#0d0b16] to-[#0a0a0f]" />

      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-32 top-10 h-[420px] w-[420px] rounded-full bg-violet-600/25 blur-[110px]" />
        <div className="absolute -right-24 top-1/3 h-[460px] w-[460px] rounded-full bg-cyan-500/20 blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 h-[300px] w-[300px] rounded-full bg-fuchsia-500/10 blur-[100px]" />

        {/* Subtle dot grid — pure CSS, no extra assets needed.
            Opacity is intentionally low; this is texture, not a pattern. */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      {/* ===========================================================
          CONTENT GRID
          Two columns on large screens (text left, photo right),
          stacked on mobile with the photo first so the page opens
          with a face rather than a wall of text on small screens.
      =========================================================== */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="mx-auto grid w-full max-w-6xl items-center gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12"
      >
        {/* ---------- LEFT: TEXT CONTENT ---------- */}
        <div className="order-2 flex flex-col items-center text-center lg:order-1 lg:items-start lg:text-left">
          {/* Greeting — small glass pill, sets tone before the name */}
          <motion.span
            variants={itemVariants}
            className="mb-5 inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-sm font-medium text-white/60 backdrop-blur-md"
          >
            Hello, I'm
          </motion.span>

          {/* Name — the largest, boldest element on the page.
              Gradient text on the surname-style ".dev" echo ties
              this back to the navbar logo for visual continuity. */}
          <motion.h1
            variants={itemVariants}
            className="font-display text-6xl font-semibold tracking-tight text-white sm:text-7xl lg:text-8xl"
          >
            Cheang Odom
          </motion.h1>

          {/* Job title — fixed-height wrapper so the layout doesn't
              jump as the typed text grows and shrinks. The blinking
              cursor is a plain CSS-animated span, no extra library. */}
          <motion.div
            variants={itemVariants}
            className="mt-4 flex h-9 items-center text-xl font-medium text-white/70 sm:text-2xl"
          >
            <span className="bg-gradient-to-r from-violet-400 to-cyan-300 bg-clip-text text-transparent">
              {typedTitle}
            </span>
            <span className="ml-1 inline-block h-6 w-[2px] animate-pulse bg-cyan-300" />
          </motion.div>

          {/* Short description */}
          <motion.p
            variants={itemVariants}
            className="mt-6 max-w-md text-base leading-relaxed text-white/50 sm:text-lg"
          >
            I build modern, scalable, and user-friendly web applications with
            beautiful interfaces and clean code.
          </motion.p>

          {/* ---------- BUTTONS ---------- */}
          <motion.div
            variants={itemVariants}
            className="mt-9 flex flex-wrap items-center justify-center gap-3 lg:justify-start"
          >
            {/* Primary CTA — gradient fill, the loudest element here,
                same treatment as the navbar's Resume button so the
                two feel like one consistent design system. */}
            <a
              href="#projects"
              className="group inline-flex cursor-pointer items-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 px-6 py-3 text-sm font-medium text-white shadow-[0_4px_24px_rgba(124,58,237,0.4)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_6px_32px_rgba(124,58,237,0.6)]"
            >
              View Projects
              <FiArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>

            {/* Secondary CTA — glass outline, sits quietly next to
                the gradient button instead of competing with it. */}
            <a
              href="/cheang_odom.pdf"
              download
              className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-6 py-3 text-sm font-medium text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/[0.08]"
            >
              <HiOutlineArrowDownTray className="h-4 w-4" />
              Download CV
            </a>

            {/* Tertiary CTA — plain text link, lowest visual weight,
                for the least-committal action of the three. */}
            <a
              href="#contact"
              className="inline-flex cursor-pointer items-center gap-2 px-4 py-3 text-sm font-medium text-white/60 transition-colors duration-300 hover:text-white"
            >
              Contact Me
            </a>
          </motion.div>

          {/* ---------- SOCIAL ICONS ---------- */}
          <motion.div
            variants={itemVariants}
            className="mt-10 flex items-center gap-3"
          >
            {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("mailto:") ? undefined : "_blank"}
                rel="noopener noreferrer"
                aria-label={label}
                className="cursor-pointer rounded-full border border-white/10 bg-white/[0.03] p-3 text-white/60 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/10 hover:text-white"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </motion.div>
        </div>

        {/* ---------- RIGHT: PROFILE IMAGE ---------- */}
        <motion.div
          variants={itemVariants}
          className="order-1 flex justify-center lg:order-2"
        >
          {/* Floating wrapper — Framer Motion handles the gentle
              up/down loop. Kept as its own motion element so the
              entrance animation (fade/slide-up) and the floating
              loop don't fight each other. */}
          <motion.div
            animate={{ y: [0, -16, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="relative"
          >
            {/* Rotating gradient ring behind the photo. A plain div
                with a conic gradient, spun with a CSS keyframe — this
                is the "animated gradient border." Sized slightly
                larger than the photo and blurred so it glows. */}
            <div className="absolute inset-[-6px] rounded-full bg-[conic-gradient(from_0deg,#7c3aed,#06b6d4,#7c3aed)] opacity-90 blur-[2px] [animation:spin_6s_linear_infinite]" />

            {/* Soft ambient glow behind everything */}
            <div className="absolute inset-0 -z-10 rounded-full bg-gradient-to-br from-violet-500/40 to-cyan-400/40 blur-3xl" />

            {/* Actual photo — dark ring + offset white inner ring
                creates the "glass frame" look, photo sits on top. */}
            <div className="relative h-64 w-64 overflow-hidden rounded-full border-4 border-[#0a0a0f] sm:h-80 sm:w-80">
              <img
                src={profilePhoto}
                alt="Odom — portrait"
                className="h-full w-full object-cover"
              />
              {/* Subtle inner shadow so the photo doesn't look pasted on */}
              <div className="absolute inset-0 rounded-full shadow-[inset_0_0_40px_rgba(0,0,0,0.35)]" />
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}