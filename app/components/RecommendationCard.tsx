import { Box, Typography, Chip, Button } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import LightbulbIcon from '@mui/icons-material/Lightbulb';

interface RecommendationCardProps {
  movie: {
    imdbID: string;
    Title: string;
    Year: string;
    Type: string;
    Poster: string;
    recommendedBy?: string;
  };
  onDetailsClick: (imdbID: string) => void;
}

export default function RecommendationCard({ movie, onDetailsClick }: RecommendationCardProps) {
  const posterUrl = movie.Poster !== 'N/A' ? movie.Poster : '/movie-placeholder.svg';

  return (
    <Box
      className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer relative flex flex-col h-full"
      sx={{
        animation: 'fadeInUp 0.5s ease-out both',
        '@keyframes fadeInUp': {
          from: { opacity: 0, transform: 'translateY(20px)' },
          to: { opacity: 1, transform: 'translateY(0)' }
        }
      }}
    >
      {/* Recommendation Badge */}
      {movie.recommendedBy && (
        <Box 
          className="absolute top-3 left-3 z-10 flex items-center gap-1 px-2 py-1 rounded-full"
          sx={{
            backgroundColor: 'rgba(255, 193, 7, 0.95)',
            backdropFilter: 'blur(8px)'
          }}
        >
          <LightbulbIcon sx={{ fontSize: 16, color: '#fff' }} />
          <Typography variant="caption" className="text-white font-semibold">
            {movie.recommendedBy}
          </Typography>
        </Box>
      )}

      {/* Poster */}
      <Box 
        className="relative h-80 overflow-hidden"
        onClick={() => onDetailsClick(movie.imdbID)}
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
        <Box className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </Box>

      {/* Content */}
      <Box className="p-4 flex flex-col flex-grow">
        <Typography 
          variant="h6" 
          className="font-bold mb-2 line-clamp-2 group-hover:text-red-700 transition-colors"
          onClick={() => onDetailsClick(movie.imdbID)}
        >
          {movie.Title}
        </Typography>
        
        <Box className="flex items-center justify-between mb-3">
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

        {/* Spacer to push button to bottom */}
        <Box className="flex-grow" />

        <Button
          fullWidth
          variant="contained"
          startIcon={<InfoIcon />}
          onClick={() => onDetailsClick(movie.imdbID)}
          sx={{
            borderRadius: '12px',
            textTransform: 'none',
            fontWeight: 600,
            background: 'linear-gradient(45deg, #FFA726 30%, #FB8C00 90%)',
            boxShadow: '0 3px 5px 2px rgba(255, 152, 0, .3)',
            '&:hover': {
              background: 'linear-gradient(45deg, #FB8C00 30%, #F57C00 90%)',
            }
          }}
        >
          View Details
        </Button>
      </Box>
    </Box>
  );
}

