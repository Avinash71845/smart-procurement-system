import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sprout,
  User,
  Phone,
  CreditCard,
  MapPin,
  Building,
  Globe,
  Languages,
  Save,
  ArrowLeft,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function UpdateProfile() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    adhaar: '',
    village: '',
    block: '',
    district: '',
    state: 'Bihar',
    preferredLanguage: 'hi'
  });

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Preload stored credentials on mount
  useEffect(() => {
    const storedMobile = localStorage.getItem('userMobile') || '';
    const storedName = localStorage.getItem('userName') || '';

    setFormData((prev) => ({
      ...prev,
      name: storedName,
      phone: storedMobile
    }));

    setInitialLoading(false);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Enforce digit-only input for numeric fields
    if (name === 'phone' && !/^\d*$/.test(value)) return;
    if (name === 'adhaar' && !/^\d*$/.test(value)) return;

    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage('');
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    // Validations
    if (!formData.name.trim()) {
      setErrorMessage('कृपया अपना नाम दर्ज करें (Please enter your name).');
      return;
    }

    if (formData.phone.length !== 10) {
      setErrorMessage('फोन नंबर ठीक 10 अंकों का होना चाहिए (Phone number must be exactly 10 digits).');
      return;
    }

    if (formData.adhaar.length !== 12) {
      setErrorMessage('आधार नंबर ठीक 12 अंकों का होना चाहिए (Aadhaar number must be exactly 12 digits).');
      return;
    }

    if (
      !formData.village.trim() ||
      !formData.block.trim() ||
      !formData.district.trim() ||
      !formData.state.trim()
    ) {
      setErrorMessage(
        'कृपया गांव, प्रखंड, जिला और राज्य भरें (Please fill village, block, district and state).'
      );
      return;
    }

    // Verify token presence before sending
    const rawToken = localStorage.getItem('token');
    const token = rawToken && rawToken !== 'null' && rawToken !== 'undefined'
      ? rawToken.replace(/^"(.*)"$/, '$1').trim()
      : null;

    if (!token) {
      setErrorMessage('सत्र समाप्त हो गया है। कृपया पुनः लॉगिन करें (Session expired. Please log in again).');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/farmers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          adhaar: formData.adhaar.trim(),
          village: formData.village.trim(),
          block: formData.block.trim(),
          district: formData.district.trim(),
          state: formData.state.trim(),
          preferredLanguage: formData.preferredLanguage || 'hi'
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
        throw new Error(data?.message || `Failed to update profile (Status: ${response.status})`);
      }

      // Sync local storage session keys
      localStorage.setItem('userName', formData.name.trim());
      localStorage.setItem('userMobile', formData.phone.trim());

      setSuccessMessage('किसान प्रोफ़ाइल सफलतापूर्वक सेव हो गई! (Farmer profile saved successfully!)');

      setTimeout(() => {
        const activeRole = localStorage.getItem('userRole') || 'farmer';
        navigate(activeRole.includes('operator') ? '/operatorhome' : '/farmerhome');
      }, 1400);

    } catch (error) {
      console.error('Farmer profile update error:', error);
      setErrorMessage(error.message || 'Cannot connect to backend. Please check server.');
      setLoading(false);
    }
  };

  const handleCancel = () => {
    const activeRole = localStorage.getItem('userRole') || 'farmer';
    navigate(activeRole.includes('operator') ? '/operatorhome' : '/farmerhome');
  };

  if (initialLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f6f9f5]">
        <div className="text-sm font-bold text-[#14532d]">लोड हो रहा है...</div>
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
              Farmer Portal • किसान पोर्टल
            </span>
          </div>
        </Link>

        <button
          type="button"
          onClick={handleCancel}
          className="flex items-center gap-1.5 text-xs font-bold text-gray-600 transition hover:text-[#14532d]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </button>
      </header>

      {/* Form Container */}
      <main className="relative z-10 mx-auto max-w-2xl px-6 pt-2 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-3xl border border-emerald-900/10 bg-white/95 p-7 shadow-xl backdrop-blur-md sm:p-10"
        >
          {/* Title */}
          <div className="text-center">
            <div className="mx-auto inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-[#14532d]">
              <User className="h-3.5 w-3.5 text-emerald-600" />
              Farmer Profile Update
            </div>
            <h1 className="mt-3 text-2xl font-black tracking-tight text-gray-900 sm:text-3xl">
              किसान प्रोफ़ाइल विवरण (Farmer Profile)
            </h1>
            <p className="mt-1 text-xs text-gray-500">
              Provide accurate personal and jurisdiction data for token issuance and MSP payouts.
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
            {/* Name & Phone */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-bold text-gray-700">
                  Full Name (पूरा नाम) *
                </label>
                <div className="relative mt-1.5">
                  <User className="absolute top-3 left-3.5 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    required
                    autoComplete="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pr-4 pl-10 text-xs font-semibold text-gray-900 shadow-sm focus:border-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700">
                  Phone Number (मोबाइल नंबर) *
                </label>
                <div className="relative mt-1.5">
                  <Phone className="absolute top-3 left-3.5 h-4 w-4 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    required
                    maxLength={10}
                    autoComplete="tel-national"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="9876543210"
                    className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pr-4 pl-10 text-xs font-semibold text-gray-900 shadow-sm focus:border-emerald-600 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Verification ID & Preferred Language */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-bold text-gray-700">
                  Aadhaar Number (आधार संख्या - 12 अंक) *
                </label>
                <div className="relative mt-1.5">
                  <CreditCard className="absolute top-3 left-3.5 h-4 w-4 text-gray-400" />
                  <input
                    type="password"
                    name="adhaar"
                    required
                    maxLength={12}
                    inputMode="numeric"
                    autoComplete="off"
                    value={formData.adhaar}
                    onChange={handleInputChange}
                    placeholder="••••••••••••"
                    className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pr-4 pl-10 text-xs font-semibold tracking-wider text-gray-900 shadow-sm focus:border-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700">
                  Preferred Language (भाषा)
                </label>
                <div className="relative mt-1.5">
                  <Languages className="absolute top-3 left-3.5 h-4 w-4 text-gray-400" />
                  <select
                    name="preferredLanguage"
                    value={formData.preferredLanguage}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pr-4 pl-10 text-xs font-semibold text-gray-900 shadow-sm focus:border-emerald-600 focus:outline-none"
                  >
                    <option value="hi">हिंदी (Hindi)</option>
                    <option value="en">English</option>
                    <option value="bho">भोजपुरी (Bhojpuri)</option>
                    <option value="mai">मैथिली (Maithili)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Location Header */}
            <div className="border-t border-gray-100 pt-3">
              <span className="text-[11px] font-bold tracking-wider text-gray-400 uppercase">
                Farm Jurisdiction & Location (स्थान विवरण)
              </span>
            </div>

            {/* Village & Block */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-bold text-gray-700">
                  Village (गांव) *
                </label>
                <div className="relative mt-1.5">
                  <MapPin className="absolute top-3 left-3.5 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    name="village"
                    required
                    value={formData.village}
                    onChange={handleInputChange}
                    placeholder="e.g. Rampur"
                    className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pr-4 pl-10 text-xs font-semibold text-gray-900 shadow-sm focus:border-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700">
                  Block (प्रखंड) *
                </label>
                <div className="relative mt-1.5">
                  <Building className="absolute top-3 left-3.5 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    name="block"
                    required
                    value={formData.block}
                    onChange={handleInputChange}
                    placeholder="e.g. Bikram"
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

            {/* Buttons */}
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
                  <span>सेव किया जा रहा है... (Saving...)</span>
                ) : successMessage ? (
                  <span>सफल! (Saved!)</span>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    प्रोफ़ाइल सेव करें (Save Farmer Profile)
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