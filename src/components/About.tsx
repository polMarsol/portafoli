"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, MotionValue, useReducedMotion, useScroll, useTransform } from "framer-motion";
import polPhoto from "../../public/pol.jpg";
import { useLanguage } from "@/contexts/LanguageContext";
import StickySection from "./StickySection";
import { useGroupedReveal } from "@/lib/reveal";

function BlindSlat({
  index,
  total,
  progress,
}: {
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const start = index * 0.085;
  const end = Math.min(start + 0.34, 1);
  const scaleY = useTransform(progress, [start, end], [1, 0]);
  const opacity = useTransform(progress, [start, end], [1, 0]);

  return (
    <motion.div
      className="absolute left-0 right-0"
      style={{
        top: `${(index * 100) / total}%`,
        height: `${100 / total + 0.6}%`,
        scaleY,
        opacity,
        transformOrigin: "center top",
        backgroundColor: "rgba(245,245,243,0.98)",
        borderBottom: "1px solid rgba(12,12,11,0.08)",
      }}
    />
  );
}

export default function About() {
  const { t } = useLanguage();
  const contentRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  useGroupedReveal(contentRef);

  const { scrollYProgress } = useScroll({
    target: photoRef,
    offset: ["start 95%", "start 28%"],
  });

  const clipPath = useTransform(
    scrollYProgress,
    [0, 1],
    ["inset(0 0 100% 0)", "inset(0 0 0% 0)"]
  );
  const scale = useTransform(scrollYProgress, [0, 1], [1.08, 1]);
  const photoOpacity = useTransform(scrollYProgress, [0, 1], [0.68, 1]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.82, 1], [1, 0.28, 0]);
  const scanY = useTransform(scrollYProgress, [0, 1], ["-105%", "245%"]);

  return (
    <StickySection id="about" number="01" title={t("about.title")} dark={false} titleVariant="clip">
      <div ref={contentRef} className="grid max-w-5xl gap-16 md:grid-cols-5">
        <div className="space-y-6 md:col-span-3">
          <div className="mb-2 flex items-center gap-2" data-text-reveal>
            <span className="h-1.5 w-1.5 rounded-full bg-black" />
            <span
              className="text-xs font-mono uppercase tracking-widest"
              style={{ color: "var(--muted-on-light)" }}
            >
              {t("hero.available")}
            </span>
          </div>

          {[t("about.p1"), t("about.p2"), t("about.p3")].map((paragraph, index) => (
            <p
              key={index}
              className="text-base leading-relaxed"
              style={{ color: "var(--muted-on-light)" }}
              data-text-reveal
            >
              {paragraph}
            </p>
          ))}

          <p
            className="text-base font-medium leading-relaxed"
            style={{ color: "var(--light-text)" }}
            data-text-reveal
          >
            {t("about.p4")}
          </p>
        </div>

        <div className="md:col-span-2">
          <div
            ref={photoRef}
            className="relative aspect-[3/4] overflow-hidden border motion-clip"
            style={{ borderColor: "var(--border-light)" }}
          >
            <motion.div
              className="absolute inset-0"
              style={
                reduceMotion
                  ? undefined
                  : {
                      clipPath,
                      scale,
                      opacity: photoOpacity,
                    }
              }
            >
              <Image
                src={polPhoto}
                alt={t("about.photo_alt")}
                fill
                placeholder="blur"
                sizes="(min-width: 768px) 32vw, 100vw"
                className="object-cover object-top"
              />
            </motion.div>

            {!reduceMotion &&
              Array.from({ length: 9 }).map((_, index) => (
                <BlindSlat key={index} index={index} total={9} progress={scrollYProgress} />
              ))}

            <motion.div
              className="pointer-events-none absolute inset-0"
              style={reduceMotion ? { opacity: 0 } : { opacity: overlayOpacity }}
              aria-hidden="true"
            >
              <motion.div
                className="absolute inset-x-0 top-0 h-[38%]"
                style={
                  reduceMotion
                    ? undefined
                    : {
                        y: scanY,
                        background:
                          "linear-gradient(180deg, rgba(255,255,255,0.56) 0%, rgba(255,255,255,0.08) 56%, rgba(255,255,255,0) 100%)",
                      }
                }
              />
              <span
                className="absolute left-4 top-4 text-[10px] font-mono uppercase tracking-[0.24em]"
                style={{ color: "var(--light-text)" }}
              >
                {t("about.photo_placeholder")}
              </span>
            </motion.div>
          </div>
        </div>
      </div>
    </StickySection>
  );
}
