import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sprout,
  Tractor,
  Phone,
  Lock,
  ArrowRight,
  Smartphone,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export default function FarmerLogin() {
  const navigate = useNavigate();
  const [loginMethod, setLoginMethod] = useState('password'); // 'password' | 'otp'
  const [showPassword, setShowPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const [formData, setFormData] = useState({
    mobile: '',
    password: '',
    otp: ['', '', '', '']
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    const newOtp = [...formData.otp];
    newOtp[index] = value;
    setFormData((prev) => ({ ...prev, otp: newOtp }));

    if (value && index < 3) {
      const nextInput = document.getElementById(`farmer-otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!formData.mobile || formData.mobile.length < 10) {
      alert('कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें (Please enter a valid 10-digit mobile number).');
      return;
    }
    setOtpSent(true);
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    
    // Persist farmer session
    localStorage.setItem('userRole', 'farmer');
    localStorage.setItem('userMobile', formData.mobile);

    navigate('/farmerhome');
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
              Kisan Portal • किसान पोर्टल
            </span>
          </div>
        </Link>

        <Link
          to="/register"
          className="flex items-center gap-1.5 text-xs font-bold text-gray-600 transition hover:text-[#14532d]"
        >
          नया खाता बनाएं? <span className="text-[#14532d] underline">Register Here</span>
        </Link>
      </header>

      {/* Login Container */}
      <main className="relative z-10 mx-auto max-w-md px-6 pt-4 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-3xl border border-emerald-900/10 bg-white/95 p-7 shadow-xl backdrop-blur-md sm:p-9"
        >
          {/* Badge & Title */}
          <div className="text-center">
            <div className="mx-auto inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-[#14532d]">
              <Tractor className="h-3.5 w-3.5 text-emerald-600" />
              Farmer LogIn
            </div>

            <h1 className="mt-3 text-2xl font-black tracking-tight text-gray-900 sm:text-3xl">
              किसान लॉगिन
            </h1>
            <p className="mt-1 text-xs text-gray-500">
              Access your mandi booking tokens, queue positions, and direct MSP settlement records.
            </p>
          </div>

          {/* Authentication Mode Tabs */}
          <div className="mt-6 flex justify-center gap-6 border-b border-gray-100 pb-2 text-xs font-bold">
            <button
              type="button"
              onClick={() => { setLoginMethod('password'); setOtpSent(false); }}
              className={`transition-colors ${
                loginMethod === 'password'
                  ? 'border-b-2 border-[#14532d] pb-2 text-[#14532d]'
                  : 'text-gray-400 hover:text-gray-700'
              }`}
            >
              Password Login
            </button>
            <button
              type="button"
              onClick={() => setLoginMethod('otp')}
              className={`transition-colors ${
                loginMethod === 'otp'
                  ? 'border-b-2 border-[#14532d] pb-2 text-[#14532d]'
                  : 'text-gray-400 hover:text-gray-700'
              }`}
            >
              Login via OTP (ओटीपी लॉगिन)
            </button>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLoginSubmit} className="mt-6 space-y-4">
            
            {/* Mobile Number Field */}
            <div>
              <label className="text-xs font-bold text-gray-700">
                Mobile Number (पंजीकृत मोबाइल नंबर)
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
                  placeholder="e.g. 9876543210"
                  className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-xs font-semibold text-gray-900 shadow-sm focus:border-emerald-600 focus:outline-none"
                />
              </div>
            </div>

            {/* Password Login Mode */}
            {loginMethod === 'password' && (
              <div>
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-700">Password (पासवर्ड)</label>
                  <span className="text-[11px] font-semibold text-emerald-700 hover:underline cursor-pointer">
                    Forgot Password?
                  </span>
                </div>
                <div className="relative mt-1.5">
                  <Lock className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="••••••••"
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
            )}

            {/* OTP Login Mode */}
            {loginMethod === 'otp' && (
              <div className="pt-1">
                {!otpSent ? (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-50 py-2.5 text-xs font-bold text-[#14532d] transition hover:bg-emerald-100"
                  >
                    <Smartphone className="h-4 w-4" />
                    Send OTP to Mobile (ओटीपी भेजें)
                  </button>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-gray-500">
                        OTP sent to <strong>+91 {formData.mobile}</strong>
                      </span>
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        className="text-[11px] font-bold text-emerald-700 hover:underline"
                      >
                        Resend OTP
                      </button>
                    </div>

                    <div className="flex justify-center gap-3">
                      {formData.otp.map((digit, idx) => (
                        <input
                          key={idx}
                          id={`farmer-otp-${idx}`}
                          type="text"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(idx, e.target.value)}
                          className="h-11 w-11 rounded-xl border border-gray-200 bg-white text-center text-base font-bold text-gray-900 shadow-sm focus:border-emerald-600 focus:outline-none"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#14532d] py-3.5 text-xs font-bold text-white shadow-md transition hover:bg-[#0f3e21] active:scale-[0.99]"
            >
              लॉगिन करें (Sign In)
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* Quick Farmer Guarantees */}
          <div className="mt-6 space-y-2 border-t border-gray-100 pt-4">
            <div className="flex items-center gap-2 text-[11px] text-gray-500">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
              <span>Direct Bank Account (DBT) Linked Authentication</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-gray-500">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
              <span>Certified National Mandi Slot Allocation</span>
            </div>
          </div>

          {/* Register Footer */}
          <div className="mt-5 border-t border-gray-100 pt-4 text-center">
            <p className="text-xs text-gray-500">
              New to SmartProcure?{' '}
              <Link to="/register" className="font-bold text-[#14532d] underline hover:text-[#0f3e21]">
                Register as a Farmer
              </Link>
            </p>
          </div>
        </motion.div>
      </main>

    </div>
  );
}