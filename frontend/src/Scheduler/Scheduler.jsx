import React, { useMemo } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";

import "react-big-calendar/lib/css/react-big-calendar.css";

import myEvents from "./myEvents";

const localizer = momentLocalizer(moment);

function Scheduler() {
	const handleSelectEvent = (event) => {
		window.alert(event.title + event.desc);
	};

	return (
		<div style={{ height: "600px" }}>
			<Calendar
				localizer={localizer}
				defaultDate={new Date()}
				events={myEvents}
				onSelectEvent={handleSelectEvent}
			/>
		</div>
	);
}

export default Scheduler;
