import { useEffect, useState } from "react";
import {
  LuArrowUpRight as ArrowUpRight,
  LuMenu as Menu,
  LuX as X,
} from "react-icons/lu";
import { resumeHref } from "../lib/helpers";

const links = [
  { href: "#work", label: "Work" },
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#experience", label: "Experience" },
  { href: "#contact", label: "Contact" },
];

export const useClock = (timeZone) => {
  const fmt = () => {
    try {
      return new Intl.DateTimeFormat("en-GB", { timeZone, hour: "2-digit", minute: "2-digit" }).format(new Date());
    } catch {
      return "";
    }
  };
  const [time, setTime] = useState(fmt);
  useEffect(() => {
    const id = setInterval(() => setTime(fmt()), 15000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeZone]);
  return time;
};

export const Navbar = ({ data }) => {
  const { profile, resume } = data;
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const time = useClock(profile.timezone || "Asia/Kolkata");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled && !open ? "bg-ink/70 backdrop-blur-xl border-b border-line" : "border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-[1400px] items-center justify-between px-4 py-4 sm:px-8">
        <a href="#top" className="group flex items-baseline gap-1 text-xl" onClick={() => setOpen(false)}>
          <span className="display text-3xl italic">{profile.name}</span>
          <span className="h-2 w-2 rounded-full bg-crimson transition-transform duration-500 group-hover:scale-150" />
        </a>

        <ul className="hidden items-center gap-8 text-sm text-bone-2 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="link-u hover:text-bone">
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-5 md:flex">
          {time && (
            <span className="eyebrow">
              IST {time}
            </span>
          )}
          <a href={resumeHref(resume)} target="_blank" rel="noreferrer" className="btn btn-ghost px-4! py-2! text-sm">
            Resume <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>

        <button
          className="relative z-50 -mr-2 p-2 md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      <div
        className={`fixed inset-0 z-40 flex flex-col justify-between bg-ink px-4 pb-10 pt-24 transition-[clip-path] duration-700 ease-out-expo md:hidden ${
          open ? "[clip-path:inset(0_0_0_0)]" : "pointer-events-none [clip-path:inset(0_0_100%_0)]"
        }`}
      >
        <ul className="space-y-1">
          {links.map((l, i) => (
            <li key={l.href} className="border-b border-line">
              <a
                href={l.href}
                onClick={() => setOpen(false)}
                className="flex items-baseline justify-between py-4"
              >
                <span className="display text-5xl">{l.label}</span>
                <span className="eyebrow">0{i + 1}</span>
              </a>
            </li>
          ))}
        </ul>
        <a href={resumeHref(resume)} target="_blank" rel="noreferrer" className="btn btn-primary justify-center">
          View resume <ArrowUpRight className="h-4 w-4" />
        </a>
      </div>
    </header>
  );
};
