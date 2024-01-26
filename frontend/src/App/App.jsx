import { useState, useEffect, Fragment } from "react";

import NavBar from "./NavBar/NavBar";
import Footer from "./Footer/Footer";
import Banner from "./Banner/Banner";
import AddDevice from "./AddDevice/AddDevice";
import ListAllDevices from "./ListAllDevices/ListAllDevices";
import ListCustomers from "./ListCustomers/ListCustomers";
import Auth from "./Auth/Auth";
import Scheduler from "./Scheduler/Scheduler";
import Home from "./Home/Home";

import "./App.css";

export default function App() {
	const [hasAuth, setAuth] = useState(true);

	const handleAuth = () => {
		setAuth(true);
	};

	const [isHomeVisible, setHomeVisibility] = useState(true);

	const toggleHome = () => {
		setHomeVisibility(true);
		setAddDeviceVisibility(false);
		setAllDevicesVisibility(false);
		setCustomersVisibility(false);
		setCalendarVisibility(false);
	};

	const [isAddDeviceVisible, setAddDeviceVisibility] = useState(false);

	const toggleAddDevice = () => {
		setAddDeviceVisibility((prev) => !prev);
		setHomeVisibility(false);
		setAllDevicesVisibility(false);
		setCustomersVisibility(false);
		setCalendarVisibility(false);
	};

	const [isAllDevicesVisible, setAllDevicesVisibility] = useState(false);

	const toggleAllDevices = () => {
		setAllDevicesVisibility((prev) => !prev);
		setHomeVisibility(false);
		setAddDeviceVisibility(false);
		setCustomersVisibility(false);
		setCalendarVisibility(false);
	};

	const [isCustomersVisible, setCustomersVisibility] = useState(false);

	const toggleCustomers = () => {
		setCustomersVisibility((prev) => !prev);
		setHomeVisibility(false);
		setAddDeviceVisibility(false);
		setAllDevicesVisibility(false);
		setCalendarVisibility(false);
	};

	const [isCalendarVisible, setCalendarVisibility] = useState(false);

	const toggleCalendar = () => {
		setCalendarVisibility((prev) => !prev);
		setHomeVisibility(false);
		setAddDeviceVisibility(false);
		setAllDevicesVisibility(false);
		setCustomersVisibility(false);
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
				alert(`Couldn't connect to server to verify user is legit\n${error}`);
				setAuth(false);
			});
	}, []);

	return hasAuth ? (
		<Fragment>
			<NavBar />
			<Banner
				showHome={toggleHome}
				showAddDevice={toggleAddDevice}
				showAllDevices={toggleAllDevices}
				showCustomers={toggleCustomers}
				showCalendar={toggleCalendar}
			/>
			{isHomeVisible && <Home hideHome={setHomeVisibility} />}
			{isAddDeviceVisible && (
				<AddDevice hideAddDevice={setAddDeviceVisibility} />
			)}
			{isAllDevicesVisible && (
				<ListAllDevices hideAllDevices={setAllDevicesVisibility} />
			)}
			{isCustomersVisible && (
				<ListCustomers hideCustomers={setCustomersVisibility} />
			)}
			{isCalendarVisible && <Scheduler hideCalendar={setCalendarVisibility} />}
			<Footer />
		</Fragment>
	) : (
		<Auth onRedirect={handleAuth} />
	);
}
