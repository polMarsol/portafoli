"use client";

import { useEffect } from "react";
import gsap from "@/lib/gsap";

export default function Cursor() {
  useEffect(() => {
    const cursor = document.querySelector<HTMLDivElement>(".cursor");
    if (!cursor) return;

    const move = (e: MouseEvent) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.15,
        ease: "power2.out",
      });
    };

    const addHover = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      const isDark = t.closest("[data-theme='dark']") !== null;
      cursor.classList.add("hover");
      if (isDark) cursor.classList.add("hover-light");
    };

    const removeHover = () => {
      cursor.classList.remove("hover", "hover-light");
    };

    window.addEventListener("mousemove", move);

    const interactives = document.querySelectorAll("a, button");
    interactives.forEach((el) => {
      el.addEventListener("mouseenter", addHover as EventListener);
      el.addEventListener("mouseleave", removeHover);
    });

    const observer = new MutationObserver(() => {
      document.querySelectorAll("a, button").forEach((el) => {
        el.removeEventListener("mouseenter", addHover as EventListener);
        el.removeEventListener("mouseleave", removeHover);
        el.addEventListener("mouseenter", addHover as EventListener);
        el.addEventListener("mouseleave", removeHover);
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", move);
      observer.disconnect();
    };
  }, []);

  return <div className="cursor" aria-hidden />;
}
