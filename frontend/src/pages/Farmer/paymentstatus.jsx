import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sprout,
  ArrowLeft,
  Search,
  Download,
  CheckCircle2,
  Clock,
  AlertCircle,
  Building2,
  Receipt,
  Eye,
  X,
  CreditCard,
  Landmark,
  FileSpreadsheet,
  CheckCheck,
  Calendar,
  Layers
} from 'lucide-react';

const mockPaymentRecords = [
  {
    id: 'PAY-2026-9041',
    jFormNo: 'JF-HR-2026-44120',
    tokenId: 'TKN-2026-8841',
    crop: 'Wheat (Grade A)',
    quantity: '45 Quintals',
    ratePerQtl: 2275,
    grossAmount: 102375,
    deductions: 0,
    netAmount: 102375,
    date: '28 Aug 2026',
    mandiName: 'Karnal APMC Main Yard',
    status: 'Transferred',
    utrNumber: 'PFMS202608280091823',
    bankAccount: 'State Bank of India (Ending in **4821)',
    dbtStatus: 'Credited directly via PFMS / DBT gateway'
  },
  {
    id: 'PAY-2026-8712',
    jFormNo: 'JF-HR-2026-39811',
    tokenId: 'TKN-2026-7732',
    crop: 'Mustard Seeds',
    quantity: '22 Quintals',
    ratePerQtl: 5650,
    grossAmount: 124300,
    deductions: 450,
    netAmount: 123850,
    date: '14 May 2026',
    mandiName: 'Karnal APMC Yard 02',
    status: 'Transferred',
    utrNumber: 'PFMS202605149921041',
    bankAccount: 'Punjab National Bank (Ending in **1190)',
    dbtStatus: 'Credited directly via PFMS / DBT gateway'
  },
  {
    id: 'PAY-2026-9114',
    jFormNo: 'JF-HR-2026-45501',
    tokenId: 'TKN-2026-9011',
    crop: 'Paddy (Common)',
    quantity: '50 Quintals',
    ratePerQtl: 2183,
    grossAmount: 109150,
    deductions: 0,
    netAmount: 109150,
    date: '31 Aug 2026',
    mandiName: 'Karnal APMC Main Yard',
    status: 'Processing',
    utrNumber: 'Awaiting Bank Clearance',
    bankAccount: 'State Bank of India (Ending in **4821)',
    dbtStatus: 'J-Form certified by Operator; payment queued in PFMS batch'
  }
];

