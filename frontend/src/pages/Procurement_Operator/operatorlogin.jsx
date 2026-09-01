import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Building2,
  ShieldCheck,
  Lock,
  KeyRound,
  ArrowRight,
  HelpCircle,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function OperatorLogin() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    employeeId: '',
    password: '',
    adminPasscode: '',
    centerCode: ''
  });

  const [showPasscodeHelp, setShowPasscodeHelp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate authentication and route to operator dashboard
    setTimeout(() => {
      setIsLoading(false);
      navigate('/operatorhome');
    }, 800);
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

      {/* Top Header */}
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
              Staff & Operator Access
            </span>
          </div>
        </Link>

        <Link
          to="/login"
          className="flex items-center gap-1.5 text-xs font-bold text-gray-600 transition hover:text-[#14532d]"
        >
          Farmer Portal <span className="text-[#14532d] underline">Switch Here</span>
        </Link>
      </header>

      {/* Main Login Card */}
      <main className="relative z-10 mx-auto max-w-md px-6 pt-6 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-3xl border border-emerald-900/10 bg-white/95 p-6 shadow-xl backdrop-blur-md sm:p-9"
        >
          {/* Badge & Title */}
          <div className="text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-[#14532d]">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-gray-900">
              Operator Login
            </h1>
            <p className="mt-1 text-xs text-gray-500">
              Procurement Center & Weighbridge Terminal
            </p>
          </div>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            {/* Employee ID */}
            <div>
              <label className="text-xs font-bold text-gray-700">
                Official Employee ID
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

            {/* Mandi / Center Code */}
            <div>
              <label className="text-xs font-bold text-gray-700">
                Assigned Center Code
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

            {/* Password */}
            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-gray-700">Password</label>
                <Link
                  to="/forgot-password"
                  className="text-[11px] font-semibold text-emerald-700 hover:underline"
                >
                  Forgot?
                </Link>
              </div>
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

            {/* Mandi Directorate Passcode (Admin PIN) */}
            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-gray-700">
                  Daily Authorization Passcode
                </label>
                <button
                  type="button"
                  onClick={() => setShowPasscodeHelp(!showPasscodeHelp)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <HelpCircle className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="relative mt-1.5">
                <KeyRound className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="password"
                  name="adminPasscode"
                  required
                  value={formData.adminPasscode}
                  onChange={handleInputChange}
                  placeholder="6-digit Center PIN"
                  className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-xs text-gray-900 shadow-sm focus:border-emerald-600 focus:outline-none"
                />
              </div>

              {showPasscodeHelp && (
                <div className="mt-2 flex items-start gap-2 rounded-lg bg-emerald-50 p-2.5 text-[11px] text-emerald-900 border border-emerald-100">
                  <AlertCircle className="h-4 w-4 shrink-0 text-emerald-700" />
                  <span>
                    The daily authorization passcode is issued every morning by the Mandi Secretary or Center Supervisor.
                  </span>
                </div>
              )}
            </div>

            {/* Login Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#14532d] py-3.5 text-xs font-bold text-white shadow-md transition hover:bg-[#0f3e21] disabled:opacity-75"
            >
              {isLoading ? (
                <span>Authenticating Terminal...</span>
              ) : (
                <>
                  Enter Operator Terminal
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Security Notice */}
          <div className="mt-6 border-t border-gray-100 pt-4 text-center">
            <p className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              256-bit Encrypted Government APMC Gateway
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}