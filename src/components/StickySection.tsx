"use client";

import { useMemo, useRef } from "react";
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

type TitleVariant = "clip" | "scale" | "words";
type TitleHold = "none" | "sm" | "md" | "lg";

interface Props {
  id: string;
  number: string;
  title: string;
  dark?: boolean;
  titleVariant?: TitleVariant;
  titleHold?: TitleHold;
  children: React.ReactNode;
}

const titleSize = "clamp(1.85rem, 4.8vw, 4.5rem)";
const holdSpaceMap: Record<TitleHold, string> = {
  none: "0px",
  sm: "clamp(40px, 6vh, 68px)",
  md: "clamp(72px, 10vh, 120px)",
  lg: "clamp(110px, 14vh, 180px)",
};

function getOuterWeight(index: number, total: number) {
  if (total <= 1) return 0;
  const center = (total - 1) / 2;
  const distance = Math.abs(index - center);
  return distance / center;
}

function TitleGlyphs({ title, isInView, fg }: { title: string; isInView: boolean; fg: string }) {
  const reduceMotion = useReducedMotion();

  const chars = useMemo(() => title.split(""), [title]);
  const visibleCount = useMemo(() => chars.filter((char) => char !== " ").length, [chars]);
  let visibleIndex = -1;

  return (
    <>
      {chars.map((char, index) => {
        if (char === " ") {
          return <span key={`${char}-${index}`} aria-hidden="true" style={{ width: "0.26em" }} />;
        }

        visibleIndex += 1;
        const weight = getOuterWeight(visibleIndex, visibleCount);

        return (
          <span
            key={`${char}-${index}`}
            className="overflow-hidden"
            style={{ display: "inline-block" }}
          >
            <motion.span
              style={{ display: "inline-block", color: fg }}
              initial={reduceMotion ? false : { y: "-112%" }}
              animate={reduceMotion ? { y: 0 } : { y: isInView ? "0%" : "-112%" }}
              transition={{
                duration: reduceMotion ? 0 : 0.9 + weight * 0.55,
                ease: [0.16, 1, 0.3, 1],
                delay: reduceMotion ? 0 : Math.pow(weight, 1.35) * 0.46,
              }}
            >
              {char}
            </motion.span>
          </span>
        );
      })}
    </>
  );
}

function TitleClip({ title, isInView, fg }: { title: string; isInView: boolean; fg: string }) {
  return (
    <div style={{ overflow: "hidden" }}>
      <h2
        className="font-display flex flex-wrap"
        style={{ fontSize: titleSize, color: fg, lineHeight: 0.94 }}
      >
        <TitleGlyphs title={title} isInView={isInView} fg={fg} />
      </h2>
    </div>
  );
}

function TitleScale({
  title,
  isInView,
  sectionRef,
  fg,
}: {
  title: string;
  isInView: boolean;
  sectionRef: React.RefObject<HTMLElement | null>;
  fg: string;
}) {
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 0.55], [1, 0.92]);

  return (
    <motion.h2
      className="font-display flex flex-wrap"
      style={{
        fontSize: titleSize,
        color: fg,
        lineHeight: 0.94,
        scale: reduceMotion ? 1 : scale,
        opacity: 1,
        transformOrigin: "left center",
      }}
    >
      <TitleGlyphs title={title} isInView={isInView} fg={fg} />
    </motion.h2>
  );
}

function TitleWords({ title, isInView, fg }: { title: string; isInView: boolean; fg: string }) {
  return (
    <h2 className="font-display flex flex-wrap" style={{ fontSize: titleSize, lineHeight: 0.94 }}>
      <TitleGlyphs title={title} isInView={isInView} fg={fg} />
    </h2>
  );
}

export default function StickySection({
  id,
  number,
  title,
  dark = false,
  titleVariant = "clip",
  titleHold = "none",
  children,
}: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const isInView = useInView(sectionRef, { once: false, margin: "0px 0px -15% 0px" });

  const bg = dark ? "var(--dark)" : "var(--light)";
  const fg = dark ? "var(--dark-text)" : "var(--light-text)";
  const muted = dark ? "var(--muted-on-dark)" : "var(--muted-on-light)";
  const border = dark ? "var(--border-dark)" : "var(--border-light)";

  return (
    <section
      ref={sectionRef}
      id={id}
      style={{ backgroundColor: bg, position: "relative" }}
      data-theme={dark ? "dark" : "light"}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          backgroundColor: bg,
          paddingTop: "2.75rem",
          paddingBottom: "0.95rem",
          paddingLeft: "2rem",
          paddingRight: "2rem",
          borderBottom: `1px solid ${border}`,
        }}
        className="md:px-16"
      >
        <div className="mx-auto flex max-w-6xl items-end justify-between overflow-hidden">
          {titleVariant === "clip" && <TitleClip title={title} isInView={isInView} fg={fg} />}
          {titleVariant === "scale" && (
            <TitleScale title={title} isInView={isInView} sectionRef={sectionRef} fg={fg} />
          )}
          {titleVariant === "words" && <TitleWords title={title} isInView={isInView} fg={fg} />}

          <span
            className="font-display select-none hidden md:block"
            style={{
              fontSize: "clamp(5rem, 15vw, 14rem)",
              color: muted,
              opacity: 0.1,
              lineHeight: 0.82,
              pointerEvents: "none",
              flexShrink: 0,
            }}
          >
            {number}
          </span>
        </div>

        <motion.div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "1px",
            backgroundColor: border,
            transformOrigin: "left",
          }}
          initial={reduceMotion ? false : { scaleX: 0 }}
          animate={reduceMotion ? { scaleX: 1 } : { scaleX: isInView ? 1 : 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.12 }}
        />
      </div>

      <div className="px-8 pb-24 pt-12 md:px-16">
        {titleHold !== "none" && <div aria-hidden="true" style={{ height: holdSpaceMap[titleHold] }} />}
        {children}
      </div>
    </section>
  );
}
