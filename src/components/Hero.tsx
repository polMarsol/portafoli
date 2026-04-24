"use client";

import { useEffect, useRef } from "react";
import gsap from "@/lib/gsap";
import PMTLogo from "@/components/icons/PMTLogo";
import { GithubIcon, LinkedinIcon } from "@/components/icons/SocialIcons";
import { MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const FALLBACK_HEADLINE = ["SOFTWARE DEVELOPER", "AI MACHINE LEARNING"];

function getOuterWeight(index: number, total: number) {
  if (total <= 1) return 0;
  const center = (total - 1) / 2;
  const distance = Math.abs(index - center);
  return distance / center;
}

export default function Hero() {
  const { t, tArr } = useLanguage();
  const heroRef = useRef<HTMLElement>(null);
  const hasAnimated = useRef(false);
  const headlineLines = tArr("hero.headlineLines");
  const lines = headlineLines.length === 2 ? headlineLines : FALLBACK_HEADLINE;

  useEffect(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;

    const ctx = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const lineElements = gsap.utils.toArray<HTMLElement>("[data-hero-line]");

      if (prefersReducedMotion) {
        lineElements.forEach((line) => {
          gsap.set(line.querySelectorAll(".split-char"), { y: "0%" });
        });
        gsap.set(".hero-fade", { opacity: 1, y: 0 });
        return;
      }

      lineElements.forEach((line, lineIndex) => {
        const chars = Array.from(line.querySelectorAll<HTMLElement>(".split-char"));

        chars.forEach((char, charIndex) => {
          const weight = getOuterWeight(charIndex, chars.length);
          gsap.to(char, {
            y: "0%",
            duration: 1.05 + weight * 0.72,
            ease: "power4.out",
            delay: 0.16 + lineIndex * 0.22 + Math.pow(weight, 1.35) * 0.5,
          });
        });
      });

      gsap.fromTo(
        ".hero-fade",
        { opacity: 0, y: 22 },
        {
          opacity: 1,
          y: 0,
          duration: 1.25,
          ease: "power3.out",
          stagger: 0.12,
          delay: 0.95,
        }
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative flex min-h-dvh flex-col justify-between px-6 pb-10 pt-24 md:px-10 md:pb-12 md:pt-[7rem]"
      style={{ backgroundColor: "var(--light)" }}
      data-theme="light"
    >
      <div className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col justify-center gap-7 pb-6 pt-8 md:gap-8 md:pb-8 md:pt-10">
        <div className="hero-fade" style={{ opacity: 0 }}>
          <PMTLogo
            color="var(--light-text)"
            className="h-auto w-[124px] min-w-[124px] md:w-[168px]"
          />
        </div>

        <div className="flex flex-col gap-1 md:gap-0.5" aria-label={lines.join(" - ")}>
          {lines.map((line) => (
            <div key={line} className="flex flex-wrap" data-hero-line>
              {line.split("").map((char, index) =>
                char === " " ? (
                  <span
                    key={`${line}-${index}`}
                    aria-hidden="true"
                    style={{ display: "inline-block", width: "0.3em" }}
                  />
                ) : (
                  <span
                    key={`${line}-${index}`}
                    className="overflow-hidden"
                    style={{ display: "inline-block" }}
                  >
                    <span
                      className="split-char font-display"
                      style={{
                        display: "block",
                        transform: "translateY(-112%)",
                        fontSize: "clamp(3.15rem, 9.6vw, 10.2rem)",
                        letterSpacing: "0.03em",
                        color: "var(--light-text)",
                        lineHeight: 0.85,
                      }}
                    >
                      {char}
                    </span>
                  </span>
                )
              )}
            </div>
          ))}
        </div>
      </div>

      <div
        className="hero-fade mx-auto flex w-full max-w-[1600px] flex-wrap items-center justify-between gap-5 border-t pt-6 md:pt-7"
        style={{ opacity: 0, borderColor: "var(--border-light)" }}
      >
        <span
          className="flex items-center gap-1.5 text-xs font-mono md:text-sm"
          style={{ color: "var(--muted-on-light)" }}
        >
          <MapPin size={12} /> {t("hero.location")}
        </span>

        <div className="flex flex-wrap items-center gap-5 md:gap-7">
          <a
            href="https://github.com/polMarsol"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-mono transition-opacity hover:opacity-50 md:text-sm"
            style={{ color: "var(--light-text)" }}
          >
            <GithubIcon size={13} /> polMarsol
          </a>
          <a
            href="https://linkedin.com/in/pol-marsol"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-mono transition-opacity hover:opacity-50 md:text-sm"
            style={{ color: "var(--light-text)" }}
          >
            <LinkedinIcon size={13} /> pol-marsol
          </a>
          <button
            onClick={() =>
              document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
            }
            className="border px-4 py-2 text-xs font-mono uppercase tracking-widest transition-opacity hover:opacity-60 md:px-5 md:text-sm"
            style={{ color: "var(--light-text)", borderColor: "var(--border-light)" }}
          >
            {t("hero.cta_contact")} -&gt;
          </button>
        </div>
      </div>

      <div className="hero-fade absolute bottom-5 left-1/2 -translate-x-1/2 md:bottom-6" style={{ opacity: 0 }}>
        <div
          className="origin-top"
          style={{
            width: "1px",
            height: "2rem",
            backgroundColor: "var(--border-light)",
            animation: "pulse-line 2.6s ease-in-out infinite",
          }}
        />
      </div>

      <style>{`
        @keyframes pulse-line {
          0%, 100% { transform: scaleY(0.3); opacity: 0.3; }
          50% { transform: scaleY(1); opacity: 1; }
        }
      `}</style>
    </section>
  );
}