export default function FarmerPaymentHistory() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  const filteredPayments = mockPaymentRecords.filter((item) => {
    const matchesSearch =
      item.jFormNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tokenId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.crop.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (statusFilter === 'all') return matchesSearch;
    return matchesSearch && item.status.toLowerCase() === statusFilter.toLowerCase();
  });

  const totalDisbursed = mockPaymentRecords
    .filter((item) => item.status === 'Transferred')
    .reduce((acc, curr) => acc + curr.netAmount, 0);

  return (
    <div className="relative min-h-screen w-full bg-[#f6f9f5] font-sans text-gray-800 antialiased selection:bg-emerald-200 selection:text-emerald-900">
      
      {/* Background Subtle Accent */}
      <div 
        className="pointer-events-none absolute inset-0 z-0 h-[400px] w-full bg-cover bg-center opacity-85"
        style={{
          backgroundImage: `radial-gradient(ellipse at 50% 10%, rgba(212, 245, 195, 0.55) 0%, rgba(246, 249, 245, 1) 75%)`
        }}
      />

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-emerald-900/5 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5 lg:px-12">
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/farmerhome')} 
              className="rounded-xl border border-gray-200 bg-white p-2 text-gray-600 shadow-sm transition hover:bg-gray-50 hover:text-gray-900"
              aria-label="Back to Home"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#14532d] text-white shadow-sm">
                <Sprout className="h-4 w-4 text-emerald-400" />
              </div>
              <div>
                <span className="block text-base font-extrabold leading-tight tracking-tight text-[#14532d]">
                  SmartProcure
                </span>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                  Farmer Payment & J-Form Hub
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-gray-600">
            <span className="rounded-full bg-emerald-50 px-3 py-1 font-bold text-[#14532d]">
              DBT Linked Mode
            </span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 mx-auto max-w-7xl px-6 pt-6 pb-16 lg:px-12">
        
        {/* Top Summary Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-emerald-900/10 bg-gradient-to-br from-[#14532d] via-[#166534] to-[#0f3e21] p-6 text-white shadow-xl lg:p-8"
        >
          <div className="grid items-center gap-6 lg:grid-cols-12">
            
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-200 backdrop-blur-sm">
                <CheckCheck className="h-3.5 w-3.5 text-emerald-400" />
                Direct Benefit Transfer (DBT) Portal
              </div>

              <h1 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl lg:text-4xl">
                Payment Status & Receipts
              </h1>
              <p className="mt-2 max-w-lg text-xs leading-relaxed text-emerald-100 sm:text-sm">
                Track your certified mandi weighments, direct MSP disbursements, and download digital J-Form payment receipts.
              </p>
            </div>

            {/* Quick Summary Cards */}
            <div className="lg:col-span-5">
              <div className="grid grid-cols-2 gap-3.5">
                <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-md">
                  <span className="block text-[11px] font-bold uppercase text-emerald-200">Total Settled (MSP)</span>
                  <span className="mt-1 block text-2xl font-black text-white">₹{totalDisbursed.toLocaleString('en-IN')}</span>
                  <span className="mt-0.5 block text-[10px] text-emerald-300">Directly into linked bank</span>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-md">
                  <span className="block text-[11px] font-bold uppercase text-emerald-200">Payment Pipeline</span>
                  <span className="mt-1 block text-2xl font-black text-white">24 - 48 Hrs</span>
                  <span className="mt-0.5 block text-[10px] text-emerald-300">Standard PFMS SLA</span>
                </div>
              </div>
            </div>

          </div>
        </motion.div>

        {/* Filter and Search Bar */}
        <div className="mt-8 flex flex-col justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
          
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by J-Form No, Token ID, or Crop name..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2 pl-9 pr-4 text-xs text-gray-900 focus:border-emerald-600 focus:bg-white focus:outline-none"
            />
          </div>

          <div className="flex gap-1.5 rounded-xl bg-gray-100 p-1 text-xs font-bold">
            <button
              onClick={() => setStatusFilter('all')}
              className={`rounded-lg px-3 py-1.5 transition ${
                statusFilter === 'all' ? 'bg-white text-[#14532d] shadow-sm' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              All Records
            </button>
            <button
              onClick={() => setStatusFilter('transferred')}
              className={`rounded-lg px-3 py-1.5 transition ${
                statusFilter === 'transferred' ? 'bg-white text-[#14532d] shadow-sm' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Settled
            </button>
            <button
              onClick={() => setStatusFilter('processing')}
              className={`rounded-lg px-3 py-1.5 transition ${
                statusFilter === 'processing' ? 'bg-white text-[#14532d] shadow-sm' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Processing
            </button>
          </div>
        </div>

        {/* Payment History List */}
        <div className="mt-6 space-y-4">
          {filteredPayments.length > 0 ? (
            filteredPayments.map((record) => {
              const isSettled = record.status === 'Transferred';

              return (
                <motion.div
                  key={record.id}
                  whileHover={{ y: -2 }}
                  className="flex flex-col justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition sm:flex-row sm:items-center sm:p-6"
                >
                  <div className="flex items-start gap-4">
                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                      isSettled ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                    }`}>
                      <Receipt className="h-5 w-5" />
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-bold text-gray-900">{record.crop}</h3>
                        <span className="rounded-md bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-700">
                          {record.jFormNo}
                        </span>
                        <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold ${
                          isSettled ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {isSettled ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                          {record.status}
                        </span>
                      </div>

                      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                        <span>Quantity: <strong className="text-gray-700">{record.quantity}</strong></span>
                        <span>•</span>
                        <span>Date: <strong className="text-gray-700">{record.date}</strong></span>
                        <span>•</span>
                        <span>Mandi: <strong className="text-gray-700">{record.mandiName}</strong></span>
                      </div>

                      <p className="mt-1.5 text-[11px] text-gray-400">
                        {record.dbtStatus}
                      </p>
                    </div>
                  </div>

                  {/* Right side amount & action */}
                  <div className="flex items-center justify-between border-t border-gray-100 pt-3 sm:flex-col sm:items-end sm:border-0 sm:pt-0">
                    <div className="sm:text-right">
                      <span className="block text-[11px] font-semibold text-gray-400">Disbursed MSP Amount</span>
                      <span className="text-lg font-black text-[#14532d]">
                        ₹{record.netAmount.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="mt-2 flex gap-2">
                      <button
                        onClick={() => setSelectedReceipt(record)}
                        className="flex items-center gap-1.5 rounded-lg border border-emerald-900/10 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-[#14532d] transition hover:bg-emerald-100"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        View e-Receipt
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white/50 p-12 text-center">
              <Receipt className="mx-auto h-8 w-8 text-gray-400" />
              <p className="mt-2 text-xs font-bold text-gray-700">No payment receipts found.</p>
              <p className="text-[11px] text-gray-500">Try adjusting your search query or filter settings.</p>
            </div>
          )}
        </div>

      </main>

      {/* Modal: Digital J-Form Receipt Preview */}
      <AnimatePresence>
        {selectedReceipt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-lg rounded-3xl border border-gray-200 bg-white p-6 shadow-2xl sm:p-8"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedReceipt(null)}
                className="absolute right-5 top-5 rounded-full bg-gray-100 p-1.5 text-gray-500 hover:bg-gray-200"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Receipt Header */}
              <div className="border-b border-gray-100 pb-4 text-center">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-[#14532d] text-white">
                  <Sprout className="h-5 w-5 text-emerald-400" />
                </div>
                <span className="mt-2 block text-xs font-bold tracking-wider text-emerald-700 uppercase">
                  Government e-Procurement Receipt (J-Form)
                </span>
                <h2 className="text-base font-black text-gray-900">{selectedReceipt.jFormNo}</h2>
                <span className="text-[11px] text-gray-400">Issued by: {selectedReceipt.mandiName}</span>
              </div>

              {/* Receipt Breakdown */}
              <div className="mt-4 space-y-2.5 text-xs">
                <div className="flex justify-between border-b border-gray-50 py-1.5">
                  <span className="text-gray-500">Token Number</span>
                  <span className="font-bold text-gray-900">{selectedReceipt.tokenId}</span>
                </div>
                <div className="flex justify-between border-b border-gray-50 py-1.5">
                  <span className="text-gray-500">Commodity / Crop</span>
                  <span className="font-bold text-gray-900">{selectedReceipt.crop}</span>
                </div>
                <div className="flex justify-between border-b border-gray-50 py-1.5">
                  <span className="text-gray-500">Certified Weight</span>
                  <span className="font-bold text-gray-900">{selectedReceipt.quantity}</span>
                </div>
                <div className="flex justify-between border-b border-gray-50 py-1.5">
                  <span className="text-gray-500">MSP Base Rate</span>
                  <span className="font-bold text-gray-900">₹{selectedReceipt.ratePerQtl} / Qtl</span>
                </div>
                <div className="flex justify-between border-b border-gray-50 py-1.5">
                  <span className="text-gray-500">Gross Value</span>
                  <span className="font-bold text-gray-900">₹{selectedReceipt.grossAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between border-b border-gray-50 py-1.5">
                  <span className="text-gray-500">Deductions (Tolerances/Handling)</span>
                  <span className="font-bold text-red-600">- ₹{selectedReceipt.deductions}</span>
                </div>
                <div className="flex justify-between border-t border-gray-100 pt-2 text-sm">
                  <span className="font-bold text-gray-900">Net Payable Amount</span>
                  <span className="font-black text-[#14532d]">₹{selectedReceipt.netAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Direct Benefit Transfer Metadata */}
              <div className="mt-5 rounded-xl border border-emerald-100 bg-emerald-50/60 p-3.5 text-xs">
                <span className="block font-bold text-emerald-900">Direct Bank Settlement Details</span>
                <span className="mt-1 block text-[11px] text-gray-600">Credit Account: <strong>{selectedReceipt.bankAccount}</strong></span>
                <span className="block text-[11px] text-gray-600">PFMS / UTR Ref: <strong>{selectedReceipt.utrNumber}</strong></span>
              </div>

              {/* Modal Actions */}
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => alert(`Downloading J-Form PDF: ${selectedReceipt.jFormNo}`)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#14532d] py-2.5 text-xs font-bold text-white transition hover:bg-[#0f3e21]"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download PDF Receipt
                </button>
                <button
                  onClick={() => setSelectedReceipt(null)}
                  className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}