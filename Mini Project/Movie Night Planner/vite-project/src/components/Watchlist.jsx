import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Clock, Calendar, Play, Ticket, Info, Coffee } from 'lucide-react';
import { cn } from '../utils/cn';

function Watchlist({ watchlist, onRemove }) {
  const [startTime, setStartTime] = useState('19:00');
  const [schedule, setSchedule] = useState([]);

  // Calculate total watchlist duration
  const totalMinutes = watchlist.reduce((sum, m) => sum + m.duration, 0);
  const totalHours = Math.floor(totalMinutes / 60);
  const remainingMinutes = totalMinutes % 60;

  const formatTime = (totalMins) => {
    const h = Math.floor(totalMins / 60) % 24;
    const m = totalMins % 60;
    const period = h >= 12 ? 'PM' : 'AM';
    const displayHour = h % 12 === 0 ? 12 : h % 12;
    return `${displayHour}:${m.toString().padStart(2, '0')} ${period}`;
  };

  const generateSchedule = () => {
    const [hours, minutes] = startTime.split(':').map(Number);
    let currentMinutes = hours * 60 + minutes;
    const breakTime = 15; // short break between movies

    const newSchedule = [];
    watchlist.forEach((movie, index) => {
      const start = formatTime(currentMinutes);
      const startRaw = currentMinutes;
      currentMinutes += movie.duration;
      const end = formatTime(currentMinutes);
      
      newSchedule.push({
        type: 'movie',
        id: movie.id,
        title: movie.title,
        genre: movie.genre,
        poster: movie.poster,
        duration: movie.duration,
        start,
        end
      });

      // Add break if it is not the last movie
      if (index < watchlist.length - 1) {
        const breakStart = formatTime(currentMinutes);
        currentMinutes += breakTime;
        const breakEnd = formatTime(currentMinutes);
        newSchedule.push({
          type: 'break',
          id: `break-${movie.id}`,
          duration: breakTime,
          start: breakStart,
          end: breakEnd
        });
      }
    });

    setSchedule(newSchedule);
  };

  return (
    <section className="max-w-6xl mx-auto px-4 md:px-12 mt-16">
      
      <div className="bg-[#111115]/80 backdrop-blur-xl border border-neutral-800/80 rounded-2xl p-6 md:p-10 shadow-2xl relative">
        {/* Glow accent */}
        <div className="absolute -top-10 left-1/3 size-64 bg-red-600/5 blur-[80px] pointer-events-none rounded-full" />
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-8 pb-5 border-b border-neutral-800/60">
          <Ticket className="size-6 text-red-500" />
          <h2 className="text-xl md:text-3xl font-bold font-heading text-white">
            Your Movie Night Watchlist
          </h2>
        </div>

        {watchlist.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="size-16 flex items-center justify-center rounded-2xl bg-neutral-900 border border-neutral-800 text-neutral-500 mb-4">
              <Play className="size-8" />
            </div>
            <p className="text-neutral-400 font-medium max-w-sm">
              Your watchlist is looking empty. Click the "+ Watchlist" icon on any movie poster above to construct your playlist!
            </p>
          </div>
        ) : (
          /* Watchlist Content */
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            
            {/* Left side: Movie Selection Cards */}
            <div className="lg:col-span-3 flex flex-col gap-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                Selected Movies ({watchlist.length})
              </h3>
              
              <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto pr-1">
                <AnimatePresence initial={false}>
                  {watchlist.map((movie) => (
                    <motion.div
                      key={movie.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="flex items-center justify-between p-3 bg-neutral-900/60 hover:bg-neutral-900 border border-neutral-800/60 hover:border-neutral-700/60 rounded-xl transition-all duration-200"
                    >
                      {/* Movie poster/details */}
                      <div className="flex items-center gap-4">
                        <img 
                          src={movie.poster} 
                          alt={movie.title} 
                          className="size-12 rounded-lg object-cover bg-neutral-800 shadow" 
                        />
                        <div className="flex flex-col">
                          <span className="font-heading font-semibold text-white text-sm md:text-base leading-snug">
                            {movie.title}
                          </span>
                          <div className="flex items-center gap-2 text-xs text-neutral-400 mt-1">
                            <span className="px-1.5 py-0.5 bg-neutral-800 text-neutral-300 font-bold rounded">
                              {movie.genre}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-0.5"><Clock className="size-3" />{movie.duration}m</span>
                          </div>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button 
                        onClick={() => onRemove(movie.id)}
                        className="p-2 text-neutral-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                        title="Remove Movie"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Total Duration Footer */}
              <div className="mt-4 flex items-center justify-between p-4 bg-neutral-900/30 border border-neutral-900 rounded-xl">
                <div className="flex items-center gap-2 text-sm text-neutral-400">
                  <Clock className="size-4 text-red-500" />
                  <span>Total Marathon Runtime</span>
                </div>
                <span className="font-heading text-lg font-bold text-white">
                  {totalHours > 0 ? `${totalHours}h ` : ""}{remainingMinutes}m
                </span>
              </div>
            </div>

            {/* Right side: Interactive Scheduling Timetable */}
            <div className="lg:col-span-2 bg-[#17171d]/60 border border-neutral-800/60 rounded-xl p-5 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-400 mb-4">
                  Marathon Scheduler
                </h3>

                {/* Controls */}
                <div className="flex flex-col gap-4 mb-6">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-neutral-400 font-bold uppercase">
                      Target Start Time
                    </label>
                    <input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="px-3.5 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-white font-medium focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-colors w-full"
                    />
                  </div>
                  
                  <button 
                    onClick={generateSchedule}
                    className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-red-600/15"
                  >
                    <Calendar className="size-4" />
                    Generate Showcase Itinerary
                  </button>
                </div>
              </div>

              {/* Tonight's Schedule Display */}
              <div className="flex-1 flex flex-col justify-start">
                <AnimatePresence mode="wait">
                  {schedule.length > 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col gap-3 pt-3 border-t border-neutral-800"
                    >
                      <h4 className="text-xs font-bold uppercase text-red-500 tracking-wider flex items-center gap-1.5 mb-1">
                        <Ticket className="size-3.5" />
                        Tonight's Timeline
                      </h4>

                      <div className="flex flex-col gap-2 max-h-[260px] overflow-y-auto pr-1">
                        {schedule.map((item) => {
                          if (item.type === 'movie') {
                            return (
                              <div 
                                key={item.id}
                                className="flex items-center justify-between p-2.5 bg-neutral-900/50 border border-neutral-900 rounded-lg text-xs"
                              >
                                <div className="flex items-center gap-2">
                                  <img src={item.poster} className="size-6 object-cover rounded" />
                                  <span className="font-semibold text-white truncate max-w-[120px]">{item.title}</span>
                                </div>
                                <span className="font-mono text-neutral-400 bg-neutral-950 px-2 py-0.5 rounded border border-neutral-800/80">
                                  {item.start} – {item.end}
                                </span>
                              </div>
                            );
                          } else {
                            // Intermission break
                            return (
                              <div 
                                key={item.id}
                                className="flex items-center justify-between py-1 px-3 border border-dashed border-neutral-800 rounded-lg text-[10px] text-neutral-500 bg-neutral-950/20"
                              >
                                <span className="flex items-center gap-1">
                                  <Coffee className="size-3 text-amber-500" />
                                  Popcorn & Refreshment Break
                                </span>
                                <span className="font-semibold">{item.duration}m</span>
                              </div>
                            );
                          }
                        })}
                      </div>
                    </motion.div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-4 border border-dashed border-neutral-800 rounded-lg">
                      <Info className="size-5 text-neutral-600 mb-1.5" />
                      <p className="text-[11px] text-neutral-500 max-w-[180px]">
                        Adjust start time and click generate to build your schedule timeline.
                      </p>
                    </div>
                  )}
                </AnimatePresence>
              </div>

            </div>

          </div>
        )}

      </div>
    </section>
  );
}

export default Watchlist;