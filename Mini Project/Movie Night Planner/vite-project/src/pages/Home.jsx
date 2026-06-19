import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Plus, Check, Info, Film, Sparkles } from 'lucide-react';
import movies from '../data/movies';
import Carousel from '../components/Carousel';
import Watchlist from '../components/Watchlist';
import { cn } from '../utils/cn';

function Home() {
  const [watchlist, setWatchlist] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('All');

  // Featured Movie for the Hero Header (Galactic Drift)
  const featuredMovie = useMemo(() => {
    return movies.find(m => m.id === 1) || movies[0];
  }, []);

  const genres = useMemo(() => {
    const unique = new Set(movies.map((m) => m.genre));
    return ['All', ...unique];
  }, []);

  const filteredMovies = useMemo(() => {
    if (selectedGenre === 'All') return movies;
    return movies.filter((m) => m.genre === selectedGenre);
  }, [selectedGenre]);

  const isInWatchlist = (id) => watchlist.some((m) => m.id === id);

  const addToWatchlist = (movie) => {
    if (!isInWatchlist(movie.id)) {
      setWatchlist([...watchlist, movie]);
    }
  };

  const removeFromWatchlist = (id) => {
    setWatchlist(watchlist.filter((m) => m.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#0c0c0e] pb-24 text-neutral-100 selection:bg-red-600 selection:text-white">
      
      {/* Cinematic Netflix Hero Section */}
      <section className="relative w-full h-[70vh] md:h-[85vh] flex items-center justify-start overflow-hidden">
        {/* Cinematic Backdrop Image */}
        <div className="absolute inset-0">
          <img 
            src={featuredMovie.poster} 
            alt={featuredMovie.title} 
            className="w-full h-full object-cover object-center scale-105 filter brightness-75 contrast-105 transition-all duration-700" 
          />
          {/* Multi-layered Netflix-style Vignette overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0c0c0e]/90 via-[#0c0c0e]/50 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0e] via-[#0c0c0e]/20 to-[#0c0c0e]/30 z-10" />
        </div>

        {/* Ambient Glow Aura */}
        <div className="absolute top-1/4 left-1/4 size-[400px] bg-red-600/10 blur-[150px] pointer-events-none rounded-full" />

        {/* Hero Content */}
        <div className="relative z-20 max-w-4xl px-4 md:px-12 mt-12 md:mt-24">
          
          {/* Tagline Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-600/20 backdrop-blur-md border border-red-600/30 text-red-500 rounded-full text-xs font-semibold uppercase tracking-wider mb-4"
          >
            <Sparkles className="size-3.5 fill-red-500" />
            Featured Presentation
          </motion.div>

          {/* Title */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-4xl md:text-7xl font-extrabold font-heading text-white tracking-tight mb-4 drop-shadow-md"
          >
            {featuredMovie.title}
          </motion.h1>

          {/* Metadata Row */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center gap-3 text-xs md:text-sm text-neutral-300 font-medium mb-5"
          >
            <span className="px-2 py-0.5 bg-neutral-800 rounded-md border border-neutral-700 text-white font-bold">
              HD
            </span>
            <span className="text-red-500 font-bold">★ {featuredMovie.rating.toFixed(1)}</span>
            <span className="text-neutral-500">•</span>
            <span>{featuredMovie.year}</span>
            <span className="text-neutral-500">•</span>
            <span>{featuredMovie.genre}</span>
            <span className="text-neutral-500">•</span>
            <span>{featuredMovie.duration} min</span>
          </motion.div>

          {/* Description / Synopsis */}
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="text-sm md:text-base text-neutral-400 max-w-2xl leading-relaxed mb-8 drop-shadow"
          >
            An epic journey into the deep unknown. Follow a crew of interstellar explorers as they drift through nebulae, facing cosmic anomalies and the cold silence of the void in search of humanity's next sanctuary.
          </motion.p>

          {/* Action Buttons */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-wrap gap-4"
          >
            <button className="flex items-center gap-2 px-6 py-3 bg-white text-black hover:bg-neutral-200 transition-colors duration-250 font-bold rounded-lg text-sm shadow-lg">
              <Play className="size-4 fill-black" />
              Watch Trailer
            </button>
            <button 
              onClick={() => {
                if (isInWatchlist(featuredMovie.id)) {
                  removeFromWatchlist(featuredMovie.id);
                } else {
                  addToWatchlist(featuredMovie);
                }
              }}
              className={cn(
                "flex items-center gap-2 px-6 py-3 border backdrop-blur-md text-white transition-colors duration-250 font-bold rounded-lg text-sm shadow-lg",
                isInWatchlist(featuredMovie.id)
                  ? "bg-red-600/80 border-red-500 hover:bg-red-700/80"
                  : "bg-neutral-900/60 border-neutral-700 hover:bg-neutral-800/80"
              )}
            >
              {isInWatchlist(featuredMovie.id) ? (
                <>
                  <Check className="size-4 text-white" />
                  In Watchlist
                </>
              ) : (
                <>
                  <Plus className="size-4 text-white" />
                  My Watchlist
                </>
              )}
            </button>
          </motion.div>

        </div>
      </section>

      {/* Main Movie Content */}
      <main className="relative z-30 -mt-16 md:-mt-24">
        
        {/* Trending Now Carousel */}
        <Carousel
          title="Trending Now"
          movies={movies}
          isInWatchlist={isInWatchlist}
          onAdd={addToWatchlist}
          onRemove={removeFromWatchlist}
        />

        {/* Dynamic Genre Selector Pills */}
        <section className="px-4 md:px-12 my-12">
          <div className="flex items-center gap-2 mb-6">
            <Film className="size-5 text-red-600" />
            <h2 className="text-xl md:text-2xl font-semibold font-heading text-white">
              Explore Genres
            </h2>
          </div>
          
          <div className="flex flex-wrap gap-2.5">
            {genres.map((genre) => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={cn(
                  "px-4 py-2 text-xs md:text-sm font-semibold rounded-full border transition-all duration-200 cursor-pointer active:scale-95",
                  genre === selectedGenre
                    ? "bg-red-600 border-red-600 text-white shadow-lg shadow-red-600/20"
                    : "bg-neutral-900/80 border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800 hover:border-neutral-700"
                )}
              >
                {genre}
              </button>
            ))}
          </div>
        </section>

        {/* Dynamic Genre Carousel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedGenre}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
          >
            <Carousel
              title={selectedGenre === 'All' ? 'All Movies' : `${selectedGenre} Movies`}
              movies={filteredMovies}
              isInWatchlist={isInWatchlist}
              onAdd={addToWatchlist}
              onRemove={removeFromWatchlist}
            />
          </motion.div>
        </AnimatePresence>

        {/* Personalised Interactive Watchlist */}
        <Watchlist 
          watchlist={watchlist} 
          onRemove={removeFromWatchlist} 
        />

      </main>

    </div>
  );
}

export default Home;