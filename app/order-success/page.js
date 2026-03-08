"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
    CheckCircle2,
    Package,
    Truck,
    ArrowRight,
    Home,
    ClipboardList,
    ShoppingBag,
    Calendar,
    User,
    MapPin
} from "lucide-react";
import confetti from "canvas-confetti";

function OrderSuccessContent() {
    const searchParams = useSearchParams();
    const invoiceId = searchParams.get("invoice");
    const [customerDetails, setCustomerDetails] = useState(null);

    useEffect(() => {
        // Trigger confetti on mount
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min, max) => Math.random() * (max - min) + min;

        const interval = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            // since particles fall down, start a bit higher than random
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);

        // Load customer details from localStorage
        const savedDetails = localStorage.getItem("allionCheckoutDetails");
        if (savedDetails) {
            try {
                setCustomerDetails(JSON.parse(savedDetails));
            } catch (e) {
                console.error("Failed to parse customer details", e);
            }
        }

        return () => clearInterval(interval);
    }, []);

    const today = new Date().toLocaleDateString("en-US", {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 md:p-8">
            <div className="max-w-3xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 relative">
                {/* Top Banner with Gradient */}
                <div className="h-32 bg-gradient-to-r from-brand-red to-red-500 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] animate-pulse"></div>
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg transform -mb-16 z-10 border-4 border-white">
                        <CheckCircle2 className="w-12 h-12 text-brand-red" />
                    </div>
                </div>

                <div className="pt-20 pb-10 px-6 md:px-12 text-center">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">Order Success!</h1>
                    <p className="text-gray-500 text-lg mb-8">Thank you for your purchase. We've received your order and are processing it.</p>

                    {/* Invoice Number Card */}
                    <div className="bg-red-50 rounded-2xl p-6 mb-8 border border-red-100 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                <ClipboardList className="w-6 h-6 text-brand-red" />
                            </div>
                            <div className="text-left">
                                <p className="text-xs font-bold text-red-400 uppercase tracking-wider mb-0.5">Invoice Number</p>
                                <h2 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">#{invoiceId || "N/A"}</h2>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-gray-500 bg-white/50 px-4 py-2 rounded-lg border border-red-50">
                            <Calendar className="w-4 h-4" />
                            <span className="text-sm font-medium">{today}</span>
                        </div>
                    </div>

                    {/* Customer Details Summary */}
                    {customerDetails && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 text-left">
                            <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100">
                                <div className="flex items-center gap-2 mb-3 text-brand-red">
                                    <User className="w-4 h-4" />
                                    <h3 className="font-bold text-sm">Customer Details</h3>
                                </div>
                                <p className="font-extrabold text-gray-900">{customerDetails.firstName}</p>
                                <p className="text-sm text-gray-500">{customerDetails.phone}</p>
                                {customerDetails.email && <p className="text-sm text-gray-500">{customerDetails.email}</p>}
                            </div>
                            <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100">
                                <div className="flex items-center gap-2 mb-3 text-brand-red">
                                    <MapPin className="w-4 h-4" />
                                    <h3 className="font-bold text-sm">Shipping Address</h3>
                                </div>
                                <p className="text-sm text-gray-600 leading-relaxed font-medium">
                                    {customerDetails.address},<br />
                                    {customerDetails.city}, {customerDetails.district}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Link
                            href={`/track-order?invoice=${invoiceId}`}
                            className="flex items-center justify-center gap-3 bg-gray-900 text-white px-8 py-4 rounded-2xl font-bold shadow-xl hover:bg-black transition-all group"
                        >
                            <Truck className="w-5 h-5 group-hover:animate-bounce" />
                            Track Order
                            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all" />
                        </Link>
                        <Link
                            href="/"
                            className="flex items-center justify-center gap-3 bg-brand-red text-white px-8 py-4 rounded-2xl font-bold shadow-xl hover:bg-[#ff1a2b] transition-all"
                        >
                            <Home className="w-5 h-5" />
                            Return Home
                        </Link>
                    </div>

                    <div className="mt-8 pt-8 border-t border-gray-100 text-gray-400 text-sm flex flex-wrap items-center justify-center gap-6">
                        <div className="flex items-center gap-2">
                            <Package className="w-4 h-4" />
                            <span>Fast Delivery</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Authentic Products</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Helpful Link */}
            <p className="mt-8 text-gray-500 text-sm font-medium">
                Need help? <Link href="/contact" className="text-brand-red hover:underline">Contact Support</Link>
            </p>
        </div>
    );
}

export default function OrderSuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-red"></div>
            </div>
        }>
            <OrderSuccessContent />
        </Suspense>
    );
}
