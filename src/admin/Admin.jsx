import { useCallback, useEffect, useMemo, useState } from "react";
import {
  LuBriefcase as Briefcase,
  LuCheck as Check,
  LuDownload as Download,
  LuExternalLink as ExternalLink,
  LuFileText as FileText,
  LuFolderKanban as FolderKanban,
  LuGraduationCap as GraduationCap,
  LuLoaderCircle as LoaderCircle,
  LuMail as Mail,
  LuPrinter as Printer,
  LuRotateCcw as RotateCcw,
  LuSave as Save,
  LuSparkles as Sparkles,
  LuUpload as Upload,
  LuUser as User,
  LuWrench as Wrench,
} from "react-icons/lu";
import { Area, Card, Color, FileField, Grid, Lines, ListEditor, Tags, Text, Toggle } from "./fields";
import { TEMPLATES } from "../resume/templates";
import { ScaledPage } from "../resume/ScaledPage";

const TABS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "contact", label: "Contact & socials", icon: Mail },
  { id: "about", label: "About & stats", icon: Sparkles },
  { id: "projects", label: "Projects", icon: FolderKanban },
  { id: "skills", label: "Skills", icon: Wrench },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "resume", label: "Resume", icon: FileText },
  { id: "backup", label: "Backup", icon: Download },
];

/** Trim strings inside string arrays and drop empty entries before saving. */
const clean = (v) => {
  if (Array.isArray(v)) {
    if (v.every((x) => typeof x === "string")) return v.map((x) => x.trim()).filter(Boolean);
    return v.map(clean);
  }
  if (v && typeof v === "object") return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, clean(x)]));
  return v;
};

const slug = (s = "") => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const readTab = () => {
  try {
    return sessionStorage.getItem("admin-tab") || "profile";
  } catch {
    return "profile";
  }
};

