import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import fs from "fs/promises";
import os from "os";
import { execFile } from "child_process";
import { promisify } from "util";

const run = promisify(execFile);
const PDF_DIR = path.resolve(__dirname, "public/pdf");
const TEMPLATES = ["classic", "modern", "editorial"];
const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
].filter(Boolean);

const findChrome = async () => {
  for (const c of CHROME_CANDIDATES) {
    try {
      await fs.access(c);
      return c;
    } catch {
      /* try next */
    }
  }
  return null;
};

const CONTENT_FILE = path.resolve(__dirname, "src/data/content.json");
const UPLOAD_DIR = path.resolve(__dirname, "public/uploads");
const ALLOWED_EXT = new Set([".png", ".jpg", ".jpeg", ".webp", ".avif", ".svg", ".gif", ".pdf"]);
const MAX_UPLOAD = 8 * 1024 * 1024;

const readBody = (req, limit) =>
  new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on("data", (c) => {
      size += c.length;
      if (size > limit) {
        reject(new Error("Payload too large"));
        req.destroy();
      } else chunks.push(c);
    });
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });

const send = (res, status, body) => {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(body));
};

/**
 * Dev-only API used by /admin. It only exists while `npm run dev` is running,
 * so the deployed site has no write endpoint at all.
 */
const portfolioAdmin = () => ({
  name: "portfolio-admin",
  apply: "serve",
  configureServer(server) {
    server.middlewares.use("/__admin/content", async (req, res) => {
      try {
        if (req.method === "GET") {
          return send(res, 200, JSON.parse(await fs.readFile(CONTENT_FILE, "utf8")));
        }
        if (req.method === "PUT") {
          const data = JSON.parse((await readBody(req, 2 * 1024 * 1024)).toString("utf8"));
          if (!data || typeof data !== "object" || !data.profile) {
            return send(res, 400, { error: "Invalid content" });
          }
          await fs.writeFile(CONTENT_FILE, JSON.stringify(data, null, 2) + "\n");
          return send(res, 200, { ok: true });
        }
        send(res, 405, { error: "Method not allowed" });
      } catch (err) {
        send(res, 500, { error: err.message });
      }
    });

    // Prints /resume with headless Chrome into public/pdf/resume-<template>.pdf
    server.middlewares.use("/__admin/resume-pdf", async (req, res) => {
      if (req.method !== "POST") return send(res, 405, { error: "Method not allowed" });
      const chrome = await findChrome();
      if (!chrome) return send(res, 500, { error: "Google Chrome not found. Set CHROME_PATH to its executable." });
      const base = `http://${req.headers.host}`;
      const profile = await fs.mkdtemp(path.join(os.tmpdir(), "resume-pdf-"));
      try {
        await fs.mkdir(PDF_DIR, { recursive: true });
        const files = [];
        for (const t of TEMPLATES) {
          const out = path.join(PDF_DIR, `resume-${t}.pdf`);
          await run(
            chrome,
            ["--headless", "--disable-gpu", "--no-first-run", "--no-pdf-header-footer", `--user-data-dir=${profile}`,
              `--print-to-pdf=${out}`, "--virtual-time-budget=10000", "--timeout=45000", `${base}/resume?t=${t}`],
            { timeout: 90000 },
          );
          files.push(`/pdf/resume-${t}.pdf`);
        }
        send(res, 200, { ok: true, files });
      } catch (err) {
        send(res, 500, { error: err.message });
      } finally {
        fs.rm(profile, { recursive: true, force: true }).catch(() => {});
      }
    });

    server.middlewares.use("/__admin/upload", async (req, res) => {
      try {
        if (req.method !== "POST") return send(res, 405, { error: "Method not allowed" });
        const url = new URL(req.url, "http://localhost");
        const original = path.basename(url.searchParams.get("name") || "file");
        const ext = path.extname(original).toLowerCase();
        if (!ALLOWED_EXT.has(ext)) return send(res, 400, { error: `File type ${ext || "?"} not allowed` });
        const base = path
          .basename(original, ext)
          .toLowerCase()
          .replace(/[^a-z0-9-_]+/g, "-")
          .replace(/^-+|-+$/g, "")
          .slice(0, 60) || "file";
        const filename = `${base}-${Date.now().toString(36)}${ext}`;
        const body = await readBody(req, MAX_UPLOAD);
        await fs.mkdir(UPLOAD_DIR, { recursive: true });
        await fs.writeFile(path.join(UPLOAD_DIR, filename), body);
        send(res, 200, { url: `/uploads/${filename}` });
      } catch (err) {
        send(res, err.message === "Payload too large" ? 413 : 500, { error: err.message });
      }
    });
  },
});

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), portfolioAdmin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
