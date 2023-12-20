import "./Banner.css";

export default function Banner({
  showAddDevice,
  showAllDevices,
  showCustomers,
}) {
  return (
    <div className="container">
      <div className="welcome">
        <h1>Welcome, wary traveller!</h1>
      </div>
      <div className="buttons">
        <button
          onClick={() => {
            showAddDevice();
          }}
        >
          Add a device
        </button>
        <button
          onClick={() => {
            showAllDevices();
          }}
        >
          List all devices
        </button>
        <button
          onClick={() => {
            showCustomers();
          }}
        >
          List all customers
        </button>
      </div>
    </div>
  );
}
