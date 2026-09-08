import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, User } from 'lucide-react';

// Pre-stored Q&A knowledge base
const KNOWLEDGE_BASE = [
    {
        keywords: ['book', 'slot', 'booking', 'appointment', 'schedule'],
        question: 'How can I book a slot?',
        answer:
            'To book a procurement slot:\n1. Open the "Slot Booking" section on the dashboard.\n2. Select your nearest Mandi / Procurement Center.\n3. Choose your preferred date and time slot.\n4. Enter the crop name and estimated quantity (in quintals).\n5. Click "Confirm Booking" to generate your entry token.',
    },
    {
        keywords: ['price', 'msp', 'rate', 'rates', 'cost'],
        question: 'What are the current MSP crop prices?',
        answer:
            'Current Minimum Support Price (MSP) guidelines:\n• Paddy (Common): ₹2,300 / quintal\n• Paddy (Grade A): ₹2,320 / quintal\n• Wheat: ₹2,275 / quintal\n• Mustard: ₹5,650 / quintal\n• Chana (Gram): ₹5,440 / quintal',
    },
    {
        keywords: ['document', 'documents', 'paper', 'papers', 'proof', 'require'],
        question: 'What documents are required for crop sale?',
        answer:
            'Please carry original and copies of:\n1. Aadhaar Card / Voter ID\n2. Bank Account Passbook (linked with Aadhaar)\n3. Land Ownership Records (Khasra/Khatauni / Patta)\n4. Farmer Registration Slip / Slot Booking Token',
    },
    {
        keywords: ['status', 'track', 'token', 'check'],
        question: 'How can I track my procurement status?',
        answer:
            'You can check your status under the "My Orders / Bookings" tab. Enter your 8-digit Token ID or registered mobile number to see real-time verification and payout updates.',
    },
    {
        keywords: ['payment', 'money', 'bank', 'transfer', 'dbt'],
        question: 'When will I receive my payment?',
        answer:
            'Payments are directly credited via DBT (Direct Benefit Transfer) into your Aadhaar-linked bank account within 48 to 72 hours after successful quality inspection at the center.',
    },
    {
        keywords: ['hi', 'hello', 'hey', 'namaste', 'hii', 'hlo'],
        question: 'Greetings',
        answer:
            'Namaste! 🙏 How can I assist you today? You can ask about slot booking, MSP rates, required documents, or payment status.',
    },
    {
        keywords: ['help', 'contact', 'support', 'helpline', 'call'],
        question: 'Toll-free farmer helpline',
        answer:
            'For immediate on-ground support, contact the Kisan Call Centre at 1800-180-1551 (Toll-Free, 6:00 AM to 10:00 PM) or visit your local Krishi Vigyan Kendra (KVK).',
    },
];

// Fallback reply if no keywords match
const DEFAULT_FALLBACK =
    'I am not sure about that specific query. You can ask me about:\n• How to book a slot\n• Current MSP rates\n• Required documents\n• Payment time & process\n• Kisan helpline numbers';

export default function FarmerAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [inputMessage, setInputMessage] = useState('');
    const [messages, setMessages] = useState([
        {
            id: 1,
            sender: 'bot',
            text: 'Namaste! 👋 I am SmartProcure Assistant. How can I help you today?',
        },
    ]);

    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isOpen]);

    // Find best matching answer from local knowledge base
    const findAnswer = (userInput) => {
        const cleanInput = userInput.toLowerCase().trim();

        // Direct match against keywords
        for (const item of KNOWLEDGE_BASE) {
            const match = item.keywords.some((keyword) => {
                // Match whole word or direct inclusion
                const regex = new RegExp(`\\b${keyword}\\b`, 'i');
                return regex.test(cleanInput) || cleanInput.includes(keyword);
            });

            if (match) {
                return item.answer;
            }
        }

        return DEFAULT_FALLBACK;
    };

    const handleSend = (userText) => {
        const query = userText || inputMessage;
        if (!query.trim()) return;

        const userMessage = {
            id: Date.now(),
            sender: 'user',
            text: query,
        };

        const botResponse = {
            id: Date.now() + 1,
            sender: 'bot',
            text: findAnswer(query),
        };

        setMessages((prev) => [...prev, userMessage, botResponse]);
        setInputMessage('');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
            {/* Chat Window */}
            {isOpen && (
                <div className="mb-4 flex h-[520px] w-80 flex-col overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-2xl sm:w-96">
                    {/* Header */}
                    <div className="flex items-center justify-between bg-emerald-700 px-4 py-3 text-white">
                        <div className="flex items-center space-x-2">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-800 text-lg">
                                🌾
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold leading-tight">SmartProcure</h3>
                                <p className="text-xs text-emerald-200">Farmer Assistant</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="rounded-full p-1 text-emerald-100 transition hover:bg-emerald-800 hover:text-white"
                            aria-label="Close Chat"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Messages Body */}
                    <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50 p-4">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex items-start gap-2 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                                    }`}
                            >
                                <div
                                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs ${msg.sender === 'user'
                                            ? 'bg-emerald-600 text-white'
                                            : 'bg-emerald-100 text-emerald-800'
                                        }`}
                                >
                                    {msg.sender === 'user' ? <User className="h-4 w-4" /> : '🌾'}
                                </div>
                                <div
                                    className={`max-w-[80%] whitespace-pre-line rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed shadow-sm ${msg.sender === 'user'
                                            ? 'bg-emerald-600 text-white rounded-tr-none'
                                            : 'border border-gray-100 bg-white text-gray-800 rounded-tl-none'
                                        }`}
                                >
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Question Chips */}
                    <div className="flex gap-1.5 overflow-x-auto border-t border-gray-100 bg-white px-3 py-2">
                        {[
                            'How can I book a slot?',
                            'Current MSP prices',
                            'Required documents',
                            'Payment timeline',
                        ].map((prompt, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleSend(prompt)}
                                className="whitespace-nowrap rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-800 transition hover:bg-emerald-100 hover:border-emerald-300"
                            >
                                {prompt}
                            </button>
                        ))}
                    </div>

                    {/* Input Box */}
                    <div className="border-t border-gray-100 bg-white p-3">
                        <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-1.5 focus-within:border-emerald-500 focus-within:bg-white focus-within:ring-1 focus-within:ring-emerald-500">
                            <input
                                type="text"
                                placeholder="Ask a question (e.g., slot, msp, docs)..."
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="w-full bg-transparent text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none"
                            />
                            <button
                                onClick={() => handleSend()}
                                disabled={!inputMessage.trim()}
                                className="rounded-lg bg-emerald-600 p-1.5 text-white transition hover:bg-emerald-700 disabled:opacity-40"
                                aria-label="Send Message"
                            >
                                <Send className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Floating Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white shadow-xl transition-transform hover:scale-105 hover:bg-emerald-700 focus:outline-none"
                aria-label="Toggle Chat"
            >
                {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
            </button>
        </div>
    );
}