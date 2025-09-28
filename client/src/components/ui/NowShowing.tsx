import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

interface Movie {
  title: string;
  coverUrl: string;
  _id: string;
}

const NowShowing: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/movies`, {
          params: { status: "published" },
        });
        setMovies(response.data.items);
      } catch (error) {
        console.error("Error fetching movies", error);
      }
    };

    fetchMovies();
  }, []);

  return (
    <div className="container mx-auto py-10 px-4">
      <h2 className="text-3xl font-bold text-center text-white mb-8">Now Showing</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
        {movies.map((movie) => (
          <div key={movie._id} className="movie-card flex flex-col items-center">
            <Link to={`/movie/${movie._id}`} className="w-full">
              <img
                src={movie.coverUrl}
                alt={movie.title}
                className="w-full h-48 sm:h-64 object-cover rounded-lg"
              />
              <h3 className="mt-2 text-sm sm:text-base font-semibold text-center text-white">{movie.title}</h3>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NowShowing;
