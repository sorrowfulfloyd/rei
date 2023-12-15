import "./AddDevice.css";

export default function AddDevice() {
  return (
    <form action="POST" id="addDeviceForm" onSubmit={POSTdevice}>
      <h1>Add a device</h1>
      <div id="container">
        <span id="deviceInfo">
          <h2>Device info</h2>
          <label htmlFor="deviceType">Device type: </label>
          <input
            type="text"
            name="deviceType"
            id=""
            placeholder="Device type"
            required
          />
          <label htmlFor="make">Brand: </label>
          <input type="text" name="make" id="" placeholder="Brand" required />
          <label htmlFor="model">Model: </label>
          <input type="text" name="model" id="" placeholder="Model" required />
          <label htmlFor="problem">Problem: </label>
          <textarea
            name="problem"
            id=""
            cols="18"
            rows="2"
            placeholder="Describe the problem.."
            required
          ></textarea>
          <label htmlFor="note">Additional Notes: </label>
          <textarea
            name="note"
            id=""
            cols="18"
            rows="2"
            placeholder="Additional notes.."
          ></textarea>
          <label htmlFor="accessories">Accessories: </label>
          <input
            type="text"
            name="accessories"
            id=""
            placeholder="Accessories"
          />
          <span>
            <input type="checkbox" name="workingRadio" id="" /> Is it working?
          </span>
          <span>
            <input type="checkbox" name="warrantyRadio" id="" />
            Does it have warranty?
          </span>
        </span>
        <div id="customerInfo">
          <h2>Customer Info</h2>
          <label htmlFor="customerName">Name: </label>
          <input
            type="text"
            name="customerName"
            id=""
            placeholder="Customer name"
            required
          />
          <label htmlFor="custormerPhone">Phone number: </label>
          <input
            type="tel"
            name="customerPhone"
            id=""
            placeholder="Customer phone"
            required
          />
          <span>
            <input type="checkbox" name="wantNotif" id="" defaultChecked />{" "}
            Wants notifications about device status?
          </span>
          <span>
            <input type="checkbox" name="wantAds" id="" defaultChecked /> Wants
            advertisements in the future?
          </span>
        </div>
      </div>
      <button type="submit" form="addDeviceForm">
        Submit
      </button>
    </form>
  );
}

function POSTdevice(e) {
  e.preventDefault();
  fetch("http://localhost:3000/devices", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      token: document.cookie.slice(6),
    },
    body: JSON.stringify({
      device_type: document.forms["addDeviceForm"]["deviceType"].value,
      brand: document.forms["addDeviceForm"]["make"].value,
      model: document.forms["addDeviceForm"]["model"].value,
      problem: document.forms["addDeviceForm"]["problem"].value,
      accessories: document.forms["addDeviceForm"]["accessories"].value,
      note: document.forms["addDeviceForm"]["note"].value,
      isWorking: document.forms["addDeviceForm"]["workingRadio"].checked,
      hasWarranty: document.forms["addDeviceForm"]["warrantyRadio"].checked,
      customerName: document.forms["addDeviceForm"]["customerName"].value,
      customerPhone: document.forms["addDeviceForm"]["customerPhone"].value,
      notif: document.forms["addDeviceForm"]["wantNotif"].checked,
      ads: document.forms["addDeviceForm"]["wantAds"].checked,
    }),
  })
    .then((response) => {
      if (response.status === 200) {
        alert("Device added");
        document.forms["addDeviceForm"].reset();
      } else {
        alert(
          `Something went wrong\n${response.status} - ${response.statusText}`
        );
      }
    })
    .catch((error) => {
      console.log(error);
      alert(`Something went wrong. Check the console.\n${error}`);
    });
}
