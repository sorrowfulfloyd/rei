import { useState, useEffect, Fragment } from "react";
import NavBar from "./NavBar/NavBar";
import Footer from "./Footer/Footer";
import Banner from "./Banner/Banner";
import AddDevice from "./AddDevice/AddDevice";
import ListAllDevices from "./ListAllDevices/ListAllDevices";
import ListCustomers from "./ListCustomers/ListCustomers";
import Auth from "./Auth/Auth";
import Scheduler from "./Scheduler/Scheduler";
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
		setCalendarVisibility(false);
	};

	const [isAllDevicesVisible, setAllDevicesVisibility] = useState(false);

	const toggleAllDevices = () => {
		setAllDevicesVisibility((prev) => !prev);
		setAddDeviceVisibility(false);
		setCustomersVisibility(false);
		setCalendarVisibility(false);
	};

	const [isCustomersVisible, setCustomersVisibility] = useState(false);

	const toggleCustomers = () => {
		setCustomersVisibility((prev) => !prev);
		setAddDeviceVisibility(false);
		setAllDevicesVisibility(false);
		setCalendarVisibility(false);
	};

	const [isCalendarVisible, setCalendarVisibility] = useState(false);

	const toggleCalendar = () => {
		setCalendarVisibility((prev) => !prev);
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
				showAddDevice={toggleAddDevice}
				showAllDevices={toggleAllDevices}
				showCustomers={toggleCustomers}
				showCalendar={toggleCalendar}
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
			{isCalendarVisible && <Scheduler hideCalendar={setCalendarVisibility} />}
			<Footer />
		</Fragment>
	) : (
		<Auth onRedirect={handleAuth} />
	);
}
