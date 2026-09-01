import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  CalendarCheck,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronRight,
  Filter,
  ArrowLeft,
  Users,
  Wheat,
  Truck,
  Sliders,
  BellRing,
  Send,
  Calendar,
  AlertCircle
} from 'lucide-react';

const initialBookingRequests = [
  {
    id: 'REQ-2026-1081',
    tokenId: 'TKN-2026-8850',
    farmerName: 'Harpreet Singh',
    phone: '+91 98765 11223',
    crop: 'Wheat (Grade A)',
    quantity: '55 Quintals',
    vehicleNo: 'HR-05-AA-4431',
    requestedDate: 'Today, 31 Aug 2026',
    requestedWindow: '11:00 AM – 12:30 PM',
    allocatedBay: 'Bay 01',
    status: 'Pending', // 'Pending' | 'Approved' | 'Rescheduled' | 'Rejected'
    notes: 'Kharif season registration verified'
  },
  {
    id: 'REQ-2026-1082',
    tokenId: 'TKN-2026-8851',
    farmerName: 'Sunita Devi',
    phone: '+91 94160 88219',
    crop: 'Mustard Seeds',
    quantity: '30 Quintals',
    vehicleNo: 'HR-05-BC-7819',
    requestedDate: 'Today, 31 Aug 2026',
    requestedWindow: '12:30 PM – 02:00 PM',
    allocatedBay: 'Bay 02',
    status: 'Pending',
    notes: 'Moisture pre-check certificate attached'
  },
  {
    id: 'REQ-2026-1083',
    tokenId: 'TKN-2026-8841',
    farmerName: 'Ramesh Patel',
    phone: '+91 98765 43210',
    crop: 'Wheat (Grade A)',
    quantity: '45 Quintals',
    vehicleNo: 'HR-05-AB-1234',
    requestedDate: 'Today, 31 Aug 2026',
    requestedWindow: '10:00 AM – 11:30 AM',
    allocatedBay: 'Bay 02',
    status: 'Approved',
    notes: 'Token verified & broadcasted to farmer'
  },
  {
    id: 'REQ-2026-1084',
    tokenId: 'TKN-2026-8852',
    farmerName: 'Devendra Kumar',
    phone: '+91 98120 44901',
    crop: 'Paddy (Common)',
    quantity: '80 Quintals',
    vehicleNo: 'HR-05-XY-9012',
    requestedDate: 'Tomorrow, 01 Sep 2026',
    requestedWindow: '08:30 AM – 10:00 AM',
    allocatedBay: 'Bay 03',
    status: 'Pending',
    notes: 'High capacity vehicle load'
  }
];

