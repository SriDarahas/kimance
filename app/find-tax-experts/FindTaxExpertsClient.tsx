"use client";

import { useState } from "react";
import Sidebar from "@/app/components/Sidebar";
import { useLanguage } from "@/app/providers/LanguageProvider";
import { getTranslation } from "@/lib/i18n";

interface FindTaxExpertsClientProps {
  userName: string;
  userEmail: string;
}

const serviceTypes = [
  { id: "personal", key: "personal" },
  { id: "business", key: "business" },
];

const expertiseOptions = [
  { id: "crypto", key: "cryptoTax" },
  { id: "expats", key: "expats" },
  { id: "audit", key: "audit" },
  { id: "small-biz", key: "smallBiz" },
  { id: "freelancers", key: "freelancers" },
  { id: "corporate", key: "corporate" },
];

const taxExperts = [
  {
    id: 1,
    name: "Sarah Jenkins, CPA",
    location: "Toronto, ON",
    rating: 4.9,
    reviews: 120,
    hourlyRate: "$150",
    description: "Specializing in small business tax returns and audit defense. Over 10 years of experience with CRA negotiations and complex filings.",
    descriptionKey: "sarahDescription",
    tags: ["individual", "auditDefense", "bookkeeping"],
    verified: true,
    online: true,
    initials: null,
    image: "SJ",
    serviceType: "personal",
    expertise: ["audit", "small-biz"],
  },
  {
    id: 2,
    name: "Michael Chen, EA",
    location: "Vancouver, BC",
    rating: 5.0,
    reviews: 45,
    hourlyRate: "$200",
    description: "Expert Enrolled Agent focused on cryptocurrency taxation and international expat tax compliance. Let's simplify your crypto portfolio.",
    descriptionKey: "michaelDescription",
    tags: ["cryptoTax", "internationalTax", "investments"],
    verified: true,
    online: false,
    initials: null,
    image: "MC",
    featured: "cryptoTax",
    serviceType: "personal",
    expertise: ["crypto", "expats"],
  },
  {
    id: 3,
    name: "Apex Partners LLC",
    location: "Montreal, QC",
    rating: 4.8,
    reviews: 210,
    hourlyRate: "Custom",
    description: "Full-service accounting firm for mid-sized businesses. We handle payroll, corporate tax, and strategic financial planning.",
    descriptionKey: "apexDescription",
    tags: ["corporateTax", "payroll", "strategy"],
    verified: true,
    online: false,
    initials: "AP",
    image: null,
    serviceType: "business",
    expertise: ["corporate", "small-biz"],
  },
  {
    id: 4,
    name: "Elena Rodriguez, CPA",
    location: "Calgary, AB",
    rating: 5.0,
    reviews: 88,
    hourlyRate: "$135",
    description: "Helping freelancers and creative professionals navigate taxes. Maximize your deductions with a personalized approach.",
    descriptionKey: "elenaDescription",
    tags: ["freelancers", "creatives", "deductions"],
    verified: true,
    online: true,
    initials: null,
    image: "ER",
    serviceType: "personal",
    expertise: ["freelancers"],
  },
  {
    id: 5,
    name: "David Kim, CPA",
    location: "Ottawa, ON",
    rating: 4.7,
    reviews: 156,
    hourlyRate: "$175",
    description: "Corporate tax specialist with expertise in R&D tax credits and international business structures.",
    descriptionKey: "davidDescription",
    tags: ["corporateTax", "rdCredits", "internationalTax"],
    verified: true,
    online: true,
    initials: null,
    image: "DK",
    serviceType: "business",
    expertise: ["corporate", "expats"],
  },
  {
    id: 6,
    name: "Amanda Foster, EA",
    location: "Edmonton, AB",
    rating: 4.9,
    reviews: 92,
    hourlyRate: "$160",
    description: "Audit defense specialist with 15+ years helping individuals and small businesses navigate CRA audits.",
    descriptionKey: "amandaDescription",
    tags: ["auditDefense", "taxPlanning", "individual"],
    verified: true,
    online: false,
    initials: null,
    image: "AF",
    serviceType: "personal",
    expertise: ["audit", "small-biz"],
  },
];

