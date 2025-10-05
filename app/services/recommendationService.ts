import type { MovieDetails } from '../store/movieSlice';
import { searchMovies } from './omdbApi';

interface RecommendationAnalysis {
  topGenres: string[];
  preferredType: string;
  commonDecade: string;
}

export const analyzePreferences = (favorites: MovieDetails[]): RecommendationAnalysis => {
  if (favorites.length === 0) {
    return {
      topGenres: [],
      preferredType: 'movie',
      commonDecade: '2020',
    };
  }

  // Analyze genres
  const genreCount: Record<string, number> = {};
  favorites.forEach(movie => {
    const genres = movie.Genre.split(',').map(g => g.trim());
    genres.forEach(genre => {
      genreCount[genre] = (genreCount[genre] || 0) + 1;
    });
  });

  const topGenres = Object.entries(genreCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([genre]) => genre);

  // Analyze type preference
  const typeCount: Record<string, number> = {};
  favorites.forEach(movie => {
    typeCount[movie.Type] = (typeCount[movie.Type] || 0) + 1;
  });

  const preferredType = Object.entries(typeCount)
    .sort(([, a], [, b]) => b - a)[0]?.[0] || 'movie';

  // Analyze decade preference
  const decades: string[] = favorites
    .map(movie => {
      const year = parseInt(movie.Year);
      if (!isNaN(year)) {
        return Math.floor(year / 10) * 10;
      }
      return null;
    })
    .filter(d => d !== null) as unknown as string[];

  const decadeCount: Record<string, number> = {};
  decades.forEach(decade => {
    decadeCount[decade] = (decadeCount[decade] || 0) + 1;
  });

  const commonDecade = Object.entries(decadeCount)
    .sort(([, a], [, b]) => b - a)[0]?.[0] || '2020';

  return {
    topGenres,
    preferredType,
    commonDecade,
  };
};

export const generateRecommendations = async (favorites: MovieDetails[]): Promise<any[]> => {
  if (favorites.length === 0) {
    // Return popular movies if no favorites
    const popularSearches = ['Marvel', 'Star Wars', 'Batman', 'Lord of the Rings'];
    const randomSearch = popularSearches[Math.floor(Math.random() * popularSearches.length)];
    try {
      const results = await searchMovies(randomSearch, 1);
      return results.Search || [];
    } catch {
      return [];
    }
  }

  const analysis = analyzePreferences(favorites);
  const recommendations: any[] = [];
  const seenIds = new Set(favorites.map(f => f.imdbID));

  // Search based on top genres
  for (const genre of analysis.topGenres.slice(0, 2)) {
    try {
      const results = await searchMovies(genre, 1);
      if (results.Search) {
        const filtered = results.Search
          .filter(movie => !seenIds.has(movie.imdbID))
          .slice(0, 3);
        
        filtered.forEach(movie => {
          if (!seenIds.has(movie.imdbID)) {
            recommendations.push({ ...movie, recommendedBy: `Genre: ${genre}` });
            seenIds.add(movie.imdbID);
          }
        });
      }
    } catch (error) {
      console.error(`Failed to fetch recommendations for ${genre}:`, error);
    }
  }

  // Search based on director from highest rated favorite
  const topRatedFavorite = favorites
    .filter(f => f.imdbRating && f.imdbRating !== 'N/A')
    .sort((a, b) => parseFloat(b.imdbRating) - parseFloat(a.imdbRating))[0];

  if (topRatedFavorite && topRatedFavorite.Director !== 'N/A') {
    const director = topRatedFavorite.Director.split(',')[0].trim();
    try {
      const results = await searchMovies(director, 1);
      if (results.Search) {
        const filtered = results.Search
          .filter(movie => !seenIds.has(movie.imdbID))
          .slice(0, 2);
        
        filtered.forEach(movie => {
          if (!seenIds.has(movie.imdbID)) {
            recommendations.push({ ...movie, recommendedBy: `Director: ${director}` });
            seenIds.add(movie.imdbID);
          }
        });
      }
    } catch (error) {
      console.error(`Failed to fetch recommendations for director ${director}:`, error);
    }
  }

  // Search based on main actor from favorites
  if (favorites.length > 0 && favorites[0].Actors !== 'N/A') {
    const actor = favorites[0].Actors.split(',')[0].trim();
    try {
      const results = await searchMovies(actor, 1);
      if (results.Search) {
        const filtered = results.Search
          .filter(movie => !seenIds.has(movie.imdbID))
          .slice(0, 2);
        
        filtered.forEach(movie => {
          if (!seenIds.has(movie.imdbID)) {
            recommendations.push({ ...movie, recommendedBy: `Actor: ${actor}` });
            seenIds.add(movie.imdbID);
          }
        });
      }
    } catch (error) {
      console.error(`Failed to fetch recommendations for actor ${actor}:`, error);
    }
  }

  // Limit to 10 recommendations
  return recommendations.slice(0, 10);
};

