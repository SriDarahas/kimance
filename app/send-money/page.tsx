"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type DeliveryMethod = "bank" | "mobile" | "crypto";

interface Recipient {
  id: string;
  name: string;
  icon: string;
  color: string;
}

const recipients: Recipient[] = [
  { id: "1", name: "Organika", icon: "storefront", color: "green" },
  { id: "2", name: "APZ Sports", icon: "fitness_center", color: "blue" },
  { id: "3", name: "Jane Doe", icon: "JD", color: "orange" },
];

export default function SendMoney() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedRecipient, setSelectedRecipient] = useState<string | null>(null);
  const [sendAmount, setSendAmount] = useState("1000.00");
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>("bank");
  const [searchQuery, setSearchQuery] = useState("");

  const exchangeRate = 1.3645;
  const fee = 4.5;
  const receiveAmount = (parseFloat(sendAmount || "0") * exchangeRate).toFixed(2);
  const totalToPay = (parseFloat(sendAmount || "0") + fee).toFixed(2);

  const handleContinue = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (step: number) => {
    if (step <= currentStep) {
      setCurrentStep(step);
    }
  };

  const getDeliveryTime = () => {
    switch (deliveryMethod) {
      case "bank":
        return "By Tomorrow, 10 AM";
      case "mobile":
        return "Instant";
      case "crypto":
        return "~10 Minutes";
    }
  };

  return (
    <div className="bg-[#F3F4F6] text-gray-800 font-[family-name:var(--font-inter)] min-h-screen flex overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex-shrink-0 flex-col hidden md:flex h-screen sticky top-0">
        <div className="p-6 flex items-center gap-2">
          <Image
            src="/icon.png"
            alt="Kimance Logo"
            width={36}
            height={36}
            className="rounded"
          />
          <span className="font-[family-name:var(--font-playfair)] text-2xl text-[#6D28D9] font-bold tracking-tight">
            Kimance
          </span>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-2">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-2.5 text-gray-500 hover:bg-gray-100 rounded-xl font-medium transition-colors text-sm"
          >
            <span className="material-icons-outlined text-xl">dashboard</span>
            Dashboard
          </Link>
          <Link
            href="#"
            className="flex items-center gap-3 px-4 py-2.5 text-gray-500 hover:bg-gray-100 rounded-xl font-medium transition-colors text-sm"
          >
            <span className="material-icons-outlined text-xl">account_balance_wallet</span>
            My Wallets
          </Link>
          <Link
            href="#"
            className="flex items-center gap-3 px-4 py-2.5 bg-[#6D28D9]/10 text-[#6D28D9] rounded-xl font-medium text-sm"
          >
            <span className="material-icons-outlined text-xl">receipt_long</span>
            Transactions
          </Link>
          <Link
            href="#"
            className="flex items-center gap-3 px-4 py-2.5 text-gray-500 hover:bg-gray-100 rounded-xl font-medium transition-colors text-sm"
          >
            <span className="material-icons-outlined text-xl">pie_chart</span>
            Budgeting
            <span className="ml-auto text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
              New
            </span>
          </Link>
          <Link
            href="/settings"
            className="flex items-center gap-3 px-4 py-2.5 text-gray-500 hover:bg-gray-100 rounded-xl font-medium transition-colors text-sm"
          >
            <span className="material-icons-outlined text-xl">settings</span>
            Settings
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <Link href="/settings" className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-gray-100 cursor-pointer transition-colors">
            <Image
              alt="User Avatar"
              className="w-9 h-9 rounded-full border-2 border-white shadow-sm"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDbXr3DDLyxloYuvfePJxu5u_hv5Cs48XjznWxqit9UDCu3ZjK-6DvfuZpUVWckI1hULyWPmPiYiSljlJWnD4IjiTIh9A1r34OIX50pAiJfo0y_aHeaghYxBGWbr56WXXVKT9W9QXf76NVUJrFN6xVMIrdJ1tieKJwnv3btBt7elx5wSd-rpA1aMGe55bn_MzhWKVZBOwGzimrfK1uYadc4hPe-43-mO4aaoBlFaxDzJKuUu2hchBJrA8TqiATMsFxACVKb3EY0uwZZ"
              width={36}
              height={36}
            />
            <div className="flex flex-col text-left">
              <span className="text-sm font-semibold text-gray-900">Yanis M.</span>
              <span className="text-xs text-gray-500">Pro Member</span>
            </div>
            <span className="material-icons-outlined ml-auto text-gray-400 text-xl">
              expand_more
            </span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        {/* Header */}
        <header className="h-16 px-6 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-20 border-b border-gray-200">
          <div>
            <h1 className="font-[family-name:var(--font-playfair)] text-xl font-semibold text-gray-900">
              Send Money
            </h1>
            <p className="text-xs text-gray-500">Fast, secure transfers with smart routing</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="w-9 h-9 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-500 hover:text-[#6D28D9] transition-colors relative shadow-sm">
              <span className="material-icons-outlined text-xl">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            <button className="md:hidden w-9 h-9 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-500">
              <span className="material-icons-outlined text-xl">menu</span>
            </button>
          </div>
        </header>

        {/* Send Money Content */}
        <div className="p-6 max-w-6xl mx-auto w-full">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left Column - Main Form */}
            <div className="flex-1">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                {/* Steps Indicator */}
                <div className="flex items-center justify-between mb-8 relative">
                  <div className="absolute left-0 top-4 w-full h-0.5 bg-gray-200 -z-10"></div>
                  <div
                    className="absolute left-0 top-4 h-0.5 bg-[#6D28D9] -z-10 transition-all duration-300"
                    style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
                  ></div>

                  {[
                    { num: 1, label: "Recipient" },
                    { num: 2, label: "Amount" },
                    { num: 3, label: "Method" },
                    { num: 4, label: "Confirm" },
                  ].map((step) => (
                    <button
                      key={step.num}
                      onClick={() => handleStepClick(step.num)}
                      className={`flex flex-col items-center ${
                        step.num <= currentStep ? "cursor-pointer" : "cursor-not-allowed"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                          step.num <= currentStep
                            ? "bg-[#6D28D9] text-white"
                            : "bg-gray-200 text-gray-500"
                        }`}
                      >
                        {step.num < currentStep ? (
                          <span className="material-icons-outlined text-sm">check</span>
                        ) : (
                          step.num
                        )}
                      </div>
                      <span
                        className={`text-xs mt-2 font-medium ${
                          step.num <= currentStep ? "text-[#6D28D9]" : "text-gray-400"
                        }`}
                      >
                        {step.label}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Step 1: Recipient */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-2">
                        Select Recipient
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                          <span className="material-icons-outlined">search</span>
                        </span>
                        <input
                          className="block w-full pl-10 pr-20 py-3 border border-gray-200 rounded-xl bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6D28D9] focus:border-transparent text-sm"
                          placeholder="Search name, email or tag"
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#6D28D9] font-medium text-sm hover:text-[#5A24B3]">
                          + Add New
                        </button>
                      </div>
                      <div className="mt-4 flex gap-4 overflow-x-auto pb-2">
                        {recipients.map((recipient) => (
                          <button
                            key={recipient.id}
                            onClick={() => setSelectedRecipient(recipient.id)}
                            className={`flex flex-col items-center min-w-[70px] group`}
                          >
                            <div
                              className={`w-14 h-14 rounded-full flex items-center justify-center mb-2 border-2 transition-colors ${
                                selectedRecipient === recipient.id
                                  ? "border-[#6D28D9]"
                                  : "border-transparent group-hover:border-[#6D28D9]"
                              } ${
                                recipient.color === "green"
                                  ? "bg-green-100"
                                  : recipient.color === "blue"
                                  ? "bg-blue-100"
                                  : "bg-orange-100"
                              }`}
                            >
                              {recipient.icon.length <= 2 ? (
                                <span
                                  className={`font-bold ${
                                    recipient.color === "orange"
                                      ? "text-orange-600"
                                      : ""
                                  }`}
                                >
                                  {recipient.icon}
                                </span>
                              ) : (
                                <span
                                  className={`material-icons-outlined ${
                                    recipient.color === "green"
                                      ? "text-green-600"
                                      : "text-blue-600"
                                  }`}
                                >
                                  {recipient.icon}
                                </span>
                              )}
                            </div>
                            <span className="text-xs font-medium text-center truncate w-full">
                              {recipient.name}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Amount */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div className="bg-[#F3F4F6] p-4 rounded-xl border border-gray-200 relative overflow-hidden">
                      <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-500 to-[#6D28D9] text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg flex items-center gap-1">
                        <span className="material-icons-outlined text-xs">bolt</span> Smart Routing
                      </div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        You Send
                      </label>
                      <div className="flex items-center justify-between">
                        <input
                          className="bg-transparent border-none text-3xl font-bold text-gray-900 p-0 focus:outline-none focus:ring-0 w-1/2"
                          placeholder="0.00"
                          type="number"
                          value={sendAmount}
                          onChange={(e) => setSendAmount(e.target.value)}
                        />
                        <button className="flex items-center gap-2 bg-white rounded-lg p-1.5 shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors">
                          <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                            $
                          </div>
                          <span className="font-bold text-sm">USD</span>
                          <span className="material-icons-outlined text-gray-400 text-sm">
                            expand_more
                          </span>
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-center -my-4 relative z-10">
                      <div className="bg-white border border-gray-200 rounded-full p-2 shadow-sm">
                        <span className="material-icons-outlined text-[#6D28D9]">
                          arrow_downward
                        </span>
                      </div>
                    </div>

                    <div className="bg-[#F3F4F6] p-4 rounded-xl border border-gray-200">
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Recipient Gets
                      </label>
                      <div className="flex items-center justify-between">
                        <input
                          className="bg-transparent border-none text-3xl font-bold text-gray-900 p-0 focus:outline-none focus:ring-0 w-1/2"
                          readOnly
                          type="text"
                          value={receiveAmount}
                        />
                        <button className="flex items-center gap-2 bg-white rounded-lg p-1.5 shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors">
                          <div className="w-6 h-6 rounded-full bg-red-600 flex items-center justify-center text-white text-xs font-bold">
                            $
                          </div>
                          <span className="font-bold text-sm">CAD</span>
                          <span className="material-icons-outlined text-gray-400 text-sm">
                            expand_more
                          </span>
                        </button>
                      </div>
                      <div className="mt-2 flex items-center gap-1 text-xs text-green-600">
                        <span className="material-icons-outlined text-sm">trending_up</span>
                        <span>Rate guaranteed for 24 hours</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Delivery Method */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-3">
                        Delivery Method
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <button
                          onClick={() => setDeliveryMethod("bank")}
                          className={`border-2 rounded-xl p-4 flex flex-col items-center justify-center text-center h-24 relative transition-all ${
                            deliveryMethod === "bank"
                              ? "border-[#6D28D9] bg-purple-50"
                              : "border-gray-200 bg-white hover:border-[#6D28D9]"
                          }`}
                        >
                          {deliveryMethod === "bank" && (
                            <div className="absolute top-2 right-2 text-[#6D28D9]">
                              <span className="material-icons-outlined text-sm">check_circle</span>
                            </div>
                          )}
                          <span
                            className={`material-icons-outlined mb-1 ${
                              deliveryMethod === "bank" ? "text-[#6D28D9]" : "text-gray-500"
                            }`}
                          >
                            account_balance
                          </span>
                          <span
                            className={`text-sm font-bold ${
                              deliveryMethod === "bank" ? "text-[#6D28D9]" : "text-gray-900"
                            }`}
                          >
                            Bank Transfer
                          </span>
                          <span
                            className={`text-[10px] ${
                              deliveryMethod === "bank" ? "text-[#6D28D9]/70" : "text-gray-500"
                            }`}
                          >
                            1-2 Days
                          </span>
                        </button>

                        <button
                          onClick={() => setDeliveryMethod("mobile")}
                          className={`border-2 rounded-xl p-4 flex flex-col items-center justify-center text-center h-24 relative transition-all ${
                            deliveryMethod === "mobile"
                              ? "border-[#6D28D9] bg-purple-50"
                              : "border-gray-200 bg-white hover:border-[#6D28D9]"
                          }`}
                        >
                          {deliveryMethod === "mobile" && (
                            <div className="absolute top-2 right-2 text-[#6D28D9]">
                              <span className="material-icons-outlined text-sm">check_circle</span>
                            </div>
                          )}
                          <span
                            className={`material-icons-outlined mb-1 ${
                              deliveryMethod === "mobile" ? "text-[#6D28D9]" : "text-gray-500"
                            }`}
                          >
                            smartphone
                          </span>
                          <span
                            className={`text-sm font-bold ${
                              deliveryMethod === "mobile" ? "text-[#6D28D9]" : "text-gray-900"
                            }`}
                          >
                            Mobile Money
                          </span>
                          <span
                            className={`text-[10px] ${
                              deliveryMethod === "mobile" ? "text-[#6D28D9]/70" : "text-gray-500"
                            }`}
                          >
                            Instant
                          </span>
                        </button>

                        <button
                          onClick={() => setDeliveryMethod("crypto")}
                          className={`border-2 rounded-xl p-4 flex flex-col items-center justify-center text-center h-24 relative transition-all ${
                            deliveryMethod === "crypto"
                              ? "border-[#6D28D9] bg-purple-50"
                              : "border-gray-200 bg-white hover:border-[#6D28D9]"
                          }`}
                        >
                          {deliveryMethod === "crypto" && (
                            <div className="absolute top-2 right-2 text-[#6D28D9]">
                              <span className="material-icons-outlined text-sm">check_circle</span>
                            </div>
                          )}
                          <span
                            className={`material-icons-outlined mb-1 ${
                              deliveryMethod === "crypto" ? "text-[#6D28D9]" : "text-gray-500"
                            }`}
                          >
                            currency_bitcoin
                          </span>
                          <span
                            className={`text-sm font-bold ${
                              deliveryMethod === "crypto" ? "text-[#6D28D9]" : "text-gray-900"
                            }`}
                          >
                            Crypto
                          </span>
                          <span
                            className={`text-[10px] ${
                              deliveryMethod === "crypto" ? "text-[#6D28D9]/70" : "text-gray-500"
                            }`}
                          >
                            ~10 Mins
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Confirm */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
                      <span className="material-icons-outlined text-green-600">check_circle</span>
                      <div>
                        <h4 className="font-semibold text-green-800 text-sm">Ready to Send</h4>
                        <p className="text-xs text-green-700 mt-1">
                          Please review your transfer details below before confirming.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-500">Recipient</span>
                        <span className="text-sm font-medium text-gray-900">
                          {recipients.find((r) => r.id === selectedRecipient)?.name || "Selected Recipient"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-500">You Send</span>
                        <span className="text-sm font-medium text-gray-900">${sendAmount} USD</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-500">They Receive</span>
                        <span className="text-sm font-medium text-gray-900">${receiveAmount} CAD</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-500">Delivery Method</span>
                        <span className="text-sm font-medium text-gray-900 capitalize">
                          {deliveryMethod === "bank"
                            ? "Bank Transfer"
                            : deliveryMethod === "mobile"
                            ? "Mobile Money"
                            : "Crypto"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-sm text-gray-500">Arrival Time</span>
                        <span className="text-sm font-medium text-green-600">{getDeliveryTime()}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex gap-3 mt-8">
                  {currentStep > 1 && (
                    <button
                      onClick={handleBack}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
                    >
                      <span className="material-icons-outlined text-lg">arrow_back</span>
                      Back
                    </button>
                  )}
                  <button
                    onClick={handleContinue}
                    disabled={currentStep === 1 && !selectedRecipient}
                    className={`flex-1 bg-[#6D28D9] hover:bg-[#5A24B3] text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-purple-200 transition-all flex items-center justify-center gap-2 text-sm ${
                      currentStep === 1 && !selectedRecipient
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:-translate-y-0.5"
                    }`}
                  >
                    {currentStep === 4 ? "Confirm & Send" : "Continue"}
                    <span className="material-icons-outlined text-lg">
                      {currentStep === 4 ? "check" : "arrow_forward"}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column - Rate & Breakdown */}
            <div className="w-full lg:w-80 space-y-4">
              {/* Live FX Rate Card */}
              <div className="bg-gray-900 text-white rounded-2xl p-5 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500 rounded-full filter blur-3xl opacity-20 -mr-8 -mt-8"></div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-[family-name:var(--font-playfair)] text-lg font-medium">
                      Live FX Rate
                    </h3>
                    <p className="text-gray-400 text-xs mt-0.5">Updates every 30s</p>
                  </div>
                  <div className="bg-white/10 p-1.5 rounded-lg backdrop-blur-sm">
                    <span className="material-icons-outlined text-purple-300 text-lg">
                      show_chart
                    </span>
                  </div>
                </div>
                <div className="flex items-end gap-2 mb-1">
                  <span className="text-3xl font-bold tracking-tight">1.3645</span>
                  <span className="text-xs font-medium mb-1 text-green-400 flex items-center">
                    <span className="material-icons-outlined text-xs">arrow_drop_up</span> +0.4%
                  </span>
                </div>
                <p className="text-xs text-gray-400 mb-4">USD / CAD</p>
                <div className="flex items-end gap-1 h-10 w-full">
                  <div className="w-full bg-gray-800 rounded-t-sm h-[40%]"></div>
                  <div className="w-full bg-gray-800 rounded-t-sm h-[60%]"></div>
                  <div className="w-full bg-gray-800 rounded-t-sm h-[30%]"></div>
                  <div className="w-full bg-gray-800 rounded-t-sm h-[50%]"></div>
                  <div className="w-full bg-gray-800 rounded-t-sm h-[70%]"></div>
                  <div className="w-full bg-purple-500 rounded-t-sm h-[90%] shadow-[0_0_10px_rgba(168,85,247,0.5)]"></div>
                </div>
              </div>

              {/* Transaction Breakdown */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <h4 className="font-bold text-base mb-4 text-gray-900">Transaction Breakdown</h4>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Transfer Fee</span>
                    <span className="font-medium text-gray-900">${fee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Exchange Rate</span>
                    <span className="font-medium text-gray-900">1 USD = {exchangeRate} CAD</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Arrival Time</span>
                    <span className="font-medium text-green-600">{getDeliveryTime()}</span>
                  </div>
                </div>
                <hr className="my-4 border-gray-100" />
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-900 text-sm">Total to Pay</span>
                  <span className="font-[family-name:var(--font-playfair)] font-bold text-xl text-[#6D28D9]">
                    ${totalToPay}
                  </span>
                </div>
                <div className="mt-4 bg-blue-50 p-3 rounded-lg flex gap-2 items-start">
                  <span className="material-icons-outlined text-blue-600 text-lg mt-0.5">
                    verified_user
                  </span>
                  <p className="text-xs text-blue-800 leading-relaxed">
                    Your transaction is protected by Kimance SecureGuard™. We use bank-level
                    encryption.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
