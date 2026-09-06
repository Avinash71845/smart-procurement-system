import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Sprout,
  PlusCircle,
  FileText,
  Search,
  RefreshCw,
  Clock,
  Timer,
  XCircle,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  ShieldAlert,
  Hash,
  Weight
} from 'lucide-react';

// ============================================================================
// MODULE 5 API SERVICE (Defined locally inside the component file)
// ============================================================================
const BASE_URL = 'http://localhost:8080/api/bookings';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

const bookingService = {
  // 5.1 POST /api/bookings
  createBooking: async (slotId, grainWeight) => {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        slotId: Number(slotId),
        grainWeight: Number(grainWeight)
      })
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.message || `Booking failed with status ${response.status}`);
    }
    return data;
  },

  // 5.2 GET /api/bookings/my-bookings
  getMyBookings: async () => {
    const response = await fetch(`${BASE_URL}/my-bookings`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    const data = await response.json().catch(() => []);
    if (!response.ok) {
      throw new Error(data.message || `Failed to fetch bookings (${response.status})`);
    }
    return Array.isArray(data) ? data : [];
  },

  // 5.3 GET /api/bookings/{id}
  getBookingById: async (id) => {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.message || 'You are not allowed to view this booking');
    }
    return data;
  },

  // 5.4 GET /api/bookings/token/{token}
  getBookingByToken: async (token) => {
    const response = await fetch(`${BASE_URL}/token/${encodeURIComponent(token)}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.message || `Booking with token ${token} not found`);
    }
    return data;
  },

  // 5.5 PATCH /api/bookings/{id}/cancel
  cancelBooking: async (id) => {
    const response = await fetch(`${BASE_URL}/${id}/cancel`, {
      method: 'PATCH',
      headers: getAuthHeaders()
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.message || `Cancellation failed (${response.status})`);
    }
    return data;
  }
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================
export default function SlotBooking() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('list'); // 'list' | 'create' | 'lookup'

  // 5.1 Create State
  const [slotId, setSlotId] = useState(1);
  const [grainWeight, setGrainWeight] = useState(400);
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState('');
  const [createdResult, setCreatedResult] = useState(null);

  // 5.2 My Bookings List State
  const [bookings, setBookings] = useState([]);
  const [listLoading, setListLoading] = useState(false);
  const [listError, setListError] = useState('');

  // 5.3 & 5.4 Lookup State
  const [searchMode, setSearchMode] = useState('token'); // 'token' | 'id'
  const [searchQuery, setSearchQuery] = useState('');
  const [lookupResult, setLookupResult] = useState(null);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState('');

  // 5.5 Cancel Action Tracker
  const [cancelLoadingId, setCancelLoadingId] = useState(null);

  // Rate standard: 500 kg/hr -> (weight / 500) * 60 mins (e.g. 400 kg = 48 mins)
  const estProcessingTime = Math.round(((parseFloat(grainWeight) || 0) / 500) * 60);

  useEffect(() => {
    fetchMyBookings();
  }, []);

  const fetchMyBookings = async () => {
    setListLoading(true);
    setListError('');
    try {
      const data = await bookingService.getMyBookings();
      setBookings(data);
    } catch (err) {
      setListError(err.message || 'बुकिंग डेटा लोड नहीं हो सका (Unable to load bookings).');
    } finally {
      setListLoading(false);
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setCreateError('');
    setCreatedResult(null);

    const weight = parseFloat(grainWeight);
    if (!weight || weight <= 0) {
      setCreateError('अनाज का वजन 0 किग्रा से अधिक होना चाहिए (Grain weight must be > 0 kg).');
      return;
    }

    setCreateLoading(true);
    try {
      const data = await bookingService.createBooking(slotId, weight);
      setCreatedResult(data);
      fetchMyBookings();
    } catch (err) {
      setCreateError(err.message);
    } finally {
      setCreateLoading(false);
    }
  };

  const handleLookupSubmit = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLookupLoading(true);
    setLookupError('');
    setLookupResult(null);

    try {
      const data =
        searchMode === 'token'
          ? await bookingService.getBookingByToken(searchQuery.trim())
          : await bookingService.getBookingById(searchQuery.trim());
      setLookupResult(data);
    } catch (err) {
      setLookupError(err.message);
    } finally {
      setLookupLoading(false);
    }
  };

  const handleCancelBooking = async (id) => {
    if (!window.confirm(`क्या आप बुकिंग #${id} को रद्द करना चाहते हैं? (Cancel booking #${id}?)`)) {
      return;
    }

    setCancelLoadingId(id);
    try {
      const updated = await bookingService.cancelBooking(id);
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: updated.status || 'CANCELLED' } : b))
      );
      if (lookupResult && lookupResult.id === id) {
        setLookupResult((prev) => ({ ...prev, status: updated.status || 'CANCELLED' }));
      }
    } catch (err) {
      alert(err.message || 'रद्द करने में समस्या आई (Cancellation failed).');
    } finally {
      setCancelLoadingId(null);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f6f9f5] font-sans text-gray-800 antialiased selection:bg-emerald-200 selection:text-emerald-900">
      {/* Background Soft Glow */}
      <div
        className="pointer-events-none absolute inset-0 z-0 h-[380px] w-full"
        style={{
          backgroundImage:
            'radial-gradient(ellipse at 50% 10%, rgba(212, 245, 195, 0.6) 0%, rgba(246, 249, 245, 1) 75%)'
        }}
      />

      {/* Header */}
      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#14532d] text-white shadow-sm">
            <Sprout className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <span className="block text-lg font-extrabold leading-tight text-[#14532d]">SmartProcure</span>
            <span className="block text-[10px] font-semibold tracking-wider text-emerald-700 uppercase">
              Farmer Booking System • मॉड्यूल 5
            </span>
          </div>
        </Link>

        <button
          type="button"
          onClick={() => navigate('/farmerhome')}
          className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-bold text-gray-700 shadow-sm transition hover:bg-gray-50"
        >
          <ArrowLeft className="h-4 w-4" /> Farmer Home
        </button>
      </header>

      {/* Main Container */}
      <main className="relative z-10 mx-auto max-w-5xl px-6 pt-2 pb-16">
        {/* Navigation Tabs */}
        <div className="mb-6 flex gap-2 border-b border-gray-200 pb-3">
          <button
            type="button"
            onClick={() => {
              setTab('list');
              fetchMyBookings();
            }}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition ${
              tab === 'list'
                ? 'bg-[#14532d] text-white shadow-sm'
                : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <FileText className="h-4 w-4" /> 5.2 My Bookings
          </button>

          <button
            type="button"
            onClick={() => {
              setTab('create');
              setCreateError('');
            }}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition ${
              tab === 'create'
                ? 'bg-[#14532d] text-white shadow-sm'
                : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <PlusCircle className="h-4 w-4" /> 5.1 Create Booking
          </button>

          <button
            type="button"
            onClick={() => {
              setTab('lookup');
              setLookupError('');
            }}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition ${
              tab === 'lookup'
                ? 'bg-[#14532d] text-white shadow-sm'
                : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Search className="h-4 w-4" /> 5.3 & 5.4 Search / Security Test
          </button>
        </div>

        {/* TAB 1: 5.2 My Bookings & 5.5 Cancel */}
        {tab === 'list' && (
          <div className="rounded-3xl border border-emerald-900/10 bg-white/95 p-6 shadow-xl backdrop-blur-md sm:p-8">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h2 className="text-xl font-black text-gray-900">मेरी सक्रिय बुकिंग (My Bookings)</h2>
                <p className="text-xs text-gray-500">Live database records from GET /api/bookings/my-bookings</p>
              </div>
              <button
                type="button"
                onClick={fetchMyBookings}
                disabled={listLoading}
                className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-bold text-gray-700 hover:bg-gray-100"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${listLoading ? 'animate-spin' : ''}`} /> Refresh
              </button>
            </div>

            {listError && (
              <div className="mt-4 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-700">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{listError}</span>
              </div>
            )}

            <div className="mt-5 space-y-3">
              {listLoading && bookings.length === 0 ? (
                <div className="py-12 text-center text-xs text-gray-400">बुकिंग लोड हो रही है (Loading)...</div>
              ) : bookings.length === 0 ? (
                <div className="py-12 text-center">
                  <Clock className="mx-auto h-8 w-8 text-gray-300" />
                  <p className="mt-2 text-xs font-bold text-gray-600">कोई सक्रिय बुकिंग नहीं मिली (No records found).</p>
                  <button
                    type="button"
                    onClick={() => setTab('create')}
                    className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-[#14532d] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#0f3e21]"
                  >
                    <PlusCircle className="h-3.5 w-3.5" /> Book a Slot (5.1)
                  </button>
                </div>
              ) : (
                bookings.map((b) => (
                  <div
                    key={b.id}
                    className="flex flex-col justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:border-emerald-200 sm:flex-row sm:items-center"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="rounded bg-emerald-100 px-2 py-0.5 font-mono text-xs font-black text-[#14532d]">
                          {b.token}
                        </span>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                            b.status === 'BOOKED'
                              ? 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-600/20'
                              : 'bg-rose-50 text-rose-700 ring-1 ring-rose-600/20'
                          }`}
                        >
                          {b.status}
                        </span>
                        <span className="text-[11px] font-medium text-gray-400">ID #{b.id}</span>
                      </div>
                      <div className="text-xs text-gray-600">
                        Slot ID: <strong>#{b.slotId}</strong> • Grain Weight:{' '}
                        <strong className="text-gray-900">{b.grainWeight} kg</strong>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-800">
                        <Timer className="h-3.5 w-3.5" />
                        <span>
                          Est. Processing Time:{' '}
                          {b.estimatedProcessingTimeMinutes || Math.round((b.grainWeight / 500) * 60)} mins (at 500 kg/hr)
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {b.status === 'BOOKED' && (
                        <button
                          type="button"
                          onClick={() => handleCancelBooking(b.id)}
                          disabled={cancelLoadingId === b.id}
                          className="flex items-center gap-1 rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-100 disabled:opacity-50"
                        >
                          <XCircle className="h-3.5 w-3.5" />
                          {cancelLoadingId === b.id ? 'रद्द हो रहा है...' : 'Cancel Booking (5.5)'}
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 2: 5.1 Create Booking */}
        {tab === 'create' && (
          <div className="rounded-3xl border border-emerald-900/10 bg-white/95 p-6 shadow-xl backdrop-blur-md sm:p-8">
            <div className="border-b border-gray-100 pb-4">
              <h2 className="text-xl font-black text-gray-900">5.1 Create Booking</h2>
              <p className="mt-0.5 text-xs text-gray-500">
                POST /api/bookings • Calculates processing time using MVP rate: 500 kg/hour (400 kg = 48 minutes).
              </p>
            </div>

            {createError && (
              <div className="mt-4 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-700">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{createError}</span>
              </div>
            )}

            {createdResult ? (
              <div className="mt-6 rounded-2xl border-2 border-dashed border-emerald-300 bg-[#f8faf7] p-6 text-center">
                <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-600" />
                <h3 className="mt-2 text-xl font-black text-gray-900">Booking Confirmed!</h3>

                <div className="mt-1 text-xs font-bold text-emerald-800 uppercase tracking-wider">
                  status = {createdResult.status || 'BOOKED'}
                </div>

                <div className="mt-4 font-mono text-3xl font-black tracking-wider text-[#14532d]">
                  {createdResult.token}
                </div>

                <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3.5 py-1 text-xs font-bold text-[#14532d]">
                  <Timer className="h-3.5 w-3.5" />
                  Estimated processing time = {createdResult.estimatedProcessingTimeMinutes || estProcessingTime} minutes
                </div>

                <p className="mt-2 text-[11px] text-gray-500">
                  Total Grain Weight: {createdResult.grainWeight || grainWeight} kg booked on Slot #{createdResult.slotId || slotId}
                </p>

                <div className="mt-5 flex justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setTab('list');
                      fetchMyBookings();
                    }}
                    className="rounded-xl bg-[#14532d] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#0f3e21]"
                  >
                    View in My Bookings
                  </button>
                  <button
                    type="button"
                    onClick={() => setCreatedResult(null)}
                    className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50"
                  >
                    Book Another Slot
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleCreateSubmit} className="mt-6 space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-700">Slot ID (स्लॉट आईडी) *</label>
                  <div className="relative mt-1">
                    <Hash className="absolute top-2.5 left-3 h-4 w-4 text-gray-400" />
                    <input
                      type="number"
                      required
                      min="1"
                      value={slotId}
                      onChange={(e) => setSlotId(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 py-2.5 pr-3 pl-9 text-xs font-bold text-gray-900 focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-gray-700">Grain Weight in kg (अनाज का वजन) *</label>
                    <span className="text-[11px] font-semibold text-emerald-800">
                      Estimated Time: {estProcessingTime} minutes
                    </span>
                  </div>
                  <div className="relative mt-1">
                    <Weight className="absolute top-2.5 left-3 h-4 w-4 text-gray-400" />
                    <input
                      type="number"
                      required
                      min="1"
                      step="any"
                      placeholder="e.g. 400"
                      value={grainWeight}
                      onChange={(e) => setGrainWeight(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 py-2.5 pr-3 pl-9 text-xs font-bold text-gray-900 focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                  <span className="mt-1 block text-[10px] text-gray-400">
                    MVP Processing Rate: 500 kg/hour (e.g. 400 kg = 48 minutes).
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={createLoading}
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#14532d] py-3.5 text-xs font-bold text-white shadow-md transition hover:bg-[#0f3e21] disabled:opacity-75"
                >
                  {createLoading ? 'पुष्टि की जा रही है...' : 'Create Booking (POST /api/bookings)'}
                </button>
              </form>
            )}
          </div>
        )}

        {/* TAB 3: 5.3 & 5.4 Search / Security Test */}
        {tab === 'lookup' && (
          <div className="rounded-3xl border border-emerald-900/10 bg-white/95 p-6 shadow-xl backdrop-blur-md sm:p-8">
            <div className="border-b border-gray-100 pb-4">
              <h2 className="text-xl font-black text-gray-900">5.3 & 5.4 Search & Security Check</h2>
              <p className="mt-0.5 text-xs text-gray-500">
                Tests single booking retrieval. Enforces: <code>You are not allowed to view this booking</code> on cross-account tokens.
              </p>
            </div>

            <form onSubmit={handleLookupSubmit} className="mt-5 space-y-4">
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
                  <input
                    type="radio"
                    name="searchMode"
                    checked={searchMode === 'token'}
                    onChange={() => setSearchMode('token')}
                    className="accent-[#14532d]"
                  />
                  5.4 Search by Token (e.g. TOKEN-A1B2C3D4)
                </label>
                <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
                  <input
                    type="radio"
                    name="searchMode"
                    checked={searchMode === 'id'}
                    onChange={() => setSearchMode('id')}
                    className="accent-[#14532d]"
                  />
                  5.3 Search by Booking ID (e.g. 1)
                </label>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  placeholder={searchMode === 'token' ? 'TOKEN-A1B2C3D4' : '1'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 rounded-xl border border-gray-200 py-2.5 px-4 font-mono text-xs font-bold uppercase focus:border-emerald-600 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={lookupLoading}
                  className="rounded-xl bg-[#14532d] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#0f3e21] disabled:opacity-75"
                >
                  {lookupLoading ? 'Searching...' : 'Search'}
                </button>
              </div>
            </form>

            {lookupError && (
              <div className="mt-4 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-700">
                <ShieldAlert className="h-4 w-4 shrink-0 text-rose-600" />
                <span>{lookupError}</span>
              </div>
            )}

            {lookupResult && (
              <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50/40 p-5">
                <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
                  <span className="font-mono text-sm font-black text-[#14532d]">{lookupResult.token}</span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                      lookupResult.status === 'BOOKED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-700'
                    }`}
                  >
                    {lookupResult.status}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-gray-500">Booking ID:</span>
                    <strong className="block text-gray-900">#{lookupResult.id}</strong>
                  </div>
                  <div>
                    <span className="text-gray-500">Slot ID:</span>
                    <strong className="block text-gray-900">#{lookupResult.slotId}</strong>
                  </div>
                  <div>
                    <span className="text-gray-500">Grain Weight:</span>
                    <strong className="block text-gray-900">{lookupResult.grainWeight} kg</strong>
                  </div>
                  <div>
                    <span className="text-gray-500">Est. Processing Time:</span>
                    <strong className="block text-emerald-800">
                      {lookupResult.estimatedProcessingTimeMinutes || Math.round((lookupResult.grainWeight / 500) * 60)} mins
                    </strong>
                  </div>
                </div>

                {lookupResult.status === 'BOOKED' && (
                  <div className="mt-4 pt-3 border-t border-emerald-100">
                    <button
                      type="button"
                      onClick={() => handleCancelBooking(lookupResult.id)}
                      disabled={cancelLoadingId === lookupResult.id}
                      className="flex items-center gap-1 rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-700 disabled:opacity-50"
                    >
                      <XCircle className="h-3.5 w-3.5" />
                      {cancelLoadingId === lookupResult.id ? 'रद्द किया जा रहा है...' : 'Cancel Booking (5.5)'}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}