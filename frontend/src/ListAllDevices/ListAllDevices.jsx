import { useEffect, useRef, useState } from "react";
import "./ListAllDevices.css";

import UpdateDevice from "../Modals/UpdateDevice";

export default function ListAllDevices() {
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const [modal, setModal] = useState(false);

	const [status, setStatus] = useState(false);
	const [activeDeviceId, setActiveDeviceId] = useState(null);

	const [deviceType, setDeviceType] = useState("All");
	const [repairStatus, setRepairStatus] = useState("All");
	const [sortBy, setSortBy] = useState("-acceptDate");

	const [fetchAgain, setFetch] = useState(true);

	const limitIndex = useRef(10);
	const documentCount = useRef(0);
	const currentPage = useRef(1);
	const totalPages = useRef(1);

	if (modal) {
		document.body.classList.add("active-modal");
	} else {
		document.body.classList.remove("active-modal");
	}

	const hideModal = () => {
		setFetch(true);
		setModal(!modal);
	};

	useEffect(() => {
		if (fetchAgain) {
			fetch(
				process.env.API_URL +
				"/devices?" +
				new URLSearchParams({
					page: currentPage.current,
					limit: limitIndex.current,
					fields: "-__v,-owner",
					deviceType: deviceType,
					repairStatus: repairStatus,
					sort: sortBy,
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
						return response.json();
					}
					throw response;
				})
				.then((actualData) => {
					setData(actualData.message);
					documentCount.current = actualData.amount;
					totalPages.current = Math.ceil(
						documentCount.current / limitIndex.current,
					);
					console.log("ListAllDevices - Response data:", actualData);
				})
				.catch((err) => {
					setError(err);
				})
				.finally(() => {
					setLoading(false);
					setFetch(false);
				});
		}
	}, [fetchAgain, deviceType, repairStatus, sortBy]);

	const deleteDevice = (id) => {
		fetch(
			process.env.API_URL +
			"/devices?" +
			new URLSearchParams({
				id: id,
			}),
			{
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					token: document.cookie.slice(6),
				},
			},
		)
			.then((response) => {
				if (response.ok) {
					console.log(
						"[debug] - device document with the id ",
						id,
						" has been deleted succesfully",
					);
					return alert("Device has been deleted successfully!");
				}
				throw response;
			})
			.catch((err) => {
				alert("Had a problem deleting the device\n", err);
			})
			.finally(() => {
				setFetch(true);
			});
	};

	const deviceStatusSelector = (id, oldStatus) => {
		return (
			<select
				value={oldStatus}
				id={id}
				onChange={(e) => {
					setActiveDeviceId(id);
					if (e.target.value !== oldStatus) {
						updateRepairStatus(id, e.target.value);
					} else {
						setStatus(false);
					}
				}}
			>
				<option value="Ongoing">Ongoing</option>
				<option value="On-hold">On-hold</option>
				<option value="Done">Done</option>
				<option value="Cancelled">Cancelled</option>
			</select>
		);
	};

	const deviceStatusLink = (id, device_status) => {
		return (
			<a
				id={id}
				onClick={() => {
					setStatus(true);
					setActiveDeviceId(id);
				}}
			>
				{device_status} ⮟
			</a>
		);
	};

	const updateRepairStatus = (id, newStatus) => {
		fetch(
			process.env.API_URL +
			"/devices?" +
			new URLSearchParams({
				id: id,
			}),
			{
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
					token: document.cookie.slice(6),
				},
				body: JSON.stringify({
					status: newStatus,
				}),
			},
		)
			.then((response) => {
				if (response.ok) {
					alert("Status updated");
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
				setFetch(true);
				setStatus(false);
			});
	};

	const renderData = () => {
		return data.map((device) => (
			<tr key={device._id} id={device._id}>
				<td>{device.device_type}</td>
				<td>
					{!status ? (
						deviceStatusLink(device._id, device.status)
					) : (
						<div>
							{device._id === activeDeviceId
								? deviceStatusSelector(device._id, device.status)
								: deviceStatusLink(device._id, device.status)}
						</div>
					)}
				</td>
				<td>{device.brand}</td>
				<td>{device.model}</td>
				<td>{device.accessories}</td>
				<td>{device.problem}</td>
				<td>{device.note}</td>
				<td>{device.isWorking ? "Yes" : "No"}</td>
				<td>{device.hasWarranty ? "Yes" : "No"}</td>
				<td>{device.acceptDate}</td>
				<td>
					<button
						type="button"
						value={device._id}
						onClick={(e) => {
							e.preventDefault();
							setModal(true);
							setActiveDeviceId(e.target.value);
						}}
					>
						Edit
					</button>
				</td>
				<td>
					<button
						type="button"
						value={device._id}
						onClick={(e) => {
							e.preventDefault();
							const confirmation = confirm("Are you sure?", false);
							if (confirmation) {
								deleteDevice(e.target.value);
							}
						}}
					>
						Delete
					</button>
				</td>
			</tr>
		));
	};

	const renderPageSelectors = () => {
		const pageSelectors = [];

		for (let i = 1; i <= totalPages.current; i++) {
			pageSelectors.push(
				<a
					key={i}
					onClick={() => {
						currentPage.current = i;
						setFetch(true);
					}}
				>
					{i}
				</a>,
			);
		}

		return pageSelectors;
	};

	const resetSelectors = () => {
		setDeviceType("All");
		setRepairStatus("All");
		const typeSelect = document.querySelector("#deviceTypeSelector");
		typeSelect.value = "All";
		const statusSelect = document.querySelector("#repairStatusSelector");
		statusSelect.value = "All";
		setFetch(true);
	};

	return (
		<div id="deviceListContainer">
			{loading ? (
				<p>Loading...</p>
			) : (
				<>
					<div id="queryOptions">
						<div id="query">
							<label htmlFor="deviceTypeSelector">Device type:</label>
							<select
								name="deviceTypeSelector"
								id="deviceTypeSelector"
								defaultValue={deviceType}
								onChange={(e) => {
									setDeviceType(e.target.value);
								}}
							>
								<option value="All">All</option>
								<option value="Laptop">Laptop</option>
								<option value="TV">TV</option>
								<option value="Phone">Phone</option>
							</select>
							<label htmlFor="repairStatusSelector">Status:</label>
							<select
								name="repairStatusSelector"
								id="repairStatusSelector"
								defaultValue={repairStatus}
								onChange={(e) => {
									setRepairStatus(e.target.value);
								}}
							>
								<option>All</option>
								<option>Ongoing</option>
								<option>On-hold</option>
								<option>Done</option>
								<option>Cancelled</option>
							</select>
							<button
								type="button"
								onClick={(e) => {
									e.preventDefault();
									setFetch(true);
								}}
							>
								Search
							</button>
							<button
								type="button"
								onClick={(e) => {
									e.preventDefault();
									resetSelectors();
								}}
							>
								Reset
							</button>
						</div>
						<div id="sort">
							<label htmlFor="sortList"> Sort by:</label>
							<select
								name="sortList"
								defaultValue={repairStatus}
								onChange={(e) => {
									setSortBy(e.target.value);
									setFetch(true);
								}}
							>
								<option value="-acceptDate">Newest: Accept Date</option>
								<option value="acceptDate">Oldest: Accept Date</option>
								<option value="brand">Brand (A-Z)</option>
								<option value="model">Model (A-Z)</option>
							</select>
						</div>
					</div>
					<div id="topPanel">
						<p>{documentCount.current} record(s) in total</p>
						{totalPages.current > 1 && (
							<div id="pageSelector">{renderPageSelectors()}</div>
						)}
						<select
							id="showPerPage"
							onChange={(e) => {
								if (e.target.value > documentCount.current) {
									currentPage.current = 1;
								}
								setFetch(true);
								limitIndex.current = e.target.value;
							}}
						>
							<option value="10">10</option>
							<option value="25">25</option>
							<option value="50">50</option>
							<option value="100">100</option>
							<option value="250">250</option>
						</select>
					</div>
					{error ? (
						<p>{`There was a problem with fetching the data - ${error}`}</p>
					) : (
						<div id="deviceList">
							<table>
								<thead>
									<tr>
										<th>Device Type</th>
										<th>Status</th>
										<th>Brand</th>
										<th>Model</th>
										<th>Accessories</th>
										<th>Problem</th>
										<th>Additional Notes</th>
										<th>Was it working?</th>
										<th>Has Warranty?</th>
										<th>Accept Date</th>
									</tr>
								</thead>
								{data && <tbody id="deviceListed">{renderData()}</tbody>}
							</table>
						</div>
					)}
					{modal && (
						<UpdateDevice toggleModal={hideModal} device={activeDeviceId} />
					)}
				</>
			)}
		</div>
	);
}
