import React, { useEffect, useState } from "react";
import "./Modal.css";

function UpdateCustomer({ toggleModal, customer }) {
	const [data, setData] = useState();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [fetchStatus, setFetchStatus] = useState(true);
	const [customerDevices, setCustomerDevices] = useState();

	function POSTcustomer(e) {
		e.preventDefault();
		console.log("test");
		fetch(
			"http://localhost:3000/customers?" +
			new URLSearchParams({
				id: customer,
			}),
			{
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
					token: document.cookie.slice(6),
				},
				body: JSON.stringify({
					name: document.forms[0]["name"].value,
					phone: document.forms[0]["phone"].value,
					notif: document.forms[0]["notif"].checked,
					ads: document.forms[0]["ads"].checked,
				}),
			},
		)
			.then((response) => {
				if (response.ok) {
					console.log(fetchStatus);
					alert("Customer updated");
					return response.json();
				}
				throw response;
			})
			.then((data) => {
				console.log(data); // for debug - delete this later
			})
			.catch((error) => {
				console.log(error);
				alert(
					`Something went wrong. Check the console.\n${error.status} - ${error.statusText}`,
				);
			})
			.finally(() => {
				setFetchStatus(true);
			});
	}

	function getCustomerDevices() {
		fetch(
			"http://localhost:3000/devices?" +
			new URLSearchParams({
				owner: customer,
				fields: "status,device_type,brand,model,acceptDate",
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
					return response.json();
				}
				throw response;
			})
			.then((data) => {
				setCustomerDevices(data.message);
				console.log("owner's devices: ", data.message); // for debug - delete this later
			})
			.catch((error) => {
				console.log(error);
				alert(
					`Something went wrong. Check the console.\n${error.status} - ${error.statusText}`,
				);
			});
	}

	useEffect(() => {
		if (fetchStatus) {
			fetch(
				"http://localhost:3000/customers?" +
				new URLSearchParams({
					id: customer,
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
					console.log(err);
					setError(err.status + " " + err.statusText);
				})
				.finally(() => {
					setLoading(false);
					setFetchStatus(false);
					getCustomerDevices();
				});
		}
	}, [customer, fetchStatus]);

	function renderCustomerDevices() {
		return customerDevices.map((device, index) => (
			<div key={index + 10}>
				<p>#{index + 1}</p>
				<p>Accept date: {device.acceptDate}</p>
				<p>Device type: {device.device_type}</p>
				<p>Brand: {device.brand}</p>
				<p>Model: {device.model}</p>
			</div>
		));
	}

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
								<form
									action="POST"
									id="updateCustomerForm"
									onSubmit={POSTcustomer}
								>
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
									<h1>Update customer info</h1>
									<div id="updateDeviceContainer">
										<span id="">
											<label htmlFor="name">Name: </label>
											<input
												type="text"
												name="name"
												id=""
												defaultValue={data.name}
												required
											/>
											<br />
											<label htmlFor="phone">Phone: </label>
											<input
												type="text"
												name="phone"
												id=""
												defaultValue={data.phone}
												required
											/>
											<br />
											<span>
												<input
													type="checkbox"
													name="notif"
													id=""
													defaultChecked={data.notif}
												/>{" "}
												Wants notifications?
											</span>
											<br />
											<span>
												<input
													type="checkbox"
													name="ads"
													id=""
													defaultChecked={data.ads}
												/>
												Wants promotional texts in the future?
											</span>
											<br />
											<br />
											{customerDevices && (
												<div>
													<p>Owned devices:</p>
													{renderCustomerDevices()}
												</div>
											)}
										</span>
									</div>
									<br />
									<button type="submit" form="updateCustomerForm">
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

export default UpdateCustomer;
