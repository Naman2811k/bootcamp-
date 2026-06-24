import { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <>
      <nav>
        <Link to="/contact" className="contact nav-link">
          <h2>Contact</h2>
        </Link>
        <Link to="/" className="home nav-link">
          <h2>Home</h2>
        </Link>
        <div
          onClick={() => {
            setNavOpen(!navOpen);
          }}
          className="menu nav-link"
        >
          <div className="hamburger">
            <>
              <div
                style={{
                  transform: navOpen
                    ? "rotate(45deg)  translateX(7px)"
                    : "rotate(0deg)",
                }}
                className="line-1 line"
              ></div>
              <div
                style={{
                  transform: navOpen
                    ? "rotate(-45deg) translateX(7px)"
                    : "rotate(0deg)",
                }}
                className="line-2 line"
              ></div>
              <div
                style={{
                  opacity: navOpen ? "0" : "1",
                }}
                className="line-3 line"
              ></div>
            </>
          </div>
        </div>
      </nav>
      <div
        style={{
          transform: navOpen ? "translateY(0)" : "translateY(-100%)",
        }}
        className="bignav"
      >
        <div className="bignav-content">
          <Link onClick={() => setNavOpen(false)} to="/" className="big-link">
            <h1>Home</h1>
          </Link>

          <Link
            onClick={() => setNavOpen(false)}
            to="/contact"
            className="big-link"
          >
            <h1>Contact</h1>
          </Link>

          <Link
            onClick={() => setNavOpen(false)}
            to="/about"
            className="big-link"
          >
            <h1>About</h1>
          </Link>

          <Link
            onClick={() => setNavOpen(false)}
            to="/project"
            className="big-link"
          >
            <h1>Projects</h1>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Navbar;
