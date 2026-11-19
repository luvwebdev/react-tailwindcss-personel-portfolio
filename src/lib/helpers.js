import { FiGithub, FiLinkedin, FiTwitter, FiInstagram, FiDribbble, FiGlobe, FiYoutube } from "react-icons/fi";

const ICONS = {
  github: FiGithub,
  linkedin: FiLinkedin,
  twitter: FiTwitter,
  x: FiTwitter,
  instagram: FiInstagram,
  dribbble: FiDribbble,
  youtube: FiYoutube,
};

export const socialIcon = (label = "") => ICONS[label.trim().toLowerCase()] || FiGlobe;

export const telHref = (phone = "") => `tel:${phone.replace(/[^\d+]/g, "")}`;

export const prettyUrl = (url = "") => url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

export const pad = (n) => String(n).padStart(2, "0");

/** Where the "Resume" buttons point: an uploaded PDF if chosen, else the generated /resume page. */
export const resumeHref = (resume = {}) =>
  resume.useUploadedPdf && resume.pdf ? resume.pdf : "/resume";
