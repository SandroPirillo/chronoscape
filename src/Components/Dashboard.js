import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import Event from "../Models/Event";

const Dashboard = () => {
  const [calendarData, setCalendarData] = useState([]);

  useEffect((startDate, endDate) => {
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

        const response = await window.gapi.client.calendar.events.list({
          calendarId: "primary",
          timeMin: firstDayOfLastMonth.toISOString(),
          timeMax: lastDayOfLastMonth.toISOString(),
          showDeleted: false,
          singleEvents: true,
          orderBy: "startTime",
        });
        const CalendarEvents = response.result.items;
        const events = convertDataToEventObjects(CalendarEvents);
        setCalendarData(events);
      } catch (error) {
        console.error("Error fetching calendar data:", error);
      }
    };

    fetchData();
  }, []);

  // Convert calendar data to Event objects
  const convertDataToEventObjects = (CalendarEvents) => {
    const eventObjects = CalendarEvents.map((event) => {
      const startTime = new Date(event.start.dateTime);
      const endTime = new Date(event.end.dateTime);
      const eventObject = new Event(event.summary, startTime, endTime);
      return eventObject;
    });
    return eventObjects;
  };
  // Calculate total time spent for each event with the same name

  const filterEventsByUniqueName = () => {
    const uniqueEventNames = [
      ...new Set(calendarData.map((event) => event.name)),
    ];
    const filteredArrays = uniqueEventNames.map((eventName) =>
      calendarData.filter((event) => event.name === eventName)
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
      (event) => event.name === eventName
    );
    let totalTime = 0;
    let eventCount = eventsWithSameName.length;

    eventsWithSameName.forEach((event) => {
      const startTime = new Date(event.startTime);
      const endTime = new Date(event.endTime);
      const eventTime = endTime - startTime;
      totalTime += eventTime;
    });

    return { totalTime, eventCount };
  };

  // Calculate total time spent for each event in the array
  const calculateTotalTime = (array) => {
    let totalTime = 0;
    
    array.forEach((event) => {
      console.log(event.name + " " + event.totalTime);

      totalTime += event.totalTime;
    });
    return totalTime;
  };

  // Remove elements from array1 that are present in array2
  const removeMatchingElements = (array1, array2) => {
    const newArray = array1.filter((element) => !array2.includes(element));
    return newArray;
  };

  const filteredArrays = filterEventsByUniqueName();
  const arraysWithOneElement = getArraysWithOneElement(filteredArrays);
  const flatArray = arraysWithOneElement.flat();

  //add new element to array
  // Remove arrays with one element from filteredArrays
  const filteredArraysNoSingleElement = removeMatchingElements(
    filteredArrays,
    arraysWithOneElement
  );



  return (
    <div className="dashboard">

      {filteredArraysNoSingleElement.map((filteredArray) => {
        const { totalTime, eventCount } = calculateTotalTimeAndCount(
          filteredArray[0].name
        );

        return (
          <div>
            <div key={filteredArray[0].id} className="event-card">
              <h3>{filteredArray[0].name}</h3>
              <p>Total time spent: {formatTime(totalTime)}</p>
              <p>Event count: {eventCount}</p>
            </div>
          </div>
        );
      })}

      <div className="event-card">
        <h3>Misc</h3>
        <p>Total time spent: {formatTime(calculateTotalTime(flatArray))}</p>
        <p>Event count: {arraysWithOneElement.length}</p>
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
