import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  Users,
  Warehouse,
  Scale,
  BellRing,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Check,
  FlaskConical,
  Receipt,
  Truck,
  UserCheck,
  RotateCcw,
  Settings2,
  Save,
  IndianRupee,
  Send,
  Landmark,
  Lock,
  Edit3,
  AlertTriangle,
  Printer,
  TrendingUp,
  MessageSquare,
  Activity,
  Sliders
} from 'lucide-react';

export default function OperatorDashboard() {
  // Single Global Store Capacity (Editable by Operator)
  const [totalCapacityQtl, setTotalCapacityQtl] = useState(15000);
  const [capacityInput, setCapacityInput] = useState(15000);

  // Appointments & Queue Roster
  const [appointments, setAppointments] = useState([
    {
      id: 'APT-101',
      tokenId: 'TKN-8841',
      farmerName: 'Ramesh Patel',
      phone: '+91 98765 43210',
      kisanCard: 'KCC-984210',
      village: 'Kalyanpur, Ward 4',
      bankDetails: {
        accountHolderName: 'Ramesh Patel',
        bankName: 'State Bank of India',
        accountNumber: '60210001004523',
        ifsc: 'SBIN0001234',
        branch: 'Patna Main Branch',
        accountType: 'Savings'
      },
      crop: 'Wheat (Grade A)',
      estimatedQtl: 45.0,
      slotTime: '09:30 AM',
      vehicleNo: 'BR-01-GA-4581',
      status: 'In-Queue',
      verificationStatus: 'Verified',
      paymentStatus: 'Paid',
      paymentStage: 'Settled to Bank', // 'Token Generated' | 'Weighment Logged' | 'Treasury Approved' | 'Settled to Bank'
      paymentTxnId: 'DBT-APMC-981245',
      bankReferenceNo: 'UTR20260831004921',
      paidTimestamp: '31 Aug 2026, 10:15 AM',
      paymentSmsSent: true,
      failureReason: '',
      notificationsSent: 1,
      quality: {
        moisturePct: '11.8',
        foreignMatterPct: '0.4',
        grade: 'Grade-A (MSP Premium)'
      },
      scale: {
        grossWeightQtl: '62.4',
        tareWeightQtl: '17.4',
        netWeightQtl: '45.0'
      },
      mspRatePerQtl: 2275,
      calculatedPayout: 102375
    },
    {
      id: 'APT-102',
      tokenId: 'TKN-8842',
      farmerName: 'Suresh Kumar Yadav',
      phone: '+91 94310 11223',
      kisanCard: 'KCC-773190',
      village: 'Maner, Block B',
      bankDetails: {
        accountHolderName: 'Suresh Kumar Yadav',
        bankName: 'Punjab National Bank',
        accountNumber: '1120002100088214',
        ifsc: 'PUNB0124400',
        branch: 'Maner Bazar Branch',
        accountType: 'Kisan Credit Account'
      },
      crop: 'Mustard (Standard)',
      estimatedQtl: 28.5,
      slotTime: '10:00 AM',
      vehicleNo: 'BR-01-T-9021',
      status: 'Processing',
      verificationStatus: 'Pending Review',
      paymentStatus: 'Pending',
      paymentStage: 'Weighment Logged',
      paymentTxnId: '',
      bankReferenceNo: '',
      paidTimestamp: '',
      paymentSmsSent: false,
      failureReason: '',
      notificationsSent: 2,
      quality: {
        moisturePct: '12.4',
        foreignMatterPct: '0.6',
        grade: 'Grade-B (Standard MSP)'
      },
      scale: {
        grossWeightQtl: '',
        tareWeightQtl: '',
        netWeightQtl: ''
      },
      mspRatePerQtl: 5650,
      calculatedPayout: 161025
    },
    {
      id: 'APT-103',
      tokenId: 'TKN-8843',
      farmerName: 'Manish Mahto',
      phone: '+91 88771 23456',
      kisanCard: 'KCC-552140',
      village: 'Bikramganj',
      bankDetails: {
        accountHolderName: 'Manish Mahto',
        bankName: 'Bank of Baroda',
        accountNumber: '34910100009012',
        ifsc: 'BARB0PATNAX',
        branch: 'Bikramganj Town Branch',
        accountType: 'Savings'
      },
      crop: 'Wheat (Grade A)',
      estimatedQtl: 60.0,
      slotTime: '10:30 AM',
      vehicleNo: 'BR-02-B-1188',
      status: 'In-Queue',
      verificationStatus: 'Verified',
      paymentStatus: 'Pending',
      paymentStage: 'Token Generated',
      paymentTxnId: '',
      bankReferenceNo: '',
      paidTimestamp: '',
      paymentSmsSent: false,
      failureReason: '',
      notificationsSent: 0,
      quality: {
        moisturePct: '',
        foreignMatterPct: '',
        grade: ''
      },
      scale: {
        grossWeightQtl: '',
        tareWeightQtl: '',
        netWeightQtl: ''
      },
      mspRatePerQtl: 2275,
      calculatedPayout: 136500
    }
  ]);

  const [activeTab, setActiveTab] = useState('payments'); // 'queue' | 'payments' | 'capacity'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFarmer, setSelectedFarmer] = useState(appointments[0]);
  const [toastMessage, setToastMessage] = useState(null);

  // Modals State
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentTargetFarmer, setPaymentTargetFarmer] = useState(null);
  const [manualTxnNumber, setManualTxnNumber] = useState('');
  const [manualUtrNumber, setManualUtrNumber] = useState('');
  const [authPin, setAuthPin] = useState('');
  const [sendSmsChecked, setSendSmsChecked] = useState(true);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Payment Tracking Stage Update Modal
  const [stageModalOpen, setStageModalOpen] = useState(false);
  const [stageTargetFarmer, setStageTargetFarmer] = useState(null);
  const [selectedStage, setSelectedStage] = useState('Token Generated');

  // Edit Transaction Modal
  const [editTxnModalOpen, setEditTxnModalOpen] = useState(false);
  const [editTxnFarmer, setEditTxnFarmer] = useState(null);
  const [editTxnInput, setEditTxnInput] = useState('');
  const [editUtrInput, setEditUtrInput] = useState('');

  // Payment Cancellation Modal
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelTargetFarmer, setCancelTargetFarmer] = useState(null);
  const [cancelReason, setCancelReason] = useState('Bank Server Network Timeout');

  // Active Desk Form
  const [inspectionForm, setInspectionForm] = useState({
    grossWeight: '',
    tareWeight: '',
    moisturePct: '',
    foreignMatterPct: '',
    assignedGrade: 'Grade-A (MSP Premium)',
    rejectionReason: ''
  });

  // Capacity & Financial Calculations
  const totalStockQtl = appointments
    .filter((a) => a.status === 'Completed' || a.paymentStatus === 'Paid')
    .reduce((sum, item) => sum + parseFloat(item.scale.netWeightQtl || item.estimatedQtl), 0) + 8450; // + existing storage base

  const totalFilledPct = totalCapacityQtl > 0 ? Math.min(100, Math.round((totalStockQtl / totalCapacityQtl) * 100)) : 0;

  const paidRecords = appointments.filter((a) => a.paymentStatus === 'Paid');
  const pendingRecords = appointments.filter((a) => a.paymentStatus !== 'Paid');
  const totalPaidAmount = paidRecords.reduce((sum, item) => sum + item.calculatedPayout, 0);
  const totalPaidWeightQtl = paidRecords.reduce((sum, item) => sum + parseFloat(item.scale.netWeightQtl || item.estimatedQtl), 0);
  const totalPendingAmount = pendingRecords.reduce((sum, item) => sum + item.calculatedPayout, 0);
  const totalCommittedBudget = appointments.reduce((sum, item) => sum + item.calculatedPayout, 0);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSendNotification = (farmerId, name, token) => {
    setAppointments((prev) =>
      prev.map((apt) =>
        apt.id === farmerId ? { ...apt, notificationsSent: apt.notificationsSent + 1 } : apt
      )
    );
    showToast(`Push alert sent to ${name} for Token ${token}`);
  };

  const handleVerifyFarmer = (farmerId) => {
    setAppointments((prev) =>
      prev.map((apt) =>
        apt.id === farmerId ? { ...apt, verificationStatus: 'Verified' } : apt
      )
    );
    if (selectedFarmer?.id === farmerId) {
      setSelectedFarmer((prev) => ({ ...prev, verificationStatus: 'Verified' }));
    }
    showToast(`Farmer credentials & land records verified.`);
  };

  const handleCancelVerification = (farmerId, name) => {
    setAppointments((prev) =>
      prev.map((apt) =>
        apt.id === farmerId ? { ...apt, verificationStatus: 'Pending Review' } : apt
      )
    );
    if (selectedFarmer?.id === farmerId) {
      setSelectedFarmer((prev) => ({ ...prev, verificationStatus: 'Pending Review' }));
    }
    showToast(`Verification canceled for ${name}. Marked as Pending Review.`);
  };

  const handleSelectForDesk = (farmer) => {
    setSelectedFarmer(farmer);
    setInspectionForm({
      grossWeight: farmer.scale.grossWeightQtl || '',
      tareWeight: farmer.scale.tareWeightQtl || '',
      moisturePct: farmer.quality.moisturePct || '',
      foreignMatterPct: farmer.quality.foreignMatterPct || '',
      assignedGrade: farmer.quality.grade || 'Grade-A (MSP Premium)',
      rejectionReason: ''
    });
  };

  const handleFinalProcurementDecision = (decision) => {
    if (!selectedFarmer) return;

    const netWeight =
      inspectionForm.grossWeight && inspectionForm.tareWeight
        ? (parseFloat(inspectionForm.grossWeight) - parseFloat(inspectionForm.tareWeight)).toFixed(2)
        : selectedFarmer.estimatedQtl.toString();

    if (decision === 'accept') {
      const updatedPayout = parseFloat(netWeight) * selectedFarmer.mspRatePerQtl;

      setAppointments((prev) =>
        prev.map((apt) =>
          apt.id === selectedFarmer.id
            ? {
                ...apt,
                status: 'Completed',
                calculatedPayout: updatedPayout,
                paymentStage: 'Treasury Approved',
                quality: {
                  moisturePct: inspectionForm.moisturePct || '12.0',
                  foreignMatterPct: inspectionForm.foreignMatterPct || '0.5',
                  grade: inspectionForm.assignedGrade
                },
                scale: {
                  grossWeightQtl: inspectionForm.grossWeight || '60.0',
                  tareWeightQtl: inspectionForm.tareWeight || '15.0',
                  netWeightQtl: netWeight
                }
              }
            : apt
        )
      );

      showToast(`Procurement Lot Accepted for ${selectedFarmer.farmerName}. Payment stage updated.`);
    } else {
      setAppointments((prev) =>
        prev.map((apt) =>
          apt.id === selectedFarmer.id ? { ...apt, status: 'Rejected' } : apt
        )
      );
      showToast(`Procurement Lot Rejected for ${selectedFarmer.farmerName}.`);
    }
  };

  const openPaymentModal = (farmer) => {
    setPaymentTargetFarmer(farmer);
    const generatedTxn = `DBT-APMC-${Math.floor(100000 + Math.random() * 900000)}`;
    const generatedUtr = `UTR2026${Math.floor(1000000000 + Math.random() * 9000000000)}`;
    setManualTxnNumber(generatedTxn);
    setManualUtrNumber(generatedUtr);
    setAuthPin('');
    setSendSmsChecked(true);
    setPaymentModalOpen(true);
  };

  // Payment Execution with SMS Dispatch
  const handleExecutePayment = (e) => {
    e.preventDefault();
    if (!authPin || authPin.length < 4) {
      alert('Enter 4-digit Mandi Passcode to authorize treasury transfer.');
      return;
    }

    setIsProcessingPayment(true);

    setTimeout(() => {
      setAppointments((prev) =>
        prev.map((apt) =>
          apt.id === paymentTargetFarmer.id
            ? {
                ...apt,
                paymentStatus: 'Paid',
                paymentStage: 'Settled to Bank',
                paymentTxnId: manualTxnNumber.trim(),
                bankReferenceNo: manualUtrNumber.trim(),
                paidTimestamp: 'Just Now',
                paymentSmsSent: sendSmsChecked,
                failureReason: ''
              }
            : apt
        )
      );

      setIsProcessingPayment(false);
      setPaymentModalOpen(false);
      showToast(
        sendSmsChecked
          ? `Payment ₹${paymentTargetFarmer.calculatedPayout.toLocaleString()} transferred & SMS confirmation sent to ${paymentTargetFarmer.phone}!`
          : `Payment ₹${paymentTargetFarmer.calculatedPayout.toLocaleString()} saved! Txn: ${manualTxnNumber}`
      );
    }, 900);
  };

  // Direct SMS Confirmation Trigger
  const handleSendPaymentSms = (farmer) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === farmer.id ? { ...apt, paymentSmsSent: true } : apt))
    );
    showToast(`Payment SMS re-sent to ${farmer.farmerName} (${farmer.phone}) with Txn: ${farmer.paymentTxnId}`);
  };

  // Open Stage Update Modal
  const openStageModal = (farmer) => {
    setStageTargetFarmer(farmer);
    setSelectedStage(farmer.paymentStage || 'Token Generated');
    setStageModalOpen(true);
  };

  // Save Operator-selected Payment Stage
  const handleSavePaymentStage = (e) => {
    e.preventDefault();
    if (!stageTargetFarmer) return;

    setAppointments((prev) =>
      prev.map((apt) =>
        apt.id === stageTargetFarmer.id ? { ...apt, paymentStage: selectedStage } : apt
      )
    );

    setStageModalOpen(false);
    showToast(`Payment process stage updated to "${selectedStage}" for ${stageTargetFarmer.farmerName}`);
  };

  const openEditTxnModal = (farmer) => {
    setEditTxnFarmer(farmer);
    setEditTxnInput(farmer.paymentTxnId || '');
    setEditUtrInput(farmer.bankReferenceNo || '');
    setEditTxnModalOpen(true);
  };

  const handleSaveTransactionRecord = (e) => {
    e.preventDefault();
    if (!editTxnFarmer) return;

    setAppointments((prev) =>
      prev.map((apt) =>
        apt.id === editTxnFarmer.id
          ? {
              ...apt,
              paymentTxnId: editTxnInput.trim(),
              bankReferenceNo: editUtrInput.trim()
            }
          : apt
      )
    );

    setEditTxnModalOpen(false);
    showToast(`Transaction details updated for ${editTxnFarmer.farmerName}!`);
  };

  const openCancelPaymentModal = (farmer) => {
    setCancelTargetFarmer(farmer);
    setCancelReason('Bank Server Network Timeout');
    setCancelModalOpen(true);
  };

  const handleConfirmPaymentCancellation = (e) => {
    e.preventDefault();
    if (!cancelTargetFarmer) return;

    setAppointments((prev) =>
      prev.map((apt) =>
        apt.id === cancelTargetFarmer.id
          ? {
              ...apt,
              paymentStatus: 'Failed',
              paymentStage: 'Weighment Logged',
              failureReason: cancelReason,
              paymentTxnId: '',
              bankReferenceNo: '',
              paidTimestamp: '',
              paymentSmsSent: false
            }
          : apt
      )
    );

    setCancelModalOpen(false);
    showToast(`Payment canceled for ${cancelTargetFarmer.farmerName}. Status reset to Failed.`);
  };

  // Save Operator Single Total Capacity
  const handleSaveTotalCapacity = (e) => {
    e.preventDefault();
    setTotalCapacityQtl(Number(capacityInput));
    showToast(`Overall center capacity updated to ${Number(capacityInput).toLocaleString()} Quintals!`);
  };

  const filteredAppointments = appointments.filter(
    (apt) =>
      apt.farmerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.tokenId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.vehicleNo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative min-h-screen w-full bg-[#f4f7f4] font-sans text-gray-800 antialiased selection:bg-emerald-200 selection:text-emerald-900">
      
      {/* Toast Alert */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-6 z-50 flex items-center gap-2.5 rounded-2xl border border-emerald-500/40 bg-[#0d4624] px-4 py-3 text-xs font-bold text-white shadow-2xl backdrop-blur-md"
          >
            <CheckCircle2 className="h-4 w-4 text-[#00e699]" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Payment Release Modal (with SMS Toggle) */}
      <AnimatePresence>
        {paymentModalOpen && paymentTargetFarmer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg rounded-3xl border border-gray-100 bg-white p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2 text-[#14532d]">
                  <Landmark className="h-5 w-5" />
                  <h3 className="font-extrabold text-gray-900">Process Treasury Payment & Send SMS</h3>
                </div>
                <button
                  onClick={() => setPaymentModalOpen(false)}
                  className="rounded-lg p-1 text-gray-400 hover:bg-gray-100"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleExecutePayment} className="mt-4 space-y-4">
                <div className="rounded-2xl border border-emerald-100 bg-[#f8faf7] p-4 text-xs space-y-2">
                  <div className="flex justify-between border-b border-gray-200/60 pb-1.5">
                    <span className="text-gray-500">Farmer & Mobile:</span>
                    <span className="font-bold text-gray-900">{paymentTargetFarmer.farmerName} ({paymentTargetFarmer.phone})</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200/60 pb-1.5">
                    <span className="text-gray-500">Bank & Branch:</span>
                    <span className="font-bold text-gray-900">{paymentTargetFarmer.bankDetails.bankName}, {paymentTargetFarmer.bankDetails.branch}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200/60 pb-1.5">
                    <span className="text-gray-500">Account Number:</span>
                    <span className="font-mono font-black text-gray-900 tracking-wider">{paymentTargetFarmer.bankDetails.accountNumber}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200/60 pb-1.5">
                    <span className="text-gray-500">IFSC Code:</span>
                    <span className="font-mono font-bold text-emerald-800">{paymentTargetFarmer.bankDetails.ifsc}</span>
                  </div>
                  <div className="flex justify-between pt-1 font-black text-sm text-[#14532d]">
                    <span>Total Disbursable Amount:</span>
                    <span>₹{paymentTargetFarmer.calculatedPayout.toLocaleString()}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="text-[11px] font-bold text-gray-700">Mandi Voucher / Txn No.</label>
                    <input
                      type="text"
                      required
                      value={manualTxnNumber}
                      onChange={(e) => setManualTxnNumber(e.target.value)}
                      placeholder="e.g. DBT-APMC-981245"
                      className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-mono font-bold text-gray-900 focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-gray-700">Bank UTR / Ref No.</label>
                    <input
                      type="text"
                      required
                      value={manualUtrNumber}
                      onChange={(e) => setManualUtrNumber(e.target.value)}
                      placeholder="e.g. UTR20260831001"
                      className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-mono font-bold text-gray-900 focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Send SMS Checkbox */}
                <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50/60 p-3">
                  <input
                    type="checkbox"
                    id="sendSmsPayment"
                    checked={sendSmsChecked}
                    onChange={(e) => setSendSmsChecked(e.target.checked)}
                    className="h-4 w-4 rounded accent-[#14532d]"
                  />
                  <label htmlFor="sendSmsPayment" className="text-xs font-bold text-gray-800 cursor-pointer flex items-center gap-1.5">
                    <MessageSquare className="h-3.5 w-3.5 text-emerald-700" />
                    Send Instant Payment Done SMS to {paymentTargetFarmer.phone}
                  </label>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700">Officer Authorization PIN</label>
                  <div className="relative mt-1.5">
                    <Lock className="absolute left-3.5 top-2.5 h-4 w-4 text-gray-400" />
                    <input
                      type="password"
                      maxLength={6}
                      required
                      value={authPin}
                      onChange={(e) => setAuthPin(e.target.value)}
                      placeholder="Enter 4-digit PIN"
                      className="w-full rounded-xl border border-gray-200 bg-white py-2 pl-10 pr-4 text-xs font-bold text-gray-900 focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setPaymentModalOpen(false)}
                    className="rounded-xl border border-gray-200 px-4 py-3 text-xs font-bold text-gray-600 hover:bg-gray-50"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    disabled={isProcessingPayment}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#14532d] py-3 text-xs font-bold text-white shadow-md transition hover:bg-[#0f3e21] disabled:opacity-50"
                  >
                    {isProcessingPayment ? (
                      <span>Executing Payment & SMS...</span>
                    ) : (
                      <>
                        <Send className="h-4 w-4 text-[#00e699]" />
                        Authorize & Complete Transfer
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Payment Process Update & Tracking Modal (Operator Set Stage) */}
      <AnimatePresence>
        {stageModalOpen && stageTargetFarmer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-3xl border border-gray-100 bg-white p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2 text-emerald-800">
                  <Activity className="h-5 w-5" />
                  <h3 className="font-extrabold text-gray-900">Set Payment Process Stage</h3>
                </div>
                <button
                  onClick={() => setStageModalOpen(false)}
                  className="rounded-lg p-1 text-gray-400 hover:bg-gray-100"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSavePaymentStage} className="mt-4 space-y-4">
                <div className="rounded-2xl border border-gray-100 bg-[#f8faf7] p-3 text-xs">
                  <span className="font-bold text-gray-900">{stageTargetFarmer.farmerName}</span>
                  <span className="mx-2 text-gray-300">•</span>
                  <span className="text-emerald-800 font-semibold">{stageTargetFarmer.tokenId}</span>
                  <span className="mx-2 text-gray-300">•</span>
                  <span className="font-bold text-gray-800">₹{stageTargetFarmer.calculatedPayout.toLocaleString()}</span>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700">Select Active Payment Processing Stage</label>
                  <div className="mt-2 space-y-2">
                    {[
                      { stage: 'Token Generated', desc: 'Initial registration cleared, waiting for weighment' },
                      { stage: 'Weighment Logged', desc: 'Net quintals computed, quality assay attached' },
                      { stage: 'Treasury Approved', desc: 'J-Form generated, sent to Mandi treasury pool' },
                      { stage: 'Settled to Bank', desc: 'DBT funds successfully disbursed to farmer account' }
                    ].map((item) => (
                      <label
                        key={item.stage}
                        className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-3 transition ${
                          selectedStage === item.stage
                            ? 'border-[#14532d] bg-emerald-50/60 shadow-sm'
                            : 'border-gray-200 bg-white hover:bg-gray-50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentStage"
                          value={item.stage}
                          checked={selectedStage === item.stage}
                          onChange={(e) => setSelectedStage(e.target.value)}
                          className="mt-0.5 accent-[#14532d]"
                        />
                        <div>
                          <div className="text-xs font-bold text-gray-900">{item.stage}</div>
                          <div className="text-[11px] text-gray-500">{item.desc}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setStageModalOpen(false)}
                    className="flex-1 rounded-xl border border-gray-200 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-50"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="flex-1 rounded-xl bg-[#14532d] py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-[#0f3e21]"
                  >
                    Update Stage
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Transaction Modal */}
      <AnimatePresence>
        {editTxnModalOpen && editTxnFarmer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-3xl border border-gray-100 bg-white p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2 text-emerald-800">
                  <Edit3 className="h-5 w-5" />
                  <h3 className="font-extrabold text-gray-900">Update / Store Transaction ID</h3>
                </div>
                <button
                  onClick={() => setEditTxnModalOpen(false)}
                  className="rounded-lg p-1 text-gray-400 hover:bg-gray-100"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveTransactionRecord} className="mt-4 space-y-4">
                <div className="rounded-2xl border border-gray-100 bg-[#f8faf7] p-3 text-xs">
                  <span className="font-bold text-gray-900">{editTxnFarmer.farmerName}</span>
                  <span className="mx-2 text-gray-300">•</span>
                  <span className="text-emerald-800 font-semibold">₹{editTxnFarmer.calculatedPayout.toLocaleString()}</span>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-700">Mandi Transaction / Voucher ID</label>
                  <input
                    type="text"
                    required
                    value={editTxnInput}
                    onChange={(e) => setEditTxnInput(e.target.value)}
                    placeholder="e.g. DBT-APMC-981245"
                    className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-mono font-bold text-gray-900 focus:border-emerald-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-700">Bank UTR / Acknowledgement Number</label>
                  <input
                    type="text"
                    required
                    value={editUtrInput}
                    onChange={(e) => setEditUtrInput(e.target.value)}
                    placeholder="e.g. UTR202608319988"
                    className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-mono font-bold text-gray-900 focus:border-emerald-600 focus:outline-none"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditTxnModalOpen(false)}
                    className="flex-1 rounded-xl border border-gray-200 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-50"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="flex-1 rounded-xl bg-[#14532d] py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-[#0f3e21]"
                  >
                    Save Details
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Payment Cancellation Modal */}
      <AnimatePresence>
        {cancelModalOpen && cancelTargetFarmer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-3xl border border-red-100 bg-white p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2 text-red-700">
                  <AlertTriangle className="h-5 w-5" />
                  <h3 className="font-extrabold text-gray-900">Cancel / Rollback Payment</h3>
                </div>
                <button
                  onClick={() => setCancelModalOpen(false)}
                  className="rounded-lg p-1 text-gray-400 hover:bg-gray-100"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleConfirmPaymentCancellation} className="mt-4 space-y-4">
                <p className="text-xs text-gray-600 leading-relaxed">
                  Mark the transaction as <strong>Failed</strong> to allow an immediate re-entry or retry.
                </p>

                <div className="rounded-2xl border border-red-100 bg-red-50/50 p-3.5 text-xs">
                  <div className="flex justify-between font-bold text-gray-900">
                    <span>Farmer:</span>
                    <span>{cancelTargetFarmer.farmerName} ({cancelTargetFarmer.tokenId})</span>
                  </div>
                  <div className="mt-1 flex justify-between text-gray-600">
                    <span>Amount:</span>
                    <span className="font-bold text-red-800">₹{cancelTargetFarmer.calculatedPayout.toLocaleString()}</span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700">Cancellation Reason</label>
                  <select
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-900 focus:border-red-600 focus:outline-none"
                  >
                    <option value="Bank Server Network Timeout">Bank Server Network Timeout</option>
                    <option value="Beneficiary Account Inactive / Blocked">Beneficiary Account Inactive / Blocked</option>
                    <option value="NPCI / DBT Gateway Desync">NPCI / DBT Gateway Desync</option>
                    <option value="Incorrect IFSC Code or Branch Merger">Incorrect IFSC Code or Branch Merger</option>
                    <option value="Manual Rollback by Officer">Manual Rollback by Officer</option>
                  </select>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setCancelModalOpen(false)}
                    className="flex-1 rounded-xl border border-gray-200 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-50"
                  >
                    Keep Unchanged
                  </button>
                  <button
                    type="submit"
                    className="flex-1 rounded-xl bg-red-600 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-red-700"
                  >
                    Confirm Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-emerald-900/10 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5 lg:px-10">
          
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0d4624] text-white shadow-sm">
              <Building2 className="h-5 w-5 text-[#00e699]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black tracking-tight text-[#14532d]">
                  SmartProcure
                </span>
                <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                  Operator Console
                </span>
              </div>
              <span className="block text-[10px] font-semibold tracking-wider text-gray-500 uppercase">
                Patna Central APMC Yard #04
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex rounded-xl bg-gray-100 p-1">
              <button
                onClick={() => setActiveTab('queue')}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                  activeTab === 'queue' ? 'bg-white text-[#14532d] shadow-sm' : 'text-gray-600'
                }`}
              >
                Queue & Desk
              </button>
              <button
                onClick={() => setActiveTab('payments')}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                  activeTab === 'payments' ? 'bg-white text-[#14532d] shadow-sm' : 'text-gray-600'
                }`}
              >
                Disburse & Accounts Summary
              </button>
              <button
                onClick={() => setActiveTab('capacity')}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                  activeTab === 'capacity' ? 'bg-white text-[#14532d] shadow-sm' : 'text-gray-600'
                }`}
              >
                Center Capacity Limit
              </button>
            </div>
          </div>

        </div>
      </header>

      {/* Main Container */}
      <main className="mx-auto max-w-7xl px-6 pt-6 pb-16 lg:px-10">
        
        {/* Metric Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          
          <div className="rounded-2xl border border-emerald-900/20 bg-gradient-to-br from-[#14532d] to-[#0d3b1d] p-5 text-white shadow-md">
            <div className="flex items-center justify-between text-xs font-bold text-emerald-200">
              <span>Total Paid to Farmers</span>
              <IndianRupee className="h-4 w-4 text-[#00e699]" />
            </div>
            <div className="mt-2 text-2xl font-black text-white">
              ₹{totalPaidAmount.toLocaleString()}
            </div>
            <p className="mt-1 text-[11px] text-emerald-300">
              {paidRecords.length} Transfers • {totalPaidWeightQtl.toFixed(1)} Qtl Settled
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between text-xs font-bold text-gray-500">
              <span>Pending DBT Disbursements</span>
              <Clock className="h-4 w-4 text-amber-700" />
            </div>
            <div className="mt-2 text-2xl font-black text-gray-900">
              ₹{totalPendingAmount.toLocaleString()}
            </div>
            <p className="mt-1 text-[11px] text-gray-400">{pendingRecords.length} lots awaiting payout</p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between text-xs font-bold text-gray-500">
              <span>Total Committed Budget</span>
              <TrendingUp className="h-4 w-4 text-blue-700" />
            </div>
            <div className="mt-2 text-2xl font-black text-gray-900">
              ₹{totalCommittedBudget.toLocaleString()}
            </div>
            <p className="mt-1 text-[11px] text-gray-400">Total MSP entitlement today</p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between text-xs font-bold text-gray-500">
              <span>Overall Store Capacity</span>
              <Warehouse className="h-4 w-4 text-purple-700" />
            </div>
            <div className="mt-2 text-2xl font-black text-gray-900">
              {totalStockQtl.toLocaleString()} <span className="text-xs font-normal text-gray-500">/ {totalCapacityQtl.toLocaleString()} Qtl</span>
            </div>
            <div className="mt-2 h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
              <div className="h-full rounded-full bg-[#14532d]" style={{ width: `${totalFilledPct}%` }} />
            </div>
          </div>

        </div>

        {/* Tab 1: Queue & Processing Desk */}
        {activeTab === 'queue' && (
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
            
            {/* Left Column: Queue Items */}
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm lg:col-span-7">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <h2 className="text-base font-bold text-gray-900">Live Yard Queue & Verification</h2>
                  <p className="text-xs text-gray-500">Notify farmers, verify identity, or revert mistaken verifications.</p>
                </div>
                
                <div className="relative w-full sm:w-60">
                  <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search Token / Name..."
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2 pl-8 pr-3 text-xs focus:border-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {filteredAppointments.map((apt) => {
                  const isSelected = selectedFarmer?.id === apt.id;
                  const isVerified = apt.verificationStatus === 'Verified';

                  return (
                    <div
                      key={apt.id}
                      onClick={() => handleSelectForDesk(apt)}
                      className={`cursor-pointer rounded-2xl border p-4 transition ${
                        isSelected
                          ? 'border-[#14532d] bg-emerald-50/40 shadow-sm'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-gray-900">{apt.farmerName}</span>
                            <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-900">
                              {apt.tokenId}
                            </span>
                            <span className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                              apt.paymentStatus === 'Paid'
                                ? 'bg-purple-100 text-purple-800'
                                : apt.paymentStatus === 'Failed'
                                ? 'bg-red-100 text-red-800'
                                : apt.status === 'Completed'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}>
                              {apt.paymentStatus === 'Paid' ? 'Paid via DBT' : apt.paymentStatus === 'Failed' ? 'Payment Failed' : apt.status}
                            </span>
                          </div>

                          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                            <span>{apt.crop}</span>
                            <span>•</span>
                            <span>Est: <strong>{apt.estimatedQtl} Qtl</strong></span>
                            <span>•</span>
                            <span>{apt.vehicleNo}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSendNotification(apt.id, apt.farmerName, apt.tokenId);
                            }}
                            className="flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50/80 px-3 py-1.5 text-xs font-bold text-emerald-900 hover:bg-emerald-100 active:scale-95"
                          >
                            <BellRing className="h-3.5 w-3.5 text-emerald-700" />
                            <span>Notify ({apt.notificationsSent})</span>
                          </button>

                          {isVerified ? (
                            <div className="flex items-center gap-1.5">
                              <span className="flex items-center gap-1 rounded-xl bg-emerald-100 px-2.5 py-1.5 text-[10px] font-bold text-emerald-800">
                                <UserCheck className="h-3.5 w-3.5" /> Verified
                              </span>
                              <button
                                type="button"
                                title="Revert mistaken verification"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCancelVerification(apt.id, apt.farmerName);
                                }}
                                className="flex items-center gap-1 rounded-xl border border-red-200 bg-red-50 px-2 py-1.5 text-[10px] font-bold text-red-700 transition hover:bg-red-100 active:scale-95"
                              >
                                <RotateCcw className="h-3 w-3" />
                                <span>Cancel</span>
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleVerifyFarmer(apt.id);
                              }}
                              className="rounded-xl bg-[#14532d] px-2.5 py-1.5 text-[10px] font-bold text-white hover:bg-[#0f3e21]"
                            >
                              Verify Info
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Processing Desk */}
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm lg:col-span-5">
              {selectedFarmer ? (
                <div>
                  <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                        Active Procurement Desk
                      </span>
                      <h3 className="text-base font-bold text-gray-900">{selectedFarmer.farmerName}</h3>
                      <p className="text-xs text-gray-500">{selectedFarmer.village} • {selectedFarmer.kisanCard}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      {selectedFarmer.verificationStatus === 'Verified' ? (
                        <button
                          type="button"
                          onClick={() => handleCancelVerification(selectedFarmer.id, selectedFarmer.farmerName)}
                          className="flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-2 py-1 text-[10px] font-bold text-red-700 hover:bg-red-100"
                        >
                          <RotateCcw className="h-3 w-3" /> Cancel Verification
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleVerifyFarmer(selectedFarmer.id)}
                          className="rounded-lg bg-[#14532d] px-2 py-1 text-[10px] font-bold text-white hover:bg-[#0f3e21]"
                        >
                          Verify Farmer
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="mt-5 space-y-4">
                    <div className="rounded-2xl border border-gray-100 bg-[#f8faf7] p-4">
                      <div className="flex items-center gap-2 text-xs font-bold text-gray-900">
                        <Scale className="h-4 w-4 text-emerald-700" />
                        <span>Record Electronic Weighment (Quintals)</span>
                      </div>
                      
                      <div className="mt-3 grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[11px] font-bold text-gray-600">Gross Loaded Wt</label>
                          <input
                            type="number"
                            step="0.1"
                            value={inspectionForm.grossWeight}
                            onChange={(e) => setInspectionForm({ ...inspectionForm, grossWeight: e.target.value })}
                            placeholder="e.g. 62.4"
                            className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-emerald-600"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold text-gray-600">Tare Vehicle Wt</label>
                          <input
                            type="number"
                            step="0.1"
                            value={inspectionForm.tareWeight}
                            onChange={(e) => setInspectionForm({ ...inspectionForm, tareWeight: e.target.value })}
                            placeholder="e.g. 17.4"
                            className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-emerald-600"
                          />
                        </div>
                      </div>

                      {inspectionForm.grossWeight && inspectionForm.tareWeight && (
                        <div className="mt-2 flex justify-between text-xs font-bold text-[#14532d]">
                          <span>Net: {(parseFloat(inspectionForm.grossWeight) - parseFloat(inspectionForm.tareWeight)).toFixed(2)} Qtl</span>
                          <span>Est Payout: ₹{((parseFloat(inspectionForm.grossWeight) - parseFloat(inspectionForm.tareWeight)) * selectedFarmer.mspRatePerQtl).toLocaleString()}</span>
                        </div>
                      )}
                    </div>

                    <div className="rounded-2xl border border-gray-100 bg-[#f8faf7] p-4">
                      <div className="flex items-center gap-2 text-xs font-bold text-gray-900">
                        <FlaskConical className="h-4 w-4 text-amber-700" />
                        <span>Assay Lab & Quality Test Record</span>
                      </div>

                      <div className="mt-3 grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[11px] font-bold text-gray-600">Moisture Content (%)</label>
                          <input
                            type="number"
                            step="0.1"
                            value={inspectionForm.moisturePct}
                            onChange={(e) => setInspectionForm({ ...inspectionForm, moisturePct: e.target.value })}
                            placeholder="Max 12.0%"
                            className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-emerald-600"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold text-gray-600">Foreign Matter (%)</label>
                          <input
                            type="number"
                            step="0.01"
                            value={inspectionForm.foreignMatterPct}
                            onChange={(e) => setInspectionForm({ ...inspectionForm, foreignMatterPct: e.target.value })}
                            placeholder="Max 0.75%"
                            className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-emerald-600"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleFinalProcurementDecision('accept')}
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#14532d] py-3 text-xs font-bold text-white shadow-md transition hover:bg-[#0f3e21]"
                      >
                        <Check className="h-4 w-4 text-[#00e699]" />
                        Accept & Approve
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => handleFinalProcurementDecision('reject')}
                        className="flex items-center justify-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-bold text-red-700 transition hover:bg-red-100"
                      >
                        <XCircle className="h-4 w-4" />
                        Reject
                      </button>
                    </div>

                  </div>
                </div>
              ) : (
                <div className="py-16 text-center text-xs text-gray-400">
                  Select a farmer from the queue to start.
                </div>
              )}
            </div>

          </div>
        )}

        {/* Tab 2: Disburse, Manage & View Upper Officer Summary */}
        {activeTab === 'payments' && (
          <div className="mt-6 space-y-6">
            
            {/* Upper Officer Financial Audit & Calculation Box */}
            <div className="rounded-3xl border border-emerald-900/10 bg-white p-6 shadow-sm">
              <div className="flex flex-col justify-between gap-3 border-b border-gray-100 pb-4 sm:flex-row sm:items-center">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800">
                    Official Executive Treasury Summary
                  </span>
                  <h2 className="text-lg font-black text-gray-900">
                    Procurement Disbursed Calculations (For Audit & Supervisor)
                  </h2>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => window.print()}
                    className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-bold text-gray-700 hover:bg-gray-100"
                  >
                    <Printer className="h-3.5 w-3.5 text-gray-500" />
                    Print Statement
                  </button>
                </div>
              </div>

              {/* Executive Ledger Calculation Formula & Metrics */}
              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-4">
                <div className="rounded-2xl border border-emerald-100 bg-[#f8faf7] p-4">
                  <span className="text-xs font-bold text-gray-600">Total Disbursed (Paid)</span>
                  <div className="mt-1 text-2xl font-black text-[#14532d]">
                    ₹{totalPaidAmount.toLocaleString()}
                  </div>
                  <span className="mt-0.5 block text-[10px] text-gray-500">
                    Formula: Total of (Net Weight × MSP Rate)
                  </span>
                </div>

                <div className="rounded-2xl border border-gray-100 bg-[#f8faf7] p-4">
                  <span className="text-xs font-bold text-gray-600">Paid Grain Stock</span>
                  <div className="mt-1 text-2xl font-black text-gray-900">
                    {totalPaidWeightQtl.toFixed(1)} <span className="text-xs font-semibold text-gray-500">Qtl</span>
                  </div>
                  <span className="mt-0.5 block text-[10px] text-gray-500">Physical stock cleared</span>
                </div>

                <div className="rounded-2xl border border-gray-100 bg-[#f8faf7] p-4">
                  <span className="text-xs font-bold text-gray-600">Pending Authorization</span>
                  <div className="mt-1 text-2xl font-black text-amber-700">
                    ₹{totalPendingAmount.toLocaleString()}
                  </div>
                  <span className="mt-0.5 block text-[10px] text-gray-500">{pendingRecords.length} farmers in pipeline</span>
                </div>

                <div className="rounded-2xl border border-gray-100 bg-[#f8faf7] p-4">
                  <span className="text-xs font-bold text-gray-600">Center Disbursement Rate</span>
                  <div className="mt-1 text-2xl font-black text-blue-800">
                    {totalCommittedBudget > 0 ? Math.round((totalPaidAmount / totalCommittedBudget) * 100) : 0}%
                  </div>
                  <span className="mt-0.5 block text-[10px] text-gray-500">Of committed daily budget</span>
                </div>
              </div>
            </div>

            {/* Comprehensive Table */}
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                <div>
                  <h3 className="text-base font-bold text-gray-900">Farmer-wise Transaction Ledger & Payment Tracking</h3>
                  <p className="text-xs text-gray-500">Full audit trail of bank transfers, transaction IDs, SMS alerts, and operator-controlled payment stages.</p>
                </div>
              </div>

              <div className="mt-5 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-gray-200 text-[11px] font-bold text-gray-400 uppercase">
                      <th className="pb-3 pl-2">Farmer & Token</th>
                      <th className="pb-3">Crop / Net Qtl</th>
                      <th className="pb-3">Bank Account & IFSC</th>
                      <th className="pb-3">Payment Process Stage</th>
                      <th className="pb-3">Transaction / UTR Reference</th>
                      <th className="pb-3">Total Payable</th>
                      <th className="pb-3">Payment Status & SMS</th>
                      <th className="pb-3 pr-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {appointments.map((apt) => {
                      const netQtl = parseFloat(apt.scale.netWeightQtl || apt.estimatedQtl);
                      return (
                        <tr key={apt.id} className="hover:bg-gray-50">
                          <td className="py-3.5 pl-2 font-bold text-gray-900">
                            {apt.farmerName}
                            <span className="block text-[11px] font-semibold text-emerald-800">{apt.tokenId}</span>
                          </td>
                          <td className="py-3.5">
                            <div className="font-semibold text-gray-800">{apt.crop}</div>
                            <div className="text-[11px] text-gray-500">{netQtl} Qtl @ ₹{apt.mspRatePerQtl}/Qtl</div>
                          </td>
                          
                          {/* Full Bank Account Details */}
                          <td className="py-3.5">
                            <div className="font-bold text-gray-900">{apt.bankDetails.bankName}</div>
                            <div className="font-mono text-[11px] font-black text-gray-800">A/C: {apt.bankDetails.accountNumber}</div>
                            <div className="text-[11px] text-gray-500">IFSC: <span className="font-semibold text-gray-700">{apt.bankDetails.ifsc}</span></div>
                          </td>

                          {/* Payment Process Stage Tracker (Operator Modifiable) */}
                          <td className="py-3.5">
                            <div className="flex items-center gap-1.5">
                              <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold ${
                                apt.paymentStage === 'Settled to Bank'
                                  ? 'bg-purple-100 text-purple-800'
                                  : apt.paymentStage === 'Treasury Approved'
                                  ? 'bg-blue-100 text-blue-800'
                                  : apt.paymentStage === 'Weighment Logged'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-gray-100 text-gray-700'
                              }`}>
                                {apt.paymentStage || 'Token Generated'}
                              </span>
                              <button
                                type="button"
                                title="Update Payment Process Stage"
                                onClick={() => openStageModal(apt)}
                                className="text-gray-400 hover:text-emerald-700"
                              >
                                <Sliders className="h-3 w-3" />
                              </button>
                            </div>
                          </td>

                          {/* Stored Transaction ID & Bank UTR */}
                          <td className="py-3.5">
                            {apt.paymentTxnId ? (
                              <div className="space-y-0.5">
                                <div className="flex items-center gap-1.5 font-mono text-[11px] font-extrabold text-emerald-900">
                                  <span>{apt.paymentTxnId}</span>
                                  <button
                                    type="button"
                                    title="Edit Transaction ID"
                                    onClick={() => openEditTxnModal(apt)}
                                    className="text-gray-400 hover:text-emerald-700"
                                  >
                                    <Edit3 className="h-3 w-3" />
                                  </button>
                                </div>
                                {apt.bankReferenceNo && (
                                  <div className="font-mono text-[10px] text-gray-500">
                                    UTR: {apt.bankReferenceNo}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => openEditTxnModal(apt)}
                                className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:underline"
                              >
                                <Edit3 className="h-3 w-3" />
                                + Store Txn No.
                              </button>
                            )}
                          </td>

                          <td className="py-3.5">
                            <div className="font-black text-sm text-[#14532d]">
                              ₹{apt.calculatedPayout.toLocaleString()}
                            </div>
                          </td>

                          {/* Status & SMS Sent Pill */}
                          <td className="py-3.5">
                            {apt.paymentStatus === 'Paid' ? (
                              <div className="space-y-1">
                                <span className="inline-flex items-center gap-1 rounded bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-800">
                                  <CheckCircle2 className="h-3 w-3" /> Transferred
                                </span>
                                {apt.paymentSmsSent ? (
                                  <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700">
                                    <MessageSquare className="h-3 w-3" /> SMS Sent
                                  </span>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => handleSendPaymentSms(apt)}
                                    className="block text-[10px] font-bold text-amber-700 hover:underline"
                                  >
                                    + Send SMS Now
                                  </button>
                                )}
                              </div>
                            ) : apt.paymentStatus === 'Failed' ? (
                              <div>
                                <span className="inline-flex items-center gap-1 rounded bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-800">
                                  <XCircle className="h-3 w-3" /> Failed / Canceled
                                </span>
                                <span className="block text-[10px] text-red-600 font-medium">{apt.failureReason}</span>
                              </div>
                            ) : (
                              <span className="rounded bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                                Ready for Transfer
                              </span>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 pr-2 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {apt.paymentStatus === 'Paid' ? (
                                <button
                                  type="button"
                                  onClick={() => openCancelPaymentModal(apt)}
                                  className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-2.5 py-1.5 text-[10px] font-bold text-red-700 hover:bg-red-100"
                                  title="Cancel payment if transaction failed or bounced"
                                >
                                  <RotateCcw className="h-3 w-3" /> Cancel
                                </button>
                              ) : (
                                <button
                                  onClick={() => openPaymentModal(apt)}
                                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#14532d] px-3.5 py-1.5 text-[11px] font-bold text-white shadow-sm hover:bg-[#0f3e21]"
                                >
                                  <IndianRupee className="h-3.5 w-3.5" />
                                  {apt.paymentStatus === 'Failed' ? 'Retry Payment' : 'Give Payment'}
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* Tab 3: Single Global Capacity Setting (One Overall Store Capacity) */}
        {activeTab === 'capacity' && (
          <div className="mt-6 space-y-6">
            
            {/* Live Visual Capacity Card */}
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <h2 className="text-base font-bold text-gray-900">Center Storage Space Overview</h2>
                  <p className="text-xs text-gray-500">Live storage space vs total center capacity set by operator.</p>
                </div>
                <div className="rounded-xl bg-emerald-50 px-3.5 py-1.5 text-xs font-bold text-[#14532d]">
                  Remaining Buffer Space: {(totalCapacityQtl - totalStockQtl).toLocaleString()} Quintals
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-gray-100 bg-[#f8faf7] p-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-900">Total Mandi Warehouse Storage</span>
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-800">
                    {totalFilledPct}% Stocked
                  </span>
                </div>

                <div className="mt-4 flex items-baseline justify-between text-xs">
                  <span className="text-gray-500">Currently Stocked:</span>
                  <span className="text-sm font-black text-gray-900">{totalStockQtl.toLocaleString()} / {totalCapacityQtl.toLocaleString()} Quintals</span>
                </div>

                <div className="mt-2 h-3.5 w-full rounded-full bg-gray-200 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#14532d] transition-all duration-500"
                    style={{ width: `${totalFilledPct}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Operator Form: Single All-over Store Capacity Setter */}
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-[#14532d]">
                  <Settings2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">Set Today's Total Store Capacity (All-over)</h3>
                  <p className="text-xs text-gray-500">Define the single total center capacity ceiling for all crop intakes today.</p>
                </div>
              </div>

              <form onSubmit={handleSaveTotalCapacity} className="mt-6 space-y-4 max-w-md">
                <div>
                  <label className="text-xs font-bold text-gray-800">Overall Mandi Capacity Limit (Quintals)</label>
                  <div className="relative mt-1.5">
                    <Warehouse className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="number"
                      step="100"
                      min="100"
                      required
                      value={capacityInput}
                      onChange={(e) => setCapacityInput(e.target.value)}
                      placeholder="e.g. 15000"
                      className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm font-black text-gray-900 focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-xl bg-[#14532d] px-5 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-[#0f3e21]"
                >
                  <Save className="h-4 w-4 text-[#00e699]" />
                  Save & Apply Store Limit
                </button>
              </form>
            </div>

          </div>
        )}

      </main>
    </div>
  );
}