window.accurateInterval = function(time, fn) {
    var cancel, nextAt, timeout, wrapper, _ref;
    nextAt = new Date().getTime() + time;
    timeout = null;
    if (typeof time === 'function') _ref = [time, fn], fn = _ref[0], time = _ref[1];
    wrapper = function() {
        nextAt += time;
        timeout = setTimeout(wrapper, nextAt - new Date().getTime());
        return fn();
    };
    cancel = function() {
        return clearTimeout(timeout);
    };
    timeout = setTimeout(wrapper, nextAt - new Date().getTime());
    return {
        cancel: cancel
    };
};

var formatTime = function(seconds) {
    minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;
    return minutes + ":" + seconds; 
}

var Pomodoro = function(option) {
    var element = document.getElementById("countdown");
    var workTimer, breakTimer, workTimerState, breakTimerState;

    this.start = function(option) {
        targetTime = new Date().setTime(new Date().getTime() + 5000)
        workTimer = accurateInterval(function() {
            run(targetTime);
        }, 1000)
    }

    var run = function(target) {
        var remaining = target - new Date;
        if (remaining <= 0) {
            workTimer.cancel();
            element.innerHTML = "Done";
        } else {
            element.innerHTML = remaining; 
        }
    }
}

document.addEventListener('DOMContentLoaded', function(event) {
    var button = document.getElementById("controller"); 
    var timer = new Pomodoro();
    button.addEventListener('click', function(event) {
        if (this.innerText == "Start") {
            running = true;
            this.innerText = "Pause";
            timer.start();
        } else if (this.innerText == "Pause") {
            running = false;
            this.innerText = "Resume"
        } else {
            running = true;
            this.innerText = "Pause";
        }
    });
});
