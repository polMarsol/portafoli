"use client";

import { useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import StickySection from "./StickySection";
import { useGroupedReveal } from "@/lib/reveal";

interface Subject {
  name: string;
  grade: string;
}

interface Cert {
  name: string;
  detail: string;
}

export default function Education() {
  const { t, tObj } = useLanguage();
  const subjects = tObj<Subject[]>("education.subjects");
  const certs = tObj<Cert[]>("education.certs");
  const contentRef = useRef<HTMLDivElement>(null);

  useGroupedReveal(contentRef);

  return (
    <StickySection
      id="education"
      number="04"
      title={t("education.title")}
      dark={false}
      titleVariant="scale"
    >
      <div ref={contentRef} className="grid max-w-5xl gap-12 md:grid-cols-2 md:gap-20">
        <div>
          <div>
            <p
              className="mb-3 font-mono text-xs uppercase tracking-widest"
              style={{ color: "var(--muted-on-light)" }}
              data-text-reveal
            >
              {t("education.period")}
            </p>
            <p
              className="mb-1 font-display text-3xl leading-tight md:text-4xl motion-clip"
              style={{ color: "var(--light-text)" }}
              data-title-reveal
            >
              {t("education.degree")}
            </p>
            <p
              className="mb-10 text-sm uppercase tracking-widest"
              style={{ color: "var(--muted-on-light)" }}
              data-text-reveal
            >
              {t("education.university")}
            </p>
          </div>

          <p
            className="mb-6 text-xs font-mono uppercase tracking-widest"
            style={{ color: "var(--muted-on-light)" }}
            data-text-reveal
          >
            {t("education.notable_title")}
          </p>
          <div className="divide-y" style={{ borderColor: "var(--border-light)" }}>
            {subjects.map((subject, index) => (
              <div key={index} className="flex items-center justify-between py-3" data-text-reveal>
                <span className="text-sm" style={{ color: "var(--muted-on-light)" }}>
                  {subject.name}
                </span>
                <span className="font-mono text-sm font-bold" style={{ color: "var(--light-text)" }}>
                  {subject.grade}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p
            className="mb-6 text-xs font-mono uppercase tracking-widest"
            style={{ color: "var(--muted-on-light)" }}
            data-text-reveal
          >
            {t("education.certifications")}
          </p>
          <div className="mb-12 space-y-4">
            {certs.map((certification, index) => (
              <div
                key={index}
                className="border p-5"
                style={{ borderColor: "var(--border-light)" }}
                data-text-reveal
              >
                <p className="mb-0.5 text-sm font-medium" style={{ color: "var(--light-text)" }}>
                  {certification.name}
                </p>
                <p className="text-xs font-mono" style={{ color: "var(--muted-on-light)" }}>
                  {certification.detail}
                </p>
              </div>
            ))}
          </div>

          <p
            className="mb-6 text-xs font-mono uppercase tracking-widest"
            style={{ color: "var(--muted-on-light)" }}
            data-text-reveal
          >
            Languages
          </p>
          <div className="divide-y" style={{ borderColor: "var(--border-light)" }}>
            {[
              { lang: "Catalan", level: "Native" },
              { lang: "Spanish", level: "Native" },
              { lang: "English", level: "B2 Advanced" },
            ].map((language, index) => (
              <div key={index} className="flex justify-between py-3" data-text-reveal>
                <span className="text-sm" style={{ color: "var(--muted-on-light)" }}>
                  {language.lang}
                </span>
                <span className="text-xs font-mono" style={{ color: "var(--muted-on-light)" }}>
                  {language.level}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </StickySection>
  );
}
