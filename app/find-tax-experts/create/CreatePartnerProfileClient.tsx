"use client";

import { useState } from "react";
import Link from "next/link";
import Sidebar from "@/app/components/Sidebar";

interface CreatePartnerProfileClientProps {
  userName: string;
  userEmail: string;
  isAdmin?: boolean;
}

const serviceTypes = [
  { id: "personal", label: "Personal" },
  { id: "business", label: "Business" },
];

const expertiseOptions = [
  { id: "crypto", label: "Crypto Tax" },
  { id: "expats", label: "Expats" },
  { id: "audit", label: "Audit" },
  { id: "small-biz", label: "Small Business" },
  { id: "freelancers", label: "Freelancers" },
  { id: "corporate", label: "Corporate" },
];

export default function CreatePartnerProfileClient({
  userName,
  userEmail,
  isAdmin = false,
}: CreatePartnerProfileClientProps) {
  const [selectedExpertise, setSelectedExpertise] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    firmName: "",
    email: userEmail,
    phone: "",
    location: "",
    serviceType: "personal",
    yearsExperience: "",
    hourlyRate: "",
    website: "",
    bio: "",
    certifications: "",
  });

  const mobileHeader = (
    <div className="flex flex-col">
      <span className="font-serif text-lg font-bold text-gray-900 leading-tight">Create Partner Profile</span>
      <span className="text-xs text-gray-500">Finance Expert Finder</span>
    </div>
  );

  const toggleExpertise = (id: string) => {
    setSelectedExpertise((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-gray-100 text-gray-800 font-sans min-h-screen flex overflow-hidden">
      <Sidebar userName={userName} userEmail={userEmail} isAdmin={isAdmin} mobileHeader={mobileHeader} />

      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        <header className="h-16 px-6 hidden md:flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-20 border-b border-gray-200">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/find-tax-experts" className="hover:text-purple-600 transition-colors">
              Find Finance Experts
            </Link>
            <span className="material-icons-outlined text-xs">chevron_right</span>
            <span className="text-purple-600 font-medium">Create Partner Profile</span>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 mt-14 sm:mt-0">
          <div className="max-w-5xl mx-auto space-y-6">
            <div className="bg-white rounded-2xl p-4 sm:p-6 md:p-8 shadow-sm border border-gray-100">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Create your finance expert profile</h1>
              <p className="text-purple-600 text-sm font-normal">
                Share your expertise and get discovered by global clients. This form is for display only.
              </p>
            </div>

            {submitted ? (
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <span className="material-icons-outlined text-green-600 text-3xl">check_circle</span>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Profile submitted</h2>
                <p className="text-gray-500 mb-6">We will review your partner profile shortly.</p>
                <Link
                  href="/find-tax-experts"
                  className="inline-flex items-center justify-center bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-colors"
                >
                  Back to Finance Experts
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Profile details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange("fullName", e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                        placeholder="e.g. Sarah Jenkins"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Firm or Company</label>
                      <input
                        type="text"
                        value={formData.firmName}
                        onChange={(e) => handleInputChange("firmName", e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                        placeholder="e.g. Apex Partners LLC"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                        placeholder="your@email.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                      <input
                        type="text"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => handleInputChange("location", e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                        placeholder="City, Country"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Website</label>
                      <input
                        type="text"
                        value={formData.website}
                        onChange={(e) => handleInputChange("website", e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                        placeholder="https://yourfirm.com"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Expertise & pricing</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Service Type</label>
                      <div className="grid grid-cols-2 gap-2">
                        {serviceTypes.map((type) => (
                          <button
                            type="button"
                            key={type.id}
                            onClick={() => handleInputChange("serviceType", type.id)}
                            className={`w-full px-4 py-3 rounded-xl font-semibold text-sm transition-all text-center ${
                              formData.serviceType === type.id
                                ? "bg-purple-600 text-white shadow-md shadow-purple-500/20"
                                : "bg-white border border-gray-200 text-gray-600 hover:border-purple-300 hover:text-purple-600"
                            }`}
                          >
                            {type.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Expertise Areas</label>
                      <div className="grid grid-cols-2 gap-2">
                        {expertiseOptions.map((expertise) => (
                          <button
                            type="button"
                            key={expertise.id}
                            onClick={() => toggleExpertise(expertise.id)}
                            className={`w-full px-4 py-3 rounded-xl font-semibold text-sm transition-all text-center ${
                              selectedExpertise.includes(expertise.id)
                                ? "bg-purple-600 text-white shadow-md shadow-purple-500/20"
                                : "bg-white border border-gray-200 text-gray-600 hover:border-purple-300 hover:text-purple-600"
                            }`}
                          >
                            {expertise.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Years of Experience</label>
                      <input
                        type="text"
                        value={formData.yearsExperience}
                        onChange={(e) => handleInputChange("yearsExperience", e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                        placeholder="e.g. 10"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Hourly Rate (USD)</label>
                      <input
                        type="text"
                        value={formData.hourlyRate}
                        onChange={(e) => handleInputChange("hourlyRate", e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                        placeholder="e.g. 150"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Certifications</label>
                      <input
                        type="text"
                        value={formData.certifications}
                        onChange={(e) => handleInputChange("certifications", e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                        placeholder="e.g. CPA, EA, CFP"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Bio</label>
                      <textarea
                        value={formData.bio}
                        onChange={(e) => handleInputChange("bio", e.target.value)}
                        rows={4}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                        placeholder="Share your specialties, experience, and how you help clients."
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3">
                  <Link
                    href="/find-tax-experts"
                    className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:border-purple-300 hover:text-purple-600 transition-colors"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-xl font-semibold transition-colors shadow-md shadow-purple-500/20"
                  >
                    Submit Profile
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
