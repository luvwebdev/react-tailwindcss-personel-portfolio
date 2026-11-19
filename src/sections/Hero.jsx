import {
  LuArrowDown as ArrowDown,
  LuArrowUpRight as ArrowUpRight,
} from "react-icons/lu";
import { resumeHref } from "../lib/helpers";

const RotatingBadge = ({ text }) => {
  const label = `${text} • `;
  return (
    <a
      href="#contact"
      aria-label="Get in touch"
      className="group relative grid h-28 w-28 place-items-center rounded-full bg-crimson text-bone shadow-[0_20px_60px_-15px_rgba(226,58,47,0.6)] sm:h-32 sm:w-32"
    >
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full animate-spin-slow" aria-hidden="true">
        <defs>
          <path id="circle" d="M50,50 m-37,0 a37,37 0 1,1 74,0 a37,37 0 1,1 -74,0" />
        </defs>
        <text fontSize="8.6" fontFamily="JetBrains Mono, monospace" fill="currentColor">
          <textPath href="#circle" textLength="228" lengthAdjust="spacing">
            {label.toUpperCase()}
          </textPath>
        </text>
      </svg>
      <ArrowUpRight className="h-7 w-7 transition-transform duration-500 group-hover:rotate-45" />
    </a>
  );
};

export const Hero = ({ data }) => {
  const { profile, stats, resume } = data;
  const [l1, l2, l3] = profile.headline;

  return (
    <section id="top" className="relative flex min-h-[100svh] flex-col overflow-hidden pt-24">
      {/* soft crimson glow behind the portrait */}
      <div className="pointer-events-none absolute -right-40 top-10 h-[620px] w-[620px] rounded-full bg-crimson/20 blur-[140px]" />

      <div className="relative mx-auto grid w-full max-w-[1400px] flex-1 grid-cols-12 gap-x-6 px-4 sm:px-8">
        {/* Meta row */}
        <div className="col-span-12 flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4 reveal">
          <span className="eyebrow">
            {[profile.role, profile.subtitle].filter(Boolean).join(" — ")}
          </span>
          <span className="eyebrow flex items-center gap-2">
            {profile.available && <span className="h-1.5 w-1.5 rounded-full bg-[#4ade80] shadow-[0_0_10px_#4ade80]" />}
            {profile.available ? profile.availabilityText : profile.location}
          </span>
        </div>

        {/* Headline */}
        <div className="relative z-10 col-span-12 pt-10 sm:pt-14 lg:col-span-8 lg:pt-20">
          <h1 className="display text-[clamp(3.4rem,10.5vw,10.5rem)]">
            <span className="reveal-mask">
              <span>{l1}</span>
            </span>
            <span className="reveal-mask" style={{ "--d": "120ms" }}>
              <span className="italic text-crimson">{l2}</span>
            </span>
            <span className="reveal-mask" style={{ "--d": "240ms" }}>
              <span>{l3}</span>
            </span>
          </h1>

          <div className="mt-10 grid gap-8 sm:grid-cols-[1fr_auto] sm:items-end lg:mt-14">
            <div className="reveal max-w-xl" style={{ "--d": "400ms" }}>
              <p className="text-lg leading-relaxed text-bone-2">
                Hi, I'm <span className="text-bone">{profile.name}</span>. {profile.intro}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#work" className="btn btn-primary">
                  See selected work <ArrowDown className="h-4 w-4" />
                </a>
                <a href={resumeHref(resume)} target="_blank" rel="noreferrer" className="btn btn-ghost">
                  Resume <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
            </div>
            <div className="reveal hidden sm:block lg:hidden" style={{ "--d": "500ms" }}>
              <RotatingBadge text={profile.available ? "Available for work" : "Say hello"} />
            </div>
          </div>
        </div>

        {/* Portrait */}
        <div className="relative col-span-12 mt-14 lg:col-span-4 lg:mt-0 lg:pt-20">
          <div className="reveal relative mx-auto max-w-sm lg:max-w-none" style={{ "--d": "300ms" }}>
            <div className="relative overflow-hidden rounded-[2rem] bg-ink-2">
              <img
                src={profile.photo}
                alt={`Portrait of ${profile.name}`}
                className="aspect-[4/5] w-full object-cover"
                fetchPriority="high"
              />
              <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-ink via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5">
                <div>
                  <p className="eyebrow text-bone-2">Based in</p>
                  <p className="text-sm">{profile.location}</p>
                </div>
                <span className="eyebrow text-bone-2">©2026</span>
              </div>
            </div>
            <div className="absolute -left-6 -top-6 hidden lg:block">
              <RotatingBadge text={profile.available ? "Available for work" : "Say hello"} />
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="relative mx-auto mt-16 w-full max-w-[1400px] px-4 sm:px-8">
        <dl className="grid grid-cols-3 border-t border-line">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={`reveal py-6 ${i > 0 ? "border-l border-line pl-4 sm:pl-8" : ""}`}
              style={{ "--d": `${i * 100}ms` }}
            >
              <dt className="eyebrow">{s.label}</dt>
              <dd className="display mt-2 text-5xl sm:text-6xl">
                {s.value}
                <span className="text-crimson">.</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
};
