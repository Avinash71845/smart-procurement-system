import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  PlusCircle,
  Clock,
  Calendar,
  Weight,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowLeft,
  CalendarPlus,
  RefreshCw,
  Layers,
  MapPin,
} from "lucide-react";
import { getActiveCentres } from "../../api/procurementApi";

export default function OperatorHeaderWithSlotModal() {
  const navigate = useNavigate();
  const location = useLocation();

  const getTodayDateString = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [centres, setCentres] = useState([]);
  const [loadingCentres, setLoadingCentres] = useState(false);
  const [existingSlots, setExistingSlots] = useState([]);
  const [loadingExistingSlots, setLoadingExistingSlots] = useState(false);

  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  // Form State
  const [slotData, setSlotData] = useState({
    procurementCentreId: location.state?.procurementCentreId || "",
    date: getTodayDateString(),
    startTime: "09:00",
    endTime: "11:00",
    capacityKg: 800,
  });

  const getHeaders = () => {
    const token = (
      localStorage.getItem("OPERATOR_JWT") ||
      localStorage.getItem("token") ||
      localStorage.getItem("JWT_TOKEN") ||
      ""
    )
      .replace(/^"|"$/g, "")
      .trim();

    const headers = { "Content-Type": "application/json" };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    return headers;
  };

  // Load active centres on mount
  useEffect(() => {
    const fetchCentres = async () => {
      setLoadingCentres(true);
      try {
        const data = await getActiveCentres();
        const activeList = Array.isArray(data) ? data : data?.data || [];
        setCentres(activeList);

        if (activeList.length > 0) {
          setSlotData((prev) => ({
            ...prev,
            procurementCentreId:
              location.state?.procurementCentreId ||
              prev.procurementCentreId ||
              String(activeList[0].id),
          }));
        }
      } catch (err) {
        console.error("Failed to load centres:", err);
      } finally {
        setLoadingCentres(false);
      }
    };
    fetchCentres();
  }, [location.state]);

  // Load existing slots for the selected centre and date
  const loadExistingSlots = useCallback(
    async (centreId, date) => {
      if (!centreId || !date) return;
      setLoadingExistingSlots(true);
      try {
        const res = await fetch(
          `/api/slots/centre/${centreId}/date?date=${encodeURIComponent(date)}`,
          { headers: getHeaders() },
        );
        if (res.ok) {
          const data = await res.json();
          setExistingSlots(Array.isArray(data) ? data : data.data || []);
        } else {
          setExistingSlots([]);
        }
      } catch (err) {
        console.error("Failed to load existing slots:", err);
        setExistingSlots([]);
      } finally {
        setLoadingExistingSlots(false);
      }
    },
    [],
  );

  useEffect(() => {
    if (slotData.procurementCentreId && slotData.date) {
      loadExistingSlots(slotData.procurementCentreId, slotData.date);
    }
  }, [slotData.procurementCentreId, slotData.date, loadExistingSlots]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSlotData((prev) => ({
      ...prev,
      [name]:
        name === "procurementCentreId" || name === "capacityKg"
          ? Number(value)
          : value,
    }));
  };

  const handleCreateSlot = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage(null);

    // Validate times
    if (slotData.startTime >= slotData.endTime) {
      setStatusMessage({
        type: "error",
        text: "Start time must be before End time.",
      });
      setLoading(false);
      return;
    }

    if (!slotData.procurementCentreId) {
      setStatusMessage({
        type: "error",
        text: "Please select an active procurement centre.",
      });
      setLoading(false);
      return;
    }

    const formatTimeToSeconds = (t) => {
      if (!t) return "00:00:00";
      return t.length === 5 ? `${t}:00` : t;
    };

    const payload = {
      procurementCentreId: Number(slotData.procurementCentreId),
      date: slotData.date,
      startTime: formatTimeToSeconds(slotData.startTime),
      endTime: formatTimeToSeconds(slotData.endTime),
      capacityKg: Number(slotData.capacityKg),
    };

    try {
      const response = await fetch("/api/slots", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let errorMsg = `Server returned status ${response.status}`;
        try {
          const errData = await response.json();
          if (errData.message) errorMsg = errData.message;
          else if (errData.error) errorMsg = errData.error;
          else if (errData.errors && errData.errors.length > 0) {
            errorMsg = errData.errors
              .map((e) => e.defaultMessage || e.field)
              .join(", ");
          }
        } catch {
          try {
            const errText = await response.text();
            if (errText) errorMsg = errText;
          } catch {}
        }
        throw new Error(errorMsg);
      }

      const resData = await response.json();
      setStatusMessage({
        type: "success",
        text: `Slot #${resData.id || "Created"} successfully scheduled for ${payload.date} (${payload.startTime.slice(0, 5)} - ${payload.endTime.slice(0, 5)})!`,
      });

      // Refresh existing slots list
      loadExistingSlots(payload.procurementCentreId, payload.date);
    } catch (err) {
      setStatusMessage({
        type: "error",
        text: err.message || "Unable to create slot. Please check inputs.",
      });
    } finally {
      setLoading(false);
    }
  };

  const selectedCentreObj = centres.find(
    (c) => String(c.id) === String(slotData.procurementCentreId),
  );

  return (
    <div className="min-h-screen w-full bg-[#f6f9f5] font-sans text-gray-800 antialiased selection:bg-emerald-200 selection:text-emerald-900">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 px-6 py-4 shadow-sm backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/operatorhome"
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-700 transition hover:bg-[#14532d] hover:text-white"
              title="Back to Operator Home"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#14532d] text-white shadow-sm">
              <CalendarPlus className="h-5 w-5 text-[#00e699]" />
            </div>
            <div>
              <h1 className="text-base font-extrabold text-[#14532d]">
                Mandi Operational Portal
              </h1>
              <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                Create & Schedule Procurement Slots
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/slot-approve")}
              className="hidden sm:flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-bold text-gray-700 shadow-sm transition hover:bg-gray-50 hover:text-[#14532d]"
            >
              <Building2 className="h-4 w-4 text-emerald-700" />
              Manage Centres
            </button>
            <button
              type="button"
              onClick={() => navigate("/operatordashboard")}
              className="flex items-center gap-1.5 rounded-xl bg-[#14532d] px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-[#0f3e21]"
            >
              <Layers className="h-4 w-4 text-[#00e699]" />
              Operator Console
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="mx-auto max-w-6xl px-6 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left: Slot Creation Form (7 Cols) */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 lg:col-span-7"
          >
            <div className="border-b border-gray-100 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-gray-900">
                    Schedule Procurement Slot
                  </h2>
                  <p className="mt-0.5 text-xs text-gray-500">
                    Farmers will instantly see available capacity in their booking app.
                  </p>
                </div>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-bold text-emerald-800">
                  POST /api/slots
                </span>
              </div>
            </div>

            {/* Status Alert */}
            <AnimatePresence>
              {statusMessage && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className={`mt-4 flex items-center gap-2 rounded-xl p-3.5 text-xs ${
                    statusMessage.type === "success"
                      ? "border border-emerald-200 bg-emerald-50 text-emerald-800"
                      : "border border-red-200 bg-red-50 text-red-800"
                  }`}
                >
                  {statusMessage.type === "success" ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
                  )}
                  <span>{statusMessage.text}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleCreateSlot} className="mt-6 space-y-4">
              {/* Procurement Centre Selection */}
              <div>
                <label className="text-xs font-bold text-gray-700">
                  Target Procurement Mandi Centre
                </label>
                <div className="relative mt-1.5">
                  <Building2 className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
                  {loadingCentres ? (
                    <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-3 text-xs text-gray-500">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin text-emerald-600" />
                      Loading active centres...
                    </div>
                  ) : centres.length === 0 ? (
                    <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-3 text-xs text-yellow-800">
                      No active procurement centres found. Please add a centre first.
                    </div>
                  ) : (
                    <select
                      name="procurementCentreId"
                      required
                      value={slotData.procurementCentreId}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 pl-10 pr-4 text-xs font-bold text-gray-900 focus:border-[#14532d] focus:bg-white focus:outline-none"
                    >
                      {centres.map((centre) => (
                        <option key={centre.id} value={centre.id}>
                          {centre.name} (Code: {centre.code} • {centre.district})
                        </option>
                      ))}
                    </select>
                  )}
                </div>
                {selectedCentreObj && (
                  <p className="mt-1 text-[11px] text-gray-500 flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-emerald-600 shrink-0" />
                    {selectedCentreObj.village}, {selectedCentreObj.block},{" "}
                    {selectedCentreObj.district}, {selectedCentreObj.state}
                  </p>
                )}
              </div>

              {/* Slot Date */}
              <div>
                <label className="text-xs font-bold text-gray-700">
                  Procurement Date
                </label>
                <div className="relative mt-1.5">
                  <Calendar className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="date"
                    name="date"
                    required
                    min={getTodayDateString()}
                    value={slotData.date}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 pl-10 pr-4 text-xs font-bold text-gray-900 focus:border-[#14532d] focus:bg-white focus:outline-none"
                  />
                </div>
                <p className="mt-1 text-[10px] text-gray-400">
                  Select today or any upcoming date in Rabi/Kharif season.
                </p>
              </div>

              {/* Time Window */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-700">
                    Window Start Time
                  </label>
                  <div className="relative mt-1.5">
                    <Clock className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="time"
                      name="startTime"
                      required
                      value={slotData.startTime}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 pl-10 pr-4 text-xs font-mono font-bold text-gray-900 focus:border-[#14532d] focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700">
                    Window End Time
                  </label>
                  <div className="relative mt-1.5">
                    <Clock className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="time"
                      name="endTime"
                      required
                      value={slotData.endTime}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 pl-10 pr-4 text-xs font-mono font-bold text-gray-900 focus:border-[#14532d] focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Capacity */}
              <div>
                <label className="text-xs font-bold text-gray-700">
                  Target Grain Capacity (Kg)
                </label>
                <div className="relative mt-1.5">
                  <Weight className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="number"
                    name="capacityKg"
                    required
                    min="100"
                    step="50"
                    value={slotData.capacityKg}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 pl-10 pr-4 text-xs font-bold text-gray-900 focus:border-[#14532d] focus:bg-white focus:outline-none"
                  />
                </div>
                <div className="mt-1 flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-emerald-700">
                    = {(Number(slotData.capacityKg || 0) / 100).toFixed(1)} Quintals
                  </span>
                  <span className="text-gray-400">Standard batch: 800 - 5000 kg</span>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading || centres.length === 0}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#14532d] py-3.5 text-xs font-bold text-white shadow-md transition hover:bg-[#0f3e21] disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating Slot on Backend...
                    </>
                  ) : (
                    <>
                      <PlusCircle className="h-4 w-4 text-[#00e699]" />
                      Publish & Confirm Procurement Slot
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>

          {/* Right: Existing Slots for Selected Centre & Date (5 Cols) */}
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 lg:col-span-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h3 className="font-extrabold text-gray-900">
                  Scheduled Slots for Date
                </h3>
                <p className="mt-0.5 text-xs text-gray-500">
                  {slotData.date} • {selectedCentreObj?.name || "Selected Centre"}
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  loadExistingSlots(slotData.procurementCentreId, slotData.date)
                }
                disabled={loadingExistingSlots}
                className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white p-1.5 text-xs text-gray-600 shadow-sm hover:bg-gray-50 hover:text-emerald-700"
                title="Refresh slots"
              >
                <RefreshCw
                  className={`h-3.5 w-3.5 ${
                    loadingExistingSlots ? "animate-spin text-emerald-600" : ""
                  }`}
                />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {loadingExistingSlots ? (
                <div className="flex flex-col items-center justify-center py-12 text-xs text-gray-500">
                  <Loader2 className="mb-2 h-6 w-6 animate-spin text-emerald-600" />
                  Loading scheduled slots...
                </div>
              ) : existingSlots.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50/60 p-6 text-center">
                  <Clock className="mx-auto h-7 w-7 text-gray-400" />
                  <p className="mt-2 text-xs font-bold text-gray-700">
                    No slots scheduled for this date
                  </p>
                  <p className="mt-1 text-[11px] text-gray-400">
                    Use the form on the left to create the first arrival window for farmers.
                  </p>
                </div>
              ) : (
                existingSlots.map((slot) => {
                  const sId = slot.id ?? slot.slotId;
                  const sStart = slot.startTime ? slot.startTime.slice(0, 5) : "--";
                  const sEnd = slot.endTime ? slot.endTime.slice(0, 5) : "--";
                  const cap = slot.capacityKg ?? slot.capacity ?? 0;
                  const avail =
                    slot.availableCapacityKg !== undefined
                      ? Math.round(slot.availableCapacityKg)
                      : cap;
                  const isFull = slot.status === "FULL" || avail <= 0;

                  return (
                    <div
                      key={sId}
                      className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-3.5 shadow-sm transition hover:border-emerald-500"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-gray-900">
                            Slot #{sId}
                          </span>
                          <span
                            className={`rounded px-1.5 py-0.5 text-[9px] font-bold ${
                              isFull
                                ? "bg-red-100 text-red-700"
                                : "bg-emerald-100 text-emerald-800"
                            }`}
                          >
                            {isFull ? "FULL" : "AVAILABLE"}
                          </span>
                        </div>
                        <div className="mt-1 flex items-center gap-1 text-[11px] text-gray-500">
                          <Clock className="h-3 w-3 text-emerald-600" />
                          {sStart} - {sEnd}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-xs font-black text-[#14532d]">
                          {avail} kg
                        </div>
                        <div className="text-[10px] text-gray-400">
                          Total: {cap} kg
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4 text-xs text-emerald-900">
              <div className="font-bold flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-700" />
                Live Farmer Synchronization
              </div>
              <p className="mt-1 text-[11px] text-emerald-800">
                Any slot created here will automatically appear on the farmer's booking
                screen within 5 seconds without manual intervention.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
