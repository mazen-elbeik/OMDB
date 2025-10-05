import { Card, CardMedia, CardContent, Typography, Chip, IconButton, Box } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import InfoIcon from '@mui/icons-material/Info';
import type { Movie } from '../store/movieSlice';

interface MovieCardProps {
  movie: Movie;
  onDetailsClick: (imdbID: string) => void;
  onFavoriteClick: (imdbID: string) => void;
  isFavorite?: boolean;
}

export default function MovieCard({ movie, onDetailsClick, onFavoriteClick, isFavorite = false }: MovieCardProps) {
  const posterUrl = movie.Poster !== 'N/A' ? movie.Poster : '/movie-placeholder.svg';

  return (
    <Card 
      className="group relative h-full flex flex-col transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 cursor-pointer"
      sx={{ 
        borderRadius: '16px',
        backgroundColor: '#ffffff',
        overflow: 'hidden'
      }}
    >
      <Box className="relative">
        <CardMedia
          component="img"
          image={posterUrl}
          alt={movie.Title}
          onError={(e: any) => {
            if (e.target.src !== '/movie-placeholder.svg') {
              e.target.src = '/movie-placeholder.svg';
            }
          }}
          sx={{ 
            height: 400, 
            objectFit: 'cover',
            transition: 'transform 0.3s',
            '&:hover': {
              transform: 'scale(1.05)'
            }
          }}
        />
        <Box 
          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4 gap-2"
        >
          <IconButton
            onClick={() => onDetailsClick(movie.imdbID)}
            sx={{ 
              backgroundColor: 'white',
              color: '#dc2626',
              '&:hover': { backgroundColor: '#fef2f2' }
            }}
            size="large"
          >
            <InfoIcon />
          </IconButton>
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              onFavoriteClick(movie.imdbID);
            }}
            sx={{ 
              backgroundColor: 'white',
              color: isFavorite ? '#f44336' : '#9e9e9e',
              '&:hover': { backgroundColor: '#f5f5f5' }
            }}
            size="large"
          >
            <FavoriteIcon />
          </IconButton>
        </Box>
      </Box>
      
      <CardContent className="flex-grow">
        <Typography 
          variant="h6" 
          component="h3" 
          className="font-bold mb-2 line-clamp-2"
          sx={{ color: '#1a1a1a' }}
        >
          {movie.Title}
        </Typography>
        <Box className="flex items-center justify-between">
          <Chip 
            label={movie.Year} 
            size="small" 
            sx={{ 
              backgroundColor: '#fef3c7',
              color: '#92400e',
              fontWeight: 600
            }}
          />
          <Chip 
            label={movie.Type} 
            size="small" 
            variant="outlined"
            sx={{ 
              borderColor: '#f59e0b',
              color: '#92400e',
              textTransform: 'capitalize'
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
}

