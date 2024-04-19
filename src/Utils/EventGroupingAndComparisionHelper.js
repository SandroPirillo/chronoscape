import Event from "../Models/Event.js";

class EventGroupingAndComparisionHelper {

  static colourIdConverter(id) {
    switch (id) {
      case "1":
        return "rgba(121, 134, 203, 1)";
      case "2":
        return "rgba(74, 113, 108, 1)";
      case "3":
        return "rgba(142, 36, 170, 1)";
      case "4":
        return "rgba(51, 182, 121, 1)";
      case "5":
        return "rgba(230, 124, 115, 1)";
      case "6":
        return "rgba(246, 192, 38, 1)";
      case "7":
        return "rgba(245, 81, 29, 1)";
      case "8":
        return "rgba(3, 155, 229, 1)";
      case "9":
        return "rgba(97, 97, 97, 1)";
      case "10":
        return "rgba(11, 128, 67, 1)";
      case "11":
        return "rgba(63, 81, 181, 1)";
      default:
        return "rgba(3, 155, 229, 1)";
    }
  }
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
  
  static dateSetter(timeSpan, newDateBounds) {
    var endDateCurrent = newDateBounds ? newDateBounds[0] : new Date();
    var startDateCurrent = newDateBounds ? newDateBounds[1] : new Date();
    var endDatePrevious = newDateBounds ? newDateBounds[2] : new Date(startDateCurrent.getTime());
    var startDatePrevious = newDateBounds ? newDateBounds[3] : new Date(startDateCurrent.getTime());
  
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