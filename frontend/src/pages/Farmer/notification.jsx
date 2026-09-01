import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sprout,
  Bell,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowLeft,
  Trash2,
  CheckCheck,
  Filter,
  Scale,
  FlaskConical,
  Receipt,
  QrCode,
  CalendarCheck,
  ChevronRight,
  Info
} from 'lucide-react';

const initialNotifications = [
  {
    id: 'notif-1',
    type: 'gate_call',
    category: 'Queue Alert',
    title: 'Vehicle Gate Callout: Please Proceed to Bay 02',
    message: 'Your token TKN-2026-8841 is 1 position away. Please start your tractor and move towards Weighbridge Bay 02.',
    timestamp: '5 mins ago',
    read: false,
    urgent: true,
    actionRoute: '/live-queue',
    actionLabel: 'View Live Queue',
    operatorStation: 'Karnal APMC Yard Gate 01',
    icon: QrCode,
    color: 'amber'
  },
  {
    id: 'notif-2',
    type: 'weighment',
    category: 'Weighbridge',
    title: 'Gross Weight Certified: 7,240 kg',
    message: 'Operator verified your gross tractor weight. Your vehicle is cleared to move to the unloading platform.',
    timestamp: '28 mins ago',
    read: false,
    urgent: false,
    actionRoute: '/live-queue',
    actionLabel: 'Check Weight Slip',
    operatorStation: 'Scale Station A',
    icon: Scale,
    color: 'blue'
  },
  {
    id: 'notif-3',
    type: 'assaying',
    category: 'Quality Lab',
    title: 'Grain Quality Passed (Grade A - 11.4% Moisture)',
    message: 'Wheat sample testing completed by Quality Assayer. Moisture is 11.4% (well within 12.0% MSP tolerance limit).',
    timestamp: '1 hour ago',
    read: true,
    urgent: false,
    actionRoute: '/live-queue',
    actionLabel: 'View Lab Report',
    operatorStation: 'APMC Quality Lab',
    icon: FlaskConical,
    color: 'emerald'
  },
  {
    id: 'notif-4',
    type: 'settlement',
    category: 'Payment & DBT',
    title: 'Digital J-Form Generated & DBT Transfer Queued',
    message: 'Net weight 45 Quintals approved at MSP ₹2,275/Qtl. Payment order of ₹1,02,375 forwarded to PFMS / Bank Server.',
    timestamp: '3 hours ago',
    read: true,
    urgent: false,
    actionRoute: '/farmerdashboard',
    actionLabel: 'Download J-Form',
    operatorStation: 'Accounts Desk 03',
    icon: Receipt,
    color: 'purple'
  },
  {
    id: 'notif-5',
    type: 'slot_update',
    category: 'Slot Booking',
    title: 'Mandi Arrival Slot Confirmed for Today',
    message: 'Your requested slot for Wheat procurement has been scheduled between 10:00 AM – 11:30 AM at Karnal APMC Yard.',
    timestamp: 'Yesterday at 06:45 PM',
    read: true,
    urgent: false,
    actionRoute: '/slot-booking',
    actionLabel: 'View Token Details',
    operatorStation: 'Central Mandi Desk',
    icon: CalendarCheck,
    color: 'emerald'
  }
];

