import "./DashboardControls.css";
import React, { useState } from "react";
import "./DashboardControls.css";

const DashboardControls = ({
  fetchData,
  setDateRange,
  adjustDateBounds,
  Datebounds,
  DateRange
}) => {
  const [currentSelection, setCurrentSelection] = useState(DateRange);

return (
    <div >
        <div className="button-container">
            <button
                className={currentSelection === "day" ? "current-selection" : ""}
                onClick={() => {
                    fetchData("day");
                    setDateRange("day");
                    setCurrentSelection("day");
                }}
            >
                Day
            </button>
            <button
                className={currentSelection === "week" ? "current-selection" : ""}
                onClick={() => {
                    fetchData("week");
                    setDateRange("week");
                    setCurrentSelection("week");
                }}
            >
                Week
            </button>
            <button
                className={currentSelection === "month" ? "current-selection" : ""}
                onClick={() => {
                    fetchData("month");
                    setDateRange("month");
                    setCurrentSelection("month");
                }}
            >
                Month
            </button>
        </div>
        <div className="date-container">
            <button className="date-shifter" onClick={() => adjustDateBounds(-1)}>&lt;</button>
            <p>
                
                {Datebounds[1] ? Datebounds[1].toLocaleDateString() : ""} - 
                {Datebounds[0] ? Datebounds[0].toLocaleDateString() : ""}
            </p>
            <button className="date-shifter" onClick={() => adjustDateBounds(1)}>&gt;</button>
        </div>
        <p>
            {"Last " + currentSelection+": "}
            {Datebounds[3] ? Datebounds[3].toLocaleDateString() : ""}
            {Datebounds[2] ? Datebounds[2].toLocaleDateString() : ""}
        </p>
    </div>
);
};

export default DashboardControls;
