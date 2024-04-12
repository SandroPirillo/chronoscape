import React, { useEffect, useState } from 'react';

const Dashboard = () => {
    const [calendarData, setCalendarData] = useState([]);

    useEffect(() => {
        // Fetch data from Google Calendar API
        const fetchData = async () => {
            try {
            const currentDate = new Date();
            const firstDayOfLastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
            const lastDayOfLastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0, 23, 59, 59);

            const response = await gapi.client.calendar.events.list({
                calendarId: "primary",
                timeMin: firstDayOfLastMonth.toISOString(),
                timeMax: lastDayOfLastMonth.toISOString(),
                showDeleted: false,
                singleEvents: true,
                orderBy: "startTime",
            });
            const events = response.result.items;
            setCalendarData(events);
            } catch (error) {
            console.error('Error fetching calendar data:', error);
            }
        };

        fetchData();
    }, []);

    // Calculate total time spent for each event with the same name
    const calculateTotalTime = (eventName) => {
        const eventsWithSameName = calendarData.filter(event => event.summary === eventName);
        let totalTime = 0;

        eventsWithSameName.forEach(event => {
            const startTime = new Date(event.start.dateTime);
            const endTime = new Date(event.end.dateTime);
            const eventTime = endTime - startTime;
            totalTime += eventTime;
        });

        return totalTime;
    };
    
    const formatTime = (timeInMilliseconds) => {
        const seconds = Math.floor((timeInMilliseconds / 1000) % 60);
        const minutes = Math.floor((timeInMilliseconds / (1000 * 60)) % 60);
        const hours = Math.floor((timeInMilliseconds / (1000 * 60 * 60)) % 24);
    
        return `${hours}h ${minutes}m ${seconds}s`;
    };

    // Calculate total time spent and count for each event with the same name
    const calculateTotalTimeAndCount = (eventName) => {
        const eventsWithSameName = calendarData.filter(event => event.summary === eventName);
        let totalTime = 0;
        let eventCount = eventsWithSameName.length;

        eventsWithSameName.forEach(event => {
            const startTime = new Date(event.start.dateTime);
            const endTime = new Date(event.end.dateTime);
            const eventTime = endTime - startTime;
            totalTime += eventTime;
        });

        return { totalTime, eventCount };
    };

    return (
        <div>
            {/* Render your calendar data */}
            {calendarData.map((event) => {
                const { totalTime, eventCount } = calculateTotalTimeAndCount(event.summary);

                return (
                    <div key={event.id}>
                        <h3>{event.summary}</h3>
                        <p>{event.description}</p>
                        <p>Total time spent: {formatTime(totalTime)}</p>
                        <p>Event count: {eventCount}</p>
                        <p>Start time: {new Date(event.start.dateTime).toLocaleString()}</p>
                        {/* Render other event details */}
                    </div>
                );
            })}
        </div>
    );
};

export default Dashboard;