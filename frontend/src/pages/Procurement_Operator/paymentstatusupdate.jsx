import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  LoaderCircle,
  Send,
} from "lucide-react";
import { createPayment, markPaymentPaid } from "../../api/paymentApi";

export default function PaymentPushDbtSync() {
  const navigate = useNavigate();
  const [bookingId, setBookingId] = useState(
    localStorage.getItem("FARMER_BOOKING_ID") || "",
  );
  const [amount, setAmount] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [payment, setPayment] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const run = async (action) => {
    setIsLoading(true);
    setErrorMessage("");
    setMessage("");
    try {
      const result = await action();
      setPayment(result);
      setMessage("Payment record updated successfully.");
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          error.message ||
          "Payment request failed.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = (event) => {
    event.preventDefault();
    const id = Number(bookingId);
    const value = Number(amount);
    if (
      !Number.isInteger(id) ||
      id < 1 ||
      !Number.isFinite(value) ||
      value <= 0
    ) {
      setErrorMessage("Enter a valid booking ID and payment amount.");
      return;
    }
    run(() => createPayment(id, value));
  };

  const handleMarkPaid = () => {
    if (!payment?.id || !transactionId.trim()) {
      setErrorMessage(
        "Enter a transaction ID before marking the payment paid.",
      );
      return;
    }
    run(() => markPaymentPaid(payment.id, transactionId.trim()));
  };

  return (
    <div className="min-h-screen bg-[#f6f9f5] font-sans text-gray-800">
      <header className="border-b border-emerald-900/10 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/operatordashboard")}
              className="rounded-xl border border-gray-200 p-2"
              aria-label="Back"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div>
              <strong className="block text-[#14532d]">Payment & DBT</strong>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                Operator payment workflow
              </span>
            </div>
          </div>
          <CreditCard className="h-5 w-5 text-emerald-700" />
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-6 py-8">
        <h1 className="text-3xl font-black text-gray-900">
          Create and settle payment
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Payment creation is allowed only after procurement is completed.
        </p>
        <form
          onSubmit={handleCreate}
          className="mt-6 grid gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:grid-cols-3"
        >
          <label className="text-xs font-bold text-gray-700">
            Booking ID
            <input
              value={bookingId}
              onChange={(event) => setBookingId(event.target.value)}
              type="number"
              min="1"
              className="mt-1.5 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm font-normal"
            />
          </label>
          <label className="text-xs font-bold text-gray-700">
            Amount
            <input
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              type="number"
              min="0.01"
              step="0.01"
              placeholder="12500"
              className="mt-1.5 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm font-normal"
            />
          </label>
          <button
            disabled={isLoading}
            className="self-end rounded-xl bg-[#14532d] px-4 py-2.5 text-xs font-bold text-white disabled:opacity-60"
          >
            {isLoading ? (
              <LoaderCircle className="mx-auto h-4 w-4 animate-spin" />
            ) : (
              "Create PENDING payment"
            )}
          </button>
        </form>
        {errorMessage && (
          <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {errorMessage}
          </p>
        )}
        {message && (
          <p className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
            <CheckCircle2 className="h-4 w-4" />
            {message}
          </p>
        )}
        {payment && (
          <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="grid gap-4 sm:grid-cols-4">
              <div>
                <span className="text-xs text-gray-500">Payment ID</span>
                <strong className="block">#{payment.id}</strong>
              </div>
              <div>
                <span className="text-xs text-gray-500">Booking</span>
                <strong className="block">#{payment.bookingId}</strong>
              </div>
              <div>
                <span className="text-xs text-gray-500">Amount</span>
                <strong className="block">
                  ₹{Number(payment.amount).toLocaleString("en-IN")}
                </strong>
              </div>
              <div>
                <span className="text-xs text-gray-500">Status</span>
                <strong className="block text-emerald-800">
                  {payment.status}
                </strong>
              </div>
            </div>
            {payment.status !== "PAID" && (
              <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                <input
                  value={transactionId}
                  onChange={(event) => setTransactionId(event.target.value)}
                  placeholder="Transaction ID"
                  className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm"
                />
                <button
                  onClick={handleMarkPaid}
                  disabled={isLoading}
                  className="flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-bold text-white"
                >
                  <Send className="h-3.5 w-3.5" /> Mark PAID
                </button>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
