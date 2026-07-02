import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiOutlineEnvelope,
  HiOutlinePhone,
  HiOutlineMapPin,
  HiOutlinePaperAirplane,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
} from "react-icons/hi2";
import { FiGithub, FiLinkedin, FiFacebook, FiInstagram } from "react-icons/fi";

// ---------------------------------------------------------
// Contact info on the left panel. Edit these values directly
// to point at your real email, phone, and location.
// ---------------------------------------------------------
const CONTACT_INFO = [
  {
    icon: HiOutlineEnvelope,
    label: "Email",
    value: "[udomban31@gmail.com]",
    href: "mailto:[udomban31@gmail.com]",
  },
  {
    icon: HiOutlinePhone,
    label: "Phone",
    value: "+855 88 3747 046",
    href: "tel:+855883747046",
  },
  {
    icon: HiOutlineMapPin,
    label: "Location",
    value: "Phnom Penh, Cambodia",
    href: "https://maps.google.com/?q=Phnom+Penh",
  },
];

// Social links shown at the bottom of the left panel.
// Same shape as Navbar/Hero so they're easy to keep in sync.
const SOCIALS = [
  { icon: FiGithub, href: "https://github.com/OdomCH", label: "GitHub" },
  { icon: FiFacebook, href: "https://www.facebook.com/share/1CjezxNCu2/?mibextid=wwXIfr", label: "Facebook" },
  { icon: FiInstagram, href: "https://www.instagram.com/den_ie_?igsh=Z3ZrbW05MWt5cThv&utm_source=qr"},
  { icon: HiOutlineEnvelope, href: "mailto:[udomban31@gmail.com]", label: "Email" }
];

// ---------------------------------------------------------
// Validation rules — one function per field. Each returns a
// string (the error message) or null when the value is valid.
// Keeping these as separate named functions means you can
// unit-test them or reuse them outside this component easily.
// ---------------------------------------------------------
const validators = {
  name: (v) =>
    !v.trim()
      ? "Name is required."
      : v.trim().length < 2
      ? "Name must be at least 2 characters."
      : null,

  email: (v) =>
    !v.trim()
      ? "Email is required."
      : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
      ? "Enter a valid email address."
      : null,

  subject: (v) =>
    !v.trim()
      ? "Subject is required."
      : v.trim().length < 3
      ? "Subject must be at least 3 characters."
      : null,

  message: (v) =>
    !v.trim()
      ? "Message is required."
      : v.trim().length < 20
      ? "Message must be at least 20 characters."
      : null,
};

// Validate all fields at once, returns an object with the same
// keys as validators — null values mean that field passed.
function validateAll(fields) {
  return Object.fromEntries(
    Object.keys(validators).map((key) => [key, validators[key](fields[key])])
  );
}

// Entrance variants, same staggered system used across the page.
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

