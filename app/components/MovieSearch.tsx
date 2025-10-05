import { useState, useEffect } from 'react';
import { TextField, InputAdornment, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useAppDispatch } from '../store/hooks';
import { fetchMovies, setSearchQuery, filterFavorites, filterRecommendations, clearFilters } from '../store/movieSlice';

interface MovieSearchProps {
  currentTab: number; // 0: Search Results, 1: Favorites, 2: Recommendations
}

export default function MovieSearch({ currentTab }: MovieSearchProps) {
  const [localQuery, setLocalQuery] = useState('');
  const dispatch = useAppDispatch();

  // Clear search input when tab changes
  useEffect(() => {
    setLocalQuery('');
  }, [currentTab]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = localQuery.trim();

    if (query) {
      dispatch(setSearchQuery(query));
      
      // Search based on current tab
      if (currentTab === 0) {
        // Search API for all movies
        dispatch(fetchMovies({ query, page: 1 }));
      } else if (currentTab === 1) {
        // Filter favorites locally
        dispatch(filterFavorites(query));
      } else if (currentTab === 2) {
        // Filter recommendations locally
        dispatch(filterRecommendations(query));
      }
    } else {
      // Clear filters when query is empty
      dispatch(clearFilters());
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalQuery(value);
    
    // Real-time filtering for favorites and recommendations
    if (currentTab === 1) {
      dispatch(filterFavorites(value));
    } else if (currentTab === 2) {
      dispatch(filterRecommendations(value));
    }
  };

  const getPlaceholder = () => {
    switch (currentTab) {
      case 0:
        return "Search for movies, series, episodes...";
      case 1:
        return "Filter your favorites...";
      case 2:
        return "Filter recommendations...";
      default:
        return "Search...";
    }
  };

  return (
    <Box component="form" onSubmit={handleSearch} className="w-full max-w-3xl mx-auto mb-8">
      <TextField
        fullWidth
        variant="outlined"
        placeholder={getPlaceholder()}
        value={localQuery}
        onChange={handleInputChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon className="text-gray-400" />
            </InputAdornment>
          ),
          sx: {
            backgroundColor: 'white',
            borderRadius: '12px',
            '& fieldset': {
              borderColor: '#e0e0e0',
            },
            '&:hover fieldset': {
              borderColor: '#f59e0b',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#dc2626',
            },
          },
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            fontSize: '1.1rem',
          },
        }}
      />
    </Box>
  );
}

