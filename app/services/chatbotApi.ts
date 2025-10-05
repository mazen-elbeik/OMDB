import axios from 'axios';
import type { MovieDetails } from '../store/movieSlice';

interface ChatbotRequest {
  prompt: string;
  favoriteMovies: MovieDetails[];
}

interface ChatbotResponse {
  response: string;
  [key: string]: any;
}

export const sendMessageToChatbot = async (
  prompt: string,
  favoriteMovies: MovieDetails[]
): Promise<ChatbotResponse> => {
  try {
    // Filter out Plot, Poster, and imdbRating from favorite movies
    const favoriteMoviesMainData = favoriteMovies.map(movie => {
      const { Plot, Poster, imdbRating, Ratings, ...mainData } = movie;
      return mainData;
    });

    const response = await axios.post<ChatbotResponse>(
      'http://localhost:8000/chat',
      {
        prompt,
        favoriteMovies: favoriteMoviesMainData,
      }
    );

    return response.data;
  } catch (error) {
    console.error('Chatbot API error:', error);
    throw error;
  }
};

