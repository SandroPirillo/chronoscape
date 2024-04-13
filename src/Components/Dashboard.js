import React, { useEffect, useState } from "react";
import "./Dashboard.css";
const Dashboard = () => {
  const [calendarData, setCalendarData] = useState([]);

  useEffect(() => {
    // Fetch data from Google Calendar API
    const fetchData = async () => {
      try {
        const currentDate = new Date();
        const firstDayOfLastMonth = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() - 1,
          1
        );
        const lastDayOfLastMonth = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          0,
          23,
          59,
          59
        );

        const response = await gapi.client.calendar.events.list({
          calendarId: "primary",
          timeMin: firstDayOfLastMonth.toISOString(),
          timeMax: lastDayOfLastMonth.toISOString(),
          showDeleted: false,
          singleEvents: true,
          orderBy: "startTime",
        });
        const events = response.result.items;
        setCalendarData(events);
      } catch (error) {
        console.error("Error fetching calendar data:", error);
      }
    };

    fetchData();
  }, []);

  // Calculate total time spent for each event with the same name
  const calculateTotalTime = (eventName) => {
    const eventsWithSameName = calendarData.filter(
      (event) => event.summary === eventName
    );
    let totalTime = 0;

    eventsWithSameName.forEach((event) => {
      const startTime = new Date(event.start.dateTime);
      const endTime = new Date(event.end.dateTime);
      const eventTime = endTime - startTime;
      totalTime += eventTime;
    });

    return totalTime;
  };

  const filterEventsByUniqueName = () => {
    const uniqueEventNames = [
      ...new Set(calendarData.map((event) => event.summary)),
    ];
    const filteredArrays = uniqueEventNames.map((eventName) =>
      calendarData.filter((event) => event.summary === eventName)
    );
    return filteredArrays;
  };

  const getArraysWithOneElement = (filteredArrays) => {
    const arraysWithOneElement = filteredArrays.filter(
      (array) => array.length === 1
    );
    return arraysWithOneElement;
  };

  const formatTime = (timeInMilliseconds) => {
    const seconds = Math.floor((timeInMilliseconds / 1000) % 60);
    const minutes = Math.floor((timeInMilliseconds / (1000 * 60)) % 60);
    const hours = Math.floor((timeInMilliseconds / (1000 * 60 * 60)) % 24);

    return `${hours}h ${minutes}m ${seconds}s`;
  };

  // Calculate total time spent and count for each event with the same name
  const calculateTotalTimeAndCount = (eventName) => {
    const eventsWithSameName = calendarData.filter(
      (event) => event.summary === eventName
    );
    let totalTime = 0;
    let eventCount = eventsWithSameName.length;

    eventsWithSameName.forEach((event) => {
      const startTime = new Date(event.start.dateTime);
      const endTime = new Date(event.end.dateTime);
      const eventTime = endTime - startTime;
      totalTime += eventTime;
    });

    return { totalTime, eventCount };
  };

  // Remove elements from array1 that are present in array2
  const removeMatchingElements = (array1, array2) => {
    const newArray = array1.filter((element) => !array2.includes(element));
    return newArray;
  };

  const filteredArrays = filterEventsByUniqueName();
  const arraysWithOneElement = getArraysWithOneElement(filteredArrays);
  //add new element to array
  
  console.log(arraysWithOneElement);

  // Remove arrays with one element from filteredArrays
  const filteredArraysNoSingleElement = removeMatchingElements(
    filteredArrays,
    arraysWithOneElement
  );


  return (
    <div className="dashboard">
      {/* Render your calendar data */}

      {filteredArraysNoSingleElement.map((filteredArray) => {
        const { totalTime, eventCount } = calculateTotalTimeAndCount(
          filteredArray[0].summary
        );

        return (
          <div key={filteredArray[0].id} className="event-card">
            <h3>{filteredArray[0].summary}</h3>
            <p>Total time spent: {formatTime(totalTime)}</p>
            <p>Event count: {eventCount}</p>
          </div>
        );
      })}
    </div>
  );
};

export default Dashboard;
