'use client';

import Link from 'next/link';
import Image from 'next/image';
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
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-violet-400 rounded-full blur-[100px]" />
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
            className="inline-block bg-violet-500 text-white px-10 py-4 rounded-full text-lg font-bold hover:bg-violet-400 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Create Free Account
          </Link>
          
          {/* App store buttons */}
          <div className="flex flex-wrap justify-center items-center gap-4 mt-4">
            <Link href="#">
              <Image
                src="/app_icon/app_store.svg"
                alt="Download on the App Store"
                width={180}
                height={54}
                className="h-14 w-auto hover:opacity-80 transition-opacity"
              />
            </Link>
            
            <Link href="#">
              <Image
                src="/app_icon/google_play_store.svg"
                alt="Get it on Google Play"
                width={180}
                height={54}
                className="h-14 w-auto hover:opacity-80 transition-opacity"
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
