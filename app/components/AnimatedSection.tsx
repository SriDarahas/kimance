"use client";

import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

interface AnimatedSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  y?: number;
  start?: string;
  stagger?: number;
  type?: "fade-in" | "stagger";
}

export function AnimatedSection({
  children,
  className,
  delay = 0,
  duration = 1,
  y = 50,
  start = "top 80%",
  stagger = 0.1,
  type = "fade-in",
  ...props
}: AnimatedSectionProps) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element || typeof window === "undefined") return;

    const ctx = gsap.context(() => {
      if (type === "fade-in") {
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
      } else if (type === "stagger") {
        const children = element.children;
        gsap.fromTo(
          children,
          { opacity: 0, y },
          {
            opacity: 1,
            y: 0,
            duration,
            stagger,
            delay,
            ease: "power3.out",
            scrollTrigger: {
              trigger: element,
              start,
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    });

    return () => ctx.revert();
  }, [delay, duration, y, start, stagger, type]);

  return (
    <section
      ref={ref}
      className={cn("relative", className)}
      {...props}
    >
      {children}
    </section>
  );
}
