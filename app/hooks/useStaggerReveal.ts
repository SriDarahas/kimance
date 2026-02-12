import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function useStaggerReveal(
  options: {
    stagger?: number;
    duration?: number;
    y?: number;
    start?: string;
    selector?: string;
  } = {}
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    stagger = 0.1,
    duration = 0.8,
    y = 30,
    start = "top 80%",
    selector = ":scope > *",
  } = options;

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container || typeof window === "undefined") return;

    const ctx = gsap.context(() => {
      // Use :scope for relative selectors, or direct selector
      const finalSelector = selector === "> *" ? ":scope > *" : selector;
      const elements = container.querySelectorAll(finalSelector);
      
      gsap.fromTo(
        elements,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration,
          stagger,
          ease: "power3.out",
          scrollTrigger: {
            trigger: container,
            start,
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    return () => ctx.revert();
  }, [stagger, duration, y, start, selector]);

  return containerRef;
}
