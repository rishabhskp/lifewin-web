 //SINGLE BUTTON IMPLEMENTATION: http://stackoverflow.com/q/21202928/3065082

//	Simple example of using private variables
//
//	To start the stopwatch:
//		obj.start();
//
//	To get the duration in milliseconds without pausing / resuming:
//		var	x = obj.time();
// 
//	To pause the stopwatch:
//		var	x = obj.stop();	// Result is duration in milliseconds
//
//	To resume a paused stopwatch
//		var	x = obj.start();	// Result is duration in milliseconds
//
//	To reset a paused stopwatch
//		obj.stop();
//
// The Stopwatch Js file which holds the Numeric Timer representation
// It controls the enabling, starting, resetting the timer etc.
$(document).on('click', '.dropdown-menu', function (e) {
	e.stopPropagation();
});
var	clsStopwatch = function() {
		// Private vars
		var	startAt	= 0;	// Time of last start / resume. (0 if not running)
		var	lapTime	= 0;	// Time on the clock when last stopped in milliseconds

		var	now	= function() {
				return (new Date()).getTime(); 
			}; 
 
		this.setLapTime = function() {
			var data = JSON.parse(localStorage.getItem("meta"))["timer"];
			if(data!=null)
			lapTime = parseInt(data);
			}
		// Public methods
		// Start or resume
		this.start = function() {
			startAt	= startAt ? startAt : now();
			};

		// Stop or pause
		this.stop = function() {
				lapTime	= startAt ? lapTime + now() - startAt : lapTime;
				startAt	= 0; // Paused
			};

		// Reset
		this.reset = function() {
				lapTime = startAt = 0;
			};

		// Duration
		this.time = function() {
				return lapTime + (startAt ? now() - startAt : 0); 
			};
			
		this.pomotime = function() {
				var worktime = JSON.parse(localStorage.getItem("worktime")) * 60;
				return worktime*1000 - lapTime - (startAt ? now() - startAt : 0);
		};
	};

var x = new clsStopwatch();
var y = new clsStopwatch();
var type, clocktimer;

function pad(num, size) {
	var s = "0000" + num;
	return s.substr(s.length - size);
}

function formatTime(time) {
	var h = m = s = ms = 0;
	var newTime = '';

	h = Math.floor( time / 3600000 );
	time = time % 3600000;
	m = Math.floor( time / 60000 );
	time = time % (60000);
	s = Math.floor( time / 1000 );
	ms = time % 1000;

	newTime = pad(h, 2) + ':' + pad(m, 2) + ':' + pad(s, 2); // + ':' + pad(ms, 3);  (milliseconds removed)
	return newTime;
}

function update(type) {
	//update value on screen
	document.getElementById("time").innerHTML = formatTime(type? x.pomotime() : x.time());
	document.getElementById("timeelapsed").innerHTML =  formatTime(y.time());
	//update localStorage - done every second so that even when the system shuts down unexpectedly, the correct data remains.
	var meta = JSON.parse(localStorage.getItem("meta"));
	var log = JSON.parse(localStorage.getItem("log"));
	meta["lastTimer"] = x.time();
	meta["timer"] = y.time();
	//whether a log entry for timer has been found or not
	var found = 0;
	//add entry in log (1) lastTimer (2) timer
	for(var i=0; log[i]; i++)
		if(log[i]["key"]=="timer")
		{
			found = 1;
			log[i]["lastTimer"] = meta["lastTimer"];
			log[i]["timer"] = meta["timer"];
		}
	if(found == 0)
		log.push(JSON.parse('{"key":"timer", "lastTimer":"'+meta["lastTimer"]+'", "timer":"'+meta["timer"]+'"}'));
	//save all data
	localStorage.setItem("meta",JSON.stringify(meta));
	localStorage.setItem("log",JSON.stringify(log));
}

//start timer. para = 0 for normal and 1 for pomodoro
function start(para) {
	type = para;
	if(x.time())	//if a timer is already running
	stop();			//stop it (and save it's data too)
	clocktimer = setInterval("update("+type+")", 1000);   //use 1 instead of 1000 for millisecons
	addpoints = setInterval("addPoints(1)",1000*60*6);
	//stop pomodoro timer at 0
	if(type==1) {
		var worktime = JSON.parse(localStorage.getItem("worktime")) * 60;
		stoptimer = setInterval ("stop()",worktime*1000);
	}	
	if(type==2) {
		var resttime = JSON.parse(localStorage.getItem("resttime")) * 60;
		stoptimer = setInterval ("stop()",resttime*1000);
	}
	if(y.time()==0)
		y.setLapTime();
	x.start();
	y.start();
}

function stop() {
	//First Timer Becomes 0
	x.reset();
	//Second Timer Becomes 0
	y.stop();
	//Updation of timers and points stops
	clearInterval(clocktimer);
	clearInterval(addpoints);
}

function reset() {
	stop();
	x.reset();
	update();
	start();
}
/*end of stopwatch code */

