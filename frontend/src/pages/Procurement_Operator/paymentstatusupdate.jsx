import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  Receipt,
  ArrowLeft,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  CreditCard,
  Send,
  Download,
  Landmark,
  Eye,
  CheckCheck,
  RefreshCw,
  Sliders,
  DollarSign,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  FileSpreadsheet
} from 'lucide-react';

const initialSettlementRecords = [
  {
    id: 'SET-2026-9041',
    tokenId: 'TKN-2026-8837',
    farmerName: 'Baldev Singh',
    phone: '+91 98765 11001',
    crop: 'Wheat (Grade A)',
    quantityQtl: 45.0,
    baseMspRate: 2275,
    grossAmount: 102375,
    deductions: 0,
    netPayable: 102375,
    jFormNumber: 'JF-HR-2026-883701',
    bankName: 'State Bank of India',
    bankAccountMasked: 'SBIN0001234 (A/C ****4821)',
    dbtStatus: 'Pending Clearance', // 'Pending Clearance' | 'Disbursed' | 'Processing Bank'
    pfmsBatchId: null,
    utrNumber: null,
    isJFormGenerated: true
  },
  {
    id: 'SET-2026-9042',
    tokenId: 'TKN-2026-8838',
    farmerName: 'Gurpreet Singh',
    phone: '+91 94160 22334',
    crop: 'Wheat (Grade A)',
    quantityQtl: 40.0,
    baseMspRate: 2275,
    grossAmount: 91000,
    deductions: 350, // Moisture penalty deduction
    netPayable: 90650,
    jFormNumber: 'JF-HR-2026-883802',
    bankName: 'Punjab National Bank',
    bankAccountMasked: 'PUNB0109200 (A/C ****9912)',
    dbtStatus: 'Pending Clearance',
    pfmsBatchId: null,
    utrNumber: null,
    isJFormGenerated: true
  },
  {
    id: 'SET-2026-9043',
    tokenId: 'TKN-2026-8841',
    farmerName: 'Ramesh Patel',
    phone: '+91 98765 43210',
    crop: 'Wheat (Grade A)',
    quantityQtl: 45.0,
    baseMspRate: 2275,
    grossAmount: 102375,
    deductions: 0,
    netPayable: 102375,
    jFormNumber: 'JF-HR-2026-884103',
    bankName: 'State Bank of India',
    bankAccountMasked: 'SBIN0004411 (A/C ****3301)',
    dbtStatus: 'Disbursed',
    pfmsBatchId: 'PFMS-BATCH-2026-0831',
    utrNumber: 'PFMS202608310099412',
    isJFormGenerated: true,
    disbursedAt: '10:45 AM'
  },
  {
    id: 'SET-2026-9044',
    tokenId: 'TKN-2026-8845',
    farmerName: 'Satish Kumar',
    phone: '+91 98120 77889',
    crop: 'Mustard Seeds',
    quantityQtl: 25.0,
    baseMspRate: 5650,
    grossAmount: 141250,
    deductions: 0,
    netPayable: 141250,
    jFormNumber: 'JF-HR-2026-884504',
    bankName: 'HDFC Bank',
    bankAccountMasked: 'HDFC0001090 (A/C ****7714)',
    dbtStatus: 'Processing Bank',
    pfmsBatchId: 'PFMS-BATCH-2026-0830',
    utrNumber: 'Awaiting Bank Response',
    isJFormGenerated: true,
    disbursedAt: '09:15 AM'
  }
];

