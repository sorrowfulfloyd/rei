import { useState, useEffect } from "react";
import NavBar from "./NavBar/NavBar";
import Footer from "./Footer/Footer";
import Banner from "./Banner/Banner";
import AddDevice from "./AddDevice/AddDevice";
import ListAllDevices from "./ListAllDevices/ListAllDevices";
import ListCustomers from "./ListCustomers/ListCustomers";
import Auth from "./Auth/Auth";
import "./App.css";

export default function App() {
  const [hasAuth, setAuth] = useState(true);

  const handleAuth = () => {
    setAuth(true);
  };

  const [isAddDeviceVisible, setAddDeviceVisibility] = useState(false);

  const toggleAddDevice = () => {
    setAddDeviceVisibility((prev) => !prev);
    setAllDevicesVisibility(false);
    setCustomersVisibility(false);
  };

  const [isAllDevicesVisible, setAllDevicesVisibility] = useState(false);

  const toggleAllDevices = () => {
    setAllDevicesVisibility((prev) => !prev);
    setAddDeviceVisibility(false);
    setCustomersVisibility(false);
  };

  const [isCustomersVisible, setCustomersVisibility] = useState(false);

  const toggleCustomers = () => {
    setCustomersVisibility((prev) => !prev);
    setAddDeviceVisibility(false);
    setAllDevicesVisibility(false);
  };

  useEffect(() => {
    fetch(process.env.API_URL + "/auth/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        token: document.cookie.slice(6),
      },
    })
      .then((response) => {
        if (response.ok) {
          setAuth(true);
        } else {
          setAuth(false);
        }
      })
      .catch((error) => {
        console.log(error);
        alert(`Something went wrong. Check the console.\n${error}`);
        setAuth(false);
      });
  }, []);

  return hasAuth ? (
    <>
      <NavBar />
      <Banner
        showAddDevice={toggleAddDevice}
        showAllDevices={toggleAllDevices}
        showCustomers={toggleCustomers}
      />
      {isAddDeviceVisible && (
        <AddDevice hideAddDevice={setAddDeviceVisibility} />
      )}
      {isAllDevicesVisible && (
        <ListAllDevices hideAllDevices={setAllDevicesVisibility} />
      )}
      {isCustomersVisible && (
        <ListCustomers hideCustomers={setCustomersVisibility} />
      )}
      <Footer />
    </>
  ) : (
    <Auth onRedirect={handleAuth} />
  );
}
