import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

interface Order {
  _id: string;
  title: string;
  selectedDate: string;
  seats: string[];
  price: number;
  selectedTime?: string;
  theater?: string;
}

interface OrderCardProps {
  order: Order;
  isActive: boolean;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, isActive }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = () => {
    if (isActive) {
      return (
        <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-xs font-medium border border-emerald-500/30">
          Upcoming
        </span>
      );
    } else {
      return (
        <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-xs font-medium border border-blue-500/30">
          Completed
        </span>
      );
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="bg-gradient-to-br from-gray-900/80 to-emerald-900/30 backdrop-blur-lg rounded-2xl p-6 border border-emerald-500/20 shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300"
    >
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
        {/* Left Section - Movie Info */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-xl font-bold text-white line-clamp-2">{order.title}</h3>
            {getStatusBadge()}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <div className="text-gray-400">Date & Time</div>
                <div className="text-white font-medium">
                  {formatDate(order.selectedDate)}
                  {order.selectedTime && ` • ${order.selectedTime}`}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                </svg>
              </div>
              <div>
                <div className="text-gray-400">Seats</div>
                <div className="text-white font-medium">{order.seats.join(", ")}</div>
              </div>
            </div>

            {order.theater && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <div className="text-gray-400">Theater</div>
                  <div className="text-white font-medium">{order.theater}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Section - Price and Actions */}
        <div className="flex flex-col items-end gap-4">
          <div className="text-right">
            <div className="text-gray-400 text-sm">Total Price</div>
            <div className="text-2xl font-bold text-emerald-400">${order.price}</div>
          </div>

          <div className="flex gap-3">
            {isActive && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-500 transition-colors duration-200"
              >
                <Link to={`/ticket/${order._id}`} className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                  </svg>
                  View Ticket
                </Link>
              </motion.button>
            )}
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg text-sm font-medium hover:bg-gray-600 transition-colors duration-200"
            >
              Details
            </motion.button>
          </div>
        </div>
      </div>

      {/* Order ID */}
      <div className="mt-4 pt-4 border-t border-gray-700/50">
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
          </svg>
          Order ID: {order._id}
        </div>
      </div>
    </motion.div>
  );
};

export default OrderCard;