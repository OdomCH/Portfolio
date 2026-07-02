import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaGithub, FaArrowUpRightFromSquare } from "react-icons/fa6";

// ---------------------------------------------------------
// Project data. Each project carries a "category" that must
// match one of the FILTERS values below (other than "All") so
// the filter buttons can find it. "tech" is the row of badges,
// "image" can be a real screenshot URL or a local import —
// see the note at the bottom of the file for swapping in your
// own images. Add or remove projects here; everything else
// (grid, filtering, animation) adapts automatically.
// ---------------------------------------------------------
const PROJECTS = [
  {
    id: 1,
    title: "E-Commerce Storefront",
    category: "Full Stack",
    description:
      "A full-featured online store with cart, checkout, and an admin dashboard for managing inventory in real time.",
    tech: ["React", "Node.js", "PostgreSQL", "Tailwind"],
    image:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80",
    liveUrl: "#",
    githubUrl: "#",
  },
  {
    id: 2,
    title: "Portfolio Dashboard UI",
    category: "Frontend",
    description:
      "A clean analytics dashboard built with reusable React components and animated data visualizations.",
    tech: ["React", "Tailwind", "Framer Motion"],
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
    liveUrl: "#",
    githubUrl: "#",
  },
  {
    id: 3,
    title: "Task Management API",
    category: "Backend",
    description:
      "A RESTful API handling authentication, role permissions, and task assignments for small team projects.",
    tech: ["Node.js", "Express.js", "PostgreSQL"],
    image:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80",
    liveUrl: "#",
    githubUrl: "#",
  },
  {
    id: 4,
    title: "Real-Time Chat App",
    category: "Full Stack",
    description:
      "A messaging app with live presence indicators, typing states, and persistent chat history.",
    tech: ["React", "Firebase", "Tailwind"],
    image:
      "https://images.unsplash.com/photo-1611606063065-ee7946f0787a?w=800&q=80",
    liveUrl: "#",
    githubUrl: "#",
  },
  {
    id: 5,
    title: "Deployment Pipeline",
    category: "Cloud",
    description:
      "An automated CI/CD setup that builds, tests, and deploys containerized services to the cloud on every push.",
    tech: ["Docker", "AWS", "GitHub Actions"],
    image:
      "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&q=80",
    liveUrl: "#",
    githubUrl: "#",
  },
  {
    id: 6,
    title: "Landing Page Builder",
    category: "Frontend",
    description:
      "A drag-and-drop landing page editor with live preview, built around a flexible component system.",
    tech: ["React", "Tailwind", "JavaScript"],
    image:
      "https://images.unsplash.com/photo-1559028012-481c04fa702d?w=800&q=80",
    liveUrl: "#",
    githubUrl: "#",
  },
];

// Filter button labels — "All" plus every category that
// actually appears above. Keeping this as its own list (rather
// than deriving it from PROJECTS) keeps the button order fixed
// even if projects are added/removed later.
const FILTERS = ["All", "Frontend", "Backend", "Full Stack", "Cloud"];

// Entrance animation variants for the section heading + filter
// bar, same staggered pattern used throughout the page.
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

// Per-card animation: fades in, zooms slightly from 0.92 scale,
// and slides up a touch — covers fade + zoom + slide in one
// transition rather than three separate effects competing.
const cardVariants = {
  hidden: { opacity: 0, scale: 0.92, y: 24 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    scale: 0.92,
    transition: { duration: 0.25, ease: "easeIn" },
  },
};

