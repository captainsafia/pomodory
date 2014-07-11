window.accurateInterval = function (time, fn) {
    var cancel, nextAt, timeout, wrapper, _ref;
    nextAt = new Date().getTime() + time;
    timeout = null;
    if (typeof time === 'function') _ref = [time, fn], fn = _ref[0], time = _ref[1];
    wrapper = function () {
        nextAt += time;
        timeout = setTimeout(wrapper, nextAt - new Date().getTime());
        return fn();
    };
    cancel = function () {
        return clearTimeout(timeout);
    };
    timeout = setTimeout(wrapper, nextAt - new Date().getTime());
    return {
        cancel: cancel
    };
};

var formatTime = function (milliseconds) {
    var pad = function (number) {
        return (number < 10 ? "0" : "") + number;
    };
    var notSecond = milliseconds % 1000;
    milliseconds = (milliseconds - notSecond) / 1000;
    var seconds = milliseconds % 60;
    milliseconds = (milliseconds - seconds) / 60;
    var mins = milliseconds % 60;
    return pad(mins) + ":" + pad(seconds);
}

var minutesToMilliseconds = function (minutes) {
    return minutes * 60 * 1000;
}

var Pomodoro = function () {
    var element = document.getElementById("countdown");
    var remaining, targetTime, pauseTime;

    this.start = function (duration) {
        targetTime = new Date().setTime(new Date().getTime() + duration)
        workTimer = accurateInterval(function () {
            run(targetTime);
        }, 1000)
    }

    var run = function (target) {
        remaining = target - new Date;
        if (remaining <= 0) {
            workTimer.cancel();
        } else {
            element.innerHTML = formatTime(remaining);
        }
    }

    this.pause = function () {
        workTimer.cancel();
        pauseTime = new Date().getTime();
    }

    this.resume = function () {
        targetTime = targetTime + (new Date().getTime() - pauseTime);
        workTimer = accurateInterval(function () {
            run(targetTime);
        }, 1000);
    }
}

document.addEventListener('DOMContentLoaded', function (event) {
    var timeOptions = {
        work: 1200000,
        short: 300000,
        long: 600000
    }
    var timer = new Pomodoro();
    var pomodoro = document.getElementById("pomodoro");
    var longBreak = document.getElementById("long_break");
    var shortBreak = document.getElementById("short_break");
    var pause = document.getElementById("pause");
    var gear = document.getElementById("options_cog");
    var countdown = document.getElementById("countdown");
    pomodoro.addEventListener('click', function (event) {
        timer.start(timeOptions.work);
    });
    longBreak.addEventListener('click', function (event) {
        timer.start(timeOptions.long);
    });
    shortBreak.addEventListener('click', function (event) {
        timer.start(timeOptions.short);
    });
    pause.addEventListener('click', function (event) {
        if (pause.innerText == "Pause") {
            timer.pause();
            pause.innerHTML = "Resume";
        } else {
            timer.resume();
            pause.innerHTML = "Pause";
        }
    });
    gear.addEventListener('click', function (event) {
        var options = document.getElementById("options");
        var style = window.getComputedStyle(options);
        var display = style.getPropertyValue("display");
        if (display == "none") {
            countdown.style.display = "none"
            options.style.display = "block";
        } else {
            options.style.display = "none";
            countdown.style.display = "block"
            timeOptions.work = minutesToMilliseconds(document.getElementById(
                "pomodoro_length").value);
            timeOptions.short = minutesToMilliseconds(document.getElementById(
                "short_break_length").value);
            timeOptions.long = minutesToMilliseconds(document.getElementById(
                "long_break_length").value);
            console.log(timeOptions);
        }
    });
});