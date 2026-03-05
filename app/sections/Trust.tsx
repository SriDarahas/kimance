"use client";

import { Shield, KeyRound, Fingerprint, Activity } from "lucide-react";
import { useFadeIn } from "../hooks/useFadeIn";

const securityFeatures = [
  {
    icon: Shield,
    title: "End-to-End Encryption",
    description: "AES-256 encryption protects all your data and transactions.",
  },
  {
    icon: KeyRound,
    title: "Two-Factor Authentication",
    description: "Extra security layer with SMS, email, or authenticator apps.",
  },
  {
    icon: Fingerprint,
    title: "Biometric Login",
    description: "Face ID and fingerprint authentication for quick, secure access.",
  },
  {
    icon: Activity,
    title: "Real-Time Fraud Monitoring",
    description: "AI-powered systems detect and prevent suspicious activity 24/7.",
  },
];

export default function Trust() {
  const sectionRef = useFadeIn({
    y: 30,
    duration: 0.8,
    start: "top 75%",
  });

  return (
    <section id="trust" className="py-20 bg-gradient-to-br from-slate-50 via-violet-50/40 to-white">
      <div ref={sectionRef} className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Secure. Always.</h2>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto text-xl leading-relaxed">
            Your money deserves the highest protection. Kimance uses enterprise-grade security to keep every transaction, every wallet, and every piece of data completely secure.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {securityFeatures.map((feature) => (
            <div key={feature.title} className="flex items-start gap-4">
              <div className="w-14 h-14 bg-violet-500 rounded-xl flex items-center justify-center shrink-0 shadow-md shadow-violet-200">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{feature.title}</h3>
                <p className="text-gray-600 text-lg mt-1 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12 text-base text-gray-500 font-medium">
          KYC/AML compliant • GDPR ready
        </div>
      </div>
    </section>
  );
}
