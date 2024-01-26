import { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";

import "react-big-calendar/lib/css/react-big-calendar.css";
import "./Scheduler.css";

const localizer = momentLocalizer(moment);

export default function Scheduler() {
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		fetch(
			process.env.API_URL +
			"/devices?" +
			new URLSearchParams({
				fields:
					"device_type,status,brand,problem,note,calendarStart,calendarEnd",
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
				setData(parseDataToEvents(actualData.message));
				console.log("Calendar - Response data:", actualData);
			})
			.catch((err) => {
				setError(err.status + " - " + err.statusText);
			})
			.finally(() => {
				setLoading(false);
			});
	}, []);

	const handleSelectEvent = (event) => {
		window.alert(
			`[DEBUG]\nevent title: ${event.title}\n\n${event.description}`,
		);
	};

	return (
		<div className="schedulerWrapper">
			{loading ? (
				<p>Loading...</p>
			) : error ? (
				<p>{`There was a problem with fetching the data - ${error}`}</p>
			) : (
				<Calendar
					localizer={localizer}
					defaultDate={new Date()}
					events={data}
					onSelectEvent={handleSelectEvent}
				/>
			)}
		</div>
	);
}

const parseDataToEvents = (data) => {
	return data.map((item, index) => ({
		id: index,
		title: item.brand + " " + item.device_type + " repair",
		description: `Device problem: ${item.problem}\nAdditional notes: ${item.note}`,
		start: moment(item.calendarStart).toDate(),
		end: moment(item.calendarEnd).toDate(),
	}));
};
