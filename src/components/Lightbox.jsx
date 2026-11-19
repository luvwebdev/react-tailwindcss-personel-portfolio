import { useEffect, useRef } from "react";
import { LuChevronLeft as ChevronLeft, LuChevronRight as ChevronRight, LuX as X } from "react-icons/lu";

/** Full-screen image viewer. Arrow keys / swipe to navigate, Esc to close. */
export const Lightbox = ({ images, index, onIndex, onClose, title }) => {
  const touchX = useRef(null);
  const count = images.length;
  const go = (d) => onIndex((index + d + count) % count);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onIndex((index + 1) % count);
      if (e.key === "ArrowLeft") onIndex((index - 1 + count) % count);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [index, count, onIndex, onClose]);

  const img = images[index];
  if (!img) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${title} screenshots`}
      className="fixed inset-0 z-[70] flex flex-col bg-ink/95 backdrop-blur-md"
      onClick={onClose}
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current == null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
        touchX.current = null;
      }}
    >
      <div className="flex items-center justify-between px-4 py-4 sm:px-8" onClick={(e) => e.stopPropagation()}>
        <p className="text-sm">
          <span className="display text-xl">{title}</span>
          <span className="eyebrow ml-3">
            {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
          </span>
        </p>
        <button onClick={onClose} aria-label="Close" className="grid h-10 w-10 place-items-center rounded-full border border-line hover:border-bone">
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 sm:px-20">
        <img
          key={img.src}
          src={img.src}
          alt={img.caption || `${title} screenshot ${index + 1}`}
          onClick={(e) => e.stopPropagation()}
          className="max-h-full max-w-full rounded-xl border border-line object-contain shadow-2xl"
        />
        {count > 1 && (
          <>
            <button
              aria-label="Previous"
              onClick={(e) => { e.stopPropagation(); go(-1); }}
              className="absolute left-2 top-1/2 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-line bg-ink/60 hover:border-bone sm:grid sm:left-6"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              aria-label="Next"
              onClick={(e) => { e.stopPropagation(); go(1); }}
              className="absolute right-2 top-1/2 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-line bg-ink/60 hover:border-bone sm:grid sm:right-6"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      <div className="px-4 py-4 sm:px-8" onClick={(e) => e.stopPropagation()}>
        {img.caption && <p className="mb-3 text-center text-sm text-bone-2">{img.caption}</p>}
        <div className="mx-auto flex max-w-full justify-center gap-2 overflow-x-auto">
          {images.map((im, i) => (
            <button
              key={im.src + i}
              onClick={() => onIndex(i)}
              aria-label={`Show screenshot ${i + 1}`}
              className={`h-12 w-20 shrink-0 overflow-hidden rounded-md border transition-opacity ${i === index ? "border-crimson opacity-100" : "border-line opacity-50 hover:opacity-100"}`}
            >
              <img src={im.src} alt="" className="h-full w-full object-cover object-top" loading="lazy" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
