import "./Banner.css";

export default function Banner({
  showHome,
  showAddDevice,
  showAllDevices,
  showCustomers,
  showCalendar,
}) {
  return (
    <div className="banner">
      <div className="welcome">
        <h1>Welcome</h1>
      </div>
      <div className="buttons">
        <button
          type="button"
          onClick={() => {
            showHome();
          }}
        >
          Home
        </button>
        <button
          type="button"
          onClick={() => {
            showAddDevice();
          }}
        >
          Add Device
        </button>
        <button
          type="button"
          onClick={() => {
            showAllDevices();
          }}
        >
          Devices
        </button>
        <button
          type="button"
          onClick={() => {
            showCustomers();
          }}
        >
          Customers
        </button>
        <button
          type="button"
          onClick={() => {
            showCalendar();
          }}
        >
          Calendar
        </button>
      </div>
    </div>
  );
}
