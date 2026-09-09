import { useEffect, useState } from 'react';

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
  Scale,
  FlaskConical,
  Receipt,
  QrCode,
  CalendarCheck,
  ChevronRight,
  Info,
  CircleDollarSign,
  PlayCircle
} from 'lucide-react';

import {
  getFarmerNotifications,
  markNotificationAsRead,
  deleteNotification
} from '../../api/notificationApi';


/*
 * Convert backend notification into the UI format.
 *
 * Backend:
 * {
 *   id,
 *   title,
 *   message,
 *   type,
 *   isRead,
 *   createdAt
 * }
 *
 * UI:
 * {
 *   id,
 *   type,
 *   category,
 *   title,
 *   message,
 *   timestamp,
 *   read,
 *   urgent,
 *   actionRoute,
 *   actionLabel,
 *   operatorStation,
 *   icon,
 *   color
 * }
 */

const convertNotification = (notification) => {

  const type = notification.type;

  let category = 'Mandi Update';
  let icon = Info;
  let color = 'emerald';
  let urgent = false;
  let actionRoute = '/farmerhome';
  let actionLabel = 'View Details';
  let operatorStation = 'SmartProcure';


  switch (type) {

    case 'REGISTRATION':
      category = 'Registration';
      icon = CheckCircle2;
      color = 'emerald';
      actionRoute = '/farmerhome';
      actionLabel = 'Go to Dashboard';
      break;


    case 'SLOT_BOOKED':
      category = 'Slot Booking';
      icon = CalendarCheck;
      color = 'emerald';
      actionRoute = '/slot-booking';
      actionLabel = 'View Slot';
      break;


    case 'SLOT_REMINDER':
      category = 'Slot Reminder';
      icon = Clock;
      color = 'amber';
      urgent = true;
      actionRoute = '/slot-booking';
      actionLabel = 'View Slot';
      break;


    case 'QUEUE_UPDATE':
      category = 'Queue Alert';
      icon = QrCode;
      color = 'amber';
      urgent = true;
      actionRoute = '/live-queue';
      actionLabel = 'View Live Queue';
      break;


    case 'PROCUREMENT_STARTED':
      category = 'Procurement';
      icon = PlayCircle;
      color = 'blue';
      actionRoute = '/farmerdashboard';
      actionLabel = 'Track Procurement';
      break;


    case 'PROCUREMENT_COMPLETED':
      category = 'Procurement';
      icon = CheckCircle2;
      color = 'emerald';
      actionRoute = '/farmerdashboard';
      actionLabel = 'View Procurement';
      break;


    case 'PAYMENT_INITIATED':
      category = 'Payment & DBT';
      icon = CircleDollarSign;
      color = 'purple';
      actionRoute = '/farmerdashboard';
      actionLabel = 'Track Payment';
      break;


    case 'PAYMENT_COMPLETED':
      category = 'Payment & DBT';
      icon = Receipt;
      color = 'purple';
      actionRoute = '/farmerdashboard';
      actionLabel = 'View Payment';
      break;


    case 'SLOT_CANCELLED':
      category = 'Slot Booking';
      icon = AlertTriangle;
      color = 'amber';
      urgent = true;
      actionRoute = '/slot-booking';
      actionLabel = 'Book New Slot';
      break;


    default:
      category = 'Mandi Update';
      icon = Info;
      color = 'emerald';
      actionRoute = '/farmerhome';
      actionLabel = 'View Dashboard';
  }


  return {
    id: notification.id,

    type: type,

    category: category,

    title: notification.title,

    message: notification.message,

    timestamp: notification.createdAt
      ? new Date(notification.createdAt).toLocaleString()
      : 'Just now',

    /*
     * Support both possible backend JSON names:
     * isRead OR read
     */
    read: notification.isRead ?? notification.read ?? false,

    urgent: urgent,

    actionRoute: actionRoute,

    actionLabel: actionLabel,

    operatorStation: operatorStation,

    icon: icon,

    color: color
  };
};


