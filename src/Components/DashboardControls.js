import React from 'react';

const DashboardControls = ({fetchData, setDateRange, adjustDateBounds, Datebounds}) => {
    

    return (
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
        </div>
    );
};

export default DashboardControls;