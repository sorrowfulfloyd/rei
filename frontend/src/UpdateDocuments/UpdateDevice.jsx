import React, { useEffect, useState } from "react";
import "./Modal.css";

function UpdateDevice({ toggleModal, device }) {
	const [data, setData] = useState();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [fetchStatus, setFetchStatus] = useState(true);

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
									<div id="conta">
										<span id="de">
											<label htmlFor="deviceType">Device type: </label>
											<input
												type="text"
												name="deviceType"
												id=""
												defaultValue={data.device_type}
												required
											/>
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
