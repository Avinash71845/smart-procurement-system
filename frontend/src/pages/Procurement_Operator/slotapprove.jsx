import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  Calendar,
  Clock,
  Weight,
  PlusCircle,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  ShieldCheck,
  Search,
  Filter,
  Loader2,
  Hash,
  Layers
} from 'lucide-react';

export default function SlotApprove() {
  const navigate = useNavigate();

  // Form State (4.1)
  const [formData, setFormData] = useState({
    procurementCentreId: 1,
    date: '2026-09-10',
    startTime: '10:00',
    endTime: '12:00',
    capacityKg: '1000'
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Lookup & Query States (4.2, 4.3, 4.4)
  const [activeQueryTab, setActiveQueryTab] = useState('centre'); // 'single' | 'centre' | 'centreDate'
  const [searchSlotId, setSearchSlotId] = useState('1');
  const [filterCentreId, setFilterCentreId] = useState('1');
  const [filterDate, setFilterDate] = useState('2026-09-10');

  const [queryLoading, setQueryLoading] = useState(false);
  const [queryError, setQueryError] = useState('');
  const [slotResults, setSlotResults] = useState([]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage('');
  };

  // 4.1 POST /api/slots
  const handleCreateSlotSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (formData.startTime >= formData.endTime) {
      setErrorMessage('गलत समय सीमा: प्रारंभ समय समाप्ति समय से पहले होना चाहिए (startTime must be before endTime).');
      return;
    }

    const parsedCapacity = parseFloat(formData.capacityKg);
    if (isNaN(parsedCapacity) || parsedCapacity <= 0) {
      setErrorMessage('क्षमता 0 से अधिक होनी चाहिए (Capacity must be greater than 0 kg).');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setErrorMessage('ऑपरेटर प्रमाणीकरण टोकन नहीं मिला। कृपया पुनः लॉगिन करें (Token missing).');
      return;
    }

    setLoading(true);

    const payload = {
      procurementCentreId: Number(formData.procurementCentreId),
      date: formData.date,
      startTime: `${formData.startTime}:00`,
      endTime: `${formData.endTime}:00`,
      capacityKg: parsedCapacity
    };

    try {
      const response = await fetch('/api/slots', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || data.error || `Server responded with status ${response.status}`);
      }

      setSuccessMessage('स्लॉट सफलतापूर्वक बनाया गया (Slot created successfully)!');

      // Auto-query centre slots to show newly created slot in list
      setFilterCentreId(String(formData.procurementCentreId));
      setActiveQueryTab('centre');
      fetchSlots(`/api/slots/centre/${formData.procurementCentreId}`);

      setFormData((prev) => ({
        ...prev,
        startTime: '12:00',
        endTime: '14:00'
      }));

    } catch (err) {
      console.error('Slot creation error:', err);
      setErrorMessage(err.message || 'स्लॉट बनाने में विफलता हुई (Failed to create slot).');
    } finally {
      setLoading(false);
    }
  };

  // Generalized query handler for 4.2, 4.3, and 4.4
  const fetchSlots = async (url) => {
    setQueryError('');
    setQueryLoading(true);
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || data.error || `Error fetching slots (Status: ${response.status})`);
      }

      // Handle single object vs array
      if (Array.isArray(data)) {
        setSlotResults(data);
      } else if (data && typeof data === 'object') {
        setSlotResults([data]);
      } else {
        setSlotResults([]);
      }
    } catch (err) {
      console.error('Query error:', err);
      setQueryError(err.message || 'डेटा लोड करने में असमर्थ (Failed to fetch slot records).');
      setSlotResults([]);
    } finally {
      setQueryLoading(false);
    }
  };

  const handleQuerySubmit = (e) => {
    e.preventDefault();
    if (activeQueryTab === 'single') {
      // 4.2 GET /api/slots/{id}
      if (!searchSlotId) return;
      fetchSlots(`/api/slots/${searchSlotId}`);
    } else if (activeQueryTab === 'centre') {
      // 4.3 GET /api/slots/centre/{centreId}
      if (!filterCentreId) return;
      fetchSlots(`/api/slots/centre/${filterCentreId}`);
    } else if (activeQueryTab === 'centreDate') {
      // 4.4 GET /api/slots/centre/{centreId}/date?date=YYYY-MM-DD
      if (!filterCentreId || !filterDate) return;
      fetchSlots(`/api/slots/centre/${filterCentreId}/date?date=${filterDate}`);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#f6f9f5] font-sans text-gray-800 antialiased selection:bg-emerald-200 selection:text-emerald-900">
      
      {/* Background Soft Glow */}
      <div 
        className="pointer-events-none absolute inset-0 z-0 h-[450px] w-full bg-cover bg-center opacity-85"
        style={{
          backgroundImage: `radial-gradient(ellipse at 50% 15%, rgba(212, 245, 195, 0.6) 0%, rgba(246, 249, 245, 1) 75%)`
        }}
      />

      {/* Header */}
      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-12">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#14532d] text-white shadow-sm">
            <Building2 className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <span className="block text-lg font-extrabold leading-tight text-[#14532d]">SmartProcure</span>
            <span className="block text-[10px] font-semibold tracking-wider text-emerald-700 uppercase">
              Operator Console • स्लॉट प्रबंधन केंद्र
            </span>
          </div>
        </Link>

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-bold text-gray-700 shadow-sm transition hover:bg-gray-50"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </button>
      </header>

      {/* Main Grid */}
      <main className="relative z-10 mx-auto max-w-7xl px-6 pt-4 pb-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          
          {/* LEFT: 4.1 CREATE SLOT FORM */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl border border-emerald-900/10 bg-white/95 p-6 shadow-xl backdrop-blur-md sm:p-8">
              <div className="border-b border-gray-100 pb-4">
                <div className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-[#14532d]">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                  Method: POST /api/slots
                </div>
                <h1 className="mt-2 text-xl font-black text-gray-900">
                  नया स्लॉट बनाएं (4.1 Create Slot)
                </h1>
                <p className="mt-1 text-xs text-gray-500">
                  Save a new mandi capacity window directly to the database.
                </p>
              </div>

              {/* Feedback Banners */}
              <AnimatePresence>
                {errorMessage && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-700"
                  >
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" />
                    <span>{errorMessage}</span>
                  </motion.div>
                )}

                {successMessage && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-800"
                  >
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                    <span>{successMessage}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Creation Form */}
              <form onSubmit={handleCreateSlotSubmit} className="mt-5 space-y-3.5">
                <div>
                  <label className="text-xs font-bold text-gray-700">Procurement Centre ID *</label>
                  <div className="relative mt-1">
                    <Building2 className="absolute top-2.5 left-3 h-4 w-4 text-gray-400" />
                    <input
                      type="number"
                      name="procurementCentreId"
                      required
                      min="1"
                      value={formData.procurementCentreId}
                      onChange={handleFormChange}
                      className="w-full rounded-xl border border-gray-200 py-2.5 pr-3 pl-9 text-xs font-bold text-gray-900 focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700">Slot Date (दिनांक) *</label>
                  <div className="relative mt-1">
                    <Calendar className="absolute top-2.5 left-3 h-4 w-4 text-gray-400" />
                    <input
                      type="date"
                      name="date"
                      required
                      value={formData.date}
                      onChange={handleFormChange}
                      className="w-full rounded-xl border border-gray-200 py-2.5 pr-3 pl-9 text-xs font-bold text-gray-900 focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-gray-700">Start Time *</label>
                    <div className="relative mt-1">
                      <Clock className="absolute top-2.5 left-3 h-4 w-4 text-gray-400" />
                      <input
                        type="time"
                        name="startTime"
                        required
                        value={formData.startTime}
                        onChange={handleFormChange}
                        className="w-full rounded-xl border border-gray-200 py-2.5 pr-3 pl-9 text-xs font-bold text-gray-900 focus:border-emerald-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700">End Time *</label>
                    <div className="relative mt-1">
                      <Clock className="absolute top-2.5 left-3 h-4 w-4 text-gray-400" />
                      <input
                        type="time"
                        name="endTime"
                        required
                        value={formData.endTime}
                        onChange={handleFormChange}
                        className="w-full rounded-xl border border-gray-200 py-2.5 pr-3 pl-9 text-xs font-bold text-gray-900 focus:border-emerald-600 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-amber-200 bg-amber-50 p-2 text-[11px] text-amber-900">
                  <strong>Constraint:</strong> Start Time must be strictly earlier than End Time (e.g. 10:00 → 12:00).
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700">Total Capacity in kg *</label>
                  <div className="relative mt-1">
                    <Weight className="absolute top-2.5 left-3 h-4 w-4 text-gray-400" />
                    <input
                      type="number"
                      name="capacityKg"
                      required
                      min="1"
                      step="any"
                      value={formData.capacityKg}
                      onChange={handleFormChange}
                      placeholder="e.g. 1000"
                      className="w-full rounded-xl border border-gray-200 py-2.5 pr-3 pl-9 text-xs font-bold text-gray-900 focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#14532d] py-3.5 text-xs font-bold text-white shadow-md transition hover:bg-[#0f3e21] disabled:opacity-75"
                >
                  {loading ? (
                    'स्लॉट बनाया जा रहा है...'
                  ) : (
                    <>
                      <PlusCircle className="h-4 w-4" /> स्लॉट डेटाबेस में सेव करें (Create Slot)
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* RIGHT: 4.2, 4.3, 4.4 GET & FILTER SLOTS */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-emerald-900/10 bg-white/95 p-6 shadow-xl backdrop-blur-md sm:p-8">
              
              {/* Endpoint Tabs */}
              <div className="border-b border-gray-100 pb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  Query Slot Endpoints (GET)
                </span>
                <div className="mt-2 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => { setActiveQueryTab('centre'); setSlotResults([]); }}
                    className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                      activeQueryTab === 'centre' 
                        ? 'bg-[#14532d] text-white shadow-sm' 
                        : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    4.3 By Centre
                  </button>
                  <button
                    type="button"
                    onClick={() => { setActiveQueryTab('centreDate'); setSlotResults([]); }}
                    className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                      activeQueryTab === 'centreDate' 
                        ? 'bg-[#14532d] text-white shadow-sm' 
                        : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    4.4 By Centre & Date
                  </button>
                  <button
                    type="button"
                    onClick={() => { setActiveQueryTab('single'); setSlotResults([]); }}
                    className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                      activeQueryTab === 'single' 
                        ? 'bg-[#14532d] text-white shadow-sm' 
                        : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    4.2 Single Slot ID
                  </button>
                </div>
              </div>

              {/* Dynamic Query Controls */}
              <form onSubmit={handleQuerySubmit} className="mt-4 flex flex-wrap items-end gap-3">
                {activeQueryTab === 'single' && (
                  <div className="flex-1 min-w-[140px]">
                    <label className="text-[11px] font-bold text-gray-600">Slot ID</label>
                    <div className="relative mt-1">
                      <Hash className="absolute top-2.5 left-3 h-4 w-4 text-gray-400" />
                      <input
                        type="number"
                        min="1"
                        required
                        value={searchSlotId}
                        onChange={(e) => setSearchSlotId(e.target.value)}
                        placeholder="e.g. 1"
                        className="w-full rounded-xl border border-gray-200 py-2 pr-3 pl-9 text-xs font-bold focus:border-emerald-600 focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {(activeQueryTab === 'centre' || activeQueryTab === 'centreDate') && (
                  <div className="flex-1 min-w-[140px]">
                    <label className="text-[11px] font-bold text-gray-600">Centre ID</label>
                    <div className="relative mt-1">
                      <Building2 className="absolute top-2.5 left-3 h-4 w-4 text-gray-400" />
                      <input
                        type="number"
                        min="1"
                        required
                        value={filterCentreId}
                        onChange={(e) => setFilterCentreId(e.target.value)}
                        placeholder="e.g. 1"
                        className="w-full rounded-xl border border-gray-200 py-2 pr-3 pl-9 text-xs font-bold focus:border-emerald-600 focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {activeQueryTab === 'centreDate' && (
                  <div className="flex-1 min-w-[160px]">
                    <label className="text-[11px] font-bold text-gray-600">Date (YYYY-MM-DD)</label>
                    <div className="relative mt-1">
                      <Calendar className="absolute top-2.5 left-3 h-4 w-4 text-gray-400" />
                      <input
                        type="date"
                        required
                        value={filterDate}
                        onChange={(e) => setFilterDate(e.target.value)}
                        className="w-full rounded-xl border border-gray-200 py-2 pr-3 pl-9 text-xs font-bold focus:border-emerald-600 focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={queryLoading}
                  className="flex items-center gap-1.5 rounded-xl bg-emerald-800 px-5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-900 disabled:opacity-50"
                >
                  {queryLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Search className="h-4 w-4" /> Fetch Slots
                    </>
                  )}
                </button>
              </form>

              {/* Query Error */}
              {queryError && (
                <div className="mt-3 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-2.5 text-xs font-semibold text-rose-700">
                  <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                  <span>{queryError}</span>
                </div>
              )}

              {/* Slot Results List */}
              <div className="mt-5 space-y-3">
                {slotResults.length > 0 ? (
                  slotResults.map((slot) => {
                    const remaining = slot.remainingCapacityKg !== undefined 
                      ? slot.remainingCapacityKg 
                      : slot.capacityKg - (slot.bookedKg || 0);

                    return (
                      <div
                        key={slot.id}
                        className="flex flex-col justify-between gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-xs transition hover:border-emerald-300 sm:flex-row sm:items-center"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="rounded-md bg-[#14532d] px-2 py-0.5 font-mono text-[10px] font-extrabold text-white">
                              Slot #{slot.id}
                            </span>
                            <span className="rounded-md bg-emerald-100 px-2 py-0.5 font-mono text-[10px] font-bold text-[#14532d]">
                              Centre #{slot.procurementCentreId}
                            </span>
                            <span className="text-xs font-bold text-gray-900">{slot.date}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs font-extrabold text-[#14532d]">
                            <Clock className="h-3.5 w-3.5" />
                            <span>{slot.startTime} → {slot.endTime}</span>
                          </div>
                        </div>

                        <div className="text-right text-xs">
                          <span className="text-gray-500">Intake Capacity:</span>
                          <div className="font-mono font-black text-gray-900">
                            {remaining} / {slot.capacityKg} kg
                          </div>
                          <span className="text-[10px] font-bold text-emerald-700">
                            {slot.status || 'AVAILABLE'}
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 p-8 text-center text-gray-400">
                    <Layers className="h-8 w-8 text-gray-300" />
                    <p className="mt-2 text-xs font-semibold">No slot records retrieved.</p>
                    <p className="text-[11px] text-gray-400">
                      Use the tabs above to query slots by Centre, Date, or ID.
                    </p>
                  </div>
                )}
              </div>

            </div>
          </div>

        </div>
      </main>
    </div>
  );
}