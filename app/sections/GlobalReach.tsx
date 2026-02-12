"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

// Lazy load Globe with no SSR
const Globe = dynamic(() => import("../components/Globe"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] md:h-[600px] flex items-center justify-center bg-gray-900 text-gray-500">
      <div className="animate-pulse">Loading Globe...</div>
    </div>
  ),
});

export default function GlobalReach() {
  const [isMobile, setIsMobile] = useState(true); // Default to true to avoid hydration mismatch if possible, or handle with useEffect

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <section className="w-full py-20 bg-gray-900 text-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">
            Send Money Anywhere
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Connect with family and friends across the globe with our secure and fast transfer network.
          </p>
        </div>

        <div className="relative w-full max-w-5xl mx-auto">
          {/* 3D Globe for Desktop, Static Map for Mobile */}
          <div className="w-full flex justify-center items-center">
            {!isMobile ? (
              <Globe />
            ) : (
              <div className="w-full h-[300px] relative flex items-center justify-center bg-gray-800/50 rounded-3xl overflow-hidden border border-gray-700/50">
                {/* Abstract World Map SVG Fallback */}
                <svg
                  viewBox="0 0 800 400"
                  className="w-full h-full opacity-60"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Background Grid */}
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
                    </pattern>
                  </defs>
                  <rect width="800" height="400" fill="url(#grid)" />
                  
                  {/* Simplified World Map Dots (Abstract) */}
                  <circle cx="200" cy="150" r="4" fill="#60a5fa" /> {/* NY */}
                  <circle cx="380" cy="130" r="4" fill="#60a5fa" /> {/* London */}
                  <circle cx="400" cy="220" r="4" fill="#60a5fa" /> {/* Lagos */}
                  <circle cx="520" cy="180" r="4" fill="#60a5fa" /> {/* Dubai */}
                  <circle cx="580" cy="190" r="4" fill="#60a5fa" /> {/* Mumbai */}
                  <circle cx="680" cy="250" r="4" fill="#60a5fa" /> {/* Singapore */}
                  <circle cx="720" cy="320" r="4" fill="#60a5fa" /> {/* Sydney */}
                  <circle cx="180" cy="140" r="4" fill="#60a5fa" /> {/* Toronto */}
                  <circle cx="100" cy="160" r="4" fill="#60a5fa" /> {/* SF */}
                  
                  {/* Connecting Arcs (2D Bezier) */}
                  <path d="M200 150 Q 290 50 380 130" stroke="#60a5fa" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6" />
                  <path d="M380 130 Q 390 175 400 220" stroke="#60a5fa" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6" />
                  <path d="M520 180 Q 550 150 580 190" stroke="#60a5fa" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6" />
                  <path d="M680 250 Q 700 285 720 320" stroke="#60a5fa" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6" />
                  <path d="M100 160 Q 140 100 180 140" stroke="#60a5fa" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6" />
                </svg>
                
                <div className="absolute bottom-4 left-0 right-0 text-center text-sm text-gray-400">
                  Interactive 3D view available on desktop
                </div>
              </div>
            )}
          </div>

          {/* Stats Overlay */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center border-t border-gray-800 pt-8">
            <div className="p-4">
              <div className="text-4xl font-bold text-white mb-2">150+</div>
              <div className="text-gray-400 text-sm uppercase tracking-wider">Countries</div>
            </div>
            <div className="p-4 border-l-0 md:border-l border-gray-800">
              <div className="text-4xl font-bold text-white mb-2">50+</div>
              <div className="text-gray-400 text-sm uppercase tracking-wider">Currencies</div>
            </div>
            <div className="p-4 border-l-0 md:border-l border-gray-800">
              <div className="text-4xl font-bold text-white mb-2">$2B+</div>
              <div className="text-gray-400 text-sm uppercase tracking-wider">Transferred</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
