"use client";

import { useState } from "react";
import Link from "next/link";
import Sidebar from "@/app/components/Sidebar";

interface PostListingClientProps {
  userName: string;
  userEmail: string;
  isAdmin?: boolean;
}

const steps = [
  { id: 1, label: "Details" },
  { id: 2, label: "Market" },
  { id: 3, label: "Commission" },
  { id: 4, label: "Compliance" },
];

const categories = [
  "Credit Card",
  "Personal Loan",
  "High-Yield Savings",
  "Mortgage Refinance",
  "Business Loan",
  "Crypto Staking",
  "Insurance",
];

export default function PostListingClient({ userName, userEmail, isAdmin = false }: PostListingClientProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    productName: "",
    category: "Credit Card",
    providerName: "",
    apr: "",
    introOffer: "",
    annualFee: "",
    tagline: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="bg-gray-100 text-gray-800 font-sans min-h-screen flex overflow-hidden">
      <Sidebar userName={userName} userEmail={userEmail} isAdmin={isAdmin} />

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 px-6 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-20 border-b border-gray-200 shrink-0">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/marketplace" className="hover:text-purple-600 transition-colors">Marketplace</Link>
            <span className="material-icons-outlined text-xs">chevron_right</span>
            <span className="text-purple-600 font-medium">New Listing</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-400 font-medium flex items-center gap-1">
              <span className="material-icons-outlined text-sm">cloud_done</span> Auto-saved
            </span>
            <button className="w-9 h-9 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-500 hover:text-purple-600 transition-colors relative shadow-sm">
              <span className="material-icons-outlined text-xl">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
            {/* Left Column: Form Wizard */}
            <div className="flex-1 flex flex-col gap-6">
              {/* Progress Stepper */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex justify-between items-start">
                  {steps.map((step, index) => (
                    <div key={step.id} className="flex items-start flex-1">
                      <div 
                        className={`flex flex-col items-center cursor-pointer ${
                          step.id > currentStep ? "opacity-50" : ""
                        }`}
                        onClick={() => step.id <= currentStep && setCurrentStep(step.id)}
                      >
                        <div 
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mb-2 transition-all ${
                            step.id === currentStep
                              ? "bg-purple-600 text-white shadow-lg shadow-purple-500/30"
                              : step.id < currentStep
                              ? "bg-purple-600 text-white"
                              : "bg-gray-100 border border-gray-300 text-gray-500"
                          }`}
                        >
                          {step.id < currentStep ? (
                            <span className="material-icons text-sm">check</span>
                          ) : (
                            step.id
                          )}
                        </div>
                        <span 
                          className={`text-xs font-medium text-center leading-tight ${
                            step.id === currentStep ? "text-purple-600 font-semibold" : "text-gray-500"
                          }`}
                        >
                          {step.label}
                        </span>
                      </div>
                      {index < steps.length - 1 && (
                        <div 
                          className={`flex-1 h-0.5 mx-3 mt-4 ${
                            step.id < currentStep ? "bg-purple-600" : "bg-gray-200"
                          }`}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Step Content */}
              <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-gray-100 flex-1">
                {currentStep === 1 && (
                  <>
                    <div className="mb-8">
                      <h1 className="text-2xl font-bold text-gray-900 mb-2">Product Details</h1>
                      <p className="text-gray-500">Enter the core information for your financial product. This will be the main display on the marketplace.</p>
                    </div>

                    <form className="space-y-6">
                      {/* Product Name */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="product-name">
                          Product Name
                        </label>
                        <input
                          type="text"
                          id="product-name"
                          value={formData.productName}
                          onChange={(e) => handleInputChange("productName", e.target.value)}
                          placeholder="e.g. Kimance Platinum Rewards Card"
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all placeholder-gray-400"
                        />
                      </div>

                      {/* Product Type */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Product Category
                          </label>
                          <select
                            value={formData.category}
                            onChange={(e) => handleInputChange("category", e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all cursor-pointer"
                          >
                            {categories.map((cat) => (
                              <option key={cat} value={cat}>{cat}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Provider Name
                          </label>
                          <input
                            type="text"
                            value={formData.providerName}
                            onChange={(e) => handleInputChange("providerName", e.target.value)}
                            placeholder="Your company name"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all placeholder-gray-400"
                          />
                        </div>
                      </div>

                      {/* Key Metrics */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            APR / APY (%)
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              value={formData.apr}
                              onChange={(e) => handleInputChange("apr", e.target.value)}
                              placeholder="0.00"
                              className="w-full pl-4 pr-8 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all placeholder-gray-400"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">%</span>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Intro Offer
                          </label>
                          <input
                            type="text"
                            value={formData.introOffer}
                            onChange={(e) => handleInputChange("introOffer", e.target.value)}
                            placeholder="e.g. 0% for 12mo"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all placeholder-gray-400"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Annual Fee
                          </label>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                            <input
                              type="text"
                              value={formData.annualFee}
                              onChange={(e) => handleInputChange("annualFee", e.target.value)}
                              placeholder="0"
                              className="w-full pl-8 pr-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all placeholder-gray-400"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Tagline */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="tagline">
                          Promotional Tagline
                        </label>
                        <textarea
                          id="tagline"
                          value={formData.tagline}
                          onChange={(e) => handleInputChange("tagline", e.target.value)}
                          placeholder="Catchy description (max 140 chars)"
                          rows={3}
                          maxLength={140}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all resize-none placeholder-gray-400"
                        />
                        <div className="flex justify-end mt-1">
                          <span className="text-xs text-gray-400">{formData.tagline.length}/140 characters</span>
                        </div>
                      </div>

                      {/* Image Upload */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Card / Product Image
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group">
                          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                            <span className="material-icons-outlined text-purple-600">cloud_upload</span>
                          </div>
                          <p className="text-sm text-gray-600 font-medium">Click to upload or drag and drop</p>
                          <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB (Recommend 600x400)</p>
                        </div>
                      </div>
                    </form>
                  </>
                )}

                {currentStep === 2 && (
                  <>
                    <div className="mb-8">
                      <h1 className="text-2xl font-bold text-gray-900 mb-2">Market Settings</h1>
                      <p className="text-gray-500">Define your target audience and geographic availability.</p>
                    </div>

                    <form className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Target Countries
                        </label>
                        <select className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all cursor-pointer">
                          <option>Canada</option>
                          <option>United States</option>
                          <option>United Kingdom</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Target Audience
                        </label>
                        <div className="flex flex-wrap gap-3">
                          {["Individuals", "Small Business", "Enterprise", "Students"].map((audience) => (
                            <button
                              key={audience}
                              type="button"
                              className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-purple-50 hover:text-purple-600 hover:border-purple-200 transition-colors"
                            >
                              {audience}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Minimum Credit Score (if applicable)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 650"
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all placeholder-gray-400"
                        />
                      </div>
                    </form>
                  </>
                )}

                {currentStep === 3 && (
                  <>
                    <div className="mb-8">
                      <h1 className="text-2xl font-bold text-gray-900 mb-2">Commission Structure</h1>
                      <p className="text-gray-500">Set up how you'd like to compensate for referrals.</p>
                    </div>

                    <form className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Commission Type
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {[
                            { id: "cpa", label: "CPA", desc: "Cost per acquisition" },
                            { id: "rev-share", label: "Rev Share", desc: "Revenue percentage" },
                            { id: "hybrid", label: "Hybrid", desc: "CPA + Rev Share" },
                          ].map((type) => (
                            <button
                              key={type.id}
                              type="button"
                              className="p-4 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors text-left"
                            >
                              <p className="font-semibold text-gray-900">{type.label}</p>
                              <p className="text-xs text-gray-500">{type.desc}</p>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            CPA Amount
                          </label>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                            <input
                              type="text"
                              placeholder="50.00"
                              className="w-full pl-8 pr-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all placeholder-gray-400"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Rev Share %
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              placeholder="5"
                              className="w-full pl-4 pr-8 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all placeholder-gray-400"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">%</span>
                          </div>
                        </div>
                      </div>
                    </form>
                  </>
                )}

                {currentStep === 4 && (
                  <>
                    <div className="mb-8">
                      <h1 className="text-2xl font-bold text-gray-900 mb-2">Compliance & Terms</h1>
                      <p className="text-gray-500">Upload required documents and agree to listing terms.</p>
                    </div>

                    <form className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Terms & Conditions Document
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                          <span className="material-icons-outlined text-gray-400 text-3xl mb-2">description</span>
                          <p className="text-sm text-gray-600 font-medium">Upload PDF document</p>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Regulatory Disclosures
                        </label>
                        <textarea
                          placeholder="Enter any required regulatory disclosures..."
                          rows={4}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all resize-none placeholder-gray-400"
                        />
                      </div>

                      <div className="space-y-3">
                        <label className="flex items-start gap-3 cursor-pointer">
                          <input type="checkbox" className="mt-1 w-4 h-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500" />
                          <span className="text-sm text-gray-600">
                            I confirm this product complies with all applicable financial regulations in target markets.
                          </span>
                        </label>
                        <label className="flex items-start gap-3 cursor-pointer">
                          <input type="checkbox" className="mt-1 w-4 h-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500" />
                          <span className="text-sm text-gray-600">
                            I agree to Kimance Marketplace <a href="#" className="text-purple-600 hover:underline">Terms of Service</a> and <a href="#" className="text-purple-600 hover:underline">Partner Agreement</a>.
                          </span>
                        </label>
                      </div>
                    </form>
                  </>
                )}

                {/* Action Buttons */}
                <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between items-center">
                  <button className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors">
                    Save Draft
                  </button>
                  <div className="flex gap-3">
                    <button
                      onClick={prevStep}
                      disabled={currentStep === 1}
                      className={`px-6 py-2.5 rounded-lg font-semibold transition-colors ${
                        currentStep === 1
                          ? "text-gray-300 cursor-not-allowed"
                          : "text-gray-500 hover:text-gray-900"
                      }`}
                    >
                      Back
                    </button>
                    {currentStep < 4 ? (
                      <button
                        onClick={nextStep}
                        className="px-8 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow-lg shadow-purple-500/25 transition-all flex items-center gap-2"
                      >
                        Next Step
                        <span className="material-icons-outlined text-sm">arrow_forward</span>
                      </button>
                    ) : (
                      <button className="px-8 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow-lg shadow-purple-500/25 transition-all flex items-center gap-2">
                        Submit for Review
                        <span className="material-icons-outlined text-sm">check</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Live Preview */}
            <div className="w-full lg:w-[400px] shrink-0">
              <div className="sticky top-4">
                <div className="flex items-center justify-between mb-3 px-1">
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Live Preview</h3>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium border border-green-200">Desktop View</span>
                </div>

                <div className="bg-white rounded-xl shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-200">
                  {/* Simulated Browser Header */}
                  <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                    </div>
                    <div className="flex-1 bg-white h-5 rounded-md mx-2"></div>
                  </div>

                  {/* Marketplace Card Preview */}
                  <div className="p-5">
                    <div className="bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5 relative overflow-hidden">
                      {formData.productName && (
                        <div className="absolute top-0 right-0 bg-purple-600 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">NEW</div>
                      )}
                      <div className="flex gap-4">
                        {/* Card Image placeholder */}
                        <div className="w-24 h-16 shrink-0 rounded-md bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center overflow-hidden relative shadow-inner">
                          <div className="absolute inset-0 bg-purple-500/20"></div>
                          <span className="material-icons-outlined text-gray-400 text-2xl">credit_card</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-semibold text-gray-400">
                              {formData.providerName || "Your Company"}
                            </span>
                          </div>
                          <h4 className="font-bold text-gray-900 text-lg leading-tight mb-1 truncate">
                            {formData.productName || "Product Name"}
                          </h4>
                          <div className="flex items-center gap-1 text-amber-500 text-sm mb-2">
                            <span className="material-icons text-base">star</span>
                            <span className="material-icons text-base">star</span>
                            <span className="material-icons text-base">star</span>
                            <span className="material-icons text-base">star</span>
                            <span className="material-icons-outlined text-base">star_half</span>
                            <span className="text-xs text-gray-400 ml-1">(New)</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-3 gap-2 border-t border-b border-gray-100 py-3">
                        <div className="text-center border-r border-gray-100">
                          <p className="text-[10px] uppercase text-gray-400 font-bold tracking-wide">APR</p>
                          <p className="font-bold text-gray-800 text-sm">{formData.apr || "—"}%</p>
                        </div>
                        <div className="text-center border-r border-gray-100">
                          <p className="text-[10px] uppercase text-gray-400 font-bold tracking-wide">Intro</p>
                          <p className="font-bold text-gray-800 text-sm">{formData.introOffer || "—"}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-[10px] uppercase text-gray-400 font-bold tracking-wide">Fee</p>
                          <p className="font-bold text-gray-800 text-sm">${formData.annualFee || "0"}</p>
                        </div>
                      </div>

                      <div className="mt-3">
                        <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                          {formData.tagline || "Your promotional tagline will appear here..."}
                        </p>
                      </div>

                      <div className="mt-4 flex gap-3">
                        <button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold py-2 rounded-lg shadow-sm transition-colors">
                          Apply Now
                        </button>
                        <button className="px-3 py-2 border border-gray-200 rounded-lg text-gray-500 hover:text-purple-600 hover:border-purple-300 transition-colors bg-white">
                          <span className="material-icons-outlined text-sm">bookmark_border</span>
                        </button>
                      </div>

                      <div className="mt-2 text-center">
                        <span className="text-[10px] text-gray-400">See terms and rates</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tips Card */}
                <div className="mt-6 bg-purple-50 rounded-xl p-5 border border-purple-100">
                  <div className="flex gap-3">
                    <span className="material-icons-outlined text-purple-600">tips_and_updates</span>
                    <div>
                      <h4 className="font-bold text-sm text-purple-600 mb-1">Listing Tips</h4>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        Products with an image have a <strong>40% higher click-through rate</strong>. Ensure your tagline highlights the unique selling proposition (USP) clearly.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
