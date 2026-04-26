"use client";

import { useState, FormEvent, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import StickySection from "./StickySection";
import { Mail, Phone, Send } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/icons/SocialIcons";
import { useGroupedReveal } from "@/lib/reveal";

const FORMSPREE_ID = "xaqakrgd";

export default function Contact() {
  const { t } = useLanguage();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const contentRef = useRef<HTMLDivElement>(null);

  useGroupedReveal(contentRef);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(form),
      });
      setStatus(response.ok ? "success" : "error");
      if (response.ok) setForm({ name: "", email: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  const inputBase =
    "w-full bg-transparent px-0 py-3 text-sm border-0 border-b outline-none transition-colors font-mono placeholder:opacity-40";
  const inputStyle = {
    color: "var(--dark-text)",
    borderColor: "var(--border-dark)",
    caretColor: "var(--dark-text)",
  };

  const links = [
    { icon: <Mail size={14} />, label: "marsoltorraspol@gmail.com", href: "mailto:marsoltorraspol@gmail.com" },
    { icon: <Phone size={14} />, label: "+34 644 603 095", href: "tel:+34644603095" },
    { icon: <GithubIcon size={14} />, label: "github.com/polMarsol", href: "https://github.com/polMarsol" },
    { icon: <LinkedinIcon size={14} />, label: "linkedin.com/in/pol-marsol", href: "https://linkedin.com/in/pol-marsol" },
  ];

  return (
    <StickySection id="contact" number="06" title={t("contact.title")} dark titleVariant="clip">
      <div ref={contentRef} className="grid max-w-5xl gap-14 md:grid-cols-5 md:gap-20">
        <div className="md:col-span-2">
          <p
            className="mb-8 text-base leading-relaxed"
            style={{ color: "var(--muted-on-dark)" }}
            data-text-reveal
          >
            {t("contact.subtitle")}
          </p>
          <p
            className="mb-8 text-xs font-mono"
            style={{ color: "var(--muted-on-dark)" }}
            data-text-reveal
          >
            {t("contact.response")}
          </p>
          <div className="space-y-5">
            {links.map((link, index) => (
              <a
                key={index}
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="flex items-center gap-3 text-sm font-mono transition-opacity hover:opacity-60"
                style={{ color: "var(--dark-text)" }}
                data-text-reveal
              >
                <span style={{ color: "var(--muted-on-dark)" }}>{link.icon}</span>
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <div className="md:col-span-3">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid gap-8 sm:grid-cols-2">
              <div data-text-reveal>
                <label
                  className="mb-2 block text-xs font-mono uppercase tracking-widest"
                  style={{ color: "var(--muted-on-dark)" }}
                >
                  {t("contact.name_label")}
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder={t("contact.name_placeholder")}
                  className={inputBase}
                  style={inputStyle}
                />
              </div>
              <div data-text-reveal>
                <label
                  className="mb-2 block text-xs font-mono uppercase tracking-widest"
                  style={{ color: "var(--muted-on-dark)" }}
                >
                  {t("contact.email_label")}
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder={t("contact.email_placeholder")}
                  className={inputBase}
                  style={inputStyle}
                />
              </div>
            </div>

            <div data-text-reveal>
              <label
                className="mb-2 block text-xs font-mono uppercase tracking-widest"
                style={{ color: "var(--muted-on-dark)" }}
              >
                {t("contact.message_label")}
              </label>
              <textarea
                required
                rows={4}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder={t("contact.message_placeholder")}
                className={`${inputBase} resize-none`}
                style={inputStyle}
              />
            </div>

            {status === "success" && (
              <p className="text-sm font-mono" style={{ color: "var(--muted-on-dark)" }} data-text-reveal>
                {t("contact.success")}
              </p>
            )}
            {status === "error" && (
              <p className="text-sm font-mono" style={{ color: "var(--muted-on-dark)" }} data-text-reveal>
                {t("contact.error")}
              </p>
            )}

            <button
              type="submit"
              disabled={status === "sending" || status === "success"}
              className="flex items-center gap-2 border px-6 py-3 text-sm font-mono uppercase tracking-widest transition-all hover:opacity-60 disabled:opacity-40"
              style={{ color: "var(--dark-text)", borderColor: "var(--border-dark)" }}
              data-text-reveal
            >
              <Send size={12} />
              {status === "sending" ? t("contact.sending") : t("contact.send")}
            </button>
          </form>
        </div>
      </div>
    </StickySection>
  );
}