export default function SlotApprove() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState(initialBookingRequests);
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'pending' | 'approved'
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal & Capacity adjustments
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [assignedWindow, setAssignedWindow] = useState('');
  const [assignedBay, setAssignedBay] = useState('Bay 01');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Yard capacity meters
  const totalCapacity = 400; // Quintals per hour
  const bookedCapacity = 275;
  const availableSlots = 8;

  const handleApprove = (req) => {
    setSelectedRequest(req);
    setAssignedWindow(req.requestedWindow);
    setAssignedBay(req.allocatedBay);
    setBroadcastMessage(`Your procurement slot for ${req.crop} (${req.quantity}) is confirmed at Karnal APMC Yard on ${req.requestedDate}.`);
  };

  const handleConfirmBroadcast = () => {
    if (!selectedRequest) return;
    
    setRequests((prev) =>
      prev.map((item) =>
        item.id === selectedRequest.id
          ? {
              ...item,
              status: 'Approved',
              requestedWindow: assignedWindow,
              allocatedBay: assignedBay
            }
          : item
      )
    );

    setSelectedRequest(null);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  const handleReject = (id) => {
    setRequests((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'Rejected' } : item))
    );
  };

  const filteredRequests = requests.filter((req) => {
    const matchesSearch =
      req.farmerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.tokenId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.vehicleNo.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeFilter === 'pending') return matchesSearch && req.status === 'Pending';
    if (activeFilter === 'approved') return matchesSearch && req.status === 'Approved';
    return matchesSearch;
  });

  return (
    <div className="relative min-h-screen w-full bg-[#f6f9f5] font-sans text-gray-800 antialiased selection:bg-emerald-200 selection:text-emerald-900">
      
      {/* Background Soft Glow */}
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
              onClick={() => navigate('/operatordashboard')} 
              className="rounded-xl border border-gray-200 bg-white p-2 text-gray-600 shadow-sm transition hover:bg-gray-50 hover:text-gray-900"
              aria-label="Back to Operator Dashboard"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#14532d] text-white shadow-sm">
                <Building2 className="h-4 w-4 text-emerald-400" />
              </div>
              <div>
                <span className="block text-base font-extrabold leading-tight tracking-tight text-[#14532d]">
                  SmartProcure <span className="text-xs font-semibold text-emerald-700 uppercase">| Operator Desk</span>
                </span>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                  Slot Approval & Yard Schedule Manager
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-[#14532d]">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Yard Capacity: 68% Booked
            </span>
          </div>
        </div>
      </header>

      {/* Success Notification Toast */}
      <AnimatePresence>
        {showSuccessToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 right-6 z-50 flex items-center gap-2.5 rounded-2xl bg-[#14532d] px-5 py-3 text-xs font-bold text-white shadow-xl"
          >
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            Confirmed slot broadcasted directly to farmer app & SMS!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Container */}
      <main className="relative z-10 mx-auto max-w-7xl px-6 pt-6 pb-16 lg:px-12">
        
        {/* Banner with Live Yard Schedule Status */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-emerald-900/10 bg-gradient-to-br from-[#14532d] via-[#166534] to-[#0f3e21] p-6 text-white shadow-xl lg:p-8"
        >
          <div className="grid items-center gap-6 lg:grid-cols-12">
            
            <div className="lg:col-span-7">
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-200 backdrop-blur-sm">
                <CalendarCheck className="h-3.5 w-3.5 text-emerald-400" />
                Mandi Intake Schedule Control
              </span>

              <h1 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl lg:text-4xl">
                Slot Approval & Scheduling
              </h1>
              <p className="mt-2 max-w-lg text-xs leading-relaxed text-emerald-100 sm:text-sm">
                Review incoming farmer slot bookings, balance hourly vehicle quotas per scale bay, and broadcast confirmed arrival windows in real time.
              </p>
            </div>

            {/* Live Yard Hourly Quotas */}
            <div className="lg:col-span-5">
              <div className="grid grid-cols-2 gap-3.5">
                <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-md">
                  <span className="block text-[11px] font-bold uppercase text-emerald-200">Scheduled Intake</span>
                  <span className="mt-1 block text-2xl font-black text-white">{bookedCapacity} Qtl</span>
                  <span className="mt-0.5 block text-[10px] text-emerald-300">Max limit: {totalCapacity} Qtl/hr</span>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-md">
                  <span className="block text-[11px] font-bold uppercase text-emerald-200">Available Slots</span>
                  <span className="mt-1 block text-2xl font-black text-white">{availableSlots} Left</span>
                  <span className="mt-0.5 block text-[10px] text-emerald-300">Bay 01, 02 & 03 Active</span>
                </div>
              </div>
            </div>

          </div>
        </motion.div>

        {/* Controls: Search, Filter, and Capacity Sliders */}
        <div className="mt-8 flex flex-col justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
          
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Farmer Name, Token ID, or Vehicle No..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2 pl-9 pr-4 text-xs text-gray-900 focus:border-emerald-600 focus:bg-white focus:outline-none"
            />
          </div>

          <div className="flex gap-1.5 rounded-xl bg-gray-100 p-1 text-xs font-bold">
            <button
              onClick={() => setActiveFilter('all')}
              className={`rounded-lg px-3 py-1.5 transition ${
                activeFilter === 'all' ? 'bg-white text-[#14532d] shadow-sm' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              All Bookings ({requests.length})
            </button>
            <button
              onClick={() => setActiveFilter('pending')}
              className={`rounded-lg px-3 py-1.5 transition ${
                activeFilter === 'pending' ? 'bg-white text-amber-800 shadow-sm' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Pending Approval
            </button>
            <button
              onClick={() => setActiveFilter('approved')}
              className={`rounded-lg px-3 py-1.5 transition ${
                activeFilter === 'approved' ? 'bg-white text-[#14532d] shadow-sm' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Broadcasted
            </button>
          </div>

        </div>

        {/* Booking Requests Table / Card List */}
        <div className="mt-6 space-y-3.5">
          {filteredRequests.length > 0 ? (
            filteredRequests.map((req) => {
              const isPending = req.status === 'Pending';
              const isApproved = req.status === 'Approved';

              return (
                <motion.div
                  key={req.id}
                  whileHover={{ y: -2 }}
                  className="flex flex-col justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition sm:flex-row sm:items-center sm:p-6"
                >
                  <div className="flex items-start gap-4">
                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                      isApproved ? 'bg-emerald-50 text-emerald-700' : isPending ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'
                    }`}>
                      <Wheat className="h-5 w-5" />
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-bold text-gray-900">{req.farmerName}</h3>
                        <span className="rounded-md bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-700">
                          {req.tokenId}
                        </span>
                        <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold ${
                          isApproved
                            ? 'bg-emerald-100 text-emerald-800'
                            : isPending
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {isApproved ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                          {req.status}
                        </span>
                      </div>

                      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                        <span>Crop: <strong className="text-gray-700">{req.crop} ({req.quantity})</strong></span>
                        <span>•</span>
                        <span>Vehicle: <strong className="text-gray-700">{req.vehicleNo}</strong></span>
                        <span>•</span>
                        <span>Requested: <strong className="text-gray-700">{req.requestedDate} ({req.requestedWindow})</strong></span>
                      </div>

                      <p className="mt-1 text-[11px] text-gray-400">
                        {req.notes} • Assigned to: <strong>{req.allocatedBay}</strong>
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-2 border-t border-gray-100 pt-3 sm:border-0 sm:pt-0">
                    {isPending ? (
                      <>
                        <button
                          onClick={() => handleReject(req.id)}
                          className="rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-bold text-gray-600 transition hover:bg-red-50 hover:text-red-700"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => handleApprove(req)}
                          className="flex items-center gap-1.5 rounded-xl bg-[#14532d] px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-[#0f3e21]"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Approve & Broadcast
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleApprove(req)}
                        className="flex items-center gap-1.5 rounded-xl border border-emerald-900/10 bg-emerald-50 px-3.5 py-2 text-xs font-bold text-[#14532d] transition hover:bg-emerald-100"
                      >
                        <Calendar className="h-3.5 w-3.5" />
                        Reschedule / Update
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white/50 p-12 text-center">
              <CalendarCheck className="mx-auto h-8 w-8 text-gray-400" />
              <p className="mt-2 text-xs font-bold text-gray-700">No slot requests found.</p>
              <p className="text-[11px] text-gray-500">All incoming farmer requests have been cleared.</p>
            </div>
          )}
        </div>

      </main>

      {/* Modal: Approve & Broadcast Window Schedule */}
      <AnimatePresence>
        {selectedRequest && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-lg rounded-3xl border border-gray-200 bg-white p-6 shadow-2xl sm:p-8"
            >
              <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-[#14532d]">
                  <Send className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-gray-900">Broadcast Arrival Schedule</h2>
                  <p className="text-xs text-gray-500">Confirm slot allocation for {selectedRequest.farmerName} ({selectedRequest.tokenId})</p>
                </div>
              </div>

              <div className="mt-5 space-y-4 text-xs">
                
                {/* Arrival Window Selector */}
                <div>
                  <label className="font-bold text-gray-700">Confirmed Arrival Window</label>
                  <select
                    value={assignedWindow}
                    onChange={(e) => setAssignedWindow(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs text-gray-900 focus:border-emerald-600 focus:outline-none"
                  >
                    <option>08:30 AM – 10:00 AM (Early Batch)</option>
                    <option>10:00 AM – 11:30 AM (Peak Intake)</option>
                    <option>11:30 AM – 01:00 PM (Regular Batch)</option>
                    <option>02:00 PM – 03:30 PM (Afternoon Shift)</option>
                    <option>03:30 PM – 05:00 PM (Late Clearance)</option>
                  </select>
                </div>

                {/* Assigned Bay */}
                <div>
                  <label className="font-bold text-gray-700">Assigned Scale / Weighbridge Bay</label>
                  <select
                    value={assignedBay}
                    onChange={(e) => setAssignedBay(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs text-gray-900 focus:border-emerald-600 focus:outline-none"
                  >
                    <option value="Bay 01">Weighbridge Bay 01 (Tractor Trolley Light)</option>
                    <option value="Bay 02">Weighbridge Bay 02 (Heavy Commercial)</option>
                    <option value="Bay 03">Weighbridge Bay 03 (Express Electronic)</option>
                  </select>
                </div>

                {/* Broadcast SMS Preview */}
                <div>
                  <label className="font-bold text-gray-700">Broadcast Message to Farmer App & SMS</label>
                  <textarea
                    rows={3}
                    value={broadcastMessage}
                    onChange={(e) => setBroadcastMessage(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-xs text-gray-800 focus:border-emerald-600 focus:bg-white focus:outline-none"
                  />
                </div>

              </div>

              {/* Modal Actions */}
              <div className="mt-6 flex gap-3">
                <button
                  onClick={handleConfirmBroadcast}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#14532d] py-2.5 text-xs font-bold text-white transition hover:bg-[#0f3e21]"
                >
                  <Send className="h-3.5 w-3.5" />
                  Confirm & Broadcast to Farmer
                </button>
                <button
                  onClick={() => setSelectedRequest(null)}
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