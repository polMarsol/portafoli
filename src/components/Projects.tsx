"use client";

import { useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import StickySection from "./StickySection";
import { ExternalLink, Lock } from "lucide-react";
import { GithubIcon } from "@/components/icons/SocialIcons";
import { useGroupedReveal } from "@/lib/reveal";
import { gsap } from "@/lib/gsap";

interface ProjectItem {
  title: string;
  context: string;
  description: string;
  tags: string[];
  featured?: boolean;
  inProgress?: boolean;
  demo: string | null;
  repo: string | null;
  repoLabel?: string;
}

const projectMedia = [
  {
    src: "https://images.pexels.com/photos/4225925/pexels-photo-4225925.jpeg?cs=srgb&dl=pexels-shvetsa-4225925.jpg&fm=jpg",
    alt: "Doctor examining a chest X-ray in a clinical setting",
    objectPosition: "center center",
  },
  {
    src: "https://images.pexels.com/photos/31336026/pexels-photo-31336026.jpeg?cs=srgb&dl=pexels-equalstock-31336026.jpg&fm=jpg",
    alt: "Workers inspecting textiles in a factory quality-control environment",
    objectPosition: "center center",
  },
  {
    src: "https://images.pexels.com/photos/4145077/pexels-photo-4145077.jpeg?cs=srgb&dl=pexels-julia-m-cameron-4145077.jpg&fm=jpg",
    alt: "Child using a tablet in a bright learning environment",
    objectPosition: "center center",
  },
  {
    src: "https://images.pexels.com/photos/13159244/pexels-photo-13159244.jpeg?cs=srgb&dl=pexels-thomasronveaux-13159244.jpg&fm=jpg",
    alt: "Endurance athlete preparing to run on a track",
    objectPosition: "center center",
  },
  {
    src: "https://images.pexels.com/photos/7869134/pexels-photo-7869134.jpeg?cs=srgb&dl=pexels-vanessa-loring-7869134.jpg&fm=jpg",
    alt: "Children collaborating on a robotics project in a classroom",
    objectPosition: "center center",
  },
] as const;

function ProjectCard({ project, index }: { project: ProjectItem; index: number }) {
  const { t } = useLanguage();
  const cardRef = useRef<HTMLElement>(null);
  const media = projectMedia[index];

  const handleMouseEnter = () => {
    const overlay = cardRef.current?.querySelector<HTMLElement>(".project-overlay");
    if (overlay) gsap.to(overlay, { opacity: 1, duration: 0.3, ease: "power2.out" });
    const img = cardRef.current?.querySelector<HTMLElement>(".project-img");
    if (img) gsap.to(img, { scale: 1.04, duration: 0.6, ease: "power2.out" });
  };

  const handleMouseLeave = () => {
    const overlay = cardRef.current?.querySelector<HTMLElement>(".project-overlay");
    if (overlay) gsap.to(overlay, { opacity: 0, duration: 0.3, ease: "power2.out" });
    const img = cardRef.current?.querySelector<HTMLElement>(".project-img");
    if (img) gsap.to(img, { scale: 1, duration: 0.6, ease: "power2.out" });
  };

  return (
    <article
      ref={cardRef}
      className="flex flex-col"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="relative mb-5 overflow-hidden motion-clip"
        style={{
          backgroundColor: "var(--border-dark)",
          aspectRatio: index % 3 === 0 ? "16/9" : "4/3",
        }}
        data-media-reveal
      >
        <div
          className="project-img relative h-full w-full"
          style={{
            backgroundColor: index % 2 === 0 ? "rgba(245,245,243,0.04)" : "rgba(245,245,243,0.02)",
          }}
        >
          {media ? (
            <>
              <img
                src={media.src}
                alt={media.alt}
                className="h-full w-full object-cover"
                style={{ objectPosition: media.objectPosition }}
                loading="lazy"
                decoding="async"
                draggable={false}
                referrerPolicy="no-referrer"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(12,12,11,0.06) 0%, rgba(12,12,11,0.14) 55%, rgba(12,12,11,0.3) 100%)",
                }}
              />
              <span
                className="absolute bottom-4 right-4 font-mono text-[10px] uppercase tracking-[0.24em]"
                style={{ color: "rgba(245,245,243,0.72)" }}
              >
                Real photo
              </span>
            </>
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span
                className="font-display"
                style={{
                  fontSize: "clamp(4rem, 10vw, 8rem)",
                  color: "rgba(245,245,243,0.06)",
                  lineHeight: 1,
                  userSelect: "none",
                }}
              >
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>
          )}
        </div>
        <div
          className="project-overlay absolute inset-0 flex items-end p-5"
          style={{ opacity: 0, backgroundColor: "rgba(12,12,11,0.6)" }}
        >
          <span
            className="border px-2 py-0.5 text-xs font-mono"
            style={{ borderColor: "var(--border-dark)", color: "var(--muted-on-dark)" }}
          >
            {project.context}
          </span>
        </div>
      </div>

      <div className="mb-3 flex items-center gap-3" data-text-reveal>
        <span className="font-mono text-xs" style={{ color: "var(--muted-on-dark)" }}>
          {String(index + 1).padStart(2, "0")}
        </span>
        {project.featured && (
          <span
            className="border px-2 py-0.5 text-xs font-mono"
            style={{ borderColor: "var(--border-dark)", color: "var(--muted-on-dark)" }}
          >
            FEATURED
          </span>
        )}
        {project.inProgress && (
          <span
            className="border px-2 py-0.5 text-xs font-mono"
            style={{ borderColor: "var(--border-dark)", color: "var(--muted-on-dark)" }}
          >
            IN PROGRESS
          </span>
        )}
      </div>

      <h3
        className="mb-1 font-display leading-tight motion-clip"
        style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)", color: "var(--dark-text)" }}
        data-title-reveal
      >
        {project.title}
      </h3>

      <p
        className="mb-4 flex-1 text-sm leading-relaxed"
        style={{ color: "var(--muted-on-dark)" }}
        data-text-reveal
      >
        {project.description}
      </p>

      <div className="mb-5 flex flex-wrap gap-2" data-text-reveal>
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="border px-2 py-0.5 text-xs font-mono"
            style={{ borderColor: "var(--border-dark)", color: "var(--muted-on-dark)" }}
          >
            {tag}
          </span>
        ))}
      </div>

      <div
        className="flex items-center gap-5 border-t pt-4"
        style={{ borderColor: "var(--border-dark)" }}
        data-text-reveal
      >
        {project.demo && (
          <a
            href={project.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-mono transition-opacity hover:opacity-60"
            style={{ color: "var(--dark-text)" }}
          >
            <ExternalLink size={11} /> {t("projects.view_demo")}
          </a>
        )}
        {project.repo ? (
          <a
            href={project.repo}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-mono transition-opacity hover:opacity-60"
            style={{ color: "var(--dark-text)" }}
          >
            <GithubIcon size={11} /> {t("projects.view_code")}
          </a>
        ) : (
          <span
            className="flex items-center gap-1.5 text-xs font-mono"
            style={{ color: "var(--muted-on-dark)" }}
          >
            <Lock size={11} /> {project.repoLabel || t("projects.private_repo")}
          </span>
        )}
      </div>
    </article>
  );
}

export default function Projects() {
  const { t, tObj } = useLanguage();
  const items = tObj<ProjectItem[]>("projects.items");
  const contentRef = useRef<HTMLDivElement>(null);

  useGroupedReveal(contentRef);

  return (
    <StickySection
      id="projects"
      number="03"
      title={t("projects.title")}
      dark
      titleVariant="words"
      titleHold="md"
    >
      <div ref={contentRef} className="grid max-w-6xl gap-x-10 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((project, index) => (
          <ProjectCard key={index} project={project} index={index} />
        ))}
      </div>
    </StickySection>
  );
}
