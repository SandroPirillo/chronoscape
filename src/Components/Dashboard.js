import React, { useEffect, useState, useCallback } from "react";
import "./Dashboard.css";
import EventGroupingAndComparisionHelper from "../Utils/EventGroupingAndComparisionHelper.js";
import EventList from "./EventList";
import EventGroupDisplayCard from "./EventGroupDisplayCard";

const Dashboard = () => {
  const [calendarDataCurrent, setCalendarDataCurrent] = useState([]);
  const [calendarDataPrevious, setCalendarDataPrevious] = useState([]);
  const [Datebounds, setDatebounds] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);


  const handleGroupClick = group => {
    console.log("Group clicked", group);
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
      const calendarData = EventGroupingAndComparisionHelper.convertDataToEventObjects(CalendarEvents);
      return calendarData;
    } catch (error) {
      console.error("Error fetching calendar data:", error);
    }
  }

  

  const fetchData = useCallback(async (timeSpan) => {
    var dates = EventGroupingAndComparisionHelper.dateSetter(timeSpan);
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

  
  const groupedEventsCurrent = EventGroupingAndComparisionHelper.groupEventsByName(calendarDataCurrent);
  const groupedEventsPrevious = EventGroupingAndComparisionHelper.groupEventsByName(calendarDataPrevious);
  const comparisonResult = EventGroupingAndComparisionHelper.compareEventGroups(
    groupedEventsCurrent,
    groupedEventsPrevious
  );

  if (selectedGroup) {
    return <EventList group={selectedGroup} onBack={() => setSelectedGroup(null)} />;
  } else {

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
      </div>
    </div>
  );
}
};

export default Dashboard;
