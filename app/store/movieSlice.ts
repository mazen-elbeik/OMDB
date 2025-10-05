import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { searchMovies, getMovieDetails } from '../services/omdbApi';

export interface Movie {
  imdbID: string;
  Title: string;
  Year: string;
  Type: string;
  Poster: string;
}

export interface MovieDetails extends Movie {
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  imdbRating: string;
  imdbVotes: string;
  BoxOffice?: string;
  Ratings: {
    Source: string;
    Value: string;
  }[];
}

interface RecommendedMovie extends Movie {
  recommendedBy?: string;
}

interface MovieState {
  searchResults: Movie[];
  searchQuery: string;
  selectedMovie: MovieDetails | null;
  favorites: MovieDetails[];
  filteredFavorites: MovieDetails[];
  recommendations: RecommendedMovie[];
  filteredRecommendations: RecommendedMovie[];
  loadingRecommendations: boolean;
  loading: boolean;
  loadingDetails: boolean;
  error: string | null;
  totalResults: number;
  currentPage: number;
}

// Helper function to safely access localStorage (SSR-safe)
const getStoredFavorites = (): MovieDetails[] => {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('movieFavorites');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }
  return [];
};

const saveToLocalStorage = (favorites: MovieDetails[]) => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('movieFavorites', JSON.stringify(favorites));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }
};

const initialState: MovieState = {
  searchResults: [],
  searchQuery: '',
  selectedMovie: null,
  favorites: getStoredFavorites(),
  filteredFavorites: getStoredFavorites(),
  recommendations: [],
  filteredRecommendations: [],
  loadingRecommendations: false,
  loading: false,
  loadingDetails: false,
  error: null,
  totalResults: 0,
  currentPage: 1,
};

// Async thunks
export const fetchMovies = createAsyncThunk(
  'movies/fetchMovies',
  async ({ query, page = 1 }: { query: string; page?: number }) => {
    const response = await searchMovies(query, page);
    return response;
  }
);

export const fetchMovieDetails = createAsyncThunk<MovieDetails, string>(
  'movies/fetchMovieDetails',
  async (imdbID: string) => {
    const response = await getMovieDetails(imdbID);
    return response as MovieDetails;
  }
);

export const fetchRecommendations = createAsyncThunk(
  'movies/fetchRecommendations',
  async (favorites: MovieDetails[]) => {
    const { generateRecommendations } = await import('../services/recommendationService');
    const recommendations = await generateRecommendations(favorites);
    return recommendations;
  }
);

const movieSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    clearSelectedMovie: (state) => {
      state.selectedMovie = null;
    },
    addToFavorites: (state, action: PayloadAction<MovieDetails>) => {
      const exists = state.favorites.find(m => m.imdbID === action.payload.imdbID);
      if (!exists) {
        state.favorites.unshift(action.payload); // Add to top
        state.filteredFavorites = state.favorites;
        saveToLocalStorage(state.favorites);
      }
    },
    removeFromFavorites: (state, action: PayloadAction<string>) => {
      state.favorites = state.favorites.filter(m => m.imdbID !== action.payload);
      state.filteredFavorites = state.favorites;
      saveToLocalStorage(state.favorites);
    },
    clearError: (state) => {
      state.error = null;
    },
    filterFavorites: (state, action: PayloadAction<string>) => {
      const query = action.payload.toLowerCase().trim();
      if (!query) {
        state.filteredFavorites = state.favorites;
      } else {
        state.filteredFavorites = state.favorites.filter(movie => 
          movie.Title.toLowerCase().includes(query) ||
          movie.Genre.toLowerCase().includes(query) ||
          movie.Actors.toLowerCase().includes(query) ||
          movie.Director.toLowerCase().includes(query)
        );
      }
    },
    filterRecommendations: (state, action: PayloadAction<string>) => {
      const query = action.payload.toLowerCase().trim();
      if (!query) {
        state.filteredRecommendations = state.recommendations;
      } else {
        state.filteredRecommendations = state.recommendations.filter(movie => 
          movie.Title.toLowerCase().includes(query) ||
          movie.Type.toLowerCase().includes(query) ||
          movie.Year.includes(query)
        );
      }
    },
    clearFilters: (state) => {
      state.filteredFavorites = state.favorites;
      state.filteredRecommendations = state.recommendations;
      state.searchQuery = '';
    },
  },
  extraReducers: (builder) => {
    builder
      // Search movies
      .addCase(fetchMovies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload.Search || [];
        state.totalResults = parseInt(action.payload.totalResults || '0');
        state.currentPage = action.meta.arg.page || 1;
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch movies';
      })
      // Fetch movie details
      .addCase(fetchMovieDetails.pending, (state) => {
        state.loadingDetails = true;
        state.error = null;
      })
      .addCase(fetchMovieDetails.fulfilled, (state, action) => {
        state.loadingDetails = false;
        state.selectedMovie = action.payload;
      })
      .addCase(fetchMovieDetails.rejected, (state, action) => {
        state.loadingDetails = false;
        state.error = action.error.message || 'Failed to fetch movie details';
      })
      // Fetch recommendations
      .addCase(fetchRecommendations.pending, (state) => {
        state.loadingRecommendations = true;
      })
      .addCase(fetchRecommendations.fulfilled, (state, action) => {
        state.loadingRecommendations = false;
        state.recommendations = action.payload;
        state.filteredRecommendations = action.payload;
      })
      .addCase(fetchRecommendations.rejected, (state, action) => {
        state.loadingRecommendations = false;
        console.error('Failed to fetch recommendations:', action.error);
      });
  },
});

export const {
  setSearchQuery,
  clearSelectedMovie,
  addToFavorites,
  removeFromFavorites,
  clearError,
  filterFavorites,
  filterRecommendations,
  clearFilters,
} = movieSlice.actions;

export default movieSlice.reducer;

