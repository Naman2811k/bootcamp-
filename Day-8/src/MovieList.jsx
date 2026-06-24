import { useContext } from "react";
import { movieContext } from "./MovieProvider";

const MovieList = () => {
  const { movies } = useContext(movieContext);
  return (
    <div>
      {movies.map((movie) => {
        return (
          <div key={movie.name}>
            <h1>{movie.name}</h1>
            <h3>Year:{movie.year}</h3>
            <h3>Rating:{movie.rating}</h3>
            <img src={movie.image} alt="" />
          </div>
        );
      })}
    </div>
  );
};

export default MovieList;
