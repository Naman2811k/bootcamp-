import { useState } from "react";

function Task2() {
  const [name, setName] = useState("");

  return (
    <div className="card">
      <h2>Form Handling</h2>

      <input
        type="text"
        placeholder="Enter Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <p>Name: {name}</p>
    </div>
  );
}

export default Task2;