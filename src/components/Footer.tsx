"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { GithubIcon, LinkedinIcon } from "@/components/icons/SocialIcons";
import { Mail } from "lucide-react";

export default function Footer() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer
      className="border-t px-8 md:px-16 py-8 flex flex-col sm:flex-row items-center justify-between gap-4"
      style={{ borderColor: "var(--border-dark)", backgroundColor: "var(--dark)" }}
      data-theme="dark"
    >
      <p className="font-display text-xl tracking-widest" style={{ color: "var(--dark-text)" }}>
        PM.
      </p>
      <p className="text-xs font-mono" style={{ color: "var(--muted-on-dark)" }}>
        © {year} Pol Marsol Torras
      </p>
      <div className="flex items-center gap-5">
        {[
          { icon: <GithubIcon size={14} />, href: "https://github.com/polMarsol" },
          { icon: <LinkedinIcon size={14} />, href: "https://linkedin.com/in/pol-marsol" },
          { icon: <Mail size={14} />, href: "mailto:marsoltorraspol@gmail.com" },
        ].map((l, i) => (
          <a
            key={i}
            href={l.href}
            target={l.href.startsWith("http") ? "_blank" : undefined}
            rel={l.href.startsWith("http") ? "noopener noreferrer" : undefined}
            className="transition-opacity hover:opacity-50"
            style={{ color: "var(--muted-on-dark)" }}
          >
            {l.icon}
          </a>
        ))}
      </div>
    </footer>
  );
}
