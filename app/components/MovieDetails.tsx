import { Dialog, DialogContent, IconButton, Typography, Box, Chip, Rating, Button, CircularProgress } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import StarIcon from '@mui/icons-material/Star';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { clearSelectedMovie, addToFavorites, removeFromFavorites } from '../store/movieSlice';

interface MovieDetailsProps {
  open: boolean;
}

export default function MovieDetails({ open }: MovieDetailsProps) {
  const dispatch = useAppDispatch();
  const { selectedMovie, loadingDetails, favorites } = useAppSelector((state) => state.movies);

  const handleClose = () => {
    dispatch(clearSelectedMovie());
  };

  const isFavorite = selectedMovie ? favorites.some(f => f.imdbID === selectedMovie.imdbID) : false;

  const handleToggleFavorite = () => {
    if (selectedMovie) {
      if (isFavorite) {
        dispatch(removeFromFavorites(selectedMovie.imdbID));
      } else {
        dispatch(addToFavorites(selectedMovie));
      }
    }
  };

  if (!selectedMovie && !loadingDetails) return null;

  const posterUrl = selectedMovie?.Poster !== 'N/A' ? selectedMovie?.Poster : '/movie-placeholder.svg';

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '20px',
          maxHeight: '90vh'
        }
      }}
    >
      <IconButton
        onClick={handleClose}
        sx={{
          position: 'absolute',
          right: 16,
          top: 16,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          zIndex: 1,
          '&:hover': { backgroundColor: 'white' }
        }}
      >
        <CloseIcon />
      </IconButton>

      <DialogContent sx={{ p: 0 }}>
        {loadingDetails ? (
          <Box className="flex items-center justify-center h-96">
            <CircularProgress />
          </Box>
        ) : selectedMovie ? (
          <Box>
            {/* Header with backdrop */}
            <Box 
              className="relative h-80 bg-gradient-to-br from-blue-600 to-purple-600"
              sx={{
                backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${posterUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <Box className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent">
                <Typography variant="h3" className="text-white font-bold mb-2">
                  {selectedMovie.Title}
                </Typography>
                <Box className="flex items-center gap-3 flex-wrap">
                  <Chip label={selectedMovie.Year} sx={{ backgroundColor: 'rgba(251, 191, 36, 0.9)', color: '#78350f', fontWeight: 600 }} />
                  <Chip label={selectedMovie.Rated} sx={{ backgroundColor: 'rgba(252, 211, 77, 0.9)', color: '#78350f', fontWeight: 600 }} />
                  <Chip label={selectedMovie.Runtime} sx={{ backgroundColor: 'rgba(253, 224, 71, 0.9)', color: '#78350f', fontWeight: 600 }} />
                </Box>
              </Box>
            </Box>

            {/* Content */}
            <Box className="p-6">
              <Box className="flex items-center justify-between mb-4">
                <Box className="flex items-center gap-2">
                  <StarIcon sx={{ color: '#ffc107', fontSize: 32 }} />
                  <Typography variant="h4" className="font-bold">
                    {selectedMovie.imdbRating}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    / 10
                  </Typography>
                </Box>
                <Button
                  variant={isFavorite ? 'contained' : 'outlined'}
                  startIcon={isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                  onClick={handleToggleFavorite}
                  sx={{
                    borderRadius: '12px',
                    textTransform: 'none',
                    px: 3,
                    fontWeight: 600,
                    backgroundColor: isFavorite ? '#dc2626' : 'transparent',
                    borderColor: '#dc2626',
                    color: isFavorite ? 'white' : '#dc2626',
                    '&:hover': {
                      backgroundColor: isFavorite ? '#b91c1c' : 'rgba(220, 38, 38, 0.08)',
                      borderColor: '#b91c1c',
                    }
                  }}
                >
                  {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                </Button>
              </Box>

              <Typography variant="h6" className="font-bold mb-2">
                Plot
              </Typography>
              <Typography variant="body1" className="mb-4 text-gray-700">
                {selectedMovie.Plot}
              </Typography>

              <Box className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <Box>
                  <Typography variant="subtitle2" className="font-bold text-gray-600">
                    Genre
                  </Typography>
                  <Typography variant="body1">{selectedMovie.Genre}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" className="font-bold text-gray-600">
                    Director
                  </Typography>
                  <Typography variant="body1">{selectedMovie.Director}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" className="font-bold text-gray-600">
                    Actors
                  </Typography>
                  <Typography variant="body1">{selectedMovie.Actors}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" className="font-bold text-gray-600">
                    Language
                  </Typography>
                  <Typography variant="body1">{selectedMovie.Language}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" className="font-bold text-gray-600">
                    Released
                  </Typography>
                  <Typography variant="body1">{selectedMovie.Released}</Typography>
                </Box>
                {selectedMovie.BoxOffice && (
                  <Box>
                    <Typography variant="subtitle2" className="font-bold text-gray-600">
                      Box Office
                    </Typography>
                    <Typography variant="body1">{selectedMovie.BoxOffice}</Typography>
                  </Box>
                )}
              </Box>

              {selectedMovie.Awards !== 'N/A' && (
                <Box className="mt-4 p-4 bg-amber-50 rounded-lg">
                  <Typography variant="subtitle2" className="font-bold text-amber-900 mb-1">
                    Awards
                  </Typography>
                  <Typography variant="body2" className="text-amber-800">
                    {selectedMovie.Awards}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