export default function FindTaxExpertsClient({ userName, userEmail }: FindTaxExpertsClientProps) {
  const { language } = useLanguage();
  const t = (key: any, vars?: Record<string, string>) => getTranslation(language, key, vars);
  const [serviceType, setServiceType] = useState("personal");
  const [selectedExpertise, setSelectedExpertise] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");

  const toggleExpertise = (id: string) => {
    setSelectedExpertise((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
    );
  };

  const resetFilters = () => {
    setServiceType("personal");
    setSelectedExpertise([]);
    setSearchQuery("");
    setLocationQuery("");
  };

  const filteredExperts = taxExperts.filter((expert) => {
    // Filter by service type
    const matchesServiceType = expert.serviceType === serviceType;
    
    // Filter by expertise (if any selected, expert must have at least one matching)
    const matchesExpertise = selectedExpertise.length === 0 || 
      selectedExpertise.some((exp) => expert.expertise.includes(exp));
    
    // Filter by search query (name, description, or tags)
    const matchesSearch = searchQuery === "" ||
      expert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expert.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expert.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Filter by location
    const matchesLocation = locationQuery === "" ||
      expert.location.toLowerCase().includes(locationQuery.toLowerCase());
    
    return matchesServiceType && matchesExpertise && matchesSearch && matchesLocation;
  });

  return (
    <div className="bg-gray-100 text-gray-800 font-sans min-h-screen flex overflow-hidden">
      <Sidebar userName={userName} userEmail={userEmail} />

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        {/* Header */}
        <header className="h-20 px-6 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-20 border-b border-gray-200 py-10">
          <div>
            <h1 className="font-serif text-2xl font-bold text-gray-900">
              {t('findTaxExperts')}
            </h1>
            <p className="text-sm text-gray-500">{t('browseQualified')}</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="w-9 h-9 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-500 hover:text-purple-600 transition-colors relative shadow-sm">
              <span className="material-icons-outlined text-xl">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            <button className="md:hidden w-9 h-9 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-500">
              <span className="material-icons-outlined text-xl">menu</span>
            </button>
          </div>
        </header>

        {/* Find Tax Experts Content */}
        <div className="p-6 max-w-6xl mx-auto w-full space-y-6">
          {/* Horizontal Filter Bar */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex flex-wrap items-center gap-4">
              {/* Service Type Toggle */}
              <div className="flex bg-gray-100 p-1 rounded-full">
                {serviceTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setServiceType(type.id)}
                    className={`py-2 px-4 rounded-full text-base font-medium transition-all ${
                      serviceType === type.id
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    {t(type.key)}
                  </button>
                ))}
              </div>

              {/* Divider */}
              <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>

              {/* Location */}
              <div className="flex items-center gap-2">
                <div className="relative">
                  <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">public</span>
                  <select className="pl-10 pr-4 py-2 bg-gray-100 border-none rounded-xl text-base focus:ring-2 focus:ring-purple-600 text-gray-700">
                    <option>{t('canada')}</option>
                    <option>{t('unitedStates')}</option>
                    <option>{t('unitedKingdom')}</option>
                  </select>
                </div>
                <div className="relative">
                  <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">location_city</span>
                  <input
                    type="text"
                    value={locationQuery ?? ""}
                    onChange={(e) => setLocationQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-gray-100 border-none rounded-xl text-base focus:ring-2 focus:ring-purple-600 text-gray-700 placeholder-gray-400 w-40"
                    placeholder={t('cityOrPostal')}
                  />
                </div>
              </div>

              {/* Divider */}
              <div className="h-8 w-px bg-gray-200 hidden lg:block"></div>

              {/* Expertise Tags */}
              <div className="flex flex-wrap gap-2">
                {expertiseOptions.map((expertise) => (
                  <button
                    key={expertise.id}
                    onClick={() => toggleExpertise(expertise.id)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      selectedExpertise.includes(expertise.id)
                        ? "bg-purple-100 text-purple-600 border border-purple-200"
                        : "bg-gray-100 text-gray-600 border border-transparent hover:bg-purple-50 hover:text-purple-600 hover:border-purple-200"
                    }`}
                  >
                    {t(expertise.key)}
                  </button>
                ))}
              </div>

              {/* Reset */}
              <button 
                onClick={resetFilters}
                className="text-sm text-purple-600 font-medium hover:underline ml-auto"
              >
                {t('reset')}
              </button>
            </div>
          </div>

          {/* Header & View Toggle */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">{t('taxExpertsCanada')}</h2>
              <p className="text-gray-500">{t(filteredExperts.length !== 1 ? 'showingExpertsPlural' : 'showingExperts', { count: filteredExperts.length.toString() })}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex bg-white p-1 rounded-full border border-gray-200 shadow-sm">
                <button
                  onClick={() => setViewMode("list")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    viewMode === "list"
                      ? "bg-purple-600 text-white shadow-sm"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  <span className="material-icons-outlined text-base">grid_view</span>
                  {t('listView')}
                </button>
                <button
                  onClick={() => setViewMode("map")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    viewMode === "map"
                      ? "bg-purple-600 text-white shadow-sm"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  <span className="material-icons-outlined text-base">map</span>
                  {t('mapView')}
                </button>
              </div>
            </div>
          </div>

          {/* Expert Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredExperts.map((expert) => (
              <div
                key={expert.id}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow duration-300 group flex flex-col h-full"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      {expert.initials ? (
                        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl border-2 border-white shadow-md">
                          {expert.initials}
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-xl border-2 border-white shadow-md">
                          {expert.image}
                        </div>
                      )}
                      {expert.online && (
                        <div className="absolute -bottom-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                        {expert.name}
                      </h3>
                      <div className="flex items-center gap-1 text-sm text-gray-500 mb-1">
                        <span className="material-icons-outlined text-sm">location_on</span>
                        {expert.location}
                      </div>
                      {expert.verified && (
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-100 text-purple-600 text-xs font-semibold border border-purple-200">
                          <span className="material-icons-outlined text-xs">verified</span>
                          {t('verifiedByKimance')}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="flex items-center gap-1 text-yellow-500 font-bold">
                      {expert.rating}
                      <span className="material-icons text-sm">star</span>
                    </div>
                    <span className="text-xs text-gray-400">({expert.reviews} {t('reviews')})</span>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-6 line-clamp-2">
                  {expert.descriptionKey ? t(expert.descriptionKey) : expert.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {expert.tags.map((tag, index) => (
                    <span
                      key={index}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        (expert.featured && expert.featured === tag)
                          ? "bg-purple-50 text-purple-600 border border-purple-100"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {t(tag)}
                    </span>
                  ))}
                </div>

                <div className="mt-auto pt-6 border-t border-gray-100 flex items-center justify-between gap-4">
                  <div className="text-gray-900 font-bold text-lg">
                    {expert.hourlyRate}
                    {expert.hourlyRate !== "Custom" && (
                      <span className="text-sm font-medium text-gray-500">{t('hourly')}</span>
                    )}
                    {expert.hourlyRate === "Custom" && (
                      <span className="text-sm font-medium text-gray-500"> {t('pricingCustom')}</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-purple-600 hover:border-purple-600 transition-colors">
                      <span className="material-icons-outlined text-lg">favorite_border</span>
                    </button>
                    <button className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-full text-sm font-bold shadow-md shadow-purple-500/20 transition-all">
                      {t('requestQuote')}
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* CTA Banner */}
            <div className="bg-gray-900 rounded-xl p-6 flex flex-col items-center justify-center text-center relative overflow-hidden group md:col-span-2 min-h-40">
              <div className="absolute inset-0 bg-purple-600/20"></div>
              <div className="relative z-10 max-w-lg">
                <h3 className="text-2xl font-bold text-white mb-2">{t('areYouTaxPro')}</h3>
                <p className="text-gray-300 text-sm mb-4">{t('joinExperts')}</p>
                <button className="bg-white text-gray-900 hover:bg-gray-100 px-6 py-2 rounded-full text-sm font-bold transition-colors">
                  {t('createPartnerProfile')}
                </button>
              </div>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex justify-center pt-6">
            <nav className="flex items-center gap-2">
              <button className="h-10 w-10 flex items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50">
                <span className="material-icons-outlined text-sm">chevron_left</span>
              </button>
              <button className="h-10 w-10 flex items-center justify-center rounded-full bg-purple-600 text-white font-medium shadow-md shadow-purple-500/20">
                1
              </button>
              <button className="h-10 w-10 flex items-center justify-center rounded-full border border-transparent hover:bg-gray-50 text-gray-600">
                2
              </button>
              <button className="h-10 w-10 flex items-center justify-center rounded-full border border-transparent hover:bg-gray-50 text-gray-600">
                3
              </button>
              <span className="text-gray-400 px-2">...</span>
              <button className="h-10 w-10 flex items-center justify-center rounded-full border border-transparent hover:bg-gray-50 text-gray-600">
                12
              </button>
              <button className="h-10 w-10 flex items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50">
                <span className="material-icons-outlined text-sm">chevron_right</span>
              </button>
            </nav>
          </div>
        </div>
      </main>
    </div>
  );
}
