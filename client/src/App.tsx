import { Routes, Route } from 'react-router-dom'
import Register from './pages/Register'
import Login from './pages/Login'
import Home from './pages/Home'
import MoviePage from './pages/MoviePage'
import SeatSelectionPage from './pages/SeatSelectionPage'
import CookieConsent from './components/ui/CookieConsent'
import PaymentPage from './pages/PaymentPage'
import PaymentVerificationPage from './pages/PaymentVerificationPage'
import PaymentSuccess from './pages/PaymentSuccessPage'
import Ticket from './pages/Ticket'
import UserOrders from './pages/UserOrders'
import AboutPage from './pages/AboutPage'
import ProtectedRoute from './components/ProtectedRoute'




export default function App() {
  return (
    <>
      <Routes>
        
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/movie/:id" element={<MoviePage />} />
        <Route path="/seat-selection" element={<SeatSelectionPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route
          path="/payment-verification"
          element={
            <ProtectedRoute>
              <PaymentVerificationPage />
            </ProtectedRoute>
            
          }
        />
        <Route
          path="/order-confirmation"
          element={
            <ProtectedRoute>
              <PaymentSuccess/>
            </ProtectedRoute>
          } 
        />
        <Route
          path="/ticket"
          element={
            <ProtectedRoute>
              <Ticket />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tickets"
          element={
            <ProtectedRoute>
              <UserOrders />
            </ProtectedRoute>
          }
        />
      </Routes>
      <CookieConsent nonEssentialKeys={["movieData", "selectedSeats"]} />
    </>
  )
}
