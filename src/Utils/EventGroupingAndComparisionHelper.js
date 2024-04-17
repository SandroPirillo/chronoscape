import Event from "../Models/Event.js";

class EventGroupingAndComparisionHelper {
      // Convert calendar data to Event objects
static convertDataToEventObjects = (CalendarEvents) => {
    const eventObjects = CalendarEvents.map((event) => {
      const startTime = new Date(event.start.dateTime);
      const endTime = new Date(event.end.dateTime);
      const colour = event.colorId;
      const eventObject = new Event(event.summary, startTime, endTime, colour);
      return eventObject;
    });
    return eventObjects;
  };
  
  static dateSetter(timeSpan) {
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
  
  static formatTime = (timeInMilliseconds) => {
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
  static calculateTotalTime = (array) => {
    let totalTime = 0;
  
    array.forEach((event) => {
      totalTime += event.totalTime;
    });
    return totalTime;
  };
  
  static groupEventsByName(events) {
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
  
  static groupEventsByColor(events) {
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
  
  static compareEventGroups(current, previous) {
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
              this.calculateTotalTime(currentEventGroup.events) -
              this.calculateTotalTime(matchingPreviousEventGroup.events),
          };
        }
      })
      .filter(Boolean); // remove undefined values
  }
  
}

export default EventGroupingAndComparisionHelper;