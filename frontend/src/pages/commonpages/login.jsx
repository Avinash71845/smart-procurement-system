import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { clearSession } from "../../utils/session";
import {
  Sprout,
  Tractor,
  UserCheck,
  Phone,
  Lock,
  ArrowRight,
  Smartphone,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function FarmerLogin() {
  const navigate = useNavigate();
  const [role, setRole] = useState("farmer"); // 'farmer' | 'operator'
  const [loginMethod, setLoginMethod] = useState("password"); // 'password' | 'otp'
  const [showPassword, setShowPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  // Status & Notification states
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    mobile: "",
    password: "",
    otp: ["", "", "", ""],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Strictly numeric for mobile input
    if (name === "mobile" && !/^\d*$/.test(value)) return;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage("");
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
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
      setErrorMessage(
        "कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें (Please enter a valid 10-digit mobile number).",
      );
      return;
    }
    setOtpSent(true);
  };

  const handleLoginSubmit = async (e) => {
    if (e) e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setLoading(true);
    clearSession();

    try {
      const formattedRole = (role || "farmer").toUpperCase();

      const response = await fetch("/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mobile: formData.mobile.trim(),
          password: formData.password,
          role: formattedRole,
        }),
      });

      const rawText = await response.text();
      console.log("Raw Backend Login Response:", rawText);

      let data = {};
      try {
        data = JSON.parse(rawText);
      } catch {
        // Handle raw string responses from backend
        data = rawText.trim().startsWith("ey")
          ? { token: rawText.trim() }
          : { message: rawText };
      }

      if (!response.ok) {
        let errorMsg = data?.message || data?.error;
        if (errorMsg === "Invalid Password") {
          errorMsg =
            "गलत पासवर्ड। कृपया पुनः प्रयास करें (Invalid Password. Please try again).";
        }
        throw new Error(
          errorMsg || `Login failed (Status: ${response.status})`,
        );
      }

      // 1. Resolve token across varying payload specifications
      let extractedToken = null;
      if (typeof data === "string" && data.startsWith("ey")) {
        extractedToken = data;
      } else if (typeof data === "object" && data !== null) {
        extractedToken =
          data.token ||
          data.jwt ||
          data.accessToken ||
          data.jwtToken ||
          data.id_token ||
          data?.data?.token ||
          data?.data?.jwt ||
          data?.body?.token;
      }

      if (!extractedToken && rawText.trim().startsWith("ey")) {
        extractedToken = rawText.trim();
      }

      // 2. Persist token to local storage synchronously
      if (extractedToken) {
        const cleanToken =
          typeof extractedToken === "string"
            ? extractedToken.replace(/^"(.*)"$/, "$1").trim()
            : extractedToken;

        localStorage.setItem("token", cleanToken);
        if (formattedRole === "OPERATOR") {
          localStorage.setItem("OPERATOR_JWT", cleanToken);
        } else {
          localStorage.setItem("FARMER_JWT", cleanToken);
        }
        console.log(
          "JWT successfully saved in localStorage:",
          cleanToken.substring(0, 15) + "...",
        );
      } else {
        console.warn(
          "Backend response did not contain an identifiable JWT token key:",
          data,
        );
      }

      // 3. Persist session keys
      const activeRole = (
        data.userRole ||
        data.role ||
        formattedRole
      ).toLowerCase();
      localStorage.setItem("userRole", activeRole);
      localStorage.setItem("userMobile", data.mobile || formData.mobile.trim());
      if (data.userId || data.id)
        localStorage.setItem("userId", data.userId || data.id);
      if (data.name) localStorage.setItem("userName", data.name);

      // 4. Success alert and navigation redirect
      const displayName =
        data.name || (activeRole === "farmer" ? "किसान मित्र" : "Operator");
      setSuccessMessage(
        `लॉगिन सफल! स्वागत है, ${displayName} (Login Successful! Redirecting...)`,
      );

      setTimeout(() => {
        if (activeRole.includes("operator")) {
          navigate("/operatorhome");
        } else {
          navigate("/farmerhome");
        }
      }, 1000);
    } catch (error) {
      console.error("Login/Auth error:", error);
      setErrorMessage(
        error.message || "Cannot connect to backend. Is Spring Boot running?",
      );
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#f6f9f5] font-sans text-gray-800 antialiased selection:bg-emerald-200 selection:text-emerald-900">
      {/* Background Soft Glow */}
      <div
        className="pointer-events-none absolute inset-0 z-0 h-[480px] w-full bg-cover bg-center opacity-85"
        style={{
          backgroundImage: `radial-gradient(ellipse at 50% 15%, rgba(212, 245, 195, 0.6) 0%, rgba(246, 249, 245, 1) 75%)`,
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
              {role === "farmer"
                ? "Kisan Portal • किसान पोर्टल"
                : "Operator Portal • ऑपरेटर पोर्टल"}
            </span>
          </div>
        </Link>

        <Link
          to="/register"
          className="flex items-center gap-1.5 text-xs font-bold text-gray-600 transition hover:text-[#14532d]"
        >
          नया खाता बनाएं?{" "}
          <span className="text-[#14532d] underline">Register Here</span>
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
          {/* Role Switcher Pill */}
          <div className="mb-5 flex rounded-xl bg-gray-100 p-1">
            <button
              type="button"
              disabled={loading}
              onClick={() => {
                setRole("farmer");
                setErrorMessage("");
              }}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-xs font-bold transition-all ${
                role === "farmer"
                  ? "bg-[#14532d] text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Tractor className="h-3.5 w-3.5" />
              Farmer (किसान)
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={() => {
                setRole("operator");
                setErrorMessage("");
              }}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-xs font-bold transition-all ${
                role === "operator"
                  ? "bg-[#14532d] text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <UserCheck className="h-3.5 w-3.5" />
              Operator (ऑपरेटर)
            </button>
          </div>

          {/* Badge & Dynamic Title */}
          <div className="text-center">
            <div className="mx-auto inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-[#14532d]">
              {role === "farmer" ? (
                <>
                  <Tractor className="h-3.5 w-3.5 text-emerald-600" />
                  Farmer LogIn
                </>
              ) : (
                <>
                  <UserCheck className="h-3.5 w-3.5 text-emerald-600" />
                  Mandi Operator LogIn
                </>
              )}
            </div>

            <h1 className="mt-3 text-2xl font-black tracking-tight text-gray-900 sm:text-3xl">
              {role === "farmer" ? "किसान लॉगिन" : "ऑपरेटर लॉगिन"}
            </h1>
            <p className="mt-1 text-xs text-gray-500">
              {role === "farmer"
                ? "Access your mandi booking tokens, queue positions, and direct MSP settlement records."
                : "Manage mandi arrivals, process weighment slips, and verify token receipts."}
            </p>
          </div>

          {/* Success Banner */}
          <AnimatePresence>
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
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
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 flex items-center gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-700"
              >
                <AlertCircle className="h-5 w-5 shrink-0 text-rose-600" />
                <span>{errorMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Authentication Mode Tabs */}
          <div className="mt-6 flex justify-center gap-6 border-b border-gray-100 pb-2 text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setLoginMethod("password");
                setOtpSent(false);
              }}
              className={`transition-colors ${
                loginMethod === "password"
                  ? "border-b-2 border-[#14532d] pb-2 text-[#14532d]"
                  : "text-gray-400 hover:text-gray-700"
              }`}
            >
              Password Login
            </button>
            <button
              type="button"
              onClick={() => setLoginMethod("otp")}
              className={`transition-colors ${
                loginMethod === "otp"
                  ? "border-b-2 border-[#14532d] pb-2 text-[#14532d]"
                  : "text-gray-400 hover:text-gray-700"
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
                <Phone className="absolute top-3 left-3.5 h-4 w-4 text-gray-400" />
                <input
                  type="tel"
                  name="mobile"
                  required
                  maxLength={10}
                  autoComplete="tel-national"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  placeholder="e.g. 9876543210"
                  className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pr-4 pl-10 text-xs font-semibold text-gray-900 shadow-sm focus:border-emerald-600 focus:outline-none"
                />
              </div>
            </div>

            {/* Password Login Mode */}
            {loginMethod === "password" && (
              <div>
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-700">
                    Password (पासवर्ड)
                  </label>
                  <span className="cursor-pointer text-[11px] font-semibold text-emerald-700 hover:underline">
                    Forgot Password?
                  </span>
                </div>
                <div className="relative mt-1.5">
                  <Lock className="absolute top-3 left-3.5 h-4 w-4 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    autoComplete="current-password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pr-10 pl-10 text-xs text-gray-900 shadow-sm focus:border-emerald-600 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-3 right-3.5 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* OTP Login Mode */}
            {loginMethod === "otp" && (
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
                          inputMode="numeric"
                          autoComplete="one-time-code"
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
              disabled={loading || Boolean(successMessage)}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#14532d] py-3.5 text-xs font-bold text-white shadow-md transition hover:bg-[#0f3e21] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-75"
            >
              {loading ? (
                <span>सत्यापित किया जा रहा है... (Verifying...)</span>
              ) : successMessage ? (
                <span>Redirecting...</span>
              ) : (
                <>
                  लॉगिन करें (Sign In as{" "}
                  {role === "farmer" ? "Farmer" : "Operator"})
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Verification Badges */}
          <div className="mt-6 space-y-2 border-t border-gray-100 pt-4">
            <div className="flex items-center gap-2 text-[11px] text-gray-500">
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
              <span>
                {role === "farmer"
                  ? "Direct Bank Account (DBT) Linked Authentication"
                  : "Authorized Mandi Weighbridge & Gate Terminal Access"}
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-gray-500">
              <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
              <span>Certified National Mandi Allocation Network</span>
            </div>
          </div>

          {/* Registration Footer */}
          <div className="mt-5 border-t border-gray-100 pt-4 text-center">
            <p className="text-xs text-gray-500">
              New to SmartProcure?{" "}
              <Link
                to="/register"
                className="font-bold text-[#14532d] underline hover:text-[#0f3e21]"
              >
                Register as a {role === "farmer" ? "Farmer" : "Mandi User"}
              </Link>
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
