"use client";

import { useEffect, useState } from "react";
import { getCompanyProfile, updateCompanyProfile } from "@/lib/api";
import { Building2, Save, Globe, Mail, Phone, MapPin, Loader2 } from "lucide-react";

export default function AdminBusinessDetails() {
  const [formData, setFormData] = useState({
    name: "", industry: "", description: "", website: "", 
    email: "", phone: "", location: "", founded_date: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getCompanyProfile().then((data) => {
      if (data && data.name) setFormData(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    // Create a copy of the data to modify
    const payload = { ...formData };

    // Convert empty date string to null so Django accepts it
    if (payload.founded_date === "") {
      payload.founded_date = null;
    }

    try {
      await updateCompanyProfile(payload); // Send the cleaned payload
      alert("Business details updated successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to update details.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8 md:p-12 font-sans">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100">
          <div className="p-4 bg-blue-100 rounded-2xl text-blue-600">
            <Building2 className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Business Details</h1>
            <p className="text-gray-500">Manage your company information visible to employees.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-2 md:col-span-1">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Company Name</label>
            <input required name="name" value={formData.name} onChange={handleChange} className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-blue-500 transition" />
          </div>
          <div className="col-span-2 md:col-span-1">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Industry</label>
            <input name="industry" value={formData.industry} onChange={handleChange} className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-blue-500 transition" />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows="4" className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-blue-500 transition resize-none" />
          </div>

          <div className="relative">
            <Globe className="absolute left-3 top-9 w-5 h-5 text-gray-400" />
            <label className="block text-sm font-semibold text-gray-700 mb-2">Website</label>
            <input name="website" value={formData.website} onChange={handleChange} className="w-full pl-10 p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-blue-500 transition" />
          </div>
          <div className="relative">
            <Mail className="absolute left-3 top-9 w-5 h-5 text-gray-400" />
            <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full pl-10 p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-blue-500 transition" />
          </div>
          <div className="relative">
            <Phone className="absolute left-3 top-9 w-5 h-5 text-gray-400" />
            <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
            <input name="phone" value={formData.phone} onChange={handleChange} className="w-full pl-10 p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-blue-500 transition" />
          </div>
          <div className="relative">
            <MapPin className="absolute left-3 top-9 w-5 h-5 text-gray-400" />
            <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
            <input name="location" value={formData.location} onChange={handleChange} className="w-full pl-10 p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-blue-500 transition" />
          </div>

          <div className="col-span-2 mt-6">
            <button type="submit" disabled={saving} className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-xl transition-all shadow-lg shadow-blue-200 disabled:opacity-70">
              {saving ? <Loader2 className="animate-spin" /> : <Save className="w-5 h-5" />}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}