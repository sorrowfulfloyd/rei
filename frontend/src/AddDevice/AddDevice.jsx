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
					setError(err);
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
				<div id="deviceInfo">
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
				</div>

				<div id="customerInfo">
					<h2>Customer Info</h2>
					<span>
						<input
							type="radio"
							name="checker"
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
							onChange={() => {
								setFetch(true);
								setDefaultOwner(false);
							}}
						/>
						Existing
					</span>
					{defaultOwner ? (
						<div id="customerInfo">
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
								<input type="checkbox" name="wantAds" id="" defaultChecked />{" "}
								Wants advertisements in the future?
							</span>
						</div>
					) : (
						<select
							name="ownerList"
							onChange={(e) => {
								setSelectedOwner(e.target.value);
							}}
						>
							{error ? <p>Error</p> : !loading && renderOwnerList()}
						</select>
					)}
				</div>
			</div>

			<button type="submit" form="addDeviceForm">
				SUBMIT
			</button>
			{console.log(process.env.API_URL)}
		</form>
	);
}
