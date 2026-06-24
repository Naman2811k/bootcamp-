import { useState } from "react";
import { createContext } from "react";

export const movieContext = createContext();

const MovieProvider = ({ children }) => {
  const [movies, setMovies] = useState([
    {
      id: 1,
      name: "Avengers: Endgame",
      year: 2019,
      rating: 8.4,
      genre: "Action, Adventure, Sci-Fi",
      image:
        "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500",
      description:
        "The Avengers assemble one final time to reverse Thanos' snap.",
    },
    {
      id: 2,
      name: "Avengers: Infinity War",
      year: 2018,
      rating: 8.4,
      genre: "Action, Adventure, Sci-Fi",
      image:
        "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=500",
      description:
        "The Avengers battle Thanos as he seeks the Infinity Stones.",
    },
    {
      id: 3,
      name: "Interstellar",
      year: 2014,
      rating: 8.7,
      genre: "Sci-Fi, Drama",
      image:
        "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=500",
      description: "A team of explorers travel through a wormhole in space.",
    },
    {
      id: 4,
      name: "The Dark Knight",
      year: 2008,
      rating: 9.0,
      genre: "Action, Crime, Drama",
      image:
        "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=500",
      description: "Batman faces his greatest challenge in the Joker.",
    },
    {
      id: 5,
      name: "Inception",
      year: 2010,
      rating: 8.8,
      genre: "Sci-Fi, Action",
      image:
        "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=500",
      description: "A thief enters people's dreams to steal secrets.",
    },
  ]);
  return (
    <movieContext.Provider value={{ movies }}>{children}</movieContext.Provider>
  );
};

export default MovieProvider;
