import { RefObject, useEffect } from "react";
import { ScrollTrigger, gsap } from "@/lib/gsap";

type RevealKind = "title" | "text" | "media";

const REVEAL_CONFIG: Record<
  RevealKind,
  {
    hidden: gsap.TweenVars;
    shown: gsap.TweenVars;
    leaving: gsap.TweenVars;
    maxDelay: number;
  }
> = {
  title: {
    hidden: { opacity: 0, y: -28, clipPath: "inset(0 0 100% 0)" },
    shown: {
      opacity: 1,
      y: 0,
      clipPath: "inset(0 0 0% 0)",
      duration: 1.05,
      ease: "power4.out",
    },
    leaving: {
      opacity: 0,
      y: -12,
      clipPath: "inset(0 0 100% 0)",
      duration: 0.42,
      ease: "power3.in",
    },
    maxDelay: 0.2,
  },
  text: {
    hidden: {
      opacity: 0,
      y: 18,
      clipPath: "inset(100% 0 0 0)",
    },
    shown: {
      opacity: 1,
      y: 0,
      clipPath: "inset(0% 0 0 0)",
      duration: 0.95,
      ease: "power3.out",
    },
    leaving: {
      opacity: 0,
      y: 8,
      clipPath: "inset(100% 0 0 0)",
      duration: 0.32,
      ease: "power2.in",
    },
    maxDelay: 0.28,
  },
  media: {
    hidden: {
      opacity: 0,
      y: 24,
      scale: 1.04,
      clipPath: "inset(0 0 100% 0)",
    },
    shown: {
      opacity: 1,
      y: 0,
      scale: 1,
      clipPath: "inset(0 0 0% 0)",
      duration: 1.15,
      ease: "power4.out",
    },
    leaving: {
      opacity: 0,
      y: 12,
      scale: 1.02,
      clipPath: "inset(0 0 100% 0)",
      duration: 0.4,
      ease: "power3.in",
    },
    maxDelay: 0.16,
  },
};

const REVEAL_GROUPS: Array<{ selector: string; kind: RevealKind }> = [
  { selector: "[data-title-reveal]", kind: "title" },
  {
    selector:
      "[data-text-reveal], [data-reveal]:not([data-title-reveal]):not([data-media-reveal])",
    kind: "text",
  },
  { selector: "[data-media-reveal]", kind: "media" },
];

function animateReveal(element: HTMLElement, kind: RevealKind, delay = 0) {
  gsap.killTweensOf(element);
  gsap.to(element, {
    ...REVEAL_CONFIG[kind].shown,
    delay,
    overwrite: "auto",
  });
}

function resetReveal(element: HTMLElement, kind: RevealKind) {
  gsap.killTweensOf(element);
  gsap.to(element, {
    ...REVEAL_CONFIG[kind].leaving,
    overwrite: "auto",
  });
}

export function useGroupedReveal(scopeRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const scope = scopeRef.current;
    if (!scope) return;

    const selectors = REVEAL_GROUPS.map(({ selector }) => selector).join(", ");
    const allRevealNodes = gsap.utils.toArray<HTMLElement>(selectors, scope);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(allRevealNodes, {
        opacity: 1,
        y: 0,
        scale: 1,
        clipPath: "inset(0 0 0% 0)",
        clearProps: "transform",
      });
      return;
    }

    const triggers: ScrollTrigger[] = [];

    REVEAL_GROUPS.forEach(({ selector, kind }) => {
      const elements = gsap.utils.toArray<HTMLElement>(selector, scope);

      elements.forEach((element, index) => {
        gsap.set(element, REVEAL_CONFIG[kind].hidden);

        const orderIndex = kind === "text" ? elements.length - 1 - index : index;
        const delay = Math.min(orderIndex * 0.06, REVEAL_CONFIG[kind].maxDelay);

        triggers.push(
          ScrollTrigger.create({
            trigger: element,
            start: "top 88%",
            end: "bottom top",
            onEnter: () => animateReveal(element, kind, delay),
            onEnterBack: () => animateReveal(element, kind, 0.04),
            onLeaveBack: () => resetReveal(element, kind),
          })
        );
      });
    });

    return () => {
      triggers.forEach((trigger) => trigger.kill());
    };
  }, [scopeRef]);
}
