import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./components/Home";
import About from "./components/About";
import Contact from "./components/Contact";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <div className="nav">
        <Link to="/"></Link>
        <Link to="/about"></Link>
        <Link to="/contact"></Link>
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
