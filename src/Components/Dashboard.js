import React, { useEffect, useState, useCallback } from "react";
import "./Dashboard.css";
import EventGroupingAndComparisionHelper from "../Utils/EventGroupingAndComparisionHelper.js";
import EventList from "./EventList";
import EventGroupDisplayCard from "./EventGroupDisplayCard";
import EventGroupChartDisplay from "./EventGroupChartDisplay.js";

const Dashboard = () => {
  const [calendarDataCurrent, setCalendarDataCurrent] = useState([]);
  const [calendarDataPrevious, setCalendarDataPrevious] = useState([]);
  const [Datebounds, setDatebounds] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [DateRange, setDateRange] = useState("week");

  const handleGroupClick = (group) => {
    setSelectedGroup(group);
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
      const calendarData =
        EventGroupingAndComparisionHelper.convertDataToEventObjects(
          CalendarEvents
        );
      return calendarData;
    } catch (error) {
      console.error("Error fetching calendar data:", error);
    }
  }

  const fetchData = useCallback(async (DateRange, newDateBounds) => {
    var dates = newDateBounds
      ? EventGroupingAndComparisionHelper.dateSetter(DateRange, newDateBounds)
      : EventGroupingAndComparisionHelper.dateSetter(DateRange);

    setDatebounds(
      newDateBounds
        ? newDateBounds
        : [
            dates.endDateCurrent,
            dates.startDateCurrent,
            dates.endDatePrevious,
            dates.startDatePrevious,
          ]
    );

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

  const adjustDateBounds = async (direction) => {
    console.log("adjusting date bounds");
    let amount;
    switch (DateRange) {
      case "day":
        amount = 24 * 60 * 60 * 1000; // 1 day in milliseconds
        break;
      case "week":
        amount = 7 * 24 * 60 * 60 * 1000; // 1 week in milliseconds
        break;
      case "month":
        amount = 30 * 24 * 60 * 60 * 1000; // 1 month in milliseconds
        break;
      default:
        amount = 24 * 60 * 60 * 1000; // 1 day in milliseconds
    }

    const newDateBounds = [...Datebounds];
    newDateBounds[0] = new Date(
      newDateBounds[0].getTime() + direction * amount
    );
    newDateBounds[1] = new Date(
      newDateBounds[1].getTime() + direction * amount
    );
    newDateBounds[2] = new Date(
      newDateBounds[2].getTime() + direction * amount
    );
    newDateBounds[3] = new Date(
      newDateBounds[3].getTime() + direction * amount
    );
    setDatebounds(newDateBounds);

    await fetchData(DateRange, newDateBounds);
  };

  const groupedEventsCurrent =
    EventGroupingAndComparisionHelper.groupEventsByName(calendarDataCurrent);
  const groupedEventsPrevious =
    EventGroupingAndComparisionHelper.groupEventsByName(calendarDataPrevious);
  const comparisonResult = EventGroupingAndComparisionHelper.compareEventGroups(
    groupedEventsCurrent,
    groupedEventsPrevious
  );

  if (selectedGroup) {
    return (
      <EventList
        group={selectedGroup}
        onBack={() => setSelectedGroup(null)}
        dates={[
          Datebounds[1].toLocaleDateString(),
          Datebounds[0].toLocaleDateString(),
        ]}
      />
    );
  } else {
    return (
      <div>
        <div>
          <button
            onClick={() => {
              fetchData("day");
              setDateRange("day");
            }}
          >
            Day
          </button>
          <button
            onClick={() => {
              fetchData("week");
              setDateRange("week");
            }}
          >
            Week
          </button>
          <button
            onClick={() => {
              fetchData("month");
              setDateRange("month");
            }}
          >
            Month
          </button>
          <button onClick={() => adjustDateBounds(-1)}>Previous</button>
          <button onClick={() => adjustDateBounds(1)}>Next</button>

          <p>
            Current Start:{" "}
            {Datebounds[1] ? Datebounds[1].toLocaleDateString() : ""} Current
            End: {Datebounds[0] ? Datebounds[0].toLocaleDateString() : ""}
          </p>
          <p>
            Previous Start:{" "}
            {Datebounds[3] ? Datebounds[3].toLocaleDateString() : ""} Previous
            End: {Datebounds[2] ? Datebounds[2].toLocaleDateString() : ""}
          </p>
          <div className="dashboard">
            {groupedEventsCurrent.map((groupCurrent) => {
              return (
                <div onClick={() => handleGroupClick(groupCurrent)}>
                  <EventGroupDisplayCard
                    key={groupCurrent.name}
                    groupCurrent={groupCurrent}
                    comparisonResult={comparisonResult}
                  />
                </div>
              );
            })}
          </div>
          <EventGroupChartDisplay
            groups={[groupedEventsCurrent, groupedEventsPrevious]}
          />
        </div>
      </div>
    );
  }
};

export default Dashboard;
