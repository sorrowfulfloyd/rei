import { useEffect, useState } from "react";
import "./ListCustomers.css";

export default function Customers() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch("http://localhost:3000/devices", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        token: document.cookie.slice(6),
      },
    })
      .then((response) => {
        if(response.ok) {
         setError(null)
         console.log(response)
         return response.json();
        }
        throw response;
      })
      .then(actualData => {
        setData(actualData.devices);
        console.log(actualData.devices);
      })
      .catch(err => {
        setError(err);
      })
      .finally(() => {
        setLoading(false)
      })
  }, []);

  const renderData = () => {
    return data.map((device) => (
      <tr key={device._id}>
        <td>{device.customerName}</td>
        <td>{device.customerPhone}</td>
        <td>{device.acceptDate}</td>
        <td>{}</td>
      </tr>
      ))
  };

  return (
    <div id="containery">
      {loading ? <p>Loading...</p>
        : (<table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Number</th>
              <th>Accept Date</th>
              <th># of Devices</th>
            </tr>
          </thead>
          {error && <p>{`There was a problem with fetching the data - ${error}`}</p>}
          {data && <tbody id="deviceList">
            {renderData()}
          </tbody>}
        </table>
      )}
    </div>
  );
}
