import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sprout,
  Calendar,
  Clock,
  Building2,
  Truck,
  Scale,
  IndianRupee,
  QrCode,
  CheckCircle2,
  ChevronRight,
  ArrowLeft,
  Download,
  Printer,
  AlertCircle,
  MapPin,
  FileText,
  ShieldCheck,
  Check,
  Info
} from 'lucide-react';

const CROP_CATALOG = [
  { id: 'wheat', name: 'Wheat (गेहूं)', mspRate: 2275, unit: 'Qtl', season: 'Rabi 2026', maxMoisture: '12%' },
  { id: 'mustard', name: 'Mustard (सरसों)', mspRate: 5650, unit: 'Qtl', season: 'Rabi 2026', maxMoisture: '8%' },
  { id: 'gram', name: 'Gram / Chana (चना)', mspRate: 5440, unit: 'Qtl', season: 'Rabi 2026', maxMoisture: '10%' },
  { id: 'paddy', name: 'Paddy / Rice (धान)', mspRate: 2300, unit: 'Qtl', season: 'Kharif Buffer', maxMoisture: '14%' }
];

const MANDI_CENTERS = [
  { id: 'pat-01', name: 'Patna Central APMC Yard #04', district: 'Patna', distance: '12 km', capacityLoad: '72% Full' },
  { id: 'bik-02', name: 'Bikramganj Procurement Hub', district: 'Rohtas', distance: '28 km', capacityLoad: '45% Full' },
  { id: 'dan-03', name: 'Danapur Grain Mandi Silo Bay', district: 'Patna', distance: '8 km', capacityLoad: '88% Full' },
  { id: 'man-04', name: 'Maner APMC Collection Point', district: 'Patna', distance: '19 km', capacityLoad: '30% Full' }
];

const TIME_SLOTS = [
  { id: 's1', time: '08:30 AM - 10:00 AM', period: 'Morning Shift', availableTokens: 6, status: 'Fast Clearance' },
  { id: 's2', time: '10:00 AM - 11:30 AM', period: 'Morning Shift', availableTokens: 2, status: 'Rush Hour' },
  { id: 's3', time: '11:30 AM - 01:00 PM', period: 'Midday Shift', availableTokens: 8, status: 'Available' },
  { id: 's4', time: '02:00 PM - 03:30 PM', period: 'Afternoon Shift', availableTokens: 12, status: 'High Availability' },
  { id: 's5', time: '03:30 PM - 05:00 PM', period: 'Evening Shift', availableTokens: 5, status: 'Available' }
];

