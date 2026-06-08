import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function useFadeIn(
  options: {
    delay?: number;
    duration?: number;
    y?: number;
    start?: string;
  } = {}
) {
  const elementRef = useRef<HTMLDivElement>(null);
  const { delay = 0, duration = 1, y = 50, start = "top 80%" } = options;

  useLayoutEffect(() => {
    const element = elementRef.current;
    if (!element || typeof window === "undefined") return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        element,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration,
          delay,
          ease: "power3.out",
          scrollTrigger: {
            trigger: element,
            start,
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    return () => ctx.revert();
  }, [delay, duration, y, start]);

  return elementRef;
}
