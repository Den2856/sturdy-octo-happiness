import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const API = import.meta.env.VITE_API_URL ?? "http://localhost:4005";

const PaymentVerificationPage: React.FC = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

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
        setEmail(data.email);
      } else {
        setMessage(data.message || "Не удалось получить данные пользователя");
      }
    } catch (error) {
      setMessage("Ошибка при получении данных пользователя");
    }
  };

  useEffect(() => {
    getUserEmail();
  }, []);

  const sendCode = async (userEmail: string) => {
    if (isCodeSent && countdown > 0) {
      setMessage(`Please wait ${countdown} seconds before requesting a new code`);
      return;
    }

    setIsLoading(true);
    setMessage("");

    const res = await fetch(`${API}/api/email/send-code`, {
      method: "POST",
      body: JSON.stringify({ email: userEmail }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    if (res.ok) {
      setMessage("✓ Verification code sent to your email");
      setIsCodeSent(true);
      setCountdown(60);
    } else {
      setMessage(data.error);
    }
    setIsLoading(false);
  };

  const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return decodeURIComponent(parts.pop()?.split(';').shift() || '');
    return '';
  };

  const setCookie = (name: string, value: string, days: number) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/`;
  };

  const saveOrderDataToCookie = (orderData: any) => {
    const orderDataString = JSON.stringify(orderData);
    setCookie("orderData", orderDataString, 7);
  };

  const verifyCode = async () => {
    if (!code.trim()) {
      setMessage("Please enter the verification code");
      return;
    }

    setIsLoading(true);
    setMessage("");

    const movieData = getCookie("movieData");
    const summaryData = getCookie("orderSummary")

    const parsedMovieData = movieData ? JSON.parse(decodeURIComponent(movieData)) : null;
    const parsedSummaryData = summaryData ? JSON.parse(decodeURIComponent(summaryData)) : null;

    const orderData = {
      movieId: parsedMovieData?.movieId || getCookie("movieId"),
      title: parsedMovieData?.title || getCookie("title"),
      coverUrl: parsedMovieData?.coverUrl || getCookie("coverUrl"),
      price:  parsedSummaryData?.total || getCookie("total"),
      theaterId: parsedMovieData?.theaterId || getCookie("theaterId"),
      selectedDate: parsedMovieData?.selectedDate || getCookie("selectedDate"),
      selectedSeats: parsedSummaryData.seats || getCookie("seats"),
      selectedTime: parsedMovieData?.selectedTime || getCookie("selectedTime"),
      runtimeFormatted: parsedMovieData?.runtimeFormatted || getCookie("runtimeFormatted"),
      email,
    };

    console.log("orderData:", orderData);
    saveOrderDataToCookie(orderData);

    const res = await fetch(`${API}/api/order/verify`, {
      method: "POST",
      body: JSON.stringify({ email, code, orderData }),
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    const data = await res.json();
    if (res.ok) {
      setMessage("✓ Verification successful! Redirecting...");
      setTimeout(() => {
        navigate("/order-confirmation");
      }, 1500);
    } else {
      setMessage(data.error);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0A1210] to-emerald-900/30 text-white relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-300/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Header Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="bg-gradient-to-br from-gray-900/80 to-emerald-900/30 backdrop-blur-lg rounded-2xl p-8 mb-6 border border-emerald-500/20 shadow-2xl"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-green-300 bg-clip-text text-transparent">
                Secure Verification
              </h2>
              <p className="text-gray-400 mt-2 text-sm">
                We've sent a verification code to your email
              </p>
              {email && (
                <p className="text-emerald-400 font-medium mt-3 text-lg">{email}</p>
              )}
            </div>

            <AnimatePresence>
              {message && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className={`p-3 rounded-lg mb-4 text-sm ${
                    message.includes("✓") || message.includes("successful")
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : "bg-red-500/20 text-red-400 border border-red-500/30"
                  }`}
                >
                  {message}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Code Input Section */}
            <AnimatePresence mode="wait">
              {!isCodeSent ? (
                <motion.div
                  key="send-code"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <motion.button
                    onClick={() => sendCode(email)}
                    disabled={isLoading || !email}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-4 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending Code...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Send Verification Code
                      </>
                    )}
                  </motion.button>
                </motion.div>
              ) : (
                <motion.div
                  key="verify-code"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Enter 6-digit code"
                      value={code}
                      onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      className="w-full p-4 bg-black/30 border border-emerald-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-300"
                      maxLength={6}
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-emerald-400">
                      {code.length}/6
                    </div>
                  </div>

                  <motion.button
                    onClick={verifyCode}
                    disabled={isLoading || code.length !== 6}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-4 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Verify & Complete Order
                      </>
                    )}
                  </motion.button>

                  <div className="text-center">
                    <button
                      onClick={() => sendCode(email)}
                      disabled={countdown > 0}
                      className="text-emerald-400 hover:text-emerald-300 text-sm disabled:text-gray-500 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      {countdown > 0 ? `Resend code in ${countdown}s` : "Resend code"}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Security Notice */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center text-gray-400 text-sm"
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Your information is securely encrypted
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default PaymentVerificationPage;