/*start of timer code from app.php*/
$(document).ready(function() {
$('[title]').tooltip();
$('#sidebar .nav li').click(function(e) {
$('#sidebar .nav li').removeClass('active');
var $this = $(this);
if (!$this.hasClass('active')) {
$this.addClass('active');
}
});	
});
$(document).on('click', '.stop_fix', function() {
$('.icon-stopwatch').removeClass('running');
$('.icon-clock').removeClass('running');
});
$(document).on('click', '.icon-stopwatch', function() {
$(this).addClass('running');
$(".colorchange").css('color', 'rgb(124,175,255)');
$('.progress_div').hide();
$('.progress_div1').hide();
$('.progress_div2').show();
});
$(document).on('click', '.icon-clock', function() {
$(this).addClass('running');
$(".colorchange").css('color', 'rgb(124,175,255)');
$('.progress_div2').hide();
$('.progress_div1').hide();
$('.progress_div').show();
});
function alert_sucess(msg) {
$('.selection-success').html('<div class="alert alert-success">' + msg + '</div>');
$('.selection-success').fadeIn('slow');
$('.selection-success').addClass('open');
setTimeout(function() {
$('.selection-success').removeClass('open');
$('.selection-success').fadeOut('slow');
}, 2000);
}
function alert_error(msg) {
$('.selection-error').html('<div class="alert alert-danger">' + msg + '</div>');
$('.selection-error').fadeIn('slow');
$('.selection-error').addClass('open');
setTimeout(function() {
$('.selection-error').removeClass('open');
$('.selection-error').fadeOut('slow');
}, 2000);
}
/*all of progress bar related js follows*/
$(document).ready(function(){
var timer = null,
startTime = null,
progress = $("#progress").shieldProgressBar({
min: 0,
max: JSON.parse(localStorage.getItem("worktime")) * 60,
value: JSON.parse(localStorage.getItem("worktime")) * 60,
layout: "circular",
layoutOptions: {
circular: {
width: 10,
borderWidth: 0,
color: "#f37a5d"
}
},
reversed: true,
}).swidget();
var progress1 = $("#progress1").shieldProgressBar({
min: 0,
max: JSON.parse(localStorage.getItem("resttime")) * 60,
value: JSON.parse(localStorage.getItem("resttime")) * 60,
layout: "circular",
layoutOptions: {
circular: {
width: 10,
borderWidth: 0,
}
},
reversed: true,
}).swidget();
var progress2 = $("#progress2").shieldProgressBar({
min: 0,
max: 3600,
value: 20,
layout: "circular",
layoutOptions: {
circular: {
width: 10,
borderWidth: 0,
color: "#4890a8"
}
}
}).swidget();
$(".icon-clock").shieldButton({
events: {
click: function () {
clearInterval(timer);
startTime = Date.now();
timer = setInterval(updateProgress, 100);
$(".colorchange").css('color', 'rgb(124,175,255)');
}
}
});
$(".icon-stopwatch").shieldButton({
events: {
click: function () {
clearInterval(timer);
startTime = Date.now();
timer = setInterval(updateProgress2, 100);
$(".colorchange").css('color', 'rgb(124,175,255)');
}
}
});
$(".pause_btn").shieldButton({
events: {
click: function () {
$(".colorchange").css('color', 'rgb(0,0,0)');
clearInterval(timer);
}
}
});
function updateProgress() {
/*It should take in the value from local storage and should not be hard coded else the progress bar wont work*/
var remaining = JSON.parse(localStorage.getItem("worktime"))*60 - (Date.now() - startTime) / 1000;
progress.value(remaining);
if (remaining <= 0) {
clearInterval(timer);
//Calling the below function to start the rest timer progress bar and timer
restTimer();
}
}
function restTimer(){
//changeOptions1 is for updating the timer values again just in case the user changed it just before the start of the rest timer
	changeOptions1();
	$('.progress_div1').show(); //shows the rest timer progress bar
	$('.progress_div').hide(); //hides the work time progress bar
	$('.rest_btn').click(); //simulates click on hidden rest timer button to start the corresponding progress bar
	
}
//This is for handling the simulated click event on the rest_btn which is hidden
$(".rest_btn").shieldButton({
	events: {
		click: function () {
			clearInterval(timer);
			startTime = Date.now();
			timer = setInterval(updateProgress1, 100);//Calls update progress 1
		}
	}
});
//upadte progress 1 function
function updateProgress1() {
            var remaining = JSON.parse(localStorage.getItem("resttime")) * 60 - (Date.now() - startTime) / 1000;
            progress1.value(remaining);
            if (remaining <= 0) {
                clearInterval(timer);
				$('.icon-clock').click();
				$('.progress_div1').hide();
            }
        }
function changeOptions1() {
	var progress = $('#progress1').swidget(),
	options = progress.initialOptions,
	worktime = JSON.parse(localStorage.getItem("resttime")) * 60;
	console.log(progress.initialOptions);
	options.max = worktime;
	options.value = worktime;
	progress.refresh(options);
	//console.log('Function is called END AT BOTTOM');
}
function updateProgress2() {
var remaining = (Date.now() - startTime) / 1000;
progress2.value(remaining + 20);
if (remaining >= 3600) {
clearInterval(timer);
}
}
});
$(".pause_btn").shieldButton({
events: {
click: function () {
$(".colorchange").css('color', 'rgb(0,0,0)');
clearInterval(timer);
}
}
});
/*this code prevents the timer from closing due to bootstrap click propagation issue on drop down menu*/
$(document).on('click', '.did-it', function (e) {
$(".did-it").css('color', 'rgb(124,175,255)');
$(".did-it").css('font-weight', 'bold');
jQuery('.tick_img').each(function() {
$(this).prepend('<img src="img/tick.png" class="png-over user_img" />')
});
});
$('.sync-btn').on('click',function(){
$(this).find('span').addClass('rotate');
});
