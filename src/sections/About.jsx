import { pad } from "../lib/helpers";

export const About = ({ about }) => (
  <section id="about" className="border-t border-line bg-ink-2">
    <div className="mx-auto grid max-w-[1400px] gap-14 px-4 py-28 sm:px-8 sm:py-36 lg:grid-cols-12">
      <div className="lg:col-span-5">
        <p className="reveal eyebrow">About</p>
        <h2 className="reveal display mt-4 text-5xl sm:text-7xl" style={{ "--d": "80ms" }}>
          {about.heading}
        </h2>
      </div>
      <div className="lg:col-span-6 lg:col-start-7">
        <div className="space-y-5 text-lg leading-relaxed text-bone-2">
          {about.paragraphs.map((p, i) => (
            <p key={i} className="reveal" style={{ "--d": `${i * 80}ms` }}>
              {p}
            </p>
          ))}
        </div>
        {about.mission && (
          <blockquote className="reveal mt-10 border-l-2 border-crimson pl-6">
            <p className="display text-3xl italic leading-tight sm:text-4xl">“{about.mission}”</p>
          </blockquote>
        )}
        <ol className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
          {about.highlights.map((h, i) => (
            <li key={h.title} className="reveal bg-ink-2 p-6" style={{ "--d": `${i * 80}ms` }}>
              <span className="font-mono text-xs text-crimson">{pad(i + 1)}</span>
              <h3 className="mt-3 text-lg font-medium">{h.title}</h3>
              <p className="mt-1 text-sm text-mute">{h.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  </section>
);
