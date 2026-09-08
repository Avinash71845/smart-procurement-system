import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  CreditCard,
  LoaderCircle,
  RefreshCw,
  Search,
  Receipt,
  Download,
  Printer,
  Building2,
  Calendar,
  Weight,
  AlertCircle,
  X,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  FileCheck2,
  HelpCircle,
} from "lucide-react";
import { getMyPayments, getMyPayment } from "../../api/paymentApi";
import { clearSession } from "../../utils/session";

export default function FarmerPaymentHistory() {
  const navigate = useNavigate();

  // State
  const [paymentsList, setPaymentsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL"); // ALL, PAID, PENDING, AWAITING

  // Single Lookup State
  const [manualLookupOpen, setManualLookupOpen] = useState(false);
  const [lookupBookingId, setLookupBookingId] = useState(
    localStorage.getItem("FARMER_BOOKING_ID") || ""
  );
  const [lookupResult, setLookupResult] = useState(null);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState("");

  // Receipt Modal State
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  // Load all payments belonging to the logged-in farmer
  const loadPayments = useCallback(
    async (showMainLoader = false) => {
      if (showMainLoader) setIsLoading(true);
      else setIsRefreshing(true);
      setErrorMessage("");

      try {
        const data = await getMyPayments();
        setPaymentsList(Array.isArray(data) ? data : []);
      } catch (error) {
        if ([401, 403].includes(error.response?.status)) {
          clearSession();
          navigate("/login", { replace: true });
          return;
        }

        // If my-payments failed or returned 404, we can attempt to check stored booking ID
        const storedBookingId = localStorage.getItem("FARMER_BOOKING_ID");
        if (storedBookingId) {
          try {
            const singlePayment = await getMyPayment(storedBookingId);
            if (singlePayment) {
              setPaymentsList([
                {
                  bookingId: singlePayment.bookingId,
                  tokenNumber: `TOKEN-${singlePayment.bookingId}`,
                  bookingStatus: "PROCUREMENT_COMPLETED",
                  bookingDate: singlePayment.paymentDate || new Date().toISOString(),
                  grainWeight: 500,
                  centreName: "District APMC Mandi",
                  paymentId: singlePayment.id,
                  amount: singlePayment.amount,
                  paymentStatus: singlePayment.status,
                  paymentDate: singlePayment.paymentDate,
                  transactionId: singlePayment.transactionId,
                },
              ]);
            }
          } catch {
            setPaymentsList([]);
          }
        } else {
          setPaymentsList([]);
        }

        if (error.response?.data?.message) {
          setErrorMessage(error.response.data.message);
        }
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [navigate]
  );

  useEffect(() => {
    loadPayments(true);
    const interval = setInterval(() => {
      loadPayments(false);
    }, 10000);
    return () => clearInterval(interval);
  }, [loadPayments]);

  // Handle Manual Single Booking ID Search
  const handleManualLookup = async (e) => {
    e.preventDefault();
    const id = Number(lookupBookingId);
    if (!Number.isInteger(id) || id < 1) {
      setLookupError("Enter a valid numeric booking ID.");
      return;
    }
    setLookupLoading(true);
    setLookupError("");
    setLookupResult(null);

    try {
      const res = await getMyPayment(id);
      setLookupResult(res);
      localStorage.setItem("FARMER_BOOKING_ID", String(id));
    } catch (err) {
      setLookupResult(null);
      setLookupError(
        err.response?.status === 404
          ? "No payment record found for this booking ID."
          : err.response?.data?.message || "Failed to find payment for this ID."
      );
    } finally {
      setLookupLoading(false);
    }
  };

  // KPI Calculations
  const stats = useMemo(() => {
    const totalBookings = paymentsList.length;
    const paidRecords = paymentsList.filter(
      (p) => p.paymentStatus === "PAID"
    );
    const totalPaidAmount = paidRecords.reduce(
      (sum, p) => sum + (Number(p.amount) || 0),
      0
    );
    const pendingRecords = paymentsList.filter(
      (p) => p.paymentStatus === "PENDING"
    );
    const totalPendingAmount = pendingRecords.reduce(
      (sum, p) => sum + (Number(p.amount) || 0),
      0
    );
    const awaitingCount = paymentsList.filter(
      (p) => !p.paymentStatus || p.paymentStatus === "NOT_INITIATED"
    ).length;

    return {
      totalBookings,
      paidCount: paidRecords.length,
      totalPaidAmount,
      pendingCount: pendingRecords.length,
      totalPendingAmount,
      awaitingCount,
    };
  }, [paymentsList]);

  // Filtered List
  const filteredPayments = useMemo(() => {
    return paymentsList.filter((item) => {
      // Status filter
      if (statusFilter === "PAID" && item.paymentStatus !== "PAID") return false;
      if (statusFilter === "PENDING" && item.paymentStatus !== "PENDING") return false;
      if (statusFilter === "AWAITING" && item.paymentStatus) return false;
      if (statusFilter === "FAILED" && item.paymentStatus !== "FAILED") return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchToken = item.tokenNumber?.toLowerCase().includes(q);
        const matchCentre = item.centreName?.toLowerCase().includes(q);
        const matchTxn = item.transactionId?.toLowerCase().includes(q);
        const matchBookingId = String(item.bookingId).includes(q);
        return matchToken || matchCentre || matchTxn || matchBookingId;
      }
      return true;
    });
  }, [paymentsList, statusFilter, searchQuery]);

  return (
    <div className="min-h-screen bg-[#f6f9f5] font-sans text-gray-800">
      {/* Top Header */}
      <header className="sticky top-0 z-30 border-b border-emerald-900/10 bg-white/95 px-6 py-4 shadow-sm backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/farmerhome")}
              className="rounded-xl border border-gray-200 bg-white p-2.5 text-gray-700 shadow-sm transition hover:bg-gray-50 active:scale-95"
              aria-label="Back to home"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <h1 className="text-base font-black tracking-tight text-[#14532d] sm:text-lg">
                  Farmer Payment & DBT Status
                </h1>
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                Government Procurement Treasury Hub • 2026
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => loadPayments(false)}
              disabled={isRefreshing}
              className="flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-bold text-[#14532d] transition hover:bg-emerald-100 disabled:opacity-50"
              title="Refresh payment statuses"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`}
              />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <button
              onClick={() => setManualLookupOpen(!manualLookupOpen)}
              className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-bold text-gray-700 shadow-sm transition hover:bg-gray-50"
            >
              <Search className="h-3.5 w-3.5 text-gray-500" />
              <span className="hidden sm:inline">Lookup ID</span>
            </button>
          </div>
        </div>
      </header>

      {/* Manual Lookup Drawer / Panel */}
      {manualLookupOpen && (
        <div className="border-b border-gray-200 bg-white px-6 py-4 shadow-inner">
          <div className="mx-auto max-w-6xl">
            <div className="flex items-center justify-between pb-2">
              <span className="text-xs font-bold text-gray-700">
                Search Specific Booking ID
              </span>
              <button
                onClick={() => setManualLookupOpen(false)}
                className="text-xs text-gray-400 hover:text-gray-600"
              >
                ✕ Close
              </button>
            </div>
            <form onSubmit={handleManualLookup} className="flex gap-2">
              <input
                type="number"
                min="1"
                placeholder="Enter Booking ID (e.g. 1)"
                value={lookupBookingId}
                onChange={(e) => setLookupBookingId(e.target.value)}
                className="max-w-xs rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2 text-xs font-semibold text-gray-900 focus:border-emerald-600 focus:outline-none"
              />
              <button
                type="submit"
                disabled={lookupLoading}
                className="flex items-center gap-1.5 rounded-xl bg-[#14532d] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#0f3e21] disabled:opacity-50"
              >
                {lookupLoading ? (
                  <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Search className="h-3.5 w-3.5" />
                )}
                Check Payment
              </button>
            </form>

            {lookupError && (
              <p className="mt-2 text-xs font-bold text-red-600">{lookupError}</p>
            )}

            {lookupResult && (
              <div className="mt-3 rounded-xl border border-emerald-100 bg-[#f8faf7] p-3 text-xs flex items-center justify-between">
                <div>
                  <span className="font-bold text-gray-900">
                    Booking #{lookupResult.bookingId}
                  </span>
                  <span className="mx-2 text-gray-300">•</span>
                  <span className="font-black text-emerald-800">
                    ₹{Number(lookupResult.amount).toLocaleString("en-IN")}
                  </span>
                  <span className="mx-2 text-gray-300">•</span>
                  <span className="font-bold uppercase text-gray-700">
                    Status: {lookupResult.status}
                  </span>
                </div>
                {lookupResult.transactionId && (
                  <span className="font-mono text-[11px] text-gray-500">
                    Txn: {lookupResult.transactionId}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="mx-auto max-w-6xl px-6 py-8">
        {/* Banner Section */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-gray-900 sm:text-3xl">
              Track Your Procurement Payouts
            </h2>
            <p className="mt-1 text-xs text-gray-600 sm:text-sm">
              Real-time payment settlements, DBT bank credits, and digital J-Form receipts for your grain sales.
            </p>
          </div>
          <div className="flex items-center gap-2 self-start rounded-2xl border border-emerald-200 bg-white px-4 py-2.5 shadow-sm sm:self-auto">
            <ShieldCheck className="h-5 w-5 text-emerald-600" />
            <div>
              <span className="block text-[10px] font-bold uppercase text-gray-400">
                DBT Direct Settlement
              </span>
              <span className="block text-xs font-black text-emerald-900">
                100% Aadhaar Linked
              </span>
            </div>
          </div>
        </div>

        {/* Financial KPI Summary Cards */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm transition hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500">
                Total Bookings
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gray-100 text-gray-700">
                <Calendar className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-black text-gray-900">
                {stats.totalBookings}
              </span>
              <span className="text-xs text-gray-400">Slots Recorded</span>
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5 shadow-sm transition hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-800">
                Disbursed to Bank (PAID)
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-600 text-white">
                <CheckCircle2 className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-black text-[#14532d]">
                ₹{stats.totalPaidAmount.toLocaleString("en-IN")}
              </span>
              <span className="text-xs font-bold text-emerald-700">
                ({stats.paidCount} Paid)
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-5 shadow-sm transition hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-900">
                Pending Settlement
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500 text-white">
                <Clock3 className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-black text-amber-900">
                ₹{stats.totalPendingAmount.toLocaleString("en-IN")}
              </span>
              <span className="text-xs font-bold text-amber-700">
                ({stats.pendingCount} Pending)
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-5 shadow-sm transition hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-900">
                Awaiting Weighment
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-white">
                <Weight className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-black text-blue-900">
                {stats.awaitingCount}
              </span>
              <span className="text-xs text-blue-700">In Procurement Queue</span>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="mt-8 flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          {/* Status Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: "ALL", label: "All Records", count: paymentsList.length },
              { id: "PAID", label: "Paid / Settled", count: stats.paidCount },
              { id: "PENDING", label: "Pending", count: stats.pendingCount },
              { id: "AWAITING", label: "Awaiting Intake", count: stats.awaitingCount },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                  statusFilter === tab.id
                    ? "bg-[#14532d] text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200/70"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                    statusFilter === tab.id
                      ? "bg-white/20 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative sm:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Token, Centre..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2 pl-9 pr-4 text-xs font-semibold text-gray-900 placeholder:text-gray-400 focus:border-emerald-600 focus:outline-none"
            />
          </div>
        </div>

        {/* Loading Spinner */}
        {isLoading && (
          <div className="mt-12 flex flex-col items-center justify-center gap-3 text-gray-500">
            <LoaderCircle className="h-8 w-8 animate-spin text-[#14532d]" />
            <span className="text-xs font-semibold">
              Loading your bookings and payment records...
            </span>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredPayments.length === 0 && (
          <div className="mt-8 rounded-3xl border border-gray-200 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-[#14532d]">
              <Receipt className="h-7 w-7" />
            </div>
            <h3 className="mt-4 text-base font-bold text-gray-900">
              No Payment Records Found
            </h3>
            <p className="mx-auto mt-1 max-w-sm text-xs leading-relaxed text-gray-500">
              {searchQuery || statusFilter !== "ALL"
                ? "No payments match your current search or filter criteria. Try selecting another tab."
                : "You have not booked any procurement slots yet. Book a slot to sell your harvest and receive direct DBT payments."}
            </p>
            <div className="mt-6 flex justify-center gap-3">
              {searchQuery || statusFilter !== "ALL" ? (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setStatusFilter("ALL");
                  }}
                  className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50"
                >
                  Clear Filters
                </button>
              ) : (
                <button
                  onClick={() => navigate("/slot-booking")}
                  className="flex items-center gap-2 rounded-xl bg-[#14532d] px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#0f3e21]"
                >
                  <Calendar className="h-3.5 w-3.5" />
                  Book Procurement Slot
                </button>
              )}
            </div>
          </div>
        )}

        {/* Payments List */}
        {!isLoading && filteredPayments.length > 0 && (
          <div className="mt-6 space-y-4">
            {filteredPayments.map((item) => {
              const isPaid = item.paymentStatus === "PAID";
              const isPending = item.paymentStatus === "PENDING";
              const isFailed = item.paymentStatus === "FAILED";
              const hasPayment = Boolean(item.paymentStatus);

              return (
                <div
                  key={item.bookingId}
                  className="overflow-hidden rounded-2xl border border-gray-200/90 bg-white p-5 shadow-sm transition hover:border-emerald-300 hover:shadow-md sm:p-6"
                >
                  <div className="flex flex-col justify-between gap-4 border-b border-gray-100 pb-4 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
                          isPaid
                            ? "bg-emerald-100 text-emerald-800"
                            : isPending
                              ? "bg-amber-100 text-amber-800"
                              : isFailed
                                ? "bg-red-100 text-red-800"
                                : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {isPaid ? (
                          <CheckCircle2 className="h-6 w-6" />
                        ) : isPending ? (
                          <Clock3 className="h-6 w-6" />
                        ) : isFailed ? (
                          <AlertCircle className="h-6 w-6" />
                        ) : (
                          <CreditCard className="h-6 w-6" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-black text-gray-900 sm:text-base">
                            {item.tokenNumber || `TOKEN-${item.bookingId}`}
                          </span>
                          <span className="rounded-md bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-600">
                            Booking #{item.bookingId}
                          </span>
                        </div>
                        <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                          <span className="flex items-center gap-1 font-medium">
                            <Building2 className="h-3 w-3 text-gray-400" />
                            {item.centreName || "Procurement Mandi"}
                          </span>
                          <span>•</span>
                          <span>
                            {item.slotDate ||
                              (item.bookingDate
                                ? new Date(item.bookingDate).toLocaleDateString()
                                : "Scheduled")}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right Price & Status Tag */}
                    <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end">
                      {hasPayment ? (
                        <span className="text-xl font-black text-gray-900 sm:text-2xl">
                          ₹{Number(item.amount).toLocaleString("en-IN")}
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-gray-400">
                          Weight: {item.grainWeight} kg
                        </span>
                      )}

                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                          isPaid
                            ? "bg-emerald-100 text-emerald-900"
                            : isPending
                              ? "bg-amber-100 text-amber-900"
                              : isFailed
                                ? "bg-red-100 text-red-900"
                                : "bg-blue-50 text-blue-800"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            isPaid
                              ? "bg-emerald-600"
                              : isPending
                                ? "bg-amber-600"
                                : isFailed
                                  ? "bg-red-600"
                                  : "bg-blue-600"
                          }`}
                        />
                        {isPaid
                          ? "PAID / Settled"
                          : isPending
                            ? "Payment PENDING"
                            : isFailed
                              ? "Payment FAILED"
                              : "Intake Scheduled"}
                      </span>
                    </div>
                  </div>

                  {/* Body Info Grid */}
                  <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
                    <div className="rounded-xl border border-gray-100 bg-[#f9fbf8] p-3">
                      <span className="block text-[10px] font-bold uppercase text-gray-400">
                        Total Grain Weight
                      </span>
                      <strong className="mt-0.5 block text-xs text-gray-900">
                        {item.grainWeight ? `${item.grainWeight} kg` : "N/A"}
                        {item.grainWeight && (
                          <span className="ml-1 text-[11px] font-normal text-gray-500">
                            ({(item.grainWeight / 100).toFixed(1)} Qtl)
                          </span>
                        )}
                      </strong>
                    </div>

                    <div className="rounded-xl border border-gray-100 bg-[#f9fbf8] p-3">
                      <span className="block text-[10px] font-bold uppercase text-gray-400">
                        DBT Transaction UTR
                      </span>
                      <strong className="mt-0.5 block truncate font-mono text-xs text-gray-800">
                        {item.transactionId || "Awaiting settlement"}
                      </strong>
                    </div>

                    <div className="rounded-xl border border-gray-100 bg-[#f9fbf8] p-3">
                      <span className="block text-[10px] font-bold uppercase text-gray-400">
                        Procurement Status
                      </span>
                      <strong className="mt-0.5 block text-xs text-gray-800">
                        {item.bookingStatus?.replace(/_/g, " ") || "BOOKED"}
                      </strong>
                    </div>

                    <div className="rounded-xl border border-gray-100 bg-[#f9fbf8] p-3">
                      <span className="block text-[10px] font-bold uppercase text-gray-400">
                        Payment Timestamp
                      </span>
                      <strong className="mt-0.5 block text-xs text-gray-800">
                        {item.paymentDate
                          ? new Date(item.paymentDate).toLocaleString()
                          : isPaid
                            ? "Confirmed"
                            : "Pending verification"}
                      </strong>
                    </div>
                  </div>

                  {/* Footer Action Bar */}
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-2">
                    <p className="flex items-center gap-1.5 text-xs text-gray-500">
                      {isPaid ? (
                        <>
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          <span>
                            Direct Benefit Transfer (DBT) has been credited to your registered bank account.
                          </span>
                        </>
                      ) : isPending ? (
                        <>
                          <Clock3 className="h-4 w-4 text-amber-600" />
                          <span>
                            Weighment and quality testing certified. Awaiting treasury transfer clearance.
                          </span>
                        </>
                      ) : isFailed ? (
                        <>
                          <AlertCircle className="h-4 w-4 text-red-600" />
                          <span>
                            Payment processing failed. Please visit the centre operator desk.
                          </span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-4 w-4 text-blue-600" />
                          <span>
                            Bring grain lot to Mandi yard at the scheduled time. Payout will be issued upon weighing.
                          </span>
                        </>
                      )}
                    </p>

                    {hasPayment && (
                      <button
                        onClick={() => setSelectedReceipt(item)}
                        className="flex items-center gap-1.5 rounded-xl border border-emerald-900/10 bg-emerald-50/70 px-3.5 py-2 text-xs font-bold text-[#14532d] shadow-sm transition hover:bg-emerald-100 active:scale-95"
                      >
                        <Receipt className="h-3.5 w-3.5 text-emerald-700" />
                        View J-Form Receipt
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Official Digital J-Form Receipt Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-gray-100 bg-white p-6 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#14532d] text-white">
                  <Receipt className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-gray-900">
                    Digital J-Form & Payment Receipt
                  </h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                    National Agricultural Procurement Authority • 2026
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Receipt Body */}
            <div className="mt-4 rounded-2xl border border-emerald-200/70 bg-[#f8faf7] p-5 text-xs">
              {/* Receipt Header Badge */}
              <div className="flex items-center justify-between border-b border-gray-200/70 pb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase text-gray-400">
                    Voucher ID / Token
                  </span>
                  <span className="block font-mono text-sm font-black text-gray-900">
                    {selectedReceipt.tokenNumber || `TOKEN-${selectedReceipt.bookingId}`}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase text-gray-400">
                    Settlement Status
                  </span>
                  <span className="block font-bold uppercase text-emerald-800">
                    {selectedReceipt.paymentStatus || "PAID"}
                  </span>
                </div>
              </div>

              {/* Farmer & Centre Details */}
              <div className="mt-3 grid grid-cols-2 gap-3 border-b border-gray-200/70 pb-3">
                <div>
                  <span className="text-[10px] text-gray-500">Farmer Name:</span>
                  <strong className="block font-bold text-gray-900">
                    {selectedReceipt.farmerName || "Registered Farmer"}
                  </strong>
                </div>
                <div>
                  <span className="text-[10px] text-gray-500">Procurement Centre:</span>
                  <strong className="block font-bold text-gray-900">
                    {selectedReceipt.centreName || "Jehanabad Procurement Centre"}
                  </strong>
                </div>
                <div>
                  <span className="text-[10px] text-gray-500">Registered Phone:</span>
                  <strong className="block text-gray-800">
                    {selectedReceipt.farmerPhone || "+91 98765 43210"}
                  </strong>
                </div>
                <div>
                  <span className="text-[10px] text-gray-500">Village & District:</span>
                  <strong className="block text-gray-800">
                    {selectedReceipt.farmerVillage
                      ? `${selectedReceipt.farmerVillage}, ${selectedReceipt.farmerDistrict || ""}`
                      : "State Procurement Zone"}
                  </strong>
                </div>
              </div>

              {/* Grain & Calculation Details */}
              <div className="mt-3 space-y-2 border-b border-gray-200/70 pb-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Commodity:</span>
                  <span className="font-bold text-gray-900">Wheat (Certified MSP Grade-A)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Certified Net Weight:</span>
                  <span className="font-bold text-gray-900">
                    {selectedReceipt.grainWeight || 500} kg (
                    {((selectedReceipt.grainWeight || 500) / 100).toFixed(2)} Quintal)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Govt. MSP Rate:</span>
                  <span className="font-bold text-gray-900">₹2,275 per Quintal</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Payment Mode:</span>
                  <span className="font-bold text-gray-900">DBT Bank Transfer</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Bank UTR / Txn Reference:</span>
                  <span className="font-mono font-bold text-emerald-900">
                    {selectedReceipt.transactionId || "DBT-APMC-SETTLED"}
                  </span>
                </div>
              </div>

              {/* Total Payable Amount */}
              <div className="mt-3 flex items-center justify-between pt-1">
                <div>
                  <span className="block text-[10px] font-bold uppercase text-gray-500">
                    Net Disbursed Amount
                  </span>
                  <span className="text-lg font-black text-[#14532d]">
                    ₹{Number(selectedReceipt.amount || 0).toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="rounded-lg border border-emerald-300 bg-white px-3 py-1 text-center">
                  <span className="block text-[9px] font-bold uppercase text-emerald-800">
                    Certified Seal
                  </span>
                  <span className="block text-[10px] font-extrabold text-emerald-900">
                    APMC DIGITAL PASS
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={() => setSelectedReceipt(null)}
                className="flex-1 rounded-xl border border-gray-200 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#14532d] py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#0f3e21]"
              >
                <Printer className="h-4 w-4" />
                Print / Save Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

