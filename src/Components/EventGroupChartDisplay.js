import React from "react";
import EventGroupingAndComparisionHelper from "../Utils/EventGroupingAndComparisionHelper.js";
import {
  Chart,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import "./EventList.css";

Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function colourIdConverter(id) {
  switch (id) {
    case "1":
      return "rgba(121, 134, 203, 0.6)";
    case "2":
      return "rgba(74, 113, 108, 0.6)";
    case "3":
      return "rgba(142, 36, 170, 0.6)";
    case "4":
      return "rgba(51, 182, 121, 0.6)";
    case "5":
      return "rgba(230, 124, 115, 0.6)";
    case "6":
      return "rgba(246, 192, 38, 0.6)";
    case "7":
      return "rgba(245, 81, 29, 0.6)";
    case "8":
      return "rgba(3, 155, 229, 0.6)";
    case "9":
      return "rgba(97, 97, 97, 0.6)";
    case "10":
      return "rgba(11, 128, 67, 0.6)";
    case "11":
      return "rgba(63, 81, 181, 0.6)";
    default:
      return "rgba(3, 155, 229, 0.6)";
  }
}

//what i want is to display a bar chart of the total time for each group in current and if there is a previous group with the same name i want to 
//display the total time for that group as well as a comparison between the two groups
const EventGroupChartDisplay = ({ groups, onBack, dates }) => {
    const data = {
        labels: groups.map((group) => group.name),
        datasets: [
            {
                label: "Current Group",
                data: groups.map((group) => group.totalTime),
                backgroundColor: groups.map((group) => colourIdConverter(group.id)),
            },
            {
                label: "Previous Group",
                data: groups.map((group) => group.previousTotalTime),
                backgroundColor: groups.map((group) => colourIdConverter(group.id)),
            },
        ],
    };

    return (
        <div>
            <button onClick={onBack}>Back to groups</button>
            <p>{dates[0]} - {dates[1]}</p>
            <div className="bar-chart">
                <Bar data={data} />
            </div>
        </div>
    );
};

export default EventGroupChartDisplay;
