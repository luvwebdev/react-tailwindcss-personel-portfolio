export const Skills = ({ skills }) => (
  <section id="skills" className="mx-auto max-w-[1400px] px-4 py-28 sm:px-8 sm:py-36">
    <div className="grid gap-10 lg:grid-cols-12">
      <div className="lg:col-span-4">
        <p className="reveal eyebrow">Toolkit</p>
        <h2 className="display mt-4 text-6xl sm:text-7xl">
          <span className="reveal-mask">
            <span>What I</span>
          </span>
          <span className="reveal-mask" style={{ "--d": "100ms" }}>
            <span className="italic text-crimson">work with.</span>
          </span>
        </h2>
      </div>
      <dl className="lg:col-span-8">
        {skills.map((group, i) => (
          <div
            key={group.category}
            className="reveal grid gap-3 border-t border-line py-6 sm:grid-cols-[180px_1fr] sm:gap-8"
            style={{ "--d": `${i * 50}ms` }}
          >
            <dt className="eyebrow pt-1">{group.category}</dt>
            <dd className="flex flex-wrap gap-x-2 gap-y-1 text-2xl sm:text-3xl">
              {group.items.map((item, j) => (
                <span key={item} className="text-bone-2 transition-colors hover:text-crimson">
                  {item}
                  {j < group.items.length - 1 && <span className="ml-2 text-line">/</span>}
                </span>
              ))}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  </section>
);
