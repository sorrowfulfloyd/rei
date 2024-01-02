import { useEffect, useState } from "react";
import "./ListAllDevices.css";

export default function ListAllDevices() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3000/devices", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        token: document.cookie.slice(6),
      },
    })
    .then((response) => {
      if (response.ok) {
        setError(null);
        console.log(response);
        return response.json();
      }
      throw response;
    })
    .then(actualData => {
      setData(actualData.devices);
      console.log(actualData.devices)
    })
    .catch(err =>  {
      setError(err);
    })
    .finally(() => {
      setLoading(false);
    })
    },[]);
  
  const renderData = () => {
    return data.map((device) => (
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
    ))
  };

  return (
    <div id="containerx">
      {loading ? <p>Loading...</p>
        : (<table>
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
            {error && <p>{`There was a problem with fetching the data - ${error}`}</p>}
            {data && <tbody id="deviceList">
              {renderData()}
            </tbody>}
        </table>)
      }
    </div>
  );
}

