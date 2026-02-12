"use client";

import { useRef, useLayoutEffect } from "react";
import { Marquee } from "@/app/components/Marquee";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    quote: "Kimance has completely transformed how I send money to my family overseas. The fees are transparent and the transfers are instant.",
    name: "Sarah Johnson",
    role: "Small Business Owner",
    location: "Toronto, Canada",
    rating: 5
  },
  {
    quote: "The AI financial insights helped me save 20% more last month. It's like having a personal finance advisor in my pocket.",
    name: "Michael Chen",
    role: "Software Engineer",
    location: "San Francisco, USA",
    rating: 5
  },
  {
    quote: "Finally, a platform that understands the needs of global citizens. Multi-currency wallets are a game changer for my freelance work.",
    name: "Amara Okafor",
    role: "Digital Nomad",
    location: "Lagos, Nigeria",
    rating: 5
  }
];

const logos = [
  "Visa",
  "Mastercard",
  "USDC",
  "M-Pesa",
  "PayPal",
  "Wise"
];

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".testimonial-card",
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: cardsRef.current,
            start: "top 85%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="testimonials" ref={sectionRef} className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-display">
            Trusted by Global Users
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join thousands of users who trust Kimance for their financial freedom.
          </p>
        </div>
        
        {/* Testimonial cards */}
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {testimonials.map((t, index) => (
            <div 
              key={index} 
              className="testimonial-card bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full border border-gray-100"
            >
              {/* Stars */}
              <div className="flex mb-4 text-yellow-400">
                {[...Array(t.rating)].map((_, i) => (
                  <span key={i} className="material-icons text-xl">star</span>
                ))}
              </div>
              
              {/* Quote */}
              <blockquote className="text-gray-600 italic mb-6 flex-grow relative">
                <span className="text-4xl text-emerald-200 absolute -top-4 -left-2 font-serif">"</span>
                <span className="relative z-10">{t.quote}</span>
              </blockquote>
              
              {/* User info */}
              <div className="mt-auto flex items-center">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold mr-3">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{t.name}</p>
                  <p className="text-sm text-gray-500">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Logo marquee */}
        <div className="text-center pt-10 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-8 uppercase tracking-wider font-medium">Trusted by leading companies</p>
          
          <div className="relative overflow-hidden">
            {/* Gradient masks for marquee edges */}
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none"></div>
            
            <Marquee speed={40} pauseOnHover={true} className="py-2">
              {logos.map((logo, index) => (
                <div 
                  key={index} 
                  className="mx-8 px-6 py-3 bg-white/50 rounded-lg border border-gray-200 text-gray-400 font-bold text-xl grayscale hover:grayscale-0 transition-all duration-300 flex items-center justify-center min-w-[120px] hover:bg-white hover:shadow-sm"
                >
                  {logo}
                </div>
              ))}
            </Marquee>
          </div>
        </div>
      </div>
    </section>
  );
}
