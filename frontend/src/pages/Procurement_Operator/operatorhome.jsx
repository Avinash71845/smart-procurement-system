import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CalendarCheck,
  GitFork,
  Activity,
  Receipt,
  Building2,
  Scale,
  FileSpreadsheet,
  LayoutDashboard,
  ChevronRight,
  Menu,
  X,
  UserCheck,
  CheckCircle2,
  Phone,
  Mail,
  Layers,
  QrCode,
  LogOut,
  CalendarPlus,
  Search,
  RefreshCw,
  TrendingUp,
} from "lucide-react";
import { clearSession } from "../../utils/session";
import { fetchIntakeBoard, fetchCommodityPrices } from "../../api/commodityApi";

const operatorFeatures = [
  {
    icon: CalendarCheck,
    title: "Slot Approval & Schedule Updates",
    desc: "Review farmer booking requests, adjust capacity, and broadcast confirmed arrival windows directly to the farmer app.",
    route: "/slot-approve",
  },
  {
    icon: GitFork,
    title: "Live Queue & Gate Callouts",
    desc: "Update gate clearance and push instant queue alerts to inform farmers when their turn approaches.",
    route: "/queue-manage",
  },
  {
    icon: Activity,
    title: "Real-Time Weighing & Quality Broadcast",
    desc: "Publish verified net weights and grade test results so farmers can review appraisal records on their phone.",
    route: "/weighing-details",
  },
  {
    icon: Receipt,
    title: "Payment Push & DBT Status Sync",
    desc: "Clear digital J-Forms, initiate bank settlements, and push live payment disbursement statuses to farmer accounts.",
    route: "/payment-give",
  },
];

