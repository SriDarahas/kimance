import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function useScrollTrigger(
  vars: ScrollTrigger.Vars,
  deps: any[] = []
) {
  const triggerRef = useRef<ScrollTrigger | null>(null);

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;

    const ctx = gsap.context(() => {
      triggerRef.current = ScrollTrigger.create(vars);
    });

    return () => ctx.revert();
  }, deps);

  return triggerRef;
}
