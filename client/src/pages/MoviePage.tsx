import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Header from "../components/Header";

type Theater = {
  _id: string;
  name: string;
  status?: string;
};

type Movie = {
  _id: string;
  title: string;
  description?: string;
  runtime?: string;
  startDate: string;
  endDate: string;
  coverUrl?: string;
  genres?: string[];
  price: number;
};

const API = import.meta.env.VITE_API_URL ?? "";
const timeSlots: string[] = ["10:30", "12:10", "13:50", "15:40", "18:30", "21:00"];

function toISODate(d: Date) {
  return new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()).toISOString().slice(0, 10);
}

function parseDateOnly(s: string) {
  const [y, m, d] = s.split("-").map((x) => Number(x));
  return new Date(Date.UTC(y, m - 1, d));
}

function formatCardDate(d: Date) {
  return {
    day: String(d.getDate()).padStart(2, "0"),
    mon: d.toLocaleString(undefined, { month: "short" }),
    dow: d.toLocaleString(undefined, { weekday: "short" }),
  };
}

function dateRangeInclusive(startISO: string, endISO: string) {
  const out: Date[] = [];
  const start = parseDateOnly(startISO);
  const end = parseDateOnly(endISO);
  for (let d = new Date(start); d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
    out.push(new Date(d));
  }
  return out;
}


function isFutureSlot(selectedISO: string, hhmm: string) {
  const now = new Date();

  const [h, m] = hhmm.split(":").map(Number);
  const slot = new Date(selectedISO);
  slot.setHours(h, m, 0, 0);

  return slot.getTime() > now.getTime();
}

function formatRuntime(runtime?: string) {
  if (!runtime) return "-";
  if (runtime.includes("min")) {
    const n = parseInt(runtime, 10);
    if (!isNaN(n)) {
      const h = Math.floor(n / 60);
      const m = n % 60;
      return `${h}h ${m ? `${m}m` : ""}`.trim();
    }
  }
  return runtime;
}

function firstGenre(genres?: string[]) {
  return genres?.[0] ?? "-";
}

const Pin: React.FC<{ active?: boolean }> = ({ active }) => (
  <svg
    className={`h-4 w-4 mr-2 ${active ? "text-emerald-900" : "text-emerald-400"}`}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path d="M12 22s7-4.35 7-11a7 7 0 1 0-14 0c0 6.65 7 11 7 11z" />
    <circle cx="12" cy="11" r="2.5" />
  </svg>
);

const MoviePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [selectedTheater, setSelectedTheater] = useState<string>("");
  const [selectedDateISO, setSelectedDateISO] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");

  useEffect(() => {
    if (!id) return;
    (async () => {
      const [m, t] = await Promise.all([
        axios.get<Movie>(`${API}/api/movies/${id}`),
        axios.get<Theater[]>(`${API}/api/theaters`),
      ]);
      setMovie(m.data);
      setTheaters((t.data || []).filter((th) => th.status !== "disabled"));
    })().catch((e) => console.error(e));
  }, [id]);

  const days = useMemo(() => {
    if (!movie?.startDate || !movie?.endDate) return [];
    return dateRangeInclusive(movie.startDate, movie.endDate);
  }, [movie]);

  const filteredTimes = useMemo(() => {
    if (!selectedDateISO) return [];
    return timeSlots.filter((slot) => isFutureSlot(selectedDateISO, slot));
  }, [selectedDateISO]);

  const canProceed = selectedTheater && selectedDateISO && selectedTime;

  const summary = useMemo(() => {
    if (!canProceed) return null;
    const d = new Date(selectedDateISO);
    const dateStr = d.toLocaleDateString(undefined, {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
    const theaterName = theaters.find((x) => x._id === selectedTheater)?.name ?? "";
    return { theaterName, dateStr, time: selectedTime };
  }, [canProceed, selectedDateISO, selectedTime, theaters, selectedTheater]);

  const handleProceed = () => {
    if (!canProceed) return;

    const runtimeRaw = movie?.runtime ?? "";
    const runtimeFormatted = formatRuntime(movie?.runtime);

    Cookies.set("movieData", JSON.stringify({
      movieId: movie?._id,
      title: movie?.title,
      coverUrl: movie?.coverUrl,
      price: movie?.price,
      theaterId: selectedTheater,
      selectedDate: selectedDateISO,
      selectedTime,
      runtime: runtimeRaw,
      runtimeFormatted,
    }));

    navigate("/seat-selection");
  };

  if (!movie) {
    return (
      <div className="min-h-[80vh] grid place-items-center bg-gradient-to-br from-black via-[#08130F] to-emerald-900/30">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/40 border-t-transparent" />
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-[100vh] bg-gradient-to-br from-black via-[#0A1210] to-emerald-900/30 text-white">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-10 pt-8 pb-20">
          <div className="grid grid-cols-12 gap-8">
            <section className="col-span-12 lg:col-span-7 xl:col-span-7">
              <h2 className="text-2xl sm:text-3xl font-semibold mb-4">Theater</h2>
              <div className="flex flex-wrap gap-3">
                {theaters.map((t) => {
                  const active = selectedTheater === t._id;
                  return (
                    <button
                      key={t._id}
                      onClick={() => setSelectedTheater(t._id)}
                      className={[
                        "group inline-flex items-center rounded-full border px-4 py-2 text-sm sm:text-base",
                        "transition-colors duration-200",
                        active
                          ? "bg-emerald-400 text-emerald-950 border-emerald-400 shadow-[0_0_0_3px_rgba(16,185,129,0.25)]"
                          : "bg-black/40 border-white/30 hover:bg-white/10",
                      ].join(" ")}
                    >
                      <Pin active={active} />
                      {t.name}
                    </button>
                  );
                })}
              </div>

              <h2 className="text-2xl sm:text-3xl font-semibold mt-10 mb-4">Date</h2>
              <div className="flex flex-wrap gap-4">
                {days.map((d) => {
                  const iso = toISODate(d);
                  const isActive = selectedDateISO === iso;
                  const f = formatCardDate(d);
                  return (
                    <button
                      key={iso}
                      onClick={() => {
                        setSelectedDateISO(iso);
                        setSelectedTime("");
                      }}
                      className={[
                        "w-[84px] h-[72px] rounded-xl border",
                        "flex flex-col items-center justify-center",
                        "transition-all duration-200",
                        isActive
                          ? "bg-emerald-400 text-emerald-950 border-emerald-400 shadow-[0_8px_24px_rgba(16,185,129,0.35)]"
                          : "bg-black/40 border-white/30 hover:bg-white/10",
                      ].join(" ")}
                    >
                      <span className="text-sm">{`${f.day} ${f.mon}`}</span>
                      <span className="text-lg font-semibold">{f.dow}</span>
                    </button>
                  );
                })}
              </div>

              <h2 className="text-2xl sm:text-3xl font-semibold mt-12 mb-4">Time</h2>
              <div className="flex flex-wrap gap-3">
                {(selectedDateISO ? filteredTimes : []).map((t) => {
                  const active = selectedTime === t;
                  return (
                    <button
                      key={t}
                      onClick={() => setSelectedTime(t)}
                      className={[
                        "min-w-[72px] rounded-md border px-3 py-2 text-sm",
                        "transition-all duration-200",
                        active
                          ? "bg-emerald-400 text-emerald-950 border-emerald-400 shadow-[0_8px_24px_rgba(16,185,129,0.35)]"
                          : "bg-black/40 border-white/30 hover:bg-white/10",
                      ].join(" ")}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            </section>

            <aside className="col-span-12 lg:col-span-5 xl:col-span-5">
              {movie.coverUrl && (
                <div className="w-full max-w-[360px] ml-auto rounded-3xl overflow-hidden shadow-2xl border border-white/10">
                  <img src={movie.coverUrl} alt={movie.title} className="w-full h-[420px] object-cover" />
                </div>
              )}

              <div className="mt-4 max-w-[360px] ml-auto">
                <h3 className="uppercase tracking-wide font-extrabold">{movie.title}</h3>
                <p className="mt-2 text-white/70 text-sm leading-relaxed line-clamp-3">
                  {movie.description || "Movie description here..."}
                </p>

                <div className="mt-4 grid grid-cols-2 gap-y-2 text-sm">
                  <span className="text-white/60">Duration</span>
                  <span className="text-white/90">{formatRuntime(movie.runtime)}</span>
                  <span className="text-white/60">Type</span>
                  <span className="text-white/90">{firstGenre(movie.genres)}</span>
                </div>
              </div>

              <div className="mt-10 ml-auto max-w-[420px]">
                <div className="rounded-2xl border border-white/20 bg-black/30 p-6 sm:p-7 shadow-[0_0_0_1px_rgba(255,255,255,0.04)]">
                  <div className="text-xl sm:text-2xl font-semibold">
                    {summary?.theaterName || "Select theater"}
                  </div>

                  <div className="mt-4 space-y-1 text-white/90">
                    <div className="text-base">{summary ? summary.dateStr : "Select date"}</div>
                    <div className="text-base">{summary ? summary.time : "Select time"}</div>
                  </div>

                  <p className="mt-4 text-xs text-white/50">*Seat selection can be done after this</p>

                  <button
                    disabled={!canProceed}
                    className={[
                      "mt-6 w-full rounded-xl px-4 py-3 font-medium",
                      "transition-transform duration-150",
                      canProceed
                        ? "bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] text-emerald-950"
                        : "bg-white/10 text-white/50 cursor-not-allowed",
                    ].join(" ")}
                    onClick={handleProceed}
                  >
                    Proceed
                  </button>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
};

export default MoviePage;
