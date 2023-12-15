import "./Banner.css";

export default function Banner() {
  return (
    <div className="container">
      <div className="welcome">
        <h1>Welcome, wary traveller!</h1>
      </div>
      <div className="buttons">
        <button>Add a device</button>
        <button>List all devices</button>
        <button>List all customers</button>
      </div>
    </div>
  );
}
