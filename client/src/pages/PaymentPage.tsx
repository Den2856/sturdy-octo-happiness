import React, { useEffect, useMemo, useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import Header from "../components/Header";

type SeatType = "Regular" | "Premium" | "VIP";
type Seat = { _id: string; name: string; type: SeatType; theaterId?: string };

const SURCHARGE: Record<SeatType, number> = {
  Regular: 0,
  Premium: 10,
  VIP: 20,
};

const SERVICE_RATE = 0.06;

const AnimatedAmount: React.FC<{ value: number; prefix?: string; className?: string }> = ({
  value,
  prefix = "$",
  className = "",
}) => {
  const [display, setDisplay] = useState(0);
  
  useEffect(() => {
    const end = value;
    const duration = 1000;
    let startTime: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      setDisplay(progress * end);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value]);

  return <span className={className}>{prefix} {display.toFixed(2)}</span>;
};

const PaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [order, setOrder] = useState<{
    movieId: string;
    title: string;
    theaterId: string;
    dateISO?: string;
    time: string;
    seats: string[];
    total?: number;
  } | null>(null);

  const [movieData, setMovieData] = useState<{
    price: number;
    title?: string;
    theaterId?: string;
    coverUrl?: string;
    selectedDate?: string;
    dateISO?: string;
    selectedTime?: string;
    runtime: string;
    runtimeFormatted: string;
  } | null>(null);

  const [seatsFlat, setSeatsFlat] = useState<Seat[]>([]);

  useEffect(() => {
    const o = Cookies.get("orderSummary");
    const md = Cookies.get("movieData");
    if (!o || !md) {
      navigate("/");
      return;
    }
    setOrder(JSON.parse(o));
    setMovieData(JSON.parse(md));

    (async () => {
      try {
        const res = await axios.get<Seat[]>("/api/seats", {
          params: { theaterId: JSON.parse(md).theaterId },
        });
        setSeatsFlat(res.data);
      } catch (e) {
        console.error("Failed to load seats", e);
      }
    })();
  }, [navigate]);

  const basePrice = Number(movieData?.price ?? 0);

  const seatDetails = useMemo(() => {
    if (!order) return [];
    return order.seats.map((name) => {
      const type = seatsFlat.find((s) => s.name === name)?.type ?? "Regular";
      const price = basePrice + (SURCHARGE[type] ?? 0);
      return { name, type, price };
    });
  }, [order, seatsFlat, basePrice]);

  const grouped = useMemo(() => {
    const g: Record<SeatType, { count: number; unit: number }> = {
      Regular: { count: 0, unit: basePrice + SURCHARGE.Regular },
      Premium: { count: 0, unit: basePrice + SURCHARGE.Premium },
      VIP: { count: 0, unit: basePrice + SURCHARGE.VIP },
    };
    for (const s of seatDetails) g[s.type].count += 1;
    return g;
  }, [seatDetails, basePrice]);

  const subtotal = useMemo(
    () => seatDetails.reduce((sum, s) => sum + s.price, 0),
    [seatDetails]
  );
  const service = useMemo(() => subtotal * SERVICE_RATE, [subtotal]);
  const grandTotal = useMemo(() => subtotal + service, [subtotal, service]);

  const dateText = useMemo(() => {
    const raw = order?.dateISO ?? movieData?.dateISO ?? movieData?.selectedDate;
    if (!raw) return "";
    const d = new Date(raw);
    return d.toLocaleDateString(undefined, { weekday: "short", day: "2-digit", month: "short", year: "numeric" });
  }, [order, movieData]);

  const ticketCount = order?.seats.length ?? 0;

  const onCheckout = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    navigate("/payment-verification");
  };

  const SeatTypeBadge: React.FC<{ type: SeatType }> = ({ type }) => {
    const colors = {
      Regular: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      Premium: "bg-purple-500/20 text-purple-400 border-purple-500/30",
      VIP: "bg-amber-500/20 text-amber-400 border-amber-500/30"
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${colors[type]}`}>
        {type}
      </span>
    );
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-black via-[#0A1210] to-emerald-900/30 text-white relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 mx-auto w-full max-w-4xl px-4 sm:px-6 py-8 sm:py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent mb-4">
              Complete Your Booking
            </h1>
            <p className="text-gray-400 text-lg">Review your order details before proceeding</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="lg:col-span-2 space-y-6"
            >
              {/* Movie Card */}
              <div className="bg-gradient-to-br from-gray-900/80 to-emerald-900/30 backdrop-blur-lg rounded-2xl p-6 border border-emerald-500/20 shadow-2xl">
                <div className="flex items-start gap-4">
                  <div className="w-32 h-32 bg-emerald-500/20 rounded-xl flex items-center justify-center overflow-hidden">
                    {movieData?.coverUrl ? (
                      <img 
                        src={movieData.coverUrl} 
                        alt={movieData.title || "Movie poster"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-white mb-2">{order?.title || movieData?.title || "—"}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Duration:</span>
                        <span className="text-white ml-2">{movieData?.runtimeFormatted || movieData?.runtime || "—"}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Date & Time:</span>
                        <span className="text-white ml-2">{dateText} at {movieData?.selectedTime || order?.time || "—"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Seats Card */}
              <div className="bg-gradient-to-br from-gray-900/80 to-blue-900/30 backdrop-blur-lg rounded-2xl p-6 border border-blue-500/20 shadow-2xl">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                  </svg>
                  Selected Seats ({ticketCount})
                </h3>
                <div className="flex flex-wrap gap-3">
                  {order?.seats.map((seat, index) => {
                    const type = seatsFlat.find((s) => s.name === seat)?.type ?? "Regular";
                    return (
                      <motion.div
                        key={seat}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-black/30 rounded-xl p-4 border border-white/10 min-w-[100px] text-center"
                      >
                        <div className="text-2xl font-bold text-white mb-2">{seat}</div>
                        <SeatTypeBadge type={type} />
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>

            {/* Right Column - Payment Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="lg:col-span-2"
            >
              <div className="bg-gradient-to-br from-gray-900/80 to-purple-900/30 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/20 shadow-2xl sticky top-6">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Payment Summary
                </h3>

                <div className="space-y-4 mb-6">
                  {(["Regular", "Premium", "VIP"] as SeatType[]).map((t) =>
                    grouped[t].count ? (
                      <motion.div
                        key={t}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="flex items-center justify-between py-2 border-b border-white/10"
                      >
                        <div className="flex items-center gap-2">
                          <SeatTypeBadge type={t} />
                          <span className="text-white/70 text-sm">×{grouped[t].count}</span>
                        </div>
                        <AnimatedAmount value={grouped[t].unit * grouped[t].count} className="text-white font-medium" />
                      </motion.div>
                    ) : null
                  )}

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="flex items-center justify-between py-2 border-b border-white/10"
                  >
                    <span className="text-white/70">Service Fee (6%)</span>
                    <AnimatedAmount value={service} className="text-white/70" />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="flex items-center justify-between pt-4 border-t border-white/20"
                  >
                    <span className="text-white font-semibold text-lg">Total</span>
                    <AnimatedAmount value={grandTotal} className="text-2xl font-bold text-emerald-400" />
                  </motion.div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onCheckout}
                  disabled={!ticketCount || isLoading}
                  className="w-full py-4 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Proceed to Verification
                    </>
                  )}
                </motion.button>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="mt-4 text-center"
                >
                  <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                    <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Secure SSL encrypted payment
                  </div>
                  <p className="text-xs text-gray-500 mt-2">*Tickets cannot be canceled or refunded after purchase</p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentPage;