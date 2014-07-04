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

var formatTime = function(milliseconds) {
    var pad = function(number) {
        return (number < 10 ?  "0": "") + number; 
    };
    var notSecond = milliseconds % 1000;
    milliseconds = (milliseconds - notSecond) / 1000;
    var seconds = milliseconds % 60;
    milliseconds = (milliseconds - seconds) / 60;
    var mins = milliseconds % 60; 
    return pad(mins) + ":" + pad(seconds);
}

var Pomodoro = function() {
    var element = document.getElementById("countdown");
    var remaining, targetTime, pauseTime;

    this.start = function(duration) {
        targetTime = new Date().setTime(new Date().getTime() + duration)
        workTimer = accurateInterval(function() {
            run(targetTime);
        }, 1000)
    }

    var run = function(target) {
        remaining = target - new Date;
        if (remaining <= 0) {
            workTimer.cancel();
        } else {
            element.innerHTML = formatTime(remaining); 
        }
    }

    this.pause = function() {
        workTimer.cancel();
        pauseTime = new Date().getTime();
    }

    this.resume = function() {
        targetTime = targetTime + (new Date().getTime() - pauseTime);
        workTimer = accurateInterval(function() {
            run(targetTime);
        }, 1000);
    }
}

document.addEventListener('DOMContentLoaded', function(event) {
    var timer = new Pomodoro();
    var pomodoro = document.getElementById("pomodoro");
    var longBreak = document.getElementById("long_break");
    var shortBreak = document.getElementById("short_break");
    var pause = document.getElementById("pause");
    pomodoro.addEventListener('click', function(event) {
        timer.start(7000);
    });
    longBreak.addEventListener('click', function(event) {
        timer.start(6000);
    });
    shortBreak.addEventListener('click', function(event) {
        timer.start(5000);
    });
    pause.addEventListener('click', function(event) {
        if (pause.innerText == "Pause") {
            timer.pause();
            pause.innerHTML = "Resume";
        } else {
            timer.resume();
            pause.innerHTML = "Pause";
        }
    });
});
