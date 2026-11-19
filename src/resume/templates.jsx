/* Shared, print-safe data shaping for every template. */
const prep = (data) => {
  const { profile, contact, socials, skills, projects, experience, education, resume } = data;
  const links = [
    contact.phone && { text: contact.phone, href: `tel:${contact.phone.replace(/[^\d+]/g, "")}` },
    contact.email && { text: contact.email, href: `mailto:${contact.email}` },
    resume.portfolioUrl && { text: "Portfolio", href: resume.portfolioUrl },
    ...socials.filter((s) => s.inResume !== false).map((s) => ({ text: s.label, href: s.url })),
  ].filter(Boolean);
  return {
    name: profile.name,
    title: [profile.role, profile.subtitle].filter(Boolean).join(" • "),
    location: contact.location || profile.location,
    links,
    summary: resume.summary,
    skills,
    projects: projects.filter((p) => p.inResume),
    experience,
    education,
  };
};

/** A project's link shown as a word ("Live Site" / "GitHub"), not a raw URL. */
const projectLink = (p) =>
  p.live ? { href: p.live, text: "Live Site" } : p.github ? { href: p.github, text: "GitHub" } : null;

const Page = ({ className = "", children, style }) => (
  <div className={`resume-page bg-white text-[#16161a] ${className}`} style={style}>
    {children}
  </div>
);

const Bullets = ({ items, className = "" }) => (
  <ul className={`mt-1 space-y-[2px] ${className}`}>
    {items.map((b) => (
      <li key={b} className="relative pl-3.5 before:absolute before:left-0 before:top-[0.55em] before:h-[3px] before:w-[3px] before:rounded-full before:bg-current">
        {b}
      </li>
    ))}
  </ul>
);

/* ─────────────────────────── 1. Classic (ATS-friendly) ─────────────────────────── */
const ClassicHeading = ({ children }) => (
  <h2 className="mb-1 mt-3 border-b border-[#2b3a55] pb-0.5 font-serif text-[13pt] font-bold text-[#2b3a55]">{children}</h2>
);

