"use client";

import { useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import StickySection from "./StickySection";
import { useGroupedReveal } from "@/lib/reveal";

const skillsData = {
  languages: ["Python", "Java", "Kotlin", "Dart", "C", "PHP", "JavaScript", "TypeScript", "HTML/CSS", "Bash"],
  aiml: ["Scikit-learn", "Keras / TensorFlow", "XGBoost", "LightGBM", "CatBoost", "SHAP", "Optuna", "LSTM", "Autoencoders / U-Net", "NLP", "OpenCV"],
  mobile: ["Android - Jetpack Compose", "Flutter", "TFLite"],
  backend: ["FastAPI", "Flask", "Java Spring", "REST APIs", "Next.js", "React"],
  databases: ["PostgreSQL", "Firebase", "Supabase", "SQLite / Room"],
  infrastructure: ["AWS", "Docker", "Git / GitHub", "GitHub Actions", "Jupyter", "Ngrok"],
};

type SkillCat = keyof typeof skillsData;
const categories: SkillCat[] = ["languages", "aiml", "mobile", "backend", "databases", "infrastructure"];

export default function Skills() {
  const { t } = useLanguage();
  const contentRef = useRef<HTMLDivElement>(null);

  useGroupedReveal(contentRef);

  return (
    <StickySection id="skills" number="05" title={t("skills.title")} dark={false} titleVariant="words">
      <div ref={contentRef} className="max-w-5xl divide-y" style={{ borderColor: "var(--border-light)" }}>
        {categories.map((category) => (
          <div key={category} className="grid gap-4 py-7 md:grid-cols-4" data-text-reveal>
            <p
              className="pt-1 text-xs font-mono uppercase tracking-widest md:col-span-1"
              style={{ color: "var(--muted-on-light)" }}
            >
              {t(`skills.categories.${category}`)}
            </p>
            <div className="flex flex-wrap gap-x-8 gap-y-2.5 md:col-span-3">
              {skillsData[category].map((skill) => (
                <span key={skill} className="text-sm" style={{ color: "var(--light-text)" }}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </StickySection>
  );
}
