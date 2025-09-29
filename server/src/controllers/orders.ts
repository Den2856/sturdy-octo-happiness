import { Request, Response } from 'express';
import Order from '../models/Order';
import { User } from '../models/User';
import mongoose from 'mongoose';
import { verifyCode } from './emailController';

const getCookie = (req: Request, cookieName: string): any => {
  try {
    const cookies = req.headers.cookie;
    if (!cookies) return null;

    const cookiesArray = cookies.split(';');
    for (let cookie of cookiesArray) {
      cookie = cookie.trim();
      if (cookie.startsWith(`${cookieName}=`)) {
        const cookieValue = cookie.substring(cookieName.length + 1);
        return JSON.parse(decodeURIComponent(cookieValue));
      }
    }
    return null;
  } catch (error) {
    console.error(`Error parsing cookie ${cookieName}:`, error);
    return null;
  }
};

export const createOrder = async (req: Request, res: Response) => {
  try {
    const movieData = getCookie(req, "movieData");
    const orderSummary = getCookie(req, "orderSummary");
    const selectedSeats = getCookie(req, "selectedSeats");

    if (!movieData) {
      res.status(400).json({ error: "Missing movieData cookie." });
    }
    if (!orderSummary) {
      res.status(400).json({ error: "Missing OrderSummary cookie." });
    }
    if (!selectedSeats) {
      res.status(400).json({ error: "Missing selectedSeats cookie." });
    }

    const orderData = {
      movieId: movieData.movieId,
      title: movieData.title,
      coverUrl: movieData.coverUrl,
      price: movieData.price,
      theaterId: orderSummary.theaterId || movieData.theaterId,
      selectedDate: orderSummary.dateISO || movieData.selectedDate,
      
      seats: selectedSeats || orderSummary.seats
    };

    if (!orderData.movieId) {
      res.status(400).json({ error: "Missing movieId in cookie data." });
    }
    if (!orderData.theaterId) {
      res.status(400).json({ error: "Missing theaterId in cookie data." });
    }
    if (!orderData.title) {
      res.status(400).json({ error: "Missing title in cookie data." });
    }
    if (!orderData.selectedDate) {
      res.status(400).json({ error: "Missing selectedDate in cookie data." });
    }
    if (!orderData.seats || !Array.isArray(orderData.seats) || orderData.seats.length === 0) {
      res.status(400).json({ error: "Missing or invalid seats in cookie data." });
    }
    if (!orderData.price) {
      res.status(400).json({ error: "Missing price in cookie data." });
    }

    if (!mongoose.Types.ObjectId.isValid(orderData.movieId)) {
      console.log("Invalid movieId:", orderData.movieId);
      res.status(400).json({ error: "Invalid movieId format." });
    }
    if (!mongoose.Types.ObjectId.isValid(orderData.theaterId)) {
      console.log("Invalid theaterId:", orderData.theaterId);
      res.status(400).json({ error: "Invalid theaterId format." });
    }

    const { email, code } = req.body;
    if (!email) {
      res.status(400).json({ error: "Email is required in request body." });
    }

    if (!code) {
      res.status(400).json({ error: "Verification code is required." });
    }

    const verificationResult = await verifyCode(email, code);
    if (!verificationResult.isValid) {
      res.status(400).json({ error: verificationResult.error });
    }

    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ error: "User not found." });
    }

    const order = new Order({
      userId: user!._id,
      movieId: new mongoose.Types.ObjectId(orderData.movieId),
      theaterId: new mongoose.Types.ObjectId(orderData.theaterId),
      title: orderData.title,
      coverUrl: orderData.coverUrl || '',
      price: orderSummary.total,
      selectedDate: orderData.selectedDate,
      seats: orderData.seats,
      bookingInfo: `Booking for ${orderData.title} on ${orderData.selectedDate}`,
    });

    await order.save();


    res.setHeader('Set-Cookie', [
      'movieData=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/',
      'OrderSummary=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/',
      'selectedSeats=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/'
    ]);

    res.status(201).json({
      message: "Order created successfully!",
      order: {
        id: order._id,
        movie: order.title,
        date: order.selectedDate,
        seats: order.seats,
        price: order.price
      }
    });

  } catch (err) {
    console.error("Error creating order:", err);
    
    if (err instanceof mongoose.Error.ValidationError) {
      res.status(400).json({ error: "Validation error: " + err.message });
    }
    
    res.status(500).json({ error: "Failed to create order." });
  }
};

export const getOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find()
      .populate('userId')
      .populate('movieId')
      .populate('theaterId');
    res.json(orders);
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ error: "Failed to fetch orders." });
  }
};