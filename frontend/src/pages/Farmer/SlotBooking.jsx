import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sprout,
  Calendar,
  Clock,
  Truck,
  Scale,
  QrCode,
  CheckCircle2,
  ChevronRight,
  ArrowLeft,
  Printer,
  AlertCircle,
  Loader2,
  ShieldCheck,
  Check,
  Info,
  Timer,
} from "lucide-react";
import { getActiveCentres } from "../../api/procurementApi";

// =====================================================
// CONFIG
// =====================================================

const API_BASE_URL = "";

// =====================================================
// CROP CATALOG
// =====================================================

const CROP_CATALOG = [
  {
    id: "wheat",
    name: "Wheat (गेहूं)",
    mspRate: 2275,
    unit: "Qtl",
    season: "Rabi 2026",
    maxMoisture: "12%",
  },
  {
    id: "mustard",
    name: "Mustard (सरसों)",
    mspRate: 5650,
    unit: "Qtl",
    season: "Rabi 2026",
    maxMoisture: "8%",
  },
  {
    id: "gram",
    name: "Gram / Chana (चना)",
    mspRate: 5440,
    unit: "Qtl",
    season: "Rabi 2026",
    maxMoisture: "10%",
  },
  {
    id: "paddy",
    name: "Paddy / Rice (धान)",
    mspRate: 2300,
    unit: "Qtl",
    season: "Kharif Buffer",
    maxMoisture: "14%",
  },
];

// =====================================================
// MANDI CENTERS
// =====================================================
//
// IMPORTANT:
// Replace these IDs with the actual centre IDs from
// your Spring Boot database.
//
// Example:
// id: 1
// id: 2
//
// If your backend really uses "pat-01", keep it.
// =====================================================

// =====================================================
// COMPONENT
// =====================================================

