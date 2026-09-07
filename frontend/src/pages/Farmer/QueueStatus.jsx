import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  LoaderCircle,
  PhoneCall,
  RefreshCw,
  Sprout,
  Truck,
  UserRound,
  Wheat,
} from "lucide-react";
import { getMyQueue } from "../../api/queueApi";

const statusCopy = {
  WAITING: {
    title: "Waiting in queue",
    detail: "The operator will call farmers in check-in order.",
    style: "bg-amber-100 text-amber-900",
  },
  CALLED: {
    title: "You have been called",
    detail: "Please proceed to the procurement operator.",
    style: "bg-blue-100 text-blue-900",
  },
  IN_PROGRESS: {
    title: "Procurement in progress",
    detail: "The operator is processing your grain now.",
    style: "bg-emerald-100 text-emerald-900",
  },
  COMPLETED: {
    title: "Procurement completed",
    detail: "Your queue journey is complete. Payment can now be created.",
    style: "bg-green-100 text-green-900",
  },
};

function getToken() {
  return (
    localStorage.getItem("FARMER_JWT") ||
    localStorage.getItem("token") ||
    localStorage.getItem("JWT_TOKEN")
  );
}

export default function TrackLiveQueue() {
  const navigate = useNavigate();
  const [bookingId, setBookingId] = useState(
    localStorage.getItem("FARMER_BOOKING_ID") || "",
  );
  const [queue, setQueue] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const loadQueue = useCallback(
    async (showLoader = true) => {
      if (!bookingId) {
        setQueue(null);
        setErrorMessage(
          "Enter your booking ID to view operator queue updates.",
        );
        return;
      }

      if (!getToken()) {
        setErrorMessage(
          "Please sign in as a farmer before checking your queue.",
        );
        return;
      }

      if (showLoader) setIsLoading(true);
      try {
        const result = await getMyQueue(Number(bookingId));
        setQueue(result || null);
        setErrorMessage(
          result
            ? ""
            : "Your booking has not been checked in by the operator yet.",
        );
      } catch (error) {
        setQueue(null);
        setErrorMessage(
          error.response?.status === 401 || error.response?.status === 403
            ? "Please sign in as the farmer who owns this booking."
            : error.response?.data?.message ||
                "Unable to load your queue status.",
        );
      } finally {
        if (showLoader) setIsLoading(false);
      }
    },
    [bookingId],
  );

  useEffect(() => {
    const initialLoad = window.setTimeout(() => loadQueue(), 0);
    const poller = window.setInterval(() => loadQueue(false), 4000);
    return () => {
      window.clearTimeout(initialLoad);
      window.clearInterval(poller);
    };
  }, [bookingId, loadQueue]);

  const handleBookingSubmit = (event) => {
    event.preventDefault();
    const parsedId = Number(bookingId);
    if (!Number.isInteger(parsedId) || parsedId < 1) {
      setErrorMessage("Enter a valid booking ID.");
      return;
    }
    localStorage.setItem("FARMER_BOOKING_ID", String(parsedId));
    loadQueue();
  };

  const status = queue ? statusCopy[queue.status] || statusCopy.WAITING : null;

  return (
    <div className="min-h-screen bg-[#f6f9f5] font-sans text-gray-800 antialiased">
      <header className="sticky top-0 z-20 border-b border-emerald-900/10 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 lg:px-12">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/farmerhome")}
              className="rounded-xl border border-gray-200 bg-white p-2 text-gray-600 shadow-sm hover:bg-gray-50"
              aria-label="Back to farmer home"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#14532d] text-white">
              <Sprout className="h-5 w-5 text-emerald-300" />
            </div>
            <div>
              <strong className="block text-base leading-tight text-[#14532d]">
                SmartProcure
              </strong>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                Farmer Queue Status
              </span>
            </div>
          </div>
          <button
            onClick={() => loadQueue()}
            disabled={isLoading}
            className="flex items-center gap-2 rounded-xl border border-emerald-900/10 bg-emerald-50 px-3 py-2 text-xs font-bold text-[#14532d] disabled:opacity-60"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8 lg:px-12">
        <div className="mb-6">
          <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700">
            <PhoneCall className="h-3.5 w-3.5" /> Operator updates
          </p>
          <h1 className="text-3xl font-black tracking-tight text-gray-900">
            Track your procurement queue
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            This page refreshes every 4 seconds while the operator moves your
            queue forward.
          </p>
        </div>

        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <form
            onSubmit={handleBookingSubmit}
            className="flex flex-col gap-3 sm:flex-row sm:items-end"
          >
            <label className="flex-1 text-xs font-bold text-gray-700">
              Booking ID
              <input
                value={bookingId}
                onChange={(event) => setBookingId(event.target.value)}
                type="number"
                min="1"
                placeholder="Enter the booking ID from your confirmation"
                className="mt-1.5 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm font-normal text-gray-900 focus:border-emerald-600 focus:bg-white focus:outline-none"
              />
            </label>
            <button className="flex items-center justify-center gap-2 rounded-xl bg-[#14532d] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#0f3e21]">
              <RefreshCw className="h-3.5 w-3.5" /> Check status
            </button>
          </form>
        </section>

        {errorMessage && (
          <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            {errorMessage}
          </div>
        )}

        {isLoading && (
          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
            <LoaderCircle className="h-4 w-4 animate-spin" /> Loading your
            queue...
          </div>
        )}

        {queue && status && (
          <section className="mt-6 space-y-5">
            <div className="rounded-3xl bg-gradient-to-br from-[#14532d] via-[#166534] to-[#0f3e21] p-6 text-white shadow-xl lg:p-8">
              <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
                <div>
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${status.style}`}
                  >
                    {status.title}
                  </span>
                  <h2 className="mt-4 text-3xl font-black">
                    Token #{queue.tokenNumber}
                  </h2>
                  <p className="mt-1 text-sm text-emerald-100">
                    {status.detail}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/15 bg-white/10 p-5 text-center">
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-emerald-200">
                    Queue status
                  </span>
                  <strong className="mt-1 block text-2xl font-black">
                    {queue.status}
                  </strong>
                </div>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <UserRound className="h-5 w-5 text-emerald-700" />
                <span className="mt-3 block text-xs text-gray-500">Farmer</span>
                <strong className="block text-gray-900">
                  {queue.farmerName}
                </strong>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <Wheat className="h-5 w-5 text-emerald-700" />
                <span className="mt-3 block text-xs text-gray-500">
                  Grain weight
                </span>
                <strong className="block text-gray-900">
                  {queue.grainWeight ?? 0} kg
                </strong>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <Truck className="h-5 w-5 text-emerald-700" />
                <span className="mt-3 block text-xs text-gray-500">
                  Booking ID
                </span>
                <strong className="block text-gray-900">
                  #{queue.bookingId}
                </strong>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <h3 className="flex items-center gap-2 font-bold text-gray-900">
                <Clock3 className="h-4 w-4 text-emerald-700" /> Operator
                timeline
              </h3>
              <div className="mt-4 grid gap-3 sm:grid-cols-4">
                {["WAITING", "CALLED", "IN_PROGRESS", "COMPLETED"].map(
                  (stage) => {
                    const stages = [
                      "WAITING",
                      "CALLED",
                      "IN_PROGRESS",
                      "COMPLETED",
                    ];
                    const reached =
                      stages.indexOf(stage) <= stages.indexOf(queue.status);
                    return (
                      <div
                        key={stage}
                        className={`rounded-xl border p-3 text-xs font-bold ${reached ? "border-emerald-200 bg-emerald-50 text-emerald-900" : "border-gray-100 bg-gray-50 text-gray-400"}`}
                      >
                        <CheckCircle2 className="mb-2 h-4 w-4" />
                        {stage}
                      </div>
                    );
                  },
                )}
              </div>
              {queue.checkInTime && (
                <p className="mt-4 text-xs text-gray-500">
                  Checked in: {new Date(queue.checkInTime).toLocaleString()}
                </p>
              )}
              {queue.calledTime && (
                <p className="mt-1 text-xs text-gray-500">
                  Called: {new Date(queue.calledTime).toLocaleString()}
                </p>
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
