const API_KEY = import.meta.env.VITE_OMDB_API_KEY || '19c89397';
const BASE_URL = 'https://www.omdbapi.com/';

if (!API_KEY) {
  console.error('OMDB API key is not defined. Please check your .env.local file.');
}

interface SearchResponse {
  Search?: Array<{
    imdbID: string;
    Title: string;
    Year: string;
    Type: string;
    Poster: string;
  }>;
  totalResults?: string;
  Response: string;
  Error?: string;
}

interface MovieDetailsResponse {
  Response: string;
  Error?: string;
  [key: string]: any;
}

export const searchMovies = async (query: string, page: number = 1): Promise<SearchResponse> => {
  const response = await fetch(`${BASE_URL}?apikey=${API_KEY}&s=${encodeURIComponent(query)}&page=${page}`);
  const data = await response.json();
  
  if (data.Response === 'False') {
    throw new Error(data.Error || 'Movie not found');
  }
  
  return data;
};

export const getMovieDetails = async (imdbID: string): Promise<any> => {
  const response = await fetch(`${BASE_URL}?apikey=${API_KEY}&i=${imdbID}&plot=full`);
  const data = await response.json();
  
  if (data.Response === 'False') {
    throw new Error(data.Error || 'Movie not found');
  }
  
  return data;
};

