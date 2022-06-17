class Clock {
    constructor(time) {
        this.currentTime = time;
        this.clockInterval = null;
        this.time = time;
        this.clockValueDiv = document.getElementById("clockValue");
        this.clockValueDiv.textContent = time;
        this.onTimeEnd = () => {};
    }

    start() {
        if (this.clockInterval != null || this.currentTime <= 0) return;
        this.clockValueDiv.textContent = this.currentTime;
        this.clockInterval = setInterval(() => {
            this.displayTime();
        }, 1000);
    }

    displayTime() {
        this.currentTime--;
        this.clockValueDiv.textContent = this.currentTime;
        if (this.currentTime == 0) {
            clearInterval(this.clockInterval);
            this.clockInterval = null;
            this.onTimeEnd();
        }
    }

    reset() {
        this.currentTime = this.time;
    }

    stop() {
        if (this.clockInterval == null) return;
        clearInterval(this.clockInterval);
        this.clockInterval = null;
    }
}
