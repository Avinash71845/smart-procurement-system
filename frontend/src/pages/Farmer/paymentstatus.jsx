import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  CreditCard,
  LoaderCircle,
  RefreshCw,
} from "lucide-react";
import { getMyPayment } from "../../api/paymentApi";

export default function FarmerPaymentHistory() {
  const navigate = useNavigate();
  const [bookingId, setBookingId] = useState(
    localStorage.getItem("FARMER_BOOKING_ID") || "",
  );
  const [payment, setPayment] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const loadPayment = useCallback(async () => {
    const id = Number(bookingId);
    if (!Number.isInteger(id) || id < 1) {
      setErrorMessage("Enter the booking ID from your booking confirmation.");
      return;
    }
    setIsLoading(true);
    setErrorMessage("");
    try {
      setPayment(await getMyPayment(id));
      localStorage.setItem("FARMER_BOOKING_ID", String(id));
    } catch (error) {
      setPayment(null);
      setErrorMessage(
        error.response?.status === 404
          ? "No payment has been created for this booking yet."
          : error.response?.data?.message || "Unable to load payment status.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [bookingId]);

  useEffect(() => {
    if (bookingId) {
      const initialLoad = window.setTimeout(loadPayment, 0);
      return () => window.clearTimeout(initialLoad);
    }
    return undefined;
  }, [bookingId, loadPayment]);

  return (
    <div className="min-h-screen bg-[#f6f9f5] font-sans text-gray-800">
      <header className="border-b border-emerald-900/10 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/farmerhome")}
              className="rounded-xl border border-gray-200 p-2"
              aria-label="Back"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div>
              <strong className="block text-[#14532d]">Payment Status</strong>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                Farmer payment tracking
              </span>
            </div>
          </div>
          <CreditCard className="h-5 w-5 text-emerald-700" />
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-6 py-8">
        <h1 className="text-3xl font-black text-gray-900">
          Track your payment
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Payment status is read from your own booking record.
        </p>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            loadPayment();
          }}
          className="mt-6 flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:flex-row sm:items-end"
        >
          <label className="flex-1 text-xs font-bold text-gray-700">
            Booking ID
            <input
              value={bookingId}
              onChange={(event) => setBookingId(event.target.value)}
              type="number"
              min="1"
              className="mt-1.5 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm font-normal"
            />
          </label>
          <button
            disabled={isLoading}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#14532d] px-5 py-2.5 text-xs font-bold text-white"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`}
            />{" "}
            Check payment
          </button>
        </form>
        {errorMessage && (
          <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            {errorMessage}
          </p>
        )}
        {isLoading && (
          <div className="mt-6 flex justify-center text-gray-500">
            <LoaderCircle className="h-5 w-5 animate-spin" />
          </div>
        )}
        {payment && (
          <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-gray-500">
                  Payment #{payment.id}
                </span>
                <h2 className="mt-1 text-2xl font-black text-gray-900">
                  ₹{Number(payment.amount).toLocaleString("en-IN")}
                </h2>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ${payment.status === "PAID" ? "bg-emerald-100 text-emerald-900" : "bg-amber-100 text-amber-900"}`}
              >
                {payment.status}
              </span>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div>
                <span className="text-xs text-gray-500">Booking</span>
                <strong className="block">#{payment.bookingId}</strong>
              </div>
              <div>
                <span className="text-xs text-gray-500">Transaction</span>
                <strong className="block">
                  {payment.transactionId || "Awaiting operator update"}
                </strong>
              </div>
              <div>
                <span className="text-xs text-gray-500">Payment date</span>
                <strong className="block">
                  {payment.paymentDate
                    ? new Date(payment.paymentDate).toLocaleString()
                    : "Pending"}
                </strong>
              </div>
            </div>
            <p className="mt-6 flex items-center gap-2 text-sm text-gray-600">
              {payment.status === "PAID" ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-700" />
              ) : (
                <Clock3 className="h-4 w-4 text-amber-700" />
              )}
              {payment.status === "PAID"
                ? "Payment has been marked as paid by the operator."
                : "Payment is pending operator processing."}
            </p>
          </section>
        )}
      </main>
    </div>
  );
}
