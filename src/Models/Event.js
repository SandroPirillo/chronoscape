class Event {
    constructor(name, startTime, endTime) {
        this.name = name;
        this.startTime = startTime;
        this.endTime = endTime;
        this.totalTime = endTime - startTime;
    }
}

module.exports = Event;