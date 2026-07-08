import React, { useState, useEffect, useCallback } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import { HiOutlineArrowDownTray } from "react-icons/hi2";
import { FiGithub, FiLinkedin } from "react-icons/fi";

// ---------------------------------------------------------
// Nav link data lives in one place so the desktop pill nav
// and the mobile drawer always stay in sync. The "id" must
// match the id attribute on each <section> for both smooth
// scroll and the active-section highlight to work.
// ---------------------------------------------------------
const NAV_LINKS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
];

// Social links — edit hrefs to point at your real profiles.
const SOCIAL_LINKS = [
  { icon: FiGithub, href: "https://github.com/OdomCH", label: "GitHub" },
];

export default function Navbar() {
  // True once the page has scrolled past the hero — used to
  // shrink the pill slightly and deepen the glass shadow.
  const [isScrolled, setIsScrolled] = useState(false);

  // Which section is currently in view (drives the active pill).
  const [activeSection, setActiveSection] = useState("home");

  // Mobile drawer open/closed.
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // ---------------------------------------------------------
  // Scroll listener: handles two jobs at once.
  // 1. Flip `isScrolled` past a small threshold (controls the
  //    glass intensity / pill size).
  // 2. Basic scrollspy — finds the last section whose top has
  //    passed roughly the upper third of the viewport.
  // ---------------------------------------------------------
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);

      const scrollPosition = window.scrollY + window.innerHeight / 3;
      let current = NAV_LINKS[0].id;
      for (const link of NAV_LINKS) {
        const section = document.getElementById(link.id);
        if (section && section.offsetTop <= scrollPosition) {
          current = link.id;
        }
      }
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // run once in case the page loads mid-scroll
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll while the mobile drawer is open.
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  // Smooth-scrolls to a section, updates active state, closes drawer.
  const scrollToSection = useCallback((id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    setActiveSection(id);
    setIsMenuOpen(false);
  }, []);

  return (
    <>
      {/* ===========================================================
          STICKY GLASS PILL NAVBAR
          - fixed + centered: floats as a capsule rather than a
            full-width bar, which is what gives it that "premium
            dev portfolio" feel instead of a generic site header.
          - backdrop-blur + low-opacity white border/bg = glassmorphism.
      =========================================================== */}
      <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4 sm:pt-6">
        <nav
          className={`flex w-full max-w-5xl items-center justify-between gap-4 rounded-full border transition-all duration-500 ${
            isScrolled
              ? "border-white/10 bg-white/[0.06] py-2.5 px-4 shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-xl sm:px-6"
              : "border-white/5 bg-white/[0.03] py-3.5 px-5 backdrop-blur-lg sm:px-7"
          }`}
        >
          {/* ---------- LOGO ---------- */}
          <button
            onClick={() => scrollToSection("home")}
            className="shrink-0 cursor-pointer font-display text-lg font-semibold tracking-tight text-white transition-opacity hover:opacity-80"
          >
            Odom
            <span className="bg-gradient-to-r from-violet-400 to-cyan-300 bg-clip-text text-transparent">
              .dev
            </span>
          </button>

          {/* ---------- DESKTOP LINKS ---------- */}
          <ul className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.id}>
                <button
                  onClick={() => scrollToSection(link.id)}
                  className={`relative cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300 ${
                    activeSection === link.id
                      ? "text-white"
                      : "text-white/55 hover:text-white"
                  }`}
                >
                  {/* Active pill background — a separate absolutely
                      positioned element so it can fade/scale in
                      smoothly instead of just snapping into place. */}
                  {activeSection === link.id && (
                    <span className="absolute inset-0 -z-10 rounded-full bg-white/10 ring-1 ring-white/10" />
                  )}
                  {link.label}
                </button>
              </li>
            ))}
          </ul>

          {/* ---------- RIGHT SIDE: socials + CV (desktop) ---------- */}
          <div className="hidden items-center gap-3 md:flex">
            {/* Divider between nav links and the social/CV cluster */}
            <span className="h-5 w-px bg-white/10" />

            {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="rounded-full p-2 text-white/60 transition-all duration-300 hover:bg-white/10 hover:text-white cursor-pointer"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}

            {/* Gradient CV button — the one "loud" element in an
                otherwise restrained, monochrome glass nav. */}
            <a
              href="/Cheang Odom.pdf"
              download
              className="group relative ml-1 inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 px-4 py-2 text-sm font-medium text-white shadow-[0_2px_20px_rgba(124,58,237,0.35)] transition-all duration-300 hover:shadow-[0_4px_28px_rgba(124,58,237,0.55)] hover:-translate-y-0.5 cursor-pointer"
            >
              <HiOutlineArrowDownTray className="h-4 w-4" />
              Resume
            </a>
          </div>

          {/* ---------- HAMBURGER / CLOSE TOGGLE (mobile only) ---------- */}
          <button
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="inline-flex items-center justify-center rounded-full p-2 text-white transition-colors hover:bg-white/10 md:hidden cursor-pointer"
          >
            {isMenuOpen ? (
              <HiX className="h-5 w-5" />
            ) : (
              <HiMenu className="h-5 w-5" />
            )}
          </button>
        </nav>
      </header>

      {/* ===========================================================
          MOBILE DROPDOWN MENU
          Opens directly under the navbar as a full-width panel
          (not a side drawer). Always mounted so the close animation
          can play — height/opacity are what actually toggle it,
          which also lets the panel size itself to its content.
      =========================================================== */}
      <div
        className={`fixed inset-x-0 top-0 z-40 px-4 pt-[72px] transition-all duration-300 ease-out md:hidden ${
          isMenuOpen
            ? "max-h-[28rem] opacity-100"
            : "pointer-events-none max-h-0 opacity-0"
        } overflow-hidden`}
        aria-hidden={!isMenuOpen}
      >
        <div className="flex flex-col gap-1 rounded-3xl border border-white/10 bg-[#0c0a14]/95 p-3 shadow-[0_16px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl">
          {/* Links — Home, About, Skills, Projects, Contact */}
          {NAV_LINKS.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollToSection(link.id)}
              className={`w-full cursor-pointer rounded-2xl px-4 py-3 text-left text-base font-medium transition-colors ${
                activeSection === link.id
                  ? "bg-white/10 text-white"
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              }`}
            >
              {link.label}
            </button>
          ))}

          {/* Download CV — last item in the stack */}
          <a
            href="/cheang_odom.pdf"
            download
            className="mt-2 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-500 to-cyan-400 px-4 py-3.5 text-sm font-medium text-white shadow-[0_2px_20px_rgba(124,58,237,0.35)] transition-transform hover:-translate-y-0.5 cursor-pointer"
          >
            <HiOutlineArrowDownTray className="h-4 w-4" />
            Download CV
          </a>
        </div>
      </div>

      {/* Tap-anywhere-outside backdrop, sits behind the dropdown,
          below the navbar (z-30 < dropdown's z-40 < navbar's z-50) */}
      <div
        onClick={() => setIsMenuOpen(false)}
        className={`fixed inset-0 z-30 bg-black/50 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isMenuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!isMenuOpen}
      />
    </>
  );
}