import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sprout,
  User,
  Phone,
  Lock,
  Tractor,
  UserCheck,
  ChevronRight,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function Registration() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    role: 'FARMER' // 'FARMER' | 'OPERATOR'
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage('');
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    // Frontend Validations
    if (!formData.name.trim()) {
      setErrorMessage('कृपया अपना पूरा नाम दर्ज करें (Please enter your full name).');
      return;
    }

    if (formData.mobile.length !== 10 || !/^\d{10}$/.test(formData.mobile)) {
      setErrorMessage('कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें (Please enter a valid 10-digit mobile number).');
      return;
    }

    if (formData.password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long (पासवर्ड कम से कम 6 अक्षरों का होना चाहिए).');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match (पासवर्ड मेल नहीं खाते).');
      return;
    }

    setLoading(true);

    try {
      const selectedRole = formData.role.toUpperCase();

      const response = await fetch('/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          mobile: formData.mobile.trim(),
          password: formData.password,
          role: selectedRole,
        }),
      });

      // Handle JSON vs Plain text responses gracefully
      const contentType = response.headers.get('content-type');
      let data = {};
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        data = { message: text };
      }

      if (!response.ok) {
        let extractedError = data?.message || data?.error;

        // Catch duplicate key SQL exception details from raw server exceptions
        if (
          typeof extractedError === 'string' &&
          (extractedError.includes('duplicate key') || extractedError.includes('already exists'))
        ) {
          extractedError = 'यह मोबाइल नंबर पहले से पंजीकृत है (This mobile number is already registered).';
        }

        throw new Error(extractedError || `Registration failed with status code ${response.status}`);
      }

      // 1. Persist User Session in LocalStorage
      const activeRole = (data.role || selectedRole).toLowerCase();
      if (data.token) localStorage.setItem('token', data.token);
      localStorage.setItem('userRole', activeRole);
      localStorage.setItem('userMobile', data.mobile || formData.mobile.trim());
      localStorage.setItem('userName', data.name || formData.name.trim());
      if (data.id || data.userId) localStorage.setItem('userId', data.id || data.userId);

      // 2. Set dynamic success banner
      const destinationTitle = activeRole === 'operator' ? 'Operator Portal' : 'Kisan Portal';
      setSuccessMessage(`पंजीकरण सफल! ${destinationTitle} पर भेजा जा रहा है... (Redirecting to ${destinationTitle}...)`);

      // 3. Dynamic Routing: Operator -> /operatorhome, Farmer -> /farmerhome
      setTimeout(() => {
        if (activeRole === 'operator') {
          navigate('/operator-update-profile');
        } else {
          navigate('/farmer-update-profile');
        }
      }, 1400);

    } catch (error) {
      console.error('Registration error:', error);
      setErrorMessage(error.message || 'Cannot connect to backend. Please check your connection.');
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#f6f9f5] font-sans text-gray-800 antialiased selection:bg-emerald-200 selection:text-emerald-900">
      
      {/* Background Soft Glow */}
      <div 
        className="pointer-events-none absolute inset-0 z-0 h-[480px] w-full bg-cover bg-center opacity-85"
        style={{
          backgroundImage: `radial-gradient(ellipse at 50% 15%, rgba(212, 245, 195, 0.6) 0%, rgba(246, 249, 245, 1) 75%)`
        }}
      />

      {/* Navigation Header */}
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
              {formData.role === 'FARMER' ? 'Kisan Portal • किसान पोर्टल' : 'Operator Portal • ऑपरेटर पोर्टल'}
            </span>
          </div>
        </Link>

        <Link
          to="/login"
          className="flex items-center gap-1.5 text-xs font-bold text-gray-600 transition hover:text-[#14532d]"
        >
          Already registered? <span className="text-[#14532d] underline">Sign In</span>
        </Link>
      </header>

      {/* Main Registration Box */}
      <main className="relative z-10 mx-auto max-w-md px-6 pt-4 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-3xl border border-emerald-900/10 bg-white/95 p-7 shadow-xl backdrop-blur-md sm:p-9"
        >
          {/* Role Selection Tabs */}
          <div className="mb-5 flex rounded-xl bg-gray-100 p-1">
            <button
              type="button"
              disabled={loading}
              onClick={() => {
                setFormData((prev) => ({ ...prev, role: 'FARMER' }));
                setErrorMessage('');
              }}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-xs font-bold transition-all ${
                formData.role === 'FARMER'
                  ? 'bg-[#14532d] text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Tractor className="h-3.5 w-3.5" />
              Farmer (किसान)
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={() => {
                setFormData((prev) => ({ ...prev, role: 'OPERATOR' }));
                setErrorMessage('');
              }}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-xs font-bold transition-all ${
                formData.role === 'OPERATOR'
                  ? 'bg-[#14532d] text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <UserCheck className="h-3.5 w-3.5" />
              Operator (ऑपरेटर)
            </button>
          </div>

          {/* Heading */}
          <div className="text-center">
            <h1 className="text-2xl font-black tracking-tight text-gray-900 sm:text-3xl">
              {formData.role === 'FARMER' ? 'किसान पंजीकरण' : 'ऑपरेटर पंजीकरण'}
            </h1>
            <p className="mt-1 text-xs text-gray-500">
              {formData.role === 'FARMER'
                ? 'Create an account to book mandi tokens, track live queues, and receive MSP payments.'
                : 'Create an operator terminal account to manage mandi scale entries and gate passes.'}
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
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
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
                <AlertCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Registration Form */}
          <form onSubmit={handleRegisterSubmit} className="mt-6 space-y-4">
            
            {/* Full Name */}
            <div>
              <label className="text-xs font-bold text-gray-700">
                Full Name (पूरा नाम)
              </label>
              <div className="relative mt-1.5">
                <User className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-xs font-semibold text-gray-900 shadow-sm focus:border-emerald-600 focus:outline-none"
                />
              </div>
            </div>

            {/* Mobile Number */}
            <div>
              <label className="text-xs font-bold text-gray-700">
                Mobile Number (10 अंकों का मोबाइल नंबर)
              </label>
              <div className="relative mt-1.5">
                <Phone className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="tel"
                  name="mobile"
                  required
                  maxLength={10}
                  value={formData.mobile}
                  onChange={handleInputChange}
                  placeholder="9876543210"
                  className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-xs font-semibold text-gray-900 shadow-sm focus:border-emerald-600 focus:outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-xs font-bold text-gray-700">Create Password (पासवर्ड)</label>
              <div className="relative mt-1.5">
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="At least 6 characters"
                  className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-10 text-xs text-gray-900 shadow-sm focus:border-emerald-600 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-xs font-bold text-gray-700">Confirm Password (पासवर्ड की पुष्टि करें)</label>
              <div className="relative mt-1.5">
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Re-enter password"
                  className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-10 text-xs text-gray-900 shadow-sm focus:border-emerald-600 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || Boolean(successMessage)}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#14532d] py-3.5 text-xs font-bold text-white shadow-md transition hover:bg-[#0f3e21] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-75"
            >
              {loading ? (
                <span>पंजीकरण किया जा रहा है... (Registering...)</span>
              ) : successMessage ? (
                <span>Redirecting...</span>
              ) : (
                <>
                  खाता बनाएं (Register & Enter {formData.role === 'FARMER' ? 'Kisan Portal' : 'Operator Portal'})
                  <ChevronRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer Back Link */}
          <div className="mt-5 border-t border-gray-100 pt-4 text-center">
            <p className="text-xs text-gray-500">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-[#14532d] underline hover:text-[#0f3e21]">
                लॉगिन करें (Sign In Here)
              </Link>
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}