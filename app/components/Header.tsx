import { Box } from '@mui/material';
import { Link } from 'react-router';

export default function Header() {
  return (
    <Box 
      className="fixed top-0 left-0 right-0 bg-transparent"
      
    >
      <Box className="container px-10 py-3 flex items-center">
        <Link to="/" className="flex items-center">
          <img 
            src="/white-logo.png" 
            alt="Movie Hub Logo" 
            className="h-10 w-auto hover:opacity-80 transition-opacity"
          />
        </Link>
      </Box>
    </Box>
  );
}
