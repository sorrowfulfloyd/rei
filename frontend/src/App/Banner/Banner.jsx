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
          Add a device
        </button>
        <button
          type="button"
          onClick={() => {
            showAllDevices();
          }}
        >
          List all devices
        </button>
        <button
          type="button"
          onClick={() => {
            showCustomers();
          }}
        >
          List all customers
        </button>
        <button
          type="button"
          onClick={() => {
            showCalendar();
          }}
        >
          Show Calendar
        </button>
      </div>
    </div>
  );
}
