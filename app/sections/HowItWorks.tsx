"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { UserPlus, Link, ArrowRightLeft, TrendingUp } from "lucide-react";

const steps = [
  {
    number: 1,
    icon: UserPlus,
    title: "Sign Up",
    description: "Create your account in minutes with just your email."
  },
  {
    number: 2,
    icon: Link,
    title: "Add Money",
    description: "Link your bank account, card, or add crypto to your wallet."
  },
  {
    number: 3,
    icon: ArrowRightLeft,
    title: "Send & Exchange",
    description: "Transfer money globally and exchange currencies instantly."
  },
  {
    number: 4,
    icon: TrendingUp,
    title: "Track & Grow",
    description: "Monitor your finances with AI-powered insights and recommendations."
  }
];

export default function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);
  const stepsRef = useRef<(HTMLDivElement | null)[]>([]);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    const ctx = gsap.context(() => {
      gsap.fromTo(
        stepsRef.current,
        { 
          y: 30, 
          opacity: 0 
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      id="how-it-works" 
      ref={sectionRef} 
      className="py-20 bg-gray-50 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get started with Kimance in four simple steps and take control of your financial future.
          </p>
        </div>

        <div className="relative flex flex-col md:flex-row justify-between items-start gap-12 md:gap-8">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-8 left-0 w-full h-px bg-gray-300 -z-10 transform -translate-y-1/2 max-w-[85%] mx-auto right-0" />

          {steps.map((step, index) => (
            <div 
              key={step.number} 
              ref={el => { stepsRef.current[index] = el; }}
              className="step-item flex-1 flex flex-col items-center text-center relative w-full md:w-auto"
            >
              {/* Step Number Circle */}
              <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-slate-800 text-white text-xl font-bold mb-6 shadow-lg z-10 ring-4 ring-white">
                {step.number}
                
                {/* Icon Badge */}
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md border border-gray-100">
                  <step.icon className="w-6 h-6 text-emerald-600" />
                </div>
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {step.title}
              </h3>
              <p className="text-gray-600 leading-relaxed max-w-xs mx-auto">
                {step.description}
              </p>

              {/* Mobile Connecting Line (Vertical) */}
              {index !== steps.length - 1 && (
                <div className="md:hidden absolute top-16 bottom-0 left-1/2 w-px bg-gray-300 -translate-x-1/2 h-12 -mb-8" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
