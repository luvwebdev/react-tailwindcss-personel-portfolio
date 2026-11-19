import { useEffect } from "react";
import content from "./data/content.json";
import { useReveal } from "./lib/useReveal";
import { Navbar } from "./layout/Navbar";
import { Footer } from "./layout/Footer";
import { Hero } from "./sections/Hero";
import { Marquee } from "./sections/Marquee";
import { Work } from "./sections/Work";
import { About } from "./sections/About";
import { Skills } from "./sections/Skills";
import { Experience } from "./sections/Experience";
import { Contact } from "./sections/Contact";

export default function App({ data = content }) {
  useReveal([data]);

  // The page is lazy-loaded, so the browser's own jump to #section happens too early.
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (id) document.getElementById(id)?.scrollIntoView({ behavior: "instant" });
  }, []);

  return (
    <div className="grain min-h-screen overflow-x-clip">
      <Navbar data={data} />
      <main>
        <Hero data={data} />
        <Marquee skills={data.skills} />
        <Work projects={data.projects} />
        <About about={data.about} profile={data.profile} />
        <Skills skills={data.skills} />
        <Experience experience={data.experience} education={data.education} />
        <Contact data={data} />
      </main>
      <Footer data={data} />
    </div>
  );
}