export const Classic = ({ data }) => {
  const r = prep(data);
  return (
    <Page className="px-[15mm] py-[11mm] font-[family-name:Georgia,'Times_New_Roman',serif] text-[9.1pt] leading-[1.32]">
      <header className="text-center">
        <h1 className="text-[22pt] font-bold uppercase tracking-[0.06em]">{r.name}</h1>
        <p className="mt-0.5 text-[10.5pt]">{r.title}</p>
        <p className="mt-1 text-[9.2pt]">
          {r.links.map((l, i) => (
            <span key={l.href}>
              {i > 0 && <span className="mx-1.5 text-[#888]">|</span>}
              <a href={l.href} className={l.href.startsWith("http") ? "text-[#2b3a55] underline decoration-[#2b3a55]/30 underline-offset-2" : ""}>
                {l.text}
              </a>
            </span>
          ))}
        </p>
      </header>

      <ClassicHeading>Professional Summary</ClassicHeading>
      <p>{r.summary}</p>

      <ClassicHeading>Technical Skills</ClassicHeading>
      <table className="w-full">
        <tbody>
          {r.skills.map((s) => (
            <tr key={s.category}>
              <td className="w-[28mm] pr-2 align-top font-bold">{s.category}</td>
              <td>{s.items.join(", ")}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <ClassicHeading>Projects</ClassicHeading>
      {r.projects.map((p) => (
        <div key={p.id} className="mb-1.5 break-inside-avoid">
          <div className="flex items-baseline justify-between gap-4">
            <p>
              <b>{p.title}</b>
              {projectLink(p) && (
                <>
                  {" "}— <a href={projectLink(p).href} className="italic text-[#2b3a55] underline decoration-[#2b3a55]/30 underline-offset-2">{projectLink(p).text}</a>
                </>
              )}
            </p>
            <p className="shrink-0 text-[8.6pt]">{p.tags.slice(0, 4).join(" • ")}</p>
          </div>
          <Bullets items={p.highlights} />
        </div>
      ))}

      <ClassicHeading>Technical Experience</ClassicHeading>
      {r.experience.map((e) => (
        <div key={e.role + e.period} className="mb-1.5 break-inside-avoid">
          <div className="flex items-baseline justify-between">
            <p>
              <b>{e.role}</b>
              {e.company && <> — {e.company}</>}
            </p>
            <p className="italic">{e.period}</p>
          </div>
          <Bullets items={e.bullets} />
        </div>
      ))}

      <ClassicHeading>Education</ClassicHeading>
      {r.education.map((ed) => (
        <div key={ed.degree} className="flex items-baseline justify-between">
          <div className="mb-1">
            <p className="font-bold">{ed.degree}</p>
            <p>
              {ed.school}
              {ed.details && <> · {ed.details}</>}
            </p>
          </div>
          <p>{ed.period}</p>
        </div>
      ))}
    </Page>
  );
};

/* ─────────────────────────── 2. Modern (two-column) ─────────────────────────── */
const ModernHeading = ({ children, light }) => (
  <h2
    className={`mb-2 mt-5 flex items-center gap-2 text-[8pt] font-semibold uppercase tracking-[0.18em] first:mt-0 ${
      light ? "text-white/60" : "text-[#e23a2f]"
    }`}
  >
    {children}
    <span className={`h-px flex-1 ${light ? "bg-white/15" : "bg-[#e9e4dc]"}`} />
  </h2>
);

export const Modern = ({ data }) => {
  const r = prep(data);
  return (
    <Page className="grid grid-cols-[66mm_1fr] font-[family-name:Inter_Tight,Inter,Arial,sans-serif] text-[9pt] leading-[1.42]">
      <aside className="bg-[#111114] px-[8mm] py-[12mm] text-white/85">
        <h1 className="font-[family-name:Instrument_Serif,Georgia,serif] text-[38pt] leading-none text-white">
          {r.name}
          <span className="text-[#e23a2f]">.</span>
        </h1>
        <p className="mt-2 text-[9pt] text-white/70">{r.title}</p>

        <ModernHeading light>Contact</ModernHeading>
        <ul className="space-y-1.5 break-all text-[8.4pt]">
          {r.location && <li>{r.location}</li>}
          {r.links.map((l) => (
            <li key={l.href}>
              <a href={l.href}>{l.text}</a>
            </li>
          ))}
        </ul>

        <ModernHeading light>Skills</ModernHeading>
        <div className="space-y-2.5">
          {r.skills.map((s) => (
            <div key={s.category}>
              <p className="text-[7.6pt] uppercase tracking-[0.14em] text-white/45">{s.category}</p>
              <p className="text-[8.4pt]">{s.items.join(" · ")}</p>
            </div>
          ))}
        </div>

        <ModernHeading light>Education</ModernHeading>
        {r.education.map((ed) => (
          <div key={ed.degree} className="text-[8.4pt]">
            <p className="font-semibold text-white">{ed.degree}</p>
            <p>{ed.school}</p>
            <p className="text-white/55">
              {ed.period}
              {ed.details && <> · {ed.details}</>}
            </p>
          </div>
        ))}
      </aside>

      <main className="px-[9mm] py-[12mm]">
        <ModernHeading>Profile</ModernHeading>
        <p className="text-[9.4pt] text-[#33333a]">{r.summary}</p>

        <ModernHeading>Experience</ModernHeading>
        {r.experience.map((e) => (
          <div key={e.role + e.period} className="mb-2 break-inside-avoid">
            <div className="flex items-baseline justify-between gap-3">
              <p className="text-[10.5pt] font-semibold">{e.role}</p>
              <p className="shrink-0 text-[8pt] text-[#8a857d]">{e.period}</p>
            </div>
            {e.company && <p className="text-[8.6pt] text-[#8a857d]">{e.company}</p>}
            <Bullets items={e.bullets} className="text-[#33333a]" />
          </div>
        ))}

        <ModernHeading>Projects</ModernHeading>
        {r.projects.map((p) => (
          <div key={p.id} className="mb-2.5 break-inside-avoid">
            <div className="flex items-baseline justify-between gap-3">
              <p className="text-[10.5pt] font-semibold">
                {p.title}
                <span className="ml-1.5 text-[8.4pt] font-normal text-[#8a857d]">{p.tagline}</span>
              </p>
              {projectLink(p) && (
                <a href={projectLink(p).href} className="shrink-0 text-[8pt] text-[#e23a2f]">
                  {projectLink(p).text} ↗
                </a>
              )}
            </div>
            <Bullets items={p.highlights} className="text-[#33333a]" />
            <p className="mt-0.5 text-[7.8pt] text-[#8a857d]">{p.tags.join(" · ")}</p>
          </div>
        ))}
      </main>
    </Page>
  );
};

/* ─────────────────────────── 3. Editorial (matches the portfolio) ─────────────────────────── */
const Row = ({ label, children }) => (
  <section className="grid grid-cols-[30mm_1fr] gap-[6mm] border-t border-[#e6e1d8] py-[2.2mm]">
    <h2 className="pt-[1px] font-[family-name:JetBrains_Mono,monospace] text-[7pt] uppercase tracking-[0.16em] text-[#8a857d]">{label}</h2>
    <div>{children}</div>
  </section>
);

export const Editorial = ({ data }) => {
  const r = prep(data);
  return (
    <Page className="bg-[#fbf9f5]! px-[14mm] py-[9mm] font-[family-name:Inter_Tight,Inter,Arial,sans-serif] text-[8.5pt] leading-[1.36]">
      <header className="flex items-end justify-between gap-6 pb-[4mm]">
        <div>
          <h1 className="font-[family-name:Instrument_Serif,Georgia,serif] text-[46pt] leading-[0.85] tracking-[-0.02em]">
            {r.name}
            <span className="text-[#e23a2f]">.</span>
          </h1>
          <p className="mt-2 font-[family-name:Instrument_Serif,Georgia,serif] text-[14pt] italic text-[#55524c]">{r.title}</p>
        </div>
        <ul className="text-right text-[8.2pt] leading-[1.6]">
          {r.location && <li>{r.location}</li>}
          {r.links.map((l) => (
            <li key={l.href}>
              <a href={l.href}>{l.text}</a>
            </li>
          ))}
        </ul>
      </header>

      <Row label="Summary">
        <p className="font-[family-name:Instrument_Serif,Georgia,serif] text-[11pt] leading-[1.28]">{r.summary}</p>
      </Row>

      <Row label="Selected work">
        <div className="space-y-[2mm]">
          {r.projects.map((p) => (
            <div key={p.id} className="break-inside-avoid">
              <div className="flex items-baseline justify-between gap-3">
                <p>
                  <span className="text-[10.5pt] font-semibold">{p.title}</span>
                  <span className="text-[#8a857d]"> — {p.tagline}</span>
                </p>
                {projectLink(p) && (
                  <a href={projectLink(p).href} className="shrink-0 font-[family-name:JetBrains_Mono,monospace] text-[7.4pt] text-[#e23a2f]">
                    {projectLink(p).text} ↗
                  </a>
                )}
              </div>
              <Bullets items={p.highlights} className="text-[#3a3833]" />
              <p className="mt-0.5 font-[family-name:JetBrains_Mono,monospace] text-[7pt] text-[#8a857d]">{p.tags.join(" / ")}</p>
            </div>
          ))}
        </div>
      </Row>

      <Row label="Experience">
        {r.experience.map((e) => (
          <div key={e.role + e.period} className="break-inside-avoid">
            <div className="flex items-baseline justify-between">
              <p>
                <span className="text-[10.5pt] font-semibold">{e.role}</span>
                {e.company && <span className="text-[#8a857d]"> — {e.company}</span>}
              </p>
              <p className="font-[family-name:JetBrains_Mono,monospace] text-[7.4pt] text-[#8a857d]">{e.period}</p>
            </div>
            <Bullets items={e.bullets} className="text-[#3a3833]" />
          </div>
        ))}
      </Row>

      <Row label="Skills">
        <div className="grid grid-cols-2 gap-x-[6mm] gap-y-[1.6mm]">
          {r.skills.map((s) => (
            <p key={s.category}>
              <span className="font-semibold">{s.category}: </span>
              <span className="text-[#3a3833]">{s.items.join(", ")}</span>
            </p>
          ))}
        </div>
      </Row>

      <Row label="Education">
        {r.education.map((ed) => (
          <div key={ed.degree} className="flex items-baseline justify-between">
            <p>
              <span className="font-semibold">{ed.degree}</span>
              <span className="text-[#8a857d]"> — {ed.school}</span>
              {ed.details && <span className="text-[#8a857d]"> · {ed.details}</span>}
            </p>
            <p className="shrink-0 font-[family-name:JetBrains_Mono,monospace] text-[7.4pt] text-[#8a857d]">{ed.period}</p>
          </div>
        ))}
      </Row>
    </Page>
  );
};

export const TEMPLATES = {
  classic: { name: "Classic", note: "Single column, ATS-friendly — closest to your current resume", Component: Classic },
  modern: { name: "Modern", note: "Two columns with a dark sidebar and crimson accents", Component: Modern },
  editorial: { name: "Editorial", note: "Serif + mono, matches the new portfolio design", Component: Editorial },
};
