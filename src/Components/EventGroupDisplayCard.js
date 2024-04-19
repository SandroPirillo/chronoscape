import React from 'react';
import EventGroupingAndComparisionHelper from '../Utils/EventGroupingAndComparisionHelper.js';
import './EventGroupDisplayCard.css';

const EventGroupDisplayCard = ({ groupCurrent,  comparisonResult}) => {
    return (
        <div className="event-card" key={groupCurrent.name} >
          <h3>{groupCurrent.name}</h3>
          <p>Total Events: {groupCurrent.events.length}</p>
          <p>
            Total Time:{" "}
            {EventGroupingAndComparisionHelper.formatTime(EventGroupingAndComparisionHelper.calculateTotalTime(groupCurrent.events))}
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
                      EventGroupingAndComparisionHelper.formatTime(result.timeDifference).startsWith("-")
                        ? "negative"
                        : "positive"
                    }
                  >
                    Time Difference: {EventGroupingAndComparisionHelper.formatTime(result.timeDifference)}
                  </p>
                </div>
              );
            }
          })}
        </div>
      );
};

export default EventGroupDisplayCard;