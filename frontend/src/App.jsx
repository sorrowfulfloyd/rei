import { useState } from "react";
import NavBar from "./NavBar/NavBar";
import Footer from "./Footer/Footer";
import Banner from "./Banner/Banner";
import AddDevice from "./AddDevice/AddDevice";
import ListAllDevices from "./ListAllDevices/ListAllDevices";
import ListCustomers from "./ListCustomers/ListCustomers";
import "./App.css";

function App() {
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

  return (
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
  );
}

export default App;
