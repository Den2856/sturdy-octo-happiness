// UserOrders.tsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import OrderCard from "../components/ui/OrderCard";
import Header from "../components/Header";
import Spinner from "../components/ui/Spinner";

const API = import.meta.env.VITE_API_URL ?? "http://localhost:4005";

const getUserEmail = async () => {
  try {
    const res = await fetch(`${API}/api/auth/me`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const data = await res.json();
    if (res.ok) {
      return data.email;
    } else {
      throw new Error("Не удалось получить email");
    }
  } catch (error) {
    console.error("Ошибка при получении email:", error);
    throw error;
  }
};

const fetchOrders = async (email: string) => {
  const res = await fetch(`${API}/api/orders?email=${email}`);
  const data = await res.json();
  return data;
};

const isActiveOrder = (orderDate: string) => {
  const currentDate = new Date();
  const sessionDate = new Date(orderDate);
  return sessionDate >= currentDate;
};

const UserOrders: React.FC = () => {
  const [activeOrders, setActiveOrders] = useState<any[]>([]);
  const [completedOrders, setCompletedOrders] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getUserOrders = async () => {
      try {
        setIsLoading(true);
        const userEmail = await getUserEmail();
        setEmail(userEmail);
        const orders = await fetchOrders(userEmail);

        const active = orders.filter((order: any) => isActiveOrder(order.selectedDate));
        const completed = orders.filter((order: any) => !isActiveOrder(order.selectedDate));

        setActiveOrders(active);
        setCompletedOrders(completed);
      } catch (err) {
        setError("Ошибка при загрузке заказов");
      } finally {
        setIsLoading(false);
      }
    };

    getUserOrders();
  }, []);

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-black via-[#0A1210] to-emerald-900 text-white flex items-center justify-center">
          <Spinner />
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-black via-[#0A1210] to-emerald-900 text-white relative overflow-hidden">
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
            className="text-center mb-12"
          >
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent mb-4">
              My Orders
            </h1>
            <p className="text-gray-400 text-lg">Manage and view your movie bookings</p>
            {email && (
              <p className="text-emerald-400 mt-2 text-sm">Logged in as: {email}</p>
            )}
          </motion.div>

          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-500/20 border border-red-500/30 text-red-400 p-4 rounded-xl mb-8 text-center"
            >
              {error}
            </motion.div>
          )}

          <div className="space-y-12">
            {/* Активные заказы */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-8 bg-emerald-400 rounded-full"></div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white">
                  Active Orders
                  <span className="ml-3 bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-sm">
                    {activeOrders.length}
                  </span>
                </h2>
              </div>

              <AnimatePresence>
                {activeOrders.length > 0 ? (
                  <div className="grid gap-6">
                    {activeOrders.map((order, index) => (
                      <motion.div
                        key={order.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <OrderCard order={order} isActive={true} />
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-gray-900/50 backdrop-blur-lg rounded-2xl p-12 text-center border border-gray-700/50"
                  >
                    <div className="w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-300 mb-2">No Active Orders</h3>
                    <p className="text-gray-500">You don't have any upcoming movie bookings</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Завершенные заказы */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-8 bg-blue-400 rounded-full"></div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white">
                  Completed Orders
                  <span className="ml-3 bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm">
                    {completedOrders.length}
                  </span>
                </h2>
              </div>

              <AnimatePresence>
                {completedOrders.length > 0 ? (
                  <div className="grid gap-6">
                    {completedOrders.map((order, index) => (
                      <motion.div
                        key={order.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 + 0.2 }}
                      >
                        <OrderCard order={order} isActive={false} />
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-gray-900/50 backdrop-blur-lg rounded-2xl p-12 text-center border border-gray-700/50"
                  >
                    <div className="w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-300 mb-2">No Completed Orders</h3>
                    <p className="text-gray-500">Your past movie bookings will appear here</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserOrders;