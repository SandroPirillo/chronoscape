class Event {
    constructor(name, startTime, endTime, colour) {
        this.name = name;
        this.startTime = startTime;
        this.endTime = endTime;
        this.totalTime = endTime - startTime;
        this.colour = colour;
    }
}

module.exports = Event;