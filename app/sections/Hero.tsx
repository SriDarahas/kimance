"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import Link from "next/link";
import { useFadeIn } from "../hooks/useFadeIn";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  
  // Use the custom hook for fade-in elements with staggered delays
  // Tagline appears after headline starts
  const taglineRef = useFadeIn({ delay: 0.8, duration: 1, y: 30 });
  // CTAs appear after tagline
  const ctaRef = useFadeIn({ delay: 1.2, duration: 1, y: 20 });
  // Scroll indicator appears last
  const scrollContainerRef = useFadeIn({ delay: 1.8, duration: 1, y: 10 });
  const scrollBounceRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Split headline text into words for animation
      const words = headlineRef.current?.querySelectorAll(".word");
      
      if (words && words.length > 0) {
        gsap.fromTo(
          words,
          { opacity: 0, y: 50, rotateX: -20 },
          { 
            opacity: 1, 
            y: 0, 
            rotateX: 0,
            stagger: 0.1, 
            duration: 1,
            ease: "power3.out"
          }
        );
      }

      // Scroll indicator bounce animation
      if (scrollBounceRef.current) {
        gsap.to(scrollBounceRef.current, {
          y: 10,
          repeat: -1,
          yoyo: true,
          duration: 1.5,
          ease: "sine.inOut",
          delay: 3 // Start bouncing after fade in completes
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const verbsText = "Send. Store. Exchange. Protect. Grow.";

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 text-white px-4" style={{ minHeight: 'calc(100vh - 97px)' }}
    >
      {/* Background Image - Global/World map abstract */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-40"
        style={{
          backgroundImage: `url('/banner.png')`,
        }}
      />
      {/* Dark overlay to ensure text readability */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-slate-950/80 via-slate-900/70 to-slate-800/90" />
      {/* Noise texture */}
      <div className="absolute inset-0 z-0 bg-[url('/noise.png')] opacity-5 mix-blend-overlay pointer-events-none" />
      
      <div className="relative z-10 text-center max-w-5xl mx-auto w-full pb-24">
        <h1 
          ref={headlineRef}
          className="font-playfair font-bold leading-tight tracking-tight perspective-1000"
        >
          <div className="text-4xl md:text-6xl lg:text-7xl mb-2">
            {verbsText.split(" ").map((word, i) => (
              <span key={i} className="word inline-block mr-1 md:mr-2 will-change-transform">
                {word}
              </span>
            ))}
          </div>
          <div className="text-2xl md:text-3xl lg:text-4xl text-gray-200 font-light">
            {"All with Security You Can Trust.".split(" ").map((word, i) => (
              <span key={i} className="word inline-block mr-1 md:mr-2 will-change-transform">
                {word}
              </span>
            ))}
          </div>
        </h1>
        
        <div ref={taglineRef as React.RefObject<HTMLDivElement>} aria-hidden="true" />


        <div 
          ref={ctaRef as React.RefObject<HTMLDivElement>} 
          className="flex flex-col sm:flex-row gap-4 mt-6 justify-center items-center"
        >
          <Link 
            href="/register" 
            className="group relative px-8 py-4 bg-violet-500 text-white font-semibold rounded-full overflow-hidden transition-all hover:bg-violet-400 hover:shadow-[0_0_30px_rgba(109,40,217,0.4)] hover:scale-105 active:scale-95"
          >
            <span className="relative z-10">Start Now</span>
          </Link>
          
          <Link 
            href="#features" 
            className="group px-8 py-4 border border-white/30 hover:border-white text-white font-medium rounded-full transition-all hover:bg-white/10 backdrop-blur-sm"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector('#features')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Learn More
          </Link>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div 
        ref={scrollContainerRef as React.RefObject<HTMLDivElement>}
        className="absolute bottom-6 left-1/2 transform -translate-x-1/2"
      >
        <div ref={scrollBounceRef} className="flex flex-col items-center gap-2 text-white/60">
          <span className="text-sm uppercase tracking-widest">Scroll</span>
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M7 13l5 5 5-5M7 6l5 5 5-5"/>
          </svg>
        </div>
      </div>
    </section>
  );
}
