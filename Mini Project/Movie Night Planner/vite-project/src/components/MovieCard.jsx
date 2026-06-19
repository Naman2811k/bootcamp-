import React from 'react';
import { motion } from 'framer-motion';
import { Play, Plus, Check, Star, Clock } from 'lucide-react';
import { cn } from '../utils/cn';

function MovieCard({ 
  movie, 
  inWatchlist, 
  onAdd, 
  onRemove, 
  index, 
  hoveredIndex, 
  setHoveredIndex 
}) {
  
  const isCurrentlyHovered = hoveredIndex === index;
  const isAnyCardHovered = hoveredIndex !== null;
  const isBlurred = isAnyCardHovered && !isCurrentlyHovered;

  const handleClick = (e) => {
    e.stopPropagation(); // prevent card clicks if overlay is interactive
    if (inWatchlist) {
      onRemove(movie.id);
    } else {
      onAdd(movie);
    }
  };

  return (
    <motion.div
      onMouseEnter={() => setHoveredIndex(index)}
      onMouseLeave={() => setHoveredIndex(null)}
      animate={{
        scale: isCurrentlyHovered ? 1.08 : isBlurred ? 0.95 : 1,
        filter: isBlurred ? "blur(3px)" : "blur(0px)",
        opacity: isBlurred ? 0.45 : 1,
      }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "relative flex-none w-56 h-80 rounded-xl overflow-hidden bg-brand-card cursor-pointer group shadow-lg border border-neutral-800/50 transition-shadow duration-300",
        isCurrentlyHovered && "z-30 shadow-[0_20px_50px_rgba(229,9,20,0.25)] border-neutral-700/80"
      )}
    >
      {/* Background Poster Image */}
      <img 
        src={movie.poster} 
        alt={movie.title} 
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />

      {/* Cinematic Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-300" />

      {/* Static Genre Tag (Top Left) */}
      <div className="absolute top-3 left-3 z-10 px-2.5 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-full text-[10px] font-semibold tracking-wider text-red-500 uppercase">
        {movie.genre}
      </div>

      {/* Title and rating shown by default, details slide up on hover */}
      <div className="absolute bottom-0 inset-x-0 p-4 flex flex-col justify-end min-h-[120px] z-10">
        <h3 className="font-heading font-semibold text-base text-white line-clamp-1 mb-1 leading-snug group-hover:text-red-500 transition-colors duration-200">
          {movie.title}
        </h3>
        
        {/* Rating/Year (Always visible row) */}
        <div className="flex items-center gap-2 text-xs text-neutral-300 mb-2">
          <span className="flex items-center gap-0.5 text-amber-500 font-bold">
            <Star className="size-3 fill-amber-500" />
            {movie.rating.toFixed(1)}
          </span>
          <span className="text-neutral-500">•</span>
          <span>{movie.year}</span>
        </div>

        {/* Expandable action area on hover */}
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ 
            opacity: isCurrentlyHovered ? 1 : 0,
            height: isCurrentlyHovered ? "auto" : 0
          }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="overflow-hidden flex flex-col gap-2.5 pt-1"
        >
          {/* Duration */}
          <div className="flex items-center gap-1.5 text-xs text-neutral-400">
            <Clock className="size-3.5" />
            <span>{movie.duration} mins</span>
          </div>

          {/* Action Row */}
          <div className="flex gap-2 mt-1">
            <button className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-white text-black hover:bg-neutral-200 text-xs font-bold rounded-lg transition-colors duration-200">
              <Play className="size-3.5 fill-black" />
              Play
            </button>
            <button
              onClick={handleClick}
              className={cn(
                "size-8 flex items-center justify-center rounded-lg border text-white transition-all duration-200",
                inWatchlist 
                  ? "bg-red-600 border-red-600 hover:bg-red-700 hover:border-red-700" 
                  : "bg-neutral-900 border-neutral-700 hover:bg-neutral-800 hover:border-neutral-500"
              )}
              title={inWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
            >
              {inWatchlist ? <Check className="size-4" /> : <Plus className="size-4" />}
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default MovieCard;