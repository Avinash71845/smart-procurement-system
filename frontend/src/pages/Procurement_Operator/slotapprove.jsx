import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Building2,
  MapPin,
  Barcode,
  CheckCircle2,
  AlertCircle,
  Loader2,
  PlusCircle,
  Building,
  CalendarPlus,
  ArrowRight,
  ArrowLeft,
  Calendar,
  Clock,
  Weight,
  RefreshCw,
  Layers,
  CalendarCheck,
} from "lucide-react";
import { getActiveCentres } from "../../api/procurementApi";

export default function SlotApprovalAndScheduleUpdates() {
  const navigate = useNavigate();
  const location = useLocation();

  const getTodayDateString = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [activeTab, setActiveTab] = useState(
    location.state?.tab || "slots",
  );

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
    if (token) headers.Authorization = `Bearer ${token}`;
    return headers;
  };

  const [centres, setCentres] = useState([]);
  const [loadingCentres, setLoadingCentres] = useState(false);

  const fetchCentres = async () => {
    setLoadingCentres(true);
    try {
      const data = await getActiveCentres();
      const activeList = Array.isArray(data) ? data : data?.data || [];
      setCentres(activeList);
      if (activeList.length > 0 && !slotFormData.procurementCentreId) {
        setSlotFormData((prev) => ({
          ...prev,
          procurementCentreId: String(
            location.state?.procurementCentreId || activeList[0].id,
          ),
        }));
      }
    } catch (err) {
      console.error("Failed to load centres:", err);
    } finally {
      setLoadingCentres(false);
    }
  };

  useEffect(() => {
    fetchCentres();
  }, []);

  const [slotFormData, setSlotFormData] = useState({
    procurementCentreId: location.state?.procurementCentreId || "",
    date: getTodayDateString(),
    startTime: "09:00",
    endTime: "11:00",
    capacityKg: 1000,
  });

  const [existingSlots, setExistingSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [creatingSlot, setCreatingSlot] = useState(false);
  const [slotStatusMessage, setSlotStatusMessage] = useState(null);

  const loadSlotsForCentreAndDate = useCallback(
    async (centreId, date) => {
      if (!centreId || !date) return;
      setLoadingSlots(true);
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
        console.error("Failed to load slots:", err);
        setExistingSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    },
    [],
  );

  useEffect(() => {
    if (slotFormData.procurementCentreId && slotFormData.date) {
      loadSlotsForCentreAndDate(
        slotFormData.procurementCentreId,
        slotFormData.date,
      );
    }
  }, [slotFormData.procurementCentreId, slotFormData.date, loadSlotsForCentreAndDate]);

  const handleSlotInputChange = (e) => {
    const { name, value } = e.target;
    setSlotFormData((prev) => ({
      ...prev,
      [name]:
        name === "procurementCentreId" || name === "capacityKg"
          ? Number(value)
          : value,
    }));
  };

  const handleCreateSlot = async (e) => {
    e.preventDefault();
    setCreatingSlot(true);
    setSlotStatusMessage(null);

    if (slotFormData.startTime >= slotFormData.endTime) {
      setSlotStatusMessage({
        type: "error",
        text: "Window start time must be before end time.",
      });
      setCreatingSlot(false);
      return;
    }

    if (!slotFormData.procurementCentreId) {
      setSlotStatusMessage({
        type: "error",
        text: "Please select a target procurement centre.",
      });
      setCreatingSlot(false);
      return;
    }

    const formatTimeToSeconds = (t) => {
      if (!t) return "00:00:00";
      return t.length === 5 ? `${t}:00` : t;
    };

    const payload = {
      procurementCentreId: Number(slotFormData.procurementCentreId),
      date: slotFormData.date,
      startTime: formatTimeToSeconds(slotFormData.startTime),
      endTime: formatTimeToSeconds(slotFormData.endTime),
      capacityKg: Number(slotFormData.capacityKg),
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
        } catch {}
        throw new Error(errorMsg);
      }

      const resData = await response.json();
      const successMsg = `Slot #${resData.id || "Created"} successfully scheduled!`;
      setSlotStatusMessage({
        type: "success",
        text: successMsg,
      });

      toast.success(successMsg, {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });

      loadSlotsForCentreAndDate(payload.procurementCentreId, payload.date);
    } catch (err) {
      setSlotStatusMessage({
        type: "error",
        text: err.message || "Unable to create slot.",
      });
      toast.error(err.message || "Slot creation failed", {
        position: "top-right",
        autoClose: 4000,
        theme: "colored",
      });
    } finally {
      setCreatingSlot(false);
    }
  };

  const [centreFormData, setCentreFormData] = useState({
    name: "Patna Central Mandi",
    code: "PAT001",
    address: "Station Road, Gate 2",
    village: "Bihta",
    block: "Patna Sadar",
    district: "Patna",
    state: "Bihar",
  });
  const [registeringCentre, setRegisteringCentre] = useState(false);
  const [centreError, setCentreError] = useState(null);

  const handleCentreChange = (e) => {
    const { name, value } = e.target;
    setCentreFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegisterCentre = async (e) => {
    e.preventDefault();
    setRegisteringCentre(true);
    setCentreError(null);

    const payload = {
      name: centreFormData.name.trim(),
      code: centreFormData.code.trim().toUpperCase(),
      address: centreFormData.address.trim(),
      village: centreFormData.village.trim(),
      block: centreFormData.block.trim(),
      district: centreFormData.district.trim(),
      state: centreFormData.state.trim(),
    };

    try {
      const response = await fetch("/api/procurement-centres", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Failed to register centre (Status: ${response.status})`);
      }

      const data = await response.json();
      toast.success(`Procurement Centre "${data.name}" registered successfully!`, {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });

      await fetchCentres();
      if (data.id) {
        setSlotFormData((prev) => ({
          ...prev,
          procurementCentreId: String(data.id),
        }));
      }
      setActiveTab("slots");
    } catch (err) {
      setCentreError(err.message || "Failed to register centre.");
    } finally {
      setRegisteringCentre(false);
    }
  };

  const selectedCentreObj = centres.find(
    (c) => String(c.id) === String(slotFormData.procurementCentreId),
  );

  return (
    <div className="min-h-screen w-full bg-[#f4f7f4] font-sans text-gray-800 antialiased selection:bg-emerald-200 selection:text-emerald-900">
      <ToastContainer />

      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 px-6 py-3.5 shadow-sm backdrop-blur-md">
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
              <CalendarCheck className="h-5 w-5 text-[#00e699]" />
            </div>
            <div>
              <h1 className="text-base font-extrabold text-[#14532d]">
                Slot Approval & Schedule Updates
              </h1>
              <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                Mandi Operational Terminal
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex rounded-xl border border-gray-200 bg-gray-100 p-1">
              <button
                type="button"
                onClick={() => setActiveTab("slots")}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                  activeTab === "slots"
                    ? "bg-[#14532d] text-white shadow-sm"
                    : "text-gray-600 hover:text-[#14532d]"
                }`}
              >
                <CalendarPlus className="h-3.5 w-3.5" />
                Schedule Slots
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("centres")}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                  activeTab === "centres"
                    ? "bg-[#14532d] text-white shadow-sm"
                    : "text-gray-600 hover:text-[#14532d]"
                }`}
              >
                <Building2 className="h-3.5 w-3.5" />
                Add Centre
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        {activeTab === "slots" && (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 lg:col-span-7"
            >
              <div className="border-b border-gray-100 pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-black text-gray-900">
                      Create & Schedule Arrival Slot
                    </h2>
                    <p className="mt-0.5 text-xs text-gray-500">
                      Configure time windows and grain capacity for your procurement centre.
                    </p>
                  </div>
                </div>
              </div>

              <AnimatePresence>
                {slotStatusMessage && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className={`mt-4 flex items-center gap-2 rounded-xl p-3.5 text-xs ${
                      slotStatusMessage.type === "success"
                        ? "border border-emerald-200 bg-emerald-50 text-emerald-800"
                        : "border border-red-200 bg-red-50 text-red-800"
                    }`}
                  >
                    {slotStatusMessage.type === "success" ? (
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
                    )}
                    <span>{slotStatusMessage.text}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleCreateSlot} className="mt-6 space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-gray-700">
                      Select Procurement Centre
                    </label>
                    <button
                      type="button"
                      onClick={() => setActiveTab("centres")}
                      className="text-[11px] font-bold text-emerald-700 hover:underline"
                    >
                      + Add New Centre
                    </button>
                  </div>
                  <div className="relative">
                    <Building2 className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
                    {loadingCentres ? (
                      <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-3 text-xs text-gray-500">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin text-emerald-600" />
                        Loading centres...
                      </div>
                    ) : centres.length === 0 ? (
                      <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-3 text-xs text-yellow-800">
                        No active procurement centres found.
                      </div>
                    ) : (
                      <select
                        name="procurementCentreId"
                        required
                        value={slotFormData.procurementCentreId}
                        onChange={handleSlotInputChange}
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
                      {selectedCentreObj.village}, {selectedCentreObj.block}, {selectedCentreObj.district}, {selectedCentreObj.state}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700">Arrival / Booking Date</label>
                  <div className="relative mt-1.5">
                    <Calendar className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="date"
                      name="date"
                      required
                      min={getTodayDateString()}
                      value={slotFormData.date}
                      onChange={handleSlotInputChange}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 pl-10 pr-4 text-xs font-bold text-gray-900 focus:border-[#14532d] focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-700">Window Start Time</label>
                    <div className="relative mt-1.5">
                      <Clock className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
                      <input
                        type="time"
                        name="startTime"
                        required
                        value={slotFormData.startTime}
                        onChange={handleSlotInputChange}
                        className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 pl-10 pr-4 text-xs font-mono font-bold text-gray-900 focus:border-[#14532d] focus:bg-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700">Window End Time</label>
                    <div className="relative mt-1.5">
                      <Clock className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
                      <input
                        type="time"
                        name="endTime"
                        required
                        value={slotFormData.endTime}
                        onChange={handleSlotInputChange}
                        className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 pl-10 pr-4 text-xs font-mono font-bold text-gray-900 focus:border-[#14532d] focus:bg-white focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700">Slot Grain Intake Capacity (Kg)</label>
                  <div className="relative mt-1.5">
                    <Weight className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="number"
                      name="capacityKg"
                      required
                      min="100"
                      step="50"
                      value={slotFormData.capacityKg}
                      onChange={handleSlotInputChange}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 pl-10 pr-4 text-xs font-bold text-gray-900 focus:border-[#14532d] focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={creatingSlot || centres.length === 0}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#14532d] py-3.5 text-xs font-bold text-white shadow-md transition hover:bg-[#0f3e21] disabled:opacity-50"
                  >
                    {creatingSlot ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Publishing...
                      </>
                    ) : (
                      <>
                        <PlusCircle className="h-4 w-4 text-[#00e699]" /> Publish & Confirm Arrival Slot
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>

            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 lg:col-span-5">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div>
                  <h3 className="font-extrabold text-gray-900">Slots for {slotFormData.date}</h3>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    loadSlotsForCentreAndDate(
                      slotFormData.procurementCentreId,
                      slotFormData.date,
                    )
                  }
                  disabled={loadingSlots}
                  className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white p-1.5 text-xs text-gray-600 shadow-sm hover:bg-gray-50"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${loadingSlots ? "animate-spin" : ""}`} />
                </button>
              </div>

              <div className="mt-4 space-y-3">
                {loadingSlots ? (
                  <div className="py-12 text-center text-xs text-gray-500">Loading...</div>
                ) : existingSlots.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-gray-200 p-6 text-center text-xs text-gray-400">
                    No slots for this date
                  </div>
                ) : (
                  existingSlots.map((slot) => (
                    <div key={slot.id ?? slot.slotId} className="flex items-center justify-between rounded-2xl border border-gray-200 p-3.5">
                      <div>
                        <div className="text-xs font-bold text-gray-900">Slot #{slot.id}</div>
                        <div className="text-[11px] text-gray-500">{slot.startTime?.slice(0, 5)} - {slot.endTime?.slice(0, 5)}</div>
                      </div>
                      <div className="text-xs font-black text-[#14532d]">{slot.availableCapacityKg ?? slot.capacity} kg</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "centres" && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 max-w-3xl mx-auto"
          >
            <div className="border-b border-gray-100 pb-4">
              <h2 className="text-xl font-black text-gray-900">Register Procurement Mandi Centre</h2>
            </div>
            {centreError && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">{centreError}</div>
            )}
            <form onSubmit={handleRegisterCentre} className="mt-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-700">Centre Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={centreFormData.name}
                  onChange={handleCentreChange}
                  className="mt-1.5 w-full rounded-xl border border-gray-200 p-2.5 text-xs font-semibold"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-xs font-bold text-gray-700">Centre Code</label>
                    <input type="text" name="code" required value={centreFormData.code} onChange={handleCentreChange} className="mt-1.5 w-full rounded-xl border border-gray-200 p-2.5 text-xs font-semibold" />
                </div>
                <div>
                    <label className="text-xs font-bold text-gray-700">State</label>
                    <input type="text" name="state" required value={centreFormData.state} onChange={handleCentreChange} className="mt-1.5 w-full rounded-xl border border-gray-200 p-2.5 text-xs font-semibold" />
                </div>
              </div>
              <input type="text" name="address" required value={centreFormData.address} onChange={handleCentreChange} className="w-full rounded-xl border border-gray-200 p-2.5 text-xs font-semibold" placeholder="Address" />
              <div className="grid grid-cols-3 gap-4">
                <input type="text" name="village" required value={centreFormData.village} onChange={handleCentreChange} className="rounded-xl border border-gray-200 p-2.5 text-xs font-semibold" placeholder="Village" />
                <input type="text" name="block" required value={centreFormData.block} onChange={handleCentreChange} className="rounded-xl border border-gray-200 p-2.5 text-xs font-semibold" placeholder="Block" />
                <input type="text" name="district" required value={centreFormData.district} onChange={handleCentreChange} className="rounded-xl border border-gray-200 p-2.5 text-xs font-semibold" placeholder="District" />
              </div>
              <div className="pt-3 flex gap-3">
                <button type="button" onClick={() => setActiveTab("slots")} className="flex-1 rounded-xl border border-gray-200 py-3 text-xs font-bold text-gray-600">Cancel</button>
                <button type="submit" disabled={registeringCentre} className="flex-2 px-6 rounded-xl bg-[#14532d] py-3 text-xs font-bold text-white">Register</button>
              </div>
            </form>
          </motion.div>
        )}
      </main>
    </div>
  );
}
