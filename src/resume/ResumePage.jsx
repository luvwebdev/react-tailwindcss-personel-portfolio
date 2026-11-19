import { useEffect, useState } from "react";
import {
  LuArrowLeft as ArrowLeft,
  LuPrinter as Printer,
} from "react-icons/lu";
import content from "../data/content.json";
import { TEMPLATES } from "./templates";
import { ScaledPage } from "./ScaledPage";

export default function ResumePage() {
  const fromQuery = new URLSearchParams(window.location.search).get("t");
  const [key, setKey] = useState(TEMPLATES[fromQuery] ? fromQuery : content.resume.template || "classic");
  const { Component } = TEMPLATES[key] || TEMPLATES.classic;

  useEffect(() => {
    document.title = `${content.profile.name} — Resume`;
  }, []);

  return (
    <div className="min-h-screen bg-ink-3 print:bg-white">
      <div className="no-print sticky top-0 z-10 border-b border-line bg-ink/90 backdrop-blur">
        <div className="mx-auto flex max-w-[900px] flex-wrap items-center justify-between gap-3 px-4 py-3">
          <a href="/" className="flex items-center gap-2 text-sm text-bone-2 hover:text-bone">
            <ArrowLeft className="h-4 w-4" /> Portfolio
          </a>
          <div className="flex rounded-full border border-line p-1 text-sm">
            {Object.entries(TEMPLATES).map(([k, t]) => (
              <button
                key={k}
                onClick={() => setKey(k)}
                className={`rounded-full px-3 py-1.5 transition-colors ${k === key ? "bg-bone text-ink" : "text-bone-2 hover:text-bone"}`}
              >
                {t.name}
              </button>
            ))}
          </div>
          <button onClick={() => window.print()} className="btn btn-primary px-4! py-2! text-sm">
            <Printer className="h-4 w-4" /> Save as PDF
          </button>
        </div>
      </div>
      <div className="print-reset mx-auto max-w-[900px] px-4 py-8 print:p-0">
        <ScaledPage>
          <Component data={content} />
        </ScaledPage>
      </div>
    </div>
  );
}
