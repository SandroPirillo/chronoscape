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

const colourCoverter = EventGroupingAndComparisionHelper.colourIdConverter;

//what i want is to display a bar chart of the total time for each group in current and if there is a previous group with the same name i want to 
//display the total time for that group as well as a comparison between the two groups
const EventGroupChartDisplay = ({ groups, dates }) => {
    const secondGroupMap = new Map(groups[1].map((group) => [group.name, group]));

    const data = {
        labels: groups[0].map((group) => group.name),
        datasets: [
            {
                label: "Current",
                data: groups[0].map((group) => EventGroupingAndComparisionHelper.calculateTotalTime(group.events) / 3600000), // convert milliseconds to hours
                backgroundColor: colourCoverter("1"),
                borderColor: colourCoverter("1"),
                borderWidth: 1,
            },
            {
                label: "Previous",
                data: groups[0].map((group) => {
                    const matchingGroup = secondGroupMap.get(group.name);
                    return matchingGroup ? EventGroupingAndComparisionHelper.calculateTotalTime(matchingGroup.events) / 3600000 : 0; // convert milliseconds to hours
                }),
                backgroundColor: colourCoverter("2"),
                borderColor: colourCoverter("2"),
                borderWidth: 1,
            },
        ],
    };

    return (
        <div>
            <div className="bar-chart">
                <Bar data={data} />
            </div>
        </div>
    );
};

export default EventGroupChartDisplay;