export default function FarmerSlotBooking() {
  const navigate = useNavigate();

  // ===================================================
  // STEP
  // ===================================================

  const [step, setStep] = useState(1);

  // ===================================================
  // LOADING / ERROR
  // ===================================================

  const [loading, setLoading] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [loadingSlotDetails, setLoadingSlotDetails] = useState(false);

  const [apiError, setApiError] = useState(null);

  // ===================================================
  // API DATA
  // ===================================================

  const [slots, setSlots] = useState([]);
  const [selectedSlotDetails, setSelectedSlotDetails] = useState(null);
  const [centres, setCentres] = useState([]);

  // ===================================================
  // BOOKING DATA
  // ===================================================

  const [bookingData, setBookingData] = useState({
    farmerName: "Ramesh Patel",
    kisanId: "KCC-984210",
    phone: "98765 43210",

    selectedCropId: "wheat",

    quantityQtl: "4.0",

    selectedMandiId: "",

    bookingDate: "2026-09-07",

    selectedSlotId: "",

    vehicleType: "Tractor Trolley",

    vehicleNumber: "BR-01-GA-4581",

    bankAccountMasked: "•••• •••• 4523 (SBI)",
  });

  const [bookingResult, setBookingResult] = useState(null);

  // ===================================================
  // SELECTED CROP
  // ===================================================

  const selectedCrop =
    CROP_CATALOG.find((c) => c.id === bookingData.selectedCropId) ||
    CROP_CATALOG[0];

  // ===================================================
  // SELECTED MANDI
  // ===================================================

  const selectedMandi = centres.find(
    (m) => String(m.id) === String(bookingData.selectedMandiId),
  ) ||
    centres[0] || { name: "Select a procurement centre" };

  // ===================================================
  // QUANTITY CALCULATIONS
  // ===================================================

  const estimatedQuintals = parseFloat(bookingData.quantityQtl) || 0;

  const grainWeightKg = Math.round(estimatedQuintals * 100);

  const estimatedPayout = estimatedQuintals * selectedCrop.mspRate;

  const calculatedEstMinutes = Math.round((grainWeightKg / 500) * 60);

  // ===================================================
  // COMMON AUTH HEADERS
  // ===================================================

  const getHeaders = () => {
    const token =
      localStorage.getItem("FARMER_JWT") || localStorage.getItem("token");

    const headers = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return headers;
  };

  // ===================================================
  // API 1
  //
  // GET /api/slots/centre/{centreId}
  //
  // Get slots for ONLY ONE CENTRE
  // ===================================================

  const fetchSlotsByCentre = async (centreId) => {
    if (!centreId) return;

    try {
      setLoadingSlots(true);
      setApiError(null);

      setSlots([]);
      setSelectedSlotDetails(null);

      setBookingData((prev) => ({
        ...prev,
        selectedSlotId: "",
      }));

      const response = await fetch(
        `${API_BASE_URL}/api/slots/centre/${centreId}`,
        {
          method: "GET",
          headers: getHeaders(),
        },
      );

      if (!response.ok) {
        throw new Error(
          `Failed to load centre slots. Status: ${response.status}`,
        );
      }

      const data = await response.json();

      if (data.id) {
        localStorage.setItem("FARMER_BOOKING_ID", String(data.id));
      }

      // Some Spring Boot APIs return array directly.
      // Others return { data: [...] }
      const slotData = Array.isArray(data)
        ? data
        : data.data || data.content || [];

      setSlots(slotData);
    } catch (error) {
      console.error("Centre slots API error:", error);

      setApiError(error.message || "Unable to load slots for this centre.");

      setSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  // ===================================================
  // API 2
  //
  // GET /api/slots/centre/{centreId}/date?date=YYYY-MM-DD
  //
  // Get slots for ONE CENTRE + ONE DATE
  // ===================================================

  const fetchSlotsByCentreAndDate = async (centreId, date) => {
    if (!centreId || !date) return;

    try {
      setLoadingSlots(true);
      setApiError(null);

      setSlots([]);
      setSelectedSlotDetails(null);

      setBookingData((prev) => ({
        ...prev,
        selectedSlotId: "",
      }));

      const response = await fetch(
        `${API_BASE_URL}/api/slots/centre/${centreId}/date?date=${encodeURIComponent(
          date,
        )}`,
        {
          method: "GET",
          headers: getHeaders(),
        },
      );

      if (!response.ok) {
        throw new Error(
          `Failed to load slots for selected date. Status: ${response.status}`,
        );
      }

      const data = await response.json();

      const slotData = Array.isArray(data)
        ? data
        : data.data || data.content || [];

      setSlots(slotData);
    } catch (error) {
      console.error("Centre + date slots API error:", error);

      setApiError(error.message || "Unable to load slots for this date.");

      setSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  // ===================================================
  // API 3
  //
  // GET /api/slots/{id}
  //
  // Get COMPLETE DETAILS of ONE SLOT
  // ===================================================

  const fetchSlotDetails = async (slotId) => {
    if (!slotId) return;

    try {
      setLoadingSlotDetails(true);
      setApiError(null);

      const response = await fetch(`${API_BASE_URL}/api/slots/${slotId}`, {
        method: "GET",
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to load slot details. Status: ${response.status}`,
        );
      }

      const data = await response.json();

      setSelectedSlotDetails(data.data || data);
    } catch (error) {
      console.error("Slot details API error:", error);

      setApiError(error.message || "Unable to load selected slot details.");

      setSelectedSlotDetails(null);
    } finally {
      setLoadingSlotDetails(false);
    }
  };

  // ===================================================
  // LOAD INITIAL CENTRE SLOTS
  // ===================================================

  useEffect(() => {
    const loadCentres = async () => {
      try {
        setApiError(null);
        const activeCentres = await getActiveCentres();
        setCentres(activeCentres || []);
        if (activeCentres?.length) {
          setBookingData((prev) => ({
            ...prev,
            selectedMandiId:
              prev.selectedMandiId || String(activeCentres[0].id),
          }));
        }
      } catch (error) {
        setApiError(
          error.response?.data?.message ||
            "Unable to load procurement centres.",
        );
      }
    };

    loadCentres();
  }, []);

  // ===================================================
  // INPUT CHANGE
  // ===================================================

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setBookingData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ===================================================
  // MANDI CHANGE
  // ===================================================

  const handleMandiChange = (e) => {
    const centreId = e.target.value;

    setBookingData((prev) => ({
      ...prev,
      selectedMandiId: centreId,
      selectedSlotId: "",
    }));

    setSelectedSlotDetails(null);

    // API #1
    fetchSlotsByCentre(centreId);
  };

  // ===================================================
  // DATE CHANGE
  // ===================================================

  const handleDateChange = (e) => {
    const date = e.target.value;

    setBookingData((prev) => ({
      ...prev,
      bookingDate: date,
      selectedSlotId: "",
    }));

    setSelectedSlotDetails(null);

    // API #2
    fetchSlotsByCentreAndDate(bookingData.selectedMandiId, date);
  };

  // ===================================================
  // SLOT CHANGE
  // ===================================================

  const handleSlotChange = (e) => {
    const slotId = e.target.value;

    setBookingData((prev) => ({
      ...prev,
      selectedSlotId: slotId,
    }));

    // API #3
    fetchSlotDetails(slotId);
  };

  // ===================================================
  // STEP 1 → STEP 2
  // ===================================================

  const handleProceedToSlots = (e) => {
    e.preventDefault();

    if (estimatedQuintals <= 0) {
      alert("Please enter a valid crop quantity.");
      return;
    }

    if (!bookingData.selectedMandiId) {
      alert("Please select a procurement centre.");
      return;
    }

    // Make sure slots for selected date are loaded.
    fetchSlotsByCentreAndDate(
      bookingData.selectedMandiId,
      bookingData.bookingDate,
    );

    setStep(2);
  };

  // ===================================================
  // BOOKING API
  //
  // POST /api/bookings
  // ===================================================

  const handleConfirmBooking = async (e) => {
    e.preventDefault();

    if (!bookingData.selectedSlotId) {
      setApiError("Please select an available slot.");
      return;
    }

    setLoading(true);
    setApiError(null);

    const payload = {
      slotId: Number(bookingData.selectedSlotId),
      grainWeight: grainWeightKg,
    };

    try {
      console.log("Booking Request:", payload);

      const response = await fetch(`${API_BASE_URL}/api/bookings`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let errorMessage = `Booking failed. Status: ${response.status}`;

        try {
          const errorData = await response.json();

          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch {
          // Response wasn't JSON
        }

        throw new Error(errorMessage);
      }

      const data = await response.json();

      console.log("Booking Response:", data);

      setBookingResult({
        token:
          data.token ||
          data.tokenNumber ||
          data.bookingToken ||
          "TOKEN-GENERATED",

        status: data.status || "BOOKED",

        estimatedProcessingTime:
          data.estimatedProcessingTime || `${calculatedEstMinutes} minutes`,

        allocatedBay:
          data.allocatedBay || data.bay || "Bay 02 - Scale Terminal A",

        gatePassCode:
          data.gatePassCode || `GATE-${Math.floor(100 + Math.random() * 900)}`,

        bookingTime: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      });

      setStep(3);
    } catch (error) {
      console.error("Booking API error:", error);

      // IMPORTANT:
      // No fake booking response here.
      // If backend fails, show actual error.
      setApiError(error.message || "Booking failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ===================================================
  // SLOT DISPLAY HELPERS
  // ===================================================

  const getSlotId = (slot) => {
    return slot.id ?? slot.slotId ?? slot.slot_id;
  };

  const getSlotStartTime = (slot) => {
    return (
      slot.startTime ?? slot.start_time ?? slot.fromTime ?? slot.start ?? "--"
    );
  };

  const getSlotEndTime = (slot) => {
    return slot.endTime ?? slot.end_time ?? slot.toTime ?? slot.end ?? "--";
  };

  const getAvailableTokens = (slot) => {
    return (
      slot.availableTokens ??
      slot.available_tokens ??
      slot.remainingTokens ??
      slot.remaining ??
      slot.capacity ??
      0
    );
  };

  const getSlotStatus = (slot) => {
    return slot.status ?? slot.slotStatus ?? "AVAILABLE";
  };

  // ===================================================
  // UI
  // ===================================================

  return (
    <div className="relative min-h-screen w-full bg-[#f6f9f5] font-sans text-gray-800 antialiased">
      {/* =================================================
          BACKGROUND
      ================================================= */}

      <div
        className="pointer-events-none absolute inset-0 z-0 h-[480px] w-full opacity-80"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 50% 15%, rgba(212, 245, 195, 0.55) 0%, rgba(246, 249, 245, 1) 75%)",
        }}
      />

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-12">
        <Link to="/farmerhome" className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0d4624] text-white shadow-sm">
            <Sprout className="h-5 w-5 text-[#00e699]" />
          </div>

          <div>
            <span className="block text-lg font-extrabold leading-tight tracking-tight text-[#14532d]">
              SmartProcure
            </span>

            <span className="block text-[10px] font-semibold uppercase tracking-wider text-emerald-700">
              Govt. Mandi Portal • e-Token Hub
            </span>
          </div>
        </Link>

        <Link
          to="/farmerhome"
          className="flex items-center gap-1.5 text-xs font-bold text-gray-600 transition hover:text-[#14532d]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Farmer Home
        </Link>
      </header>

      {/* =================================================
          MAIN
      ================================================= */}

      <main className="relative z-10 mx-auto max-w-5xl px-6 pb-16 pt-4">
        {/* =================================================
            PROGRESS BAR
        ================================================= */}

        <div className="mb-6 flex items-center justify-center">
          <div className="flex items-center gap-3 text-xs font-bold">
            <div
              className={`flex items-center gap-2 rounded-full px-4 py-1.5 ${
                step >= 1
                  ? "bg-[#14532d] text-white shadow-sm"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-[11px]">
                1
              </span>

              <span>Crop & Mandi</span>
            </div>

            <div
              className={`h-0.5 w-8 rounded-full ${
                step >= 2 ? "bg-[#14532d]" : "bg-gray-300"
              }`}
            />

            <div
              className={`flex items-center gap-2 rounded-full px-4 py-1.5 ${
                step >= 2
                  ? "bg-[#14532d] text-white shadow-sm"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-[11px]">
                2
              </span>

              <span>Date, Slot & Weight</span>
            </div>

            <div
              className={`h-0.5 w-8 rounded-full ${
                step === 3 ? "bg-[#14532d]" : "bg-gray-300"
              }`}
            />

            <div
              className={`flex items-center gap-2 rounded-full px-4 py-1.5 ${
                step === 3
                  ? "bg-[#14532d] text-white shadow-sm"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-[11px]">
                3
              </span>

              <span>Confirmed Token</span>
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* =================================================
              STEP 1
          ================================================= */}

          {step === 1 && (
            <motion.form
              key="step1"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              onSubmit={handleProceedToSlots}
              className="grid grid-cols-1 gap-6 lg:grid-cols-12"
            >
              {/* LEFT */}
              <div className="rounded-3xl border border-emerald-900/10 bg-white/95 p-6 shadow-xl backdrop-blur-md sm:p-8 lg:col-span-7">
                <div className="border-b border-gray-100 pb-4">
                  <h1 className="text-xl font-black text-gray-900 sm:text-2xl">
                    Book Mandi Procurement Slot
                  </h1>

                  <p className="mt-1 text-xs text-gray-500">
                    Select your commodity, volume, and designated procurement
                    centre.
                  </p>
                </div>

                <div className="mt-5 space-y-5">
                  {/* CROP */}

                  <div>
                    <label className="text-xs font-bold text-gray-700">
                      Select Produce / Commodity
                    </label>

                    <div className="mt-2 grid grid-cols-2 gap-2.5">
                      {CROP_CATALOG.map((crop) => (
                        <div
                          key={crop.id}
                          onClick={() =>
                            setBookingData((p) => ({
                              ...p,
                              selectedCropId: crop.id,
                            }))
                          }
                          className={`cursor-pointer rounded-2xl border p-3.5 transition ${
                            bookingData.selectedCropId === crop.id
                              ? "border-[#14532d] bg-emerald-50/60 shadow-sm ring-1 ring-[#14532d]"
                              : "border-gray-200 bg-white hover:border-gray-300"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-gray-900">
                              {crop.name}
                            </span>

                            {bookingData.selectedCropId === crop.id && (
                              <CheckCircle2 className="h-4 w-4 text-[#14532d]" />
                            )}
                          </div>

                          <div className="mt-2 flex items-baseline justify-between text-[11px]">
                            <span className="text-gray-500">MSP:</span>

                            <span className="font-extrabold text-[#14532d]">
                              ₹{crop.mspRate}/{crop.unit}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* QUANTITY */}

                  <div>
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-gray-700">
                        Estimated Quantity (Quintals)
                      </label>

                      <span className="text-[11px] font-semibold text-emerald-800">
                        {grainWeightKg} kg Total
                      </span>
                    </div>

                    <div className="relative mt-1.5">
                      <Scale className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />

                      <input
                        type="number"
                        name="quantityQtl"
                        required
                        step="0.1"
                        min="0.1"
                        value={bookingData.quantityQtl}
                        onChange={handleInputChange}
                        placeholder="e.g. 4.0"
                        className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-xs font-bold text-gray-900 shadow-sm focus:border-emerald-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* MANDI */}

                  <div>
                    <label className="text-xs font-bold text-gray-700">
                      Select Procurement Mandi Center
                    </label>

                    <div className="mt-2 space-y-2">
                      {centres.map((mandi) => (
                        <label
                          key={mandi.id}
                          className={`flex cursor-pointer items-center justify-between rounded-2xl border p-3.5 transition ${
                            String(bookingData.selectedMandiId) ===
                            String(mandi.id)
                              ? "border-[#14532d] bg-emerald-50/60 shadow-sm ring-1 ring-[#14532d]"
                              : "border-gray-200 bg-white hover:border-gray-300"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="selectedMandiId"
                              value={mandi.id}
                              checked={
                                String(bookingData.selectedMandiId) ===
                                String(mandi.id)
                              }
                              onChange={handleMandiChange}
                              className="h-4 w-4 accent-[#14532d]"
                            />

                            <div>
                              <div className="text-xs font-bold text-gray-900">
                                {mandi.name}
                              </div>

                              <div className="text-[11px] text-gray-500">
                                {mandi.district}, {mandi.state} •{" "}
                                {mandi.address}
                              </div>
                            </div>
                          </div>

                          <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-bold text-emerald-800">
                            API
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* BUTTON */}

                  <button
                    type="submit"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#14532d] py-3.5 text-xs font-bold text-white shadow-md transition hover:bg-[#0f3e21]"
                  >
                    Proceed to Slot & Processing Estimate
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* RIGHT SUMMARY */}

              <div className="rounded-3xl border border-emerald-900/10 bg-white/95 p-6 shadow-xl backdrop-blur-md sm:p-8 lg:col-span-5">
                <div className="flex items-center gap-2 border-b border-gray-100 pb-3 text-[#14532d]">
                  <ShieldCheck className="h-5 w-5" />

                  <h3 className="font-extrabold text-gray-900">
                    Procurement & Rate Overview
                  </h3>
                </div>

                <div className="mt-4 space-y-4">
                  <div className="rounded-2xl border border-emerald-100 bg-[#f8faf7] p-3.5 text-xs space-y-1">
                    <div className="flex justify-between font-bold text-gray-900">
                      <span>Farmer:</span>

                      <span>{bookingData.farmerName}</span>
                    </div>

                    <div className="flex justify-between text-gray-600">
                      <span>Kisan ID:</span>

                      <span className="font-mono">{bookingData.kisanId}</span>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                      Direct Treasury MSP Payout
                    </span>

                    <div className="mt-1 text-3xl font-black text-[#14532d]">
                      ₹{estimatedPayout.toLocaleString()}
                    </div>

                    <div className="mt-2 space-y-1 text-xs text-gray-600">
                      <div className="flex justify-between">
                        <span>Rate:</span>

                        <span className="font-bold text-gray-900">
                          ₹{selectedCrop.mspRate}/Qtl
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span>Net Weight:</span>

                        <span className="font-bold text-gray-900">
                          {grainWeightKg} kg
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-2xl border border-blue-200 bg-blue-50/70 p-3.5 text-xs text-blue-900">
                    <Timer className="h-5 w-5 text-blue-700 shrink-0" />

                    <div>
                      <div className="font-bold">Rate Benchmark: 500 kg/hr</div>

                      <div className="text-[11px] text-blue-800">
                        Estimated unload & testing: ~{calculatedEstMinutes}{" "}
                        minutes
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.form>
          )}

          {/* =================================================
              STEP 2
          ================================================= */}

          {step === 2 && (
            <motion.form
              key="step2"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              onSubmit={handleConfirmBooking}
              className="grid grid-cols-1 gap-6 lg:grid-cols-12"
            >
              {/* LEFT */}

              <div className="rounded-3xl border border-emerald-900/10 bg-white/95 p-6 shadow-xl backdrop-blur-md sm:p-8 lg:col-span-7">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <div>
                    <h1 className="text-xl font-black text-gray-900 sm:text-2xl">
                      Select Arrival Slot & Transport
                    </h1>

                    <p className="mt-0.5 text-xs text-gray-500">
                      Center: <strong>{selectedMandi.name}</strong>
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex items-center gap-1 text-xs font-bold text-emerald-800 hover:underline"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Back
                  </button>
                </div>

                {/* ERROR */}

                {apiError && (
                  <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                    <AlertCircle className="h-4 w-4 shrink-0" />

                    <span>{apiError}</span>
                  </div>
                )}

                <div className="mt-5 space-y-5">
                  {/* DATE */}

                  <div>
                    <label className="text-xs font-bold text-gray-700">
                      Preferred Arrival Date
                    </label>

                    <div className="relative mt-1.5">
                      <Calendar className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />

                      <input
                        type="date"
                        name="bookingDate"
                        required
                        value={bookingData.bookingDate}
                        onChange={handleDateChange}
                        className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-xs font-bold text-gray-900 shadow-sm focus:border-emerald-600 focus:outline-none"
                      />
                    </div>

                    <p className="mt-1 text-[10px] text-gray-400">
                      Changing the date automatically calls the centre + date
                      slots API.
                    </p>
                  </div>

                  {/* SLOT */}

                  <div>
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-gray-700">
                        Available Slots
                      </label>

                      {loadingSlots && (
                        <span className="flex items-center gap-1 text-[10px] text-emerald-700">
                          <Loader2 className="h-3 w-3 animate-spin" />
                          Loading slots...
                        </span>
                      )}
                    </div>

                    <div className="mt-2 space-y-2">
                      {loadingSlots ? (
                        <div className="flex items-center justify-center rounded-2xl border border-gray-200 bg-gray-50 py-10 text-xs text-gray-500">
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Loading available slots...
                        </div>
                      ) : slots.length === 0 ? (
                        <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-5 text-center">
                          <Clock className="mx-auto h-6 w-6 text-yellow-700" />

                          <p className="mt-2 text-xs font-bold text-yellow-900">
                            No slots available
                          </p>

                          <p className="mt-1 text-[10px] text-yellow-700">
                            Try another date or procurement centre.
                          </p>
                        </div>
                      ) : (
                        slots.map((slot) => {
                          const slotId = getSlotId(slot);

                          const startTime = getSlotStartTime(slot);

                          const endTime = getSlotEndTime(slot);

                          const availableTokens = getAvailableTokens(slot);

                          const status = getSlotStatus(slot);

                          return (
                            <label
                              key={slotId}
                              className={`flex cursor-pointer items-center justify-between rounded-2xl border p-3.5 transition ${
                                String(bookingData.selectedSlotId) ===
                                String(slotId)
                                  ? "border-[#14532d] bg-emerald-50/60 shadow-sm ring-1 ring-[#14532d]"
                                  : "border-gray-200 bg-white hover:border-gray-300"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <input
                                  type="radio"
                                  name="selectedSlotId"
                                  value={slotId}
                                  checked={
                                    String(bookingData.selectedSlotId) ===
                                    String(slotId)
                                  }
                                  onChange={handleSlotChange}
                                  className="h-4 w-4 accent-[#14532d]"
                                />

                                <div>
                                  <div className="text-xs font-bold text-gray-900">
                                    Slot #{slotId}
                                  </div>

                                  <div className="mt-0.5 flex items-center gap-1 text-[11px] text-gray-500">
                                    <Clock className="h-3 w-3" />
                                    {startTime} - {endTime}
                                  </div>

                                  <div className="mt-1 text-[10px] uppercase font-semibold text-emerald-700">
                                    {status}
                                  </div>
                                </div>
                              </div>

                              <span className="block text-right text-xs font-extrabold text-[#14532d]">
                                {availableTokens}

                                <span className="block text-[9px] font-medium text-gray-500">
                                  Tokens Open
                                </span>
                              </span>
                            </label>
                          );
                        })
                      )}
                    </div>
                  </div>

                  {/* SELECTED SLOT DETAILS */}

                  {loadingSlotDetails && (
                    <div className="flex items-center rounded-2xl border border-blue-200 bg-blue-50 p-4 text-xs text-blue-800">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading selected slot details...
                    </div>
                  )}

                  {selectedSlotDetails && !loadingSlotDetails && (
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                      <div className="flex items-center gap-2">
                        <Info className="h-4 w-4 text-emerald-700" />

                        <h3 className="text-xs font-black text-emerald-900">
                          Selected Slot Details
                        </h3>
                      </div>

                      <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="text-gray-500">Slot ID</span>

                          <strong className="block text-gray-900">
                            {selectedSlotDetails.id ??
                              selectedSlotDetails.slotId}
                          </strong>
                        </div>

                        <div>
                          <span className="text-gray-500">Status</span>

                          <strong className="block text-emerald-700">
                            {selectedSlotDetails.status ?? "AVAILABLE"}
                          </strong>
                        </div>

                        <div>
                          <span className="text-gray-500">Start</span>

                          <strong className="block text-gray-900">
                            {selectedSlotDetails.startTime ?? "--"}
                          </strong>
                        </div>

                        <div>
                          <span className="text-gray-500">End</span>

                          <strong className="block text-gray-900">
                            {selectedSlotDetails.endTime ?? "--"}
                          </strong>
                        </div>

                        <div>
                          <span className="text-gray-500">Capacity</span>

                          <strong className="block text-gray-900">
                            {selectedSlotDetails.capacity ??
                              selectedSlotDetails.availableTokens ??
                              "--"}
                          </strong>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* VEHICLE */}

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-xs font-bold text-gray-700">
                        Vehicle Type
                      </label>

                      <select
                        name="vehicleType"
                        value={bookingData.vehicleType}
                        onChange={handleInputChange}
                        className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-xs font-bold text-gray-900 shadow-sm focus:border-emerald-600 focus:outline-none"
                      >
                        <option value="Tractor Trolley">Tractor Trolley</option>

                        <option value="Mini Truck / Pickup">
                          Mini Truck / Pickup
                        </option>

                        <option value="Commercial Truck">
                          Commercial Truck
                        </option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-gray-700">
                        Vehicle Plate / Registration
                      </label>

                      <div className="relative mt-1.5">
                        <Truck className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />

                        <input
                          type="text"
                          name="vehicleNumber"
                          required
                          value={bookingData.vehicleNumber}
                          onChange={handleInputChange}
                          placeholder="BR-01-GA-4581"
                          className="w-full uppercase rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-xs font-mono font-bold text-gray-900 shadow-sm focus:border-emerald-600 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* BUTTONS */}

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="rounded-xl border border-gray-300 px-5 py-3.5 text-xs font-bold text-gray-700 hover:bg-gray-50"
                    >
                      Back
                    </button>

                    <button
                      type="submit"
                      disabled={
                        loading ||
                        loadingSlotDetails ||
                        !bookingData.selectedSlotId
                      }
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#14532d] py-3.5 text-xs font-bold text-white shadow-md transition hover:bg-[#0f3e21] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Submitting Booking...
                        </>
                      ) : (
                        <>
                          <Check className="h-4 w-4 text-[#00e699]" />
                          Create Booking
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* RIGHT API PREVIEW */}

              <div className="rounded-3xl border border-emerald-900/10 bg-white/95 p-6 shadow-xl backdrop-blur-md sm:p-8 lg:col-span-5">
                <h3 className="font-extrabold text-gray-900 border-b border-gray-100 pb-3">
                  Live Slot API
                </h3>

                <div className="mt-4 space-y-3">
                  <div className="rounded-2xl bg-gray-900 p-4 font-mono text-[10px]">
                    <div className="text-gray-400">// Centre slots</div>

                    <div className="mt-1 text-emerald-400">GET</div>

                    <div className="break-all text-white">
                      /api/slots/centre/
                      {bookingData.selectedMandiId}
                    </div>
                  </div>

                  <div className="rounded-2xl bg-gray-900 p-4 font-mono text-[10px]">
                    <div className="text-gray-400">// Centre + date</div>

                    <div className="mt-1 text-emerald-400">GET</div>

                    <div className="break-all text-white">
                      /api/slots/centre/
                      {bookingData.selectedMandiId}
                      /date?date=
                      {bookingData.bookingDate}
                    </div>
                  </div>

                  <div className="rounded-2xl bg-gray-900 p-4 font-mono text-[10px]">
                    <div className="text-gray-400">
                      // Selected slot details
                    </div>

                    <div className="mt-1 text-emerald-400">GET</div>

                    <div className="break-all text-white">
                      /api/slots/
                      {bookingData.selectedSlotId || "{id}"}
                    </div>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl border border-emerald-100 bg-[#f8faf7] p-4 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Centre:</span>

                    <strong className="text-gray-900">
                      {selectedMandi.name}
                    </strong>
                  </div>

                  <div className="mt-2 flex justify-between">
                    <span className="text-gray-500">Date:</span>

                    <strong className="text-gray-900">
                      {bookingData.bookingDate}
                    </strong>
                  </div>

                  <div className="mt-2 flex justify-between">
                    <span className="text-gray-500">Available Slots:</span>

                    <strong className="text-emerald-800">{slots.length}</strong>
                  </div>

                  <div className="mt-2 flex justify-between">
                    <span className="text-gray-500">Selected Slot:</span>

                    <strong className="text-emerald-800">
                      {bookingData.selectedSlotId || "None"}
                    </strong>
                  </div>
                </div>
              </div>
            </motion.form>
          )}

          {/* =================================================
              STEP 3
          ================================================= */}

          {step === 3 && bookingResult && (
            <motion.div
              key="step3"
              initial={{
                opacity: 0,
                scale: 0.96,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              className="mx-auto max-w-2xl"
            >
              <div className="rounded-3xl border border-emerald-900/10 bg-white p-6 shadow-2xl sm:p-10">
                <div className="text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-[#14532d]">
                    <CheckCircle2 className="h-8 w-8 text-emerald-700" />
                  </div>

                  <h2 className="mt-3 text-2xl font-black text-gray-900">
                    Booking Confirmed
                  </h2>

                  <p className="mt-1 text-xs text-gray-500">
                    Status:{" "}
                    <strong className="text-emerald-700">
                      {bookingResult.status}
                    </strong>
                  </p>
                </div>

                <div className="mt-6 rounded-3xl border-2 border-dashed border-emerald-300 bg-[#f8faf7] p-6">
                  <div className="flex flex-col items-center justify-between gap-4 border-b border-gray-200 pb-4 sm:flex-row">
                    <div>
                      <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-900 uppercase">
                        Assigned Token Pass
                      </span>

                      <div className="mt-1 text-2xl font-mono font-black text-[#14532d]">
                        {bookingResult.token}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-white p-2.5 shadow-sm">
                      <QrCode className="h-12 w-12 text-gray-800" />

                      <div className="text-left text-[10px] text-gray-400">
                        <span>Scan at Mandi</span>

                        <strong className="block text-gray-700">
                          Gate Terminal
                        </strong>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-gray-500">Farmer:</span>

                      <strong className="block text-gray-900">
                        {bookingData.farmerName}
                      </strong>
                    </div>

                    <div>
                      <span className="text-gray-500">Commodity & Weight:</span>

                      <strong className="block text-gray-900">
                        {selectedCrop.name} ({grainWeightKg} kg)
                      </strong>
                    </div>

                    <div>
                      <span className="text-gray-500">Mandi:</span>

                      <strong className="block text-emerald-800">
                        {selectedMandi.name}
                      </strong>
                    </div>

                    <div>
                      <span className="text-gray-500">Slot:</span>

                      <strong className="block text-emerald-800">
                        #{bookingData.selectedSlotId}
                      </strong>
                    </div>

                    <div>
                      <span className="text-gray-500">Date:</span>

                      <strong className="block text-emerald-800">
                        {bookingData.bookingDate}
                      </strong>
                    </div>

                    <div>
                      <span className="text-gray-500">Vehicle:</span>

                      <strong className="block font-mono text-gray-900">
                        {bookingData.vehicleNumber}
                      </strong>
                    </div>
                  </div>

                  <div className="mt-4 border-t border-gray-200/80 pt-3 flex justify-between items-center text-xs">
                    <span className="text-gray-600">
                      Expected Direct Disbursement:
                    </span>

                    <span className="font-black text-base text-[#14532d]">
                      ₹{estimatedPayout.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-gray-50 py-3 text-xs font-bold text-gray-800 shadow-sm transition hover:bg-gray-100"
                  >
                    <Printer className="h-4 w-4 text-gray-600" />
                    Print Token Slip
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate("/farmerhome")}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#14532d] py-3 text-xs font-bold text-white shadow-md transition hover:bg-[#0f3e21]"
                  >
                    <Sprout className="h-4 w-4 text-[#00e699]" />
                    Done & Return Home
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
