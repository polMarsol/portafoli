"use client";

import { useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import StickySection from "./StickySection";
import { useGroupedReveal } from "@/lib/reveal";

interface ExperienceItem {
  role: string;
  company: string;
  period: string;
  type: string;
  description: string[];
}

export default function Experience() {
  const { t, tObj } = useLanguage();
  const items = tObj<ExperienceItem[]>("experience.items");
  const contentRef = useRef<HTMLDivElement>(null);

  useGroupedReveal(contentRef);

  return (
    <StickySection
      id="experience"
      number="02"
      title={t("experience.title")}
      dark
      titleVariant="scale"
      titleHold="sm"
    >
      <div ref={contentRef} className="max-w-5xl divide-y" style={{ borderColor: "var(--border-dark)" }}>
        {items.map((item, index) => (
          <div key={index} className="grid gap-8 py-14 md:grid-cols-3">
            <div data-text-reveal>
              <p className="mb-3 font-mono text-xs tracking-wider" style={{ color: "var(--muted-on-dark)" }}>
                {item.period}
              </p>
              <span
                className="border px-2 py-0.5 text-xs font-mono uppercase tracking-widest"
                style={{ color: "var(--muted-on-dark)", borderColor: "var(--border-dark)" }}
              >
                {item.type}
              </span>
            </div>

            <div className="md:col-span-2">
              <h3
                className="font-display leading-tight mb-1 motion-clip"
                style={{ fontSize: "clamp(1.8rem, 3.5vw, 3rem)", color: "var(--dark-text)" }}
                data-title-reveal
              >
                {item.role}
              </h3>
              <p
                className="mb-6 text-sm uppercase tracking-widest"
                style={{ color: "var(--muted-on-dark)" }}
                data-text-reveal
              >
                {item.company}
              </p>
              <ul className="space-y-3">
                {item.description.map((description, descriptionIndex) => (
                  <li
                    key={descriptionIndex}
                    className="flex gap-3 text-sm leading-relaxed"
                    style={{ color: "var(--muted-on-dark)" }}
                    data-text-reveal
                  >
                    <span
                      className="mt-2 h-1 w-1 shrink-0 rounded-full"
                      style={{ backgroundColor: "var(--muted-on-dark)" }}
                    />
                    {description}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </StickySection>
  );
}
