import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sprout,
  CalendarDays,
  GitFork,
  Activity,
  ShieldCheck,
  Scale,
  ClipboardList,
  BarChart3,
  ChevronRight,
  Menu,
  X,
  User,
  Building2,
  CheckCircle2,
  Phone,
  Mail,
  ArrowRight,
  Users
} from 'lucide-react';

const farmerFeatures = [
  {
    icon: CalendarDays,
    title: 'Slot Booking',
    desc: 'Schedule mandi arrival slots in advance to avoid long physical waiting queues.'
  },
  {
    icon: GitFork,
    title: 'Live Queue Tracking',
    desc: 'Track live tractor/vehicle entry status and queue position directly on mobile.'
  },
  {
    icon: Activity,
    title: 'Transparent Settlement',
    desc: 'Verify digital weighment receipts and track direct DBT payments in real time.'
  }
];

const operatorFeatures = [
  {
    icon: Scale,
    title: 'Weighbridge & Assaying',
    desc: 'Directly record certified weights and crop quality grading data seamlessly.'
  },
  {
    icon: ClipboardList,
    title: 'Token & Gate Clearance',
    desc: 'Verify booking tokens, scan vehicle numbers, and clear gate entries systematically.'
  },
  {
    icon: BarChart3,
    title: 'Procurement Analytics',
    desc: 'Generate real-time intake summaries, crop quotas, and central inventory reports.'
  }
];

