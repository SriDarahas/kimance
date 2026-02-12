"use client";

import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

interface MarqueeProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  direction?: "left" | "right";
  speed?: number;
  pauseOnHover?: boolean;
}

export function Marquee({
  children,
  className,
  direction = "left",
  speed = 50,
  pauseOnHover = false,
  ...props
}: MarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    if (!container || !content || typeof window === "undefined") return;

    const ctx = gsap.context(() => {
      // Clone content to ensure seamless loop
      // We need enough clones to fill the screen width + some buffer
      // For simplicity, let's just clone it once or twice
      // But a better approach is to use GSAP's horizontalLoop helper or similar logic
      
      // Simple continuous scroll implementation
      const contentWidth = content.offsetWidth;
      const containerWidth = container.offsetWidth;
      
      // If content is smaller than container, we might need more clones
      // But let's assume the user provides enough content or we just scroll what we have
      
      // Actually, for a marquee, we usually want it to loop seamlessly.
      // Let's use a simple tween that repeats.
      
      const distance = contentWidth;
      const duration = distance / speed;
      
      const tl = gsap.to(content, {
        x: direction === "left" ? -distance / 2 : 0, // Assuming content has 2 copies
        duration: duration,
        ease: "none",
        repeat: -1,
        modifiers: {
          x: gsap.utils.unitize((x) => parseFloat(x) % (distance / 2)) // Reset when half is scrolled
        }
      });

      if (direction === "right") {
        gsap.set(content, { x: -distance / 2 });
        tl.vars.x = 0;
        tl.invalidate().restart();
      }

      if (pauseOnHover) {
        container.addEventListener("mouseenter", () => tl.pause());
        container.addEventListener("mouseleave", () => tl.play());
      }
    });

    return () => ctx.revert();
  }, [direction, speed, pauseOnHover]);

  return (
    <div
      ref={containerRef}
      className={cn("overflow-hidden whitespace-nowrap flex", className)}
      {...props}
    >
      <div ref={contentRef} className="flex min-w-full">
        {children}
        {/* Duplicate children for seamless loop */}
        {children}
      </div>
    </div>
  );
}
