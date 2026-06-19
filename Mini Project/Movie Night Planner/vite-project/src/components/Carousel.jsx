import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MovieCard from './MovieCard';

function Carousel({ title, movies, isInWatchlist, onAdd, onRemove }) {
  const trackRef = useRef(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const scroll = (direction) => {
    if (trackRef.current) {
      const scrollAmount = 450;
      trackRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="my-10 px-4 md:px-12 relative group/carousel">
      {/* Category Title */}
      <h2 className="text-xl md:text-2xl font-semibold font-heading text-white mb-4 pl-1 border-l-4 border-red-600 tracking-wide">
        {title}
      </h2>

      {/* Row Container */}
      <div className="relative flex items-center w-full">
        
        {/* Left Scroll Button */}
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 z-40 h-[92%] w-12 flex items-center justify-center bg-black/60 backdrop-blur-sm border-r border-white/5 opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 hover:bg-black/90 hover:scale-x-110 text-white rounded-r-lg"
          aria-label="Scroll left"
        >
          <ChevronLeft className="size-6 transition-transform hover:scale-125" />
        </button>

        {/* Scrollable Horizontal Track */}
        <div
          ref={trackRef}
          className="flex gap-5 overflow-x-auto overflow-y-hidden scroll-smooth w-full py-6 px-1 scrollbar-none"
          style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
        >
          {movies.length === 0 ? (
            <p className="text-neutral-500 py-6 px-4 italic">No movies found in this collection.</p>
          ) : (
            movies.map((movie, index) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                inWatchlist={isInWatchlist}
                onAdd={onAdd}
                onRemove={onRemove}
                index={index}
                hoveredIndex={hoveredIndex}
                setHoveredIndex={setHoveredIndex}
              />
            ))
          )}
        </div>

        {/* Right Scroll Button */}
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 z-40 h-[92%] w-12 flex items-center justify-center bg-black/60 backdrop-blur-sm border-l border-white/5 opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 hover:bg-black/90 hover:scale-x-110 text-white rounded-l-lg"
          aria-label="Scroll right"
        >
          <ChevronRight className="size-6 transition-transform hover:scale-125" />
        </button>

      </div>
    </section>
  );
}

export default Carousel;