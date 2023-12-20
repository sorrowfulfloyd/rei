import { useEffect, useState } from "react";
import "./ListCustomers.css";

export default function Customers() {
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
    // TODO FILTER

    return devices.map((device) => (
      <tr key={device._id}>
        <td>{device.customerName}</td>
        <td>{device.customerPhone}</td>
        <td>{device.acceptDate}</td>
        <td>{}</td>
      </tr>
    ));
  };

  return (
    <div id="containery">
      {result ? (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Number</th>
              <th>Accept Date</th>
              <th>Number of devices we have of them</th>
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
