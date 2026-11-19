import { useState } from "react";
import emailjs from "@emailjs/browser";
import {
  LuArrowUpRight as ArrowUpRight,
  LuCheck as Check,
  LuCopy as Copy,
  LuSend as Send,
} from "react-icons/lu";
import { socialIcon, telHref } from "../lib/helpers";

export const Contact = ({ data }) => {
  const { contact, socials } = data;
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState({ type: null, message: "" });
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(contact.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${contact.email}`;
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: null, message: "" });
    try {
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
      if (!serviceId || !templateId || !publicKey) throw new Error("Contact form is not configured yet — please email me directly.");
      await emailjs.send(serviceId, templateId, form, publicKey);
      setStatus({ type: "success", message: "Message sent — I'll get back to you soon." });
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      setStatus({ type: "error", message: err?.text || err?.message || "Couldn't send. Please email me directly." });
    } finally {
      setLoading(false);
    }
  };

  const input =
    "w-full border-b border-line bg-transparent py-4 text-lg outline-none transition-colors placeholder:text-mute focus:border-crimson";

  return (
    <section id="contact" className="relative overflow-hidden border-t border-line">
      <div className="pointer-events-none absolute -left-40 bottom-0 h-[520px] w-[520px] rounded-full bg-crimson/15 blur-[140px]" />
      <div className="relative mx-auto max-w-[1400px] px-4 py-28 sm:px-8 sm:py-36">
        <p className="reveal eyebrow">Contact</p>
        <h2 className="display mt-4 text-[clamp(4rem,14vw,13rem)]">
          <span className="reveal-mask">
            <span>Let's</span>
          </span>
          <span className="reveal-mask" style={{ "--d": "100ms" }}>
            <span className="italic text-crimson">talk.</span>
          </span>
        </h2>

        <div className="mt-16 grid gap-16 lg:grid-cols-12">
          <div className="space-y-10 lg:col-span-5">
            <div className="reveal">
              <p className="eyebrow">Email</p>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <a href={`mailto:${contact.email}`} className="link-u break-all text-2xl sm:text-3xl">
                  {contact.email}
                </a>
                <button
                  onClick={copyEmail}
                  aria-label="Copy email"
                  className="grid h-9 w-9 place-items-center rounded-full border border-line transition-colors hover:border-bone"
                >
                  {copied ? <Check className="h-4 w-4 text-[#4ade80]" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="reveal grid grid-cols-2 gap-6" style={{ "--d": "80ms" }}>
              <div>
                <p className="eyebrow">Phone</p>
                <a href={telHref(contact.phone)} className="link-u mt-2 inline-block text-lg">
                  {contact.phone}
                </a>
              </div>
              <div>
                <p className="eyebrow">Location</p>
                <p className="mt-2 text-lg">{contact.location}</p>
              </div>
            </div>
            <div className="reveal" style={{ "--d": "160ms" }}>
              <p className="eyebrow">Elsewhere</p>
              <ul className="mt-3">
                {socials.map((s) => {
                  const Icon = socialIcon(s.label);
                  return (
                    <li key={s.label + s.url} className="border-b border-line">
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noreferrer"
                        className="group flex items-center justify-between py-4 text-lg"
                      >
                        <span className="flex items-center gap-3">
                          <Icon className="h-4 w-4 text-mute" /> {s.label}
                        </span>
                        <ArrowUpRight className="h-5 w-5 text-mute transition-all group-hover:rotate-45 group-hover:text-crimson" />
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <form onSubmit={submit} className="reveal space-y-2 lg:col-span-6 lg:col-start-7" style={{ "--d": "120ms" }}>
            <label className="sr-only" htmlFor="c-name">Name</label>
            <input id="c-name" required className={input} placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <label className="sr-only" htmlFor="c-email">Email</label>
            <input id="c-email" type="email" required className={input} placeholder="Your email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <label className="sr-only" htmlFor="c-msg">Message</label>
            <textarea id="c-msg" required rows={5} className={`${input} resize-none`} placeholder="Tell me about your project or role…" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
            <div className="flex flex-wrap items-center gap-4 pt-6">
              <button type="submit" disabled={loading} className="btn btn-primary disabled:opacity-60">
                {loading ? "Sending…" : "Send message"} <Send className="h-4 w-4" />
              </button>
              {status.type && (
                <p role="status" className={`text-sm ${status.type === "success" ? "text-[#4ade80]" : "text-crimson"}`}>
                  {status.message}
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};
