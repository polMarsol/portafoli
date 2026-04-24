"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Navbar() {
  const { t } = useLanguage();
  const [isDark, setIsDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsReady(true), 700);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const check = () => {
      const darkSections = document.querySelectorAll("[data-theme='dark']");
      const isAnyDark = Array.from(darkSections).some((section) => {
        const rect = section.getBoundingClientRect();
        return rect.top <= 72 && rect.bottom >= 72;
      });
      setIsDark(isAnyDark);
    };

    window.addEventListener("scroll", check, { passive: true });
    check();
    return () => window.removeEventListener("scroll", check);
  }, []);

  const desktopLinks = [
    { id: "about", label: t("nav.about") },
    { id: "experience", label: t("nav.experience") },
    { id: "projects", label: t("nav.projects") },
    { id: "education", label: t("nav.education") },
    { id: "skills", label: t("nav.skills") },
  ] as const;

  const mobileLinks = [...desktopLinks, { id: "contact", label: t("nav.contact") }] as const;

  const fg = isDark ? "var(--dark-text)" : "var(--light-text)";
  const muted = isDark ? "rgba(245,245,243,0.76)" : "rgba(12,12,11,0.74)";
  const navBg = isDark ? "rgba(12,12,11,0.09)" : "rgba(245,245,243,0.09)";

  const handleNav = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.header
      className="fixed left-0 right-0 top-0 z-50"
      animate={{
        opacity: isReady ? 1 : 0,
        y: isReady ? 0 : -28,
      }}
      transition={{
        duration: 0.65,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      }}
      style={{
        backgroundColor: navBg,
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        pointerEvents: isReady ? "auto" : "none",
      }}
    >
      <nav className="mx-auto flex h-[5.8rem] max-w-[1600px] items-center justify-between px-6 md:h-[6.8rem] md:px-10">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="text-left font-sans text-[1.35rem] font-black uppercase leading-[0.78] tracking-[-0.06em] transition-opacity hover:opacity-70 md:text-[1.8rem]"
          style={{ color: fg }}
        >
          <span className="block">{t("nav.wordmarkTop")}</span>
          <span className="block">{t("nav.wordmarkBottom")}</span>
        </button>

        <div className="hidden flex-1 items-center justify-center gap-6 px-8 lg:flex xl:gap-12">
          {desktopLinks.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => handleNav(id)}
              className="group flex min-h-[44px] items-center gap-3 font-mono text-[0.92rem] uppercase tracking-[0.14em] transition-colors"
              style={{ color: muted }}
            >
              <span className="transition-transform duration-500 ease-out group-hover:-translate-x-1">
                [
              </span>
              <span className="relative block overflow-hidden">
                <span className="block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-full">
                  {label}
                </span>
                <span
                  className="absolute left-0 top-0 block translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0"
                  style={{ color: fg }}
                >
                  {label}
                </span>
              </span>
              <span className="transition-transform duration-500 ease-out group-hover:translate-x-1">
                ]
              </span>
            </button>
          ))}
        </div>

        <div className="hidden lg:block">
          <button
            onClick={() => handleNav("contact")}
            className="group flex min-h-[44px] items-center gap-3 font-sans text-[1rem] font-black uppercase tracking-[0.02em]"
            style={{ color: fg }}
          >
            <span className="relative">
              {t("nav.contact")}
              <span
                className="absolute bottom-[-0.22rem] left-0 h-px w-full origin-left scale-x-100 transition-transform duration-500 ease-out group-hover:scale-x-0"
                style={{ backgroundColor: fg }}
              />
              <span
                className="absolute bottom-[-0.22rem] left-0 h-px w-full origin-left scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100"
                style={{ backgroundColor: fg }}
              />
            </span>
            <span className="transition-transform duration-500 ease-out group-hover:translate-x-1 group-hover:-translate-y-1">
              ↗
            </span>
          </button>
        </div>

        <button
          className="text-sm font-mono uppercase tracking-[0.22em] lg:hidden"
          style={{ color: fg }}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "Close" : "Menu"}
        </button>
      </nav>

      {menuOpen && (
        <div
          className="flex flex-col gap-5 px-6 pb-6 md:px-10 lg:hidden"
          style={{
            backgroundColor: isDark ? "rgba(12,12,11,0.22)" : "rgba(245,245,243,0.22)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
          }}
        >
          {mobileLinks.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => handleNav(id)}
              className="text-left font-mono text-base uppercase tracking-[0.14em]"
              style={{ color: fg }}
            >
              [ {label} ]
            </button>
          ))}
        </div>
      )}
    </motion.header>
  );
}
