import { useState } from "react";
import { LuArrowUpRight as ArrowUpRight, LuExpand as Expand } from "react-icons/lu";
import { Lightbox } from "../components/Lightbox";
import { FiGithub } from "react-icons/fi";
import { pad, prettyUrl } from "../lib/helpers";

export const ProjectVisual = ({ project, large }) => {
  const { logo, color, accent, title, live } = project;
  const image = project.image || project.gallery?.[0]?.src;
  return (
    <div
      className="relative overflow-hidden rounded-[1.5rem] border border-line"
      style={{ background: color || "#151515" }}
    >
      {/* browser chrome */}
      <div className="flex items-center gap-2 border-b border-white/10 bg-black/25 px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
        <span className="ml-3 truncate rounded-full bg-black/30 px-3 py-1 font-mono text-[11px] text-white/60">
          {live ? prettyUrl(live) : project.status || project.title}
        </span>
      </div>

      <div className={`relative ${large && !image ? "aspect-[16/11]" : "aspect-[16/10]"} overflow-hidden`}>
        {image ? (
          <img
            src={image}
            alt={`${title} screenshot`}
            loading="lazy"
            className="h-full w-full object-cover object-top transition-transform duration-[1.4s] ease-out-expo group-hover:scale-[1.04]"
          />
        ) : (
          <>
            {/* decorative grid */}
            <div
              className="absolute inset-0 opacity-[0.12]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)",
                backgroundSize: "48px 48px",
              }}
            />
            <div
              className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full blur-3xl"
              style={{ background: accent || "#e23a2f", opacity: 0.35 }}
            />
            <div className="absolute inset-0 grid place-items-center p-10">
              {logo ? (
                <img
                  src={logo}
                  alt={`${title} logo`}
                  loading="lazy"
                  className="h-28 w-28 rounded-2xl shadow-2xl transition-transform duration-[1.2s] ease-out-expo group-hover:scale-110 group-hover:-rotate-3 sm:h-36 sm:w-36"
                />
              ) : (
                <span className="display text-7xl italic text-white/90 transition-transform duration-[1.2s] ease-out-expo group-hover:scale-110 sm:text-8xl">
                  {title.split(" ")[0]}
                  <span style={{ color: accent }}>.</span>
                </span>
              )}
            </div>
            <span className="absolute bottom-4 left-5 font-mono text-[11px] uppercase tracking-[0.2em] text-white/50">
              {project.tagline}
            </span>
          </>
        )}
      </div>
    </div>
  );
};

/** Main visual + a strip of page screenshots that open in a lightbox. */
const ProjectMedia = ({ project, large }) => {
  const [open, setOpen] = useState(null);
  const gallery = (project.gallery || []).filter((g) => g.src);
  const images = gallery.length ? gallery : project.image ? [{ src: project.image }] : [];
  const cols = { 1: "grid-cols-1", 2: "grid-cols-2", 3: "grid-cols-3", 4: "grid-cols-4" }[images.length] || "grid-cols-5";

  return (
    <>
      {images.length ? (
        <button
          type="button"
          onClick={() => setOpen(0)}
          aria-label={`View ${project.title} screenshots`}
          className="group/media relative block w-full cursor-zoom-in text-left"
        >
          <ProjectVisual project={project} large={large} />
          <span className="pointer-events-none absolute bottom-4 right-4 flex items-center gap-2 rounded-full bg-ink/80 px-3 py-1.5 text-xs opacity-0 backdrop-blur transition-opacity group-hover/media:opacity-100">
            <Expand className="h-3.5 w-3.5" /> View {images.length} {images.length === 1 ? "screen" : "screens"}
          </span>
        </button>
      ) : (
        <ProjectVisual project={project} large={large} />
      )}

      {images.length > 1 && (
        <div className={`mt-3 grid gap-2 ${cols}`}>
          {images.map((img, i) => (
            <button
              key={img.src + i}
              type="button"
              onClick={() => setOpen(i)}
              aria-label={img.caption || `Screenshot ${i + 1}`}
              title={img.caption}
              className="aspect-[16/10] overflow-hidden rounded-lg border border-line opacity-70 transition-all duration-300 hover:-translate-y-0.5 hover:border-bone-2 hover:opacity-100"
            >
              <img src={img.src} alt="" loading="lazy" className="h-full w-full object-cover object-top" />
            </button>
          ))}
        </div>
      )}

      {open !== null && (
        <Lightbox images={images} index={open} onIndex={setOpen} onClose={() => setOpen(null)} title={project.title} />
      )}
    </>
  );
};

