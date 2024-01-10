import "./AddDevice.css";

export default function AddDevice({ hideAddDevice }) {
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
					<input
						type="text"
						name="deviceType"
						id=""
						placeholder="Device type"
						required
					/>
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
				device_type: document.forms[0][1].value,
				brand: document.forms[0][2].value,
				model: document.forms[0][3].value,
				problem: document.forms[0][4].value,
				note: document.forms[0][5].value,
				accessories: document.forms[0][6].value,
				isWorking: document.forms[0][7].checked,
				hasWarranty: document.forms[0][8].checked,
			},
			customerInfo: {
				name: document.forms[0][9].value,
				phone: document.forms[0][10].value,
				notif: document.forms[0][11].checked,
				ads: document.forms[0][12].checked,
			},
		}),
	})
		.then((response) => {
			if (response.status === 200) {
				alert("Device added");
				document.forms[0].reset();
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
		});
}
