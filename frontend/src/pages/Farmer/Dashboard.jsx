

import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sprout,
  Tractor,
  CalendarDays,
  Clock,
  CheckCircle2,
  AlertCircle,
  Landmark,
  Scale,
  QrCode,
  Bell,
  LogOut,
  Plus,
  ChevronRight,
  Download,
  FileText,
  MapPin,
  RefreshCw,
  TrendingUp,
  User
} from 'lucide-react';

export default function FarmerDashboard() {
  const navigate = useNavigate();

  // Load farmer details from localStorage or use defaults
  const [farmer, setFarmer] = useState({
    name: localStorage.getItem('userName') || 'Ramesh Patel',
    kisanId: 'KCC-894231',
    phone: '+91 98765 43210',
    landHolding: '4.5 Acres',
    bankAccount: '•••• •••• 4523 (SBI)',
    activeCenter: 'Patna Main APMC Mandi #02'
  });

  const [activeToken, setActiveToken] = useState({
    tokenNumber: 'TK-4029',
    crop: 'Wheat (Grade A)',
    quantity: '40 Quintals',
    slotTime: '10:30 AM - 11:30 AM, Today',
    center: 'Patna Main APMC Mandi - Yard 04',
    currentStage: 3, // 1: Gate In, 2: Quality Assay, 3: Weighbridge, 4: DBT Payout
    queuePosition: 3,
    estimatedWait: '20 mins'
  });

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#f4f7f4] font-sans text-gray-800 antialiased selection:bg-emerald-200 selection:text-emerald-900">
      
      {/* --- Top Navigation Header --- */}
      <header className="sticky top-0 z-40 border-b border-emerald-900/5 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5 lg:px-12">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#14532d] text-white shadow-sm">
              <Sprout className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <span className="block text-base font-extrabold leading-tight tracking-tight text-[#14532d]">
                SmartProcure
              </span>
              <span className="block text-[9px] font-bold uppercase tracking-wider text-emerald-700">
                Farmer Portal
              </span>
            </div>
          </Link>

          {/* User Details & Actions */}
          <div className="flex items-center gap-3">
            <button className="relative rounded-full p-2 text-gray-600 hover:bg-gray-100 transition">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white animate-pulse" />
            </button>

            <div className="hidden items-center gap-2.5 sm:flex border-l border-gray-200 pl-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-[#14532d]">
                <Tractor className="h-4 w-4" />
              </div>
              <div className="text-left text-xs">
                <span className="block font-bold text-gray-900 leading-tight">{farmer.name}</span>
                <span className="block text-[10px] text-gray-500 font-semibold">{farmer.kisanId}</span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="rounded-lg p-2 text-gray-500 hover:bg-red-50 hover:text-red-600 transition"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* --- Main Dashboard Content --- */}
      <main className="mx-auto max-w-7xl px-6 py-8 lg:px-12 space-y-8">
        
        {/* Welcome Banner */}
        <div className="flex flex-col justify-between gap-4 rounded-3xl bg-gradient-to-r from-[#14532d] via-[#166534] to-[#15803d] p-7 text-white shadow-lg sm:flex-row sm:items-center">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-[11px] font-semibold backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Kharif 2026 Mandi Procurement Active
            </span>
            <h1 className="mt-3 text-2xl font-black sm:text-3xl">Namaste, {farmer.name}!</h1>
            <p className="mt-1 text-xs text-emerald-100 max-w-lg">
              Manage your active drop-off tokens, track mandi scale progress, and monitor direct DBT bank settlement.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => navigate('/slot-booking')}
              className="flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-xs font-bold text-[#14532d] shadow-md transition hover:bg-emerald-50 active:scale-95"
            >
              <Plus className="h-4 w-4" />
              Book New Slot
            </button>
          </div>
        </div>

        {/* --- Quick Metrics Grid --- */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: 'Active Digital Token',
              val: activeToken.tokenNumber,
              sub: activeToken.crop,
              icon: QrCode,
              color: 'text-emerald-700',
              bg: 'bg-emerald-50'
            },
            {
              label: 'Queue Status',
              val: `${activeToken.queuePosition} Vehicles Ahead`,
              sub: `Approx. ${activeToken.estimatedWait} wait time`,
              icon: Clock,
              color: 'text-amber-600',
              bg: 'bg-amber-50'
            },
            {
              label: 'Procured This Season',
              val: '64.5 Qtl',
              sub: 'Across 2 Mandi visits',
              icon: Scale,
              color: 'text-blue-700',
              bg: 'bg-blue-50'
            },
            {
              label: 'Total DBT Disbursed',
              val: '₹1,46,737',
              sub: `Linked to ${farmer.bankAccount}`,
              icon: Landmark,
              color: 'text-[#14532d]',
              bg: 'bg-emerald-50'
            }
          ].map((card, idx) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={idx}
                whileHover={{ y: -3 }}
                className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{card.label}</span>
                  <div className={`rounded-xl p-2 ${card.bg} ${card.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                </div>
                <span className={`mt-2 block text-xl font-black ${card.color}`}>{card.val}</span>
                <span className="mt-1 block text-xs text-gray-500">{card.sub}</span>
              </motion.div>
            );
          })}
        </div>

        {/* --- Active Token & Stage Progress --- */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          
          {/* Main Queue Timeline Card */}
          <div className="lg:col-span-8 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-4 gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-gray-900">Live Token Progress</h2>
                  <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-black text-emerald-800">
                    #{activeToken.tokenNumber}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  Slot: {activeToken.slotTime} • {activeToken.center}
                </p>
              </div>

              <span className="inline-flex items-center gap-1.5 self-start rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-bold text-[#14532d]">
                <span className="h-2 w-2 rounded-full bg-emerald-600 animate-ping" />
                Live In Yard
              </span>
            </div>

            {/* 4-Step Process Timeline */}
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-4">
              {[
                { stage: 1, title: 'Gate Inward', desc: 'QR Scanned & Verified', time: '10:15 AM' },
                { stage: 2, title: 'Quality Assay', desc: 'Grade A (11.2% Moisture)', time: '10:35 AM' },
                { stage: 3, title: 'Weighbridge', desc: 'Current: Scale #02', time: 'In Progress' },
                { stage: 4, title: 'DBT Payout', desc: 'Direct Bank Settlement', time: 'Pending' }
              ].map((step, idx) => {
                const isCompleted = activeToken.currentStage > step.stage;
                const isCurrent = activeToken.currentStage === step.stage;

                return (
                  <div
                    key={idx}
                    className={`relative rounded-2xl border p-4 text-left transition ${
                      isCompleted
                        ? 'border-emerald-200 bg-emerald-50/60'
                        : isCurrent
                        ? 'border-amber-400 bg-amber-50/50 ring-2 ring-amber-400/20'
                        : 'border-gray-100 bg-gray-50 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-gray-400 uppercase">Stage 0{step.stage}</span>
                      {isCompleted && <CheckCircle2 className="h-4 w-4 text-emerald-600" />}
                      {isCurrent && <RefreshCw className="h-4 w-4 text-amber-600 animate-spin" />}
                    </div>
                    <h3 className="mt-2 text-xs font-bold text-gray-900">{step.title}</h3>
                    <p className="mt-0.5 text-[11px] font-semibold text-emerald-800">{step.desc}</p>
                    <span className="mt-2 block text-[10px] text-gray-400">{step.time}</span>
                  </div>
                );
              })}
            </div>

            {/* Token Action Footer */}
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl bg-gray-50 p-4 text-xs text-gray-700">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-emerald-700 shrink-0" />
                <span><strong>Target Unloading Bay:</strong> Bay #03 (Wheat Silo Terminal)</span>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <button 
                  onClick={() => navigate('/slot-booking')}
                  className="w-full sm:w-auto rounded-xl border border-gray-300 bg-white px-3.5 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50"
                >
                  Change Slot
                </button>
                <button 
                  onClick={() => navigate('/registrationsucess')}
                  className="w-full sm:w-auto rounded-xl bg-[#14532d] px-3.5 py-2 text-xs font-bold text-white hover:bg-[#0f3e21]"
                >
                  View Gate Pass
                </button>
              </div>
            </div>
          </div>

          {/* Today's MSP Live Ticker */}
          <div className="lg:col-span-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-gray-900">Today's Mandi MSP Rates</h3>
                <TrendingUp className="h-4 w-4 text-emerald-600" />
              </div>
              <p className="text-xs text-gray-500">Official Government Assured Purchase Price</p>

              <div className="mt-5 space-y-3">
                {[
                  { crop: 'Wheat (Grade A)', rate: '₹2,275 / Qtl', status: 'Procuring' },
                  { crop: 'Mustard Seeds', rate: '₹5,650 / Qtl', status: 'High Demand' },
                  { crop: 'Paddy (Common)', rate: '₹2,183 / Qtl', status: 'Active' },
                  { crop: 'Gram (Chana)', rate: '₹5,440 / Qtl', status: 'Active' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between rounded-xl border border-gray-100 p-3 text-xs">
                    <div>
                      <span className="font-bold text-gray-900 block">{item.crop}</span>
                      <span className="text-[10px] font-semibold text-emerald-700">{item.status}</span>
                    </div>
                    <span className="font-black text-gray-900">{item.rate}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => navigate('/slot-booking')}
              className="mt-6 w-full rounded-xl bg-emerald-50 py-2.5 text-xs font-bold text-[#14532d] hover:bg-emerald-100 transition"
            >
              Book Slot at These Rates
            </button>
          </div>

        </div>

        {/* --- Procurement History & Receipts Table --- */}
        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 gap-2">
            <div>
              <h3 className="text-base font-bold text-gray-900">Procurement & Payment History</h3>
              <p className="text-xs text-gray-500">Official digital weightment slips & DBT transfer reference</p>
            </div>
            <button className="flex items-center gap-1 text-xs font-bold text-[#14532d] hover:underline">
              <Download className="h-3.5 w-3.5" /> Download All Receipts (PDF)
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-gray-100 bg-gray-50 text-[10px] font-bold text-gray-500 uppercase">
                <tr>
                  <th className="py-3 px-4">Receipt No.</th>
                  <th className="py-3 px-4">Commodity</th>
                  <th className="py-3 px-4">Net Weight</th>
                  <th className="py-3 px-4">Total Amount</th>
                  <th className="py-3 px-4">Payment Status</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {[
                  { id: 'REC-2026-9021', crop: 'Wheat (Grade A)', weight: '54.0 Qtl', amt: '₹1,22,850', status: 'Credited (DBT)', date: '24 Aug 2026' },
                  { id: 'REC-2026-8812', crop: 'Mustard Seeds', weight: '22.4 Qtl', amt: '₹1,26,560', status: 'Credited (DBT)', date: '12 Aug 2026' },
                  { id: 'REC-2026-7640', crop: 'Paddy (Common)', weight: '65.2 Qtl', amt: '₹1,42,331', status: 'Credited (DBT)', date: '02 Aug 2026' }
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50/80 transition">
                    <td className="py-3 px-4 font-bold text-gray-900">{row.id}</td>
                    <td className="py-3 px-4">{row.crop}</td>
                    <td className="py-3 px-4 font-semibold">{row.weight}</td>
                    <td className="py-3 px-4 font-extrabold text-emerald-800">{row.amt}</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                        <CheckCircle2 className="h-3 w-3" />
                        {row.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-500">{row.date}</td>
                    <td className="py-3 px-4 text-right">
                      <button 
                        onClick={() => navigate('/registrationsucess')}
                        className="font-bold text-[#14532d] hover:underline"
                      >
                        View Slip
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}