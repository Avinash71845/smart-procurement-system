import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import heroImage from "../../assets/heroimage.jpg";
import {
  CalendarDays,
  GitFork,
  BellRing,
  Activity,
  Sprout,
  Search,
  Building2,
  Tractor,
  LayoutDashboard,
  ChevronRight,
  Menu,
  X,
  User,
  BadgePercent,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  LogOut,
  RefreshCw,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import { clearSession } from "../../utils/session";
import { fetchCommodityPrices } from "../../api/commodityApi";

const features = [
  {
    icon: CalendarDays,
    title: "Slot Booking",
    desc: "Book your preferred time slot in advance to bypass long physical queues.",
    route: "/slot-booking",
  },
  {
    icon: GitFork,
    title: "Track-live Queue",
    desc: "Monitor your exact live position in the procurement queue directly from your phone.",
    route: "/track-live-queue",
  },
  {
    icon: BellRing,
    title: "Notifications",
    desc: "Receive real-time SMS and app updates when your turn is approaching.",
    route: "/farmer-notification",
  },
  {
    icon: Activity,
    title: "Track Payment Status",
    desc: "Track quality appraisal, crop weighing, and direct bank settlement statuses.",
    route: "/payment-status",
  },
];

export default function FarmerHome() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Real-Time Commodity & MSP Rates state
  const [crops, setCrops] = useState([]);
  const [cropSearchQuery, setCropSearchQuery] = useState("");
  const [cropCategory, setCropCategory] = useState("All");
  const [loadingCrops, setLoadingCrops] = useState(false);
  const [showAllModal, setShowAllModal] = useState(false);

  // User entered Quintals per crop for live total price calculation
  const [cardQuintals, setCardQuintals] = useState({});

  const handleQuintalChange = (cropId, val) => {
    const parsed = parseFloat(val);
    const num = isNaN(parsed) ? 0 : Math.max(0, parsed);
    setCardQuintals((prev) => ({
      ...prev,
      [cropId]: num,
    }));
  };

  const loadCropsData = async () => {
    setLoadingCrops(true);
    try {
      const data = await fetchCommodityPrices();
      if (data && data.length > 0) setCrops(data);
    } catch (err) {
      console.error("Failed to load crops:", err);
    } finally {
      setLoadingCrops(false);
    }
  };

  useEffect(() => {
    loadCropsData();
    const timer = setInterval(loadCropsData, 30000);
    return () => clearInterval(timer);
  }, []);

  const handleDashboardClick = () => {
    navigate("/farmerdashboard");
  };

  const handleLogout = () => {
    clearSession();
    navigate("/login");
  };

  return (
    <div className="relative min-h-screen w-full bg-[#f6f9f5] font-sans text-gray-800 antialiased selection:bg-emerald-200 selection:text-emerald-900">
      {/* Background Gradient & Illustration */}
      <div
        className="absolute inset-0 z-0 h-[680px] w-full bg-cover bg-center opacity-90 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(ellipse at 80% 40%, rgba(212, 245, 195, 0.45) 0%, rgba(255,255,255,0) 70%),
            linear-gradient(to bottom, rgba(255,255,255,0.7) 0%, rgba(246, 249, 245, 1) 100%),
            url('https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=2000&q=80')
          `,
        }}
      />

      {/* Navigation Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="sticky top-0 z-50 border-b border-emerald-900/5 bg-white/90 backdrop-blur-md"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5 lg:px-12">
          {/* Logo */}
          <div
            onClick={() => navigate("/")}
            className="flex cursor-pointer items-center gap-2.5"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#14532d] text-white shadow-sm">
              <Sprout className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <span className="block text-lg font-extrabold leading-tight tracking-tight text-[#14532d]">
                SmartProcure
              </span>
              <span className="block text-[10px] font-semibold tracking-wider text-emerald-700 uppercase">
                Govt. Procurement Portal
              </span>
            </div>
          </div>

          {/* Desktop Nav Actions */}
          <nav className="hidden items-center gap-1.5 rounded-full border border-gray-200/80 bg-gray-50/80 p-1 lg:flex">
            <button
              onClick={handleDashboardClick}
              className="flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold text-gray-700 transition hover:bg-white hover:text-[#14532d] hover:shadow-sm"
            >
              <LayoutDashboard className="h-3.5 w-3.5 text-emerald-600" />
              MyDashBoard
            </button>

            <button
              onClick={() => navigate("/farmer-nearby-centres")}
              className="flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold text-gray-700 transition hover:bg-white hover:text-[#14532d] hover:shadow-sm"
            >
              <Search className="h-3.5 w-3.5 text-emerald-600" />
              Nearby Center
            </button>

            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold text-gray-700 transition hover:bg-white hover:text-[#14532d] hover:shadow-sm"
            >
              <BadgePercent className="h-3.5 w-3.5 text-emerald-600" />
              Today's MSP Rates
            </button>
          </nav>

          {/* Desktop Authentication Buttons */}
          <div className="hidden items-center gap-3 md:flex">
            <button
              onClick={() => navigate("/login")}
              className="flex items-center gap-1.5 rounded-lg border border-emerald-900/10 bg-emerald-50/60 px-3.5 py-2 text-xs font-bold text-[#14532d] transition hover:bg-emerald-100/70"
            >
              <Building2 className="h-3.5 w-3.5" />
              Farmer
            </button>

            <div className="h-5 w-[1px] bg-gray-200" />

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-bold text-gray-600 transition hover:bg-red-50 hover:text-red-700"
              title="Log out"
            >
              <LogOut className="h-3.5 w-3.5" />
              Log out
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-gray-700 hover:bg-black/5 md:hidden"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Dropdown Panel */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2 border-t border-gray-100 bg-white px-6 py-4 shadow-lg md:hidden"
          >
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                navigate("/slot-booking");
              }}
              className="flex w-full items-center justify-between rounded-lg bg-gray-50 px-3.5 py-2.5 text-left text-xs font-semibold text-gray-800"
            >
              <span className="flex items-center gap-2.5">
                <LayoutDashboard className="h-4 w-4 text-emerald-600" />
                MyDashboard
              </span>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                navigate("/dashboard");
              }}
              className="flex w-full items-center justify-between rounded-lg bg-gray-50 px-3.5 py-2.5 text-left text-xs font-semibold text-gray-800"
            >
              <span className="flex items-center gap-2.5">
                <Search className="h-4 w-4 text-emerald-600" />
                Nearby center
              </span>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                navigate("/dashboard");
              }}
              className="flex w-full items-center justify-between rounded-lg bg-gray-50 px-3.5 py-2.5 text-left text-xs font-semibold text-gray-800"
            >
              <span className="flex items-center gap-2.5">
                <BadgePercent className="h-4 w-4 text-emerald-600" />
                MSP Rates
              </span>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </button>

            <div className="grid grid-cols-2 gap-2 border-t border-gray-100 pt-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate("/login");
                }}
                className="rounded-lg border border-gray-300 py-2.5 text-center text-xs font-bold text-gray-700"
              >
                Farmer Login
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate("/register");
                }}
                className="rounded-lg bg-[#14532d] py-2.5 text-center text-xs font-bold text-white"
              >
                Register
              </button>
            </div>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                navigate("/login");
              }}
              className="w-full rounded-lg bg-emerald-50 py-2.5 text-center text-xs font-bold text-[#14532d]"
            >
              Mandi Official Login
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleLogout();
              }}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-50 py-2.5 text-center text-xs font-bold text-red-700"
            >
              <LogOut className="h-3.5 w-3.5" />
              Log out
            </button>
          </motion.div>
        )}
      </motion.header>

      {/* Hero Section */}
      <main className="relative z-10 mx-auto max-w-7xl px-6 pt-10 pb-16 lg:px-12 lg:pt-14">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          {/* Left Column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-7"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-[#14532d]">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Kharif & Rabi Direct Mandi Booking
            </div>

            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-[3.25rem] lg:leading-[1.15]">
              Smart Procurement <br />
              <span className="text-[#14532d]">for Farmers</span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-gray-600 sm:text-lg">
              Book slots, track your queue in real-time and get notified about
              every update. Saving your time, effort and ensuring transparency.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/slot-booking")}
                className="flex items-center gap-2 rounded-xl bg-[#14532d] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-950/10 transition-all hover:bg-[#0f3e21]"
              >
                Book Your Slot
                <ChevronRight className="h-4 w-4" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/track-live-queue")}
                className="rounded-xl border border-gray-300 bg-white/80 px-6 py-3.5 text-sm font-bold text-gray-800 backdrop-blur-sm transition-all hover:bg-white hover:shadow-sm"
              >
                Track Live Queue
              </motion.button>
            </div>
          </motion.div>

          {/* Right Column (Hero Graphic) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative flex justify-center lg:col-span-5 lg:justify-end"
          >
            <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/80 bg-white/40 p-2.5 shadow-2xl backdrop-blur-sm">
              <img
                src={heroImage}
                alt="Farmer using smartphone on agriculture field"
                className="h-80 w-full rounded-2xl object-cover lg:h-[380px]"
              />
            </div>
          </motion.div>
        </div>

        {/* Feature Cards Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6"
        >
          {features.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                onClick={() => navigate(item.route)}
                className="group flex cursor-pointer flex-col items-center rounded-2xl border border-white/80 bg-white/70 p-6 text-center shadow-sm backdrop-blur-md transition-shadow duration-200 hover:shadow-lg"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-[#14532d] transition-colors duration-200 group-hover:bg-[#14532d] group-hover:text-white">
                  <Icon className="h-6 w-6" />
                </div>

                <h3 className="text-base font-bold text-gray-900">
                  {item.title}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-gray-500">
                  {item.desc}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* --- Section: Live Mandi Rates Ticker --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-16 rounded-2xl border border-emerald-900/10 bg-white/90 p-6 shadow-sm backdrop-blur-md"
        >
          {/* Board Header */}
          <div className="flex flex-col items-start justify-between gap-4 border-b border-gray-100 pb-5 sm:flex-row sm:items-center">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-extrabold tracking-wider text-emerald-700 uppercase">
                  Live Commodity Board
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-ping" />
                  Live Mandi MSP Sync
                </span>
              </div>
              <h2 className="mt-1 text-lg font-black text-gray-900">
                Today's Minimum Support Price (MSP) & Market Rates
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={loadCropsData}
                disabled={loadingCrops}
                className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 active:scale-95 disabled:opacity-60"
                title="Refresh Market Rates"
              >
                <RefreshCw className={`h-3.5 w-3.5 text-emerald-700 ${loadingCrops ? "animate-spin" : ""}`} />
                <span>{loadingCrops ? "Syncing..." : "Refresh"}</span>
              </button>

              <button
                onClick={() => setShowAllModal(true)}
                className="flex items-center gap-1 text-xs font-bold text-[#14532d] hover:underline"
              >
                View All 24 Crops <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Search & Category Filter Bar */}
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {/* Search input with English & Hindi support */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search any crop (e.g. Wheat, गेहूं, Sarson, Chana, धान, सोयाबीन)..."
                value={cropSearchQuery}
                onChange={(e) => setCropSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white py-2 pl-10 pr-8 text-xs font-medium text-gray-800 placeholder-gray-400 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
              {cropSearchQuery && (
                <button
                  onClick={() => setCropSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-1.5">
              {["All", "Cereals", "Pulses", "Oilseeds", "Commercial"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCropCategory(cat)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                    cropCategory === cat
                      ? "bg-[#14532d] text-white shadow-sm"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid */}
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {(() => {
              const filtered = crops.filter((item) => {
                const matchesCat =
                  cropCategory === "All" ||
                  item.category?.toLowerCase() === cropCategory.toLowerCase();
                if (!matchesCat) return false;

                if (!cropSearchQuery.trim()) {
                  // Default top 6 major crops when not searching and category is 'All'
                  return cropCategory !== "All" || [
                    "wheat-grade-a", "paddy-common", "mustard-seeds",
                    "cotton-medium", "gram-chana", "soybean-yellow"
                  ].includes(item.id);
                }

                const q = cropSearchQuery.trim().toLowerCase();
                return (
                  item.nameEn?.toLowerCase().includes(q) ||
                  item.nameHi?.toLowerCase().includes(q) ||
                  item.category?.toLowerCase().includes(q) ||
                  item.grade?.toLowerCase().includes(q)
                );
              });

              if (filtered.length === 0) {
                return (
                  <div className="col-span-full py-8 text-center text-xs text-gray-500">
                    No crops found matching "{cropSearchQuery}".{" "}
                    <button
                      onClick={() => {
                        setCropSearchQuery("");
                        setCropCategory("All");
                      }}
                      className="font-bold text-emerald-700 underline ml-1"
                    >
                      Clear Search
                    </button>
                  </div>
                );
              }

              return filtered.map((item) => (
                <div
                  key={item.id}
                  className="group relative flex flex-col justify-between rounded-xl border border-gray-100 bg-[#f9fbf8] p-3 text-center transition-all duration-200 hover:border-emerald-300 hover:bg-white hover:shadow-md"
                >
                  <div>
                    {/* Top Row: Category & Trend */}
                    <div className="flex items-center justify-between gap-1 mb-1.5">
                      <span className="text-[9px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded">
                        {item.category}
                      </span>
                      <span
                        className={`text-[9px] font-black ${
                          item.trend?.startsWith("+") ? "text-emerald-700" : "text-red-500"
                        }`}
                      >
                        {item.trend}
                      </span>
                    </div>

                    {/* Crop Name English + Hindi */}
                    <span className="block text-xs font-extrabold text-gray-800 truncate" title={item.nameEn}>
                      {item.nameEn}
                    </span>
                    {item.nameHi && (
                      <span className="block text-[10px] font-semibold text-gray-400">
                        {item.nameHi}
                      </span>
                    )}

                    {/* ONLY Official Govt MSP Rate */}
                    <div className="mt-2.5 rounded-xl bg-emerald-50/90 py-2 px-2.5 border border-emerald-200/80">
                      <span className="block text-[9px] font-extrabold uppercase tracking-wider text-emerald-800">
                        Official Govt MSP
                      </span>
                      <span className="block text-base font-black text-[#14532d]">
                        ₹{item.mspRate?.toLocaleString()}
                        <span className="text-[10px] font-bold text-gray-600"> / Qtl</span>
                      </span>
                    </div>

                    {/* Live Quintal Price Calculator */}
                    <div className="mt-2.5 rounded-xl border border-gray-100 bg-white p-2 text-left shadow-xs">
                      <div className="flex items-center justify-between gap-1 text-[11px]">
                        <span className="font-bold text-gray-600">Quantity:</span>
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            min="0.5"
                            max="1000"
                            step="0.5"
                            value={cardQuintals[item.id] ?? 10}
                            onChange={(e) => handleQuintalChange(item.id, e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            className="w-14 rounded-md border border-gray-200 bg-gray-50 px-1 py-0.5 text-center text-xs font-black text-gray-900 focus:border-emerald-600 focus:bg-white focus:outline-none"
                          />
                          <span className="text-[10px] font-bold text-gray-500">Qtl</span>
                        </div>
                      </div>

                      <div className="mt-1.5 flex items-center justify-between border-t border-gray-100 pt-1.5">
                        <span className="text-[10px] font-semibold text-gray-500">Total Price:</span>
                        <span className="text-xs font-black text-emerald-800">
                          ₹{Math.round((cardQuintals[item.id] ?? 10) * item.mspRate).toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Book Slot Button */}
                  <button
                    onClick={() =>
                      navigate("/slot-booking", {
                        state: {
                          selectedCrop: item.nameEn,
                          cropId: item.id,
                          quantityQtl: cardQuintals[item.id] ?? 10,
                        },
                      })
                    }
                    className="mt-3 flex items-center justify-center gap-1 w-full rounded-xl bg-[#14532d] py-2 text-[11px] font-bold text-white shadow-xs transition hover:bg-[#0f3e21] active:scale-95"
                  >
                    Book Slot &rarr;
                  </button>
                </div>
              ));
            })()}
          </div>

          {/* Full Crops Explorer Modal */}
          <AnimatePresence>
            {showAllModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
              >
                <motion.div
                  initial={{ scale: 0.95, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.95, y: 20 }}
                  className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl"
                >
                  <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                    <div>
                      <h3 className="text-lg font-black text-gray-900">
                        Complete MSP & Mandi Rates Bulletin (24+ Commodities)
                      </h3>
                      <p className="text-xs text-gray-500">
                        Government mandated MSP benchmark rates and live modal mandi spot prices across Indian APMCs.
                      </p>
                    </div>
                    <button
                      onClick={() => setShowAllModal(false)}
                      className="rounded-full bg-gray-100 p-2 text-gray-500 hover:bg-gray-200 font-bold"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {crops.map((crop) => (
                      <div
                        key={crop.id}
                        className="flex flex-col justify-between rounded-2xl border border-gray-100 bg-[#f9fbf8] p-4 transition hover:border-emerald-300 hover:shadow-sm"
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                              {crop.category}
                            </span>
                            <span
                              className={`text-xs font-black ${
                                crop.trend?.startsWith("+") ? "text-emerald-700" : "text-red-500"
                              }`}
                            >
                              {crop.trend}
                            </span>
                          </div>

                          <h4 className="mt-2 text-sm font-black text-gray-900">
                            {crop.nameEn}
                          </h4>
                          <span className="text-xs font-semibold text-gray-500">
                            {crop.nameHi} • {crop.grade}
                          </span>

                          {/* ONLY Official Govt MSP */}
                          <div className="mt-3 rounded-xl bg-emerald-50/90 p-2.5 border border-emerald-200/80">
                            <span className="block text-[9px] font-extrabold uppercase tracking-wider text-emerald-800">
                              Official Govt MSP
                            </span>
                            <span className="block text-base font-black text-[#14532d]">
                              ₹{crop.mspRate?.toLocaleString()}
                              <span className="text-[10px] font-bold text-gray-600"> / Quintal</span>
                            </span>
                          </div>

                          {/* Quintal Price Calculator in Modal */}
                          <div className="mt-2.5 rounded-xl border border-gray-100 bg-white p-2.5 text-left text-xs shadow-xs">
                            <div className="flex items-center justify-between gap-1">
                              <span className="font-bold text-gray-600">Enter Qty:</span>
                              <div className="flex items-center gap-1">
                                <input
                                  type="number"
                                  min="0.5"
                                  max="1000"
                                  step="0.5"
                                  value={cardQuintals[crop.id] ?? 10}
                                  onChange={(e) => handleQuintalChange(crop.id, e.target.value)}
                                  onClick={(e) => e.stopPropagation()}
                                  className="w-16 rounded border border-gray-200 bg-gray-50 px-1.5 py-0.5 text-center text-xs font-black text-gray-900 focus:border-emerald-600 focus:bg-white focus:outline-none"
                                />
                                <span className="text-xs font-bold text-gray-500">Qtl</span>
                              </div>
                            </div>
                            <div className="mt-2 flex items-center justify-between border-t border-gray-100 pt-1.5">
                              <span className="text-xs font-semibold text-gray-500">Total Price:</span>
                              <span className="text-sm font-black text-emerald-900">
                                ₹{Math.round((cardQuintals[crop.id] ?? 10) * crop.mspRate).toLocaleString("en-IN")}
                              </span>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            setShowAllModal(false);
                            navigate("/slot-booking", {
                              state: {
                                selectedCrop: crop.nameEn,
                                cropId: crop.id,
                                quantityQtl: cardQuintals[crop.id] ?? 10,
                              },
                            });
                          }}
                          className="mt-3 flex items-center justify-center gap-1 w-full rounded-xl bg-[#14532d] py-2 text-xs font-bold text-white transition hover:bg-[#0f3e21] active:scale-95 shadow-xs"
                        >
                          Book Procurement Slot <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </main>

      {/* --- Section: How It Works --- */}
      <section className="border-t border-emerald-900/5 bg-white py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="text-center">
            <span className="text-xs font-bold tracking-widest text-[#14532d] uppercase">
              Fast & Paperless
            </span>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">
              Procurement in 4 Simple Steps
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-gray-500">
              Spend minutes at the Mandi instead of waiting whole days with your
              produce.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                num: "01",
                title: "Book Token Online",
                desc: "Select your nearest procurement center, crop type, quantity, and pick a suitable arrival slot.",
              },
              {
                num: "02",
                title: "Track Live Queue",
                desc: "Get real-time SMS alerts and monitor the vehicle movement queue right from your phone.",
              },
              {
                num: "03",
                title: "Instant Quality & Weighing",
                desc: "Automatic weighbridge check and digital quality analysis with zero intermediary tamper.",
              },
              {
                num: "04",
                title: "Direct Bank Settlement",
                desc: "Get digitally generated receipts with direct MSP credit transferred to your DBT linked account.",
              },
            ].map((step, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -4 }}
                className="relative rounded-2xl border border-gray-100 bg-[#f6f9f5] p-6 shadow-sm transition-all"
              >
                <span className="text-3xl font-black text-emerald-300">
                  {step.num}
                </span>
                <h3 className="mt-4 text-base font-bold text-gray-900">
                  {step.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-gray-600">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Section: About the Initiative & Impact Stats --- */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="grid items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <span className="text-xs font-bold tracking-widest text-[#14532d] uppercase">
                About SmartProcure
              </span>
              <h2 className="mt-2 text-3xl font-black text-gray-900 sm:text-4xl">
                Empowering Rural Agriculture with Modern Infrastructure
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-gray-600">
                SmartProcure eliminates mandi congestion, unfair weighing
                practices, and delays in farmer payments. By combining automated
                slot allocation with direct digital receipts, we ensure fair
                compensation for every grain.
              </p>

              <div className="mt-6 space-y-3.5">
                {[
                  "100% digitalized weighing scales integrated with central servers",
                  "Average mandi queue wait time reduced from 9 hours to 40 minutes",
                  "Direct DBT bank account transfer within 24 to 48 hours of sale",
                ].map((point, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                    <span className="text-xs font-semibold text-gray-700">
                      {point}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex gap-3">
                <button
                  onClick={() => navigate("/register")}
                  className="rounded-xl bg-[#14532d] px-5 py-3 text-xs font-bold text-white shadow-md transition hover:bg-[#0f3e21]"
                >
                  Join as a Farmer
                </button>
                <button
                  onClick={() => navigate("/login")}
                  className="rounded-xl border border-gray-300 bg-white px-5 py-3 text-xs font-bold text-gray-700 shadow-sm transition hover:bg-gray-50"
                >
                  Mandi Official Log
                </button>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: "1,450+", label: "Registered Mandis" },
                  { value: "4.8 Lakh+", label: "Farmers Benefited" },
                  { value: "92%", label: "Wait Time Cut" },
                  { value: "₹1,200 Cr+", label: "Direct Disbursed" },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className="rounded-2xl border border-emerald-900/10 bg-white p-6 shadow-sm"
                  >
                    <span className="block text-3xl font-black text-[#14532d]">
                      {stat.value}
                    </span>
                    <span className="mt-1 block text-xs font-semibold text-gray-500">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Section: Contact & Farmer Support Center --- */}
      <section className="border-t border-emerald-900/5 bg-white py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <span className="text-xs font-bold tracking-widest text-[#14532d] uppercase">
                Need Assistance?
              </span>
              <h2 className="mt-2 text-3xl font-black text-gray-900">
                Farmer Help Desk
              </h2>
              <p className="mt-3 text-sm text-gray-600">
                Facing issues booking slots, updating bank details, or checking
                your token status? Our local toll-free support team is active
                24/7.
              </p>

              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-3.5 rounded-xl border border-gray-100 bg-[#f6f9f5] p-3.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#14532d] text-white">
                    <Phone className="h-5 w-5 text-emerald-400" />
                  </div>
                  <div>
                    <span className="block text-[11px] font-bold text-gray-500 uppercase">
                      Toll Free Kisan Helpline
                    </span>
                    <span className="block text-sm font-extrabold text-gray-900">
                      1800-180-1551 / 1800-200-FARM
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3.5 rounded-xl border border-gray-100 bg-[#f6f9f5] p-3.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#14532d] text-white">
                    <Mail className="h-5 w-5 text-emerald-400" />
                  </div>
                  <div>
                    <span className="block text-[11px] font-bold text-gray-500 uppercase">
                      Email Support
                    </span>
                    <span className="block text-sm font-extrabold text-gray-900">
                      support@smartprocure.gov.in
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Query Form */}
            <div className="lg:col-span-7">
              <form
                onSubmit={(e) => e.preventDefault()}
                className="rounded-3xl border border-gray-100 bg-[#f6f9f5] p-8 shadow-sm"
              >
                <h3 className="text-base font-bold text-gray-900">
                  Request Help or Callback
                </h3>
                <p className="mt-1 text-xs text-gray-500">
                  Fill in your basic details and an operator will contact you
                  shortly.
                </p>

                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-semibold text-gray-700">
                      Full Name / किसान का नाम
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Ramesh Patel"
                      className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs text-gray-900 shadow-sm focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-700">
                      Mobile Number / मोबाइल नंबर
                    </label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs text-gray-900 shadow-sm focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="text-xs font-semibold text-gray-700">
                    Nearest Mandi / Center Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Karnal APMC Yard 02"
                    className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs text-gray-900 shadow-sm focus:border-emerald-600 focus:outline-none"
                  />
                </div>

                <div className="mt-4">
                  <label className="text-xs font-semibold text-gray-700">
                    Describe Your Issue
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Slot cancellation, payment status pending, token not received..."
                    className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs text-gray-900 shadow-sm focus:border-emerald-600 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="mt-5 w-full rounded-xl bg-[#14532d] py-3 text-xs font-bold text-white shadow-md transition hover:bg-[#0f3e21]"
                >
                  Submit Query
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="border-t border-gray-200 bg-white pt-14 pb-8">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-4">
            {/* Column 1: Brand Info */}
            <div>
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#14532d] text-white">
                  <Sprout className="h-4 w-4 text-emerald-400" />
                </div>
                <span className="text-base font-extrabold text-[#14532d]">
                  SmartProcure
                </span>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-gray-500">
                National agricultural queue automation & fair procurement
                monitoring system.
              </p>
              <span className="mt-4 block text-[11px] font-semibold text-emerald-800">
                Smart India Initiative • 2026
              </span>
            </div>

            {/* Column 2: Farmer Services */}
            <div>
              <h4 className="text-xs font-bold text-gray-900 uppercase">
                Farmer Services
              </h4>
              <ul className="mt-3 space-y-2 text-xs text-gray-600">
                <li>
                  <button
                    onClick={() => navigate("/slot-booking")}
                    className="hover:text-emerald-700"
                  >
                    Book Token Slot
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/dashboard")}
                    className="hover:text-emerald-700"
                  >
                    Check Queue Status
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/dashboard")}
                    className="hover:text-emerald-700"
                  >
                    MSP Price Bulletin
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/registrationsucess")}
                    className="hover:text-emerald-700"
                  >
                    Verify e-Receipt
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Officials & APMC */}
            <div>
              <h4 className="text-xs font-bold text-gray-900 uppercase">
                Mandi Officials
              </h4>
              <ul className="mt-3 space-y-2 text-xs text-gray-600">
                <li>
                  <button
                    onClick={() => navigate("/login")}
                    className="hover:text-emerald-700"
                  >
                    Operator Terminal
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/dashboard")}
                    className="hover:text-emerald-700"
                  >
                    Weighbridge Interface
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/login")}
                    className="hover:text-emerald-700"
                  >
                    Quality Assayer Login
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/dashboard")}
                    className="hover:text-emerald-700"
                  >
                    Daily Procurement Reports
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 4: Quick Auth & Emergency */}
            <div>
              <h4 className="text-xs font-bold text-gray-900 uppercase">
                Quick Access
              </h4>
              <div className="mt-3 space-y-2.5">
                <button
                  onClick={() => navigate("/register")}
                  className="w-full rounded-lg bg-[#14532d] py-2 text-center text-xs font-bold text-white shadow-sm hover:bg-[#0f3e21]"
                >
                  Farmer Registration
                </button>
                <button
                  onClick={() => navigate("/login")}
                  className="w-full rounded-lg border border-gray-300 py-2 text-center text-xs font-bold text-gray-700 hover:bg-gray-50"
                >
                  Mandi Official Login
                </button>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-gray-100 pt-6 text-[11px] text-gray-500 sm:flex-row">
            <p>© 2026 SmartProcure Portal. All rights reserved.</p>
            <div className="flex gap-4">
              <span className="hover:underline cursor-pointer">
                Terms & Conditions
              </span>
              <span className="hover:underline cursor-pointer">
                Privacy Policy
              </span>
              <span className="hover:underline cursor-pointer">
                Hyperlinking Policy
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
