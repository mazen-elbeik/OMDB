import { useState, useEffect, useMemo } from 'react';
import { Container, Typography, Box, Pagination, CircularProgress, Alert, Tabs, Tab, Chip, IconButton, Button, Select, MenuItem, FormControl, InputLabel, OutlinedInput, Checkbox, ListItemText, Drawer, Fab } from '@mui/material';
import MovieIcon from '@mui/icons-material/Movie';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import InfoIcon from '@mui/icons-material/Info';
import StarIcon from '@mui/icons-material/Star';
import RecommendIcon from '@mui/icons-material/Recommend';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import type { Route } from "./+types/movies";
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchMovies, fetchMovieDetails, removeFromFavorites, addToFavorites, fetchRecommendations, clearFilters, clearSelectedMovie } from '../store/movieSlice';
import MovieSearch from '../components/MovieSearch';
import MovieDetails from '../components/MovieDetails';
import RecommendationCard from '../components/RecommendationCard';


export function meta({}: Route.MetaArgs) {
  return [
    { title: "Movie Search & Recommendations" },
    { name: "description", content: "Search and discover your favorite movies" },
  ];
}

export default function Movies() {
  const dispatch = useAppDispatch();
  const { 
    searchResults, 
    selectedMovie, 
    favorites, 
    filteredFavorites,
    recommendations, 
    filteredRecommendations,
    loadingRecommendations, 
    loading, 
    error, 
    totalResults, 
    currentPage, 
    searchQuery 
  } = useAppSelector((state) => state.movies);
  const [tabValue, setTabValue] = useState(0);
  const [typeFilter, setTypeFilter] = useState<string[]>([]);
  const [sourceFilter, setSourceFilter] = useState<string[]>([]);
  const [genreFilter, setGenreFilter] = useState<string[]>([]);
  const [directorFilter, setDirectorFilter] = useState<string[]>([]);
  const [actorFilter, setActorFilter] = useState<string[]>([]);
  const [filterSidebarOpen, setFilterSidebarOpen] = useState(false);
  
  const totalPages = Math.ceil(totalResults / 10);

  // Extract unique genres, directors, and actors from recommendations
  const availableFilters = useMemo(() => {
    const genres = new Set<string>();
    const directors = new Set<string>();
    const actors = new Set<string>();

    filteredRecommendations.forEach(movie => {
      if (movie.recommendedBy) {
        const [source, value] = movie.recommendedBy.split(': ');
        if (source === 'Genre') {
          genres.add(value.trim());
        } else if (source === 'Director') {
          directors.add(value.trim());
        } else if (source === 'Actor') {
          actors.add(value.trim());
        }
      }
    });

    return {
      genres: Array.from(genres).sort(),
      directors: Array.from(directors).sort(),
      actors: Array.from(actors).sort(),
    };
  }, [filteredRecommendations]);

  // Apply additional filters to recommendations
  const fullyFilteredRecommendations = useMemo(() => {
    let filtered = [...filteredRecommendations];

    // Apply type filter
    if (typeFilter.length > 0) {
      filtered = filtered.filter(movie => typeFilter.includes(movie.Type));
    }

    // Apply source filter (Genre, Director, Actor)
    if (sourceFilter.length > 0) {
      filtered = filtered.filter(movie => {
        if (!movie.recommendedBy) return false;
        const source = movie.recommendedBy.split(':')[0]; // Extract "Genre", "Director", or "Actor"
        return sourceFilter.includes(source);
      });
    }

    // Apply genre filter
    if (genreFilter.length > 0) {
      filtered = filtered.filter(movie => {
        if (!movie.recommendedBy || !movie.recommendedBy.startsWith('Genre: ')) return false;
        const genre = movie.recommendedBy.split(': ')[1];
        return genreFilter.includes(genre);
      });
    }

    // Apply director filter
    if (directorFilter.length > 0) {
      filtered = filtered.filter(movie => {
        if (!movie.recommendedBy || !movie.recommendedBy.startsWith('Director: ')) return false;
        const director = movie.recommendedBy.split(': ')[1];
        return directorFilter.includes(director);
      });
    }

    // Apply actor filter
    if (actorFilter.length > 0) {
      filtered = filtered.filter(movie => {
        if (!movie.recommendedBy || !movie.recommendedBy.startsWith('Actor: ')) return false;
        const actor = movie.recommendedBy.split(': ')[1];
        return actorFilter.includes(actor);
      });
    }

    return filtered;
  }, [filteredRecommendations, typeFilter, sourceFilter, genreFilter, directorFilter, actorFilter]);

  // Fetch recommendations when favorites change
  useEffect(() => {
    if (favorites.length > 0) {
      dispatch(fetchRecommendations(favorites));
    }
  }, [favorites.length, dispatch]);

  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
    if (searchQuery) {
      dispatch(fetchMovies({ query: searchQuery, page }));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleMovieClick = (imdbID: string) => {
    dispatch(fetchMovieDetails(imdbID));
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    // Clear filters when switching tabs
    dispatch(clearFilters());
    setTypeFilter([]);
    setSourceFilter([]);
    setGenreFilter([]);
    setDirectorFilter([]);
    setActorFilter([]);
  };

  const handleTypeFilterChange = (event: any) => {
    const value = event.target.value;
    setTypeFilter(typeof value === 'string' ? value.split(',') : value);
  };

  const handleSourceFilterChange = (event: any) => {
    const value = event.target.value;
    setSourceFilter(typeof value === 'string' ? value.split(',') : value);
  };

  const handleGenreFilterChange = (event: any) => {
    const value = event.target.value;
    setGenreFilter(typeof value === 'string' ? value.split(',') : value);
  };

  const handleDirectorFilterChange = (event: any) => {
    const value = event.target.value;
    setDirectorFilter(typeof value === 'string' ? value.split(',') : value);
  };

  const handleActorFilterChange = (event: any) => {
    const value = event.target.value;
    setActorFilter(typeof value === 'string' ? value.split(',') : value);
  };

  const displayedMovies = tabValue === 0 ? searchResults : tabValue === 1 ? filteredFavorites : [];

  return (
    <Box className="min-h-screen bg-gradient-to-br from-gray-50 via-amber-50 to-red-50">
      {/* Hero Section */}
      <Box className="bg-red-900 text-white py-16 shadow-xl">
        <Container maxWidth="lg">
          <Box className="text-center mb-8">
            <Box className="flex items-center justify-center gap-3 mb-4">
              <MovieIcon sx={{ fontSize: 56 }} />
              <Typography variant="h2" component="h1" className="font-bold">
                Movie Hub
              </Typography>
            </Box>
            <Typography variant="h5" className="mb-8 opacity-90 text-amber-100">
              Discover, Search & Save Your Favorite Movies
            </Typography>
            <MovieSearch currentTab={tabValue} />
          </Box>
        </Container>
      </Box>

      {/* Content Section */}
      <Container maxWidth="lg" className="py-8">
        {/* Tabs */}
        <Box className="mb-6">
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600,
              }
            }}
          >
            <Tab 
              icon={<MovieIcon />} 
              iconPosition="start" 
              label={`Search Results ${searchResults.length > 0 ? `(${totalResults})` : ''}`} 
            />
            <Tab 
              icon={<FavoriteIcon />} 
              iconPosition="start" 
              label={`My Favorites ${searchQuery && tabValue === 1 ? `(${filteredFavorites.length}/${favorites.length})` : `(${favorites.length})`}`}
            />
            <Tab 
              icon={<RecommendIcon />} 
              iconPosition="start" 
              label={`Recommended ${searchQuery && tabValue === 2 ? `(${filteredRecommendations.length}/${recommendations.length})` : `(${recommendations.length})`}`}
            />
          </Tabs>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" className="mb-6" sx={{ borderRadius: '12px' }}>
            {error}
          </Alert>
        )}

        {/* Loading State */}
        {loading && (
          <Box className="flex justify-center items-center py-20">
            <CircularProgress size={60} />
          </Box>
        )}

        {/* Empty States */}
        {!loading && !loadingRecommendations && displayedMovies.length === 0 && tabValue !== 2 && (
          <Box className="text-center py-20">
            <Typography variant="h5" color="text.secondary" className="mb-4">
              {tabValue === 0 
                ? (searchQuery ? `No results found for "${searchQuery}"` : "Search for movies to get started!")
                : (searchQuery && favorites.length > 0 
                    ? `No favorites match "${searchQuery}"` 
                    : "No favorites yet. Start adding movies to your collection!")}
            </Typography>
            {searchQuery && tabValue === 1 && favorites.length > 0 && (
              <Typography variant="body1" color="text.secondary" className="mb-4">
                Try a different search term or clear the filter
              </Typography>
            )}
            <MovieIcon sx={{ fontSize: 120, color: '#bdbdbd' }} />
          </Box>
        )}

        {/* Movie List */}
        {!loading && displayedMovies.length > 0 && (
          <>
            <Box className="space-y-4">
              {displayedMovies.map((movie, index) => {
                const posterUrl = movie.Poster !== 'N/A' ? movie.Poster : '/movie-placeholder.svg';
                const isFav = favorites.some((f) => f.imdbID === movie.imdbID);
                
                return (
                  <Box
                    key={movie.imdbID}
                    className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer"
                    sx={{
                      animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
                      '@keyframes fadeInUp': {
                        from: { opacity: 0, transform: 'translateY(20px)' },
                        to: { opacity: 1, transform: 'translateY(0)' }
                      }
                    }}
                  >
                    <Box className="flex flex-col sm:flex-row">
                      {/* Poster */}
                      <Box 
                        className="relative w-full sm:w-48 h-64 sm:h-auto flex-shrink-0 overflow-hidden"
                        onClick={() => handleMovieClick(movie.imdbID)}
                      >
                        <img
                          src={posterUrl}
                          alt={movie.Title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            if (target.src !== '/movie-placeholder.svg') {
                              target.src = '/movie-placeholder.svg';
                            }
                          }}
                        />
                        <Box className="absolute top-3 right-3">
                          <Chip 
                            label={movie.Year} 
                            size="small"
                            sx={{ 
                              backgroundColor: 'rgba(255,255,255,0.95)',
                              fontWeight: 700,
                              backdropFilter: 'blur(8px)'
                            }}
                          />
                        </Box>
                      </Box>

                      {/* Content */}
                      <Box className="flex-1 p-6 flex flex-col justify-between">
                        <Box>
                          <Box className="flex items-start justify-between mb-3">
                            <Box className="flex-1" onClick={() => handleMovieClick(movie.imdbID)}>
                              <Typography 
                                variant="h5" 
                                className="font-bold mb-2 group-hover:text-red-700 transition-colors"
                              >
                                {movie.Title}
                              </Typography>
                              <Box className="flex items-center gap-2 mb-3 flex-wrap">
                                <Chip 
                                  label={movie.Year} 
                                  size="small"
                                  sx={{ 
                                    backgroundColor: '#fef3c7',
                                    color: '#78350f',
                                    fontWeight: 600
                                  }}
                                />
                                <Chip 
                                  label={movie.Type} 
                                  size="small"
                                  sx={{ 
                                    backgroundColor: '#fed7aa',
                                    color: '#9a3412',
                                    textTransform: 'capitalize',
                                    fontWeight: 600
                                  }}
                                />
                                {isFav && 'Rated' in movie && (movie as any).Rated !== 'N/A' && (
                                  <Chip 
                                    label={(movie as any).Rated} 
                                    size="small"
                                    sx={{ 
                                      backgroundColor: '#fecaca',
                                      color: '#7f1d1d',
                                      fontWeight: 600
                                    }}
                                  />
                                )}
                                {isFav && 'Runtime' in movie && (movie as any).Runtime !== 'N/A' && (
                                  <Chip 
                                    label={(movie as any).Runtime} 
                                    size="small"
                                    variant="outlined"
                                    sx={{ 
                                      borderColor: '#f59e0b',
                                      color: '#92400e',
                                      fontWeight: 600
                                    }}
                                  />
                                )}
                              </Box>
                            </Box>
                            
                            <IconButton
                              onClick={async (e) => {
                                e.stopPropagation();
                                if (isFav) {
                                  // Remove from favorites
                                  dispatch(removeFromFavorites(movie.imdbID));
                                } else {
                                  // Fetch full details and add to favorites
                                  const details = await dispatch(fetchMovieDetails(movie.imdbID)).unwrap();
                                  dispatch(addToFavorites(details));
                                  // Clear selected movie to prevent modal from opening
                                  dispatch(clearSelectedMovie());
                                }
                              }}
                              sx={{ 
                                color: isFav ? '#f44336' : '#bdbdbd',
                                '&:hover': { 
                                  color: '#f44336',
                                  transform: 'scale(1.1)'
                                },
                                transition: 'all 0.2s'
                              }}
                            >
                              {isFav ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                            </IconButton>
                          </Box>

                          {/* Additional info for favorites */}
                          {isFav && 'Genre' in movie && (movie as any).Genre !== 'N/A' && (
                            <Box className="mb-3">
                              <Typography variant="caption" className="font-semibold text-gray-600">
                                Genre:
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {(movie as any).Genre}
                              </Typography>
                            </Box>
                          )}
                          
                          {isFav && 'Director' in movie && (movie as any).Director !== 'N/A' && (
                            <Box className="mb-3">
                              <Typography variant="caption" className="font-semibold text-gray-600">
                                Director:
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {(movie as any).Director}
                              </Typography>
                            </Box>
                          )}

                          {isFav && 'Actors' in movie && (movie as any).Actors !== 'N/A' && (
                            <Box className="mb-3">
                              <Typography variant="caption" className="font-semibold text-gray-600">
                                Cast:
                              </Typography>
                              <Typography variant="body2" color="text.secondary" className="line-clamp-1">
                                {(movie as any).Actors}
                              </Typography>
                            </Box>
                          )}

                          {isFav && 'Plot' in movie && (movie as any).Plot !== 'N/A' && (
                            <Box className="mb-3">
                              <Typography variant="caption" className="font-semibold text-gray-600">
                                Plot:
                              </Typography>
                              <Typography 
                                variant="body2" 
                                color="text.secondary" 
                                className="line-clamp-2"
                              >
                                {(movie as any).Plot}
                              </Typography>
                            </Box>
                          )}
                        </Box>

                        <Box className="flex items-center justify-between mt-4">
                          <Button
                            variant="contained"
                            startIcon={<InfoIcon />}
                            onClick={() => handleMovieClick(movie.imdbID)}
                            sx={{
                              borderRadius: '12px',
                              textTransform: 'none',
                              fontWeight: 600,
                              px: 3,
                              background: 'linear-gradient(45deg, #b91c1c 30%, #dc2626 90%)',
                              boxShadow: '0 3px 5px 2px rgba(220, 38, 38, .3)',
                              '&:hover': {
                                background: 'linear-gradient(45deg, #991b1b 30%, #b91c1c 90%)',
                              }
                            }}
                          >
                            View Details
                          </Button>

                          {isFav && 'imdbRating' in movie && (
                            <Box className="flex items-center gap-1 px-3 py-1 bg-amber-50 rounded-full">
                              <StarIcon sx={{ color: '#ffc107', fontSize: 20 }} />
                              <Typography variant="body1" className="font-bold">
                                {(movie as any).imdbRating}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                / 10
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                );
              })}
            </Box>

            {/* Pagination - only for search results */}
            {tabValue === 0 && totalPages > 1 && (
              <Box className="flex justify-center mt-8">
                <Pagination 
                  count={totalPages} 
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                  size="large"
                  sx={{
                    '& .MuiPaginationItem-root': {
                      fontSize: '1rem',
                      fontWeight: 600,
                    }
                  }}
                />
              </Box>
            )}
          </>
        )}

        {/* Recommendations Tab */}
        {tabValue === 2 && (
          <>
            {loadingRecommendations && (
              <Box className="flex justify-center items-center py-20">
                <CircularProgress size={60} />
              </Box>
            )}

            {!loadingRecommendations && favorites.length === 0 && (
              <Box className="text-center py-20">
                <Typography variant="h5" color="text.secondary" className="mb-4">
                  Add some favorites first to get personalized recommendations!
                </Typography>
                <RecommendIcon sx={{ fontSize: 120, color: '#bdbdbd' }} />
              </Box>
            )}

            {!loadingRecommendations && favorites.length > 0 && recommendations.length === 0 && (
              <Box className="text-center py-20">
                <Typography variant="h5" color="text.secondary" className="mb-4">
                  Generating recommendations based on your favorites...
                </Typography>
                <CircularProgress />
              </Box>
            )}

            {!loadingRecommendations && recommendations.length > 0 && (
              <Box>
                {/* Banner */}
                <Box className="mb-6 p-4 bg-gradient-to-r from-amber-100 to-yellow-100 rounded-xl border border-amber-300">
                  <Typography variant="h6" className="font-bold text-red-900 mb-2">
                    🎬 Personalized Recommendations
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#78350f' }}>
                    {searchQuery || typeFilter.length > 0 || sourceFilter.length > 0 || genreFilter.length > 0 || directorFilter.length > 0 || actorFilter.length > 0
                      ? `Showing ${fullyFilteredRecommendations.length} of ${recommendations.length} recommendations`
                      : `Based on your ${favorites.length} favorite ${favorites.length === 1 ? 'movie' : 'movies'}, we've found ${recommendations.length} recommendations you might enjoy!`
                    }
                  </Typography>
                </Box>

                {/* Filter Toggle Button */}
                <Box className="mb-6 flex items-center justify-between">
                  <Typography variant="body1" color="text.secondary">
                    Use filters to narrow down your recommendations
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<FilterListIcon />}
                    onClick={() => setFilterSidebarOpen(true)}
                    sx={{
                      borderRadius: '12px',
                      textTransform: 'none',
                      fontWeight: 600,
                      px: 3,
                      background: 'linear-gradient(45deg, #dc2626 30%, #b91c1c 90%)',
                      boxShadow: '0 3px 5px 2px rgba(220, 38, 38, .3)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #b91c1c 30%, #991b1b 90%)',
                      }
                    }}
                  >
                    Open Filters
                    {(typeFilter.length + sourceFilter.length + genreFilter.length + directorFilter.length + actorFilter.length) > 0 && (
                      <Chip
                        label={typeFilter.length + sourceFilter.length + genreFilter.length + directorFilter.length + actorFilter.length}
                        size="small"
                        sx={{
                          ml: 1,
                          backgroundColor: 'white',
                          color: '#dc2626',
                          fontWeight: 700,
                          height: 20,
                          minWidth: 20
                        }}
                      />
                    )}
                  </Button>
                </Box>

                {/* Filter Sidebar */}
                <Drawer
                  anchor="right"
                  open={filterSidebarOpen}
                  onClose={() => setFilterSidebarOpen(false)}
                  sx={{
                    '& .MuiDrawer-paper': {
                      width: { xs: '100%', sm: 400 },
                      backgroundColor: '#f9fafb',
                    }
                  }}
                >
                  <Box className="h-full flex flex-col">
                    {/* Sidebar Header */}
                    <Box className="p-4 bg-gradient-to-r from-red-900 to-red-800 text-white flex items-center justify-between">
                      <Box className="flex items-center gap-2">
                        <FilterListIcon sx={{ fontSize: 28 }} />
                        <Typography variant="h5" className="font-bold">
                          Filters
                        </Typography>
                      </Box>
                      <IconButton
                        onClick={() => setFilterSidebarOpen(false)}
                        sx={{ color: 'white' }}
                      >
                        <CloseIcon />
                      </IconButton>
                    </Box>

                    {/* Active Filters Summary */}
                    {(typeFilter.length + sourceFilter.length + genreFilter.length + directorFilter.length + actorFilter.length) > 0 && (
                      <Box className="p-4 bg-amber-50 border-b border-amber-200">
                        <Typography variant="subtitle2" className="font-semibold text-gray-700 mb-2">
                          Active Filters: {typeFilter.length + sourceFilter.length + genreFilter.length + directorFilter.length + actorFilter.length}
                        </Typography>
                        <Button
                          size="small"
                          onClick={() => {
                            setTypeFilter([]);
                            setSourceFilter([]);
                            setGenreFilter([]);
                            setDirectorFilter([]);
                            setActorFilter([]);
                          }}
                          sx={{
                            textTransform: 'none',
                            color: '#dc2626',
                            fontWeight: 600
                          }}
                        >
                          Clear All Filters
                        </Button>
                      </Box>
                    )}

                    {/* Filter Controls */}
                    <Box className="flex-1 overflow-y-auto p-4">
                      {/* Type Filter */}
                      <FormControl fullWidth sx={{ mb: 3 }}>
                      <InputLabel id="type-filter-label">Content Type</InputLabel>
                      <Select
                        labelId="type-filter-label"
                        id="type-filter"
                        multiple
                        value={typeFilter}
                        onChange={handleTypeFilterChange}
                        input={<OutlinedInput label="Content Type" />}
                        renderValue={(selected) => (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.map((value) => (
                              <Chip 
                                key={value} 
                                label={value.charAt(0).toUpperCase() + value.slice(1)} 
                                size="small"
                                sx={{ 
                                  backgroundColor: '#fef3c7',
                                  color: '#92400e',
                                  fontWeight: 600
                                }}
                              />
                            ))}
                          </Box>
                        )}
                      >
                        <MenuItem value="movie">
                          <Checkbox checked={typeFilter.indexOf('movie') > -1} />
                          <ListItemText primary="Movies" />
                        </MenuItem>
                        <MenuItem value="series">
                          <Checkbox checked={typeFilter.indexOf('series') > -1} />
                          <ListItemText primary="Series" />
                        </MenuItem>
                        <MenuItem value="episode">
                          <Checkbox checked={typeFilter.indexOf('episode') > -1} />
                          <ListItemText primary="Episodes" />
                        </MenuItem>
                      </Select>
                    </FormControl>

                      {/* Source Filter */}
                      <FormControl fullWidth sx={{ mb: 3 }}>
                      <InputLabel id="source-filter-label">Recommendation Type</InputLabel>
                      <Select
                        labelId="source-filter-label"
                        id="source-filter"
                        multiple
                        value={sourceFilter}
                        onChange={handleSourceFilterChange}
                        input={<OutlinedInput label="Recommendation Type" />}
                        renderValue={(selected) => (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.map((value) => (
                              <Chip 
                                key={value} 
                                label={value === 'Genre' ? 'Genre Match' : value === 'Director' ? 'Same Director' : 'Same Actor'} 
                                size="small"
                                sx={{ 
                                  backgroundColor: '#fed7aa',
                                  color: '#9a3412',
                                  fontWeight: 600
                                }}
                              />
                            ))}
                          </Box>
                        )}
                      >
                        <MenuItem value="Genre">
                          <Checkbox checked={sourceFilter.indexOf('Genre') > -1} />
                          <ListItemText primary="Genre Match" />
                        </MenuItem>
                        <MenuItem value="Director">
                          <Checkbox checked={sourceFilter.indexOf('Director') > -1} />
                          <ListItemText primary="Same Director" />
                        </MenuItem>
                        <MenuItem value="Actor">
                          <Checkbox checked={sourceFilter.indexOf('Actor') > -1} />
                          <ListItemText primary="Same Actor" />
                        </MenuItem>
                      </Select>
                    </FormControl>

                      {/* Genre Filter */}
                      <FormControl fullWidth sx={{ mb: 3 }} disabled={availableFilters.genres.length === 0}>
                      <InputLabel id="genre-filter-label">Specific Genre</InputLabel>
                      <Select
                        labelId="genre-filter-label"
                        id="genre-filter"
                        multiple
                        value={genreFilter}
                        onChange={handleGenreFilterChange}
                        input={<OutlinedInput label="Specific Genre" />}
                        renderValue={(selected) => (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.map((value) => (
                              <Chip 
                                key={value} 
                                label={value} 
                                size="small"
                                sx={{ 
                                  backgroundColor: '#fecaca',
                                  color: '#7f1d1d',
                                  fontWeight: 600
                                }}
                              />
                            ))}
                          </Box>
                        )}
                      >
                        {availableFilters.genres.length === 0 ? (
                          <MenuItem disabled>
                            <ListItemText primary="No genre recommendations" />
                          </MenuItem>
                        ) : (
                          availableFilters.genres.map((genre) => (
                            <MenuItem key={genre} value={genre}>
                              <Checkbox checked={genreFilter.indexOf(genre) > -1} />
                              <ListItemText primary={genre} />
                            </MenuItem>
                          ))
                        )}
                      </Select>
                    </FormControl>

                      {/* Director Filter */}
                      <FormControl fullWidth sx={{ mb: 3 }} disabled={availableFilters.directors.length === 0}>
                      <InputLabel id="director-filter-label">Specific Director</InputLabel>
                      <Select
                        labelId="director-filter-label"
                        id="director-filter"
                        multiple
                        value={directorFilter}
                        onChange={handleDirectorFilterChange}
                        input={<OutlinedInput label="Specific Director" />}
                        renderValue={(selected) => (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.map((value) => (
                              <Chip 
                                key={value} 
                                label={value} 
                                size="small"
                                sx={{ 
                                  backgroundColor: '#e0e7ff',
                                  color: '#312e81',
                                  fontWeight: 600
                                }}
                              />
                            ))}
                          </Box>
                        )}
                      >
                        {availableFilters.directors.length === 0 ? (
                          <MenuItem disabled>
                            <ListItemText primary="No director recommendations" />
                          </MenuItem>
                        ) : (
                          availableFilters.directors.map((director) => (
                            <MenuItem key={director} value={director}>
                              <Checkbox checked={directorFilter.indexOf(director) > -1} />
                              <ListItemText primary={director} />
                            </MenuItem>
                          ))
                        )}
                      </Select>
                    </FormControl>

                      {/* Actor Filter */}
                      <FormControl fullWidth sx={{ mb: 3 }} disabled={availableFilters.actors.length === 0}>
                      <InputLabel id="actor-filter-label">Specific Actor</InputLabel>
                      <Select
                        labelId="actor-filter-label"
                        id="actor-filter"
                        multiple
                        value={actorFilter}
                        onChange={handleActorFilterChange}
                        input={<OutlinedInput label="Specific Actor" />}
                        renderValue={(selected) => (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.map((value) => (
                              <Chip 
                                key={value} 
                                label={value} 
                                size="small"
                                sx={{ 
                                  backgroundColor: '#fce7f3',
                                  color: '#831843',
                                  fontWeight: 600
                                }}
                              />
                            ))}
                          </Box>
                        )}
                      >
                        {availableFilters.actors.length === 0 ? (
                          <MenuItem disabled>
                            <ListItemText primary="No actor recommendations" />
                          </MenuItem>
                        ) : (
                          availableFilters.actors.map((actor) => (
                            <MenuItem key={actor} value={actor}>
                              <Checkbox checked={actorFilter.indexOf(actor) > -1} />
                              <ListItemText primary={actor} />
                            </MenuItem>
                          ))
                        )}
                      </Select>
                    </FormControl>
                    </Box>

                    {/* Sidebar Footer */}
                    <Box className="p-4 bg-white border-t border-gray-200">
                      <Button
                        fullWidth
                        variant="contained"
                        onClick={() => setFilterSidebarOpen(false)}
                        sx={{
                          borderRadius: '12px',
                          textTransform: 'none',
                          fontWeight: 600,
                          py: 1.5,
                          background: 'linear-gradient(45deg, #dc2626 30%, #b91c1c 90%)',
                          '&:hover': {
                            background: 'linear-gradient(45deg, #b91c1c 30%, #991b1b 90%)',
                          }
                        }}
                      >
                        Apply Filters
                      </Button>
                    </Box>
                  </Box>
                </Drawer>

                {/* Results or Empty State */}
                {fullyFilteredRecommendations.length > 0 ? (
                  <Box className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {fullyFilteredRecommendations.map((movie) => (
                      <RecommendationCard 
                        key={movie.imdbID}
                        movie={movie}
                        onDetailsClick={handleMovieClick}
                      />
                    ))}
                  </Box>
                ) : (
                  <Box className="text-center py-20">
                    <Typography variant="h5" color="text.secondary" className="mb-4">
                      No recommendations match your filters
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Try adjusting your filters or search terms
                    </Typography>
                    <RecommendIcon sx={{ fontSize: 120, color: '#bdbdbd', mt: 2 }} />
                  </Box>
                )}
              </Box>
            )}
          </>
        )}
      </Container>

      {/* Movie Details Modal */}
      <MovieDetails open={!!selectedMovie} />
    </Box>
  );
}