export default function Home() {
  
  const navigate = useNavigate();

  

  return (
    <div className="relative min-h-screen w-full bg-[#f8faf7] font-sans text-gray-800 antialiased selection:bg-emerald-200 selection:text-emerald-900">
      
      {/* Background Graphic */}
      <div 
        className="pointer-events-none absolute inset-0 z-0 h-[640px] w-full bg-cover bg-center opacity-85"
        style={{
          backgroundImage: `
            radial-gradient(ellipse at 80% 30%, rgba(209, 250, 229, 0.45) 0%, rgba(255,255,255,0) 70%),
            linear-gradient(to bottom, rgba(255,255,255,0.7) 0%, rgba(248, 250, 247, 1) 100%),
            url('https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=2000&q=80')
          `
        }}
      />

      {/* Navigation Header */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="sticky top-0 z-50 border-b border-emerald-900/5 bg-white/90 backdrop-blur-md"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5 lg:px-12">
          
          {/* Logo */}
          <div 
            onClick={() => navigate('/')} 
            className="flex cursor-pointer items-center gap-2.5"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#14532d] text-white shadow-sm">
              <Sprout className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <span className="block text-lg font-extrabold leading-tight tracking-tight text-[#14532d]">
                SmartProcure
              </span>
              <span className="block text-[10px] font-semibold uppercase tracking-wider text-emerald-700">
                Govt. Procurement Portal
              </span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden items-center gap-6 text-xs font-semibold text-gray-600 lg:flex">
            <a href="#about" className="transition hover:text-[#14532d]">About Portal</a>
            <a href="#portals" className="transition hover:text-[#14532d]">Portals</a>
            <a href="#how-it-works" className="transition hover:text-[#14532d]">Workflow</a>
            <a href="#support" className="transition hover:text-[#14532d]">Help Desk</a>
          </nav>

          

         
        </div>

      </motion.header>

      {/* Hero Section */}
      <main className="relative z-10 mx-auto max-w-7xl px-6 pt-12 pb-16 lg:px-12 lg:pt-16">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-[#14532d]">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Empowering Mandis & Farmers Nationwide
          </div>

          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-[3.5rem] lg:leading-[1.15]">
            Bridging Farmers & Mandi Operators <br />
            <span className="text-[#14532d]">Through Digital Procurement</span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-gray-600 sm:text-lg">
            A single unified platform designed to eliminate mandi congestion for farmers while streamlining verification, weighing, and reporting workflows for procurement officials.
          </p>
        </div>

        {/* Dual Portal Gateway Section */}
        <section id="portals" className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-2">
          
          {/* Card 1: Farmer Portal */}
          <motion.div 
            whileHover={{ y: -4 }}
            className="flex flex-col justify-between rounded-3xl border border-emerald-900/10 bg-white/90 p-8 shadow-sm backdrop-blur-md"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-[#14532d]">
                  <Sprout className="h-6 w-6" />
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-700">
                  For Kisan / Farmers
                </span>
              </div>

              <h2 className="mt-5 text-2xl font-bold text-gray-900">Farmer Gateway</h2>
              <p className="mt-2 text-xs leading-relaxed text-gray-500">
                Book arrival slots from the comfort of your home, track vehicle queue positions live, and receive direct digital settlement receipts.
              </p>

              <div className="mt-6 space-y-3 border-t border-gray-100 pt-5">
                {farmerFeatures.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="mt-0.5 rounded-lg bg-emerald-50 p-1.5 text-[#14532d]">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-gray-800">{item.title}</h4>
                        <p className="text-[11px] text-gray-500">{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <button 
                onClick={() => navigate('/login')}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#14532d] py-3 text-xs font-bold text-white shadow-md transition hover:bg-[#0f3e21]"
              >
                Farmer Login <ArrowRight className="h-3.5 w-3.5" />
              </button>
              <button 
                onClick={() => navigate('/register')}
                className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-xs font-bold text-gray-700 transition hover:bg-gray-50"
              >
                Register
              </button>
            </div>
          </motion.div>

          {/* Card 2: Operator / Official Portal */}
          <motion.div 
            whileHover={{ y: -4 }}
            className="flex flex-col justify-between rounded-3xl border border-gray-200 bg-white/90 p-8 shadow-sm backdrop-blur-md"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-800">
                  <Building2 className="h-6 w-6" />
                </div>
                <span className="rounded-full bg-blue-50 px-3 py-1 text-[11px] font-bold text-blue-700">
                  For Mandi Staff & APMC
                </span>
              </div>

              <h2 className="mt-5 text-2xl font-bold text-gray-900">Operator Terminal</h2>
              <p className="mt-2 text-xs leading-relaxed text-gray-500">
                Manage center operations, clear gate tokens, record digital weighbridge inputs, and log automated crop assaying results.
              </p>

              <div className="mt-6 space-y-3 border-t border-gray-100 pt-5">
                {operatorFeatures.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="mt-0.5 rounded-lg bg-blue-50 p-1.5 text-blue-700">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-gray-800">{item.title}</h4>
                        <p className="text-[11px] text-gray-500">{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <button 
                onClick={() => navigate('/operatorlogin')}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gray-900 py-3 text-xs font-bold text-white shadow-md transition hover:bg-gray-800"
              >
                Mandi Staff Login <ArrowRight className="h-3.5 w-3.5" />
              </button>
              <button 
                onClick={() => navigate('/operatorregistration')}
                className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-xs font-bold text-gray-700 transition hover:bg-gray-50"
              >
                Operator Registration
              </button>
            </div>
          </motion.div>

        </section>

        {/* System Value Indicators */}
        <div id="about" className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: 'Wait Time Cut', value: '85%', desc: 'Reduction in physical mandi lines' },
            { label: 'Weighing Accuracy', value: '100%', desc: 'Tamper-free integrated scales' },
            { label: 'DBT Processing', value: '< 48 Hrs', desc: 'Direct bank account transfer' },
            { label: 'Procurement Scale', value: '1,450+', desc: 'Active connected mandi centers' }
          ].map((stat, idx) => (
            <div key={idx} className="rounded-2xl border border-emerald-900/5 bg-white p-5 text-center shadow-sm">
              <span className="block text-2xl font-black text-[#14532d] sm:text-3xl">{stat.value}</span>
              <span className="mt-1 block text-xs font-bold text-gray-800">{stat.label}</span>
              <span className="mt-0.5 block text-[10px] text-gray-500">{stat.desc}</span>
            </div>
          ))}
        </div>
      </main>

      {/* Workflow Section */}
      <section id="how-it-works" className="border-t border-emerald-900/5 bg-white py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-[#14532d]">End-to-End Coordination</span>
            <h2 className="mt-2 text-2xl font-black text-gray-900 sm:text-3xl">
              How SmartProcure Unifies the Mandi Process
            </h2>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                role: 'Farmer',
                title: '1. Online Slot Booking',
                desc: 'Farmer selects nearest center and receives a verified QR token.'
              },
              {
                role: 'Operator',
                title: '2. Gate Verification',
                desc: 'Mandi guard or operator scans the digital token for smooth entry.'
              },
              {
                role: 'Joint',
                title: '3. Weighment & Assaying',
                desc: 'Electronic weighbridge automatically logs weight to the system.'
              },
              {
                role: 'Government',
                title: '4. Direct Settlement',
                desc: 'E-receipt generated and DBT payment triggered directly to the farmer.'
              }
            ].map((step, idx) => (
              <div key={idx} className="relative rounded-2xl border border-gray-100 bg-[#f8faf7] p-5 shadow-sm">
                <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                  {step.role}
                </span>
                <h3 className="mt-3 text-sm font-bold text-gray-900">{step.title}</h3>
                <p className="mt-1.5 text-xs text-gray-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Support Center */}
      <section id="support" className="border-t border-gray-100 bg-[#f8faf7] py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="flex flex-col items-center justify-between gap-6 rounded-3xl bg-emerald-900 p-8 text-white sm:flex-row sm:p-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">National Support Center</span>
              <h2 className="mt-1 text-2xl font-bold">Need Help With Your Role or Token?</h2>
              <p className="mt-2 text-xs text-emerald-100">
                Contact our toll-free 24/7 helpdesk for token assistance or mandi terminal troubleshooting.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a 
                href="tel:18001801551" 
                className="flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-xs font-bold text-emerald-950 transition hover:bg-emerald-50"
              >
                <Phone className="h-4 w-4 text-emerald-700" />
                1800-180-1551
              </a>
              <a 
                href="mailto:support@smartprocure.gov.in" 
                className="flex items-center gap-2 rounded-xl border border-emerald-700 bg-emerald-800/50 px-5 py-3 text-xs font-bold text-white transition hover:bg-emerald-800"
              >
                <Mail className="h-4 w-4 text-emerald-300" />
                Email Support
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 text-xs text-gray-500 sm:flex-row lg:px-12">
          <div className="flex items-center gap-2">
            <Sprout className="h-4 w-4 text-emerald-700" />
            <span className="font-bold text-gray-900">SmartProcure</span>
            <span>• Government Agricultural Procurement System (2026)</span>
          </div>
          <div className="flex gap-4">
            <span onClick={() => navigate('/login')} className="cursor-pointer hover:underline">Farmer Portal</span>
            <span onClick={() => navigate('/login')} className="cursor-pointer hover:underline">Operator Portal</span>
            <span onClick={() => navigate('/dashboard')} className="cursor-pointer hover:underline">System Dashboard</span>
          </div>
        </div>
      </footer>

    </div>
  );
}