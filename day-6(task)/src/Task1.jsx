import { useState } from "react";

function Task1() {
  const [count, setCount] = useState(0);

  return (
    <div className="card">
      <h2>Counter App</h2>
      <h3>{count}</h3>

      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>

      <button onClick={() => setCount(count - 1)}>
        Decrement
      </button>

      <button onClick={() => setCount(0)}>
        Reset
      </button>
    </div>
  );
}

export default Task1;