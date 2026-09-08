import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  Calendar,
  CheckCircle2,
  Clock3,
  CreditCard,
  Edit3,
  ExternalLink,
  Filter,
  IndianRupee,
  Landmark,
  LoaderCircle,
  Lock,
  MessageSquare,
  Phone,
  Printer,
  RefreshCw,
  Search,
  Send,
  ShieldCheck,
  TrendingUp,
  User,
  Users,
  Weight,
  X,
  AlertTriangle,
  FileSpreadsheet,
} from "lucide-react";
import {
  getBookedFarmers,
  getOperatorPaymentSummary,
  givePayment,
  updatePaymentStatus,
} from "../../api/paymentApi";
import { clearSession } from "../../utils/session";

// Standard official Govt MSP rate per quintal (₹2,585 per 100kg = ₹25.85 per kg)
const DEFAULT_MSP_RATE_PER_QTL = 2585;

export default function PaymentPushDbtSync() {
  const navigate = useNavigate();

  // Roster & Summary Data
  const [farmersList, setFarmersList] = useState([]);
  const [summaryData, setSummaryData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL"); // ALL, READY, PAID, PENDING, FAILED

  // Give Payment Modal State
  const [givePaymentModalOpen, setGivePaymentModalOpen] = useState(false);
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [mspRate, setMspRate] = useState(DEFAULT_MSP_RATE_PER_QTL);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentChannel, setPaymentChannel] = useState("DBT");
  const [transactionId, setTransactionId] = useState("");
  const [authPin, setAuthPin] = useState("2026");
  const [paymentActionType, setPaymentActionType] = useState("PAID"); // PAID or PENDING
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);

  // Update Existing Payment Modal State
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [updateFarmer, setUpdateFarmer] = useState(null);
  const [updateStatus, setUpdateStatus] = useState("PAID");
  const [updateTxnId, setUpdateTxnId] = useState("");
  const [updateAmount, setUpdateAmount] = useState("");
  const [isSubmittingUpdate, setIsSubmittingUpdate] = useState(false);

  // Print Voucher Modal State
  const [voucherModalOpen, setVoucherModalOpen] = useState(false);
  const [voucherData, setVoucherData] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  // Load All Booked Farmers & Financial Summary
  const loadRosterData = useCallback(
    async (showMainLoader = false) => {
      if (showMainLoader) setIsLoading(true);
      else setIsRefreshing(true);
      setErrorMessage("");

      try {
        const [roster, summary] = await Promise.all([
          getBookedFarmers(),
          getOperatorPaymentSummary().catch(() => null),
        ]);

        setFarmersList(Array.isArray(roster) ? roster : []);
        if (summary) setSummaryData(summary);
      } catch (error) {
        if ([401, 403].includes(error.response?.status)) {
          clearSession();
          navigate("/operator-login", { replace: true });
          return;
        }
        setErrorMessage(
          error.response?.data?.message ||
            error.message ||
            "Unable to load booked farmers. Ensure backend is running."
        );
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [navigate]
  );

  useEffect(() => {
    loadRosterData(true);
    const interval = setInterval(() => {
      loadRosterData(false);
    }, 10000);
    return () => clearInterval(interval);
  }, [loadRosterData]);

  // Financial Metrics
  const metrics = useMemo(() => {
    const totalFarmers = farmersList.length;
    const paidList = farmersList.filter((f) => f.paymentStatus === "PAID");
    const totalPaidAmount = paidList.reduce(
      (sum, f) => sum + (Number(f.amount) || 0),
      0
    );
    const pendingList = farmersList.filter(
      (f) => f.paymentStatus === "PENDING"
    );
    const totalPendingAmount = pendingList.reduce(
      (sum, f) => sum + (Number(f.amount) || 0),
      0
    );
    const readyList = farmersList.filter((f) => !f.paymentStatus);

    return {
      totalFarmers: summaryData?.totalBookedFarmers ?? totalFarmers,
      paidCount: summaryData?.paidCount ?? paidList.length,
      totalPaidAmount: summaryData?.totalPaidAmount ?? totalPaidAmount,
      pendingCount: summaryData?.pendingCount ?? pendingList.length,
      totalPendingAmount: summaryData?.totalPendingAmount ?? totalPendingAmount,
      readyCount: readyList.length,
    };
  }, [farmersList, summaryData]);

  // Filtered Roster
  const filteredRoster = useMemo(() => {
    return farmersList.filter((f) => {
      // Tab filter
      if (statusFilter === "PAID" && f.paymentStatus !== "PAID") return false;
      if (statusFilter === "PENDING" && f.paymentStatus !== "PENDING") return false;
      if (statusFilter === "READY" && f.paymentStatus) return false;
      if (statusFilter === "FAILED" && f.paymentStatus !== "FAILED") return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = f.farmerName?.toLowerCase().includes(q);
        const matchPhone = f.farmerPhone?.toLowerCase().includes(q);
        const matchToken = f.tokenNumber?.toLowerCase().includes(q);
        const matchBookingId = String(f.bookingId).includes(q);
        const matchVillage = f.farmerVillage?.toLowerCase().includes(q);
        return matchName || matchPhone || matchToken || matchBookingId || matchVillage;
      }
      return true;
    });
  }, [farmersList, statusFilter, searchQuery]);

  // Open "Give Payment" Modal
  const openGivePaymentModal = (farmer) => {
    setSelectedFarmer(farmer);
    const weightKg = Number(farmer.grainWeight) || 500;
    const calculated = Math.round((weightKg / 100) * DEFAULT_MSP_RATE_PER_QTL);
    setMspRate(DEFAULT_MSP_RATE_PER_QTL);
    setPaymentAmount(String(calculated));
    setPaymentChannel("DBT");
    const autoUtr = `DBT-APMC-${Math.floor(100000 + Math.random() * 900000)}`;
    setTransactionId(autoUtr);
    setPaymentActionType("PAID");
    setGivePaymentModalOpen(true);
  };

  // Re-calculate amount when weight or MSP rate changes in modal
  const handleMspRateChange = (newRate) => {
    const rate = Number(newRate) || 0;
    setMspRate(rate);
    const weightKg = Number(selectedFarmer?.grainWeight) || 500;
    const calculated = Math.round((weightKg / 100) * rate);
    setPaymentAmount(String(calculated));
  };

  // Execute "Give Payment"
  const handleExecuteGivePayment = async (e) => {
    e.preventDefault();
    if (!selectedFarmer) return;
    const amt = Number(paymentAmount);
    if (!amt || amt <= 0) {
      alert("Enter a valid payment amount.");
      return;
    }

    setIsSubmittingPayment(true);
    try {
      await givePayment(
        selectedFarmer.bookingId,
        amt,
        paymentActionType,
        transactionId.trim()
      );

      setGivePaymentModalOpen(false);
      showToast(
        paymentActionType === "PAID"
          ? `₹${amt.toLocaleString("en-IN")} Disbursed via DBT to ${selectedFarmer.farmerName}! Txn: ${transactionId}`
          : `Payment voucher of ₹${amt.toLocaleString("en-IN")} saved as PENDING for ${selectedFarmer.farmerName}.`
      );
      loadRosterData(false);
    } catch (err) {
      alert(
        err.response?.data?.message ||
          err.message ||
          "Failed to disburse payment. Please check session."
      );
    } finally {
      setIsSubmittingPayment(false);
    }
  };

  // Open "Update Payment" Modal
  const openUpdateModal = (farmer) => {
    setUpdateFarmer(farmer);
    setUpdateStatus(farmer.paymentStatus || "PAID");
    setUpdateTxnId(farmer.transactionId || "");
    setUpdateAmount(farmer.amount ? String(farmer.amount) : "");
    setUpdateModalOpen(true);
  };

  // Execute "Update Payment"
  const handleExecuteUpdate = async (e) => {
    e.preventDefault();
    if (!updateFarmer?.paymentId) {
      alert("This booking has no active payment record to update. Use 'Give Payment' instead.");
      return;
    }

    setIsSubmittingUpdate(true);
    try {
      await updatePaymentStatus(
        updateFarmer.paymentId,
        updateStatus,
        updateTxnId.trim(),
        updateAmount ? Number(updateAmount) : null
      );

      setUpdateModalOpen(false);
      showToast(`Payment #${updateFarmer.paymentId} updated to ${updateStatus}!`);
      loadRosterData(false);
    } catch (err) {
      alert(err.response?.data?.message || err.message || "Failed to update payment status.");
    } finally {
      setIsSubmittingUpdate(false);
    }
  };

  // Open Voucher Print Modal
  const openVoucherModal = (farmer) => {
    setVoucherData(farmer);
    setVoucherModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#f4f7f4] font-sans text-gray-800 antialiased selection:bg-emerald-200 selection:text-emerald-900">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-4 right-6 z-50 flex items-center gap-2.5 rounded-2xl border border-emerald-500/40 bg-[#0d4624] px-4 py-3 text-xs font-bold text-white shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 className="h-4 w-4 text-[#00e699]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <header className="sticky top-0 z-30 border-b border-emerald-900/10 bg-white/95 px-6 py-4 shadow-sm backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/operatordashboard")}
              className="rounded-xl border border-gray-200 bg-white p-2.5 text-gray-700 shadow-sm transition hover:bg-gray-50 active:scale-95"
              aria-label="Back to Operator Dashboard"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <h1 className="text-base font-black tracking-tight text-[#14532d] sm:text-lg">
                  Mandi Payment & DBT Settlement Desk
                </h1>
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                Authorized APMC Operator Portal • SIH 26032
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => loadRosterData(false)}
              disabled={isRefreshing}
              className="flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2 text-xs font-bold text-[#14532d] shadow-sm transition hover:bg-emerald-100 disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Refresh Roster</span>
            </button>
            <button
              onClick={() => navigate("/operatordashboard")}
              className="hidden sm:flex items-center gap-1.5 rounded-xl bg-[#14532d] px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#0f3e21]"
            >
              <Building2 className="h-3.5 w-3.5" />
              Operator Console
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Banner Section */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-gray-900 sm:text-3xl">
              Booked Farmers Payment Management
            </h2>
            <p className="mt-1 text-xs text-gray-600 sm:text-sm">
              Calculate MSP values, disburse DBT payments, record bank UTR numbers, and maintain audited digital J-Forms.
            </p>
          </div>
          <div className="flex items-center gap-2 self-start rounded-2xl border border-emerald-200 bg-white px-4 py-2.5 shadow-sm sm:self-auto">
            <Landmark className="h-5 w-5 text-emerald-700" />
            <div>
              <span className="block text-[10px] font-bold uppercase text-gray-400">
                Treasury Settlement Pool
              </span>
              <span className="block text-xs font-black text-emerald-900">
                Mandi APMC Cash Desk Active
              </span>
            </div>
          </div>
        </div>

        {/* Financial & Operational KPI Cards */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm transition hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500">Booked Farmers</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gray-100 text-gray-700">
                <Users className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-black text-gray-900">{metrics.totalFarmers}</span>
              <span className="text-xs text-gray-400">Farmers in Roster</span>
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5 shadow-sm transition hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-800">Payments Disbursed (PAID)</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-600 text-white">
                <CheckCircle2 className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-black text-[#14532d]">
                ₹{metrics.totalPaidAmount.toLocaleString("en-IN")}
              </span>
              <span className="text-xs font-bold text-emerald-700">({metrics.paidCount} Cleared)</span>
            </div>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-5 shadow-sm transition hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-900">Pending Settlements</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500 text-white">
                <Clock3 className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-black text-amber-900">
                ₹{metrics.totalPendingAmount.toLocaleString("en-IN")}
              </span>
              <span className="text-xs font-bold text-amber-700">({metrics.pendingCount} Waiting)</span>
            </div>
          </div>

          <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-5 shadow-sm transition hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-900">Needs Payment Issued</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-white">
                <IndianRupee className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-black text-blue-900">{metrics.readyCount}</span>
              <span className="text-xs text-blue-700">Awaiting Disbursement</span>
            </div>
          </div>
        </div>

        {/* Filter Tabs & Search Bar */}
        <div className="mt-8 flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          {/* Status Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: "ALL", label: "All Booked Farmers", count: farmersList.length },
              { id: "READY", label: "Needs Payment", count: metrics.readyCount },
              { id: "PENDING", label: "Pending Approval", count: metrics.pendingCount },
              { id: "PAID", label: "Paid / Settled", count: metrics.paidCount },
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
          <div className="relative sm:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Farmer, Mobile, Token..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2 pl-9 pr-4 text-xs font-semibold text-gray-900 placeholder:text-gray-400 focus:border-emerald-600 focus:outline-none"
            />
          </div>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-bold text-red-800">
            {errorMessage}
          </div>
        )}

        {/* Loading Spinner */}
        {isLoading && (
          <div className="mt-12 flex flex-col items-center justify-center gap-3 text-gray-500">
            <LoaderCircle className="h-8 w-8 animate-spin text-[#14532d]" />
            <span className="text-xs font-semibold">Loading booked farmers roster...</span>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredRoster.length === 0 && (
          <div className="mt-8 rounded-3xl border border-gray-200 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-[#14532d]">
              <FileSpreadsheet className="h-7 w-7" />
            </div>
            <h3 className="mt-4 text-base font-bold text-gray-900">No Booked Farmers In Filter</h3>
            <p className="mx-auto mt-1 max-w-sm text-xs text-gray-500">
              {searchQuery || statusFilter !== "ALL"
                ? "No farmers matched your current search or status filter. Try clearing filters."
                : "No farmer bookings have been recorded yet in this Mandi Procurement centre."}
            </p>
            {(searchQuery || statusFilter !== "ALL") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("ALL");
                }}
                className="mt-4 rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}

        {/* Booked Farmers Table & Roster */}
        {!isLoading && filteredRoster.length > 0 && (
          <div className="mt-6 space-y-4">
            {filteredRoster.map((farmer) => {
              const isPaid = farmer.paymentStatus === "PAID";
              const isPending = farmer.paymentStatus === "PENDING";
              const isFailed = farmer.paymentStatus === "FAILED";
              const hasPayment = Boolean(farmer.paymentStatus);
              const weightKg = Number(farmer.grainWeight) || 500;
              const suggestedMspAmount = Math.round((weightKg / 100) * DEFAULT_MSP_RATE_PER_QTL);

              return (
                <div
                  key={farmer.bookingId}
                  className="rounded-2xl border border-gray-200/90 bg-white p-5 shadow-sm transition hover:border-emerald-300 hover:shadow-md"
                >
                  <div className="flex flex-col justify-between gap-4 border-b border-gray-100 pb-4 lg:flex-row lg:items-center">
                    {/* Left Farmer Details */}
                    <div className="flex items-start gap-3.5">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-[#14532d]">
                        <User className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-sm font-extrabold text-gray-900 sm:text-base">
                            {farmer.farmerName || "Farmer"}
                          </h3>
                          <span className="font-mono text-xs font-bold text-emerald-800">
                            ({farmer.farmerPhone || "N/A"})
                          </span>
                          <span className="rounded-md bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-600">
                            Booking #{farmer.bookingId}
                          </span>
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                          <span className="font-mono font-bold text-gray-800">
                            Token: {farmer.tokenNumber || `TKN-${farmer.bookingId}`}
                          </span>
                          <span>•</span>
                          <span>
                            {farmer.farmerVillage
                              ? `${farmer.farmerVillage}, ${farmer.farmerDistrict || ""}`
                              : "Registered Zone"}
                          </span>
                          <span>•</span>
                          <span>
                            {farmer.slotDate
                              ? `Slot: ${farmer.slotDate}`
                              : farmer.bookingDate
                                ? new Date(farmer.bookingDate).toLocaleDateString()
                                : "Today"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right Payment & Weight Stats */}
                    <div className="flex flex-wrap items-center justify-between gap-3 lg:flex-col lg:items-end">
                      <div className="text-left lg:text-right">
                        <span className="block text-[10px] font-bold uppercase text-gray-400">
                          {hasPayment ? "Disbursed Amount" : "Est. MSP Payout"}
                        </span>
                        <span className="text-xl font-black text-gray-900 sm:text-2xl">
                          ₹
                          {hasPayment
                            ? Number(farmer.amount).toLocaleString("en-IN")
                            : suggestedMspAmount.toLocaleString("en-IN")}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                            isPaid
                              ? "bg-emerald-100 text-emerald-900"
                              : isPending
                                ? "bg-amber-100 text-amber-900"
                                : isFailed
                                  ? "bg-red-100 text-red-900"
                                  : "bg-blue-50 text-blue-900"
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
                              ? "PENDING Transfer"
                              : isFailed
                                ? "Payment FAILED"
                                : "Payment NOT ISSUED"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Body Grid: Weighment & Transaction Details */}
                  <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <div className="rounded-xl border border-gray-100 bg-[#f9fbf8] p-3 text-xs">
                      <span className="block text-[10px] font-bold uppercase text-gray-400">
                        Intake Grain Weight
                      </span>
                      <strong className="mt-0.5 block font-bold text-gray-900">
                        {weightKg} kg ({(weightKg / 100).toFixed(2)} Qtl)
                      </strong>
                    </div>

                    <div className="rounded-xl border border-gray-100 bg-[#f9fbf8] p-3 text-xs">
                      <span className="block text-[10px] font-bold uppercase text-gray-400">
                        Procurement Centre
                      </span>
                      <strong className="mt-0.5 block truncate text-gray-800">
                        {farmer.centreName || "Jehanabad APMC"}
                      </strong>
                    </div>

                    <div className="rounded-xl border border-gray-100 bg-[#f9fbf8] p-3 text-xs">
                      <span className="block text-[10px] font-bold uppercase text-gray-400">
                        Transaction ID / UTR
                      </span>
                      <strong className="mt-0.5 block truncate font-mono text-gray-800">
                        {farmer.transactionId || "Pending disbursement"}
                      </strong>
                    </div>

                    <div className="rounded-xl border border-gray-100 bg-[#f9fbf8] p-3 text-xs">
                      <span className="block text-[10px] font-bold uppercase text-gray-400">
                        Payment Timestamp
                      </span>
                      <strong className="mt-0.5 block text-gray-800">
                        {farmer.paymentDate
                          ? new Date(farmer.paymentDate).toLocaleString()
                          : isPaid
                            ? "Settled"
                            : "Not Settled"}
                      </strong>
                    </div>
                  </div>

                  {/* Bottom Action Bar */}
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-2">
                    <span className="text-xs text-gray-500">
                      Booking Status:{" "}
                      <strong className="text-gray-700 uppercase">
                        {farmer.bookingStatus?.replace(/_/g, " ") || "BOOKED"}
                      </strong>
                    </span>

                    <div className="flex flex-wrap items-center gap-2">
                      {/* Give Payment Button (If no payment or not paid) */}
                      {!isPaid && (
                        <button
                          onClick={() => openGivePaymentModal(farmer)}
                          className="flex items-center gap-1.5 rounded-xl bg-[#14532d] px-3.5 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-[#0f3e21] active:scale-95"
                        >
                          <Send className="h-3.5 w-3.5 text-[#00e699]" />
                          Give / Disburse Payment
                        </button>
                      )}

                      {/* Update Status Button */}
                      {hasPayment && (
                        <button
                          onClick={() => openUpdateModal(farmer)}
                          className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-bold text-gray-700 shadow-sm transition hover:bg-gray-50"
                        >
                          <Edit3 className="h-3.5 w-3.5 text-gray-500" />
                          Update Status
                        </button>
                      )}

                      {/* Print Voucher / J-Form */}
                      {hasPayment && (
                        <button
                          onClick={() => openVoucherModal(farmer)}
                          className="flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-bold text-[#14532d] transition hover:bg-emerald-100"
                        >
                          <Printer className="h-3.5 w-3.5 text-emerald-700" />
                          Print Voucher
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* MODAL 1: Give Payment to Farmer */}
      {givePaymentModalOpen && selectedFarmer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="relative max-h-[95vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-gray-100 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2 text-[#14532d]">
                <Landmark className="h-5 w-5" />
                <h3 className="font-extrabold text-gray-900">Disburse Farmer Payment & Settle DBT</h3>
              </div>
              <button
                onClick={() => setGivePaymentModalOpen(false)}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleExecuteGivePayment} className="mt-4 space-y-4">
              {/* Farmer Snapshot Info */}
              <div className="rounded-2xl border border-emerald-100 bg-[#f8faf7] p-4 text-xs space-y-2">
                <div className="flex justify-between border-b border-gray-200/60 pb-1.5">
                  <span className="text-gray-500">Farmer Name:</span>
                  <span className="font-bold text-gray-900">{selectedFarmer.farmerName}</span>
                </div>
                <div className="flex justify-between border-b border-gray-200/60 pb-1.5">
                  <span className="text-gray-500">Registered Phone:</span>
                  <span className="font-bold text-gray-900">{selectedFarmer.farmerPhone}</span>
                </div>
                <div className="flex justify-between border-b border-gray-200/60 pb-1.5">
                  <span className="text-gray-500">Token & Booking:</span>
                  <span className="font-mono font-bold text-emerald-800">
                    {selectedFarmer.tokenNumber} (ID #{selectedFarmer.bookingId})
                  </span>
                </div>
                <div className="flex justify-between border-b border-gray-200/60 pb-1.5">
                  <span className="text-gray-500">Certified Weight:</span>
                  <span className="font-bold text-gray-900">
                    {selectedFarmer.grainWeight} kg ({((selectedFarmer.grainWeight || 500) / 100).toFixed(2)} Quintal)
                  </span>
                </div>
              </div>

              {/* MSP Calculation Inputs */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-[11px] font-bold text-gray-700">
                    Govt MSP Rate (₹/Quintal)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={mspRate}
                    onChange={(e) => handleMspRateChange(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-bold text-gray-900 focus:border-emerald-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-700">
                    Total Payable Amount (₹)
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-emerald-300 bg-emerald-50/40 px-3 py-2 text-sm font-black text-[#14532d] focus:border-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* Payment Mode */}
              <div>
                <label className="text-[11px] font-bold text-gray-700">Payment Disbursement Mode</label>
                <div className="mt-1.5 grid grid-cols-3 gap-2 text-xs">
                  {["DBT", "NEFT/RTGS", "CASH"].map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setPaymentChannel(mode)}
                      className={`rounded-xl border py-2 font-bold transition ${
                        paymentChannel === mode
                          ? "border-[#14532d] bg-[#14532d] text-white"
                          : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              {/* Transaction / UTR ID */}
              <div>
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-gray-700">Bank UTR / Transaction ID</label>
                  <button
                    type="button"
                    onClick={() => {
                      const rand = `DBT-APMC-${Math.floor(100000 + Math.random() * 900000)}`;
                      setTransactionId(rand);
                    }}
                    className="text-[10px] font-bold text-emerald-700 hover:underline"
                  >
                    ⚡ Generate New UTR
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  placeholder="e.g. DBT-APMC-981245"
                  className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-mono font-bold text-gray-900 focus:border-emerald-600 focus:outline-none"
                />
              </div>

              {/* Action Selection: Disburse as PAID or Save as PENDING */}
              <div className="space-y-2 pt-1">
                <label className="text-[11px] font-bold text-gray-700">Select Settlement Action</label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <label
                    className={`flex cursor-pointer items-center gap-2 rounded-xl border p-2.5 transition ${
                      paymentActionType === "PAID"
                        ? "border-[#14532d] bg-emerald-50/70 text-[#14532d]"
                        : "border-gray-200 bg-white text-gray-700"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentActionType"
                      value="PAID"
                      checked={paymentActionType === "PAID"}
                      onChange={() => setPaymentActionType("PAID")}
                      className="accent-[#14532d]"
                    />
                    <span className="font-bold">Disburse as PAID</span>
                  </label>

                  <label
                    className={`flex cursor-pointer items-center gap-2 rounded-xl border p-2.5 transition ${
                      paymentActionType === "PENDING"
                        ? "border-amber-500 bg-amber-50/70 text-amber-900"
                        : "border-gray-200 bg-white text-gray-700"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentActionType"
                      value="PENDING"
                      checked={paymentActionType === "PENDING"}
                      onChange={() => setPaymentActionType("PENDING")}
                      className="accent-amber-600"
                    />
                    <span className="font-bold">Save as PENDING</span>
                  </label>
                </div>
              </div>

              {/* Officer PIN */}
              <div>
                <label className="text-xs font-bold text-gray-700">Mandi Operator Passcode</label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-2.5 h-3.5 w-3.5 text-gray-400" />
                  <input
                    type="password"
                    maxLength={6}
                    required
                    value={authPin}
                    onChange={(e) => setAuthPin(e.target.value)}
                    placeholder="Enter PIN"
                    className="w-full rounded-xl border border-gray-200 bg-white py-2 pl-9 pr-3 text-xs font-bold text-gray-900 focus:border-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setGivePaymentModalOpen(false)}
                  className="rounded-xl border border-gray-200 px-4 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingPayment}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#14532d] py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-[#0f3e21] disabled:opacity-50"
                >
                  {isSubmittingPayment ? (
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Send className="h-4 w-4 text-[#00e699]" />
                      {paymentActionType === "PAID"
                        ? `Authorize & Disburse ₹${Number(paymentAmount || 0).toLocaleString("en-IN")}`
                        : "Save Pending Voucher"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Update Payment Status & Txn ID */}
      {updateModalOpen && updateFarmer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-3xl border border-gray-100 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2 text-[#14532d]">
                <Edit3 className="h-5 w-5" />
                <h3 className="font-extrabold text-gray-900">Update Payment Status</h3>
              </div>
              <button
                onClick={() => setUpdateModalOpen(false)}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleExecuteUpdate} className="mt-4 space-y-4">
              <div className="rounded-2xl border border-gray-100 bg-[#f8faf7] p-3 text-xs">
                <span className="font-bold text-gray-900">{updateFarmer.farmerName}</span>
                <span className="mx-2 text-gray-300">•</span>
                <span className="font-mono text-emerald-800">{updateFarmer.tokenNumber}</span>
                <span className="mx-2 text-gray-300">•</span>
                <span className="font-bold text-gray-900">
                  Current: {updateFarmer.paymentStatus || "PENDING"}
                </span>
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-700">Select Status</label>
                <div className="mt-1.5 grid grid-cols-3 gap-2 text-xs">
                  {["PAID", "PENDING", "FAILED"].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setUpdateStatus(st)}
                      className={`rounded-xl border py-2 font-bold transition ${
                        updateStatus === st
                          ? st === "PAID"
                            ? "border-emerald-600 bg-emerald-600 text-white"
                            : st === "PENDING"
                              ? "border-amber-600 bg-amber-600 text-white"
                              : "border-red-600 bg-red-600 text-white"
                          : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-700">Payment Amount (₹)</label>
                <input
                  type="number"
                  min="1"
                  value={updateAmount}
                  onChange={(e) => setUpdateAmount(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-bold text-gray-900 focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-700">Transaction ID / Bank UTR</label>
                <input
                  type="text"
                  value={updateTxnId}
                  onChange={(e) => setUpdateTxnId(e.target.value)}
                  placeholder="e.g. DBT-APMC-981245"
                  className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-mono font-bold text-gray-900 focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setUpdateModalOpen(false)}
                  className="flex-1 rounded-xl border border-gray-200 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingUpdate}
                  className="flex-1 rounded-xl bg-[#14532d] py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#0f3e21] disabled:opacity-50"
                >
                  {isSubmittingUpdate ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Print Payment Voucher */}
      {voucherModalOpen && voucherData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-gray-100 bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2 text-[#14532d]">
                <Printer className="h-5 w-5" />
                <h3 className="font-extrabold text-gray-900">APMC Mandi Payment Voucher</h3>
              </div>
              <button
                onClick={() => setVoucherModalOpen(false)}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 rounded-2xl border border-gray-200 bg-[#f8faf7] p-4 text-xs space-y-2">
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">Voucher Reference:</span>
                <span className="font-mono font-bold">{voucherData.tokenNumber}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">Farmer:</span>
                <span className="font-bold">{voucherData.farmerName} ({voucherData.farmerPhone})</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">Mandi Centre:</span>
                <span>{voucherData.centreName || "Jehanabad Procurement Centre"}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">Intake Weight:</span>
                <span>{voucherData.grainWeight} kg</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">Bank Txn / UTR:</span>
                <span className="font-mono">{voucherData.transactionId || "N/A"}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="font-bold text-gray-700">Total Settled Amount:</span>
                <span className="text-base font-black text-[#14532d]">
                  ₹{Number(voucherData.amount || 0).toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={() => setVoucherModalOpen(false)}
                className="flex-1 rounded-xl border border-gray-200 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="flex-1 rounded-xl bg-[#14532d] py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#0f3e21]"
              >
                Print Voucher
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

