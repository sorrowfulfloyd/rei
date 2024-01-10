import { useState } from "react";
import "./AddDevice.css";

export default function AddDevice({ hideAddDevice }) {
	const [displayTextbox, setDisplay] = useState();

	function POSTdevice(e) {
		e.preventDefault();
		fetch("http://localhost:3000/devices", {
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
	}

	return (
		<form action="POST" id="addDeviceForm" onSubmit={POSTdevice}>
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
			<h1>Add a device</h1>
			<div id="container">
				<span id="deviceInfo">
					<h2>Device info</h2>
					<label htmlFor="deviceType">Device type: </label>
					<select
						name="deviceType"
						onClick={(e) => {
							e.target.value === "Other" ? setDisplay(true) : setDisplay(false);
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
							id=""
							placeholder="Device Type"
							required
						/>
					)}
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
					/>
					<label htmlFor="note">Additional Notes: </label>
					<textarea
						name="note"
						id=""
						cols="18"
						rows="2"
						placeholder="Additional notes.."
					/>
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
				SUBMIT
			</button>
		</form>
	);
}
