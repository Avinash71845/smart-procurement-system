import { useState } from "react";
import {
  Building2,
  PlusCircle,
  X,
  Clock,
  Calendar,
  Weight,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";

export default function OperatorHeaderWithSlotModal() {
  const [isSlotModalOpen, setIsSlotModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  // Form State initialized with the exact required schema
  const [slotData, setSlotData] = useState({
    procurementCentreId: 2,
    date: "2026-09-12",
    startTime: "09:00:00",
    endTime: "11:00:00",
    capacityKg: 800,
  });

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

  const handleTimeChange = (e) => {
    const { name, value } = e.target;
    // Ensures HH:MM:SS format
    const formatted = value.length === 5 ? `${value}:00` : value;
    setSlotData((prev) => ({ ...prev, [name]: formatted }));
  };

  const handleCreateSlot = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage(null);

    const payload = {
      procurementCentreId: Number(slotData.procurementCentreId),
      date: slotData.date,
      startTime: slotData.startTime,
      endTime: slotData.endTime,
      capacityKg: Number(slotData.capacityKg),
    };

    const token =
      localStorage.getItem("OPERATOR_JWT") ||
      localStorage.getItem("JWT_TOKEN") ||
      "";

    try {
      const response = await fetch("/api/slots", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const resData = await response.json();
      setStatusMessage({
        type: "success",
        text: `Slot created successfully! (ID: ${resData.id || "Assigned"})`,
      });
      setTimeout(() => {
        setIsSlotModalOpen(false);
        setStatusMessage(null);
      }, 1500);
    } catch (err) {
      setStatusMessage({
        type: "error",
        text: err.message || "Unable to create slot.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Top Header Bar */}
      <header className="border-b border-gray-200 bg-white px-6 py-4 shadow-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#14532d] text-white">
              <Building2 className="h-5 w-5 text-[#00e699]" />
            </div>
            <div>
              <h1 className="text-base font-extrabold text-[#14532d]">
                Mandi Admin Portal
              </h1>
              <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                Procurement Centre Management
              </p>
            </div>
          </div>

          {/* New Create Slot Button */}
          <button
            type="button"
            onClick={() => setIsSlotModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-[#14532d] px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-[#0f3e21]"
          >
            <PlusCircle className="h-4 w-4 text-[#00e699]" />
            Create Slot
          </button>
        </div>
      </header>

      {/* Create Slot Modal */}
      {isSlotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-3xl border border-gray-100 bg-white p-6 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-base font-black text-gray-900">
                  Create Procurement Slot
                </h3>
                <p className="text-[11px] text-gray-500">POST /api/slots</p>
              </div>
              <button
                type="button"
                onClick={() => setIsSlotModalOpen(false)}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Status Alert */}
            {statusMessage && (
              <div
                className={`mt-4 flex items-center gap-2 rounded-xl p-3 text-xs ${
                  statusMessage.type === "success"
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    : "bg-red-50 text-red-800 border border-red-200"
                }`}
              >
                {statusMessage.type === "success" ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
                )}
                <span>{statusMessage.text}</span>
              </div>
            )}

            {/* Modal Form */}
            <form onSubmit={handleCreateSlot} className="mt-4 space-y-3.5">
              <div>
                <label className="text-xs font-bold text-gray-700">
                  Procurement Centre ID
                </label>
                <input
                  type="number"
                  name="procurementCentreId"
                  required
                  min="1"
                  value={slotData.procurementCentreId}
                  onChange={handleInputChange}
                  className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3 py-2 text-xs font-semibold text-gray-900 focus:border-[#14532d] focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700">Date</label>
                <div className="relative mt-1">
                  <Calendar className="pointer-events-none absolute left-3 top-2.5 h-3.5 w-3.5 text-gray-400" />
                  <input
                    type="date"
                    name="date"
                    required
                    value={slotData.date}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2 pl-9 pr-3 text-xs font-semibold text-gray-900 focus:border-[#14532d] focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-700">
                    Start Time
                  </label>
                  <div className="relative mt-1">
                    <Clock className="pointer-events-none absolute left-3 top-2.5 h-3.5 w-3.5 text-gray-400" />
                    <input
                      type="time"
                      step="1"
                      name="startTime"
                      required
                      value={slotData.startTime.slice(0, 5)}
                      onChange={handleTimeChange}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2 pl-9 pr-3 text-xs font-mono font-semibold text-gray-900 focus:border-[#14532d] focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700">
                    End Time
                  </label>
                  <div className="relative mt-1">
                    <Clock className="pointer-events-none absolute left-3 top-2.5 h-3.5 w-3.5 text-gray-400" />
                    <input
                      type="time"
                      step="1"
                      name="endTime"
                      required
                      value={slotData.endTime.slice(0, 5)}
                      onChange={handleTimeChange}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2 pl-9 pr-3 text-xs font-mono font-semibold text-gray-900 focus:border-[#14532d] focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700">
                  Capacity (Kg)
                </label>
                <div className="relative mt-1">
                  <Weight className="pointer-events-none absolute left-3 top-2.5 h-3.5 w-3.5 text-gray-400" />
                  <input
                    type="number"
                    name="capacityKg"
                    required
                    min="100"
                    step="50"
                    value={slotData.capacityKg}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2 pl-9 pr-3 text-xs font-bold text-gray-900 focus:border-[#14532d] focus:bg-white focus:outline-none"
                  />
                </div>
                <span className="mt-1 block text-[10px] text-gray-400">
                  {(slotData.capacityKg / 100).toFixed(1)} Quintals
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setIsSlotModalOpen(false)}
                  className="flex-1 rounded-xl border border-gray-200 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#14532d] py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#0f3e21] disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving...
                    </>
                  ) : (
                    "Confirm Slot"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