export default function PaymentPushDbtSync() {
  const navigate = useNavigate();
  const [settlementList, setSettlementList] = useState(initialSettlementRecords);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState('all'); // 'all' | 'pending' | 'disbursed'
  
  // Modal & Push States
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [isProcessingPush, setIsProcessingPush] = useState(false);

  // Totals calculations
  const totalDisbursedToday = settlementList
    .filter((s) => s.dbtStatus === 'Disbursed')
    .reduce((acc, curr) => acc + curr.netPayable, 0);

  const pendingDisbursement = settlementList
    .filter((s) => s.dbtStatus === 'Pending Clearance')
    .reduce((acc, curr) => acc + curr.netPayable, 0);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handlePushPayment = () => {
    if (!selectedRecord) return;
    setIsProcessingPush(true);

    setTimeout(() => {
      const generatedUtr = `PFMS20260901${Math.floor(100000 + Math.random() * 900000)}`;
      const generatedBatch = `PFMS-BATCH-2026-${Math.floor(1000 + Math.random() * 9000)}`;

      setSettlementList((prev) =>
        prev.map((item) =>
          item.id === selectedRecord.id
            ? {
                ...item,
                dbtStatus: 'Disbursed',
                utrNumber: generatedUtr,
                pfmsBatchId: generatedBatch,
                disbursedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              }
            : item
        )
      );

      setIsProcessingPush(false);
      showToast(`DBT Payment of ₹${selectedRecord.netPayable.toLocaleString('en-IN')} pushed to ${selectedRecord.farmerName}! Live status synced.`);
      setSelectedRecord(null);
    }, 800);
  };

  const filteredList = settlementList.filter((item) => {
    const matchesSearch =
      item.farmerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tokenId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.jFormNumber.toLowerCase().includes(searchQuery.toLowerCase());

    if (filterMode === 'pending') return matchesSearch && item.dbtStatus === 'Pending Clearance';
    if (filterMode === 'disbursed') return matchesSearch && item.dbtStatus === 'Disbursed';
    return matchesSearch;
  });

  return (
    <div className="relative min-h-screen w-full bg-[#f6f9f5] font-sans text-gray-800 antialiased selection:bg-emerald-200 selection:text-emerald-900">
      
      {/* Background Soft Glow */}
      <div 
        className="pointer-events-none absolute inset-0 z-0 h-[420px] w-full bg-cover bg-center opacity-85"
        style={{
          backgroundImage: `radial-gradient(ellipse at 50% 10%, rgba(212, 245, 195, 0.55) 0%, rgba(246, 249, 245, 1) 75%)`
        }}
      />

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-emerald-900/5 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5 lg:px-12">
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/operatordashboard')} 
              className="rounded-xl border border-gray-200 bg-white p-2 text-gray-600 shadow-sm transition hover:bg-gray-50 hover:text-gray-900"
              aria-label="Back to Operator Console"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#14532d] text-white shadow-sm">
                <Building2 className="h-4 w-4 text-emerald-400" />
              </div>
              <div>
                <span className="block text-base font-extrabold leading-tight tracking-tight text-[#14532d]">
                  SmartProcure <span className="text-xs font-semibold text-emerald-700 uppercase">| Finance Terminal</span>
                </span>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                  Payment Push & DBT Status Synchronizer
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-[#14532d] sm:inline-flex">
              <Landmark className="h-3.5 w-3.5 text-emerald-600" />
              PFMS Gateway: Connected
            </span>
          </div>
        </div>
      </header>

      {/* Toast Alert */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 right-6 z-50 flex items-center gap-2.5 rounded-2xl bg-[#14532d] px-5 py-3 text-xs font-bold text-white shadow-xl"
          >
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Container */}
      <main className="relative z-10 mx-auto max-w-7xl px-6 pt-6 pb-16 lg:px-12">
        
        {/* Banner Section */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-emerald-900/10 bg-gradient-to-br from-[#14532d] via-[#166534] to-[#0f3e21] p-6 text-white shadow-xl lg:p-8"
        >
          <div className="grid items-center gap-6 lg:grid-cols-12">
            
            <div className="lg:col-span-7">
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-200 backdrop-blur-sm">
                <Receipt className="h-3.5 w-3.5 text-emerald-300" />
                Digital J-Form Emission & PFMS Clearing Hub
              </span>

              <h1 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl lg:text-4xl">
                Payment Push & DBT Status Sync
              </h1>
              <p className="mt-2 max-w-lg text-xs leading-relaxed text-emerald-100 sm:text-sm">
                Clear certified digital J-Forms, trigger direct MSP bank transfers via PFMS, and broadcast real-time disbursement receipts to farmer accounts.
              </p>
            </div>

            {/* Live Financial Metrics */}
            <div className="lg:col-span-5">
              <div className="grid grid-cols-2 gap-3.5">
                <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-md">
                  <span className="block text-[11px] font-bold uppercase text-emerald-200">Settled Today</span>
                  <span className="mt-1 block text-2xl font-black text-white">₹{totalDisbursedToday.toLocaleString('en-IN')}</span>
                  <span className="mt-0.5 block text-[10px] text-emerald-300">Live UTR confirmed</span>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-md">
                  <span className="block text-[11px] font-bold uppercase text-emerald-200">Pending Approval</span>
                  <span className="mt-1 block text-2xl font-black text-white">₹{pendingDisbursement.toLocaleString('en-IN')}</span>
                  <span className="mt-0.5 block text-[10px] text-emerald-300">Awaiting Operator Push</span>
                </div>
              </div>
            </div>

          </div>
        </motion.div>

        {/* Filter & Search Bar */}
        <div className="mt-8 flex flex-col justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
          
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Farmer Name, Token ID, or J-Form No..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2 pl-9 pr-4 text-xs text-gray-900 focus:border-emerald-600 focus:bg-white focus:outline-none"
            />
          </div>

          <div className="flex gap-1.5 rounded-xl bg-gray-100 p-1 text-xs font-bold">
            <button
              onClick={() => setFilterMode('all')}
              className={`rounded-lg px-3 py-1.5 transition ${
                filterMode === 'all' ? 'bg-white text-[#14532d] shadow-sm' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              All Records ({settlementList.length})
            </button>
            <button
              onClick={() => setFilterMode('pending')}
              className={`rounded-lg px-3 py-1.5 transition ${
                filterMode === 'pending' ? 'bg-white text-amber-800 shadow-sm' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Pending Approval
            </button>
            <button
              onClick={() => setFilterMode('disbursed')}
              className={`rounded-lg px-3 py-1.5 transition ${
                filterMode === 'disbursed' ? 'bg-white text-[#14532d] shadow-sm' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Disbursed (DBT Sent)
            </button>
          </div>

        </div>

        {/* Settlement Cards List */}
        <div className="mt-6 space-y-4">
          {filteredList.map((record) => {
            const isDisbursed = record.dbtStatus === 'Disbursed';
            const isPending = record.dbtStatus === 'Pending Clearance';

            return (
              <motion.div
                key={record.id}
                whileHover={{ y: -2 }}
                className={`flex flex-col justify-between gap-4 rounded-2xl border p-5 shadow-sm transition sm:flex-row sm:items-center sm:p-6 ${
                  isDisbursed
                    ? 'border-gray-200 bg-white'
                    : isPending
                    ? 'border-amber-200 bg-amber-50/40 ring-1 ring-amber-400/20'
                    : 'border-blue-200 bg-blue-50/30'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
                    isDisbursed ? 'bg-emerald-50 text-emerald-700' : isPending ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {isDisbursed ? <CheckCheck className="h-6 w-6" /> : <Receipt className="h-6 w-6" />}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-bold text-gray-900">{record.farmerName}</h3>
                      <span className="rounded-md bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-700">
                        {record.jFormNumber}
                      </span>
                      <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold ${
                        isDisbursed
                          ? 'bg-emerald-100 text-emerald-800'
                          : isPending
                          ? 'bg-amber-100 text-amber-800 font-extrabold'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {record.dbtStatus}
                      </span>
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                      <span>Token: <strong className="text-gray-700">{record.tokenId}</strong></span>
                      <span>•</span>
                      <span>Crop: <strong className="text-gray-700">{record.crop} ({record.quantityQtl} Qtl)</strong></span>
                      <span>•</span>
                      <span>MSP Rate: <strong className="text-gray-700">₹{record.baseMspRate}/Qtl</strong></span>
                    </div>

                    <div className="mt-2 text-xs text-gray-600">
                      <span>Linked Bank: <strong>{record.bankName}</strong> — {record.bankAccountMasked}</span>
                      {record.utrNumber && (
                        <span className="block mt-0.5 text-[11px] text-gray-400">
                          UTR / Ref: <strong>{record.utrNumber}</strong> ({record.pfmsBatchId})
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Amount & Action */}
                <div className="flex flex-col items-end justify-between gap-3 border-t border-gray-100 pt-3 sm:border-0 sm:pt-0">
                  <div className="sm:text-right">
                    <span className="block text-[11px] font-semibold text-gray-400">Net Payable Amount</span>
                    <span className="text-xl font-black text-[#14532d]">
                      ₹{record.netPayable.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedRecord(record)}
                      className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition shadow-sm ${
                        isPending
                          ? 'bg-[#14532d] text-white hover:bg-[#0f3e21]'
                          : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {isPending ? (
                        <>
                          <Send className="h-3.5 w-3.5" />
                          Approve & Push DBT
                        </>
                      ) : (
                        <>
                          <Eye className="h-3.5 w-3.5" />
                          View J-Form Receipt
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </main>

      {/* Modal: J-Form & Direct Bank Push Dispatcher */}
      <AnimatePresence>
        {selectedRecord && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-lg rounded-3xl border border-gray-200 bg-white p-6 shadow-2xl sm:p-8"
            >
              <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-[#14532d]">
                  <Receipt className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-gray-900">
                    {selectedRecord.dbtStatus === 'Pending Clearance'
                      ? 'Confirm & Push DBT Payment'
                      : 'Certified J-Form Receipt'}
                  </h2>
                  <p className="text-xs text-gray-500">
                    {selectedRecord.farmerName} • {selectedRecord.jFormNumber}
                  </p>
                </div>
              </div>

              {/* J-Form Breakdown Table */}
              <div className="mt-5 space-y-2.5 text-xs">
                <div className="flex justify-between border-b border-gray-50 py-1.5">
                  <span className="text-gray-500">Token ID</span>
                  <span className="font-bold text-gray-900">{selectedRecord.tokenId}</span>
                </div>
                <div className="flex justify-between border-b border-gray-50 py-1.5">
                  <span className="text-gray-500">Crop Procured</span>
                  <span className="font-bold text-gray-900">{selectedRecord.crop}</span>
                </div>
                <div className="flex justify-between border-b border-gray-50 py-1.5">
                  <span className="text-gray-500">Certified Weight</span>
                  <span className="font-bold text-gray-900">{selectedRecord.quantityQtl} Quintals</span>
                </div>
                <div className="flex justify-between border-b border-gray-50 py-1.5">
                  <span className="text-gray-500">MSP Base Rate</span>
                  <span className="font-bold text-gray-900">₹{selectedRecord.baseMspRate} / Qtl</span>
                </div>
                <div className="flex justify-between border-b border-gray-50 py-1.5">
                  <span className="text-gray-500">Gross Calculated Total</span>
                  <span className="font-bold text-gray-900">₹{selectedRecord.grossAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between border-b border-gray-50 py-1.5">
                  <span className="text-gray-500">Deductions (Moisture/Dockage)</span>
                  <span className="font-bold text-red-600">- ₹{selectedRecord.deductions}</span>
                </div>
                <div className="flex justify-between border-t border-gray-100 pt-2 text-sm">
                  <span className="font-bold text-gray-900">Total Net Disbursement</span>
                  <span className="font-black text-[#14532d]">₹{selectedRecord.netPayable.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Destination Bank Account Card */}
              <div className="mt-5 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4 text-xs">
                <div className="flex items-center gap-2 font-bold text-emerald-900">
                  <Landmark className="h-4 w-4 text-emerald-700" />
                  Target DBT Account Verified
                </div>
                <div className="mt-2 space-y-1 text-gray-600 text-[11px]">
                  <div>Bank: <strong>{selectedRecord.bankName}</strong></div>
                  <div>Account: <strong>{selectedRecord.bankAccountMasked}</strong></div>
                  <div>PFMS Ref: <strong>{selectedRecord.utrNumber || 'Ready for Batch Push'}</strong></div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="mt-6 flex gap-3">
                {selectedRecord.dbtStatus === 'Pending Clearance' ? (
                  <button
                    onClick={handlePushPayment}
                    disabled={isProcessingPush}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#14532d] py-2.5 text-xs font-bold text-white transition hover:bg-[#0f3e21] disabled:opacity-50"
                  >
                    {isProcessingPush ? (
                      <>
                        <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                        Transmitting to PFMS Bank Gateway...
                      </>
                    ) : (
                      <>
                        <Send className="h-3.5 w-3.5" />
                        Authorize & Push DBT Payment
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      alert(`Downloading certified J-Form PDF: ${selectedRecord.jFormNumber}`);
                      setSelectedRecord(null);
                    }}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#14532d] py-2.5 text-xs font-bold text-white transition hover:bg-[#0f3e21]"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Download J-Form PDF
                  </button>
                )}

                <button
                  onClick={() => setSelectedRecord(null)}
                  className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}