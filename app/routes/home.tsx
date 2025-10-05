import { Link } from "react-router";
import type { Route } from "./+types/home";
import MovieIcon from '@mui/icons-material/Movie';
import SearchIcon from '@mui/icons-material/Search';
import FavoriteIcon from '@mui/icons-material/Favorite';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Movie Hub - Home" },
    { name: "description", content: "Welcome to Movie Hub - Your personal movie search and recommendation system" },
  ];
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-950 to-black text-white pt-16">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-6">
            <MovieIcon sx={{ fontSize: 80 }} />
          </div>
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 bg-clip-text text-transparent">
            Movie Hub
          </h1>
          <p className="text-2xl text-amber-100 mb-8 max-w-2xl mx-auto">
            Your Ultimate Movie Search & Recommendation System
          </p>
          <Link
            to="/movies"
            className="inline-block bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white font-bold py-4 px-12 rounded-full text-xl transition-all duration-300 transform hover:scale-105 shadow-2xl shadow-red-900/50"
          >
            Start Exploring Movies
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mt-20">
          <div className="bg-gradient-to-br from-red-900/40 to-red-950/40 backdrop-blur-lg rounded-2xl p-8 text-center transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-red-900/50 border border-red-800/30">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-br from-amber-500 to-yellow-600 p-4 rounded-full shadow-lg shadow-amber-900/50">
                <SearchIcon sx={{ fontSize: 48 }} />
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-3 text-amber-400">Advanced Search</h3>
            <p className="text-amber-100/80">
              Search through thousands of movies, series, and episodes with our powerful search engine powered by OMDB API
            </p>
          </div>

          <div className="bg-gradient-to-br from-red-900/40 to-red-950/40 backdrop-blur-lg rounded-2xl p-8 text-center transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-red-900/50 border border-red-800/30">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-br from-red-600 to-rose-700 p-4 rounded-full shadow-lg shadow-red-900/50">
                <FavoriteIcon sx={{ fontSize: 48 }} />
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-3 text-amber-400">Personal Collection</h3>
            <p className="text-amber-100/80">
              Save your favorite movies and build your personal collection. Access them anytime, anywhere
            </p>
          </div>

          <div className="bg-gradient-to-br from-red-900/40 to-red-950/40 backdrop-blur-lg rounded-2xl p-8 text-center transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-red-900/50 border border-red-800/30">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-br from-amber-600 to-orange-600 p-4 rounded-full shadow-lg shadow-amber-900/50">
                <TrendingUpIcon sx={{ fontSize: 48 }} />
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-3 text-amber-400">Smart Recommendations</h3>
            <p className="text-amber-100/80">
              Get AI-powered recommendations based on your favorite movies. Discover similar content by genre, director, and actors
            </p>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold mb-6 text-amber-400">Built With Modern Technologies</h2>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <span className="bg-red-900/30 px-6 py-3 rounded-full border border-amber-600/50 text-amber-200">React Router v7</span>
            <span className="bg-red-900/30 px-6 py-3 rounded-full border border-amber-600/50 text-amber-200">Redux Toolkit</span>
            <span className="bg-red-900/30 px-6 py-3 rounded-full border border-amber-600/50 text-amber-200">Material-UI</span>
            <span className="bg-red-900/30 px-6 py-3 rounded-full border border-amber-600/50 text-amber-200">Tailwind CSS</span>
            <span className="bg-red-900/30 px-6 py-3 rounded-full border border-amber-600/50 text-amber-200">TypeScript</span>
            <span className="bg-red-900/30 px-6 py-3 rounded-full border border-amber-600/50 text-amber-200">OMDB API</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-8 border-t border-amber-900/30">
        <p className="text-amber-300/80">
          Movie data provided by{' '}
          <a 
            href="https://www.omdbapi.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-amber-400 hover:text-amber-300 underline"
          >
            OMDb API
          </a>
        </p>
      </div>
    </div>
  );
}
