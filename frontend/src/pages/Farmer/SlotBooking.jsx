import { useEffect, useState, useMemo, useRef } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
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
  RefreshCw,
  PlusCircle,
  Search,
  ChevronDown,
  X,
  Filter,
} from "lucide-react";
import { getActiveCentres } from "../../api/procurementApi";
import { fetchCommodityPrices, FALLBACK_CROPS } from "../../api/commodityApi";

// =====================================================
// CONFIG
// =====================================================

const API_BASE_URL = "";

// =====================================================
// CROP CATALOG & GOVERNMENT MSP BENCHMARKS
// =====================================================

// Top 4 Quick-Select Mandi Staples
const POPULAR_CROPS = [
  {
    id: "wheat",
    aliases: ["wheat", "wheat-grade-a"],
    name: "Wheat (गेहूं)",
    nameEn: "Wheat",
    nameHi: "गेहूं",
    mspRate: 2585,
    unit: "Qtl",
    category: "Cereals",
    season: "Rabi 2026-27 (Official MSP)",
    maxMoisture: "12%",
  },
  {
    id: "mustard",
    aliases: ["mustard", "mustard-seeds"],
    name: "Mustard (सरसों)",
    nameEn: "Mustard",
    nameHi: "सरसों",
    mspRate: 6200,
    unit: "Qtl",
    category: "Oilseeds",
    season: "Rabi 2026-27 (Official MSP)",
    maxMoisture: "8%",
  },
  {
    id: "gram",
    aliases: ["gram", "gram-chana"],
    name: "Gram / Chana (चना)",
    nameEn: "Gram / Chana",
    nameHi: "चना",
    mspRate: 5875,
    unit: "Qtl",
    category: "Pulses",
    season: "Rabi 2026-27 (Official MSP)",
    maxMoisture: "10%",
  },
  {
    id: "paddy",
    aliases: ["paddy", "paddy-common", "paddy-grade-a"],
    name: "Paddy / Rice (धान)",
    nameEn: "Paddy / Rice",
    nameHi: "धान",
    mspRate: 2441,
    unit: "Qtl",
    category: "Cereals",
    season: "Kharif 2026 (Official MSP)",
    maxMoisture: "14%",
  },
];

// Preserving CROP_CATALOG alias
const CROP_CATALOG = POPULAR_CROPS;

