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
    var startDateCurrent = new Date();
    var endDatePrevious = new Date(startDateCurrent.getTime());
    var startDatePrevious = new Date(startDateCurrent.getTime());
  
    switch (timeSpan) {
      case "day":
        startDateCurrent.setTime(startDateCurrent.getTime());
        endDatePrevious.setTime(startDateCurrent.getTime() - 24*60*60*1000);
        startDatePrevious.setTime(endDatePrevious.getTime());
        break;
      case "week":
        startDateCurrent.setTime(endDateCurrent.getTime() - 6*24*60*60*1000);
        endDatePrevious.setTime(startDateCurrent.getTime() - 24*60*60*1000);
        startDatePrevious.setTime(endDatePrevious.getTime() - 6*24*60*60*1000);
        break;
      case "month":
        startDateCurrent.setTime(startDateCurrent.getTime() - 27*24*60*60*1000);
        endDatePrevious.setTime(startDateCurrent.getTime() - 24*60*60*1000);
        startDatePrevious.setTime(endDatePrevious.getTime() - 27*24*60*60*1000);
        break;
      default:
        startDateCurrent.setTime(startDateCurrent.getTime() - 6*24*60*60*1000);
        endDatePrevious.setTime(startDateCurrent.getTime() - 24*60*60*1000);
        startDatePrevious.setTime(endDatePrevious.getTime() - 6*24*60*60*1000);
        break;
    }
    endDateCurrent.setHours(23, 59, 59, 999);
    startDateCurrent.setHours(0, 0, 0, 0);
    endDatePrevious.setHours(23, 59, 59, 999);
    startDatePrevious.setHours(0, 0, 0, 0);

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

    const currentData = await makeRequest(
      dates.startDateCurrent,
      dates.endDateCurrent
    );
    const previousData = await makeRequest(
      dates.startDatePrevious,
      dates.endDatePrevious
    );

    setCalendarDataCurrent(currentData);
    setCalendarDataPrevious(previousData);
  }, []);

  useEffect(() => {
    fetchData("week");
  }, [fetchData]);

  const formatTime = (timeInMilliseconds) => {
    let isNegative = false;
    if (timeInMilliseconds < 0) {
      isNegative = true;
      timeInMilliseconds = Math.abs(timeInMilliseconds);
    }

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

    if (isNegative) {
      formattedTime = "-" + formattedTime;
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

    // Convert the object to an array of objects
    const groupedEvents = Object.entries(eventsByColor).map(
      ([name, events]) => ({ name, events })
    );

    return groupedEvents;
  }

  function compareEventGroups(current, previous) {
    //if the event groups have the same name then we can compare them
    return current
      .map((currentEventGroup) => {
        const matchingPreviousEventGroup = previous.find(
          (previousEventGroup) =>
            currentEventGroup.name === previousEventGroup.name
        );

        if (matchingPreviousEventGroup) {
          return {
            name: currentEventGroup.name,
            eventsDifference:
              currentEventGroup.events.length -
              matchingPreviousEventGroup.events.length,
            timeDifference:
              calculateTotalTime(currentEventGroup.events) -
              calculateTotalTime(matchingPreviousEventGroup.events),
          };
        }
      })
      .filter(Boolean); // remove undefined values
  }

  const groupedEventsCurrent = groupEventsByName(calendarDataCurrent);
  const groupedEventsPrevious = groupEventsByName(calendarDataPrevious);
  const comparisonResult = compareEventGroups(
    groupedEventsCurrent,
    groupedEventsPrevious
  );
  //console.log(comparisonResult);

  //i want to take as much of the logic out of the display as possible

  return (
    <div>
      <div>
        <button onClick={() => fetchData("day")}>Day</button>
        <button onClick={() => fetchData("week")}>Week</button>
        <button onClick={() => fetchData("month")}>Month</button>

        <p>
          Current Start:{" "}
          {Datebounds[1] ? Datebounds[1].toLocaleDateString() : ""} Current End:{" "}
          {Datebounds[0] ? Datebounds[0].toLocaleDateString() : ""}
        </p>
        <p>
          Debug purposes only: Previous Start:{" "}
          {Datebounds[3] ? Datebounds[3].toLocaleDateString() : ""} Previous
          End: {Datebounds[2] ? Datebounds[2].toLocaleDateString() : ""}
        </p>
        <div className="dashboard">
          {groupedEventsCurrent.map((groupCurrent) => {
            return (
              <div className="event-card" key={groupCurrent.name}>
                <h3>{groupCurrent.name}</h3>
                <p>Total Events: {groupCurrent.events.length}</p>
                <p>
                  Total Time:{" "}
                  {formatTime(calculateTotalTime(groupCurrent.events))}
                </p>
                {comparisonResult.map((result) => {
                  if (result.name === groupCurrent.name) {
                    return (
                      <div>
                        <p
                          className={
                            result.eventsDifference < 0
                              ? "negative"
                              : "positive"
                          }
                        >
                          Events Difference: {result.eventsDifference}
                        </p>
                        <p
                          className={
                            formatTime(result.timeDifference).startsWith("-")
                              ? "negative"
                              : "positive"
                          }
                        >
                          Time Difference: {formatTime(result.timeDifference)}
                        </p>
                      </div>
                    );
                  }
                })}
              </div>
            );
          })}
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
