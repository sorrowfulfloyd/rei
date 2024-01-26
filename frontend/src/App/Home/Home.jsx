import { useEffect, useState, useRef } from "react";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut, Pie } from "react-chartjs-2";

import "./Home.css";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Home() {
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const DEVICE_TYPES = [0, 0, 0, 0];

	const countDeviceTypes = () => {
		data.map((type) => {
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
		});
	};
	countDeviceTypes();
	const chartData = {
		labels: ["Laptop", "TV", "Phone", "Other"],
		datasets: [
			{
				label: "# of Devices",
				data: [
					DEVICE_TYPES[0],
					DEVICE_TYPES[1],
					DEVICE_TYPES[2],
					DEVICE_TYPES[3],
				],
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

	useEffect(() => {
		fetch(
			process.env.API_URL +
			"/devices?" +
			new URLSearchParams({
				fields: "device_type",
				repairStatus: "Ongoing",
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
				<div id="pieChart">
					<p>Ongoing repairs</p>
					<Pie data={chartData} />
				</div>
			)}
		</div>
	);
}
