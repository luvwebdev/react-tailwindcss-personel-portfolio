import { useLayoutEffect, useRef, useState } from "react";

const A4_PX = 794; // 210mm at 96dpi

/** Shrinks an A4 page to fit its container on screen; print CSS removes the scaling. */
export const ScaledPage = ({ children, max = 1 }) => {
  const wrap = useRef(null);
  const inner = useRef(null);
  const [scale, setScale] = useState(1);
  const [height, setHeight] = useState(1123);

  useLayoutEffect(() => {
    const measure = () => {
      if (!wrap.current || !inner.current) return;
      const s = Math.min(max, wrap.current.clientWidth / A4_PX);
      setScale(s);
      setHeight(inner.current.offsetHeight * s);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(wrap.current);
    ro.observe(inner.current);
    return () => ro.disconnect();
  }, [max]);

  return (
    <div ref={wrap} className="print-reset w-full" style={{ height }}>
      <div
        ref={inner}
        className="print-reset mx-auto w-[210mm] origin-top-left shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]"
        style={{ transform: `scale(${scale})`, marginLeft: scale < 1 ? 0 : undefined }}
      >
        {children}
      </div>
    </div>
  );
};
