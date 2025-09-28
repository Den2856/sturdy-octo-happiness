import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import { FaPlay, FaCalendarAlt, FaTicketAlt, FaLock } from 'react-icons/fa';

const AboutPage: React.FC = () => {
  const features = [
    {
      icon: <FaPlay className="text-4xl" />,
      title: "Premium Movie Experience",
      description: "Access to the latest blockbusters and exclusive content in stunning quality"
    },
    {
      icon: <FaTicketAlt className="text-4xl" />,
      title: "Smart Seat Selection",
      description: "Choose your perfect spot with our interactive 3D seat map and real-time availability"
    },
    {
      icon: <FaCalendarAlt className="text-4xl" />,
      title: "Instant Booking",
      description: "Secure your tickets in seconds with our streamlined booking process"
    },
    {
      icon: <FaLock className="text-4xl" />,
      title: "Secure Payments",
      description: "Your transactions are protected with bank-level encryption and security"
    }
  ];

  const stats = [
    { number: "50K+", label: "Happy Customers" },
    { number: "100+", label: "Movies Monthly" },
    { number: "25+", label: "Cities Worldwide" },
    { number: "99.9%", label: "Uptime Reliability" }
  ];

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

        <div className="relative z-10">
          {/* Hero Section */}
          <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center"
              >
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6">
                  <span className="bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                    About Cinemas
                  </span>
                </h1>
                <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
                  We're redefining the movie-going experience with cutting-edge technology, 
                  unparalleled comfort, and a passion for storytelling that brings people together.
                </p>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-block"
                >
                  <Link
                    to="/"
                    className="bg-gradient-to-r from-emerald-600 to-green-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 inline-flex items-center gap-2"
                  >
                    <FaPlay className="w-5 h-5" />
                    Explore Movies
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </section>

          {/* Stats Section */}
          <section className="py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid grid-cols-2 lg:grid-cols-4 gap-8"
              >
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                    className="text-center"
                  >
                    <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent mb-2">
                      {stat.number}
                    </div>
                    <div className="text-gray-300 font-medium">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-16"
              >
                <h2 className="text-4xl font-bold mb-4">Why Choose Cinemas?</h2>
                <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                  We combine luxury, technology, and convenience to create the ultimate movie experience
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -10 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="bg-gradient-to-br from-gray-900/80 to-emerald-900/30 backdrop-blur-lg rounded-2xl p-6 border border-emerald-500/20 shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300"
                  >
                    <div className="text-4xl mb-4">{feature.icon}</div> {/* Просто отображаем текст как иконку */}
                    <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                    <p className="text-gray-300">{feature.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Mission Section */}
          <section className="py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="bg-gradient-to-br from-gray-900/80 to-blue-900/30 backdrop-blur-lg rounded-3xl p-8 md:p-12 border border-blue-500/20 shadow-2xl">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FaLock className="w-8 h-8 text-blue-400" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Mission</h2>
                  <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                    To transform the way people experience cinema by combining state-of-the-art technology with 
                    exceptional service. We believe every movie should be an unforgettable journey, and we're 
                    committed to creating magical moments that bring stories to life and connect people through 
                    the power of film.
                  </p>
                </motion.div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="bg-gradient-to-r from-emerald-900/50 to-blue-900/50 backdrop-blur-lg rounded-3xl p-8 md:p-12 border border-emerald-500/30 text-center"
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready for an Unforgettable Experience?</h2>
                <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                  Join thousands of movie lovers who trust Viva Cinema for their entertainment needs
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-emerald-600 to-green-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                  >
                    <Link to="/" className="flex items-center gap-2">
                      <FaPlay className="w-5 h-5" />
                      Browse Movies
                    </Link>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="border border-emerald-500/30 text-emerald-400 px-8 py-4 rounded-xl font-semibold hover:bg-emerald-500/10 transition-all duration-300"
                  >
                    Contact Us
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Footer */}
          <footer className="py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto text-center">
              <p className="text-gray-400">
                © {new Date().getFullYear()} Cinemas All rights reserved.
              </p>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
};

export default AboutPage;
