import { useState } from "react";

function Task4() {
  const [show, setShow] = useState(false);

  return (
    <div className="card">
      <h2>Password Toggle</h2>

      <input
        type={show ? "text" : "password"}
        placeholder="Password"
      />

      <button onClick={() => setShow(!show)}>
        {show ? "Hide" : "Show"}
      </button>
    </div>
  );
}

export default Task4;