import MovieList from "./MovieList"
import MovieProvider from "./MovieProvider"

const App = () => {
  return (
    <div>
      <MovieProvider>
        <MovieList />
      </MovieProvider>
    </div>
  )
}

export default App
