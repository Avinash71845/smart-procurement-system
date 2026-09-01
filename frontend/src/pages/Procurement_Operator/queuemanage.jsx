import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  GitFork,
  Search,
  CheckCircle2,
  Clock,
  ArrowLeft,
  Truck,
  BellRing,
  Megaphone,
  Radio,
  QrCode,
  Scale,
  RefreshCw,
  Send,
  UserCheck,
  AlertTriangle,
  Layers
} from 'lucide-react';

const initialYardQueue = [
  {
    id: 'Q-01',
    tokenId: 'TKN-2026-8837',
    farmerName: 'Baldev Singh',
    phone: '+91 98765 11001',
    vehicleNo: 'HR-05-CD-3312',
    crop: 'Wheat (Grade A) - 60 Qtl',
    status: 'Serving', // 'Serving' | 'Called' | 'Queued' | 'Gate Waiting'
    assignedBay: 'Weigh Bay 01',
    gateCleared: true,
    lastNotified: '09:40 AM',
    calloutCount: 2
  },
  {
    id: 'Q-02',
    tokenId: 'TKN-2026-8838',
    farmerName: 'Gurpreet Singh',
    phone: '+91 94160 22334',
    vehicleNo: 'HR-05-AA-9912',
    crop: 'Wheat (Grade A) - 40 Qtl',
    status: 'Called',
    assignedBay: 'Weigh Bay 02',
    gateCleared: true,
    lastNotified: '09:55 AM',
    calloutCount: 1
  },
  {
    id: 'Q-03',
    tokenId: 'TKN-2026-8839',
    farmerName: 'Satish Kumar',
    phone: '+91 98120 77889',
    crop: 'Mustard Seeds - 25 Qtl',
    status: 'Queued',
    assignedBay: 'Bay 02 (Next in Line)',
    gateCleared: true,
    lastNotified: 'None',
    calloutCount: 0
  },
  {
    id: 'Q-04',
    tokenId: 'TKN-2026-8841',
    farmerName: 'Ramesh Patel',
    phone: '+91 98765 43210',
    crop: 'Wheat (Grade A) - 45 Qtl',
    status: 'Queued',
    assignedBay: 'Bay 01 (Queue Pos #2)',
    gateCleared: true,
    lastNotified: 'None',
    calloutCount: 0
  },
  {
    id: 'Q-05',
    tokenId: 'TKN-2026-8844',
    farmerName: 'Virender Sharma',
    phone: '+91 97280 55661',
    crop: 'Paddy (Common) - 50 Qtl',
    status: 'Gate Waiting',
    assignedBay: 'Gate 01 Inbound',
    gateCleared: false,
    lastNotified: 'None',
    calloutCount: 0
  }
];

