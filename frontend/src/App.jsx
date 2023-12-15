import { useState } from "react";
import NavBar from "./NavBar/NavBar";
import Footer from "./Footer/Footer";
import Banner from "./Banner/Banner";
// import AddDevice from "./AddDevice/AddDevice";
import "./App.css";

function App() {
  const [count, setCount] = useState(5);

  return (
    <>
      <NavBar />
      <Banner />
      <div className="card">
        <h1>We cool?</h1>

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
      <Footer />
    </>
  );
}

export default App;
