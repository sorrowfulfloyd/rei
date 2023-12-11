import { useState } from "react";
import "./App.css";
import NavBar from "./navbar/NavBar";

function App() {
  const [count, setCount] = useState(5);

  return (
    <>
      <NavBar />
      <div className="card">
        <h1>We cool?</h1>
        <p>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quas commodi
          aut exercitationem voluptatum, voluptate quaerat nisi placeat
          quibusdam qui praesentium! Labore eligendi nam cum. Tempora aliquam
          natus sint quia suscipit.
        </p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio quos
          inventore laboriosam assumenda ullam rem ut, iusto corrupti obcaecati,
          cupiditate aperiam sapiente velit exercitationem autem labore officiis
          similique voluptatem qui?
        </p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio quos
          inventore laboriosam assumenda ullam rem ut, iusto corrupti obcaecati,
          cupiditate aperiam sapiente velit exercitationem autem labore officiis
          similique voluptatem qui?
        </p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio quos
          inventore laboriosam assumenda ullam rem ut, iusto corrupti obcaecati,
          cupiditate aperiam sapiente velit exercitationem autem labore officiis
          similique voluptatem qui?
        </p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio quos
          inventore laboriosam assumenda ullam rem ut, iusto corrupti obcaecati,
          cupiditate aperiam sapiente velit exercitationem autem labore officiis
          similique voluptatem qui?
        </p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio quos
          inventore laboriosam assumenda ullam rem ut, iusto corrupti obcaecati,
          cupiditate aperiam sapiente velit exercitationem autem labore officiis
          similique voluptatem qui?
        </p>
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
