import { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";

import "react-big-calendar/lib/css/react-big-calendar.css";
import "./Scheduler.css";

const localizer = momentLocalizer(moment);

export default function Scheduler() {
	const [data, setData] = useState([]);

	useEffect(() => {
		fetch(
			process.env.API_URL +
			"/devices?" +
			new URLSearchParams({
				fields: "device_type,status,brand,calendarStart,calendarEnd",
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
					return response.json();
				}
				throw response;
			})
			.then((actualData) => {
				setData(parseDataToEvents(actualData.message));
				console.log("Calendar - Response data:", actualData);
			})
			.catch((err) => {
				setData([]);
				console.log(err);
			})
			.finally(() => { });
	}, []);
	const handleSelectEvent = (event) => {
		window.alert(
			`[DEBUG]\nevent title: ${event.title}\nevent start: ${event.start}\nevent end: ${event.end}`,
		);
	};

	return (
		<div className="schedulerWrapper">
			<Calendar
				localizer={localizer}
				defaultDate={new Date()}
				events={data}
				onSelectEvent={handleSelectEvent}
			/>
		</div>
	);
}

const parseDataToEvents = (data) => {
	return data.map((item, index) => ({
		id: index,
		title: item.device_type + " repair",
		start: moment(item.calendarStart).toDate(),
		end: moment(item.calendarEnd).toDate(),
	}));
};