// ---------------------------------------------------------
// InputField — a single labeled input or textarea. Pulled out
// as its own small component so the form JSX below stays flat
// and readable instead of repeating the same wrapper markup
// four times. Accepts the same props regardless of whether
// it renders an <input> or a <textarea>.
// ---------------------------------------------------------
function InputField({ label, id, error, as: Tag = "input", ...rest }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-white/70">
        {label}
      </label>
      <Tag
        id={id}
        name={id}
        className={`w-full rounded-2xl border bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-white/30 backdrop-blur-md outline-none transition-all duration-200 focus:bg-white/[0.07] focus:ring-1 focus:ring-violet-400/60 ${
          error
            ? "border-red-400/60 focus:ring-red-400/50"
            : "border-white/10 focus:border-white/25"
        } ${Tag === "textarea" ? "min-h-[130px] resize-none" : ""}`}
        {...rest}
      />
      {/* Per-field error message fades in under the input */}
      <AnimatePresence>
        {error && (
          <motion.p
            key="error"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-1.5 text-xs font-medium text-red-400"
          >
            <HiOutlineXCircle className="h-3.5 w-3.5 shrink-0" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Contact() {
  // Form field values
  const [fields, setFields] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  // Per-field validation errors. null = no error, string = error message.
  const [errors, setErrors] = useState({
    name: null,
    email: null,
    subject: null,
    message: null,
  });

  // Form submission state: "idle" | "loading" | "success" | "error"
  // These three states drive which UI the right panel shows.
  const [status, setStatus] = useState("idle");

  // Update one field's value and clear its error at the same time
  // so the red border disappears as soon as the user starts fixing
  // the problem, rather than waiting for them to submit again.
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: null }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate everything before touching the network at all.
    const newErrors = validateAll(fields);
    const hasErrors = Object.values(newErrors).some(Boolean);

    if (hasErrors) {
      setErrors(newErrors);
      return;
    }

    setStatus("loading");

    // Replace this timeout with your real API call, e.g.:
    //   await fetch("/api/contact", { method: "POST", body: JSON.stringify(fields) })
    // The try/catch below handles success and network errors.
    try {
      await new Promise((res) => setTimeout(res, 2000)); // simulated delay
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  // Let the user reset and send another message after success/error.
  const handleReset = () => {
    setFields({ name: "", email: "", subject: "", message: "" });
    setErrors({ name: null, email: null, subject: null, message: null });
    setStatus("idle");
  };

  return (
    <section
      id="contact"
      className="relative overflow-hidden px-6 py-24 sm:px-10 lg:px-16"
    >
      {/* Background */}
      <div className="absolute inset-0 -z-20 bg-gradient-to-b from-[#0a0a0f] via-[#0d0b16] to-[#0a0a0f]" />
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-20 bottom-0 h-[420px] w-[420px] rounded-full bg-violet-600/20 blur-[120px]" />
        <div className="absolute -right-16 top-1/4 h-[380px] w-[380px] rounded-full bg-cyan-500/15 blur-[110px]" />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="mx-auto max-w-6xl"
      >
        {/* ---------- SECTION HEADING ---------- */}
        <motion.div variants={itemVariants} className="mb-14 text-center">
          <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-sm font-medium text-white/60 backdrop-blur-md">
            Contact
          </span>
          <h2 className="mt-5 font-display text-4xl font-semibold text-white sm:text-5xl text-center">
            Let's work together
          </h2>
          <p className="mx-auto mt-3 max-w-md inline-flex text-cemter text-white/50">
            Got a project in mind or just want to say hi? My inbox is open.
          </p>
        </motion.div>

        {/* ===========================================================
            TWO-COLUMN GRID
            Left: contact info + socials
            Right: contact form (or success/error state)
            Stacks to one column below the lg breakpoint.
        =========================================================== */}
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-10">
          {/* ==================== LEFT PANEL ==================== */}
          <motion.div variants={itemVariants} className="flex flex-col gap-6">
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl">
              <h3 className="font-display text-xl font-semibold text-white">
                Contact Information
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-white/50">
                Fill in the form or reach out directly through any of
                the channels below.
              </p>

              {/* Contact info rows */}
              <ul className="mt-8 flex flex-col gap-5">
                {CONTACT_INFO.map(({ icon: Icon, label, value, href }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target={href.startsWith("http") ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      className="group flex items-center gap-4"
                    >
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-violet-300 transition-colors duration-300 group-hover:border-violet-400/40 group-hover:bg-violet-500/10 group-hover:text-violet-200">
                        <Icon className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-white/40">
                          {label}
                        </p>
                        <p className="mt-0.5 text-sm font-medium text-white transition-colors group-hover:text-violet-300">
                          {value}
                        </p>
                      </div>
                    </a>
                  </li>
                ))}
              </ul>

              {/* Divider */}
              <div className="my-8 h-px bg-white/[0.08]" />

              {/* Social icons */}
              <div className="flex items-center gap-3">
                {SOCIALS.map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target={href.startsWith("mailto:") ? undefined : "_blank"}
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="cursor-pointer rounded-full border border-white/10 bg-white/[0.03] p-3 text-white/60 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/10 hover:text-white"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Availability badge */}
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 backdrop-blur-xl">
              <span className="relative flex h-3 w-3 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-400" />
              </span>
              <p className="text-sm text-white/70">
                Available for freelance work and collaborations.
              </p>
            </div>
          </motion.div>

          {/* ==================== RIGHT PANEL: FORM ==================== */}
          <motion.div
            variants={itemVariants}
            className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl"
          >
            {/* AnimatePresence handles switching between the three
                states (idle/form, loading overlay, success screen)
                so each can fade in/out without clashing. */}
            <AnimatePresence mode="wait">

              {/* ---- IDLE: the actual form ---- */}
              {status === "idle" && (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  onSubmit={handleSubmit}
                  noValidate
                  className="flex flex-col gap-5"
                >
                  <div className="grid gap-5 sm:grid-cols-2">
                    <InputField
                      label="Your Name"
                      id="name"
                      type="text"
                      placeholder="Odom"
                      value={fields.name}
                      onChange={handleChange}
                      error={errors.name}
                      autoComplete="name"
                    />
                    <InputField
                      label="Email Address"
                      id="email"
                      type="email"
                      placeholder="[email protected]"
                      value={fields.email}
                      onChange={handleChange}
                      error={errors.email}
                      autoComplete="email"
                    />
                  </div>

                  <InputField
                    label="Subject"
                    id="subject"
                    type="text"
                    placeholder="Project inquiry..."
                    value={fields.subject}
                    onChange={handleChange}
                    error={errors.subject}
                  />

                  <InputField
                    label="Message"
                    id="message"
                    as="textarea"
                    placeholder="Tell me about your project..."
                    value={fields.message}
                    onChange={handleChange}
                    error={errors.message}
                  />
  
                  <button
                    type="submit"
                    className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 px-6 py-3.5 text-sm font-medium text-white shadow-[0_4px_24px_rgba(124,58,237,0.4)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_6px_32px_rgba(124,58,237,0.6)]"
                  >
                    <HiOutlinePaperAirplane className="h-4 w-4" />
                    Send Message
                  </button>
                </motion.form>
              )}

              {/* ---- LOADING: spinner overlay ---- */}
              {status === "loading" && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="flex min-h-[380px] flex-col items-center justify-center gap-5"
                >
                  {/* A simple spinning arc using CSS border
                      trick — no extra library needed. The gradient
                      arc spins on top of a faint full circle. */}
                  <div className="relative h-16 w-16">
                    <div className="absolute inset-0 rounded-full border-4 border-white/10" />
                    <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-violet-400" />
                  </div>
                  <p className="text-sm font-medium text-white/60">
                    Sending your message...
                  </p>
                </motion.div>
              )}

              {/* ---- SUCCESS: confirmation screen ---- */}
              {status === "success" && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="flex min-h-[380px] flex-col items-center justify-center gap-5 text-center"
                >
                  {/* Pulsing check icon */}
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="relative flex h-20 w-20 items-center justify-center"
                  >
                    <div className="absolute inset-0 animate-ping rounded-full bg-emerald-400/20" />
                    <div className="relative flex h-full w-full items-center justify-center rounded-full border border-emerald-400/30 bg-emerald-500/10">
                      <HiOutlineCheckCircle className="h-9 w-9 text-emerald-400" />
                    </div>
                  </motion.div>

                  <div>
                    <h3 className="font-display text-2xl font-semibold text-white">
                      Message sent!
                    </h3>
                    <p className="mt-2 text-sm text-white/50">
                      Thanks for reaching out. I'll get back to you as
                      soon as I can.
                    </p>
                  </div>

                  <button
                    onClick={handleReset}
                    className="mt-2 inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/15 bg-white/[0.05] px-5 py-2.5 text-sm font-medium text-white/70 transition-all duration-300 hover:border-white/25 hover:bg-white/[0.08] hover:text-white"
                  >
                    Send another message
                  </button>
                </motion.div>
              )}

              {/* ---- ERROR: network failure fallback ---- */}
              {status === "error" && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="flex min-h-[380px] flex-col items-center justify-center gap-5 text-center"
                >
                  <div className="flex h-20 w-20 items-center justify-center rounded-full border border-red-400/30 bg-red-500/10">
                    <HiOutlineXCircle className="h-9 w-9 text-red-400" />
                  </div>
                  <div>
                    <h3 className="font-display text-2xl font-semibold text-white">
                      Something went wrong
                    </h3>
                    <p className="mt-2 text-sm text-white/50">
                      Couldn't send your message. Please try again or
                      email me directly.
                    </p>
                  </div>
                  <button
                    onClick={handleReset}
                    className="mt-2 inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/15 bg-white/[0.05] px-5 py-2.5 text-sm font-medium text-white/70 transition-all duration-300 hover:border-white/25 hover:bg-white/[0.08] hover:text-white"
                  >
                    Try again
                  </button>
                </motion.div>
              )}

            </AnimatePresence>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}