// Normalize all fallback crops into a unified list
const DEFAULT_ALL_CROPS = FALLBACK_CROPS.map((crop) => ({
  id: crop.id,
  aliases: [crop.id],
  name: `${crop.nameEn}${crop.nameHi ? ` (${crop.nameHi})` : ""}`,
  nameEn: crop.nameEn,
  nameHi: crop.nameHi || "",
  mspRate: Number(crop.mspRate) || 0,
  unit: "Qtl",
  category: crop.category || "Cereals",
  grade: crop.grade || "Standard",
  season: "Official CCEA MSP",
  maxMoisture: "12%",
}));

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
  const location = useLocation();

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
  const [isRefreshingCentres, setIsRefreshingCentres] = useState(false);
  const [isRefreshingSlots, setIsRefreshingSlots] = useState(false);
  const [isGeneratingSlots, setIsGeneratingSlots] = useState(false);

  const [apiError, setApiError] = useState(null);

  // Today's date helper (YYYY-MM-DD)
  const getTodayDateString = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

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

    bookingDate: getTodayDateString(),

    selectedSlotId: "",

    vehicleType: "Tractor Trolley",

    vehicleNumber: "BR-01-GA-4581",

    bankAccountMasked: "•••• •••• 4523 (SBI)",
  });

  const [bookingResult, setBookingResult] = useState(null);

  // ===================================================
  // CROP SEARCH & SELECTION STATE
  // ===================================================

  const [allCrops, setAllCrops] = useState(DEFAULT_ALL_CROPS);
  const [cropDropdownOpen, setCropDropdownOpen] = useState(false);
  const [cropSearchQuery, setCropSearchQuery] = useState("");
  const [cropCategoryFilter, setCropCategoryFilter] = useState("All");
  const cropDropdownRef = useRef(null);

  // Load real-time commodities from backend or fallbacks
  useEffect(() => {
    let isMounted = true;
    fetchCommodityPrices()
      .then((data) => {
        if (!isMounted || !Array.isArray(data) || data.length === 0) return;
        const mapped = data.map((crop) => ({
          id: crop.id,
          aliases: [crop.id],
          name: `${crop.nameEn || crop.name}${crop.nameHi ? ` (${crop.nameHi})` : ""}`,
          nameEn: crop.nameEn || crop.name,
          nameHi: crop.nameHi || "",
          mspRate: Number(crop.mspRate) || 0,
          unit: "Qtl",
          category: crop.category || "Cereals",
          grade: crop.grade || "Standard",
          season: "Official CCEA MSP",
          maxMoisture: "12%",
        }));
        setAllCrops(mapped);
      })
      .catch((err) => console.warn("Could not load dynamic crop prices:", err));
    return () => {
      isMounted = false;
    };
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        cropDropdownRef.current &&
        !cropDropdownRef.current.contains(event.target)
      ) {
        setCropDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Update booking data if navigating from cards with state
  useEffect(() => {
    if (location.state) {
      const state = location.state;
      let matchedCropId = null;

      if (state.cropId) {
        const id = String(state.cropId).toLowerCase();
        // Check if popular crop alias matches
        const pop = POPULAR_CROPS.find(
          (p) =>
            p.id.toLowerCase() === id ||
            p.aliases.some((a) => a.toLowerCase() === id)
        );
        if (pop) {
          matchedCropId = pop.id;
        } else {
          // Check all crops
          const allFound = allCrops.find(
            (c) =>
              c.id.toLowerCase() === id ||
              c.aliases?.some((a) => a.toLowerCase() === id)
          );
          if (allFound) matchedCropId = allFound.id;
          else matchedCropId = state.cropId;
        }
      } else if (state.selectedCrop) {
        const lower = String(state.selectedCrop).toLowerCase();
        const pop = POPULAR_CROPS.find(
          (p) =>
            p.name.toLowerCase().includes(lower) ||
            p.nameEn.toLowerCase().includes(lower) ||
            p.aliases.some((a) => lower.includes(a))
        );
        if (pop) {
          matchedCropId = pop.id;
        } else {
          const allFound = allCrops.find(
            (c) =>
              c.name.toLowerCase().includes(lower) ||
              c.nameEn?.toLowerCase().includes(lower) ||
              c.id.toLowerCase().includes(lower)
          );
          if (allFound) matchedCropId = allFound.id;
        }
      }

      setBookingData((prev) => ({
        ...prev,
        ...(matchedCropId ? { selectedCropId: matchedCropId } : {}),
        ...(state.quantityQtl ? { quantityQtl: String(state.quantityQtl) } : {}),
        ...(state.procurementCentreId ? { selectedMandiId: String(state.procurementCentreId) } : {}),
      }));
    }
  }, [location.state, allCrops]);

  // ===================================================
  // RESOLVE SELECTED CROP DYNAMICALLY
  // ===================================================

  const selectedCrop = useMemo(() => {
    const targetId = String(bookingData.selectedCropId || "").toLowerCase();

    // 1. Direct or alias match in POPULAR_CROPS
    const popMatch = POPULAR_CROPS.find(
      (c) =>
        c.id.toLowerCase() === targetId ||
        c.aliases?.some((a) => a.toLowerCase() === targetId)
    );
    if (popMatch) return popMatch;

    // 2. Direct or alias match in allCrops
    const allMatch = allCrops.find(
      (c) =>
        c.id.toLowerCase() === targetId ||
        c.aliases?.some((a) => a.toLowerCase() === targetId) ||
        c.nameEn?.toLowerCase() === targetId
    );
    if (allMatch) return allMatch;

    // 3. Substring match
    const subMatch = allCrops.find(
      (c) =>
        c.id.toLowerCase().includes(targetId) ||
        targetId.includes(c.id.toLowerCase())
    );
    if (subMatch) return subMatch;

    return POPULAR_CROPS[0];
  }, [allCrops, bookingData.selectedCropId]);

  // Helper to check if crop is active
  const isCropSelected = (crop) => {
    if (!crop) return false;
    const currentId = String(bookingData.selectedCropId || "").toLowerCase();
    const cropId = String(crop.id || "").toLowerCase();
    if (currentId === cropId) return true;
    if (crop.aliases?.some((a) => a.toLowerCase() === currentId)) return true;
    if (selectedCrop.id.toLowerCase() === cropId) return true;
    return false;
  };

  // Filter crops for search dropdown
  const filteredCrops = useMemo(() => {
    const q = cropSearchQuery.trim().toLowerCase();
    return allCrops.filter((crop) => {
      const matchesCat =
        cropCategoryFilter === "All" ||
        crop.category?.toLowerCase() === cropCategoryFilter.toLowerCase();
      if (!matchesCat) return false;
      if (!q) return true;
      return (
        crop.nameEn?.toLowerCase().includes(q) ||
        crop.nameHi?.toLowerCase().includes(q) ||
        crop.name?.toLowerCase().includes(q) ||
        crop.category?.toLowerCase().includes(q) ||
        crop.grade?.toLowerCase().includes(q)
      );
    });
  }, [allCrops, cropSearchQuery, cropCategoryFilter]);

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

  const fetchSlotsByCentre = async (centreId, isPolling = false) => {
    if (!centreId) return;

    try {
      if (!isPolling) {
        setLoadingSlots(true);
        setApiError(null);
      } else {
        setIsRefreshingSlots(true);
      }

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

      // Preserve selection if slot still exists
      setBookingData((prev) => {
        if (!prev.selectedSlotId) return prev;
        const exists = slotData.some(
          (s) => String(getSlotId(s)) === String(prev.selectedSlotId),
        );
        return exists ? prev : { ...prev, selectedSlotId: "" };
      });
    } catch (error) {
      console.error("Centre slots API error:", error);

      if (!isPolling) {
        setApiError(error.message || "Unable to load slots for this centre.");
        setSlots([]);
      }
    } finally {
      if (!isPolling) {
        setLoadingSlots(false);
      }
      setIsRefreshingSlots(false);
    }
  };

  // ===================================================
  // API 2
  //
  // GET /api/slots/centre/{centreId}/date?date=YYYY-MM-DD
  //
  // Get slots for ONE CENTRE + ONE DATE
  // ===================================================

  const fetchSlotsByCentreAndDate = async (centreId, date, isPolling = false) => {
    if (!centreId || !date) return;

    try {
      if (!isPolling) {
        setLoadingSlots(true);
        setApiError(null);
      } else {
        setIsRefreshingSlots(true);
      }

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

      // Preserve selection if slot still exists
      setBookingData((prev) => {
        if (!prev.selectedSlotId) return prev;
        const exists = slotData.some(
          (s) => String(getSlotId(s)) === String(prev.selectedSlotId),
        );
        return exists ? prev : { ...prev, selectedSlotId: "" };
      });
    } catch (error) {
      console.error("Centre + date slots API error:", error);

      if (!isPolling) {
        setApiError(error.message || "Unable to load slots for this date.");
        setSlots([]);
      }
    } finally {
      if (!isPolling) {
        setLoadingSlots(false);
      }
      setIsRefreshingSlots(false);
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
  // LOAD MANDI CENTRES & LIVE POLLING (5 SECONDS)
  // ===================================================

  const loadCentres = async (isPolling = false) => {
    try {
      if (!isPolling) {
        setIsRefreshingCentres(true);
        setApiError(null);
      }

      const activeCentres = await getActiveCentres();
      if (Array.isArray(activeCentres)) {
        setCentres(activeCentres);
        if (activeCentres.length > 0) {
          setBookingData((prev) => {
            const exists = activeCentres.some(
              (c) => String(c.id) === String(prev.selectedMandiId),
            );
            return {
              ...prev,
              selectedMandiId: exists
                ? prev.selectedMandiId
                : String(activeCentres[0].id),
            };
          });
        }
      }
    } catch (error) {
      console.error("Centres load error:", error);
      if (!isPolling) {
        setApiError(
          error.response?.data?.message ||
            error.message ||
            "Unable to load procurement centres.",
        );
      }
    } finally {
      if (!isPolling) {
        setIsRefreshingCentres(false);
      }
    }
  };

  useEffect(() => {
    // Initial fetch of centres
    loadCentres();
  }, []);

  useEffect(() => {
    // Poll every 5 seconds
    const interval = setInterval(() => {
      if (step === 1) {
        loadCentres(true);
      } else if (
        step === 2 &&
        bookingData.selectedMandiId &&
        bookingData.bookingDate
      ) {
        fetchSlotsByCentreAndDate(
          bookingData.selectedMandiId,
          bookingData.bookingDate,
          true,
        );
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [step, bookingData.selectedMandiId, bookingData.bookingDate]);

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
  // ON-DEMAND SLOT CREATION (AVAILABLE AT BOOKING PAGE)
  // ===================================================

  const handleQuickCreateDefaultSlots = async () => {
    if (!bookingData.selectedMandiId || !bookingData.bookingDate) return;
    setIsGeneratingSlots(true);
    setApiError(null);

    const windows = [
      { startTime: "09:00:00", endTime: "11:00:00", capacityKg: 1200 },
      { startTime: "11:30:00", endTime: "13:30:00", capacityKg: 1500 },
      { startTime: "14:00:00", endTime: "16:00:00", capacityKg: 2000 },
    ];

    try {
      for (const w of windows) {
        await fetch(`${API_BASE_URL}/api/slots`, {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify({
            procurementCentreId: Number(bookingData.selectedMandiId),
            date: bookingData.bookingDate,
            ...w,
          }),
        });
      }

      await fetchSlotsByCentreAndDate(
        bookingData.selectedMandiId,
        bookingData.bookingDate,
        false,
      );
    } catch (err) {
      console.error("Failed to generate default slots:", err);
      setApiError("Unable to initialize slots for this date.");
    } finally {
      setIsGeneratingSlots(false);
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
    if (
      slot.availableCapacityKg !== undefined &&
      slot.availableCapacityKg !== null
    ) {
      return `${Math.round(slot.availableCapacityKg)} kg open`;
    }
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
    if (
      slot.availableCapacityKg !== undefined &&
      slot.availableCapacityKg !== null &&
      slot.availableCapacityKg <= 0
    ) {
      return "FULL";
    }
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
                  {/* CROP SELECTION WITH SEARCH DROPDOWN & QUICK TILES */}

                  <div>
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-gray-700">
                        Select Produce / Commodity
                      </label>

                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/80">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                        24+ CCEA MSP Crops
                      </span>
                    </div>

                    {/* SEARCH SELECT DROPDOWN COMBOBOX */}
                    <div className="relative mt-2" ref={cropDropdownRef}>
                      {/* Combobox Trigger */}
                      <button
                        type="button"
                        onClick={() => setCropDropdownOpen((prev) => !prev)}
                        className={`flex items-center justify-between w-full rounded-2xl border px-3.5 py-2.5 text-left transition shadow-xs ${
                          cropDropdownOpen
                            ? "border-emerald-600 bg-white ring-2 ring-emerald-500/20"
                            : "border-gray-200 bg-[#f9fbf8] hover:border-emerald-300 hover:bg-white"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-[#14532d]">
                            <Search className="h-4 w-4 text-emerald-700" />
                          </div>

                          <div className="min-w-0">
                            <div className="text-xs font-extrabold text-gray-900 truncate">
                              {selectedCrop.name}
                            </div>
                            <div className="text-[10px] text-gray-500 flex items-center gap-1.5 truncate">
                              <span className="font-bold text-emerald-800">
                                {selectedCrop.category}
                              </span>
                              <span>•</span>
                              <span>
                                Govt MSP:{" "}
                                <strong className="text-[#14532d] font-black">
                                  ₹{selectedCrop.mspRate?.toLocaleString()}/Qtl
                                </strong>
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 ml-2">
                          <span className="hidden sm:inline-block rounded-lg bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-800 border border-emerald-200">
                            Search All Crops
                          </span>
                          <ChevronDown
                            className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
                              cropDropdownOpen ? "rotate-180 text-emerald-700" : ""
                            }`}
                          />
                        </div>
                      </button>

                      {/* Dropdown Floating Menu */}
                      <AnimatePresence>
                        {cropDropdownOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -6, scale: 0.99 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -6, scale: 0.99 }}
                            transition={{ duration: 0.15 }}
                            className="absolute left-0 right-0 top-full z-50 mt-1.5 rounded-2xl border border-emerald-200/90 bg-white shadow-2xl overflow-hidden backdrop-blur-md"
                          >
                            {/* Search Field & Categories */}
                            <div className="p-3 border-b border-gray-100 bg-[#f8faf7]">
                              <div className="relative">
                                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-gray-400" />
                                <input
                                  type="text"
                                  autoFocus
                                  value={cropSearchQuery}
                                  onChange={(e) => setCropSearchQuery(e.target.value)}
                                  placeholder="Search any crop (e.g. Soybean, Mustard, मक्का, चना, Cotton...)"
                                  className="w-full rounded-xl border border-gray-200 bg-white py-2 pl-9 pr-8 text-xs font-semibold text-gray-900 placeholder:text-gray-400 focus:border-emerald-600 focus:outline-none"
                                  onClick={(e) => e.stopPropagation()}
                                />
                                {cropSearchQuery && (
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setCropSearchQuery("");
                                    }}
                                    className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600"
                                  >
                                    <X className="h-3.5 w-3.5" />
                                  </button>
                                )}
                              </div>

                              {/* Category Filter Chips */}
                              <div className="mt-2 flex items-center gap-1.5 overflow-x-auto pb-0.5">
                                {["All", "Cereals", "Pulses", "Oilseeds", "Commercial"].map((cat) => (
                                  <button
                                    key={cat}
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setCropCategoryFilter(cat);
                                    }}
                                    className={`shrink-0 rounded-lg px-2.5 py-1 text-[10px] font-bold transition ${
                                      cropCategoryFilter === cat
                                        ? "bg-[#14532d] text-white shadow-xs"
                                        : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                                    }`}
                                  >
                                    {cat}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Dropdown Items List */}
                            <div className="max-h-60 overflow-y-auto p-1.5 space-y-1">
                              {filteredCrops.length === 0 ? (
                                <div className="p-4 text-center text-xs text-gray-500">
                                  No crops found matching "{cropSearchQuery}". Try another name or select from popular crops.
                                </div>
                              ) : (
                                filteredCrops.map((crop) => {
                                  const isSelected = isCropSelected(crop);
                                  return (
                                    <div
                                      key={crop.id}
                                      onClick={() => {
                                        setBookingData((p) => ({
                                          ...p,
                                          selectedCropId: crop.id,
                                        }));
                                        setCropDropdownOpen(false);
                                        setCropSearchQuery("");
                                      }}
                                      className={`flex cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 text-xs transition ${
                                        isSelected
                                          ? "bg-emerald-50 text-emerald-950 font-bold border border-emerald-200"
                                          : "hover:bg-gray-50 text-gray-800"
                                      }`}
                                    >
                                      <div className="flex items-center gap-2.5 min-w-0">
                                        {isSelected ? (
                                          <CheckCircle2 className="h-4 w-4 text-[#14532d] shrink-0" />
                                        ) : (
                                          <div className="h-4 w-4 rounded-full border border-gray-300 shrink-0" />
                                        )}
                                        <div className="min-w-0">
                                          <div className="flex items-center gap-1.5 truncate">
                                            <span className="font-extrabold text-gray-900 truncate">
                                              {crop.nameEn || crop.name}
                                            </span>
                                            {crop.nameHi && (
                                              <span className="text-[11px] text-gray-500 truncate">
                                                ({crop.nameHi})
                                              </span>
                                            )}
                                          </div>
                                          <div className="text-[10px] text-gray-400">
                                            {crop.category} {crop.grade ? `• ${crop.grade}` : ""}
                                          </div>
                                        </div>
                                      </div>

                                      <div className="text-right shrink-0 ml-2">
                                        <span className="rounded-lg bg-emerald-100/80 px-2 py-0.5 text-[11px] font-black text-[#14532d]">
                                          ₹{crop.mspRate?.toLocaleString()}/Qtl
                                        </span>
                                        <span className="block text-[9px] text-gray-400 font-medium">
                                          Official MSP
                                        </span>
                                      </div>
                                    </div>
                                  );
                                })
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* 4 POPULAR QUICK-SELECT TILES */}
                    <div className="mt-3">
                      <div className="mb-1.5 flex items-center justify-between text-[11px]">
                        <span className="font-bold text-gray-500 uppercase tracking-wider text-[10px]">
                          Popular Commodities:
                        </span>
                        <span className="text-gray-400 text-[10px]">Tap to select</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                        {POPULAR_CROPS.map((crop) => {
                          const isSelected = isCropSelected(crop);
                          return (
                            <div
                              key={crop.id}
                              onClick={() =>
                                setBookingData((p) => ({
                                  ...p,
                                  selectedCropId: crop.id,
                                }))
                              }
                              className={`cursor-pointer rounded-2xl border p-3 transition ${
                                isSelected
                                  ? "border-[#14532d] bg-emerald-50/60 shadow-sm ring-1 ring-[#14532d]"
                                  : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/40"
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-gray-900 truncate">
                                  {crop.name}
                                </span>

                                {isSelected && (
                                  <CheckCircle2 className="h-4 w-4 text-[#14532d] shrink-0" />
                                )}
                              </div>

                              <div className="mt-2 flex items-baseline justify-between text-[11px]">
                                <span className="text-gray-500">MSP:</span>

                                <span className="font-extrabold text-[#14532d]">
                                  ₹{crop.mspRate}/{crop.unit}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* ACTIVE CUSTOM CROP NOTIFICATION (If farmer picked e.g. Soybean, Cotton, Maize, etc.) */}
                    {!POPULAR_CROPS.some((c) => isCropSelected(c)) && (
                      <div className="mt-2.5 flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50/80 p-3 text-xs">
                        <div className="flex items-center gap-2 min-w-0">
                          <CheckCircle2 className="h-4 w-4 text-emerald-700 shrink-0" />
                          <div className="truncate">
                            <span className="font-extrabold text-gray-900">
                              Selected Commodity: {selectedCrop.name}
                            </span>
                            <span className="ml-2 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                              {selectedCrop.category}
                            </span>
                          </div>
                        </div>
                        <div className="shrink-0 text-right font-black text-[#14532d] ml-2">
                          ₹{selectedCrop.mspRate?.toLocaleString()}/Qtl
                        </div>
                      </div>
                    )}
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
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold text-gray-700">
                        Select Procurement Mandi Center
                      </label>

                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 border border-emerald-200">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                          </span>
                          Live • 5s
                        </span>
                        <button
                          type="button"
                          onClick={() => loadCentres(false)}
                          disabled={isRefreshingCentres}
                          className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2 py-1 text-[11px] font-bold text-gray-600 shadow-sm transition hover:bg-gray-50 hover:text-emerald-700 disabled:opacity-50"
                          title="Refresh procurement centres"
                        >
                          <RefreshCw
                            className={`h-3 w-3 ${
                              isRefreshingCentres
                                ? "animate-spin text-emerald-600"
                                : ""
                            }`}
                          />
                          Refresh
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {centres.length === 0 ? (
                        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 text-center text-xs text-gray-500">
                          No procurement centres available.
                        </div>
                      ) : (
                        centres.map((mandi) => (
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
                        ))
                      )}
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

                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 border border-emerald-200">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                          </span>
                          Live • 5s
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            fetchSlotsByCentreAndDate(
                              bookingData.selectedMandiId,
                              bookingData.bookingDate,
                              false,
                            )
                          }
                          disabled={loadingSlots || isRefreshingSlots}
                          className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2 py-1 text-[11px] font-bold text-gray-600 shadow-sm transition hover:bg-gray-50 hover:text-emerald-700 disabled:opacity-50"
                          title="Refresh slots"
                        >
                          <RefreshCw
                            className={`h-3 w-3 ${
                              loadingSlots || isRefreshingSlots
                                ? "animate-spin text-emerald-600"
                                : ""
                            }`}
                          />
                          Refresh
                        </button>
                      </div>
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
                            No slots scheduled for {bookingData.bookingDate}
                          </p>

                          <p className="mt-1 text-[10px] text-yellow-700">
                            You can open standard arrival windows for this date now, or choose another date.
                          </p>

                          <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-2.5">
                            <button
                              type="button"
                              onClick={handleQuickCreateDefaultSlots}
                              disabled={isGeneratingSlots}
                              className="flex items-center gap-1.5 rounded-xl bg-[#14532d] px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-[#0f3e21] disabled:opacity-50"
                            >
                              {isGeneratingSlots ? (
                                <>
                                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                  Creating Slots...
                                </>
                              ) : (
                                <>
                                  <PlusCircle className="h-3.5 w-3.5 text-[#00e699]" />
                                  Create & Open Slots for this Date
                                </>
                              )}
                            </button>

                            <Link
                              to="/slot-approve"
                              state={{
                                procurementCentreId: bookingData.selectedMandiId,
                                centreName: selectedMandi.name,
                                tab: "slots",
                              }}
                              className="text-xs font-bold text-emerald-800 hover:underline"
                            >
                              Open Slot Approval & Schedule Updates &rarr;
                            </Link>
                          </div>
                        </div>
                      ) : (
                        slots.map((slot) => {
                          const slotId = getSlotId(slot);

                          const startTime = getSlotStartTime(slot);

                          const endTime = getSlotEndTime(slot);

                          const availableTokens = getAvailableTokens(slot);

                          const status = getSlotStatus(slot);

                          const isSlotFull = status === "FULL";

                          return (
                            <label
                              key={slotId}
                              className={`flex items-center justify-between rounded-2xl border p-3.5 transition ${
                                isSlotFull
                                  ? "border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed"
                                  : String(bookingData.selectedSlotId) ===
                                    String(slotId)
                                  ? "cursor-pointer border-[#14532d] bg-emerald-50/60 shadow-sm ring-1 ring-[#14532d]"
                                  : "cursor-pointer border-gray-200 bg-white hover:border-gray-300"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <input
                                  type="radio"
                                  name="selectedSlotId"
                                  value={slotId}
                                  disabled={isSlotFull}
                                  checked={
                                    String(bookingData.selectedSlotId) ===
                                    String(slotId)
                                  }
                                  onChange={handleSlotChange}
                                  className="h-4 w-4 accent-[#14532d]"
                                />

                                <div>
                                  <div className="text-xs font-bold text-gray-900 flex items-center gap-2">
                                    Slot #{slotId}
                                    {isSlotFull && (
                                      <span className="rounded bg-red-100 px-1.5 py-0.5 text-[9px] font-bold text-red-700">
                                        FULL
                                      </span>
                                    )}
                                  </div>

                                  <div className="mt-0.5 flex items-center gap-1 text-[11px] text-gray-500">
                                    <Clock className="h-3 w-3" />
                                    {startTime} - {endTime}
                                  </div>

                                  <div
                                    className={`mt-1 text-[10px] uppercase font-semibold ${
                                      isSlotFull
                                        ? "text-red-600"
                                        : "text-emerald-700"
                                    }`}
                                  >
                                    {status}
                                  </div>
                                </div>
                              </div>

                              <span className="block text-right text-xs font-extrabold text-[#14532d]">
                                {availableTokens}

                                <span className="block text-[9px] font-medium text-gray-500">
                                  {typeof availableTokens === "string"
                                    ? "Remaining Capacity"
                                    : "Tokens Open"}
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
