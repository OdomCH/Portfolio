import React from "react";
import { motion } from "framer-motion";
import { HiOutlineArrowUp, HiOutlineHeart } from "react-icons/hi2";
import { FiGithub, FiLinkedin, FiFacebook, FiMail } from "react-icons/fi";

// Navigation links — same list as Navbar so both stay in sync.
// If you add a new section to the page, add it here too.
const NAV_LINKS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
];

const SOCIALS = [
  { icon: FiGithub, href: "https://github.com/OdomCH", label: "GitHub" },
  { icon: FiFacebook, href: "https://www.facebook.com/share/1CjezxNCu2/?mibextid=wwXIfr", label: "Facebook" },
  { icon: FiMail, href: "mailto:[udomban312gmail.com]", label: "Email" },
];

// Scrolls to a section by id, same way the navbar does it.
function scrollToSection(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function Footer() {
  return (
    <>
      <footer className="relative overflow-hidden">
        {/* Gradient background — a deep violet-to-dark fade that
            gives the footer a sense of depth and ties it back to
            the violet/cyan accent system used throughout the page. */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#0a0a0f] via-[#0d0a1a] to-[#060409]" />

        {/* Glow blobs, same technique as every other section */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -left-20 bottom-0 h-[300px] w-[300px] rounded-full bg-violet-700/20 blur-[100px]" />
          <div className="absolute -right-10 top-0 h-[250px] w-[250px] rounded-full bg-cyan-600/10 blur-[90px]" />
        </div>

        {/* =========================================================
            ANIMATED DIVIDER
            A gradient line that draws itself in from left to right
            once it scrolls into view. Uses a motion.div with an
            initial scaleX of 0 that animates to 1, with
            transformOrigin set to the left edge so it expands
            rightward instead of growing from the center.
        ========================================================= */}
        <div className="mx-auto max-w-6xl px-6 sm:px-10 lg:px-16">
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: "left" }}
            className="h-px bg-gradient-to-r from-transparent via-violet-500/60 to-transparent"
          />
        </div>

        {/* =========================================================
            MAIN FOOTER CONTENT
        ========================================================= */}
        <div className="mx-auto max-w-6xl px-6 py-14 sm:px-10 lg:px-16">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.1 } },
            }}
            className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3"
          >
            {/* ---------- COLUMN 1: LOGO + TAGLINE ---------- */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col gap-4"
            >
              <button
                onClick={() => scrollToSection("home")}
                className="w-fit cursor-pointer font-display text-xl font-semibold tracking-tight text-white transition-opacity hover:opacity-75"
              >
                Odom
                <span className="bg-gradient-to-r from-violet-400 to-cyan-300 bg-clip-text text-transparent">
                  .dev
                </span>
              </button>

              <p className="max-w-xs text-sm leading-relaxed text-white/50">
                Building clean, modern web applications with a focus on
                great user experience and solid code.
              </p>

              {/* Social icons */}
              <div className="mt-2 flex items-center gap-2">
                {SOCIALS.map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target={href.startsWith("mailto:") ? undefined : "_blank"}
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="cursor-pointer rounded-full border border-white/10 bg-white/[0.03] p-2.5 text-white/55 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </motion.div>

            {/* ---------- COLUMN 2: NAVIGATION ---------- */}
            <motion.div variants={itemVariants} className="flex flex-col gap-4">
              <h3 className="font-display text-sm font-semibold uppercase tracking-widest text-white/40">
                Navigation
              </h3>
              <ul className="flex flex-col gap-3">
                {NAV_LINKS.map((link) => (
                  <li key={link.id}>
                    <button
                      onClick={() => scrollToSection(link.id)}
                      className="group flex cursor-pointer items-center gap-2 text-sm text-white/55 transition-colors duration-200 hover:text-white"
                    >
                      {/* Small arrow that slides in from the left on hover */}
                      <span className="h-px w-0 bg-gradient-to-r from-violet-400 to-cyan-300 transition-all duration-300 group-hover:w-4" />
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* ---------- COLUMN 3: AVAILABILITY ---------- */}
            <motion.div variants={itemVariants} className="flex flex-col gap-4">
              <h3 className="font-display text-sm font-semibold uppercase tracking-widest text-white/40">
                Availability
              </h3>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-md">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5 shrink-0">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  </span>
                  <span className="text-sm font-medium text-emerald-400">
                    Open to work
                  </span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-white/50">
                  Available for freelance projects, collaborations, and
                  full-time opportunities.
                </p>
                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection("contact");
                  }}
                  className="mt-4 inline-flex cursor-pointer items-center gap-1.5 text-sm font-medium text-violet-400 transition-colors hover:text-violet-300"
                >
                  Get in touch
                  <HiOutlineArrowUp className="h-3.5 w-3.5 rotate-45" />
                </a>
              </div>
            </motion.div>
          </motion.div>

          {/* =========================================================
              BOTTOM BAR: copyright + credit
          ========================================================= */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-white/[0.06] pt-8 sm:flex-row"
          >
            <p className="text-sm text-white/35">
              &copy; {new Date().getFullYear()} Odom. All rights reserved.
            </p>
            <p className="flex items-center gap-1.5 text-sm text-white/35">
              Built with
              <HiOutlineHeart className="h-3.5 w-3.5 text-violet-400" />
              using React &amp; Tailwind CSS
            </p>
          </motion.div>
        </div>
      </footer>
    </>
  );
}

// Shared entrance variant for the three footer columns.
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};