import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  Clock3,
  LoaderCircle,
  Megaphone,
  PhoneCall,
  Play,
  RefreshCw,
  Search,
  SquareCheckBig,
  UserCheck,
  Users,
} from "lucide-react";
import {
  callNextFarmer,
  checkInBooking,
  completeQueueProcessing,
  getCurrentQueue,
  getWaitingQueue,
  startQueueProcessing,
} from "../../api/queueApi";
import { clearSession } from "../../utils/session";

const statusLabels = {
  WAITING: "Waiting",
  CALLED: "Called",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
};

const statusStyles = {
  WAITING: "bg-slate-100 text-slate-700",
  CALLED: "bg-amber-100 text-amber-900",
  IN_PROGRESS: "bg-emerald-100 text-emerald-900",
  COMPLETED: "bg-gray-100 text-gray-700",
};

function normaliseToken(token) {
  if (!token) return null;
  return {
    ...token,
    id: token.id || `booking-${token.bookingId}`,
    tokenLabel: `Token #${token.tokenNumber}`,
    farmerName: token.farmerName || "Unknown farmer",
    grainWeight: token.grainWeight ?? 0,
  };
}

export default function QueueManage() {
  const navigate = useNavigate();
  const [waitingQueue, setWaitingQueue] = useState([]);
  const [currentFarmer, setCurrentFarmer] = useState(null);
  const [bookingId, setBookingId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [activeAction, setActiveAction] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (message) => {
    setToastMessage(message);
    window.setTimeout(() => setToastMessage(""), 3200);
  };

  const loadQueue = useCallback(
    async (showLoader = false) => {
      if (showLoader) setIsLoading(true);
      try {
        const [waiting, current] = await Promise.all([
          getWaitingQueue(),
          getCurrentQueue(),
        ]);
        setWaitingQueue((waiting || []).map(normaliseToken));
        setCurrentFarmer(normaliseToken(current));
        setErrorMessage("");
      } catch (error) {
        if ([401, 403, 500].includes(error.response?.status)) {
          clearSession();
          navigate("/operator-login", { replace: true });
          return;
        }
        const message =
          error.response?.data?.message ||
          error.message ||
          "Unable to load the queue. Check that the backend is running.";
        setErrorMessage(message);
      } finally {
        if (showLoader) setIsLoading(false);
      }
    },
    [navigate],
  );

  useEffect(() => {
    const initialLoad = window.setTimeout(() => loadQueue(true), 0);
    const poller = window.setInterval(() => loadQueue(), 4000);
    return () => {
      window.clearTimeout(initialLoad);
      window.clearInterval(poller);
    };
  }, [loadQueue]);

  const runAction = async (actionName, action, successMessage) => {
    setActiveAction(actionName);
    try {
      await action();
      showToast(successMessage);
      await loadQueue();
    } catch (error) {
      if ([401, 403, 500].includes(error.response?.status)) {
        clearSession();
        navigate("/operator-login", { replace: true });
        return;
      }
      setErrorMessage(
        error.response?.data?.message ||
          error.message ||
          "Queue action failed.",
      );
    } finally {
      setActiveAction("");
    }
  };

  const handleCheckIn = (event) => {
    event.preventDefault();
    const parsedBookingId = Number(bookingId);
    if (!Number.isInteger(parsedBookingId) || parsedBookingId < 1) {
      setErrorMessage("Enter a valid booking ID to check in a farmer.");
      return;
    }
    runAction(
      "check-in",
      () => checkInBooking(parsedBookingId),
      `Booking ${parsedBookingId} checked in and added to WAITING.`,
    ).then(() => setBookingId(""));
  };

  const filteredWaiting = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return waitingQueue;
    return waitingQueue.filter((item) =>
      [item.farmerName, item.tokenLabel, item.bookingId, item.farmerPhone].some(
        (value) =>
          String(value ?? "")
            .toLowerCase()
            .includes(query),
      ),
    );
  }, [searchQuery, waitingQueue]);

  const actionBusy = (name) => activeAction === name;

  return (
    <div className="min-h-screen bg-[#f6f9f5] font-sans text-gray-800 antialiased">
      <header className="sticky top-0 z-20 border-b border-emerald-900/10 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-12">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/operatordashboard")}
              className="rounded-xl border border-gray-200 bg-white p-2 text-gray-600 shadow-sm hover:bg-gray-50"
              aria-label="Back to operator dashboard"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#14532d] text-white">
              <Building2 className="h-4 w-4 text-emerald-300" />
            </div>
            <div>
              <strong className="block text-base leading-tight text-[#14532d]">
                SmartProcure
              </strong>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                Operator Queue Control
              </span>
            </div>
          </div>
          <button
            onClick={() => loadQueue(true)}
            className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50"
            disabled={isLoading}
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`}
            />{" "}
            Refresh
          </button>
        </div>
      </header>

      {toastMessage && (
        <div className="fixed right-6 top-20 z-30 flex items-center gap-2 rounded-xl bg-[#14532d] px-4 py-3 text-xs font-bold text-white shadow-xl">
          <CheckCircle2 className="h-4 w-4 text-emerald-300" /> {toastMessage}
        </div>
      )}

      <main className="mx-auto max-w-7xl px-6 py-8 lg:px-12">
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700">
              <Megaphone className="h-3.5 w-3.5" /> Live queue workflow
            </p>
            <h1 className="text-3xl font-black tracking-tight text-gray-900">
              Check-in to completion
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              BOOKED → CHECKED_IN → WAITING → CALLED → IN_PROGRESS → COMPLETED
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800">
            <Clock3 className="h-3.5 w-3.5" /> Polling every 4 seconds
          </div>
        </div>

        {errorMessage && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {errorMessage}
          </div>
        )}

        <section className="grid gap-5 lg:grid-cols-[1fr_1.4fr]">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-xl bg-emerald-100 p-2 text-emerald-800">
                <UserCheck className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900">Check in booking</h2>
                <p className="text-xs text-gray-500">
                  Generates a queue token and sets WAITING.
                </p>
              </div>
            </div>
            <form onSubmit={handleCheckIn} className="flex gap-2">
              <input
                value={bookingId}
                onChange={(event) => setBookingId(event.target.value)}
                type="number"
                min="1"
                placeholder="Booking ID"
                className="min-w-0 flex-1 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm focus:border-emerald-600 focus:bg-white focus:outline-none"
              />
              <button
                disabled={actionBusy("check-in")}
                className="flex items-center gap-2 rounded-xl bg-[#14532d] px-4 py-2 text-xs font-bold text-white hover:bg-[#0f3e21] disabled:opacity-60"
              >
                {actionBusy("check-in") ? (
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                ) : (
                  <UserCheck className="h-4 w-4" />
                )}{" "}
                Check in
              </button>
            </form>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-amber-100 p-2 text-amber-800">
                  <PhoneCall className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-bold text-gray-900">
                    Current serving farmer
                  </h2>
                  <p className="text-xs text-gray-500">
                    The latest CALLED or IN_PROGRESS token.
                  </p>
                </div>
              </div>
              {currentFarmer && (
                <span
                  className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${statusStyles[currentFarmer.status]}`}
                >
                  {statusLabels[currentFarmer.status] || currentFarmer.status}
                </span>
              )}
            </div>
            {currentFarmer ? (
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <p className="text-lg font-black text-gray-900">
                    {currentFarmer.farmerName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {currentFarmer.tokenLabel} · Booking{" "}
                    {currentFarmer.bookingId} · {currentFarmer.grainWeight} kg
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {currentFarmer.status === "CALLED" && (
                    <button
                      onClick={() =>
                        runAction(
                          "start",
                          () => startQueueProcessing(currentFarmer.bookingId),
                          "Processing started.",
                        )
                      }
                      disabled={actionBusy("start")}
                      className="flex items-center gap-2 rounded-xl bg-[#14532d] px-3 py-2 text-xs font-bold text-white disabled:opacity-60"
                    >
                      <Play className="h-3.5 w-3.5" /> Start
                    </button>
                  )}
                  {currentFarmer.status === "IN_PROGRESS" && (
                    <button
                      onClick={() =>
                        runAction(
                          "complete",
                          () =>
                            completeQueueProcessing(currentFarmer.bookingId),
                          "Procurement completed. Payment can now be created.",
                        )
                      }
                      disabled={actionBusy("complete")}
                      className="flex items-center gap-2 rounded-xl bg-[#14532d] px-3 py-2 text-xs font-bold text-white disabled:opacity-60"
                    >
                      <SquareCheckBig className="h-3.5 w-3.5" /> Complete
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <p className="rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-500">
                No farmer is currently called or in progress.
              </p>
            )}
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="flex items-center gap-2 font-bold text-gray-900">
                <Users className="h-4 w-4 text-emerald-700" /> Waiting queue{" "}
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-800">
                  {waitingQueue.length}
                </span>
              </h2>
              <p className="mt-1 text-xs text-gray-500">
                Oldest farmer is selected automatically by Call Next.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search farmer or token"
                  className="rounded-xl border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-xs focus:border-emerald-600 focus:bg-white focus:outline-none"
                />
              </div>
              <button
                onClick={() =>
                  runAction(
                    "call-next",
                    callNextFarmer,
                    "Oldest waiting farmer called.",
                  )
                }
                disabled={actionBusy("call-next") || waitingQueue.length === 0}
                className="flex items-center gap-2 rounded-xl bg-amber-500 px-3 py-2 text-xs font-bold text-white hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <PhoneCall className="h-3.5 w-3.5" /> Call next
              </button>
            </div>
          </div>
          <div className="mt-4 overflow-x-auto">
            {isLoading ? (
              <div className="flex items-center justify-center gap-2 py-12 text-sm text-gray-500">
                <LoaderCircle className="h-4 w-4 animate-spin" /> Loading
                queue...
              </div>
            ) : filteredWaiting.length === 0 ? (
              <p className="rounded-xl bg-gray-50 px-4 py-10 text-center text-sm text-gray-500">
                No farmers are waiting.
              </p>
            ) : (
              <table className="w-full min-w-[620px] text-left text-sm">
                <thead className="border-b border-gray-100 text-[11px] uppercase tracking-wider text-gray-400">
                  <tr>
                    <th className="px-3 py-3">Position</th>
                    <th className="px-3 py-3">Farmer</th>
                    <th className="px-3 py-3">Booking</th>
                    <th className="px-3 py-3">Weight</th>
                    <th className="px-3 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredWaiting.map((item, index) => (
                    <tr
                      key={item.id}
                      className="border-b border-gray-50 last:border-0"
                    >
                      <td className="px-3 py-4 font-black text-emerald-800">
                        {index + 1}
                      </td>
                      <td className="px-3 py-4">
                        <strong className="block text-gray-900">
                          {item.farmerName}
                        </strong>
                        <span className="text-xs text-gray-500">
                          {item.tokenLabel} · {item.farmerPhone}
                        </span>
                      </td>
                      <td className="px-3 py-4 text-gray-600">
                        #{item.bookingId}
                      </td>
                      <td className="px-3 py-4 text-gray-600">
                        {item.grainWeight} kg
                      </td>
                      <td className="px-3 py-4">
                        <span
                          className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${statusStyles[item.status]}`}
                        >
                          {statusLabels[item.status] || item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