export default function Admin() {
  const [saved, setSaved] = useState(null);
  const [data, setData] = useState(null);
  const [tab, setTabState] = useState(readTab);
  const [state, setState] = useState("loading"); // loading | ready | unavailable | saving | error
  const [message, setMessage] = useState("");

  const setTab = (t) => {
    setTabState(t);
    try { sessionStorage.setItem("admin-tab", t); } catch { /* ignore */ }
    window.scrollTo({ top: 0 });
  };

  useEffect(() => {
    document.title = "Admin — Portfolio";
    fetch("/__admin/content")
      .then((r) => {
        if (!r.ok || !r.headers.get("content-type")?.includes("json")) throw new Error("unavailable");
        return r.json();
      })
      .then((json) => {
        setSaved(json);
        setData(json);
        setState("ready");
      })
      .catch(() => setState("unavailable"));
  }, []);

  const dirty = useMemo(() => data && saved && JSON.stringify(clean(data)) !== JSON.stringify(saved), [data, saved]);

  const save = useCallback(async () => {
    if (!data) return;
    setState("saving");
    const next = clean(data);
    next.projects = next.projects.map((p) => ({ ...p, id: p.id || slug(p.title) || `project-${Date.now()}` }));
    try {
      const res = await fetch("/__admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(next),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Save failed");
      setSaved(next);
      setData(next);
      setState("ready");
      setMessage("Saved to src/data/content.json");
      setTimeout(() => setMessage(""), 2500);
    } catch (err) {
      setState("ready");
      setMessage(`Error: ${err.message}`);
    }
  }, [data]);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        save();
      }
    };
    const onLeave = (e) => {
      if (dirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("beforeunload", onLeave);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("beforeunload", onLeave);
    };
  }, [save, dirty]);

  if (state === "loading") {
    return <div className="grid min-h-screen place-items-center bg-ink"><LoaderCircle className="h-6 w-6 animate-spin text-mute" /></div>;
  }

  if (state === "unavailable") {
    return (
      <div className="grid min-h-screen place-items-center bg-ink px-4">
        <div className="max-w-md text-center">
          <p className="display text-6xl">Admin<span className="text-crimson">.</span></p>
          <p className="mt-4 text-bone-2">
            The editor runs on your computer so the live site has no write access. Start it with:
          </p>
          <pre className="mt-4 rounded-xl border border-line bg-ink-2 p-4 text-left font-mono text-sm">npm run dev{"\n"}# then open http://localhost:5173/admin</pre>
          <p className="mt-4 text-sm text-mute">Save your changes, then commit and push. Vercel redeploys the site automatically.</p>
          <a href="/" className="btn btn-ghost mt-8">Back to portfolio</a>
        </div>
      </div>
    );
  }

  // Path-based setter: set("profile.name", "Luv")
  const set = (path, value) =>
    setData((prev) => {
      const keys = path.split(".");
      const next = structuredClone(prev);
      let o = next;
      keys.slice(0, -1).forEach((k) => (o = o[k]));
      o[keys.at(-1)] = value;
      return next;
    });
  const bind = (path) => ({
    value: path.split(".").reduce((o, k) => o?.[k], data),
    onChange: (v) => set(path, v),
  });

  return (
    <div className="min-h-screen bg-ink text-bone">
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-line bg-ink/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-baseline gap-3">
            <span className="display text-2xl italic">{data.profile.name}<span className="text-crimson">.</span></span>
            <span className="eyebrow hidden sm:inline">Portfolio admin</span>
          </div>
          <div className="flex items-center gap-2">
            {message && <span className={`hidden text-sm sm:inline ${message.startsWith("Error") ? "text-crimson" : "text-[#4ade80]"}`}>{message}</span>}
            {dirty && !message && <span className="hidden text-sm text-mute sm:inline">Unsaved changes</span>}
            <a href="/" target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm hover:border-bone">
              <ExternalLink className="h-4 w-4" /> <span className="hidden sm:inline">View site</span>
            </a>
            <button
              onClick={save}
              disabled={!dirty || state === "saving"}
              className="flex items-center gap-2 rounded-full bg-bone px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-crimson hover:text-bone disabled:cursor-default disabled:opacity-40 disabled:hover:bg-bone disabled:hover:text-ink"
            >
              {state === "saving" ? <LoaderCircle className="h-4 w-4 animate-spin" /> : dirty ? <Save className="h-4 w-4" /> : <Check className="h-4 w-4" />}
              {dirty ? "Save" : "Saved"}
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1400px] gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[220px_1fr] lg:gap-10">
        {/* Nav */}
        <nav className="-mx-4 overflow-x-auto px-4 lg:mx-0 lg:overflow-visible lg:px-0">
          <ul className="flex gap-1 lg:sticky lg:top-24 lg:flex-col">
            {TABS.map((t) => (
              <li key={t.id}>
                <button
                  onClick={() => setTab(t.id)}
                  className={`flex w-full items-center gap-3 whitespace-nowrap rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${
                    tab === t.id ? "bg-ink-3 text-bone" : "text-mute hover:text-bone"
                  }`}
                >
                  <t.icon className={`h-4 w-4 ${tab === t.id ? "text-crimson" : ""}`} />
                  {t.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <main className="min-w-0 space-y-6 pb-24">
          {tab === "profile" && (
            <>
              <Card title="Identity" description="Shown in the hero, navigation and resume header.">
                <Grid>
                  <Text label="Name" {...bind("profile.name")} />
                  <Text label="Role" {...bind("profile.role")} />
                  <Text label="Subtitle" {...bind("profile.subtitle")} />
                  <Text label="Location" {...bind("profile.location")} />
                </Grid>
                <FileField label="Profile photo" hint="Portrait works best (4:5)" {...bind("profile.photo")} />
              </Card>
              <Card title="Hero headline" description="Three lines. The middle line is shown in crimson italics.">
                <div className="grid gap-4 sm:grid-cols-3">
                  {[0, 1, 2].map((i) => (
                    <Text
                      key={i}
                      label={`Line ${i + 1}`}
                      value={data.profile.headline[i]}
                      onChange={(v) => {
                        const h = [...data.profile.headline];
                        h[i] = v;
                        set("profile.headline", h);
                      }}
                    />
                  ))}
                </div>
                <Area label="Intro paragraph" rows={3} {...bind("profile.intro")} />
              </Card>
              <Card title="Availability">
                <Toggle label="Available for work" hint="Shows the green status dot and rotating badge" checked={data.profile.available} onChange={(v) => set("profile.available", v)} />
                <Grid>
                  <Text label="Availability text" {...bind("profile.availabilityText")} />
                  <Text label="Time zone" hint="IANA name" {...bind("profile.timezone")} />
                </Grid>
              </Card>
            </>
          )}

          {tab === "contact" && (
            <>
              <Card title="Contact details" description="Used on the contact section and every resume template.">
                <Grid>
                  <Text label="Email" type="email" {...bind("contact.email")} />
                  <Text label="Phone" {...bind("contact.phone")} />
                </Grid>
                <Text label="Location" {...bind("contact.location")} />
              </Card>
              <Card title="Social links" description="Labels like GitHub, LinkedIn, Instagram, X or Dribbble get matching icons.">
                <ListEditor
                  items={data.socials}
                  onChange={(v) => set("socials", v)}
                  make={() => ({ label: "", url: "", inResume: true })}
                  title={(s) => s.label}
                  addLabel="Add link"
                  render={(s, up) => (
                    <>
                      <Grid>
                        <Text label="Label" value={s.label} onChange={(v) => up({ ...s, label: v })} />
                        <Text label="URL" value={s.url} onChange={(v) => up({ ...s, url: v })} placeholder="https://" />
                      </Grid>
                      <Toggle label="Show on resume" checked={s.inResume !== false} onChange={(v) => up({ ...s, inResume: v })} />
                    </>
                  )}
                />
              </Card>
            </>
          )}

          {tab === "about" && (
            <>
              <Card title="About section">
                <Text label="Heading" {...bind("about.heading")} />
                <Lines label="Paragraphs" hint="One paragraph per line" rows={6} {...bind("about.paragraphs")} />
                <Area label="Mission quote" rows={2} {...bind("about.mission")} />
              </Card>
              <Card title="Highlights" description="The numbered grid under the about text.">
                <ListEditor
                  items={data.about.highlights}
                  onChange={(v) => set("about.highlights", v)}
                  make={() => ({ title: "", description: "" })}
                  title={(h) => h.title}
                  addLabel="Add highlight"
                  render={(h, up) => (
                    <>
                      <Text label="Title" value={h.title} onChange={(v) => up({ ...h, title: v })} />
                      <Text label="Description" value={h.description} onChange={(v) => up({ ...h, description: v })} />
                    </>
                  )}
                />
              </Card>
              <Card title="Stats" description="Large numbers under the hero. Three looks best.">
                <ListEditor
                  items={data.stats}
                  onChange={(v) => set("stats", v)}
                  make={() => ({ value: "", label: "" })}
                  title={(s) => `${s.value} ${s.label}`}
                  addLabel="Add stat"
                  render={(s, up) => (
                    <Grid>
                      <Text label="Value" value={s.value} onChange={(v) => up({ ...s, value: v })} />
                      <Text label="Label" value={s.label} onChange={(v) => up({ ...s, label: v })} />
                    </Grid>
                  )}
                />
              </Card>
            </>
          )}

          {tab === "projects" && (
            <ListEditor
              items={data.projects}
              onChange={(v) => set("projects", v)}
              make={() => ({
                id: "", title: "", tagline: "", description: "", highlights: [], tags: [], image: "", logo: "",
                color: "#151515", accent: "#e23a2f", live: "", github: "", status: "", gallery: [], year: String(new Date().getFullYear()),
                role: "", featured: false, inResume: true,
              })}
              title={(p) => `${p.title}${p.featured ? "  ★" : ""}`}
              addLabel="Add project"
              render={(p, up) => {
                const f = (k) => ({ value: p[k], onChange: (v) => up({ ...p, [k]: v }) });
                return (
                  <>
                    <Grid>
                      <Text label="Title" {...f("title")} />
                      <Text label="Tagline" {...f("tagline")} />
                    </Grid>
                    <Area label="Description" rows={3} {...f("description")} />
                    <Lines label="Highlights" hint="One bullet per line — also used on the resume" rows={4} {...f("highlights")} />
                    <Tags label="Tech stack" {...f("tags")} />
                    <Grid>
                      <Text label="Live URL" placeholder="https://" {...f("live")} />
                      <Text label="GitHub URL" placeholder="https://github.com/…" {...f("github")} />
                      <Text label="Year" {...f("year")} />
                      <Text label="Your role" {...f("role")} />
                      <Text label="Status badge" placeholder="Live, Launching soon…" {...f("status")} />
                    </Grid>
                    <FileField label="Main image" hint="Optional — defaults to the first gallery screen" {...f("image")} />
                    <div>
                      <p className="mb-2 text-xs font-medium uppercase tracking-wider text-mute">Page screenshots (4–5 work best)</p>
                      <ListEditor
                        items={p.gallery || []}
                        onChange={(v) => up({ ...p, gallery: v })}
                        make={() => ({ src: "", caption: "" })}
                        title={(g, i) => g.caption || `Screen ${i + 1}`}
                        addLabel="Add screenshot"
                        render={(g, upG) => (
                          <>
                            <FileField label="Image" value={g.src} onChange={(v) => upG({ ...g, src: v })} />
                            <Text label="Caption" value={g.caption} onChange={(v) => upG({ ...g, caption: v })} />
                          </>
                        )}
                      />
                    </div>
                    <FileField label="Logo" {...f("logo")} />
                    <Grid>
                      <Color label="Panel colour" {...f("color")} />
                      <Color label="Accent colour" {...f("accent")} />
                    </Grid>
                    <Grid>
                      <Toggle label="Featured" hint="Large case-study layout" checked={p.featured} onChange={(v) => up({ ...p, featured: v })} />
                      <Toggle label="Show on resume" checked={p.inResume} onChange={(v) => up({ ...p, inResume: v })} />
                    </Grid>
                  </>
                );
              }}
            />
          )}

          {tab === "skills" && (
            <ListEditor
              items={data.skills}
              onChange={(v) => set("skills", v)}
              make={() => ({ category: "", items: [] })}
              title={(s) => s.category}
              addLabel="Add skill group"
              render={(s, up) => (
                <>
                  <Text label="Category" value={s.category} onChange={(v) => up({ ...s, category: v })} />
                  <Tags label="Skills" value={s.items} onChange={(v) => up({ ...s, items: v })} />
                </>
              )}
            />
          )}

          {tab === "experience" && (
            <ListEditor
              items={data.experience}
              onChange={(v) => set("experience", v)}
              make={() => ({ role: "", company: "", period: "", current: false, bullets: [], technologies: [] })}
              title={(e) => `${e.role}${e.company ? ` — ${e.company}` : ""}`}
              addLabel="Add experience"
              render={(e, up) => {
                const f = (k) => ({ value: e[k], onChange: (v) => up({ ...e, [k]: v }) });
                return (
                  <>
                    <Grid>
                      <Text label="Role" {...f("role")} />
                      <Text label="Company" {...f("company")} />
                      <Text label="Period" placeholder="Jan 2026 – Present" {...f("period")} />
                    </Grid>
                    <Toggle label="Current role" checked={e.current} onChange={(v) => up({ ...e, current: v })} />
                    <Lines label="What you did" rows={5} {...f("bullets")} />
                    <Tags label="Technologies" {...f("technologies")} />
                  </>
                );
              }}
            />
          )}

          {tab === "education" && (
            <ListEditor
              items={data.education}
              onChange={(v) => set("education", v)}
              make={() => ({ degree: "", school: "", period: "", details: "", current: false })}
              title={(e) => e.degree}
              addLabel="Add education"
              render={(e, up) => {
                const f = (k) => ({ value: e[k], onChange: (v) => up({ ...e, [k]: v }) });
                return (
                  <>
                    <Text label="Degree" {...f("degree")} />
                    <Text label="School" {...f("school")} />
                    <Grid>
                      <Text label="Period" {...f("period")} />
                      <Text label="Details" placeholder="CGPA, honours…" {...f("details")} />
                    </Grid>
                    <Toggle label="Currently studying" checked={e.current} onChange={(v) => up({ ...e, current: v })} />
                  </>
                );
              }}
            />
          )}

          {tab === "resume" && <ResumeTab data={data} set={set} bind={bind} dirty={dirty} />}

          {tab === "backup" && <BackupTab data={data} saved={saved} setData={setData} />}
        </main>
      </div>
    </div>
  );
}

function ResumeTab({ data, set, bind, dirty }) {
  const current = data.resume.template;
  const { Component } = TEMPLATES[current] || TEMPLATES.classic;
  return (
    <>
      <Card title="Choose a template" description="All three use the same details. The selected one is what the Resume buttons on your site open.">
        <div className="grid gap-4 sm:grid-cols-3">
          {Object.entries(TEMPLATES).map(([key, t]) => (
            <button
              key={key}
              onClick={() => set("resume.template", key)}
              className={`group overflow-hidden rounded-xl border text-left transition-colors ${key === current ? "border-crimson" : "border-line hover:border-bone-2"}`}
            >
              <div className="pointer-events-none h-56 overflow-hidden bg-ink-3 p-3">
                <ScaledPage>
                  <t.Component data={data} />
                </ScaledPage>
              </div>
              <div className="flex items-start justify-between gap-2 border-t border-line p-3">
                <div>
                  <p className="text-sm font-medium">{t.name}</p>
                  <p className="text-xs text-mute">{t.note}</p>
                </div>
                {key === current && <Check className="h-4 w-4 shrink-0 text-crimson" />}
              </div>
            </button>
          ))}
        </div>
      </Card>

      <Card title="Resume content">
        <Area label="Professional summary" rows={4} {...bind("resume.summary")} />
        <Text label="Portfolio URL" hint="Shown in the resume header once your site is live" placeholder="https://…" {...bind("resume.portfolioUrl")} />
        <p className="text-sm text-mute">
          Contact, skills, experience and education come from their own tabs. Choose which projects appear with the
          <em> Show on resume</em> switch in Projects.
        </p>
      </Card>

      <Card title="Use your own PDF instead" description="Optional. Upload a PDF and the Resume buttons will download it instead of the generated page.">
        <FileField label="Resume PDF" accept="application/pdf" preview="none" {...bind("resume.pdf")} />
        <Toggle label="Use uploaded PDF" checked={data.resume.useUploadedPdf} onChange={(v) => set("resume.useUploadedPdf", v)} />
      </Card>

      <Card title={`Preview — ${TEMPLATES[current]?.name}`}>
        <div className="flex flex-wrap gap-3">
          <a href={`/resume?t=${current}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm hover:border-bone">
            <Printer className="h-4 w-4" /> Open printable page
          </a>
          {dirty && <span className="self-center text-xs text-mute">Save first — the printable page reads saved content.</span>}
        </div>
        <div className="rounded-xl bg-ink-3 p-4 sm:p-8">
          <ScaledPage>
            <Component data={data} />
          </ScaledPage>
        </div>
      </Card>
    </>
  );
}

function BackupTab({ data, saved, setData }) {
  const [error, setError] = useState("");
  const download = () => {
    const blob = new Blob([JSON.stringify(clean(data), null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `portfolio-content-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };
  const importFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      const json = JSON.parse(await file.text());
      if (!json.profile || !Array.isArray(json.projects)) throw new Error("That file doesn't look like portfolio content.");
      setData(json);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };
  return (
    <Card title="Backup & restore" description="Everything lives in src/data/content.json, which is committed with your code.">
      <div className="flex flex-wrap gap-3">
        <button onClick={download} className="flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm hover:border-bone">
          <Download className="h-4 w-4" /> Download JSON
        </button>
        <label className="flex cursor-pointer items-center gap-2 rounded-full border border-line px-4 py-2 text-sm hover:border-bone">
          <Upload className="h-4 w-4" /> Import JSON
          <input type="file" accept="application/json" className="hidden" onChange={importFile} />
        </label>
        <button
          onClick={() => window.confirm("Discard all unsaved changes?") && setData(saved)}
          className="flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm hover:border-crimson hover:text-crimson"
        >
          <RotateCcw className="h-4 w-4" /> Discard unsaved changes
        </button>
      </div>
      {error && <p className="text-sm text-crimson">{error}</p>}
      <div className="rounded-xl border border-line bg-ink p-4 text-sm text-bone-2">
        <p className="font-medium text-bone">Publishing changes</p>
        <ol className="mt-2 list-decimal space-y-1 pl-5">
          <li>Edit here and press <kbd className="rounded bg-ink-3 px-1.5 font-mono text-xs">⌘S</kbd> / Save.</li>
          <li>Check the site at <span className="font-mono">localhost:5173</span>.</li>
          <li>Commit and push — Vercel redeploys automatically.</li>
        </ol>
      </div>
    </Card>
  );
}
