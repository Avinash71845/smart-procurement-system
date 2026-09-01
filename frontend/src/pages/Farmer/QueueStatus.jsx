import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sprout,
  Search,
  RefreshCw,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  Scale,
  FlaskConical,
  Receipt,
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
  Wheat,
  SlidersHorizontal,
  PhoneCall
} from 'lucide-react';

// Mock active mandi queue list
const initialQueueData = [
  {
    tokenId: 'TKN-2026-8837',
    farmerName: 'Baldev Singh',
    vehicleNo: 'HR-05-CD-3312',
    crop: 'Wheat (Grade A)',
    quantity: '60 Qtl',
    status: 'Weighbridge Active',
    currentStage: 'Gross Weighing',
    position: 0, // Currently being served
    isCurrentUser: false
  },
  {
    tokenId: 'TKN-2026-8838',
    farmerName: 'Gurpreet Singh',
    vehicleNo: 'HR-05-AA-9912',
    crop: 'Wheat (Grade A)',
    quantity: '40 Qtl',
    status: 'In Yard',
    currentStage: 'Waiting for Bay 01',
    position: 1,
    isCurrentUser: false
  },
  {
    tokenId: 'TKN-2026-8839',
    farmerName: 'Satish Kumar',
    vehicleNo: 'HR-05-EE-4122',
    crop: 'Mustard Seeds',
    quantity: '25 Qtl',
    status: 'In Yard',
    currentStage: 'Waiting for Bay 02',
    position: 2,
    isCurrentUser: false
  },
  {
    tokenId: 'TKN-2026-8840',
    farmerName: 'Vikram Yadav',
    vehicleNo: 'HR-05-JK-7801',
    crop: 'Wheat (Grade A)',
    quantity: '55 Qtl',
    status: 'In Yard',
    currentStage: 'Gate Cleared',
    position: 3,
    isCurrentUser: false
  },
  {
    tokenId: 'TKN-2026-8841',
    farmerName: 'Ramesh Patel',
    vehicleNo: 'HR-05-AB-1234',
    crop: 'Wheat (Grade A)',
    quantity: '45 Qtl',
    status: 'In Yard',
    currentStage: 'Gate Cleared',
    position: 4,
    isCurrentUser: true
  },
  {
    tokenId: 'TKN-2026-8842',
    farmerName: 'Anil Deshmukh',
    vehicleNo: 'HR-05-ZX-9021',
    crop: 'Paddy (Common)',
    quantity: '50 Qtl',
    status: 'Arriving',
    currentStage: 'En Route',
    position: 5,
    isCurrentUser: false
  },
  {
    tokenId: 'TKN-2026-8843',
    farmerName: 'Mohan Lal',
    vehicleNo: 'HR-05-LM-1188',
    crop: 'Gram (Chana)',
    quantity: '30 Qtl',
    status: 'Arriving',
    currentStage: 'Slot Confirmed',
    position: 6,
    isCurrentUser: false
  }
];

