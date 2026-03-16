"use client";

import React, { useState, useEffect } from "react";
import { MapPin, Globe, Building2, Landmark } from "lucide-react";
import { useTranslation } from "@/i18n/LanguageProvider";

// Sample data structure for demonstration
const COUNTRIES_DATA: Record<string, { cities: string[], currency: string, unit: string }> = {
  "United States": {
    cities: ["New York", "Los Angeles", "Chicago", "Houston", "Miami", "San Francisco"],
    currency: "$",
    unit: "ft²"
  },
  "United Kingdom": {
    cities: ["London", "Manchester", "Birmingham", "Glasgow", "Liverpool", "Edinburgh"],
    currency: "£",
    unit: "m²"
  },
  "United Arab Emirates": {
    cities: ["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Ras Al Khaimah"],
    currency: "د.إ",
    unit: "m²"
  },
  "India": {
    cities: ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata"],
    currency: "₹",
    unit: "m²"
  },
  "Canada": {
    cities: ["Toronto", "Vancouver", "Montreal", "Calgary", "Ottawa"],
    currency: "$",
    unit: "ft²"
  },
  "Egypt": {
    cities: ["Cairo", "Alexandria", "Giza", "Luxor", "Aswan", "Sharm El Sheikh"],
    currency: "EGP",
    unit: "m²"
  },
  "Germany": {
    cities: ["Berlin", "Munich", "Hamburg", "Frankfurt", "Cologne"],
    currency: "€",
    unit: "m²"
  },
  "France": {
    cities: ["Paris", "Marseille", "Lyon", "Toulouse", "Nice"],
    currency: "€",
    unit: "m²"
  },
  "Japan": {
    cities: ["Tokyo", "Osaka", "Kyoto", "Yokohama", "Nagoya"],
    currency: "¥",
    unit: "m²"
  },
  "Australia": {
    cities: ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide"],
    currency: "$",
    unit: "m²"
  },
  "Saudi Arabia": {
    cities: ["Riyadh", "Jeddah", "Mecca", "Medina", "Dammam"],
    currency: "SR",
    unit: "m²"
  }
};

interface LocationData {
  country: string;
  city: string;
  area: string;
  currencySymbol: string;
  sizeUnit: string;
}

interface LocationSectionProps {
  onLocationUpdate: (data: LocationData) => void;
}

export default function LocationSection({ onLocationUpdate }: LocationSectionProps) {
  const { t, locale } = useTranslation();
  const isRTL = locale === 'ar';

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [area, setArea] = useState("");
  const [cities, setCities] = useState<string[]>([]);
  const [currencySymbol, setCurrencySymbol] = useState("$");
  const [sizeUnit, setSizeUnit] = useState("m²");

  // Update cities, currency, and unit when country changes
  useEffect(() => {
    if (selectedCountry && COUNTRIES_DATA[selectedCountry]) {
      const data = COUNTRIES_DATA[selectedCountry];
      setCities(data.cities);
      setCurrencySymbol(data.currency);
      setSizeUnit(data.unit);
      setSelectedCity(""); // Reset city when country changes
    } else {
      setCities([]);
      setCurrencySymbol("$");
      setSizeUnit("m²");
      setSelectedCity("");
    }
  }, [selectedCountry]);

  // Notify parent component of changes
  useEffect(() => {
    onLocationUpdate({
      country: selectedCountry,
      city: selectedCity,
      area: area,
      currencySymbol,
      sizeUnit
    });
  }, [selectedCountry, selectedCity, area, currencySymbol, sizeUnit, onLocationUpdate]);

  return (
    <div className={`space-y-8 bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="flex items-center gap-3 border-b border-gray-100 dark:border-gray-700 pb-4">
        <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
          <MapPin className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('upload', 'locationStep')}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">{t('upload', 'locationDescription') || 'Specify exactly where the property is located.'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Country Selection */}
        <div>
          <label htmlFor="country" className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            <Globe className="w-4 h-4 text-gray-400" />
            {t('upload', 'country')} <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              id="country"
              name="country"
              required
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all appearance-none cursor-pointer"
            >
              <option value="">{t('upload', 'selectCountry')}</option>
              {Object.keys(COUNTRIES_DATA).sort().map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
            <div className={`absolute inset-y-0 ${isRTL ? 'left-4' : 'right-4'} flex items-center pointer-events-none`}>
              <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* City Selection */}
        <div>
          <label htmlFor="city" className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            <Building2 className="w-4 h-4 text-gray-400" />
            {t('upload', 'city')} <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              id="city"
              name="city"
              required
              disabled={!selectedCountry}
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">{selectedCountry ? t('upload', 'selectCity') : t('upload', 'selectCountryFirst')}</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
            <div className={`absolute inset-y-0 ${isRTL ? 'left-4' : 'right-4'} flex items-center pointer-events-none`}>
              <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Area / Neighborhood */}
        <div className="md:col-span-2">
          <label htmlFor="area" className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            <Landmark className="w-4 h-4 text-gray-400" />
            {t('upload', 'address')}
          </label>
          <input
            type="text"
            id="area"
            name="area"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            placeholder={t('upload', 'addressPlaceholder')}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Info Badges */}
      {selectedCountry && (
        <div className={`flex flex-wrap gap-4 pt-4 border-t border-gray-100 dark:border-gray-700 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-full text-xs font-medium border border-green-100 dark:border-green-900/30">
            <span className="opacity-70 text-[10px] uppercase tracking-wider">{t('upload', 'currency') || 'Currency'}:</span>
            <span className="font-bold">{currencySymbol}</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium border border-blue-100 dark:border-blue-900/30">
            <span className="opacity-70 text-[10px] uppercase tracking-wider">{t('upload', 'measurementUnit') || 'Unit'}:</span>
            <span className="font-bold">{sizeUnit}</span>
          </div>
        </div>
      )}
    </div>
  );
}