// ---------------------------------------------------------
// ProjectCard — a single glass card. Pulled out as its own
// component so the grid below stays readable and this card
// design is easy to reuse elsewhere if needed.
// ---------------------------------------------------------
function ProjectCard({ project }) {
  return (
    <motion.div
      layout
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-white/20 hover:shadow-[0_20px_50px_rgba(124,58,237,0.25)]"
    >
      {/* ---------- PROJECT IMAGE ---------- */}
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={project.image}
          alt={project.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Gradient fade at the bottom of the image so it blends
            into the card body instead of ending with a hard edge */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0a14] via-transparent to-transparent" />

        {/* Glow ring that fades in around the image on hover —
            the "glow" requirement, scoped to the image so it reads
            as a highlight rather than a full-card colored wash */}
        <div className="pointer-events-none absolute inset-0 opacity-0 ring-1 ring-inset ring-violet-400/40 transition-opacity duration-300 group-hover:opacity-100" />
      </div>

      {/* ---------- CARD BODY ---------- */}
      <div className="flex flex-1 flex-col gap-4 p-6">
        <h3 className="font-display text-xl font-semibold text-white">
          {project.title}
        </h3>

        <p className="flex-1 text-sm leading-relaxed text-white/55">
          {project.description}
        </p>

        {/* Technology badges */}
        <div className="flex flex-wrap gap-2">
          {project.tech.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs font-medium text-white/70"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* ---------- ACTION BUTTONS ---------- */}
        <div className="mt-2 flex items-center gap-3">
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 px-4 py-2.5 text-sm font-medium text-white shadow-[0_2px_16px_rgba(124,58,237,0.35)] transition-all duration-300 hover:shadow-[0_4px_24px_rgba(124,58,237,0.55)]"
          >
            <FaArrowUpRightFromSquare className="h-3.5 w-3.5" />
            Live Demo
          </a>
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${project.title} on GitHub`}
            className="inline-flex cursor-pointer items-center justify-center rounded-full border border-white/15 bg-white/[0.04] p-2.5 text-white/70 transition-all duration-300 hover:border-white/30 hover:bg-white/[0.08] hover:text-white"
          >
            <FaGithub className="h-4 w-4" />
          </a>
        </div>
      </div>
    </motion.div>
  );
}

export default function Projects() {
  // Currently active filter — drives both button styling and
  // which projects are visible in the grid below.
  const [activeFilter, setActiveFilter] = useState("All");

  // Recomputed only when activeFilter or PROJECTS changes,
  // rather than filtering on every render.
  const filteredProjects = useMemo(() => {
    if (activeFilter === "All") return PROJECTS;
    return PROJECTS.filter((project) => project.category === activeFilter);
  }, [activeFilter]);

  return (
    <section
      id="projects"
      className="relative overflow-hidden px-6 py-24 sm:px-10 lg:px-16"
    >
      {/* Background — same dark gradient + glow system as the
          rest of the page, glows mirrored from Skills so the
          light sources keep drifting section to section. */}
      <div className="absolute inset-0 -z-20 bg-gradient-to-b from-[#0a0a0f] via-[#0d0b16] to-[#0a0a0f]" />
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-20 top-1/4 h-[400px] w-[400px] rounded-full bg-cyan-500/15 blur-[120px]" />
        <div className="absolute -right-20 bottom-0 h-[420px] w-[420px] rounded-full bg-violet-600/20 blur-[120px]" />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="mx-auto max-w-6xl"
      >
        {/* ---------- SECTION HEADING ---------- */}
        <motion.div variants={itemVariants} className="mb-10 text-center">
          <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-sm font-medium text-white/60 backdrop-blur-md">
            Projects
          </span>
          <h2 className="mt-5 font-display text-4xl font-semibold text-white sm:text-5xl">
            Things I've built
          </h2>
          <p className="mx-auto mt-3 max-w-md text-center text-white/50">
            A selection of projects across the stack, from interfaces to
            infrastructure.
          </p>
        </motion.div>

        {/* ---------- FILTER BUTTONS ---------- */}
        <motion.div
          variants={itemVariants}
          className="mb-12 flex flex-wrap items-center justify-center gap-2"
        >
          {FILTERS.map((filter) => {
            const isActive = activeFilter === filter;
            return (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`relative cursor-pointer rounded-full px-5 py-2 text-sm font-medium transition-colors duration-300 ${
                  isActive
                    ? "text-white"
                    : "text-white/55 hover:text-white"
                }`}
              >
                {/* Active background — a separate layout-animated
                    element so it slides between buttons smoothly
                    instead of each button managing its own bg. */}
                {isActive && (
                  <motion.span
                    layoutId="activeFilterBg"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-violet-500 to-cyan-400"
                  />
                )}
                {!isActive && (
                  <span className="absolute inset-0 -z-10 rounded-full border border-white/10 bg-white/[0.03]" />
                )}
                {filter}
              </button>
            );
          })}
        </motion.div>

        {/* ===========================================================
            PROJECT GRID
            AnimatePresence handles cards animating out when the
            filter changes and new ones animating in — without it,
            filtered-out cards would just vanish instantly instead
            of playing their exit transition.
            "popLayout" mode lets remaining cards reflow into the
            gaps smoothly rather than jumping.
        =========================================================== */}
        <motion.div
          layout
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty state — shown if a filter ever matches nothing,
            so the section doesn't just go blank. */}
        {filteredProjects.length === 0 && (
          <p className="mt-10 text-center text-white/40">
            No projects in this category yet.
          </p>
        )}
      </motion.div>
    </section>
  );
}

// ---------------------------------------------------------
// NOTE on images: the projects above use Unsplash URLs as
// placeholders so the layout has something real to show.
// To use your own screenshots, drop images into src/assets/
// and import them at the top of this file, e.g.:
//
//   import ecommerceShot from "../assets/projects/ecommerce.png";
//
// then reference that imported variable as the "image" value
// for the matching project instead of a URL string.
// ---------------------------------------------------------