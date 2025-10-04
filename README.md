# 🎬 Movie Hub

A professional movie recommendation system and search engine built with modern web technologies.

## ✨ Features

- 🔍 **Advanced Movie Search** - Search through thousands of movies, series, and episodes using the OMDB API
- 🎥 **Detailed Movie Information** - View comprehensive details including ratings, cast, plot, awards, and more
- ❤️ **Personal Favorites** - Save and manage your favorite movies with persistent storage
- 🤖 **Smart Recommendations** - AI-powered recommendations based on your favorites (genre, director, actors)
- 🎨 **Beautiful UI** - Modern, responsive design with Material-UI and Tailwind CSS
- 🚀 **Fast Performance** - Server-side rendering with React Router v7
- 🔒 **Type Safety** - Full TypeScript support
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices
- 💾 **State Management** - Efficient state management with Redux Toolkit

## 🛠️ Technologies

- **React Router v7** - Modern routing and SSR
- **Redux Toolkit** - State management
- **Material-UI (MUI)** - Component library
- **Tailwind CSS** - Utility-first CSS framework
- **TypeScript** - Type safety
- **OMDB API** - Movie data source
- **Vite** - Build tool

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- An OMDB API key (already included in setup)

### Installation

1. Install the dependencies:

```bash
npm install
```

2. The `.env.local` file with the API key has already been created for you:

```
VITE_OMDB_API_KEY=19c89397
```

> **Note:** For production, create your own API key at [https://www.omdbapi.com/](https://www.omdbapi.com/)

### Development

1. Generate React Router types (if needed):

```bash
npx react-router typegen
```

2. Start the development server:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

## 📱 Application Routes

- **`/`** - Landing page with feature overview and navigation
- **`/movies`** - Main movie search and discovery page
  - Search tab: Browse search results with pagination
  - Favorites tab: View your saved favorite movies
  - Recommendations tab: Get personalized movie suggestions based on your favorites

## Building for Production

Create a production build:

```bash
npm run build
```

## Deployment

This project includes redirect configurations for multiple hosting platforms to ensure proper routing in production.

### Netlify Deployment

The project includes `netlify.toml` and `public/_redirects` for Netlify deployment:

1. Connect your repository to Netlify
2. Build command: `npm run build`
3. Publish directory: `build/client`
4. The redirects are automatically configured to handle React Router routing

### Vercel Deployment

The project includes `vercel.json` for Vercel deployment:

1. Connect your repository to Vercel
2. The build settings are automatically detected
3. React Router routes are handled by the redirect configuration

### Docker Deployment

To build and run using Docker:

```bash
docker build -t my-app .

# Run the container
docker run -p 3000:3000 my-app
```

The containerized application can be deployed to any platform that supports Docker, including:

- AWS ECS
- Google Cloud Run
- Azure Container Apps
- Digital Ocean App Platform
- Fly.io
- Railway

### DIY Deployment

If you're familiar with deploying Node applications, the built-in app server is production-ready.

Make sure to deploy the output of `npm run build`

```
├── package.json
├── package-lock.json (or pnpm-lock.yaml, or bun.lockb)
├── build/
│   ├── client/    # Static assets
│   └── server/    # Server-side code
```

### Redirect Files

The following redirect files are included for different hosting platforms:

- **`public/_redirects`** - Netlify redirects (automatically copied to build)
- **`netlify.toml`** - Netlify configuration with build settings
- **`vercel.json`** - Vercel routing configuration

These ensure that all routes (e.g., `/movies`, `/`) are properly handled by React Router in production.

## 🎨 Design

This application combines:
- **Material-UI** for professional component design and interactions
- **Tailwind CSS** for utility-first styling and rapid customization
- Custom gradients and animations for a modern look and feel

## 📝 API Reference

Movie data is provided by the [OMDb API](https://www.omdbapi.com/):
- Search movies by title
- Get detailed movie information
- Filter by type (movie, series, episode)
- Full plot descriptions and ratings

## 🔄 State Management

Redux Toolkit manages:
- Search results and queries
- Selected movie details
- Favorite movies (persisted to localStorage)
- Personalized recommendations based on favorites
- Loading and error states
- Pagination

## 📦 Project Structure

```
app/
├── components/          # Reusable UI components
│   ├── MovieCard.tsx
│   ├── MovieDetails.tsx
│   ├── MovieSearch.tsx
│   └── RecommendationCard.tsx
├── routes/             # Page routes
│   ├── home.tsx
│   └── movies.tsx
├── services/           # API services
│   ├── omdbApi.ts
│   └── recommendationService.ts
├── store/              # Redux store
│   ├── store.ts
│   ├── hooks.ts
│   ├── movieSlice.ts
│   └── counterSlice.ts
└── root.tsx            # Root layout
```

---

Built with ❤️ using React Router, Redux Toolkit, Material-UI, and the OMDb API.