export default function FarmerNotifications() {

  const navigate = useNavigate();


  /*
   * Get farmer ID.
   *
   * IMPORTANT:
   * Change this line if your login stores the farmer ID
   * under another localStorage key.
   */
  const farmerId = localStorage.getItem('farmerId');


  const [notifications, setNotifications] = useState([]);

  const [activeTab, setActiveTab] = useState('all');

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState('');


  /*
   * Fetch notifications from Spring Boot
   */
  const fetchNotifications = async () => {

    if (!farmerId) {

      setError('Farmer information not found.');

      setLoading(false);

      return;
    }


    try {

      setError('');

      const data = await getFarmerNotifications(farmerId);

      const formattedNotifications =
        data.map(convertNotification);

      setNotifications(formattedNotifications);

    } catch (error) {

      console.error(
        'Failed to fetch notifications:',
        error
      );

      setError(
        'Unable to load notifications. Please try again.'
      );

    } finally {

      setLoading(false);
    }
  };


  /*
   * Load notifications when page opens
   */
  useEffect(() => {

    fetchNotifications();

  }, [farmerId]);


  /*
   * Automatically check for new notifications
   * every 10 seconds.
   *
   * Later we can replace this with WebSocket/STOMP.
   */
  useEffect(() => {

    if (!farmerId) {
      return;
    }


    const interval = setInterval(() => {

      fetchNotifications();

    }, 10000);


    return () => clearInterval(interval);

  }, [farmerId]);


  /*
   * Count unread notifications
   */
  const unreadCount =
    notifications.filter(
      (notification) => !notification.read
    ).length;


  /*
   * Mark ALL notifications as read
   *
   * Backend currently provides only:
   *
   * PUT /api/notifications/{id}/read
   *
   * So we call that endpoint for every unread notification.
   */
  const markAllAsRead = async () => {

    const unreadNotifications =
      notifications.filter(
        (notification) => !notification.read
      );


    try {

      await Promise.all(

        unreadNotifications.map(
          (notification) =>
            markNotificationAsRead(notification.id)
        )

      );


      setNotifications((prev) =>

        prev.map((notification) => ({
          ...notification,
          read: true
        }))

      );

    } catch (error) {

      console.error(
        'Failed to mark all notifications as read:',
        error
      );

    }
  };


  /*
   * Mark one notification as read
   */
  const markAsRead = async (id) => {

    const notification =
      notifications.find(
        (item) => item.id === id
      );


    /*
     * Don't call backend again
     * if already read.
     */
    if (!notification || notification.read) {
      return;
    }


    try {

      await markNotificationAsRead(id);


      setNotifications((prev) =>

        prev.map((notification) =>

          notification.id === id
            ? {
                ...notification,
                read: true
              }
            : notification

        )

      );

    } catch (error) {

      console.error(
        'Failed to mark notification as read:',
        error
      );

    }
  };


  /*
   * Delete notification
   */
  const deleteNotificationHandler = async (id) => {

    try {

      await deleteNotification(id);


      setNotifications((prev) =>

        prev.filter(
          (notification) =>
            notification.id !== id
        )

      );

    } catch (error) {

      console.error(
        'Failed to delete notification:',
        error
      );

    }
  };


  /*
   * Filter notifications
   */
  const filteredNotifications =
    notifications.filter((item) => {

      if (activeTab === 'unread') {
        return !item.read;
      }

      if (activeTab === 'urgent') {
        return item.urgent;
      }

      return true;

    });


  return (

    <div className="relative min-h-screen w-full bg-[#f6f9f5] font-sans text-gray-800 antialiased selection:bg-emerald-200 selection:text-emerald-900">


      {/* Background Soft Glow */}

      <div
        className="pointer-events-none absolute inset-0 z-0 h-[400px] w-full bg-cover bg-center opacity-80"
        style={{
          backgroundImage:
            `radial-gradient(ellipse at 50% 10%, rgba(212, 245, 195, 0.55) 0%, rgba(246, 249, 245, 1) 75%)`
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

              <span className="hidden sm:inline">
                Mark all as read
              </span>

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
                  activeTab === 'all'
                    ? 'bg-white text-[#14532d] shadow-sm'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                All ({notifications.length})
              </button>


              <button
                onClick={() => setActiveTab('unread')}
                className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 transition ${
                  activeTab === 'unread'
                    ? 'bg-white text-[#14532d] shadow-sm'
                    : 'text-gray-500 hover:text-gray-900'
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
                  activeTab === 'urgent'
                    ? 'bg-white text-amber-700 shadow-sm'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Urgent
              </button>

            </div>

          </div>

        </div>


        {/* Error */}

        {error && (

          <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>

        )}


        {/* Loading */}

        {loading ? (

          <div className="mt-6 rounded-3xl border border-gray-200 bg-white p-12 text-center">

            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600" />

            <p className="mt-4 text-sm text-gray-500">
              Loading notifications...
            </p>

          </div>

        ) : (

          /* Notifications List */

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
                      exit={{
                        opacity: 0,
                        scale: 0.95
                      }}
                      onClick={() =>
                        markAsRead(notif.id)
                      }
                      className={`group relative rounded-2xl border p-5 transition-all sm:p-6 ${
                        !notif.read
                          ? 'border-emerald-200 bg-white shadow-sm ring-1 ring-emerald-500/10'
                          : 'border-gray-200/80 bg-white/70 opacity-90'
                      }`}
                    >

                      <div className="flex items-start gap-4">


                        {/* Category Icon Badge */}

                        <div
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                            notif.color === 'amber'
                              ? 'bg-amber-50 text-amber-600'
                              : notif.color === 'blue'
                              ? 'bg-blue-50 text-blue-600'
                              : notif.color === 'purple'
                              ? 'bg-purple-50 text-purple-600'
                              : 'bg-emerald-50 text-emerald-700'
                          }`}
                        >

                          <Icon className="h-5 w-5" />

                        </div>


                        {/* Content Details */}

                        <div className="flex-1">

                          <div className="flex flex-wrap items-center justify-between gap-2">

                            <div className="flex items-center gap-2">

                              <span
                                className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                                  notif.color === 'amber'
                                    ? 'bg-amber-100 text-amber-800'
                                    : notif.color === 'blue'
                                    ? 'bg-blue-100 text-blue-800'
                                    : notif.color === 'purple'
                                    ? 'bg-purple-100 text-purple-800'
                                    : 'bg-emerald-100 text-emerald-800'
                                }`}
                              >
                                {notif.category}
                              </span>


                              {notif.urgent && (

                                <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600">

                                  <AlertTriangle className="h-3 w-3" />

                                  Urgent Call

                                </span>

                              )}


                              {!notif.read && (

                                <span className="h-2 w-2 rounded-full bg-emerald-500" />

                              )}

                            </div>


                            <div className="flex items-center gap-2 text-xs text-gray-400">

                              <Clock className="h-3 w-3" />

                              <span>
                                {notif.timestamp}
                              </span>

                            </div>

                          </div>


                          <h3
                            className={`mt-2 text-sm font-bold ${
                              !notif.read
                                ? 'text-gray-900'
                                : 'text-gray-700'
                            }`}
                          >
                            {notif.title}
                          </h3>


                          <p className="mt-1 text-xs leading-relaxed text-gray-600">
                            {notif.message}
                          </p>


                          {/* Station metadata & Action Button */}

                          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-3">

                            <span className="text-[11px] font-medium text-gray-400">

                              Station:

                              <strong className="text-gray-600">
                                {notif.operatorStation}
                              </strong>

                            </span>


                            <div className="flex items-center gap-3">

                              <button
                                onClick={(e) => {

                                  e.stopPropagation();

                                  deleteNotificationHandler(
                                    notif.id
                                  );

                                }}
                                className="text-gray-400 opacity-0 transition hover:text-red-500 group-hover:opacity-100"
                                title="Delete notification"
                              >

                                <Trash2 className="h-4 w-4" />

                              </button>


                              <button
                                onClick={(e) => {

                                  e.stopPropagation();

                                  markAsRead(notif.id);

                                  navigate(
                                    notif.actionRoute
                                  );

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

                  <h3 className="mt-3 text-sm font-bold text-gray-800">
                    All caught up!
                  </h3>

                  <p className="mt-1 text-xs text-gray-500">

                    {activeTab === 'unread'
                      ? 'You have read all notifications.'
                      : 'No notifications present in this category.'}

                  </p>

                </div>

              )}

            </AnimatePresence>

          </div>

        )}


        {/* SMS & Helpline Notice Strip */}

        <div className="mt-8 flex items-center gap-3 rounded-2xl border border-emerald-900/10 bg-emerald-50/70 p-4 text-xs text-gray-600">

          <Info className="h-5 w-5 shrink-0 text-emerald-700" />

          <span>

            Critical gate callouts are also delivered via SMS to your registered mobile number. For token queries, contact toll-free <strong>1800-180-1551</strong>.

          </span>

        </div>

      </main>

    </div>

  );
}