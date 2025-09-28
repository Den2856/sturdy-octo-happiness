import React, { useEffect, useMemo, useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import Header from "../components/Header";

type SeatType = "Regular" | "VIP" | "Premium";

type Seat = {
  _id: string;
  name: string;
  type: SeatType;
  theaterId?: string;
};

const SURCHARGE: Record<SeatType, number> = {
  Regular: 0,
  Premium: 10,
  VIP: 20,
};


const TYPE_COLORS: Record<SeatType, string> = {
  Regular: "bg-white text-black",
  Premium: "bg-amber-400 text-black",
  VIP: "bg-rose-500 text-white",
};

const SeatSelectionPage: React.FC = () => {
  const navigate = useNavigate();

  const [movieData, setMovieData] = useState<{
    movieId: string;
    title: string;
    theaterId: string;
    dateISO?: string;
    selectedDate?: string;
    time: string;
    price: number;
  } | null>(null);

  const [seatsFlat, setSeatsFlat] = useState<Seat[]>([]);
  const [selectedSeatNames, setSelectedSeatNames] = useState<string[]>([]);

  const [bookedSeatNames] = useState<string[]>([]);

  useEffect(() => {
    const saved = Cookies.get("movieData");
    if (!saved) {
      navigate("/");
      return;
    }
    const parsed = JSON.parse(saved);
    setMovieData(parsed);

    (async () => {
      const res = await axios.get<Seat[]>("/api/seats", {
        params: { theaterId: parsed.theaterId },
      });
      setSeatsFlat(res.data);

    })().catch((e) => console.error("Error fetching seats", e));
  }, [navigate]);

  const seatGrid: Seat[][] = useMemo(() => {
    const byRow: Record<string, Seat[]> = {};
    for (const s of seatsFlat) {
      const row = s.name.charAt(0);
      if (!byRow[row]) byRow[row] = [];
      byRow[row].push(s);
    }
    return Object.keys(byRow)
      .sort((a, b) => a.localeCompare(b))
      .map((row) =>
        byRow[row].sort((a, b) => {
          const na = parseInt(a.name.slice(1), 10);
          const nb = parseInt(b.name.slice(1), 10);
          return na - nb;
        })
      );
  }, [seatsFlat]);

  const toggleSeat = (name: string) => {
    setSelectedSeatNames((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  const totalPrice = useMemo(() => {
    if (!movieData) return 0;
    const base = Number(movieData.price) || 0;

    return selectedSeatNames.reduce((sum, seatName) => {
      const seatType = seatsFlat.find((s) => s.name === seatName)?.type ?? "Regular";
      const extra = SURCHARGE[seatType] ?? 0;
      return sum + (base + extra);
    }, 0);
  }, [movieData, selectedSeatNames, seatsFlat]);

  const proceed = () => {
    Cookies.set("selectedSeats", JSON.stringify(selectedSeatNames));
    Cookies.set(
      "orderSummary",
      JSON.stringify({
        movieId: movieData?.movieId,
        title: movieData?.title,
        theaterId: movieData?.theaterId,
        dateISO: movieData?.dateISO ?? movieData?.selectedDate,
        time: movieData?.time,
        seats: selectedSeatNames,
        total: totalPrice,
      })
    );
    navigate("/payment");
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-black via-[#0A1210] to-emerald-900/30 text-white p-6 sm:p-8">
        <h1 className="text-3xl sm:text-4xl font-semibold mb-6">Seat</h1>

        {/* Animated curved screen (Framer Motion) */}
        <div className="mb-7 flex justify-center">
          <svg viewBox="0 0 1200 220" className="w-full max-w-4xl" aria-label="Cinema screen">
            <defs>
              <radialGradient id="screenGlow" cx="50%" cy="10%" r="80%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.55)" />
                <stop offset="55%" stopColor="rgba(255,255,255,0.18)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0.00)" />
              </radialGradient>
              <clipPath id="screenBand">
                <path d="M120,170 Q600,55 1080,170 L1080,220 L120,220 Z" />
              </clipPath>
            </defs>

            <motion.path
              d="M60,170 Q600,20 1140,170"
              fill="none"
              stroke="white"
              strokeWidth="14"
              strokeLinecap="round"
              initial={{ filter: "drop-shadow(0 0 0 rgba(255,255,255,0))" }}
              animate={{
                filter: [
                  "drop-shadow(0 0 0 rgba(255,255,255,0))",
                  "drop-shadow(0 0 16px rgba(255,255,255,0.35))",
                  "drop-shadow(0 0 0 rgba(255,255,255,0))",
                ],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />

            <path d="M120,170 Q600,55 1080,170" fill="url(#screenGlow)" opacity="0.85" />

            <text
              x="600"
              y="170"
              textAnchor="middle"
              className="fill-white tracking-[0.5em]"
              fontSize="44"
              fontWeight="600"
            >
              SCREEN
            </text>
          </svg>
        </div>

        {/* seat grid */}
        <div className="mx-auto max-w-4xl">
          <div className="space-y-2">
            {seatGrid.map((row, ri) => (
              <div key={ri} className="flex justify-center gap-2">
                {row.map((seat) => {
                  const picked = selectedSeatNames.includes(seat.name);
                  const booked = bookedSeatNames.includes(seat.name);

                  let seatClass =
                    "h-8 w-10 sm:h-9 sm:w-11 rounded-lg text-xs sm:text-[13px] font-medium transition-all duration-200";

                  if (booked) {
                    seatClass += " bg-gray-600 text-white/70 cursor-not-allowed opacity-60";
                  } else if (picked) {
                    seatClass += " bg-emerald-500 text-emerald-950 ring-2 ring-emerald-400";
                  } else {
                    seatClass += " " + TYPE_COLORS[seat.type] + " hover:brightness-110";
                  }

                  return (
                    <button
                      key={seat._id}
                      onClick={() => !booked && toggleSeat(seat.name)}
                      disabled={booked}
                      className={seatClass}
                      title={`${seat.name} • ${seat.type}${booked ? " • Occupied" : ""}`}
                    >
                      {seat.name}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          {/* legend */}
          <div className="mx-auto max-w-4xl mt-10 flex justify-center flex-wrap items-center gap-x-6 gap-y-3 text-sm">
            {/* Status */}
            <div className="flex items-center gap-3">
              <span className="inline-block h-4 w-6 rounded-[6px] border border-white/20 bg-white" />
              <span className="text-white/90 mr-4">Free</span>

              <span className="inline-block h-4 w-6 rounded-[6px] border border-emerald-400 bg-emerald-500" />
              <span className="text-white/90 mr-4">Selected</span>

              <span className="inline-block h-4 w-6 rounded-[6px] border border-white/10 bg-gray-600 opacity-70" />
              <span className="text-white/90">Occupied</span>
            </div>

            <span className="hidden sm:inline-block h-5 w-px bg-white/15 mx-2" />

            {/* Types */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="inline-block h-4 w-6 rounded-[6px] border border-white/20 bg-white" />
                <span className="text-white/80">Regular</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block h-4 w-6 rounded-[6px] border border-amber-500/40 bg-amber-400" />
                <span className="text-white/80">Premium</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block h-4 w-6 rounded-[6px] border border-rose-500/50 bg-rose-500" />
                <span className="text-white/80">VIP</span>
              </div>
            </div>
          </div>
        </div>

        {/* bottom bar */}
        <div className="fixed left-0 right-0 bottom-0 bg-black/40 backdrop-blur supports-[backdrop-filter]:bg-black/30">
          <div className="mx-auto w-full max-w-6xl px-4 py-4 grid grid-cols-12 items-center gap-3">
            <div className="col-span-12 md:col-span-3">
              <div className="text-xs text-white/60">TOTAL</div>
              <div className="text-2xl font-semibold">$ {totalPrice.toFixed(2)}</div>
            </div>

            <div className="col-span-12 md:col-span-4">
              <div className="text-xs text-white/60">SEAT</div>
              <div className="text-lg">
                {selectedSeatNames.length ? selectedSeatNames.join(", ") : "—"}
              </div>
            </div>

            <div className="col-span-6 md:col-span-2">
              <button
                onClick={() => navigate(-1)}
                className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 hover:bg-white/15 transition"
              >
                Back
              </button>
            </div>

            <div className="col-span-6 md:col-span-3">
              <button
                disabled={!selectedSeatNames.length}
                onClick={proceed}
                className={[
                  "w-full rounded-xl px-4 py-3 font-medium transition",
                  selectedSeatNames.length
                    ? "bg-emerald-500 hover:bg-emerald-400 text-emerald-950"
                    : "bg-white/10 text-white/50 cursor-not-allowed",
                ].join(" ")}
              >
                Proceed Payment
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SeatSelectionPage;
