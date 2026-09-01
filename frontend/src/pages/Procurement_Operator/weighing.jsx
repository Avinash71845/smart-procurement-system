import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  Scale,
  FlaskConical,
  Search,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Truck,
  Wheat,
  Radio,
  Send,
  RefreshCw,
  Sliders,
  FileCheck,
  ChevronRight,
  Info
} from 'lucide-react';

const initialAppraisalQueue = [
  {
    id: 'APR-01',
    tokenId: 'TKN-2026-8837',
    farmerName: 'Baldev Singh',
    phone: '+91 98765 11001',
    vehicleNo: 'HR-05-CD-3312',
    crop: 'Wheat (Grade A)',
    assignedBay: 'Weigh Bay 01',
    grossWeight: 7240, // kg
    tareWeight: 2740,  // kg
    netWeight: 4500,   // kg (45 Qtl)
    moisture: 11.4,    // %
    foreignMatter: 0.45, // %
    grade: 'Grade A',
    status: 'Ready to Publish', // 'Weighing' | 'Assaying' | 'Ready to Publish' | 'Published'
    isPublished: false
  },
  {
    id: 'APR-02',
    tokenId: 'TKN-2026-8838',
    farmerName: 'Gurpreet Singh',
    phone: '+91 94160 22334',
    vehicleNo: 'HR-05-AA-9912',
    crop: 'Wheat (Grade A)',
    assignedBay: 'Weigh Bay 02',
    grossWeight: 6800,
    tareWeight: null,
    netWeight: null,
    moisture: 12.8,
    foreignMatter: 0.65,
    grade: 'Grade B (Minor Deduction)',
    status: 'Assaying',
    isPublished: false
  },
  {
    id: 'APR-03',
    tokenId: 'TKN-2026-8841',
    farmerName: 'Ramesh Patel',
    phone: '+91 98765 43210',
    crop: 'Wheat (Grade A)',
    assignedBay: 'Weigh Bay 02',
    grossWeight: 7150,
    tareWeight: 2650,
    netWeight: 4500,
    moisture: 11.2,
    foreignMatter: 0.35,
    grade: 'Grade A',
    status: 'Published',
    isPublished: true,
    publishedAt: '10:14 AM'
  }
];

