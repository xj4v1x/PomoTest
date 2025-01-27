
/* *************************************************** */
/* ************** *  POMODORO  ** ******************* */
/* *************************************************** */

const mins = document.getElementById("mins");
const secs = document.getElementById("secs");
let tiempoTotal = 0;
const start_button = document.getElementById("start_button");
const pause_button = document.getElementById("pause_button");
const stop_button = document.getElementById("stop_button");

const worktime_button = document.getElementById("worktime_button");
const shortbreak_button = document.getElementById("shortbreak_button");
const longbreak_button = document.getElementById("longbreak_button");

const body = document.body;
const root = document.documentElement;

// Configuración del Tiempo para cada modo
let pomodoro = true; let pMins = 25;
let shortBreak = false; let sbMins = 5;
let longBreak = false; let lbMins = 15;

const speed = 100; /* 1000 = 1 segundo */
// Minutos y Segundos del timer
let pomodoroMins;
let pomodoroSecs;
// Estado de los botones del timer
let running = false;
let inpause = false;


// Selecciona el círculo
const circle = document.querySelector(".progress-ring__circle");
const outcircle = document.querySelector(".out-ring__circle");
const incircle = document.querySelector(".in-ring__circle");

// Radio del círculo
const radius = circle.r.baseVal.value;
const inradius = incircle.r.baseVal.value;
const outradius = outcircle.r.baseVal.value;

// Perímetro del círculo (longitud del trazo)
const circumference = 2 * Math.PI * radius;
const incircumference = 2 * Math.PI * inradius;
const outcircumference = 2 * Math.PI * outradius;

// Establecer el perímetro como stroke-dasharray
circle.style.strokeDasharray = `${circumference} ${circumference}`;
incircle.style.strokeDasharray = `${incircumference} ${incircumference}`;
outcircle.style.strokeDasharray = `${outcircumference} ${outcircumference}`;
circle.style.strokeDashoffset = circumference;


incircle.style.strokeDashoffset = incircumference;
outcircle.style.strokeDashoffset = outcircumference;

const inoffset = incircumference - 1 * incircumference;
incircle.style.strokeDashoffset = inoffset;
const outoffset = outcircumference - 1 * outcircumference;
outcircle.style.strokeDashoffset = outoffset;


function setProgress(percentage) {
    const offset =  (percentage / 100) * circumference;
    circle.style.strokeDashoffset = offset;    
}




window.addEventListener("load", (event) => {
    timer = undefined;
    loadPomodoro();
});

function loadPomodoro(){
    if (pomodoro == true) {
        mins.innerText = pMins;
    } else if (shortBreak == true) {
        mins.innerText = sbMins;
    } else {
        mins.innerText = lbMins;
    };
    secs.innerText = "00";
    pomodoroMins = parseInt(mins.innerText);
    pomodoroSecs = parseInt(secs.innerText);
    tiempoTotal = pomodoroMins*60 + pomodoroSecs;
    if (!running) {
        start_button.classList.remove('active');
    }
};


/**************************** START BUTTON ******************************/
/**************************** START BUTTON ******************************/
/**************************** START BUTTON ******************************/
start_button.addEventListener("click", function () {    
    start_button.classList.toggle("active");
    pause_button.classList.remove('active');
    running = !running;    
    if (running) {    
        startPomodoro();
    } else {                
        stopPomodoro();
    }     
    loadPomodoro(); 
});
function startPomodoro(){
    if (typeof timer === "undefined") {
        if (!inpause) {            
            timer = setInterval(() => {
                const porcentaje = (pomodoroMins*60+pomodoroSecs)*100/tiempoTotal;
                if (pomodoroSecs>=0 || pomodoroMins>=0) {
                    pomodoroSecs -= 1;                    
                    if (pomodoroSecs < 0 && pomodoroMins>0) {             
                        pomodoroSecs = 59;
                        pomodoroMins -= 1;
                    }
                    if (pomodoroSecs<0) {
                        loadPomodoro();
                        stopPomodoro();
                    }
                } else {
                    loadPomodoro();
                    stopPomodoro();
                }
                pomodoroSecs<10 ? secs.innerText = '0' + pomodoroSecs : secs.innerText = pomodoroSecs;
                pomodoroMins<10 ? mins.innerText = '0' + pomodoroMins : mins.innerText = pomodoroMins;
                setProgress(porcentaje);
            }, speed);
        } else {
            loadPomodoro();
            stopPomodoro();
        }
    } else {
        stopPomodoro();
    }
};


/**************************** STOP BUTTON ******************************/
/**************************** STOP BUTTON ******************************/
/**************************** STOP BUTTON ******************************/
stop_button.addEventListener("click", function () {                    
    stopPomodoro();    
    loadPomodoro(); 
});
function stopPomodoro(){
    running = false;
    inpause = false;
    start_button.classList.remove('active');    
    pause_button.classList.remove('active');
    loadPomodoro();
    if (typeof timer != "undefined") {
        clearInterval(timer);
        timer = undefined;
    }
}

/**************************** PAUSE BUTTON ******************************/
/**************************** PAUSE BUTTON ******************************/
/**************************** PAUSE BUTTON ******************************/
pause_button.addEventListener("click", function () {
    pausePomodoro();
});

function pausePomodoro(){
    if (running) {
        running = false;
        inpause = true;        
        clearInterval(timer);
        start_button.classList.toggle('active');
        pause_button.classList.toggle('active');
    } else if (inpause) {
        inpause = false;
        running = true;        
        timer = undefined;
        start_button.classList.toggle('active');
        pause_button.classList.toggle('active');
        startPomodoro();
    }
}

/**************************** MODE BUTTONS ******************************/
/**************************** MODE BUTTONS ******************************/
/**************************** MODE BUTTONS ******************************/
worktime_button.addEventListener("click", function () {
    pomodoro = true; shortBreak = false; longBreak = false;
    pomodoroMins = pMins; pomodoroSecs = 0;
    worktime_button.classList.add('active');
    shortbreak_button.classList.remove('active');
    longbreak_button.classList.remove('active');
    start_button.classList.remove('active');
    pause_button.classList.remove('active');
    stopPomodoro();
    loadPomodoro();
});

shortbreak_button.addEventListener("click", function () {    
    pomodoro = false; shortBreak = true; longBreak = false;
    pomodoroMins = sbMins; pomodoroSecs = 0;
    worktime_button.classList.remove('active');
    shortbreak_button.classList.add('active');
    longbreak_button.classList.remove('active');
    start_button.classList.remove('active');
    pause_button.classList.remove('active');
    stopPomodoro();
    loadPomodoro();
});

longbreak_button.addEventListener("click", function () {    
    pomodoro = false; shortBreak = false; longBreak = true;
    pomodoroMins = lbMins; pomodoroSecs = 0;    
    worktime_button.classList.remove('active');
    shortbreak_button.classList.remove('active');
    longbreak_button.classList.add('active');
    start_button.classList.remove('active');
    pause_button.classList.remove('active');
    stopPomodoro();
    loadPomodoro();
});