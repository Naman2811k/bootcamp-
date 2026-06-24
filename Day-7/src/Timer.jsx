import { useEffect, useState } from "react";

const Timer = () => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const intervalId = Math.random().toString(32).slice(2, 7);
    console.log("Creating Interval", intervalId);
    const interval = setInterval(() => {
      setCount((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div>
      <h1>{count}</h1>
    </div>
  );
};

export default Timer;
