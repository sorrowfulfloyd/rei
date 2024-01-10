import React, { useEffect, useState } from "react";
import "./Modal.css";

function UpdateDevice({ toggleModal, device }) {
	const [data, setData] = useState();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [fetchStatus, setFetchStatus] = useState(true);
	const [displayTextbox, setDisplay] = useState();

	function POSTdevice(e) {
		e.preventDefault();
		fetch(
			"http://localhost:3000/devices?" +
				new URLSearchParams({
					id: device,
				}),
			{
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
					token: document.cookie.slice(6),
				},
				body: JSON.stringify({
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
				}),
			},
		)
			.then((response) => {
				if (response.ok) {
					console.log(fetchStatus);
					alert("Device updated");
					return response.json();
				}
				throw response;
			})
			.then((data) => {
				console.log(data); // for debug - delete this later
			})
			.catch((error) => {
				console.log(error);
				alert(`Something went wrong. Check the console.\n${error}`);
			})
			.finally(() => {
				setFetchStatus(true);
			});
	}

	useEffect(() => {
		if (fetchStatus) {
			fetch(
				"http://localhost:3000/devices?" +
					new URLSearchParams({
						id: device,
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
						return response.json();
					}
					throw response;
				})
				.then((actualData) => {
					setData(actualData.message);
					console.log("DBG - Response data:", actualData.message);
				})
				.catch((err) => {
					setError(err);
				})
				.finally(() => {
					setLoading(false);
					setFetchStatus(false);
				});
		}
	}, [device, fetchStatus]);
	return (
		<>
			<div className="modal">
				<div onClick={toggleModal} className="overlay"></div>
				<div className="modal-content">
					{loading ? (
						<p>Loading...</p>
					) : (
						<>
							{error && (
								<p>{`There was a problem fething the data -> ${error}`}</p>
							)}
							{data && (
								<form action="POST" id="updateDeviceForm" onSubmit={POSTdevice}>
									<button
										type="button"
										id="close"
										onClick={(e) => {
											toggleModal();
											e.preventDefault();
										}}
									>
										X
									</button>
									<h1>Update device info</h1>
									<div id="updateDeviceContainer">
										<span id="de">
											<label htmlFor="deviceType">Device type: </label>
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
													id=""
													placeholder="Device Type"
													required
												/>
											)}{" "}
											<label htmlFor="make">Brand: </label>
											<input
												type="text"
												name="make"
												id=""
												defaultValue={data.brand}
												required
											/>
											<label htmlFor="model">Model: </label>
											<input
												type="text"
												name="model"
												id=""
												defaultValue={data.model}
												required
											/>
											<label htmlFor="problem">Problem: </label>
											<textarea
												name="problem"
												id=""
												cols="18"
												rows="2"
												defaultValue={data.problem}
												required
											/>
											<label htmlFor="note">Additional Notes: </label>
											<textarea
												name="note"
												id=""
												cols="18"
												rows="2"
												defaultValue={data.note}
											/>
											<label htmlFor="accessories">Accessories: </label>
											<input
												type="text"
												name="accessories"
												id=""
												defaultValue={data.accessories}
											/>
											<span>
												<input
													type="checkbox"
													name="workingRadio"
													id=""
													defaultChecked={data.isWorking}
												/>{" "}
												Is it working?
											</span>
											<span>
												<input
													type="checkbox"
													name="warrantyRadio"
													id=""
													defaultChecked={data.hasWarranty}
												/>
												Does it have warranty?
											</span>
										</span>
									</div>
									<button type="submit" form="updateDeviceForm">
										SUBMIT
									</button>
								</form>
							)}
						</>
					)}
				</div>
			</div>
		</>
	);
}

export default UpdateDevice;
