import { useRef, useEffect, useState } from "react";
import "./AddDevice.css";

export default function AddDevice({ hideAddDevice }) {
	const [displayTextbox, setDisplay] = useState();
	const [defaultOwner, setDefaultOwner] = useState(true);

	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [fetchAgain, setFetch] = useState(false);

	const [ownerList, setOwnerList] = useState();
	const [selectedOwner, setSelectedOwner] = useState();

	useEffect(() => {
		if (fetchAgain) {
			fetch(
				process.env.API_URL +
				"/customers?" +
				new URLSearchParams({
					fields: "name,phone,devices",
				}),
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						token: document.cookie.slice(6),
					},
				},
			)
				.then((response) => {
					if (response.ok) {
						setError(null);
						console.log("DBG - Response payload:", response);
						console.log(response);
						return response.json();
					}
					throw response;
				})
				.then((actualData) => {
					setOwnerList(actualData.message);
					setSelectedOwner(
						actualData.message[0]._id ? actualData.message[0]._id : null,
					);
					console.log("DBG - Response data:", ownerList);
				})
				.catch((err) => {
					setError(err.status + " - " + err.statusText);
				})
				.finally(() => {
					setLoading(false);
					setFetch(false);
				});
		}
	}, [fetchAgain, ownerList]);

	function POSTdevice(e) {
		e.preventDefault();
		if (defaultOwner) {
			fetch(process.env.API_URL + "/devices", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					token: document.cookie.slice(6),
				},
				body: JSON.stringify({
					deviceInfo: {
						device_type:
							document.forms[0]["deviceType"].value === "Other"
								? document.forms[0][2].value
								: document.forms[0]["deviceType"].value,
						brand: document.forms[0]["make"].value,
						model: document.forms[0]["model"].value,
						problem: document.forms[0]["problem"].value,
						note: document.forms[0]["note"].value,
						accessories: document.forms[0]["accessories"].value,
						isWorking: document.forms[0]["workingRadio"].checked,
						hasWarranty: document.forms[0]["warrantyRadio"].checked,
						calendarStart: new Date(),
						calendarEnd: new Date(
							new Date().setHours(new Date().getHours() + 4),
						),
					},
					customerInfo: {
						name: document.forms[0]["customerName"].value,
						phone: document.forms[0]["customerPhone"].value,
						notif: document.forms[0]["wantNotif"].checked,
						ads: document.forms[0]["wantAds"].checked,
					},
				}),
			})
				.then((response) => {
					if (response.ok) {
						alert("Device added");
						return response.json();
					}
					alert(
						`Something went wrong\n${response.status} - ${response.statusText}`,
					);
				})
				.then((data) => {
					console.log(data); // for debug - delete this later
				})
				.catch((error) => {
					console.log(error);
					alert(`Something went wrong. Check the console.\n${error}`);
				})
				.finally(() => {
					document.forms["addDeviceForm"].reset();
					setDisplay(false);
				});
		} else if (selectedOwner) {
			fetch(process.env.API_URL + "/devices", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					token: document.cookie.slice(6),
				},
				body: JSON.stringify({
					deviceInfo: {
						device_type:
							document.forms[0]["deviceType"].value === "Other"
								? document.forms[0][2].value
								: document.forms[0]["deviceType"].value,
						brand: document.forms[0]["make"].value,
						model: document.forms[0]["model"].value,
						problem: document.forms[0]["problem"].value,
						note: document.forms[0]["note"].value,
						accessories: document.forms[0]["accessories"].value,
						isWorking: document.forms[0]["workingRadio"].checked,
						hasWarranty: document.forms[0]["warrantyRadio"].checked,
						calendarStart: new Date(),
						calendarEnd: new Date(),
					},
					id: selectedOwner,
				}),
			})
				.then((response) => {
					if (response.ok) {
						alert("Device added");
						return response.json();
					}
					alert(
						`Something went wrong\n${response.status} - ${response.statusText}`,
					);
				})
				.then((data) => {
					console.log(data); // for debug - delete this later
				})
				.catch((error) => {
					console.log(error);
					alert(`Something went wrong. Check the console.\n${error}`);
				})
				.finally(() => {
					document.forms["addDeviceForm"].reset();
					setDisplay(false);
				});
		} else {
			alert("No existing owner in the database");
			document.forms["addDeviceForm"].reset();
		}
	}

	const renderOwnerList = () => {
		return ownerList.map((owner, index) => (
			<option id={owner._id} key={owner._id} value={owner._id}>
				Name: {owner.name} Phone: {owner.phone} #{index + 1}
			</option>
		));
	};

	return (
		<form action="POST" id="addDeviceForm" onSubmit={POSTdevice}>
			<div id="wrapper">
				<div id="top-header">
					<button
						type="button"
						id="close"
						onClick={(e) => {
							hideAddDevice();
							e.preventDefault();
						}}
					>
						X
					</button>
					<h1>ADD A DEVICE</h1>
				</div>
				<div id="infoContainer">
					<div id="deviceInfo">
						<h2>Device</h2>
						<h3>Type</h3>
						<div id="device-type">
							<select
								name="deviceType"
								onClick={(e) => {
									e.target.value === "Other"
										? setDisplay(true)
										: setDisplay(false);
								}}
							>
								<option value="Laptop">Laptop</option>
								<option value="TV">TV</option>
								<option value="Phone">Phone</option>
								<option value="Other">Other</option>
							</select>
							{displayTextbox && (
								<input
									type="text"
									name="deviceTypeField"
									className="form-field a1"
									placeholder="Device Type"
									required
								/>
							)}
						</div>
						<h3>Make & Model</h3>
						<div id="device-info">
							<input
								type="text"
								name="make"
								className="form-field a1"
								placeholder="Brand"
								required
							/>
							<input
								type="text"
								name="model"
								className="form-field a1"
								placeholder="Model"
								required
							/>
						</div>
						<h3>Problem</h3>
						<div id="device-problem">
							<input
								name="problem"
								className="form-field a1"
								placeholder="Describe the fault.."
								required
							/>
							<input
								name="note"
								className="form-field a1"
								placeholder="Additional notes.."
							/>
						</div>
						<h3>Misc</h3>
						<div id="device-misc">
							<input
								type="text"
								name="accessories"
								className="form-field a1"
								placeholder="Accessories"
							/>
							<span>
								<input
									type="checkbox"
									name="workingRadio"
									className="form-radio"
								/>{" "}
								Does it recieve power?
							</span>
							<span>
								<input
									type="checkbox"
									name="warrantyRadio"
									className="form-radio"
								/>
								Does it have warranty?
							</span>
						</div>
					</div>

					<div id="customerInfo">
						<h2>Customer</h2>
						<div id="customerSelector">
							<span>
								<input
									type="radio"
									name="checker"
									className="form-radio"
									defaultChecked
									onChange={() => {
										setDefaultOwner(true);
									}}
								/>
								New
							</span>
							<span>
								<input
									type="radio"
									name="checker"
									className="form-radio"
									onChange={() => {
										setFetch(true);
										setDefaultOwner(false);
									}}
								/>
								Existing
							</span>
						</div>
						{defaultOwner ? (
							<div id="newCustomerInfo">
								<h3>Contact</h3>
								<input
									type="text"
									name="customerName"
									className="form-field a1"
									placeholder="Name"
									required
								/>
								<input
									type="tel"
									name="customerPhone"
									className="form-field a1"
									placeholder="Phone"
									required
								/>
								<span>
									<input
										type="checkbox"
										name="wantNotif"
										className="form-radio"
										defaultChecked
									/>
									Notifications about device status?
								</span>
								<span>
									<input
										type="checkbox"
										name="wantAds"
										className="form-radio"
										defaultChecked
									/>
									Advertisements in the future?
								</span>
							</div>
						) : (
							<div id="newCustomerInfo">
								<select
									name="ownerList"
									onChange={(e) => {
										setSelectedOwner(e.target.value);
									}}
								>
									{error ? <p>Error</p> : !loading && renderOwnerList()}
								</select>
							</div>
						)}
						<div id="device-button">
							<button type="submit" id="deviceSubmitForm" form="addDeviceForm">
								SUBMIT
							</button>
						</div>
					</div>
				</div>
			</div>
		</form>
	);
}
