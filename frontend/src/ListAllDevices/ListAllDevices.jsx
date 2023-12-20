import { useEffect, useState } from "react";
import "./ListAllDevices.css";

export default function ListAllDevices() {
  const [result, setResult] = useState(false);
  const [devices, setDevices] = useState();

  useEffect(() => {
    fetch("http://localhost:3000/devices", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        token: document.cookie.slice(6),
      },
    })
      .then((response) => {
        if (response.status === 200) {
          response
            .json()
            .then((result) => {
              setDevices(result.devices);
              console.table(result.devices);
              setResult(true);
            })
            .catch((err) => {
              setResult(`ERROR1: ${err}`);
            });
        } else {
          setResult(`Error!  ${response.status} - ${response.body}`);
        }
      })
      .catch((error) => {
        console.log(error);
        setResult(`ERROR! -> ${error}`);
      });
  }, []);

  const renderRows = () => {
    return devices.map((device) => (
      <tr key={device._id}>
        <td>{device.device_type}</td>
        <td>{device.status}</td>
        <td>{device.brand}</td>
        <td>{device.model}</td>
        <td>{device.accessories}</td>
        <td>{device.problem}</td>
        <td>{device.note}</td>
        <td>{device.isWorking ? "Yes" : "No"}</td>
        <td>{device.hasWarranty ? "Yes" : "No"}</td>
        <td>{device.notif ? "Yes" : "No"}</td>
        <td>{device.ads ? "Yes" : "No"}</td>
        <td>{device.acceptDate}</td>
      </tr>
    ));
  };

  return (
    <div id="containerx">
      {result ? (
        <table>
          <thead>
            <tr>
              <th>Device Type</th>
              <th>Status</th>
              <th>Brand</th>
              <th>Model</th>
              <th>Accessories</th>
              <th>Problem</th>
              <th>Additional Notes</th>
              <th>Was it working?</th>
              <th>Has Warranty?</th>
              <th>Wants Notifications?</th>
              <th>Wants Promotions?</th>
              <th>Accept Date</th>
            </tr>
          </thead>
          <tbody id="deviceList">{renderRows()}</tbody>
        </table>
      ) : (
        "Loading..."
      )}
    </div>
  );
}
