// Ticket.tsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import ThreeBackground from "../components/animations/ticket";
import Spinner from "../components/ui/Spinner";

const getCookie = (name: string): string | undefined => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return decodeURIComponent(parts.pop()?.split(';').shift() || '');
  return undefined;
};

const TicketDetail: React.FC = () => {
  const [orderData, setOrderData] = useState<any>(null);

  useEffect(() => {
    const cookieData = getCookie("orderData");
    if (cookieData) {
      setOrderData(JSON.parse(cookieData));
    }
  }, []);

  if (!orderData) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-black via-[#0A1210] to-emerald-900 text-white">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-black via-[#0A1210] to-emerald-900 overflow-hidden">
      <ThreeBackground />
      
      <div className="relative z-10 flex justify-center items-center min-h-screen p-4">
        <motion.div
          className="relative max-w-md w-full"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
        >
          {/* Ticket Cut Effect Container */}
          <div className="relative">

            {/* Main Ticket */}
            <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-emerald-900 rounded-2xl shadow-2xl overflow-hidden border-2 border-emerald-500/30">
              {/* Ticket Header */}
              <div className="bg-gradient-to-r from-emerald-900 to-black p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-500/10 rounded-full -ml-12 -mb-12"></div>
                
                <div className="relative z-10 flex justify-between items-start">
                  <div>
                    <h1 className="text-2xl font-bold text-white mb-2">{orderData.title}</h1>
                    <p className="text-emerald-400 text-sm">E-TICKET</p>
                  </div>
                  <div className="text-right">
                    <div className="bg-emerald-500/20 px-3 py-1 rounded-full">
                      <span className="text-emerald-400 text-sm font-semibold">CONFIRMED</span>
                    </div>

                  </div>
                </div>
              </div>

              {/* Ticket Content */}
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-black/30 p-4 rounded-lg">
                    <p className="text-gray-400 text-sm">DATE</p>
                    <p className="text-white font-semibold">{new Date(orderData.selectedDate).toLocaleDateString()}</p>
                  </div>
                  <div className="bg-black/30 p-4 rounded-lg">
                    <p className="text-gray-400 text-sm">TIME</p>
                    <p className="text-white font-semibold">{orderData.selectedTime}</p>
                  </div>
                  <div className="bg-black/30 p-4 rounded-lg">
                    <p className="text-gray-400 text-sm">SEATS</p>
                    <p className="text-white font-semibold">{orderData.selectedSeats.join(", ")}</p>
                  </div>
                  <div className="bg-black/30 p-4 rounded-lg">
                    <p className="text-gray-400 text-sm">TOTAL</p>
                    <p className="text-emerald-400 font-bold">$ {orderData.price}</p>
                  </div>
                </div>

                <div className="bg-black/40 p-4 rounded-lg mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-gray-400">RUNTIME</p>
                  </div>
                  <p className="text-emerald-400 font-semibold">{orderData.runtimeFormatted}</p>
                </div>

                {/* Barcode */}
                <div className="bg-white p-4 rounded-lg mb-6">
                  <div className="text-center text-black mb-2 font-semibold">SCAN AT ENTRANCE</div>
                  <div className="flex justify-center space-x-1 mb-2">
                    {[...Array(40)].map((_, i) => (
                      <div 
                        key={i} 
                        className="w-1 h-16 bg-black"
                        style={{ 
                          height: `${20 + Math.random() * 30}px`,
                          opacity: 0.7 + Math.random() * 0.3
                        }}
                      ></div>
                    ))}
                  </div>
                  <div className="text-center text-black text-sm font-mono">{orderData.orderId}</div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <motion.button
                    className="w-full py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Download E-Ticket
                  </motion.button>
                  
                  <motion.button
                    className="w-full py-4 bg-gradient-to-r from-gray-700 to-gray-800 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link to="/" className="block w-full">
                      Back to Homepage
                    </Link>
                  </motion.button>
                </div>
              </div>
            </div>
          </div>

          {/* Floating elements */}
          <motion.div
            className="absolute -top-2 -right-3 w-8 h-8 bg-emerald-500 rounded-full"
            animate={{ y: [0, -5, 0], x: [0, 5, 0,] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.div
            className="absolute -bottom-2 -left-3 w-6 h-6 bg-emerald-400 rounded-full"
            animate={{ y: [0, 5, 0,], x: [0, 5, 0,] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default TicketDetail;