export default function FarmerNotifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(initialNotifications);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'unread' | 'urgent'

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const filteredNotifications = notifications.filter((item) => {
    if (activeTab === 'unread') return !item.read;
    if (activeTab === 'urgent') return item.urgent;
    return true;
  });

  return (
    <div className="relative min-h-screen w-full bg-[#f6f9f5] font-sans text-gray-800 antialiased selection:bg-emerald-200 selection:text-emerald-900">
      
      {/* Background Soft Glow */}
      <div 
        className="pointer-events-none absolute inset-0 z-0 h-[400px] w-full bg-cover bg-center opacity-80"
        style={{
          backgroundImage: `radial-gradient(ellipse at 50% 10%, rgba(212, 245, 195, 0.55) 0%, rgba(246, 249, 245, 1) 75%)`
        }}
      />

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-emerald-900/5 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-3.5">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/farmerhome')} 
              className="rounded-xl border border-gray-200 bg-white p-2 text-gray-600 shadow-sm transition hover:bg-gray-50 hover:text-gray-900"
              aria-label="Back to Farmer Home"
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
                  Mandi Alerts & Updates
                </span>
              </div>
            </div>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-1.5 rounded-xl border border-emerald-900/10 bg-emerald-50 px-3.5 py-1.5 text-xs font-bold text-[#14532d] transition hover:bg-emerald-100"
            >
              <CheckCheck className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Mark all as read</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 mx-auto max-w-4xl px-6 pt-6 pb-16">
        
        {/* Top Header Card */}
        <div className="rounded-3xl border border-emerald-900/10 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-[#14532d]">
                <Bell className="h-3.5 w-3.5 text-emerald-600" />
                Live Operator Broadcasts
              </div>
              <h1 className="mt-2 text-2xl font-black text-gray-900 sm:text-3xl">
                Operator Notifications
              </h1>
              <p className="mt-1 text-xs text-gray-500">
                Direct updates on queue callouts, scale weighing, lab grading, and payment clearance.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex rounded-xl bg-gray-100 p-1 text-xs font-bold">
              <button
                onClick={() => setActiveTab('all')}
                className={`rounded-lg px-3.5 py-1.5 transition ${
                  activeTab === 'all' ? 'bg-white text-[#14532d] shadow-sm' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                All ({notifications.length})
              </button>
              <button
                onClick={() => setActiveTab('unread')}
                className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 transition ${
                  activeTab === 'unread' ? 'bg-white text-[#14532d] shadow-sm' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Unread
                {unreadCount > 0 && (
                  <span className="rounded-full bg-emerald-600 px-1.5 py-0.2 text-[10px] text-white">
                    {unreadCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('urgent')}
                className={`rounded-lg px-3.5 py-1.5 transition ${
                  activeTab === 'urgent' ? 'bg-white text-amber-700 shadow-sm' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Urgent
              </button>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="mt-6 space-y-3.5">
          <AnimatePresence>
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notif) => {
                const Icon = notif.icon;

                return (
                  <motion.div
                    key={notif.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    onClick={() => markAsRead(notif.id)}
                    className={`group relative rounded-2xl border p-5 transition-all sm:p-6 ${
                      !notif.read
                        ? 'border-emerald-200 bg-white shadow-sm ring-1 ring-emerald-500/10'
                        : 'border-gray-200/80 bg-white/70 opacity-90'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      
                      {/* Category Icon Badge */}
                      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                        notif.color === 'amber'
                          ? 'bg-amber-50 text-amber-600'
                          : notif.color === 'blue'
                          ? 'bg-blue-50 text-blue-600'
                          : notif.color === 'purple'
                          ? 'bg-purple-50 text-purple-600'
                          : 'bg-emerald-50 text-emerald-700'
                      }`}>
                        <Icon className="h-5 w-5" />
                      </div>

                      {/* Content Details */}
                      <div className="flex-1">
                        
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                              notif.color === 'amber'
                                ? 'bg-amber-100 text-amber-800'
                                : notif.color === 'blue'
                                ? 'bg-blue-100 text-blue-800'
                                : notif.color === 'purple'
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}>
                              {notif.category}
                            </span>
                            
                            {notif.urgent && (
                              <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600">
                                <AlertTriangle className="h-3 w-3" /> Urgent Call
                              </span>
                            )}

                            {!notif.read && (
                              <span className="h-2 w-2 rounded-full bg-emerald-500" />
                            )}
                          </div>

                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            <Clock className="h-3 w-3" />
                            <span>{notif.timestamp}</span>
                          </div>
                        </div>

                        <h3 className={`mt-2 text-sm font-bold ${!notif.read ? 'text-gray-900' : 'text-gray-700'}`}>
                          {notif.title}
                        </h3>

                        <p className="mt-1 text-xs leading-relaxed text-gray-600">
                          {notif.message}
                        </p>

                        {/* Station metadata & Action Button */}
                        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-3">
                          <span className="text-[11px] font-medium text-gray-400">
                            Station: <strong className="text-gray-600">{notif.operatorStation}</strong>
                          </span>

                          <div className="flex items-center gap-3">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(notif.id);
                              }}
                              className="text-gray-400 opacity-0 transition hover:text-red-500 group-hover:opacity-100"
                              title="Delete notification"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(notif.actionRoute);
                              }}
                              className="flex items-center gap-1 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-bold text-[#14532d] transition hover:bg-[#14532d] hover:text-white"
                            >
                              {notif.actionLabel}
                              <ChevronRight className="h-3 w-3" />
                            </button>
                          </div>
                        </div>

                      </div>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="rounded-3xl border border-dashed border-gray-300 bg-white/60 p-12 text-center">
                <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-600" />
                <h3 className="mt-3 text-sm font-bold text-gray-800">All caught up!</h3>
                <p className="mt-1 text-xs text-gray-500">
                  {activeTab === 'unread'
                    ? 'You have read all notifications.'
                    : 'No notifications present in this category.'}
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* SMS & Helpline Notice Strip */}
        <div className="mt-8 flex items-center gap-3 rounded-2xl border border-emerald-900/10 bg-emerald-50/70 p-4 text-xs text-gray-600">
          <Info className="h-5 w-5 text-emerald-700 shrink-0" />
          <span>
            Critical gate callouts are also delivered via SMS to your registered mobile number. For token queries, contact toll-free <strong>1800-180-1551</strong>.
          </span>
        </div>

      </main>

    </div>
  );
}