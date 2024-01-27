import { useEffect, useState, useRef, Fragment } from "react";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut, Pie } from "react-chartjs-2";

import "./Home.css";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Home() {
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const countDeviceTypes = (status) => {
		const DEVICE_TYPES = [0, 0, 0, 0];

		data.map((type) => {
			if (type.status === status || !status) {
				switch (type.device_type) {
					case "Laptop":
						DEVICE_TYPES[0] += 1;
						break;
					case "TV":
						DEVICE_TYPES[1] += 1;
						break;
					case "Phone":
						DEVICE_TYPES[2] += 1;
						break;
					default:
						DEVICE_TYPES[3] += 1;
						break;
				}
			}
		});

		return {
			labels: ["Laptop", "TV", "Phone", "Other"],
			datasets: [
				{
					label: "# of Devices",
					data: DEVICE_TYPES,
					backgroundColor: [
						"rgba(255, 99, 132, 0.2)",
						"rgba(54, 162, 235, 0.2)",
						"rgba(255, 206, 86, 0.2)",
						"rgba(75, 192, 192, 0.2)",
					],
					borderColor: [
						"rgba(255, 99, 132, 1)",
						"rgba(54, 162, 235, 1)",
						"rgba(255, 206, 86, 1)",
						"rgba(75, 192, 192, 1)",
					],
					borderWidth: 1,
				},
			],
		};
	};

	useEffect(() => {
		fetch(
			`${process.env.API_URL}/devices?` +
			new URLSearchParams({
				fields: "device_type, status",
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
				console.log("Home - Response data:", actualData);
			})
			.catch((err) => {
				setError(err.status + " - " + err.statusText);
			})
			.finally(() => {
				setLoading(false);
			});
	}, []);

	return (
		<div id="homeWrapper">
			{loading ? (
				<p>Loading...</p>
			) : error ? (
				<p>error while fetching the data! {error}</p>
			) : (
				<div id="chartsWrapper">
					<div id="ongoingChart">
						<p>Ongoing repairs</p>
						<Pie data={countDeviceTypes("Ongoing")} />
					</div>
					<div id="onholdChart">
						<p>On-hold repairs</p>
						<Pie data={countDeviceTypes("On-hold")} />
					</div>
					<div id="completedChart">
						<p>Completed repairs</p>
						<Pie data={countDeviceTypes("Done")} />
					</div>
					<div id="allChart">
						<p>All device history</p>
						<Pie data={countDeviceTypes()} />
					</div>
				</div>
			)}
		</div>
	);
}
