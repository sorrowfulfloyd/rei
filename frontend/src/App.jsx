import { useState } from "react";
import "./App.css";

function App() {
  const [count, setCount] = useState(5);

  return (
    <>
      <h1>We cool?</h1>
      <div className="card">
        <button
          onClick={() => {
            count > 1
              ? setCount((count) => --count)
              : setCount((count) => (count += 4));
          }}
        >
          We cool. {count}
        </button>
      </div>
    </>
  );
}

export default App;