export default function FarmerSlotBooking() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Crop & Mandi, 2: Slot & Vehicle, 3: Review & Token Generated

  // Form State
  const [bookingData, setBookingData] = useState({
    farmerName: 'Ramesh Patel',
    kisanId: 'KCC-984210',
    phone: '98765 43210',
    selectedCropId: 'wheat',
    quantityQtl: '45.0',
    selectedMandiId: 'pat-01',
    bookingDate: '2026-09-02',
    selectedSlotId: 's1',
    vehicleType: 'Tractor Trolley',
    vehicleNumber: 'BR-01-GA-4581',
    bankAccountMasked: '•••• •••• 4523 (SBI)'
  });

  const [generatedToken, setGeneratedToken] = useState(null);

  const selectedCrop = CROP_CATALOG.find((c) => c.id === bookingData.selectedCropId) || CROP_CATALOG[0];
  const selectedMandi = MANDI_CENTERS.find((m) => m.id === bookingData.selectedMandiId) || MANDI_CENTERS[0];
  const selectedSlot = TIME_SLOTS.find((s) => s.id === bookingData.selectedSlotId) || TIME_SLOTS[0];

  const estimatedWeight = parseFloat(bookingData.quantityQtl) || 0;
  const estimatedPayout = estimatedWeight * selectedCrop.mspRate;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProceedToSlots = (e) => {
    e.preventDefault();
    if (estimatedWeight <= 0) {
      alert('Please enter a valid crop quantity.');
      return;
    }
    setStep(2);
  };

  const handleConfirmBooking = (e) => {
    e.preventDefault();
    const tokenNo = `TKN-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    setGeneratedToken({
      tokenId: tokenNo,
      bookingTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      allocatedBay: 'Bay 02 - Scale Terminal A',
      gatePassCode: `GATE-${Math.floor(100 + Math.random() * 900)}`
    });
    setStep(3);
  };

  return (
    <div className="relative min-h-screen w-full bg-[#f6f9f5] font-sans text-gray-800 antialiased selection:bg-emerald-200 selection:text-emerald-900">
      
      {/* Background Ambient Glow */}
      <div 
        className="absolute inset-0 z-0 h-[480px] w-full bg-cover bg-center opacity-80 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(ellipse at 50% 15%, rgba(212, 245, 195, 0.55) 0%, rgba(246, 249, 245, 1) 75%)`
        }}
      />

      {/* Header */}
      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-12">
        <Link to="/farmerhome" className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0d4624] text-white shadow-sm">
            <Sprout className="h-5 w-5 text-[#00e699]" />
          </div>
          <div>
            <span className="block text-lg font-extrabold leading-tight tracking-tight text-[#14532d]">
              SmartProcure
            </span>
            <span className="block text-[10px] font-semibold tracking-wider text-emerald-700 uppercase">
              Govt. Mandi Portal • e-Token Hub
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            to="/farmerhome"
            className="flex items-center gap-1.5 text-xs font-bold text-gray-600 transition hover:text-[#14532d]"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Farmer Home
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 mx-auto max-w-5xl px-6 pt-4 pb-16">
        
        {/* Progress Bar Indicator */}
        <div className="mb-6 flex items-center justify-center">
          <div className="flex items-center gap-3 text-xs font-bold">
            <div className={`flex items-center gap-2 rounded-full px-4 py-1.5 transition ${
              step >= 1 ? 'bg-[#14532d] text-white shadow-sm' : 'bg-gray-200 text-gray-500'
            }`}>
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-[11px]">1</span>
              <span>Crop & Mandi Center</span>
            </div>

            <div className={`h-0.5 w-8 rounded-full ${step >= 2 ? 'bg-[#14532d]' : 'bg-gray-300'}`} />

            <div className={`flex items-center gap-2 rounded-full px-4 py-1.5 transition ${
              step >= 2 ? 'bg-[#14532d] text-white shadow-sm' : 'bg-gray-200 text-gray-500'
            }`}>
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-[11px]">2</span>
              <span>Date, Slot & Vehicle</span>
            </div>

            <div className={`h-0.5 w-8 rounded-full ${step === 3 ? 'bg-[#14532d]' : 'bg-gray-300'}`} />

            <div className={`flex items-center gap-2 rounded-full px-4 py-1.5 transition ${
              step === 3 ? 'bg-[#14532d] text-white shadow-sm' : 'bg-gray-200 text-gray-500'
            }`}>
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-[11px]">3</span>
              <span>Confirmed e-Token</span>
            </div>
          </div>
        </div>

        {/* Dynamic Multi-Step Form */}
        <AnimatePresence mode="wait">
          
          {/* STEP 1: Select Crop & Procurement Mandi */}
          {step === 1 && (
            <motion.form
              key="step1"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              onSubmit={handleProceedToSlots}
              className="grid grid-cols-1 gap-6 lg:grid-cols-12"
            >
              {/* Form Input Area (7 Cols) */}
              <div className="rounded-3xl border border-emerald-900/10 bg-white/95 p-6 shadow-xl backdrop-blur-md sm:p-8 lg:col-span-7">
                <div className="border-b border-gray-100 pb-4">
                  <h1 className="text-xl font-black text-gray-900 sm:text-2xl">
                    Book Mandi Procurement Slot
                  </h1>
                  <p className="mt-1 text-xs text-gray-500">
                    Select your harvested crop, estimated quintals, and nearest government procurement center.
                  </p>
                </div>

                <div className="mt-5 space-y-5">
                  {/* Select Crop */}
                  <div>
                    <label className="text-xs font-bold text-gray-700">Select Produce / Commodity</label>
                    <div className="mt-2 grid grid-cols-2 gap-2.5">
                      {CROP_CATALOG.map((crop) => (
                        <div
                          key={crop.id}
                          onClick={() => setBookingData((p) => ({ ...p, selectedCropId: crop.id }))}
                          className={`cursor-pointer rounded-2xl border p-3.5 transition ${
                            bookingData.selectedCropId === crop.id
                              ? 'border-[#14532d] bg-emerald-50/60 shadow-sm ring-1 ring-[#14532d]'
                              : 'border-gray-200 bg-white hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-gray-900">{crop.name}</span>
                            {bookingData.selectedCropId === crop.id && (
                              <CheckCircle2 className="h-4 w-4 text-[#14532d]" />
                            )}
                          </div>
                          <div className="mt-2 flex items-baseline justify-between text-[11px]">
                            <span className="text-gray-500">MSP Rate:</span>
                            <span className="font-extrabold text-[#14532d]">₹{crop.mspRate}/{crop.unit}</span>
                          </div>
                          <span className="mt-0.5 block text-[10px] text-gray-400">Max Moisture: {crop.maxMoisture}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quantity Input */}
                  <div>
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-gray-700">Total Produce Quantity (Quintals)</label>
                      <span className="text-[11px] font-semibold text-emerald-800">1 Quintal = 100 Kg</span>
                    </div>
                    <div className="relative mt-1.5">
                      <Scale className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
                      <input
                        type="number"
                        name="quantityQtl"
                        required
                        step="0.5"
                        min="1"
                        value={bookingData.quantityQtl}
                        onChange={handleInputChange}
                        placeholder="e.g. 45.0"
                        className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-xs font-bold text-gray-900 shadow-sm focus:border-emerald-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Mandi Selection */}
                  <div>
                    <label className="text-xs font-bold text-gray-700">Select Procurement Mandi / APMC Center</label>
                    <div className="mt-2 space-y-2">
                      {MANDI_CENTERS.map((mandi) => (
                        <label
                          key={mandi.id}
                          className={`flex cursor-pointer items-center justify-between rounded-2xl border p-3.5 transition ${
                            bookingData.selectedMandiId === mandi.id
                              ? 'border-[#14532d] bg-emerald-50/60 shadow-sm ring-1 ring-[#14532d]'
                              : 'border-gray-200 bg-white hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="selectedMandiId"
                              value={mandi.id}
                              checked={bookingData.selectedMandiId === mandi.id}
                              onChange={handleInputChange}
                              className="h-4 w-4 accent-[#14532d]"
                            />
                            <div>
                              <div className="text-xs font-bold text-gray-900">{mandi.name}</div>
                              <div className="text-[11px] text-gray-500">{mandi.district} • {mandi.distance} from registered farm</div>
                            </div>
                          </div>
                          <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[10px] font-bold text-gray-700">
                            {mandi.capacityLoad}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Submit to Next Step */}
                  <button
                    type="submit"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#14532d] py-3.5 text-xs font-bold text-white shadow-md transition hover:bg-[#0f3e21]"
                  >
                    Proceed to Choose Time Slot
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Dynamic MSP Estimation & Farmer Review Card (5 Cols) */}
              <div className="rounded-3xl border border-emerald-900/10 bg-white/95 p-6 shadow-xl backdrop-blur-md sm:p-8 lg:col-span-5">
                <div className="flex items-center gap-2 border-b border-gray-100 pb-3 text-[#14532d]">
                  <ShieldCheck className="h-5 w-5" />
                  <h3 className="font-extrabold text-gray-900">Guaranteed MSP Estimate</h3>
                </div>

                <div className="mt-4 space-y-4">
                  {/* Farmer Verified Badge */}
                  <div className="rounded-2xl border border-emerald-100 bg-[#f8faf7] p-3.5 text-xs">
                    <div className="flex justify-between font-bold text-gray-900">
                      <span>Farmer Name:</span>
                      <span>{bookingData.farmerName}</span>
                    </div>
                    <div className="mt-1 flex justify-between text-gray-600">
                      <span>Kisan Credit ID:</span>
                      <span className="font-mono">{bookingData.kisanId}</span>
                    </div>
                    <div className="mt-1 flex justify-between text-gray-600">
                      <span>Linked DBT Account:</span>
                      <span>{bookingData.bankAccountMasked}</span>
                    </div>
                  </div>

                  {/* Live Financial Breakdown */}
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                      Direct Treasury Payout
                    </span>
                    <div className="mt-1 text-3xl font-black text-[#14532d]">
                      ₹{estimatedPayout.toLocaleString()}
                    </div>
                    <div className="mt-2 space-y-1 text-xs text-gray-600">
                      <div className="flex justify-between">
                        <span>Rate per Quintal:</span>
                        <span className="font-bold text-gray-900">₹{selectedCrop.mspRate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Volume:</span>
                        <span className="font-bold text-gray-900">{estimatedWeight} Quintals</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-[11px] text-amber-900 border border-amber-200">
                    <Info className="h-4 w-4 shrink-0 text-amber-700" />
                    <span>
                      Payment will be credited directly to your Aadhaar-linked DBT bank account within 48 hours of mandi scale verification.
                    </span>
                  </div>
                </div>
              </div>
            </motion.form>
          )}

          {/* STEP 2: Select Date, Time Slot & Vehicle Details */}
          {step === 2 && (
            <motion.form
              key="step2"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              onSubmit={handleConfirmBooking}
              className="grid grid-cols-1 gap-6 lg:grid-cols-12"
            >
              <div className="rounded-3xl border border-emerald-900/10 bg-white/95 p-6 shadow-xl backdrop-blur-md sm:p-8 lg:col-span-7">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <div>
                    <h1 className="text-xl font-black text-gray-900 sm:text-2xl">
                      Select Arrival Date & Slot
                    </h1>
                    <p className="mt-0.5 text-xs text-gray-500">
                      Center: <strong>{selectedMandi.name}</strong>
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex items-center gap-1 text-xs font-bold text-emerald-800 hover:underline"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" /> Change Mandi
                  </button>
                </div>

                <div className="mt-5 space-y-5">
                  {/* Select Arrival Date */}
                  <div>
                    <label className="text-xs font-bold text-gray-700">Preferred Arrival Date</label>
                    <div className="relative mt-1.5">
                      <Calendar className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
                      <input
                        type="date"
                        name="bookingDate"
                        required
                        value={bookingData.bookingDate}
                        onChange={handleInputChange}
                        className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-xs font-bold text-gray-900 shadow-sm focus:border-emerald-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Available Time Slots */}
                  <div>
                    <label className="text-xs font-bold text-gray-700">Available Weighbridge Token Slots</label>
                    <div className="mt-2 space-y-2">
                      {TIME_SLOTS.map((slot) => (
                        <label
                          key={slot.id}
                          className={`flex cursor-pointer items-center justify-between rounded-2xl border p-3.5 transition ${
                            bookingData.selectedSlotId === slot.id
                              ? 'border-[#14532d] bg-emerald-50/60 shadow-sm ring-1 ring-[#14532d]'
                              : 'border-gray-200 bg-white hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="selectedSlotId"
                              value={slot.id}
                              checked={bookingData.selectedSlotId === slot.id}
                              onChange={handleInputChange}
                              className="h-4 w-4 accent-[#14532d]"
                            />
                            <div>
                              <div className="text-xs font-bold text-gray-900">{slot.time}</div>
                              <div className="text-[11px] text-gray-500">{slot.period}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="block text-xs font-extrabold text-[#14532d]">
                              {slot.availableTokens} Tokens Left
                            </span>
                            <span className="text-[10px] text-gray-400">{slot.status}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Vehicle Details */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-xs font-bold text-gray-700">Vehicle Type</label>
                      <select
                        name="vehicleType"
                        value={bookingData.vehicleType}
                        onChange={handleInputChange}
                        className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-xs font-bold text-gray-900 shadow-sm focus:border-emerald-600 focus:outline-none"
                      >
                        <option value="Tractor Trolley">Tractor Trolley (ट्रैक्टर ट्रॉली)</option>
                        <option value="Mini Truck / Pickup">Mini Truck / Pickup (छोटा हाथी)</option>
                        <option value="Commercial Heavy Truck">Commercial Heavy Truck</option>
                        <option value="Bullock Cart">Bullock Cart (बैलगाड़ी)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-gray-700">Vehicle Plate / Registration No.</label>
                      <div className="relative mt-1.5">
                        <Truck className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
                        <input
                          type="text"
                          name="vehicleNumber"
                          required
                          value={bookingData.vehicleNumber}
                          onChange={handleInputChange}
                          placeholder="e.g. BR-01-GA-4581"
                          className="w-full uppercase rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-xs font-mono font-bold text-gray-900 shadow-sm focus:border-emerald-600 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="rounded-xl border border-gray-300 px-5 py-3.5 text-xs font-bold text-gray-700 hover:bg-gray-50"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#14532d] py-3.5 text-xs font-bold text-white shadow-md transition hover:bg-[#0f3e21]"
                    >
                      <Check className="h-4 w-4 text-[#00e699]" />
                      Confirm & Generate Mandi e-Token
                    </button>
                  </div>
                </div>
              </div>

              {/* Slot Summary Card (5 Cols) */}
              <div className="rounded-3xl border border-emerald-900/10 bg-white/95 p-6 shadow-xl backdrop-blur-md sm:p-8 lg:col-span-5">
                <h3 className="font-extrabold text-gray-900 border-b border-gray-100 pb-3">
                  Booking Summary
                </h3>

                <div className="mt-4 space-y-3 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Selected Produce:</span>
                    <span className="font-bold text-gray-900">{selectedCrop.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Total Quantity:</span>
                    <span className="font-bold text-gray-900">{estimatedWeight} Quintals</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Procurement Center:</span>
                    <span className="font-bold text-right text-gray-900">{selectedMandi.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Arrival Date:</span>
                    <span className="font-bold text-gray-900">{bookingData.bookingDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Estimated Slot:</span>
                    <span className="font-bold text-emerald-800">{selectedSlot.time}</span>
                  </div>

                  <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4">
                    <span className="text-[11px] font-bold text-emerald-900">Total Payable Amount</span>
                    <div className="text-2xl font-black text-[#14532d]">₹{estimatedPayout.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            </motion.form>
          )}

          {/* STEP 3: Confirmed e-Token Slip & QR Pass */}
          {step === 3 && generatedToken && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mx-auto max-w-2xl"
            >
              <div className="rounded-3xl border border-emerald-900/10 bg-white p-6 shadow-2xl sm:p-10">
                {/* Success Header */}
                <div className="text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-[#14532d]">
                    <CheckCircle2 className="h-8 w-8 text-emerald-700" />
                  </div>
                  <h2 className="mt-3 text-2xl font-black text-gray-900">
                    Slot Booked Successfully!
                  </h2>
                  <p className="mt-1 text-xs text-gray-500">
                    Your digital gate entry pass is ready. An SMS confirmation has been sent to +91 {bookingData.phone}.
                  </p>
                </div>

                {/* Mandi Entry Pass Card */}
                <div className="mt-6 rounded-3xl border-2 border-dashed border-emerald-300 bg-[#f8faf7] p-6">
                  <div className="flex flex-col items-center justify-between gap-4 border-b border-gray-200 pb-4 sm:flex-row">
                    <div>
                      <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-900 uppercase">
                        Official Mandi Gate Pass
                      </span>
                      <div className="mt-1 text-2xl font-mono font-black text-[#14532d]">
                        {generatedToken.tokenId}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 rounded-2xl bg-white p-2.5 shadow-sm border border-gray-200">
                      <QrCode className="h-12 w-12 text-gray-800" />
                      <div className="text-left text-[10px] text-gray-400">
                        <span>Scan at</span>
                        <strong className="block text-gray-700">Gate #01 / 02</strong>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-gray-500">Farmer:</span>
                      <strong className="block text-gray-900">{bookingData.farmerName}</strong>
                    </div>
                    <div>
                      <span className="text-gray-500">Kisan ID:</span>
                      <strong className="block font-mono text-gray-900">{bookingData.kisanId}</strong>
                    </div>
                    <div>
                      <span className="text-gray-500">Produce:</span>
                      <strong className="block text-gray-900">{selectedCrop.name} ({estimatedWeight} Qtl)</strong>
                    </div>
                    <div>
                      <span className="text-gray-500">Vehicle:</span>
                      <strong className="block font-mono text-gray-900">{bookingData.vehicleNumber}</strong>
                    </div>
                    <div>
                      <span className="text-gray-500">Date & Arrival Window:</span>
                      <strong className="block text-emerald-800">{bookingData.bookingDate} • {selectedSlot.time}</strong>
                    </div>
                    <div>
                      <span className="text-gray-500">Assigned Bay:</span>
                      <strong className="block text-emerald-800">{generatedToken.allocatedBay}</strong>
                    </div>
                  </div>

                  <div className="mt-4 border-t border-gray-200/80 pt-3 flex justify-between items-center text-xs">
                    <span className="text-gray-600">Expected MSP Disbursement:</span>
                    <span className="font-black text-base text-[#14532d]">₹{estimatedPayout.toLocaleString()}</span>
                  </div>
                </div>

                {/* Print & Return Actions */}
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-gray-50 py-3 text-xs font-bold text-gray-800 shadow-sm transition hover:bg-gray-100"
                  >
                    <Printer className="h-4 w-4 text-gray-600" />
                    Print / Download Token Pass
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate('/farmerhome')}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#14532d] py-3 text-xs font-bold text-white shadow-md transition hover:bg-[#0f3e21]"
                  >
                    <Sprout className="h-4 w-4 text-[#00e699]" />
                    Go to Farmer Dashboard
                  </button>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>

      </main>
    </div>
  );
}