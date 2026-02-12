'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

export default function CTA() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="cta"
      ref={sectionRef}
      className="py-24 bg-slate-900 relative overflow-hidden"
    >
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-10">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-emerald-400 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-teal-400 rounded-full blur-[100px]" />
      </div>

      <div 
        className={`max-w-4xl mx-auto px-4 text-center text-white relative z-10 transition-all duration-1000 ease-out transform ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
          Ready to Go Global?
        </h2>
        
        <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
          Join thousands managing money smarter. Experience borderless finance with Kimance today.
        </p>
        
        <div className="flex flex-col items-center gap-8">
          <Link 
            href="/register"
            className="inline-block bg-emerald-500 text-white px-10 py-4 rounded-full text-lg font-bold hover:bg-emerald-400 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Create Free Account
          </Link>
          
          {/* App store buttons (Placeholders) */}
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            <div className="bg-black/20 hover:bg-black/30 transition-colors px-6 py-3 rounded-lg text-sm font-medium cursor-pointer flex items-center gap-2 backdrop-blur-sm border border-white/10">
              <span className="text-xl"></span>
              <div className="text-left">
                <div className="text-[10px] uppercase leading-none opacity-80">Download on the</div>
                <div className="text-sm font-bold leading-none mt-1">App Store</div>
              </div>
            </div>
            
            <div className="bg-black/20 hover:bg-black/30 transition-colors px-6 py-3 rounded-lg text-sm font-medium cursor-pointer flex items-center gap-2 backdrop-blur-sm border border-white/10">
              <span className="text-xl">▶</span>
              <div className="text-left">
                <div className="text-[10px] uppercase leading-none opacity-80">Get it on</div>
                <div className="text-sm font-bold leading-none mt-1">Google Play</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
