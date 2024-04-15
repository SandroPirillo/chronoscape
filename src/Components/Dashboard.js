import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import Event from "../Models/Event";

const Dashboard = () => {
  const [calendarDataCurrent, setCalendarDataCurrent] = useState([]);
  const [calendarDataPrevious, setCalendarDataPrevious] = useState([]);

  useEffect(() => {
    fetchData("week");
  }, []);

  const fetchData = async (timeSpan) => {
    var {
      endDateCurrent,
      startDateCurrent,
      endDatePrevious,
      startDatePrevious,
    } = dateSetter(timeSpan);
    setCalendarDataCurrent(await makeRequest(startDateCurrent, endDateCurrent));
    setCalendarDataPrevious(await makeRequest(startDatePrevious, endDatePrevious));
  };

  async function makeRequest(startDate, endDate) {
    try {
      const response = await window.gapi.client.calendar.events.list({
        calendarId: "primary",
        timeMin: startDate.toISOString(),
        timeMax: endDate.toISOString(),
        showDeleted: false,
        singleEvents: true,
        orderBy: "startTime",
      });
      const CalendarEvents = response.result.items;
      const calendarData = convertDataToEventObjects(CalendarEvents);
      console.log("startDate", startDate.toISOString());
      console.log("endDate", endDate.toISOString());
      return calendarData;
    } catch (error) {
      console.error("Error fetching calendar data:", error);
    }
  }

  // Convert calendar data to Event objects
  const convertDataToEventObjects = (CalendarEvents) => {
    const eventObjects = CalendarEvents.map((event) => {
      const startTime = new Date(event.start.dateTime);
      const endTime = new Date(event.end.dateTime);
      const colour = event.colorId;
      const eventObject = new Event(event.summary, startTime, endTime);
      return eventObject;
    });
    return eventObjects;
  };

  function dateSetter(timeSpan) {
    var endDateCurrent = new Date();
    var startDateCurrent = new Date(endDateCurrent);
    var endDatePrevious = new Date();
    var startDatePrevious = new Date();

    switch (timeSpan) {
      case "week":
        startDateCurrent.setDate(endDateCurrent.getDate() - 7);
        endDatePrevious.setDate(startDateCurrent.getDate() - 1);
        startDatePrevious.setDate(endDatePrevious.getDate() - 7);
        break;
      case "month":
        startDateCurrent.setDate(endDateCurrent.getDate() - 30);
        endDatePrevious.setDate(startDateCurrent.getDate() - 1);
        startDatePrevious.setDate(endDatePrevious.getDate() - 30);
        break;
      default:
        startDateCurrent.setDate(endDateCurrent.getDate() - 7);
        endDatePrevious.setDate(startDateCurrent.getDate() - 1);
        startDatePrevious.setDate(endDatePrevious.getDate() - 7);
        break;
    }

    return {
      endDateCurrent,
      startDateCurrent,
      endDatePrevious,
      startDatePrevious,
    };
  }

  const formatTime = (timeInMilliseconds) => {
    const seconds = Math.floor((timeInMilliseconds / 1000) % 60);
    const minutes = Math.floor((timeInMilliseconds / (1000 * 60)) % 60);
    const hours = Math.floor((timeInMilliseconds / (1000 * 60 * 60)) % 24);
    const days = Math.floor(timeInMilliseconds / (1000 * 60 * 60 * 24));

    let formattedTime = "";

    if (days > 0) {
      formattedTime += `${days}d `;
    }
    if (hours > 0) {
      formattedTime += `${hours}h `;
    }
    if (minutes > 0) {
      formattedTime += `${minutes}m `;
    }
    if (seconds > 0) {
      formattedTime += `${seconds}s`;
    }

    return formattedTime.trim();
  };

  // Calculate total time spent for each event in the array
  const calculateTotalTime = (array) => {
    let totalTime = 0;

    array.forEach((event) => {
      totalTime += event.totalTime;
    });
    return totalTime;
  };

return (
    <div>
        <div>
            <button onClick={() => fetchData("week")}>Fetch Week Data</button>
            <button onClick={() => fetchData("month")}>Fetch Month Data</button>

            <p>
                Current Start Date: {calendarDataCurrent.length > 0 ? calendarDataCurrent[0].startTime.toLocaleDateString() : " "} 
                Current End Date: {calendarDataCurrent.length > 0 ? calendarDataCurrent[calendarDataCurrent.length - 1].startTime.toLocaleDateString() : " "}
            </p>
            <p>
            Previous Start Date: {calendarDataPrevious.length > 0 ? calendarDataPrevious[0].startTime.toLocaleDateString() : " "} 
            Previous End Date: {calendarDataPrevious.length > 0 ? calendarDataPrevious[calendarDataPrevious.length - 1].startTime.toLocaleDateString() : " "}
            </p>
        </div>
    </div>
);
};

export default Dashboard;

/*

event object
event = {
  name
  start
  end
  total time
}

functions:
fetch this months data
fetch last months data
fetch this weeks data
fetch last weeks data
fetch todays data
fetch yesterdays data
convert data to event objects
group events by name
calculate total time for events


*/