export default function QueueManage() {
  const navigate = useNavigate();
  const [queueList, setQueueList] = useState(initialYardQueue);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState('all'); // 'all' | 'gate' | 'called'
  const [selectedCallout, setSelectedCallout] = useState(null);
  const [calloutType, setCalloutType] = useState('proceed_bay');
  const [customMsg, setCustomMsg] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3200);
  };

  const handleGateClearance = (id) => {
    setQueueList((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              gateCleared: true,
              status: 'Queued',
              assignedBay: 'Assigned Yard Lane 02'
            }
          : item
      )
    );
    showToast('Gate barrier cleared & QR token validated!');
  };

  const openCalloutModal = (farmer) => {
    setSelectedCallout(farmer);
    setCalloutType('proceed_bay');
    setCustomMsg(
      `Your token ${farmer.tokenId} is called! Please proceed immediately to ${farmer.assignedBay}.`
    );
  };

  const handleSendCallout = () => {
    if (!selectedCallout) return;

    setQueueList((prev) =>
      prev.map((item) =>
        item.id === selectedCallout.id
          ? {
              ...item,
              status: 'Called',
              lastNotified: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              calloutCount: item.calloutCount + 1
            }
          : item
      )
    );

    showToast(`Instant alert & SMS push dispatched to ${selectedCallout.farmerName}!`);
    setSelectedCallout(null);
  };

  const handleMarkServing = (id) => {
    setQueueList((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: 'Serving' }
          : item.status === 'Serving'
          ? { ...item, status: 'Completed' }
          : item
      )
    );
    showToast('Scale bay activated. Farmer is now mounting weighbridge.');
  };

  const filteredQueue = queueList.filter((item) => {
    const matchesSearch =
      item.farmerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tokenId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.vehicleNo.toLowerCase().includes(searchQuery.toLowerCase());

    if (filterMode === 'gate') return matchesSearch && !item.gateCleared;
    if (filterMode === 'called') return matchesSearch && item.status === 'Called';
    return matchesSearch;
  });

  return (
    <div className="relative min-h-screen w-full bg-[#f6f9f5] font-sans text-gray-800 antialiased selection:bg-emerald-200 selection:text-emerald-900">
      
      {/* Background Soft Glow */}
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
                  SmartProcure <span className="text-xs font-semibold text-emerald-700 uppercase">| Yard Master</span>
                </span>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                  Live Queue Control & Gate Dispatch
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-[#14532d] sm:inline-flex">
              <Radio className="h-3 w-3 text-emerald-600 animate-pulse" />
              Broadcast Radio: Active
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
                <Megaphone className="h-3.5 w-3.5 text-emerald-300" />
                Real-Time Mandi Yard Flow Manager
              </span>

              <h1 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl lg:text-4xl">
                Gate Clearance & Queue Callouts
              </h1>
              <p className="mt-2 max-w-lg text-xs leading-relaxed text-emerald-100 sm:text-sm">
                Authenticate inbound tractor tokens, clear gate barriers, and dispatch instant SMS or push callouts to direct farmers to open weighbridge bays.
              </p>
            </div>

            {/* Real-time Yard Meters */}
            <div className="lg:col-span-5">
              <div className="grid grid-cols-2 gap-3.5">
                <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-md">
                  <span className="block text-[11px] font-bold uppercase text-emerald-200">Active in Yard</span>
                  <span className="mt-1 block text-2xl font-black text-white">{queueList.filter(q => q.gateCleared).length} Vehicles</span>
                  <span className="mt-0.5 block text-[10px] text-emerald-300">Scale throughput optimal</span>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-md">
                  <span className="block text-[11px] font-bold uppercase text-emerald-200">Pending Gate Entry</span>
                  <span className="mt-1 block text-2xl font-black text-white">{queueList.filter(q => !q.gateCleared).length} Vehicles</span>
                  <span className="mt-0.5 block text-[10px] text-emerald-300">Gate 01 Barrier Queue</span>
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
              All In-Yard ({queueList.length})
            </button>
            <button
              onClick={() => setFilterMode('gate')}
              className={`rounded-lg px-3 py-1.5 transition ${
                filterMode === 'gate' ? 'bg-white text-amber-800 shadow-sm' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Gate Inbound
            </button>
            <button
              onClick={() => setFilterMode('called')}
              className={`rounded-lg px-3 py-1.5 transition ${
                filterMode === 'called' ? 'bg-white text-[#14532d] shadow-sm' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Called Out
            </button>
          </div>

        </div>

        {/* Live Queue Cards */}
        <div className="mt-6 space-y-3.5">
          {filteredQueue.map((item, idx) => {
            const isServing = item.status === 'Serving';
            const isCalled = item.status === 'Called';
            const isGateWaiting = !item.gateCleared;

            return (
              <motion.div
                key={item.id}
                whileHover={{ y: -2 }}
                className={`flex flex-col justify-between gap-4 rounded-2xl border p-5 shadow-sm transition sm:flex-row sm:items-center sm:p-6 ${
                  isServing
                    ? 'border-emerald-500/40 bg-emerald-50/40 ring-2 ring-emerald-500/20'
                    : isCalled
                    ? 'border-amber-300 bg-amber-50/30'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl font-black text-xs ${
                      isServing
                        ? 'bg-[#14532d] text-white animate-pulse'
                        : isCalled
                        ? 'bg-amber-500 text-white'
                        : isGateWaiting
                        ? 'bg-gray-200 text-gray-700'
                        : 'bg-emerald-100 text-[#14532d]'
                    }`}
                  >
                    {isServing ? 'BAY' : isGateWaiting ? 'GATE' : `#${idx + 1}`}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-bold text-gray-900">{item.farmerName}</h3>
                      <span className="rounded-md bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-700">
                        {item.tokenId}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold ${
                          isServing
                            ? 'bg-emerald-200 text-emerald-900'
                            : isCalled
                            ? 'bg-amber-100 text-amber-900'
                            : isGateWaiting
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {isServing ? <Scale className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                        {item.status}
                      </span>
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                      <span>Vehicle: <strong className="text-gray-700">{item.vehicleNo}</strong></span>
                      <span>•</span>
                      <span>Crop: <strong className="text-gray-700">{item.crop}</strong></span>
                      <span>•</span>
                      <span>Station: <strong className="text-gray-700">{item.assignedBay}</strong></span>
                    </div>

                    <div className="mt-1.5 flex items-center gap-3 text-[11px] text-gray-400">
                      <span>Gate Cleared: <strong>{item.gateCleared ? 'Yes (Verified)' : 'Pending at Gate'}</strong></span>
                      <span>•</span>
                      <span>Callout Sent: <strong>{item.lastNotified} ({item.calloutCount} times)</strong></span>
                    </div>
                  </div>
                </div>

                {/* Operator Actions */}
                <div className="flex flex-wrap items-center justify-end gap-2 border-t border-gray-100 pt-3 sm:border-0 sm:pt-0">
                  {isGateWaiting ? (
                    <button
                      onClick={() => handleGateClearance(item.id)}
                      className="flex items-center gap-1.5 rounded-xl bg-[#14532d] px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-[#0f3e21]"
                    >
                      <QrCode className="h-3.5 w-3.5" />
                      Verify QR & Clear Gate
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => openCalloutModal(item)}
                        className="flex items-center gap-1.5 rounded-xl border border-amber-300 bg-amber-50 px-3.5 py-2 text-xs font-bold text-amber-900 transition hover:bg-amber-100"
                      >
                        <BellRing className="h-3.5 w-3.5" />
                        Push Callout Alert
                      </button>

                      {!isServing && (
                        <button
                          onClick={() => handleMarkServing(item.id)}
                          className="flex items-center gap-1.5 rounded-xl bg-[#14532d] px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-[#0f3e21]"
                        >
                          <Scale className="h-3.5 w-3.5" />
                          Set on Scale
                        </button>
                      )}
                    </>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

      </main>

      {/* Modal: Push Instant Queue Callout */}
      <AnimatePresence>
        {selectedCallout && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-lg rounded-3xl border border-gray-200 bg-white p-6 shadow-2xl sm:p-8"
            >
              <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
                  <Megaphone className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-gray-900">Broadcast Gate Callout</h2>
                  <p className="text-xs text-gray-500">
                    Direct notification to {selectedCallout.farmerName} ({selectedCallout.vehicleNo})
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-4 text-xs">
                
                {/* Callout Template Selection */}
                <div>
                  <label className="font-bold text-gray-700">Callout Alert Template</label>
                  <select
                    value={calloutType}
                    onChange={(e) => {
                      setCalloutType(e.target.value);
                      if (e.target.value === 'proceed_bay') {
                        setCustomMsg(`Your token ${selectedCallout.tokenId} is called! Please proceed immediately to ${selectedCallout.assignedBay}.`);
                      } else if (e.target.value === 'idle_ready') {
                        setCustomMsg(`Your turn is 1 position away. Please start tractor engine (${selectedCallout.vehicleNo}) and prepare to mount the scale.`);
                      } else {
                        setCustomMsg(`Please report to the Mandi Operator Yard Desk regarding Token ${selectedCallout.tokenId}.`);
                      }
                    }}
                    className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs text-gray-900 focus:border-emerald-600 focus:outline-none"
                  >
                    <option value="proceed_bay">Immediate Turn: Mount Assigned Weigh Bay</option>
                    <option value="idle_ready">Next Up Warning: Idle Engine & Standby</option>
                    <option value="report_desk">Admin Notice: Report to Mandi Office</option>
                  </select>
                </div>

                {/* Custom Notification Message Body */}
                <div>
                  <label className="font-bold text-gray-700">Message Content (App Notification & SMS)</label>
                  <textarea
                    rows={3}
                    value={customMsg}
                    onChange={(e) => setCustomMsg(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-xs text-gray-800 focus:border-emerald-600 focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-3 text-[11px] text-amber-900">
                  <span>
                    Sending this callout will instantly update the farmer's <strong>Live Queue Tracker</strong> and trigger a high-priority SMS alert.
                  </span>
                </div>

              </div>

              {/* Modal Actions */}
              <div className="mt-6 flex gap-3">
                <button
                  onClick={handleSendCallout}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#14532d] py-2.5 text-xs font-bold text-white transition hover:bg-[#0f3e21]"
                >
                  <Send className="h-3.5 w-3.5" />
                  Broadcast Callout Alert
                </button>
                <button
                  onClick={() => setSelectedCallout(null)}
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