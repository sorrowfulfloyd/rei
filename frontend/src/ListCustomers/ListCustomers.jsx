import { useEffect, useState } from "react";
import "./ListCustomers.css";

export default function Customers() {
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [limitIndex, setLimitIndex] = useState(10);
	const [documentCount, setDocumentCount] = useState();
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState();
	const [fetchAgain, setFetch] = useState(true);

	let documentAmount;

	const deleteCustomer = (id) => {
		fetch(
			"http://localhost:3000/customers?" +
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
						"[debug] - customer document with the id ",
						id,
						" has been deleted succesfully",
					);
					return alert("Customer has been deleted successfully!");
				}
				throw response;
			})
			.catch((err) => {
				alert("Had a problem deleting the customer\n", err);
			})
			.finally(() => {
				setFetch(true);
			});
	};

	useEffect(() => {
		if (fetchAgain) {
			fetch(
				"http://localhost:3000/customers?" +
					new URLSearchParams({
						page: currentPage,
						limit: limitIndex,
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
					setData(actualData.message);
					documentAmount = actualData.amount;
					setDocumentCount(actualData.amount);
					console.log("DBG - Response data:", actualData);
				})
				.catch((err) => {
					setError(err);
				})
				.finally(() => {
					setTotalPages(Math.ceil(documentAmount / limitIndex));
					setLoading(false);
					setFetch(false);
				});
		}
	}, [limitIndex, currentPage, fetchAgain, documentAmount]);

	const renderData = () => {
		return data.map((device) => (
			<tr key={device._id} id={device._id}>
				<td>{device.name}</td>
				<td>{device.phone}</td>
				<td>{device.devices.length}</td>
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
							let confirmation = confirm("Are you sure?", false);
							if (confirmation) {
								deleteCustomer(e.target.value);
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

		for (let i = 1; i <= totalPages; i++) {
			pageSelectors.push(
				<a
					key={i}
					onClick={() => {
						setCurrentPage(i);
						setFetch(true);
					}}
				>
					{i}
				</a>,
			);
		}

		return pageSelectors;
	};

	return (
		<div id="containery">
			{loading ? (
				<p>Loading...</p>
			) : (
				<>
					<div id="topPanel">
						<p>{documentCount} record(s)</p>
						<select
							id="showPerPage"
							onChange={(e) => {
								setFetch(true);
								if (e.target.value > documentCount) {
									setCurrentPage(1);
								}
								setLimitIndex(e.target.value);
							}}
						>
							<option value="10">10</option>
							<option value="25">25</option>
							<option value="50">50</option>
							<option value="100">100</option>
							<option value="250">250</option>
						</select>
						{totalPages > 1 && (
							<div id="pageSelector">{renderPageSelectors()}</div>
						)}
					</div>

					<table>
						<thead>
							<tr>
								<th>Customer Name</th>
								<th>Phone Number</th>
								<th>Number of Devices</th>
							</tr>
						</thead>
						{error && (
							<p>{`There was a problem with fetching the data - ${error}`}</p>
						)}
						{data && <tbody id="deviceList">{renderData()}</tbody>}
					</table>
				</>
			)}
		</div>
	);
}
