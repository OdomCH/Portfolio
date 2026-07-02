import React, { useRef, useEffect, useState } from "react";
import { color, motion, useInView } from "framer-motion";
import {
  SiHtml5,
  SiCss,
  SiJavascript,
  SiReact,
  SiTailwindcss,
  SiNodedotjs,
  SiExpress,
  SiFirebase,
  SiPostgresql,
  SiGit,
  SiGithub,
  SiFigma,
  SiDocker,
  SiMysql,
  SiGo,
  SiAndroidstudio,
  SiGooglecloud,
} from "react-icons/si";
import { FaAws } from "react-icons/fa6";
import { DiVisualstudio } from "react-icons/di";

// ---------------------------------------------------------
// Skill data, grouped by category. Each skill carries its own
// icon component, display name, and proficiency percentage —
// adjust the "level" numbers to reflect your actual experience,
// and add/remove entries here to change what renders below.
// ---------------------------------------------------------
const SKILL_CATEGORIES = [
  {
    name: "Frontend",
    skills: [
      { icon: SiHtml5, name: "HTML", level: 95, color: "#e34f26" },
      { icon: SiCss, name: "CSS", level: 90, color: "#1572b6" },
      { icon: SiJavascript, name: "JavaScript", level: 88, color: "#f7df1e" },
      { icon: SiReact, name: "React", level: 90, color: "#61dafb" },
      { icon: SiTailwindcss, name: "Tailwind", level: 92, color: "#38bdf8" },
    ],
  },
  {
    name: "Backend",
    skills: [
      { icon: SiNodedotjs, name: "Node.js", level: 80, color: "#3c873a" },
      { icon: SiExpress, name: "Express.js", level: 78, color: "#ffffff" },
      { icon: SiGo, name: "Gofiber", level: 50, color: "#4169e1" }
    ],
  },
  {
    name: "Database",
    skills: [
      { icon: SiFirebase, name: "Firebase", level: 82, color: "#ffca28" },
      { icon: SiPostgresql, name: "PostgreSQL", level: 75, color: "#4169e1" },
      { icon: SiMysql, name: "MySQL", level: 70, color: "#4169e1"}
    ],
  },
  {
    name: "Tools",
    skills: [
      { icon: SiGithub, name: "GitHub", level: 90, color: "#ffffff" },
      { icon: DiVisualstudio, name: "VS Code", level: 95, color: "#007acc" },
      { icon: SiFigma, name: "Figma", level: 70, color: "#f24e1e" },
      { icon: SiAndroidstudio, name: "Android-Studio", level: 60, color: "#007acc"}
    ],
  },
  {
    name: "Cloud",
    skills: [
      { icon: FaAws, name: "AWS", level: 65, color: "#ff9900" },
      { icon: SiDocker, name: "Docker", level: 70, color: "#2496ed" },
    ],
  },
];

// Entrance animation variants — same staggered pattern used
// across Hero/About so every section feels consistent.
const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

// ---------------------------------------------------------
// SkillCard — one icon + name + animated progress bar.
// The bar fills (and the percentage counts up) only once the
// card scrolls into view, using the same useInView pattern as
// the stat counters in About.jsx, so nothing animates while
// it's still off-screen below the fold.
// ---------------------------------------------------------
function SkillCard({ icon: Icon, name, level, color, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const [displayLevel, setDisplayLevel] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    // Counts the percentage number up in step with the bar fill,
    // staggered slightly per card so a whole row doesn't tick
    // upward in perfect, robotic unison.
    const startDelay = setTimeout(() => {
      const duration = 900;
      const stepTime = 16;
      const steps = duration / stepTime;
      const increment = level / steps;
      let current = 0;

      const interval = setInterval(() => {
        current += increment;
        if (current >= level) {
          setDisplayLevel(level);
          clearInterval(interval);
        } else {
          setDisplayLevel(Math.round(current));
        }
      }, stepTime);

      return () => clearInterval(interval);
    }, index * 60);

    return () => clearTimeout(startDelay);
  }, [isInView, level, index]);

  return (
    <motion.div
      ref={ref}
      variants={itemVariants}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-white/20 hover:bg-white/[0.07] hover:shadow-[0_12px_32px_rgba(124,58,237,0.18)]"
    >
      {/* Soft color glow that appears behind the icon on hover —
          uses the skill's own brand color so each card's hover
          feels tied to that specific technology. */}
      <div
        className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-30"
        style={{ backgroundColor: color }}
      />

      <div className="relative flex items-center gap-3">
        {/* Icon — floats gently on its own loop, independent of
            the card's hover state, so the row feels quietly alive
            even before anyone interacts with it. */}
        <motion.span
          animate={{ y: [0, -5, 0] }}
          transition={{
            duration: 3 + (index % 3) * 0.4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: (index % 4) * 0.2,
          }}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-xl"
          style={{ color }}
        >
          <Icon />
        </motion.span>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-white sm:text-base">
            {name}
          </p>
        </div>

        {/* Percentage — counts up in sync with the bar fill */}
        <span className="font-display text-sm font-semibold text-white/70">
          {displayLevel}%
        </span>
      </div>

      {/* Progress bar track + animated fill */}
      <div className="relative mt-4 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
        <motion.div
          initial={{ width: "0%" }}
          animate={{ width: isInView ? `${level}%` : "0%" }}
          transition={{ duration: 0.9, delay: index * 0.06, ease: "easeOut" }}
          className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400"
        />
      </div>
    </motion.div>
  );
}

export default function Skills() {
  return (
    <section
      id="skills"
      className="relative overflow-hidden px-6 py-24 sm:px-10 lg:px-16"
    >
      {/* ===========================================================
          BACKGROUND — same dark gradient + glow system as the
          other sections, glows placed center/top this time so the
          page's light sources keep drifting as you scroll rather
          than repeating the same left/right pattern every section.
      =========================================================== */}
      <div className="absolute inset-0 -z-20 bg-gradient-to-b from-[#0a0a0f] via-[#0d0b16] to-[#0a0a0f]" />
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[450px] w-[450px] -translate-x-1/2 rounded-full bg-violet-600/20 blur-[130px]" />
        <div className="absolute bottom-0 right-0 h-[350px] w-[350px] rounded-full bg-cyan-500/15 blur-[110px]" />
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
          <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-sm font-medium text-white/60 backdrop-blur-md">
            Skills
          </span>
          <h2 className="mt-5 font-display text-4xl font-semibold text-white sm:text-5xl">
            What I work with
          </h2>
          <p className="mx-auto mt-3 max-w-md items-center inline-flex text-white/50">
            Tools and technologies I use to design, build, and ship products.
          </p>
        </motion.div>

        {/* ===========================================================
            CATEGORY GROUPS
            Each category renders its own heading + a responsive
            grid of SkillCards. Grid columns scale with screen size:
            1 col on mobile, 2 on tablet, 3 on desktop.
        =========================================================== */}
        <div className="flex flex-col gap-14">
          {SKILL_CATEGORIES.map((category) => (
            <motion.div key={category.name} variants={itemVariants}>
              {/* Category label with a short gradient divider line,
                  rather than a heavy heading — keeps the hierarchy
                  quiet since the cards themselves carry the content. */}
              <div className="mb-5 flex items-center gap-3">
                <h3 className="font-display text-lg font-semibold text-white sm:text-xl">
                  {category.name}
                </h3>
                <span className="h-px flex-1 bg-gradient-to-r from-white/15 to-transparent" />
              </div>

              <motion.div
                variants={containerVariants}
                className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
              >
                {category.skills.map((skill, index) => (
                  <SkillCard key={skill.name} {...skill} index={index} />
                ))}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}