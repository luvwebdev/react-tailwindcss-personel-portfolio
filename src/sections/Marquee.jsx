export const Marquee = ({ skills }) => {
  const items = skills.flatMap((s) => s.items).slice(0, 16);
  const row = [...items, ...items];
  return (
    <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-8" aria-label="Technologies I work with">
      <p className="mb-6 text-center text-sm text-mute">Technologies I work with</p>
      <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
          {row.map((item, i) => (
            <span key={i} className="shrink-0 px-8 py-4" aria-hidden={i >= items.length}>
              <span className="text-xl font-semibold text-mute/50 transition-colors duration-300 hover:text-bone-2">{item}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
