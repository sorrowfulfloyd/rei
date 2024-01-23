import "./Banner.css";

export default function Banner({
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
        <button
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
