import { useEffect, useState } from "react";

const Window = () => {
  const [window, setWindow] = useState(window.screen.width);

  function updateWidth() {
    setWindow(window.innerWidth);
  }

  useEffect(() => {
    window.addEventListener("resize", updateWidth);
    return () => {
        window.removeEventListener("resize", updateWidth);
    };
  }, []);

  return <div>{window}</div>;
};

export default Window;
