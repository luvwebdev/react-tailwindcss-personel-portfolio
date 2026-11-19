const Row = ({ period, title, subtitle, current, children, tags = [], i }) => (
  <article
    className="reveal group grid gap-4 border-t border-line py-10 md:grid-cols-12 md:gap-8"
    style={{ "--d": `${i * 80}ms` }}
  >
    <div className="md:col-span-3">
      <p className="font-mono text-sm text-bone-2">{period}</p>
      {current && (
        <span className="mt-2 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-[#4ade80]">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#4ade80]" /> Current
        </span>
      )}
    </div>
    <div className="md:col-span-4">
      <h3 className="display text-4xl transition-colors group-hover:text-crimson">{title}</h3>
      <p className="mt-1 text-mute">{subtitle}</p>
    </div>
    <div className="md:col-span-5">
      {children}
      {tags.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {tags.map((t) => (
            <span key={t} className="chip">
              {t}
            </span>
          ))}
        </div>
      )}
    </div>
  </article>
);

export const Experience = ({ experience, education }) => (
  <section id="experience" className="border-t border-line bg-ink-2">
    <div className="mx-auto max-w-[1400px] px-4 py-28 sm:px-8 sm:py-36">
      <p className="reveal eyebrow">Experience</p>
      <h2 className="display mt-4 text-6xl sm:text-8xl">
        <span className="reveal-mask">
          <span>Where I've</span>
        </span>
        <span className="reveal-mask" style={{ "--d": "100ms" }}>
          <span className="italic text-crimson">been building.</span>
        </span>
      </h2>

      <div className="mt-16">
        {experience.map((e, i) => (
          <Row key={e.role + e.period} i={i} period={e.period} title={e.role} subtitle={e.company} current={e.current} tags={e.technologies}>
            <ul className="space-y-2 text-bone-2">
              {e.bullets.map((b) => (
                <li key={b} className="flex gap-3">
                  <span className="mt-2.5 h-1 w-3 shrink-0 bg-crimson" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </Row>
        ))}
      </div>

      {education.length > 0 && (
        <>
          <p className="reveal eyebrow mt-24">Education</p>
          <div className="mt-6">
            {education.map((ed, i) => (
              <Row key={ed.degree} i={i} period={ed.period} title={ed.degree} subtitle={ed.school} current={ed.current}>
                {ed.details && <p className="text-bone-2">{ed.details}</p>}
              </Row>
            ))}
          </div>
        </>
      )}
    </div>
  </section>
);
