import { useState } from "react";

function Task3() {
  const [dark, setDark] = useState(false);

  return (
    <div className={dark ? "card dark" : "card"}>
      <h2>Theme Toggle</h2>

      <button onClick={() => setDark(!dark)}>
        {dark ? "Light Mode" : "Dark Mode"}
      </button>
    </div>
  );
}

export default Task3;