const Links = ({ project }) => (
  <div className="flex flex-wrap gap-3">
    {project.live && (
      <a href={project.live} target="_blank" rel="noreferrer" className="btn btn-primary px-5! py-3! text-sm">
        Visit {prettyUrl(project.live)} <ArrowUpRight className="h-4 w-4" />
      </a>
    )}
    {project.github && (
      <a href={project.github} target="_blank" rel="noreferrer" className="btn btn-ghost px-5! py-3! text-sm">
        <FiGithub className="h-4 w-4" /> Source
      </a>
    )}
  </div>
);

const Featured = ({ project, index, flip }) => (
  <article className="group grid items-center gap-10 border-t border-line py-14 lg:grid-cols-12 lg:gap-16 lg:py-20">
    <div className={`reveal lg:col-span-7 ${flip ? "lg:order-2" : ""}`}>
      <ProjectMedia project={project} large />
    </div>
    <div className={`lg:col-span-5 ${flip ? "lg:order-1" : ""}`}>
      <div className="reveal flex items-center gap-4">
        <span className="font-mono text-sm text-crimson">{pad(index + 1)}</span>
        <span className="h-px flex-1 bg-line" />
        {project.status && (
          <span className={`chip ${project.live ? "border-[#4ade80]/40 text-[#4ade80]" : "border-crimson/40 text-crimson"}`}>{project.status}</span>
        )}
        <span className="eyebrow">{project.year}</span>
      </div>
      <h3 className="reveal display mt-6 text-6xl sm:text-7xl" style={{ "--d": "80ms" }}>
        {project.title}
      </h3>
      <p className="reveal mt-2 text-lg italic text-bone-2 [font-family:var(--font-display)]" style={{ "--d": "120ms" }}>
        {project.tagline}
      </p>
      <p className="reveal mt-6 leading-relaxed text-bone-2" style={{ "--d": "160ms" }}>
        {project.description}
      </p>
      <ul className="reveal mt-6 space-y-3 text-sm text-mute" style={{ "--d": "200ms" }}>
        {project.highlights.map((h) => (
          <li key={h} className="flex gap-3">
            <span className="mt-2 h-1 w-3 shrink-0 bg-crimson" />
            <span>{h}</span>
          </li>
        ))}
      </ul>
      <div className="reveal mt-6 flex flex-wrap gap-2" style={{ "--d": "240ms" }}>
        {project.tags.map((t) => (
          <span key={t} className="chip">
            {t}
          </span>
        ))}
      </div>
      {project.role && (
        <p className="reveal eyebrow mt-6" style={{ "--d": "260ms" }}>
          Role — {project.role}
        </p>
      )}
      <div className="reveal mt-8" style={{ "--d": "280ms" }}>
        <Links project={project} />
      </div>
    </div>
  </article>
);

const Card = ({ project, index }) => (
  <article className="group reveal flex flex-col" style={{ "--d": `${(index % 2) * 100}ms` }}>
    <ProjectMedia project={project} />
    <div className="mt-6 flex items-baseline justify-between gap-4">
      <h3 className="display text-4xl">{project.title}</h3>
      <span className="font-mono text-sm text-crimson">{pad(index + 1)}</span>
    </div>
    <p className="mt-3 text-sm leading-relaxed text-bone-2">{project.description}</p>
    <div className="mt-4 flex flex-wrap gap-2">
      {project.tags.map((t) => (
        <span key={t} className="chip">
          {t}
        </span>
      ))}
    </div>
    <div className="mt-6">
      <Links project={project} />
    </div>
  </article>
);

export const Work = ({ projects }) => {
  const featured = projects.filter((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);

  return (
    <section id="work" className="mx-auto max-w-[1400px] px-4 py-28 sm:px-8 sm:py-36">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="reveal eyebrow">Selected work ({pad(projects.length)})</p>
          <h2 className="display mt-4 text-6xl sm:text-8xl">
            <span className="reveal-mask">
              <span>Things I've</span>
            </span>
            <span className="reveal-mask" style={{ "--d": "100ms" }}>
              <span className="italic text-crimson">shipped.</span>
            </span>
          </h2>
        </div>
        <p className="reveal max-w-sm text-bone-2">
          E-commerce storefronts with real payment flows, plus the full-stack builds that got me here.
        </p>
      </div>

      <div className="mt-16">
        {featured.map((p, i) => (
          <Featured key={p.id} project={p} index={i} flip={i % 2 === 1} />
        ))}
      </div>

      {rest.length > 0 && (
        <div className="grid gap-x-10 gap-y-16 border-t border-line pt-16 md:grid-cols-2">
          {rest.map((p, i) => (
            <Card key={p.id} project={p} index={featured.length + i} />
          ))}
        </div>
      )}
    </section>
  );
};
