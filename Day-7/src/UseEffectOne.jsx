import { useEffect, useState } from "react";

const UseEffectOne = () => {
  const [count, setCount] = useState(0);
  const [count2, setCount2] = useState(0);

  useEffect(() => {
    //side Effect
    alert('Button Pressed')
  }, [count]); //Dependancy Array

  return (
    <div>
      <h1>Counter - 1 (Alert):{count}</h1>
      <button
        onClick={() => {
          setCount(count + 1);
        }}
      >
        Change
      </button>
      <h1>Counter - 2 (Non-Alert):{count2}</h1>
      <button
        onClick={() => {
          setCount2(count2 + 1);
        }}
      >
        Change
      </button>
    </div>
  );
};

export default UseEffectOne;