export default function OperatorHome() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Live Yard Intake Board & Real-Time Prices
  const [intakeBoard, setIntakeBoard] = useState(null);
  const [allCommodities, setAllCommodities] = useState([]);
  const [intakeSearchQuery, setIntakeSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loadingIntake, setLoadingIntake] = useState(false);

  const loadIntakeData = async () => {
    setLoadingIntake(true);
    try {
      const [board, commodities] = await Promise.all([
        fetchIntakeBoard(),
        fetchCommodityPrices(),
      ]);
      if (board) setIntakeBoard(board);
      if (commodities) setAllCommodities(commodities);
    } catch (err) {
      console.error("Failed to load intake data:", err);
    } finally {
      setLoadingIntake(false);
    }
  };

  useEffect(() => {
    loadIntakeData();
    const interval = setInterval(loadIntakeData, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    clearSession();
    navigate("/operator-login");
  };

  return (
    <div className="relative min-h-screen w-full bg-[#f6f9f5] font-sans text-gray-800 antialiased selection:bg-emerald-200 selection:text-emerald-900">
      {/* Background Gradient & Illustration */}
      <div
        className="pointer-events-none absolute inset-0 z-0 h-[680px] w-full bg-cover bg-center opacity-90"
        style={{
          backgroundImage: `
            radial-gradient(ellipse at 80% 40%, rgba(212, 245, 195, 0.45) 0%, rgba(255,255,255,0) 70%),
            linear-gradient(to bottom, rgba(255,255,255,0.7) 0%, rgba(246, 249, 245, 1) 100%),
            url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=2000&q=80')
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
              <Building2 className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <span className="block text-lg font-extrabold leading-tight tracking-tight text-[#14532d]">
                SmartProcure{" "}
                <span className="text-xs font-semibold text-emerald-700 uppercase tracking-normal">
                  | Operator
                </span>
              </span>
              <span className="block text-[10px] font-semibold tracking-wider text-emerald-700 uppercase">
                Mandi Operational Terminal
              </span>
            </div>
          </div>

          {/* Desktop Nav Actions */}
          <nav className="hidden items-center gap-1.5 rounded-full border border-gray-200/80 bg-gray-50/80 p-1 lg:flex">
            <button
              onClick={() => navigate("/operatordashboard")}
              className="flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold text-gray-700 transition hover:bg-white hover:text-[#14532d] hover:shadow-sm"
            >
              <LayoutDashboard className="h-3.5 w-3.5 text-emerald-600" />
              Operator Console
            </button>

            <button
              onClick={() => navigate("/operatordashboard")}
              className="flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold text-gray-700 transition hover:bg-white hover:text-[#14532d] hover:shadow-sm"
            >
              <Scale className="h-3.5 w-3.5 text-emerald-600" />
              Scale Terminals
            </button>

            <button
              onClick={() => navigate("/operatordashboard")}
              className="flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold text-gray-700 transition hover:bg-white hover:text-[#14532d] hover:shadow-sm"
            >
              <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" />
              Daily Stock Ledger
            </button>
          </nav>

          {/* Desktop Right Actions */}
          <div className="hidden items-center gap-3 md:flex">
            <button
              onClick={() => navigate("/operatordashboard")}
              className="flex items-center gap-1.5 rounded-lg border border-emerald-900/10 bg-emerald-50/60 px-3.5 py-2 text-xs font-bold text-[#14532d] transition hover:bg-emerald-100/70"
            >
              <UserCheck className="h-3.5 w-3.5" />
              Shift: Station 04
            </button>

            <div className="h-5 w-[1px] bg-gray-200" />

            <button
              onClick={() => navigate("/operatordashboard")}
              className="flex items-center gap-1.5 rounded-lg bg-[#14532d] px-4 py-2 text-xs font-bold text-white shadow-sm transition-all duration-150 hover:bg-[#0f3e21] active:scale-95"
            >
              <Layers className="h-3.5 w-3.5" />
              Launch Terminal
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold text-gray-600 transition hover:bg-red-50 hover:text-red-700"
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
                navigate("/operatordashboard");
              }}
              className="flex w-full items-center justify-between rounded-lg bg-gray-50 px-3.5 py-2.5 text-left text-xs font-semibold text-gray-800"
            >
              <span className="flex items-center gap-2.5">
                <LayoutDashboard className="h-4 w-4 text-emerald-600" />
                Operator Console
              </span>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                navigate("/operatordashboard");
              }}
              className="flex w-full items-center justify-between rounded-lg bg-gray-50 px-3.5 py-2.5 text-left text-xs font-semibold text-gray-800"
            >
              <span className="flex items-center gap-2.5">
                <Scale className="h-4 w-4 text-emerald-600" />
                Weighbridge Terminal
              </span>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                navigate("/operatordashboard");
              }}
              className="flex w-full items-center justify-between rounded-lg bg-gray-50 px-3.5 py-2.5 text-left text-xs font-semibold text-gray-800"
            >
              <span className="flex items-center gap-2.5">
                <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
                Daily Stock Ledger
              </span>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </button>

            <div className="border-t border-gray-100 pt-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate("/operatordashboard");
                }}
                className="w-full rounded-lg bg-[#14532d] py-2.5 text-center text-xs font-bold text-white"
              >
                Go to Mandi Dashboard
              </button>
            </div>
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
              Mandi Control Station • APMC Operations 2026
            </div>

            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-[3.25rem] lg:leading-[1.15]">
              Smart Procurement <br />
              <span className="text-[#14532d]">for Mandi Operators</span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-gray-600 sm:text-lg">
              Approve booking slots, broadcast queue callouts, record certified
              scale weighments, and sync DBT payment statuses directly to the
              farmer app.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/operatordashboard")}
                className="flex items-center gap-2 rounded-xl bg-[#14532d] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-950/10 transition-all hover:bg-[#0f3e21]"
              >
                <QrCode className="h-4 w-4" />
                Scan Token / Update Queue
                <ChevronRight className="h-4 w-4" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/operatordashboard")}
                className="rounded-xl border border-gray-300 bg-white/80 px-6 py-3.5 text-sm font-bold text-gray-800 backdrop-blur-sm transition-all hover:bg-white hover:shadow-sm"
              >
                Open Weighbridge Station
              </motion.button>
            </div>
          </motion.div>

          {/* Right Column */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative flex justify-center lg:col-span-5 lg:justify-end"
          >
            <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/80 bg-white/40 p-2.5 shadow-2xl backdrop-blur-sm">
              <img
                src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80"
                alt="Mandi operator managing warehouse stock and logistics"
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
          {operatorFeatures.map((item, index) => {
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

        {/* Live Procurement Activity Board */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-16 rounded-2xl border border-emerald-900/10 bg-white/90 p-6 shadow-sm backdrop-blur-md"
        >
          {/* Header Row */}
          <div className="flex flex-col items-start justify-between gap-4 border-b border-gray-100 pb-5 sm:flex-row sm:items-center">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-extrabold tracking-wider text-emerald-700 uppercase">
                  Live Yard Intake Board
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-ping" />
                  Real-Time API Sync
                </span>
              </div>
              <h2 className="mt-1 text-lg font-black text-gray-900">
                Today's Procurement Target & Intake Tonnage
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={loadIntakeData}
                disabled={loadingIntake}
                className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 active:scale-95 disabled:opacity-60"
                title="Refresh Intake Rates"
              >
                <RefreshCw className={`h-3.5 w-3.5 text-emerald-700 ${loadingIntake ? "animate-spin" : ""}`} />
                <span>{loadingIntake ? "Syncing..." : "Refresh"}</span>
              </button>

              <button
                onClick={() => navigate("/operatordashboard")}
                className="flex items-center gap-1 text-xs font-bold text-[#14532d] hover:underline"
              >
                Full Center Report <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Aggregate Metrics Bar */}
          {intakeBoard && (
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-gradient-to-r from-emerald-50 via-green-50 to-emerald-50/50 p-3.5 border border-emerald-100 text-xs">
              <div className="flex items-center gap-6">
                <div>
                  <span className="text-[10px] font-semibold text-gray-500 uppercase block">Total Intake Tonnage</span>
                  <span className="text-sm font-black text-emerald-900">
                    {intakeBoard.totalIntakeTonnageQtl?.toLocaleString()} Qtl
                  </span>
                </div>
                <div className="h-6 w-px bg-emerald-200" />
                <div>
                  <span className="text-[10px] font-semibold text-gray-500 uppercase block">Total Target Target</span>
                  <span className="text-sm font-black text-gray-800">
                    {intakeBoard.totalTargetTonnageQtl?.toLocaleString()} Qtl
                  </span>
                </div>
                <div className="h-6 w-px bg-emerald-200 hidden sm:block" />
                <div className="hidden sm:block">
                  <span className="text-[10px] font-semibold text-gray-500 uppercase block">Overall Completion</span>
                  <span className="text-sm font-black text-emerald-700">
                    {intakeBoard.overallTargetPercentage}% Target
                  </span>
                </div>
              </div>

              <div className="text-[11px] text-gray-500 font-medium">
                Last updated: <span className="font-bold text-gray-700">{intakeBoard.lastUpdated}</span>
              </div>
            </div>
          )}

          {/* Search & Category Filter Bar */}
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {/* Search input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search any crop (e.g. Wheat, गेहूं, Sarson, Chana, धान)..."
                value={intakeSearchQuery}
                onChange={(e) => setIntakeSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white py-2 pl-10 pr-4 text-xs font-medium text-gray-800 placeholder-gray-400 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
              {intakeSearchQuery && (
                <button
                  onClick={() => setIntakeSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600 font-bold"
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
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                    selectedCategory === cat
                      ? "bg-[#14532d] text-white shadow-sm"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic Crop Cards Grid */}
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {(() => {
              const sourceList =
                allCommodities.length > 0
                  ? allCommodities
                  : intakeBoard?.crops || [];

              const filtered = sourceList.filter((item) => {
                const matchesCat =
                  selectedCategory === "All" ||
                  item.category?.toLowerCase() === selectedCategory.toLowerCase();
                if (!matchesCat) return false;

                if (!intakeSearchQuery.trim()) {
                  // Default view: show primary 6 yard intake crops if no query and 'All' category
                  return selectedCategory !== "All" || [
                    "wheat-grade-a", "paddy-common", "mustard-seeds",
                    "cotton-medium", "gram-chana", "soybean-yellow"
                  ].includes(item.id);
                }

                const q = intakeSearchQuery.trim().toLowerCase();
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
                    No crops found matching "{intakeSearchQuery}".{" "}
                    <button
                      onClick={() => {
                        setIntakeSearchQuery("");
                        setSelectedCategory("All");
                      }}
                      className="font-bold text-emerald-700 underline ml-1"
                    >
                      Clear Filters
                    </button>
                  </div>
                );
              }

              return filtered.map((item) => (
                <div
                  key={item.id}
                  className="group relative rounded-xl border border-gray-100 bg-[#f9fbf8] p-3 text-center transition-all duration-200 hover:border-emerald-300 hover:bg-white hover:shadow-md"
                >
                  {/* Category Pill */}
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[9px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded">
                      {item.category}
                    </span>
                    <span
                      className={`text-[9px] font-extrabold ${
                        item.trend?.startsWith("+") ? "text-emerald-700" : "text-red-500"
                      }`}
                    >
                      {item.trend}
                    </span>
                  </div>

                  {/* Crop Names */}
                  <span className="block text-xs font-bold text-gray-800 truncate" title={item.nameEn}>
                    {item.nameEn}
                  </span>
                  {item.nameHi && (
                    <span className="block text-[10px] font-medium text-gray-400">
                      {item.nameHi}
                    </span>
                  )}

                  {/* Weight / Tonnage */}
                  <div className="mt-2 border-t border-gray-100 pt-1.5">
                    <span className="block text-xs font-black text-gray-900">
                      {item.targetTonnageQtl ? `${item.targetTonnageQtl.toLocaleString()} Qtl` : `${item.marketPrice} / Qtl`}
                    </span>
                    <span className="inline-block text-[10px] font-bold text-emerald-700">
                      {item.status || `Target ${item.targetPercentage}%`}
                    </span>
                  </div>

                  {/* Official Govt MSP Rate */}
                  <div className="mt-2 rounded-lg bg-emerald-50/90 py-1.5 px-2 text-[10px] text-emerald-900 border border-emerald-100">
                    <span className="text-gray-500 font-bold block text-[9px] uppercase">Official Govt MSP</span>
                    <span className="font-extrabold text-xs text-[#14532d]">₹{item.mspRate?.toLocaleString()} / Qtl</span>
                  </div>
                </div>
              ));
            })()}
          </div>
        </motion.div>
      </main>

      {/* Section: Operational Workflow */}
      <section className="border-t border-emerald-900/5 bg-white py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="text-center">
            <span className="text-xs font-bold tracking-widest text-[#14532d] uppercase">
              Standard Operating Procedure
            </span>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">
              Procurement Cycle in 4 Steps
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-gray-500">
              Systematic digital verification from the moment a vehicle enters
              the gate to DBT receipt clearance.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                num: "01",
                title: "Token & Vehicle Check",
                desc: "Scan QR token at the entry barrier, verify vehicle registration, and broadcast gate entry.",
              },
              {
                num: "02",
                title: "Gross Weight Capture",
                desc: "Tractor mounts weighbridge; scale data syncs directly with zero manual entry.",
              },
              {
                num: "03",
                title: "Quality Lab Assaying",
                desc: "Test grain samples for moisture %, impurities, and log digital grading against MSP norms.",
              },
              {
                num: "04",
                title: "Tare Weigh & J-Form Sync",
                desc: "Tare weight deducted automatically, digital J-Form created, and payout sent to central bank server.",
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

      {/* Section: Station Highlights & Impact */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="grid items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <span className="text-xs font-bold tracking-widest text-[#14532d] uppercase">
                Terminal Governance
              </span>
              <h2 className="mt-2 text-3xl font-black text-gray-900 sm:text-4xl">
                Ensuring Mandi Transparency & Operational Velocity
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-gray-600">
                SmartProcure equips mandi operators with interconnected tools to
                prevent fraud, speed up vehicle turnaround times, and keep
                central food inventory ledgers 100% auditable.
              </p>

              <div className="mt-6 space-y-3.5">
                {[
                  "100% tamper-proof IoT scales linked directly to state procurement servers",
                  "Vehicle turnaround time cut down from 9 hours to under 40 minutes",
                  "Instant digital J-Form emission and direct central DBT pipeline trigger",
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
                  onClick={() => navigate("/operatordashboard")}
                  className="rounded-xl bg-[#14532d] px-5 py-3 text-xs font-bold text-white shadow-md transition hover:bg-[#0f3e21]"
                >
                  Launch Operator Console
                </button>
                <button
                  onClick={() => navigate("/operatordashboard")}
                  className="rounded-xl border border-gray-300 bg-white px-5 py-3 text-xs font-bold text-gray-700 shadow-sm transition hover:bg-gray-50"
                >
                  Weighbridge Station
                </button>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: "142", label: "Vehicles Cleared Today" },
                  { value: "6,480 Qtl", label: "Tonnage Processed" },
                  { value: "99.4%", label: "Scale IoT Uptime" },
                  { value: "₹1.47 Cr", label: "Settlement Cleared" },
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

      {/* Section: Operator Support & APMC Tech Desk */}
      <section className="border-t border-emerald-900/5 bg-white py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <span className="text-xs font-bold tracking-widest text-[#14532d] uppercase">
                Technical Assistance
              </span>
              <h2 className="mt-2 text-3xl font-black text-gray-900">
                APMC & Scale Help Desk
              </h2>
              <p className="mt-3 text-sm text-gray-600">
                Facing IoT scale connectivity drops, DBT pipeline transmission
                errors, or scanner issues? Our 24/7 technical team is on
                standby.
              </p>

              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-3.5 rounded-xl border border-gray-100 bg-[#f6f9f5] p-3.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#14532d] text-white">
                    <Phone className="h-5 w-5 text-emerald-400" />
                  </div>
                  <div>
                    <span className="block text-[11px] font-bold text-gray-500 uppercase">
                      Operator Tech Hotline
                    </span>
                    <span className="block text-sm font-extrabold text-gray-900">
                      1800-200-APMC (Ext 4)
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3.5 rounded-xl border border-gray-100 bg-[#f6f9f5] p-3.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#14532d] text-white">
                    <Mail className="h-5 w-5 text-emerald-400" />
                  </div>
                  <div>
                    <span className="block text-[11px] font-bold text-gray-500 uppercase">
                      Central Server IT Ops
                    </span>
                    <span className="block text-sm font-extrabold text-gray-900">
                      techops@smartprocure.gov.in
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
                  Report Terminal Incident / Hardware Issue
                </h3>
                <p className="mt-1 text-xs text-gray-500">
                  Submit an urgent ticket for scale recalibration or server
                  timeout.
                </p>

                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-semibold text-gray-700">
                      Operator Name / Staff ID
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. EMP-PAT-8921"
                      className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs text-gray-900 shadow-sm focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-700">
                      Mandi Yard & Terminal Number
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Karnal APMC - Scale Bay 02"
                      className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs text-gray-900 shadow-sm focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="text-xs font-semibold text-gray-700">
                    Issue Category
                  </label>
                  <select className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs text-gray-900 shadow-sm focus:border-emerald-600 focus:outline-none">
                    <option>Weighbridge Scale Desync / Calibration</option>
                    <option>Moisture Meter / Assayer Data Timeout</option>
                    <option>DBT Direct Payment Push Error</option>
                    <option>Token Barcode / Scanner Failure</option>
                  </select>
                </div>

                <div className="mt-4">
                  <label className="text-xs font-semibold text-gray-700">
                    Describe Specific Issue
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Provide error code or description of the failure..."
                    className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs text-gray-900 shadow-sm focus:border-emerald-600 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="mt-5 w-full rounded-xl bg-[#14532d] py-3 text-xs font-bold text-white shadow-md transition hover:bg-[#0f3e21]"
                >
                  Submit Incident Ticket
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white pt-14 pb-8">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-4">
            {/* Column 1: Brand Info */}
            <div>
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#14532d] text-white">
                  <Building2 className="h-4 w-4 text-emerald-400" />
                </div>
                <span className="text-base font-extrabold text-[#14532d]">
                  SmartProcure
                </span>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-gray-500">
                National agricultural queue automation & central procurement
                terminal infrastructure.
              </p>
              <span className="mt-4 block text-[11px] font-semibold text-emerald-800">
                APMC State Network • 2026
              </span>
            </div>

            {/* Column 2: Operator Desks */}
            <div>
              <h4 className="text-xs font-bold text-gray-900 uppercase">
                Operator Desks
              </h4>
              <ul className="mt-3 space-y-2 text-xs text-gray-600">
                <li>
                  <button
                    onClick={() => navigate("/operatordashboard")}
                    className="hover:text-emerald-700"
                  >
                    Gate Entry Scanner
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/operatordashboard")}
                    className="hover:text-emerald-700"
                  >
                    Weighbridge Terminal
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/operatordashboard")}
                    className="hover:text-emerald-700"
                  >
                    Quality Assaying Lab
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/operatordashboard")}
                    className="hover:text-emerald-700"
                  >
                    J-Form Settlement Hub
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Administration */}
            <div>
              <h4 className="text-xs font-bold text-gray-900 uppercase">
                Mandi Administration
              </h4>
              <ul className="mt-3 space-y-2 text-xs text-gray-600">
                <li>
                  <button
                    onClick={() => navigate("/operatordashboard")}
                    className="hover:text-emerald-700"
                  >
                    Daily Stock Intake
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/operatordashboard")}
                    className="hover:text-emerald-700"
                  >
                    Yard Traffic & Unloading
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/operatordashboard")}
                    className="hover:text-emerald-700"
                  >
                    FCI Storage Transit
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/operatordashboard")}
                    className="hover:text-emerald-700"
                  >
                    Audit Compliance Logs
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 4: Quick Auth */}
            <div>
              <h4 className="text-xs font-bold text-gray-900 uppercase">
                Terminal Access
              </h4>
              <div className="mt-3 space-y-2.5">
                <button
                  onClick={() => navigate("/operatordashboard")}
                  className="w-full rounded-lg bg-[#14532d] py-2 text-center text-xs font-bold text-white shadow-sm hover:bg-[#0f3e21]"
                >
                  Operator Console
                </button>
                <button
                  onClick={() => navigate("/login")}
                  className="w-full rounded-lg border border-gray-300 py-2 text-center text-xs font-bold text-gray-700 hover:bg-gray-50"
                >
                  Switch User / Farmer Login
                </button>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-gray-100 pt-6 text-[11px] text-gray-500 sm:flex-row">
            <p>© 2026 SmartProcure Mandi Operations. All rights reserved.</p>
            <div className="flex gap-4">
              <span className="hover:underline cursor-pointer">
                Terminal SOP
              </span>
              <span className="hover:underline cursor-pointer">
                Data Privacy
              </span>
              <span className="hover:underline cursor-pointer">
                APMC Guidelines
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
