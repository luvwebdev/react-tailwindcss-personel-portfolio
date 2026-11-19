import { useId, useRef, useState } from "react";
import {
  LuChevronDown as ChevronDown,
  LuChevronUp as ChevronUp,
  LuLoaderCircle as LoaderCircle,
  LuPlus as Plus,
  LuTrash2 as Trash2,
  LuUpload as Upload,
} from "react-icons/lu";

export const Label = ({ htmlFor, children, hint }) => (
  <label htmlFor={htmlFor} className="mb-1.5 flex items-baseline justify-between gap-3 text-xs font-medium uppercase tracking-wider text-mute">
    <span>{children}</span>
    {hint && <span className="normal-case tracking-normal text-[11px] text-[#6d6963]">{hint}</span>}
  </label>
);

export const Text = ({ label, value, onChange, hint, type = "text", placeholder, className = "" }) => {
  const id = useId();
  return (
    <div className={className}>
      <Label htmlFor={id} hint={hint}>{label}</Label>
      <input id={id} type={type} className="field" value={value ?? ""} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
};

export const Area = ({ label, value, onChange, hint, rows = 4, placeholder, className = "" }) => {
  const id = useId();
  return (
    <div className={className}>
      <Label htmlFor={id} hint={hint}>{label}</Label>
      <textarea id={id} rows={rows} className="field resize-y leading-relaxed" value={value ?? ""} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
};

/** One item per line. Empty lines are stripped on save. */
export const Lines = ({ value = [], onChange, ...rest }) => (
  <Area {...rest} hint={rest.hint ?? "One per line"} value={value.join("\n")} onChange={(v) => onChange(v.split("\n"))} />
);

/** Comma-separated list. Items are trimmed on save. */
export const Tags = ({ value = [], onChange, ...rest }) => (
  <Text {...rest} hint={rest.hint ?? "Comma separated"} value={value.join(",")} onChange={(v) => onChange(v.split(","))} />
);

export const Toggle = ({ label, checked, onChange, hint }) => (
  <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-line bg-ink px-4 py-3">
    <span>
      <span className="block text-sm">{label}</span>
      {hint && <span className="block text-xs text-mute">{hint}</span>}
    </span>
    <span className="relative">
      <input type="checkbox" className="peer sr-only" checked={!!checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="block h-6 w-11 rounded-full bg-ink-3 ring-1 ring-line transition-colors peer-checked:bg-crimson" />
      <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-bone transition-transform peer-checked:translate-x-5" />
    </span>
  </label>
);

export const Color = ({ label, value, onChange }) => {
  const id = useId();
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <div className="flex items-center gap-2">
        <input id={id} type="color" value={value || "#000000"} onChange={(e) => onChange(e.target.value)} className="h-10 w-12 cursor-pointer rounded-lg border border-line bg-ink p-1" />
        <input className="field font-mono" value={value ?? ""} onChange={(e) => onChange(e.target.value)} />
      </div>
    </div>
  );
};

export async function uploadFile(file) {
  const res = await fetch(`/__admin/upload?name=${encodeURIComponent(file.name)}`, { method: "POST", body: file });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Upload failed");
  return json.url;
}

/** URL field with an upload button and a small preview. */
export const FileField = ({ label, value, onChange, accept = "image/*", hint, preview = "image" }) => {
  const id = useId();
  const input = useRef(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const pick = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      onChange(await uploadFile(file));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <Label htmlFor={id} hint={hint}>{label}</Label>
      <div className="flex gap-3">
        {preview === "image" && (
          <div className="grid h-[42px] w-[42px] shrink-0 place-items-center overflow-hidden rounded-lg border border-line bg-ink-3">
            {value ? <img src={value} alt="" className="h-full w-full object-cover" /> : <span className="text-[10px] text-mute">none</span>}
          </div>
        )}
        <input id={id} className="field" value={value ?? ""} placeholder="/uploads/… or https://…" onChange={(e) => onChange(e.target.value)} />
        <button type="button" onClick={() => input.current?.click()} disabled={busy} className="flex shrink-0 items-center gap-2 rounded-lg border border-line px-3 text-sm hover:border-bone disabled:opacity-50">
          {busy ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          Upload
        </button>
        <input ref={input} type="file" accept={accept} className="hidden" onChange={pick} />
      </div>
      {error && <p className="mt-1 text-xs text-crimson">{error}</p>}
    </div>
  );
};

/** Generic list-of-objects editor with add / remove / reorder. */
export const ListEditor = ({ items, onChange, make, title, render, addLabel = "Add" }) => {
  const [openSet, setOpenSet] = useState(() => new Set(items.length <= 2 ? items.map((_, i) => i) : []));
  const setOpen = (i, isOpen) =>
    setOpenSet((prev) => {
      if (prev.has(i) === isOpen) return prev;
      const next = new Set(prev);
      if (isOpen) next.add(i);
      else next.delete(i);
      return next;
    });
  const update = (i, next) => onChange(items.map((it, j) => (j === i ? next : it)));
  const move = (i, d) => {
    const j = i + d;
    if (j < 0 || j >= items.length) return;
    const copy = [...items];
    [copy[i], copy[j]] = [copy[j], copy[i]];
    onChange(copy);
  };
  const remove = (i) => {
    if (window.confirm(`Remove "${title(items[i], i) || "this item"}"?`)) onChange(items.filter((_, j) => j !== i));
  };

  return (
    <div className="space-y-4">
      {items.map((item, i) => (
        <details key={i} open={openSet.has(i)} onToggle={(e) => setOpen(i, e.currentTarget.open)} className="group rounded-2xl border border-line bg-ink-2 open:pb-5">
          <summary className="flex cursor-pointer list-none items-center gap-3 px-5 py-4">
            <span className="font-mono text-xs text-crimson">{String(i + 1).padStart(2, "0")}</span>
            <span className="flex-1 truncate font-medium">{title(item, i) || <span className="text-mute">Untitled</span>}</span>
            <span className="flex items-center gap-1" onClick={(e) => e.preventDefault()}>
              <IconBtn label="Move up" onClick={() => move(i, -1)} disabled={i === 0}><ChevronUp className="h-4 w-4" /></IconBtn>
              <IconBtn label="Move down" onClick={() => move(i, 1)} disabled={i === items.length - 1}><ChevronDown className="h-4 w-4" /></IconBtn>
              <IconBtn label="Remove" onClick={() => remove(i)} danger><Trash2 className="h-4 w-4" /></IconBtn>
            </span>
          </summary>
          <div className="space-y-4 border-t border-line px-5 pt-5">{render(item, (next) => update(i, next), i)}</div>
        </details>
      ))}
      <button type="button" onClick={() => {
          setOpen(items.length, true);
          onChange([...items, make()]);
        }} className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-line py-4 text-sm text-bone-2 transition-colors hover:border-bone hover:text-bone">
        <Plus className="h-4 w-4" /> {addLabel}
      </button>
    </div>
  );
};

const IconBtn = ({ children, label, onClick, disabled, danger }) => (
  <button
    type="button"
    aria-label={label}
    title={label}
    disabled={disabled}
    onClick={onClick}
    className={`grid h-8 w-8 place-items-center rounded-lg text-mute transition-colors hover:bg-ink-3 disabled:opacity-30 ${danger ? "hover:text-crimson" : "hover:text-bone"}`}
  >
    {children}
  </button>
);

export const Card = ({ title, description, children }) => (
  <section className="rounded-2xl border border-line bg-ink-2 p-5 sm:p-6">
    {title && <h3 className="text-base font-semibold">{title}</h3>}
    {description && <p className="mt-1 text-sm text-mute">{description}</p>}
    <div className={`space-y-4 ${title ? "mt-5" : ""}`}>{children}</div>
  </section>
);

export const Grid = ({ children }) => <div className="grid gap-4 sm:grid-cols-2">{children}</div>;
