import React from "react";
import EventGroupingAndComparisionHelper from '../Utils/EventGroupingAndComparisionHelper.js';
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip, Legend} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import './EventList.css';


Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function EventList({ group, onBack }) {
  const data = {
    labels: group.events.map(event => event.name),
    datasets: [
      {
        label: 'Total Time in Hours',
        data: group.events.map(event => event.totalTime/ 3600000), // convert milliseconds to hours
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(75,192,192,0.6)',
        hoverBorderColor: 'rgba(75,192,192,1)',
      }
    ]
  };
  return (
    <div>
      <button onClick={onBack}>Back to groups</button>
    <div className="bar-chart">
       <Bar data={data} />
    </div>
    </div>
  );
}

export default EventList;