export default function TrackLiveQueue() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('TKN-2026-8841');
  const [activeToken, setActiveToken] = useState('TKN-2026-8841');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filterMode, setFilterMode] = useState('all'); // 'all' | 'my-slot'

  // Selected farmer slot details
  const selectedFarmer = initialQueueData.find((q) => q.tokenId === activeToken) || initialQueueData[4];

  // Detailed grain & inspection status data
  const grainDetails = {
    commodity: selectedFarmer.crop,
    bookedQuantity: selectedFarmer.quantity,
    grossWeight: selectedFarmer.position === 0 ? '7,240 kg' : 'Pending Weighment',
    tareWeight: 'Pending Unloading',
    netGrainWeight: selectedFarmer.position === 0 ? '4,500 kg (45 Qtl)' : '--',
    moistureContent: selectedFarmer.position === 0 ? '11.4%' : 'Testing Pending',
    moistureTolerance: 'Max allowable 12.0%',
    foreignMatter: selectedFarmer.position === 0 ? '0.45%' : 'Testing Pending',
    foreignMatterTolerance: 'Max allowable 0.75%',
    qualityGrade: selectedFarmer.position === 0 ? 'Grade A (MSP Pass)' : 'Awaiting Lab Assay',
    baseMSP: '₹2,275 / Quintal',
    estimatedPayout: '₹1,02,375',
    stages: [
      { id: 1, title: 'Gate Token Verified', status: 'completed', time: '09:45 AM', note: 'Cleared at Gate Barrier 01' },
      { id: 2, title: 'Gross Weighbridge', status: selectedFarmer.position === 0 ? 'in-progress' : 'upcoming', time: selectedFarmer.position === 0 ? 'Now Serving' : 'Est. in 20 mins', note: 'Bay 02 IoT Scale' },
      { id: 3, title: 'Grain Quality & Moisture Assaying', status: 'upcoming', time: 'Pending', note: 'Lab Moisture & Sieve Test' },
      { id: 4, title: 'Unloading & Tare Weighbridge', status: 'upcoming', time: 'Pending', note: 'Net Weight Calculation' },
      { id: 5, title: 'Digital J-Form & DBT Payment', status: 'upcoming', time: 'Pending', note: 'Direct Bank Settlement' }
    ]
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const found = initialQueueData.find(
      (item) =>
        item.tokenId.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
        item.vehicleNo.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
        item.farmerName.toLowerCase().includes(searchQuery.trim().toLowerCase())
    );
    if (found) {
      setActiveToken(found.tokenId);
    } else {
      alert('No matching token or vehicle found in today\'s active queue.');
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  const filteredList = filterMode === 'my-slot' 
    ? initialQueueData.filter(item => item.tokenId === activeToken)
    : initialQueueData;

  return (
    <div className="relative min-h-screen w-full bg-[#f6f9f5] font-sans text-gray-800 antialiased selection:bg-emerald-200 selection:text-emerald-900">
      
      {/* Background Soft Glow */}
      <div 
        className="pointer-events-none absolute inset-0 z-0 h-[480px] w-full bg-cover bg-center opacity-85"
        style={{
          backgroundImage: `radial-gradient(ellipse at 50% 10%, rgba(212, 245, 195, 0.6) 0%, rgba(246, 249, 245, 1) 75%)`
        }}
      />

      {/* Navigation Header */}
      <header className="sticky top-0 z-50 border-b border-emerald-900/5 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5 lg:px-12">
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/farmerhome')} 
              className="rounded-xl border border-gray-200 bg-white p-2 text-gray-600 shadow-sm transition hover:bg-gray-50 hover:text-gray-900"
              aria-label="Back to Farmer Home"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#14532d] text-white shadow-sm">
                <Sprout className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <span className="block text-base font-extrabold leading-tight tracking-tight text-[#14532d]">
                  SmartProcure
                </span>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                  Live Queue & Grain Quality Status
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              className="flex items-center gap-1.5 rounded-xl border border-emerald-900/10 bg-emerald-50 px-3.5 py-2 text-xs font-bold text-[#14532d] transition hover:bg-emerald-100"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh Queue</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 mx-auto max-w-7xl px-6 pt-6 pb-16 lg:px-12">
        
        {/* Top Hero Status Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-emerald-900/10 bg-gradient-to-br from-[#14532d] via-[#166534] to-[#0f3e21] p-6 text-white shadow-xl lg:p-8"
        >
          <div className="grid items-center gap-6 lg:grid-cols-12">
            
            {/* Left: Token & Position */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-200 backdrop-blur-sm">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                Live Mandi Stream • Karnal APMC Yard 02
              </div>

              <div className="mt-3 flex flex-wrap items-baseline gap-3">
                <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                  {selectedFarmer.tokenId}
                </h1>
                <span className="rounded-lg bg-white/20 px-2.5 py-0.5 text-xs font-bold text-emerald-100 backdrop-blur-sm">
                  {selectedFarmer.farmerName}
                </span>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-emerald-100">
                <span className="flex items-center gap-1">
                  <Truck className="h-3.5 w-3.5 text-emerald-300" />
                  Vehicle: <strong>{selectedFarmer.vehicleNo}</strong>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Wheat className="h-3.5 w-3.5 text-emerald-300" />
                  Crop: <strong>{selectedFarmer.crop} ({selectedFarmer.quantity})</strong>
                </span>
              </div>
            </div>

            {/* Right: Live Position Counter */}
            <div className="lg:col-span-5">
              <div className="flex items-center justify-around rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-md">
                
                <div className="text-center">
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-emerald-200">
                    Your Queue Rank
                  </span>
                  <span className="text-3xl font-black text-white sm:text-4xl">
                    {selectedFarmer.position === 0 ? 'Now Serving' : `#${selectedFarmer.position}`}
                  </span>
                  <span className="mt-0.5 block text-[10px] text-emerald-200">
                    {selectedFarmer.position === 0 ? 'On Weighbridge' : `${selectedFarmer.position} Vehicles Ahead`}
                  </span>
                </div>

                <div className="h-12 w-[1px] bg-white/20" />

                <div className="text-center">
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-emerald-200">
                    Estimated Wait
                  </span>
                  <span className="text-3xl font-black text-white sm:text-4xl">
                    {selectedFarmer.position === 0 ? '0 Mins' : `${selectedFarmer.position * 6} Mins`}
                  </span>
                  <span className="mt-0.5 block text-[10px] text-emerald-200">
                    Assigned: Bay 02
                  </span>
                </div>

              </div>
            </div>

          </div>
        </motion.div>

        {/* Search & Switch Slot Utility */}
        <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-sm font-bold text-gray-900">Search Your Token or Vehicle</h2>
              <p className="text-xs text-gray-500">Track your exact slot status if you booked under a different token.</p>
            </div>

            <form onSubmit={handleSearch} className="flex w-full max-w-md items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter Token ID (e.g. TKN-2026-8841)"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-9 pr-4 py-2 text-xs text-gray-900 focus:border-emerald-600 focus:bg-white focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="rounded-xl bg-[#14532d] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#0f3e21]"
              >
                Track
              </button>
            </form>
          </div>
        </div>

        {/* 2-Column Section: Left (Live Queue Board) & Right (Grain Quality Appraisal) */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
          
          {/* Column 1: Live Queue Slot Board */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                    Live Yard Intake Order
                  </span>
                  <h3 className="text-base font-bold text-gray-900">Active Mandi Queue Slots</h3>
                </div>

                <div className="flex gap-1.5 rounded-xl bg-gray-100 p-1 text-[11px] font-bold">
                  <button
                    onClick={() => setFilterMode('all')}
                    className={`rounded-lg px-2.5 py-1 transition ${
                      filterMode === 'all' ? 'bg-white text-[#14532d] shadow-sm' : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    All ({initialQueueData.length})
                  </button>
                  <button
                    onClick={() => setFilterMode('my-slot')}
                    className={`rounded-lg px-2.5 py-1 transition ${
                      filterMode === 'my-slot' ? 'bg-white text-[#14532d] shadow-sm' : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    My Slot Only
                  </button>
                </div>
              </div>

              {/* Slot Cards List */}
              <div className="mt-4 space-y-3">
                {filteredList.map((slot) => {
                  const isSelected = slot.tokenId === activeToken;
                  const isServing = slot.position === 0;

                  return (
                    <motion.div
                      key={slot.tokenId}
                      whileHover={{ scale: 1.01 }}
                      onClick={() => setActiveToken(slot.tokenId)}
                      className={`cursor-pointer rounded-2xl border p-4 transition-all ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/50 shadow-sm ring-2 ring-emerald-600/20'
                          : isServing
                          ? 'border-amber-200 bg-amber-50/40'
                          : 'border-gray-100 bg-[#fbfdfa] hover:border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-9 w-9 items-center justify-center rounded-xl text-xs font-black ${
                              isServing
                                ? 'bg-amber-500 text-white animate-pulse'
                                : isSelected
                                ? 'bg-[#14532d] text-white'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {isServing ? 'LIVE' : `#${slot.position}`}
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-gray-900">{slot.tokenId}</span>
                              {slot.isCurrentUser && (
                                <span className="rounded-md bg-emerald-200 px-1.5 py-0.5 text-[9px] font-black text-emerald-900">
                                  YOU
                                </span>
                              )}
                            </div>
                            <span className="block text-xs text-gray-500">
                              {slot.farmerName} • {slot.vehicleNo}
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="block text-xs font-extrabold text-[#14532d]">{slot.crop}</span>
                          <span className="text-[11px] font-semibold text-gray-500">{slot.quantity}</span>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center justify-between border-t border-gray-100/80 pt-2.5 text-[11px]">
                        <span className="flex items-center gap-1 text-gray-600">
                          <Clock className="h-3 w-3 text-emerald-600" />
                          Stage: <strong>{slot.currentStage}</strong>
                        </span>
                        <span
                          className={`font-bold ${
                            isServing ? 'text-amber-700' : 'text-emerald-800'
                          }`}
                        >
                          {slot.status}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

            </div>
          </div>

          {/* Column 2: Grain Status & Quality Appraisal */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Grain Quality Appraisal Card */}
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-[#14532d]">
                    <FlaskConical className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900">Grain Appraisal Status</h3>
                    <span className="text-[11px] text-gray-500">Assaying & Scale Metrics</span>
                  </div>
                </div>
                <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                  {grainDetails.qualityGrade}
                </span>
              </div>

              {/* Quality & Moisture Grid */}
              <div className="mt-4 grid grid-cols-2 gap-3">
                
                <div className="rounded-xl border border-gray-100 bg-[#f9fbf8] p-3.5">
                  <span className="block text-[11px] font-semibold text-gray-500">Moisture Content</span>
                  <span className="mt-1 block text-lg font-black text-[#14532d]">{grainDetails.moistureContent}</span>
                  <span className="mt-0.5 block text-[10px] text-emerald-700">{grainDetails.moistureTolerance}</span>
                </div>

                <div className="rounded-xl border border-gray-100 bg-[#f9fbf8] p-3.5">
                  <span className="block text-[11px] font-semibold text-gray-500">Foreign Matter / Dust</span>
                  <span className="mt-1 block text-lg font-black text-[#14532d]">{grainDetails.foreignMatter}</span>
                  <span className="mt-0.5 block text-[10px] text-emerald-700">{grainDetails.foreignMatterTolerance}</span>
                </div>

                <div className="rounded-xl border border-gray-100 bg-[#f9fbf8] p-3.5">
                  <span className="block text-[11px] font-semibold text-gray-500">Gross / Net Weight</span>
                  <span className="mt-1 block text-sm font-black text-gray-900">{grainDetails.netGrainWeight}</span>
                  <span className="mt-0.5 block text-[10px] text-gray-500">Gross: {grainDetails.grossWeight}</span>
                </div>

                <div className="rounded-xl border border-gray-100 bg-[#f9fbf8] p-3.5">
                  <span className="block text-[11px] font-semibold text-gray-500">Estimated MSP Value</span>
                  <span className="mt-1 block text-sm font-black text-[#14532d]">{grainDetails.estimatedPayout}</span>
                  <span className="mt-0.5 block text-[10px] text-gray-500">Rate: {grainDetails.baseMSP}</span>
                </div>

              </div>

              {/* Progress Milestones */}
              <div className="mt-6 border-t border-gray-100 pt-5">
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                  Verification Lifecycle
                </h4>
                
                <div className="mt-4 space-y-4">
                  {grainDetails.stages.map((stage, idx) => {
                    const isDone = stage.status === 'completed';
                    const isCurrent = stage.status === 'in-progress';

                    return (
                      <div key={stage.id} className="flex items-start gap-3 text-xs">
                        <div
                          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                            isDone
                              ? 'bg-emerald-600 text-white'
                              : isCurrent
                              ? 'bg-amber-500 text-white animate-pulse'
                              : 'border border-gray-200 bg-gray-100 text-gray-400'
                          }`}
                        >
                          {isDone ? '✓' : idx + 1}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className={`font-bold ${isCurrent ? 'text-amber-700' : 'text-gray-800'}`}>
                              {stage.title}
                            </span>
                            <span className="text-[10px] text-gray-400">{stage.time}</span>
                          </div>
                          <span className="block text-[11px] text-gray-500">{stage.note}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Assistance Card */}
            <div className="rounded-2xl border border-emerald-900/10 bg-emerald-50/70 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#14532d] text-white shrink-0">
                  <PhoneCall className="h-4 w-4 text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900">Mandi Gate & Weighbridge Helpdesk</h4>
                  <span className="text-[11px] text-gray-600">Need help with slot delays or gate clearance?</span>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-emerald-900/10 pt-3 text-xs">
                <span className="font-semibold text-gray-700">Toll Free Kisan Assistance:</span>
                <span className="font-extrabold text-[#14532d]">1800-180-1551</span>
              </div>
            </div>

          </div>

        </div>

      </main>

    </div>
  );
}