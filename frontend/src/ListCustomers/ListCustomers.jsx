import { useEffect, useRef, useState } from "react";
import "./ListCustomers.css";

import UpdateCustomer from "../Modals/UpdateCustomer";

export default function Customers() {
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const [fetchAgain, setFetch] = useState(true);

	const [modal, setModal] = useState(false);

	const [activeCustomerId, setActiveCustomerId] = useState(null);

	const limitIndex = useRef(10);
	const documentCount = useRef(1);
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
				"http://localhost:3000/customers?" +
				new URLSearchParams({
					page: currentPage.current,
					limit: limitIndex.current,
					fields: "-__v",
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
					console.log("ListCustomers - Response data:", actualData);
				})
				.catch((err) => {
					setError(err);
				})
				.finally(() => {
					totalPages.current = Math.ceil(
						documentCount.current / limitIndex.current,
					);
					setLoading(false);
					setFetch(false);
				});
		}
	}, [fetchAgain]);

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
				alert("Had a problem deleting the customer\n", err.status);
			})
			.finally(() => {
				setFetch(true);
			});
	};

	const renderData = () => {
		return data.map((customer) => (
			<tr key={customer._id} id={customer._id}>
				<td>{customer.name}</td>
				<td>{customer.phone}</td>
				<td>{customer.devices.length}</td>
				<td>
					<button
						type="button"
						value={customer._id}
						onClick={(e) => {
							e.preventDefault();
							setModal(true);
							setActiveCustomerId(e.target.value);
						}}
					>
						Edit
					</button>
				</td>
				<td>
					<button
						type="button"
						value={customer._id}
						onClick={(e) => {
							e.preventDefault();
							const confirmation = confirm("Are you sure?", false);
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

	return (
		<div id="containery">
			{loading ? (
				<p>Loading...</p>
			) : (
				<>
					<div id="topPanel">
						<p>{documentCount.current} record(s)</p>
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
						{totalPages.current > 1 && (
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
					{modal && (
						<UpdateCustomer
							toggleModal={hideModal}
							customer={activeCustomerId}
						/>
					)}
				</>
			)}
		</div>
	);
}