export default function WeighingQualityBroadcast() {
  const navigate = useNavigate();
  const [appraisalList, setAppraisalList] = useState(initialAppraisalQueue);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState('all'); // 'all' | 'ready' | 'published'
  
  // Edit & Broadcast modal state
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [liveGross, setLiveGross] = useState(0);
  const [liveTare, setLiveTare] = useState(0);
  const [liveMoisture, setLiveMoisture] = useState(11.0);
  const [liveForeignMatter, setLiveForeignMatter] = useState(0.4);
  const [liveGrade, setLiveGrade] = useState('Grade A');
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3200);
  };

  const openBroadcastModal = (record) => {
    setSelectedRecord(record);
    setLiveGross(record.grossWeight || 7000);
    setLiveTare(record.tareWeight || 2500);
    setLiveMoisture(record.moisture || 11.2);
    setLiveForeignMatter(record.foreignMatter || 0.4);
    setLiveGrade(record.grade || 'Grade A');
  };

  const handlePublishToFarmer = () => {
    if (!selectedRecord) return;
    const computedNet = liveGross - liveTare;

    setAppraisalList((prev) =>
      prev.map((item) =>
        item.id === selectedRecord.id
          ? {
              ...item,
              grossWeight: liveGross,
              tareWeight: liveTare,
              netWeight: computedNet,
              moisture: liveMoisture,
              foreignMatter: liveForeignMatter,
              grade: liveGrade,
              status: 'Published',
              isPublished: true,
              publishedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          : item
      )
    );

    showToast(`Appraisal slip for ${selectedRecord.farmerName} (${selectedRecord.tokenId}) broadcasted live!`);
    setSelectedRecord(null);
  };

  const filteredList = appraisalList.filter((item) => {
    const matchesSearch =
      item.farmerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tokenId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.vehicleNo.toLowerCase().includes(searchQuery.toLowerCase());

    if (filterMode === 'ready') return matchesSearch && item.status === 'Ready to Publish';
    if (filterMode === 'published') return matchesSearch && item.isPublished;
    return matchesSearch;
  });

  return (
    <div className="relative min-h-screen w-full bg-[#f6f9f5] font-sans text-gray-800 antialiased selection:bg-emerald-200 selection:text-emerald-900">
      
      {/* Background Accent */}
      <div 
        className="pointer-events-none absolute inset-0 z-0 h-[420px] w-full bg-cover bg-center opacity-85"
        style={{
          backgroundImage: `radial-gradient(ellipse at 50% 10%, rgba(212, 245, 195, 0.55) 0%, rgba(246, 249, 245, 1) 75%)`
        }}
      />

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-emerald-900/5 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5 lg:px-12">
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/operatordashboard')} 
              className="rounded-xl border border-gray-200 bg-white p-2 text-gray-600 shadow-sm transition hover:bg-gray-50 hover:text-gray-900"
              aria-label="Back to Console"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#14532d] text-white shadow-sm">
                <Building2 className="h-4 w-4 text-emerald-400" />
              </div>
              <div>
                <span className="block text-base font-extrabold leading-tight tracking-tight text-[#14532d]">
                  SmartProcure <span className="text-xs font-semibold text-emerald-700 uppercase">| Scale Terminal</span>
                </span>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                  Real-Time Weighing & Quality Broadcaster
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-[#14532d] sm:inline-flex">
              <Radio className="h-3 w-3 text-emerald-600 animate-pulse" />
              IoT Weighbridge Sync: Active
            </span>
          </div>
        </div>
      </header>

      {/* Toast Alert */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 right-6 z-50 flex items-center gap-2.5 rounded-2xl bg-[#14532d] px-5 py-3 text-xs font-bold text-white shadow-xl"
          >
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Container */}
      <main className="relative z-10 mx-auto max-w-7xl px-6 pt-6 pb-16 lg:px-12">
        
        {/* Banner Section */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-emerald-900/10 bg-gradient-to-br from-[#14532d] via-[#166534] to-[#0f3e21] p-6 text-white shadow-xl lg:p-8"
        >
          <div className="grid items-center gap-6 lg:grid-cols-12">
            
            <div className="lg:col-span-7">
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-200 backdrop-blur-sm">
                <Scale className="h-3.5 w-3.5 text-emerald-300" />
                Electronic Tare & Moisture Sync
              </span>

              <h1 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl lg:text-4xl">
                Weighing & Quality Broadcast
              </h1>
              <p className="mt-2 max-w-lg text-xs leading-relaxed text-emerald-100 sm:text-sm">
                Verify electronic scale readings, log moisture and dockage assaying metrics, and broadcast appraisal records directly to farmer mobile devices.
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="lg:col-span-5">
              <div className="grid grid-cols-2 gap-3.5">
                <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-md">
                  <span className="block text-[11px] font-bold uppercase text-emerald-200">Scale Slips Issued</span>
                  <span className="mt-1 block text-2xl font-black text-white">{appraisalList.filter(a => a.isPublished).length} Published</span>
                  <span className="mt-0.5 block text-[10px] text-emerald-300">Live on Farmer App</span>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-md">
                  <span className="block text-[11px] font-bold uppercase text-emerald-200">Pending Broadcast</span>
                  <span className="mt-1 block text-2xl font-black text-white">{appraisalList.filter(a => !a.isPublished).length} Vehicles</span>
                  <span className="mt-0.5 block text-[10px] text-emerald-300">Awaiting Assaying</span>
                </div>
              </div>
            </div>

          </div>
        </motion.div>

        {/* Filter & Search Bar */}
        <div className="mt-8 flex flex-col justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
          
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Farmer Name, Token ID, or Vehicle No..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2 pl-9 pr-4 text-xs text-gray-900 focus:border-emerald-600 focus:bg-white focus:outline-none"
            />
          </div>

          <div className="flex gap-1.5 rounded-xl bg-gray-100 p-1 text-xs font-bold">
            <button
              onClick={() => setFilterMode('all')}
              className={`rounded-lg px-3 py-1.5 transition ${
                filterMode === 'all' ? 'bg-white text-[#14532d] shadow-sm' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              All Batches ({appraisalList.length})
            </button>
            <button
              onClick={() => setFilterMode('ready')}
              className={`rounded-lg px-3 py-1.5 transition ${
                filterMode === 'ready' ? 'bg-white text-amber-800 shadow-sm' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Ready to Publish
            </button>
            <button
              onClick={() => setFilterMode('published')}
              className={`rounded-lg px-3 py-1.5 transition ${
                filterMode === 'published' ? 'bg-white text-[#14532d] shadow-sm' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Broadcasted
            </button>
          </div>

        </div>

        {/* Appraisal Cards List */}
        <div className="mt-6 space-y-4">
          {filteredList.map((item) => {
            const isReady = item.status === 'Ready to Publish';
            const isDone = item.isPublished;

            return (
              <motion.div
                key={item.id}
                whileHover={{ y: -2 }}
                className={`flex flex-col justify-between gap-4 rounded-2xl border p-5 shadow-sm transition sm:flex-row sm:items-center sm:p-6 ${
                  isReady
                    ? 'border-emerald-300 bg-emerald-50/40 ring-1 ring-emerald-500/20'
                    : isDone
                    ? 'border-gray-200 bg-white'
                    : 'border-amber-200 bg-amber-50/30'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
                    isDone ? 'bg-emerald-100 text-[#14532d]' : isReady ? 'bg-[#14532d] text-white' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {isDone ? <CheckCircle2 className="h-6 w-6" /> : <Scale className="h-6 w-6" />}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-bold text-gray-900">{item.farmerName}</h3>
                      <span className="rounded-md bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-700">
                        {item.tokenId}
                      </span>
                      <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold ${
                        isDone
                          ? 'bg-emerald-100 text-emerald-800'
                          : isReady
                          ? 'bg-emerald-200 text-emerald-900 font-extrabold'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {item.status}
                      </span>
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                      <span>Crop: <strong className="text-gray-700">{item.crop}</strong></span>
                      <span>•</span>
                      <span>Vehicle: <strong className="text-gray-700">{item.vehicleNo}</strong></span>
                      <span>•</span>
                      <span>Bay: <strong className="text-gray-700">{item.assignedBay}</strong></span>
                    </div>

                    {/* Weight & Quality Snapshot */}
                    <div className="mt-3 flex flex-wrap gap-2 text-xs">
                      <span className="rounded-lg bg-white/80 border border-gray-200 px-2.5 py-1 font-semibold text-gray-700">
                        Gross: <strong>{item.grossWeight ? `${item.grossWeight} kg` : '--'}</strong>
                      </span>
                      <span className="rounded-lg bg-white/80 border border-gray-200 px-2.5 py-1 font-semibold text-gray-700">
                        Tare: <strong>{item.tareWeight ? `${item.tareWeight} kg` : '--'}</strong>
                      </span>
                      <span className="rounded-lg bg-emerald-50 border border-emerald-200 px-2.5 py-1 font-bold text-[#14532d]">
                        Net Grain: <strong>{item.netWeight ? `${item.netWeight} kg (${item.netWeight / 100} Qtl)` : 'Pending Unload'}</strong>
                      </span>
                      <span className="rounded-lg bg-white/80 border border-gray-200 px-2.5 py-1 font-semibold text-gray-700">
                        Moisture: <strong>{item.moisture}%</strong>
                      </span>
                      <span className="rounded-lg bg-white/80 border border-gray-200 px-2.5 py-1 font-semibold text-gray-700">
                        Grade: <strong>{item.grade}</strong>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Operator Actions */}
                <div className="flex flex-col items-end justify-between gap-3 border-t border-gray-100 pt-3 sm:border-0 sm:pt-0">
                  {isDone && (
                    <span className="text-[11px] font-semibold text-gray-400">
                      Broadcasted at {item.publishedAt}
                    </span>
                  )}

                  <button
                    onClick={() => openBroadcastModal(item)}
                    className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition shadow-sm ${
                      isDone
                        ? 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                        : 'bg-[#14532d] text-white hover:bg-[#0f3e21]'
                    }`}
                  >
                    <Send className="h-3.5 w-3.5" />
                    {isDone ? 'Update & Re-broadcast' : 'Review & Broadcast to Farmer'}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

      </main>

      {/* Modal: Live Weighment & Assaying Broadcast Editor */}
      <AnimatePresence>
        {selectedRecord && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-xl rounded-3xl border border-gray-200 bg-white p-6 shadow-2xl sm:p-8"
            >
              <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-[#14532d]">
                  <Scale className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-gray-900">Publish Certified Appraisal Record</h2>
                  <p className="text-xs text-gray-500">
                    Broadcasting live to {selectedRecord.farmerName} ({selectedRecord.tokenId})
                  </p>
                </div>
              </div>

              {/* Form Grid */}
              <div className="mt-5 space-y-4 text-xs">
                
                {/* Weight Inputs */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-gray-700">Gross Weight (kg) - IoT Scale</label>
                    <input
                      type="number"
                      value={liveGross}
                      onChange={(e) => setLiveGross(Number(e.target.value))}
                      className="mt-1.5 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-bold text-gray-900 focus:border-emerald-600 focus:bg-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-gray-700">Tare Weight (kg) - Empty Vehicle</label>
                    <input
                      type="number"
                      value={liveTare}
                      onChange={(e) => setLiveTare(Number(e.target.value))}
                      className="mt-1.5 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-bold text-gray-900 focus:border-emerald-600 focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                {/* Net Weight Auto Computed */}
                <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-3 flex justify-between items-center">
                  <span className="font-bold text-emerald-950">Computed Net Grain Weight:</span>
                  <span className="text-sm font-black text-[#14532d]">
                    {liveGross - liveTare} kg ({((liveGross - liveTare) / 100).toFixed(2)} Quintals)
                  </span>
                </div>

                {/* Assaying Inputs */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-gray-700">Moisture Content (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={liveMoisture}
                      onChange={(e) => setLiveMoisture(Number(e.target.value))}
                      className="mt-1.5 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-bold text-gray-900 focus:border-emerald-600 focus:bg-white focus:outline-none"
                    />
                    <span className="mt-0.5 block text-[10px] text-gray-400">Max MSP limit: 12.0%</span>
                  </div>

                  <div>
                    <label className="font-bold text-gray-700">Foreign Matter / Dust (%)</label>
                    <input
                      type="number"
                      step="0.05"
                      value={liveForeignMatter}
                      onChange={(e) => setLiveForeignMatter(Number(e.target.value))}
                      className="mt-1.5 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-bold text-gray-900 focus:border-emerald-600 focus:bg-white focus:outline-none"
                    />
                    <span className="mt-0.5 block text-[10px] text-gray-400">Max limit: 0.75%</span>
                  </div>
                </div>

                {/* Grade Selection */}
                <div>
                  <label className="font-bold text-gray-700">Final MSP Quality Grade</label>
                  <select
                    value={liveGrade}
                    onChange={(e) => setLiveGrade(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs text-gray-900 focus:border-emerald-600 focus:outline-none"
                  >
                    <option value="Grade A">Grade A - Full MSP Rate (₹2,275/Qtl)</option>
                    <option value="Grade B (Minor Deduction)">Grade B - Minor Moisture Deduction (₹2,240/Qtl)</option>
                    <option value="Grade C (Dockage Applied)">Grade C - Dockage & Cleaning Deduction</option>
                  </select>
                </div>

              </div>

              {/* Modal Actions */}
              <div className="mt-6 flex gap-3">
                <button
                  onClick={handlePublishToFarmer}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#14532d] py-2.5 text-xs font-bold text-white transition hover:bg-[#0f3e21]"
                >
                  <Send className="h-3.5 w-3.5" />
                  Publish Live to Farmer App & SMS
                </button>
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}