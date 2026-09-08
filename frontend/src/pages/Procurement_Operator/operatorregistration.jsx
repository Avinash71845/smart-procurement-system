import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  ShieldCheck,
  User,
  Phone,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  BadgeCheck,
} from "lucide-react";

export default function OperatorRegistration() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Strictly numeric for mobile input
    if (name === "mobile" && !/^\d*$/.test(value)) return;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage("");
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    // Validations
    if (!formData.mobile || formData.mobile.length !== 10 || !/^\d{10}$/.test(formData.mobile)) {
      setErrorMessage("कृपया 10 अंकों का वैध आधिकारिक मोबाइल नंबर दर्ज करें (Please enter a valid 10-digit official mobile number).");
      return;
    }

    if (formData.password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long (पासवर्ड कम से कम 6 अक्षरों का होना चाहिए).");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match (पासवर्ड मेल नहीं खाते).");
      return;
    }

    setLoading(true);

    try {
      const cleanMobile = formData.mobile.trim();
      const operatorName = formData.name.trim() || "Operator";

      // 1. Register operator account
      const regResponse = await fetch("/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: operatorName,
          mobile: cleanMobile,
          password: formData.password,
          role: "OPERATOR",
        }),
      });

      const regContentType = regResponse.headers.get("content-type");
      let regData = {};
      if (regContentType && regContentType.includes("application/json")) {
        regData = await regResponse.json();
      } else {
        const text = await regResponse.text();
        regData = { message: text };
      }

      if (!regResponse.ok) {
        let extractedError = regData?.message || regData?.error;
        if (
          typeof extractedError === "string" &&
          (extractedError.includes("duplicate key") || extractedError.includes("already exists"))
        ) {
          extractedError = "यह मोबाइल नंबर पहले से पंजीकृत है (This mobile number is already registered).";
        }
        throw new Error(extractedError || `Registration failed with status ${regResponse.status}`);
      }

      // 2. Automatically sign in to initialize operator session
      try {
        const loginResponse = await fetch("/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mobile: cleanMobile,
            password: formData.password,
          }),
        });

        const rawToken = (await loginResponse.text()).trim();
        if (loginResponse.ok && rawToken) {
          const cleanToken = rawToken.replace(/^"(.*)"$/, "$1").trim();
          localStorage.setItem("token", cleanToken);
          localStorage.setItem("OPERATOR_JWT", cleanToken);
          localStorage.setItem("userRole", "operator");
          localStorage.setItem("userMobile", cleanMobile);
          localStorage.setItem("userName", operatorName);

          setSuccessMessage(
            "पंजीकरण सफल! ऑपरेटर प्रोफ़ाइल अपडेट पर ले जाया जा रहा है... (Registration successful! Redirecting to setup operator profile...)"
          );

          setTimeout(() => {
            navigate("/operator-update-profile");
          }, 1200);
          return;
        }
      } catch (loginErr) {
        console.warn("Auto-login post registration failed, fallback to login page:", loginErr);
      }

      // Fallback redirect
      setSuccessMessage("पंजीकरण सफल! कृपया लॉगिन करें (Registration successful! Please login).");
      setTimeout(() => {
        navigate("/operator-login");
      }, 1400);

    } catch (error) {
      console.error("Operator registration error:", error);
      setErrorMessage(error.message || "Cannot connect to backend. Please check server.");
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#f6f9f5] font-sans text-gray-800 antialiased selection:bg-emerald-200 selection:text-emerald-900">
      {/* Background Soft Glow */}
      <div
        className="pointer-events-none absolute inset-0 z-0 h-[480px] w-full bg-cover bg-center opacity-80"
        style={{
          backgroundImage: `radial-gradient(ellipse at 50% 15%, rgba(212, 245, 195, 0.55) 0%, rgba(246, 249, 245, 1) 75%)`,
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
            <span className="block text-[10px] font-semibold uppercase tracking-wider text-emerald-700">
              Operator & Staff Portal
            </span>
          </div>
        </Link>

        <Link
          to="/operator-login"
          className="flex items-center gap-1.5 text-xs font-bold text-gray-600 transition hover:text-[#14532d]"
        >
          Already registered?{" "}
          <span className="text-[#14532d] underline">Sign In</span>
        </Link>
      </header>

      {/* Main Registration Container */}
      <main className="relative z-10 mx-auto max-w-lg px-6 pt-4 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-3xl border border-emerald-900/10 bg-white/95 p-6 shadow-xl backdrop-blur-md sm:p-9"
        >
          {/* Header */}
          <div className="text-center">
            <div className="mx-auto mb-2 flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-[#14532d]">
              <BadgeCheck className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-gray-900 sm:text-3xl">
              Operator Registration
            </h1>
            <p className="mt-1.5 text-xs text-gray-500">
              Register authorized procurement staff via mobile number. You can complete your mandi center and station details in your profile.
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
                className="mt-4 flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-700"
              >
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-600" />
                <span>{errorMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Registration Form */}
          <form onSubmit={handleRegisterSubmit} className="mt-6 space-y-4">
            {/* Mobile Number Field (Primary) */}
            <div>
              <label className="text-xs font-bold text-gray-700">
                Official Mobile Number (पंजीकृत मोबाइल नंबर) <span className="text-red-500">*</span>
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
              <p className="mt-1 text-[11px] text-gray-400">
                Operator account authentication is linked to this 10-digit number.
              </p>
            </div>

            {/* Officer Name Field */}
            <div>
              <label className="text-xs font-bold text-gray-700">
                Officer / Operator Name (नाम)
              </label>
              <div className="relative mt-1.5">
                <User className="absolute top-3 left-3.5 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Inspector A. K. Verma"
                  className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pr-4 pl-10 text-xs font-semibold text-gray-900 shadow-sm focus:border-emerald-600 focus:outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-xs font-bold text-gray-700">
                Create Password (पासवर्ड) <span className="text-red-500">*</span>
              </label>
              <div className="relative mt-1.5">
                <Lock className="absolute top-3 left-3.5 h-4 w-4 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="At least 6 characters"
                  className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pr-10 pl-10 text-xs text-gray-900 shadow-sm focus:border-emerald-600 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-3 right-3.5 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-xs font-bold text-gray-700">
                Confirm Password (पासवर्ड की पुष्टि करें) <span className="text-red-500">*</span>
              </label>
              <div className="relative mt-1.5">
                <Lock className="absolute top-3 left-3.5 h-4 w-4 text-gray-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  required
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Re-enter password"
                  className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pr-10 pl-10 text-xs text-gray-900 shadow-sm focus:border-emerald-600 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute top-3 right-3.5 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Info notice about profile update */}
            <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-3 text-[11px] text-emerald-800">
              <div className="flex items-center gap-2 font-bold">
                <ShieldCheck className="h-4 w-4 text-emerald-700" />
                Profile Setup Step:
              </div>
              <p className="mt-1 text-emerald-700">
                Immediately after registration, you will be taken to update your mandi center code, office address, and district details.
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || Boolean(successMessage)}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#14532d] py-3.5 text-xs font-bold text-white shadow-md transition hover:bg-[#0f3e21] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-75"
            >
              {loading ? (
                <span>पंजीकरण हो रहा है... (Registering Operator...)</span>
              ) : successMessage ? (
                <span>Redirecting to Profile Setup...</span>
              ) : (
                <>
                  Register & Setup Profile (ऑनबोर्डिंग करें)
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer Back Link */}
          <div className="mt-5 border-t border-gray-100 pt-4 text-center">
            <p className="text-xs text-gray-500">
              Already have an operator account?{" "}
              <Link to="/operator-login" className="font-bold text-[#14532d] underline hover:text-[#0f3e21]">
                लॉगिन करें (Sign In Here)
              </Link>
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
