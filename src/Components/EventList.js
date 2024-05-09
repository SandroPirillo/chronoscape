import React from "react";
import EventGroupingAndComparisionHelper from "../Utils/EventGroupingAndComparisionHelper.js";
import {
  Chart,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import "./EventList.css";

Chart.register(BarElement, CategoryScale, LinearScale, PointElement, LineElement,Tooltip, Legend);



const EventList = ({ group, onBack, dates }) => {
  const totalSum = group.events.reduce((sum, event) => sum + event.totalTime, 0);
const averageTimeInHours = totalSum / group.events.length / 3600000; // convert milliseconds to hours
  const data = {
    labels: group.events.map((event) => event.name),
    datasets: [
      {
        label: "Total Time in Hours",
        data: group.events.map((event) => event.totalTime / 3600000), // convert milliseconds to hours
        backgroundColor: group.events.map((event) => EventGroupingAndComparisionHelper.colourIdConverter(event.colour)),
        borderColor: group.events.map((event) => EventGroupingAndComparisionHelper.colourIdConverter(event.colour)),
        borderWidth: 1,
        hoverBackgroundColor: group.events.map((event) => EventGroupingAndComparisionHelper.colourIdConverter(event.colour)),
        hoverBorderColor: group.events.map((event) => EventGroupingAndComparisionHelper.colourIdConverter(event.colour)),
      }
    ],
  };
  return (
    <div>
      <button className="button" onClick={onBack}>Back to groups</button>
      <p>{dates[0]} - {dates[1]}</p>
      <div className="bar-chart">
        <Bar data={data} />
      </div>
    </div>
  );
};

export default EventList;
