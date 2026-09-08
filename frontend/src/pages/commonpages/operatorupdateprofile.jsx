import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sprout,
  UserCheck,
  Building,
  KeyRound,
  MapPin,
  Globe,
  Home,
  Save,
  ArrowLeft,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function OperatorUpdateProfile() {
  const navigate = useNavigate();

  // Exactly matches your operator JSON schema
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    address: '',
    village: '',
    block: '',
    district: '',
    state: 'Bihar'
  });

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // 1. Fetch or initialize existing operator profile
  useEffect(() => {
    const fetchOperatorProfile = async () => {
      try {
        const storedMobile = localStorage.getItem('userMobile') || '';
        const storedName = localStorage.getItem('userName') || '';

        const response = await fetch(`/api/operator/profile?mobile=${storedMobile}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token') || ''}`
          }
        });

        if (response.ok) {
          const profile = await response.json();
          setFormData((prev) => ({
            ...prev,
            name: profile.name || storedName,
            code: profile.code || '',
            address: profile.address || '',
            village: profile.village || '',
            block: profile.block || '',
            district: profile.district || '',
            state: profile.state || 'Bihar'
          }));
        } else {
          setFormData((prev) => ({
            ...prev,
            name: storedName
          }));
        }
      } catch {
        setFormData((prev) => ({
          ...prev,
          name: localStorage.getItem('userName') || ''
        }));
      } finally {
        setInitialLoading(false);
      }
    };

    fetchOperatorProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage('');
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    // Validations
    if (!formData.name.trim()) {
      setErrorMessage('कृपया ऑपरेटर का नाम दर्ज करें (Please enter operator name).');
      return;
    }

    if (!formData.code.trim()) {
      setErrorMessage('कृपया ऑपरेटर कोड दर्ज करें (Please enter operator/terminal code).');
      return;
    }

    if (!formData.address.trim()) {
      setErrorMessage('कृपया मंडी/कार्यालय का पता दर्ज करें (Please enter office/mandi address).');
      return;
    }

    if (!formData.village.trim() || !formData.block.trim() || !formData.district.trim() || !formData.state.trim()) {
      setErrorMessage('कृपया गांव/क्षेत्र, प्रखंड, जिला और राज्य भरें (Please fill all location fields).');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/procurement-centres', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          code: formData.code.trim().toUpperCase(),
          address: formData.address.trim(),
          village: formData.village.trim(),
          block: formData.block.trim(),
          district: formData.district.trim(),
          state: formData.state.trim()
        })
      });

      const contentType = response.headers.get('content-type');
      let data = {};
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        data = { message: text };
      }

      if (!response.ok) {
        throw new Error(data?.message || `Update failed with status code ${response.status}`);
      }

      // Update local storage session cache
      localStorage.setItem('userName', formData.name.trim());
      localStorage.setItem('operatorCode', formData.code.trim().toUpperCase());

      setSuccessMessage('ऑपरेटर प्रोफ़ाइल सफलतापूर्वक अपडेट हो गई! (Operator profile updated successfully!)');

      setTimeout(() => {
        navigate('/operatorhome');
      }, 1400);

    } catch (error) {
      console.error('Operator profile update error:', error);
      setErrorMessage(error.message || 'Server connection error. Please verify backend.');
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/operatorhome');
  };

  if (initialLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f6f9f5]">
        <div className="text-sm font-bold text-[#14532d]">ऑपरेटर डेटा लोड हो रहा है... (Loading...)</div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full bg-[#f6f9f5] font-sans text-gray-800 antialiased selection:bg-emerald-200 selection:text-emerald-900">
      
      {/* Background Soft Glow */}
      <div 
        className="pointer-events-none absolute inset-0 z-0 h-[480px] w-full bg-cover bg-center opacity-85"
        style={{
          backgroundImage: `radial-gradient(ellipse at 50% 15%, rgba(212, 245, 195, 0.6) 0%, rgba(246, 249, 245, 1) 75%)`
        }}
      />

      {/* Header */}
      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-12">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#14532d] text-white shadow-sm">
            <Sprout className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <span className="block text-lg font-extrabold leading-tight tracking-tight text-[#14532d]">
              SmartProcure
            </span>
            <span className="block text-[10px] font-semibold tracking-wider text-emerald-700 uppercase">
              Operator Portal • ऑपरेटर पोर्टल
            </span>
          </div>
        </Link>

        <button
          type="button"
          onClick={handleCancel}
          className="flex items-center gap-1.5 text-xs font-bold text-gray-600 transition hover:text-[#14532d]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Operator Dashboard
        </button>
      </header>

      {/* Main Profile Form Box */}
      <main className="relative z-10 mx-auto max-w-2xl px-6 pt-2 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-3xl border border-emerald-900/10 bg-white/95 p-7 shadow-xl backdrop-blur-md sm:p-10"
        >
          {/* Header Title */}
          <div className="text-center">
            <div className="mx-auto inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-[#14532d]">
              <UserCheck className="h-3.5 w-3.5 text-emerald-600" />
              Operator Terminal Settings
            </div>
            <h1 className="mt-3 text-2xl font-black tracking-tight text-gray-900 sm:text-3xl">
              ऑपरेटर प्रोफ़ाइल अपडेट (Operator Profile)
            </h1>
            <p className="mt-1 text-xs text-gray-500">
              Update mandi terminal jurisdiction, operator identification code, and mandi depot location.
            </p>
          </div>

          {/* Success Banner */}
          <AnimatePresence>
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-800"
              >
                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
                <span>{successMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error Banner */}
          <AnimatePresence>
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-700"
              >
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-600" />
                <span>{errorMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleProfileSubmit} className="mt-6 space-y-4">
            
            {/* Operator Name & Terminal Code */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-bold text-gray-700">
                  Operator Name (ऑपरेटर का नाम) *
                </label>
                <div className="relative mt-1.5">
                  <UserCheck className="absolute top-3 left-3.5 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Suresh Kumar"
                    className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pr-4 pl-10 text-xs font-semibold text-gray-900 shadow-sm focus:border-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700">
                  Operator / Terminal Code (कोड) *
                </label>
                <div className="relative mt-1.5">
                  <KeyRound className="absolute top-3 left-3.5 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    name="code"
                    required
                    value={formData.code}
                    onChange={handleInputChange}
                    placeholder="e.g. OP-PAT-04"
                    className="w-full uppercase rounded-xl border border-gray-200 bg-white py-2.5 pr-4 pl-10 text-xs font-semibold tracking-wider text-gray-900 shadow-sm focus:border-emerald-600 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Address Field */}
            <div>
              <label className="text-xs font-bold text-gray-700">
                Office / Mandi Address (मंडी केंद्र / कार्यालय का पता) *
              </label>
              <div className="relative mt-1.5">
                <Home className="absolute top-3 left-3.5 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="e.g. Gate No. 2, APMC Mandi Complex, Main Road"
                  className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pr-4 pl-10 text-xs font-semibold text-gray-900 shadow-sm focus:border-emerald-600 focus:outline-none"
                />
              </div>
            </div>

            {/* Location Section Heading */}
            <div className="border-t border-gray-100 pt-3">
              <span className="text-[11px] font-bold tracking-wider text-gray-400 uppercase">
                Jurisdiction Location (अधिकार क्षेत्र विवरण)
              </span>
            </div>

            {/* Village / Area & Block */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-bold text-gray-700">
                  Village / Mandi Area (क्षेत्र / गांव) *
                </label>
                <div className="relative mt-1.5">
                  <MapPin className="absolute top-3 left-3.5 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    name="village"
                    required
                    value={formData.village}
                    onChange={handleInputChange}
                    placeholder="e.g. Mokama"
                    className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pr-4 pl-10 text-xs font-semibold text-gray-900 shadow-sm focus:border-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700">
                  Block (प्रखंड / ब्लॉक) *
                </label>
                <div className="relative mt-1.5">
                  <Building className="absolute top-3 left-3.5 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    name="block"
                    required
                    value={formData.block}
                    onChange={handleInputChange}
                    placeholder="e.g. Barh"
                    className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pr-4 pl-10 text-xs font-semibold text-gray-900 shadow-sm focus:border-emerald-600 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* District & State */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-bold text-gray-700">
                  District (जिला) *
                </label>
                <div className="relative mt-1.5">
                  <MapPin className="absolute top-3 left-3.5 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    name="district"
                    required
                    value={formData.district}
                    onChange={handleInputChange}
                    placeholder="e.g. Patna"
                    className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pr-4 pl-10 text-xs font-semibold text-gray-900 shadow-sm focus:border-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700">
                  State (राज्य) *
                </label>
                <div className="relative mt-1.5">
                  <Globe className="absolute top-3 left-3.5 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    name="state"
                    required
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="e.g. Bihar"
                    className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pr-4 pl-10 text-xs font-semibold text-gray-900 shadow-sm focus:border-emerald-600 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={handleCancel}
                disabled={loading}
                className="flex flex-1 items-center justify-center rounded-xl border border-gray-200 bg-white py-3.5 text-xs font-bold text-gray-700 shadow-sm transition hover:bg-gray-50 active:scale-[0.99] disabled:cursor-not-allowed"
              >
                रद्द करें (Cancel)
              </button>

              <button
                type="submit"
                disabled={loading || Boolean(successMessage)}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#14532d] py-3.5 text-xs font-bold text-white shadow-md transition hover:bg-[#0f3e21] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-75"
              >
                {loading ? (
                  <span>अपडेट हो रहा है... (Updating...)</span>
                ) : successMessage ? (
                  <span>सफल! (Success!)</span>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    सेव करें (Save Profile)
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </main>
    </div>
  );
}