# Movie Hub - Setup Instructions

## Environment Variables

Create a `.env.local` file in the root directory with the following content:

```
VITE_OMDB_API_KEY=19c89397
```

This file is already in `.gitignore` to keep your API key safe.

## Running the Application

1. Install dependencies (if not already done):
   ```bash
   npm install
   ```

2. Create the `.env.local` file with your API key (see above)

3. Generate React Router types:
   ```bash
   npx react-router typegen
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to the local URL shown in the terminal (usually `http://localhost:5173`)

## Features

- **Movie Search**: Search for any movie, series, or episode using the OMDB API
- **Movie Details**: View comprehensive information including ratings, cast, plot, and awards
- **Favorites System**: Save your favorite movies to your personal collection (stored in localStorage)
- **Responsive Design**: Beautiful UI built with Material-UI and Tailwind CSS
- **State Management**: Redux Toolkit for efficient state management
- **Type Safety**: Full TypeScript support

## Navigation

- **Home (`/`)**: Landing page with feature overview
- **Movies (`/movies`)**: Main search and discovery page with tabs for search results and favorites

## Technologies Used

- React Router v7
- Redux Toolkit
- Material-UI (MUI)
- Tailwind CSS
- TypeScript
- OMDB API
- Vite

## API Reference

This application uses the [OMDb API](https://www.omdbapi.com/) for fetching movie data.

