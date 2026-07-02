import React from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Timeline from "./components/Timeline";
import Skills from "./components/Skills";
import Project from "./components/Project"
import Contact from "./components/contact";
import Footer from "./components/footer";
import LoadingScreen from "./components/Loadingscreen";
import ScrollProgressBar from "./components/Scrollprogressbar";

// Demo sections so the navbar's scrollspy and smooth-scroll
// links have real targets. Swap these for your actual page
// content — just keep the matching id on each <section>.
function Section({ id, title, subtitle }) {
  return (
    <section
      id={id}
      className="flex min-h-screen flex-col items-center justify-center px-6 text-center"
    >
      <h2 className="font-display text-5xl font-semibold text-white md:text-7xl">
        {title}
      </h2>
      <p className="mt-4 max-w-md text-white/40">{subtitle}</p>
    </section>
  );
}

export default function App() {
  return (
    <div className=" relative min-h-screen bg-[#0a0a0f] font-sans">
      <LoadingScreen />

      <ScrollProgressBar />

      <Navbar />

      <Hero />

      <About />

      <Timeline />

      <Skills />

      <Project />

      <Contact />

      <Footer />
      
    </div>
  );
}