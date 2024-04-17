import React from "react";

function EventList({ group, onBack }) {
  return (
    <div>
      <button onClick={onBack}>Back to groups</button>
      {group.events.map((event) => () => {
        return (
          <div key={event.id}>
            <h2>{event.summary}</h2>
            <p>{event.description}</p>
            <p>{event.start.dateTime}</p>
            <p>{event.end.dateTime}</p>
          </div>
        );
      })}
    </div>
  );
}

export default EventList;
