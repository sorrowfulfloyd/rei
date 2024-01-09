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

	useEffect(() => {
		if (limitIndex && currentPage) {
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
					setTotalPages(Math.ceil(documentCount / limitIndex));
					setDocumentCount(actualData.amount);
					console.log("DBG - Response data:", actualData);
				})
				.catch((err) => {
					setError(err);
				})
				.finally(() => {
					setLoading(false);
				});
		}
	}, [limitIndex, currentPage, documentCount]);

	const renderData = () => {
		return data.map((device) => (
			<tr key={device._id} id={device._id}>
				<td>{device.name}</td>
				<td>{device.phone}</td>
				<td>{device.devices.length}</td>
				<td>{}</td>
			</tr>
		));
	};

	const renderPageSelectors = () => {
		const pageSelectors = [];

		for (let i = 1; i <= totalPages; i++) {
			pageSelectors.push(
				<a key={i} onClick={() => setCurrentPage(i)}>
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
