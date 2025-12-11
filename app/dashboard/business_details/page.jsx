"use client";

import { useEffect, useState } from "react";
import { getCompanyProfile } from "@/lib/api";
import { Building2, Globe, Mail, Phone, MapPin, Calendar, Loader2 } from "lucide-react";

export default function UserBusinessDetails() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCompanyProfile().then((res) => {
      setData(res);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-blue-600" /></div>;

  if (!data || !data.name) return (
    <div className="min-h-screen flex items-center justify-center text-gray-500">
      <p>No business details available yet.</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12 font-sans flex justify-center">
      <div className="w-full max-w-5xl bg-white rounded-[2rem] shadow-2xl overflow-hidden">
        {/* Banner / Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-10 text-white relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="p-6 bg-white/20 backdrop-blur-md rounded-2xl">
              <Building2 className="w-12 h-12 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight">{data.name}</h1>
              <p className="text-blue-100 text-lg mt-2 font-medium">{data.industry}</p>
            </div>
          </div>
          {/* Decorative Circle */}
          <div className="absolute -right-10 -bottom-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
          {/* Sidebar Info */}
          <div className="lg:col-span-1 bg-gray-50 p-8 border-r border-gray-100 space-y-6">
            <h3 className="text-gray-900 font-bold text-lg mb-4">Contact Information</h3>
            
            <InfoItem icon={<Globe />} label="Website" value={data.website} isLink />
            <InfoItem icon={<Mail />} label="Email" value={data.email} isLink prefix="mailto:" />
            <InfoItem icon={<Phone />} label="Phone" value={data.phone} />
            <InfoItem icon={<MapPin />} label="Location" value={data.location} />
            {data.founded_date && <InfoItem icon={<Calendar />} label="Founded" value={data.founded_date} />}
          </div>

          {/* Main Description */}
          <div className="lg:col-span-2 p-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">About Us</h2>
            <div className="prose prose-lg text-gray-600 leading-relaxed whitespace-pre-line">
              {data.description || "No description provided."}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ icon, label, value, isLink, prefix = "" }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-4 p-3 rounded-xl hover:bg-white hover:shadow-sm transition-all">
      <div className="text-blue-600 mt-1">{icon}</div>
      <div className="overflow-hidden">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</p>
        {isLink ? (
          <a href={`${prefix}${value}`} target="_blank" rel="noreferrer" className="text-gray-800 font-medium hover:text-blue-600 transition truncate block">
            {value}
          </a>
        ) : (
          <p className="text-gray-800 font-medium">{value}</p>
        )}
      </div>
    </div>
  );
}