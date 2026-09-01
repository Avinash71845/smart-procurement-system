import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  ShieldCheck,
  User,
  Phone,
  Lock,
  KeyRound,
  MapPin,
  ChevronRight,
  ArrowLeft,
  CheckCircle2,
  BadgeCheck
} from 'lucide-react';

export default function OperatorRegistration() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Operator Details, 2: OTP Verification

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    employeeId: '',
    centerName: '',
    centerCode: '',
    state: 'Bihar',
    district: '',
    designation: 'Weighbridge Operator',
    adminPasscode: '',
    password: '',
    confirmPassword: ''
  });

  const [otp, setOtp] = useState(['', '', '', '']);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleSubmitStep1 = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match. Please verify.');
      return;
    }
    setStep(2);
  };

  const handleFinalSubmit = (e) => {
    e.preventDefault();
    navigate('/registrationsucess');
  };

  return (
    <div className="relative min-h-screen w-full bg-[#f6f9f5] font-sans text-gray-800 antialiased selection:bg-emerald-200 selection:text-emerald-900">
      
      {/* Background Soft Glow */}
      <div 
        className="absolute inset-0 z-0 h-[480px] w-full bg-cover bg-center opacity-80 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(ellipse at 50% 15%, rgba(212, 245, 195, 0.55) 0%, rgba(246, 249, 245, 1) 75%)`
        }}
      />

      {/* Navigation Header */}
      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-12">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0d4624] text-white shadow-sm">
            <Building2 className="h-5 w-5 text-[#00e699]" />
          </div>
          <div>
            <span className="block text-lg font-extrabold leading-tight tracking-tight text-[#14532d]">
              SmartProcure
            </span>
            <span className="block text-[10px] font-semibold tracking-wider text-emerald-700 uppercase">
              Operator & Staff Portal
            </span>
          </div>
        </Link>

        <Link
          to="/operator-login"
          className="flex items-center gap-1.5 text-xs font-bold text-gray-600 transition hover:text-[#14532d]"
        >
          Already onboarded? <span className="text-[#14532d] underline">Sign In</span>
        </Link>
      </header>

      {/* Main Registration Container */}
      <main className="relative z-10 mx-auto max-w-2xl px-6 pt-4 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-3xl border border-emerald-900/10 bg-white/95 p-6 shadow-xl backdrop-blur-md sm:p-10"
        >
          {/* Header */}
          <div className="text-center">
            <div className="mx-auto mb-2 flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-[#14532d]">
              <BadgeCheck className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-gray-900 sm:text-3xl">
              Procurement Operator Onboarding
            </h1>
            <p className="mt-1.5 text-xs text-gray-500">
              Register authorized staff for mandi intake, quality assay, weighbridge, and DBT processing.
            </p>
          </div>

          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.form
                key="step1"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                onSubmit={handleSubmitStep1}
                className="mt-6 space-y-4"
              >
                {/* Full Name & Phone */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-bold text-gray-700">
                      Officer / Operator Full Name
                    </label>
                    <div className="relative mt-1.5">
                      <User className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        name="fullName"
                        required
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="e.g. Inspector A. K. Verma"
                        className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-xs text-gray-900 shadow-sm focus:border-emerald-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700">
                      Official Mobile Number
                    </label>
                    <div className="relative mt-1.5">
                      <Phone className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
                      <input
                        type="tel"
                        name="phone"
                        required
                        maxLength={10}
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="98765 43210"
                        className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-xs text-gray-900 shadow-sm focus:border-emerald-600 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Employee ID & Assigned Center Code */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-bold text-gray-700">
                      Official Employee / Operator ID
                    </label>
                    <div className="relative mt-1.5">
                      <ShieldCheck className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        name="employeeId"
                        required
                        value={formData.employeeId}
                        onChange={handleInputChange}
                        placeholder="APMC-EMP-4091"
                        className="w-full uppercase rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-xs text-gray-900 shadow-sm focus:border-emerald-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700">
                      Center Code
                    </label>
                    <div className="relative mt-1.5">
                      <Building2 className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        name="centerCode"
                        required
                        value={formData.centerCode}
                        onChange={handleInputChange}
                        placeholder="MANDI-PAT-01"
                        className="w-full uppercase rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-xs text-gray-900 shadow-sm focus:border-emerald-600 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Mandi Name & State / District */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-bold text-gray-700">
                      Assigned APMC / Mandi Center
                    </label>
                    <div className="relative mt-1.5">
                      <Building2 className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        name="centerName"
                        required
                        value={formData.centerName}
                        onChange={handleInputChange}
                        placeholder="Patna Central APMC Yard #01"
                        className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-xs text-gray-900 shadow-sm focus:border-emerald-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700">
                      District & State
                    </label>
                    <div className="relative mt-1.5">
                      <MapPin className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        name="district"
                        required
                        value={formData.district}
                        onChange={handleInputChange}
                        placeholder="Patna, Bihar"
                        className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-xs text-gray-900 shadow-sm focus:border-emerald-600 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Role Designation & Admin Authorization Key */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-bold text-gray-700">
                      Operational Designation
                    </label>
                    <select
                      name="designation"
                      value={formData.designation}
                      onChange={handleInputChange}
                      className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs text-gray-900 shadow-sm focus:border-emerald-600 focus:outline-none"
                    >
                      <option value="Weighbridge Operator">Weighbridge & Scale Incharge</option>
                      <option value="Quality Assayer">Quality Assayer / Grain Inspector</option>
                      <option value="Token & Queue Manager">Token & Queue Supervisor</option>
                      <option value="Billing & DBT Officer">Billing & DBT Accounts Clerk</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700">
                      Mandi Directorate Passcode (Admin PIN)
                    </label>
                    <div className="relative mt-1.5">
                      <KeyRound className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
                      <input
                        type="password"
                        name="adminPasscode"
                        required
                        value={formData.adminPasscode}
                        onChange={handleInputChange}
                        placeholder="Govt. Issued Key"
                        className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-xs text-gray-900 shadow-sm focus:border-emerald-600 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Password Fields */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-bold text-gray-700">Create Password</label>
                    <div className="relative mt-1.5">
                      <Lock className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
                      <input
                        type="password"
                        name="password"
                        required
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="••••••••"
                        className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-xs text-gray-900 shadow-sm focus:border-emerald-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700">Confirm Password</label>
                    <div className="relative mt-1.5">
                      <Lock className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
                      <input
                        type="password"
                        name="confirmPassword"
                        required
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="••••••••"
                        className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-xs text-gray-900 shadow-sm focus:border-emerald-600 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#14532d] py-3.5 text-xs font-bold text-white shadow-md transition hover:bg-[#0f3e21]"
                >
                  Proceed to Terminal Verification
                  <ChevronRight className="h-4 w-4" />
                </button>
              </motion.form>
            ) : (
              /* Step 2: OTP Verification */
              <motion.form
                key="step2"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                onSubmit={handleFinalSubmit}
                className="mt-6 space-y-6 text-center"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-[#14532d]">
                  <ShieldCheck className="h-7 w-7" />
                </div>

                <div>
                  <h3 className="text-base font-bold text-gray-900">Verify Official Mobile Number</h3>
                  <p className="mt-1 text-xs text-gray-500">
                    Enter the 4-digit authentication code sent to <span className="font-semibold text-gray-800">+91 {formData.phone || '98765 43210'}</span>
                  </p>
                </div>

                {/* 4-Box OTP Input */}
                <div className="flex justify-center gap-3">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`otp-${idx}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      className="h-12 w-12 rounded-xl border border-gray-200 bg-white text-center text-lg font-bold text-gray-900 shadow-sm focus:border-emerald-600 focus:outline-none"
                    />
                  ))}
                </div>

                <div className="space-y-3">
                  <button
                    type="submit"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#14532d] py-3.5 text-xs font-bold text-white shadow-md transition hover:bg-[#0f3e21]"
                  >
                    Complete Onboarding
                    <CheckCircle2 className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex w-full items-center justify-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-800"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" /> Back to Edit Details
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </main>
    </div>
  );
}