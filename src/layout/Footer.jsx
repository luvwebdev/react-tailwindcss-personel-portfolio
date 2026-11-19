import {
  LuArrowUp as ArrowUp,
} from "react-icons/lu";
import { socialIcon } from "../lib/helpers";

export const Footer = ({ data }) => {
  const { profile, socials, contact } = data;
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-6 px-4 py-10 sm:px-8 md:flex-row md:items-center md:justify-between">
        <div>
          <a href={`mailto:${contact.email}`} className="link-u text-lg">
            {contact.email}
          </a>
          <p className="mt-1 text-sm text-mute">
            © {new Date().getFullYear()} {profile.name}. Designed & built by hand with React.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {socials.map((s) => {
            const Icon = socialIcon(s.label);
            return (
              <a
                key={s.label + s.url}
                href={s.url}
                target="_blank"
                rel="noreferrer"
                aria-label={s.label}
                className="grid h-10 w-10 place-items-center rounded-full border border-line transition-colors hover:border-bone hover:bg-bone hover:text-ink"
              >
                <Icon className="h-4 w-4" />
              </a>
            );
          })}
          <a
            href="#top"
            aria-label="Back to top"
            className="ml-2 grid h-10 w-10 place-items-center rounded-full bg-crimson text-bone transition-transform hover:-translate-y-1"
          >
            <ArrowUp className="h-4 w-4" />
          </a>
        </div>
      </div>
    </footer>
  );
};
