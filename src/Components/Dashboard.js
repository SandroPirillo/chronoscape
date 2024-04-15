import React, { useEffect, useState, useCallback } from "react";
import "./Dashboard.css";
import Event from "../Models/Event";

const Dashboard = () => {
  const [calendarDataCurrent, setCalendarDataCurrent] = useState([]);
  const [calendarDataPrevious, setCalendarDataPrevious] = useState([]);
  const [Datebounds, setDatebounds] = useState([]);

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
      const eventObject = new Event(event.summary, startTime, endTime, colour);
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

  const fetchData = useCallback(async (timeSpan) => {
    var dates = dateSetter(timeSpan);
    setDatebounds([
      dates.endDateCurrent,
      dates.startDateCurrent,
      dates.endDatePrevious,
      dates.startDatePrevious,
    ]);

    setCalendarDataCurrent(
      await makeRequest(dates.startDateCurrent, dates.endDateCurrent)
    );
    setCalendarDataPrevious(
      await makeRequest(dates.startDatePrevious, dates.endDatePrevious)
    );
  }, []);

  useEffect(() => {
    fetchData("week");
  }, [fetchData]);

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

  function groupEventsByName(events) {
    // Create an object where the keys are event names and the values are arrays of events
    const eventsByName = events.reduce((obj, event) => {
      if (!obj[event.name]) {
        obj[event.name] = [];
      }
      obj[event.name].push(event);
      return obj;
    }, {});

    // Create a "Miscellaneous" group for events with unique names
    const miscellaneous = [];
    for (const [name, events] of Object.entries(eventsByName)) {
      if (events.length === 1) {
        miscellaneous.push(events[0]);
        delete eventsByName[name];
      }
    }
    if (miscellaneous.length > 0) {
      eventsByName["Miscellaneous"] = miscellaneous;
    }

    // Convert the object to an array of arrays
    const groupedEvents = Object.entries(eventsByName).map(
      ([name, events]) => ({ name, events })
    );

    return groupedEvents;
  }

  function groupEventsByColor(events) {
    // Create an object where the keys are event colors and the values are arrays of events
    const eventsByColor = events.reduce((obj, event) => {
      if (!obj[event.color]) {
        obj[event.color] = [];
      }
      obj[event.color].push(event);
      return obj;
    }, {});

    // Convert the object to an array of arrays
    const groupedEvents = Object.values(eventsByColor);

    return groupedEvents;
  }

  //i want to console log all the events in the calendarDataCurrent
  console.log(calendarDataCurrent);
  const groupedEvents = groupEventsByName(calendarDataCurrent);
  console.log(groupedEvents);
  return (
    <div>
      <div>
        <button onClick={() => fetchData("week")}>Fetch Week Data</button>
        <button onClick={() => fetchData("month")}>Fetch Month Data</button>

        <p>
          Current Start:{" "}
          {Datebounds[1] ? Datebounds[1].toLocaleDateString() : ""} Current End:{" "}
          {Datebounds[0] ? Datebounds[0].toLocaleDateString() : ""}
        </p>
        <p>
          Previous Start:{" "}
          {Datebounds[3] ? Datebounds[3].toLocaleDateString() : ""} Previous
          End: {Datebounds[2] ? Datebounds[2].toLocaleDateString() : ""}
        </p>
        <div className="dashboard">
          {groupedEvents.map((group) => (
            <div className="event-card" key={group.name}>
              <h3>{group.name}</h3>
              <p>Total Events: {group.events.length}</p>
              <p>Total Time: {formatTime(calculateTotalTime(group.events))}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

/*

functions:
fetch todays data
fetch yesterdays data


*/
