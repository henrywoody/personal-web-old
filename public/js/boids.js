window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
          	window.setTimeout(callback, 1000 / 60);
          };
})();



function getAngleBetween(a, b) {
	// var dx = Math.abs(b[0] - a[0]) <= canvas.width/2 ? b[0] - a[0] : b[0] - a[0] + (b[0] > a[0] ? -canvas.width : canvas.width)
	// var dy = Math.abs(b[1] - a[1]) <= canvas.height/2 ? b[1] - a[1] : b[1] - a[1] + (b[1] > a[1] ? -canvas.height : canvas.height)
	var dx = b[0] - a[0];
	var dy = b[1] - a[1];
	return (Math.atan2(dy, dx) + 2 * Math.PI) % (2 * Math.PI);
}

function getDistanceBetween(a, b){
	// var dx = Math.min(Math.max(a[0], b[0]) - Math.min(a[0], b[0]),
	// 				  canvas.width + Math.min(a[0], b[0]) - Math.max(a[0], b[0]));
	// var dy = Math.min(Math.max(a[1], b[1]) - Math.min(a[1], b[1]),
	// 				  canvas.height + Math.min(a[1], b[1]) - Math.max(a[1], b[1]));
	var dx = b[0] - a[0];
	var dy = b[1] - a[1];
	return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
}

function getAverageAngle(angles, weights=null){
	if (angles.length == 1){
		return angles[0]
	}
	weights = weights || angles.map(x => 1);
	var coordSum = [0,0];
	for (var i = 0; i < angles.length; i++) {
		coordSum[0] += Math.cos(angles[i]) * weights[i];
		coordSum[1] += Math.sin(angles[i]) * weights[i];
	}
	var weightSum = weights.reduce((x,y) => x + y);
	var coordAve = coordSum.map(x => x/weightSum);
	var aveAngle = Math.atan2(coordAve[1], coordAve[0]);
	return aveAngle;
}

function getRandomColor(rRange=[0,255], gRange=[0,255], bRange=[0,255]) {
	return "#" + [rRange, gRange, bRange].map(x => (Math.round(Math.random() * (x[1] - x[0])) + x[0]).toString(16)).map(x => x.length < 2 ? '0' + x : x).join('');
}

function getColorDifference(c1, c2) {
	var difference = 0;
	for (var i = 0; i < 3; i++) {
		difference += Math.abs(parseInt(c1.slice(2 * i + 1, 2 * (i + 1) + 1), 16) - parseInt(c2.slice(2 * i + 1, 2 * (i + 1) + 1), 16));
	}
	return difference;
}

function Boid(color, initPosition, initVelocity=[0,0]) { //velo = (r, theta)
	this.size = boidSize;
	this.color = color;
	this.position = initPosition;
	this.velocity = initVelocity;
	this.id = boidCount++;


	this.getAveVelocityPositionAvoid = function() {
		var speedSum = 0;
		var angleSum = [];
		var positionSum = [0, 0];
		var avoidData = []; // [[magnitude, angle], ...]
		var numInView = 0;

		var boidDistances = allBoids.map(b => [b, getDistanceBetween(this.position, b.position)]);
		for (var i = 0; i < allBoids.length; i++) {
			var [otherBoid, distance] = boidDistances[i]
			if (otherBoid != this && distance <= maxViewDistance) {
				var angle = getAngleBetween(this.position, otherBoid.position);
				if (angle >= Math.PI/6 || angle <= 11 * Math.PI/6 ){
					if (flockingOn && (!teamsOn || getColorDifference(this.color, otherBoid.color) <= colorTolerance)) {
						++numInView;
						speedSum += otherBoid.velocity[0];
						angleSum.push(otherBoid.velocity[1]);

						positionSum[0] += otherBoid.position[0];
						positionSum[1] += otherBoid.position[1];
					}
					avoidData.push([1/(distance), angle + Math.PI]); //aaaaa
				}
				if (distance <= maxAvoidDistance){ //bounce
					this.position[0] += otherBoid.position[0] - this.position[0] > 0 ? -collisionScale * (maxAvoidDistance - distance) : collisionScale * (maxAvoidDistance - distance);
					this.position[1] += otherBoid.position[1] - this.position[1] > 0 ? -collisionScale * (maxAvoidDistance - distance) : collisionScale * (maxAvoidDistance - distance);
					otherBoid.position[0] += this.position[0] - otherBoid.position[0] > 0 ? -collisionScale * (maxAvoidDistance - distance) : collisionScale * (maxAvoidDistance - distance);
					otherBoid.position[1] += this.position[1] - otherBoid.position[1] > 0 ? -collisionScale * (maxAvoidDistance - distance) : collisionScale * (maxAvoidDistance - distance);
				}
			}
		}

		if (numInView > 0) {
			var aveVelocity = [speedSum/numInView, getAverageAngle(angleSum)];
			var avePosition = positionSum.map(x => x/numInView);
			var aveAvoid = [avoidData.reduce((x,y) => x + y[0], 0)/avoidData.length, getAverageAngle(avoidData.map(x => x[1]), weights=avoidData.map(x => x[0]))];
			return [aveVelocity, avePosition, aveAvoid];
		} else {
			return false;
		}
	}

	this.applyRules = function() {
		var aveVelocityPositionAvoid = this.getAveVelocityPositionAvoid();
		if (aveVelocityPositionAvoid){
			var [aveVelocity, avePosition, aveAvoid] = aveVelocityPositionAvoid;
			var angleToCenter = getAngleBetween(this.position, avePosition);

			var newVelocity = [(aveVelocitySpeedWeight * aveVelocity[0] + aveAvoidSpeedWeight * aveAvoid[0])/(aveVelocitySpeedWeight + aveAvoidSpeedWeight), getAverageAngle([aveVelocity[1], angleToCenter, aveAvoid[1]], [aveVelocityAngleWeight, angleToCenterAngleWeight, aveAvoidAngleWeight])]; //aaaaa
			return newVelocity;
		} else {
			return this.velocity;
		}
	};

	this.updateVelocity = function() {
		this.velocity = this.applyRules();
	};

	this.updatePosition = function() {
		this.updateVelocity();
		this.position[0] += this.velocity[0] * Math.cos(this.velocity[1]);
		this.position[1] += this.velocity[0] * Math.sin(this.velocity[1]);

		this.position[0] = (this.position[0] + canvas.width) % canvas.width;
		this.position[1] = (this.position[1] + canvas.height) % canvas.height;
	};

	this.displaySelf = function() {
		context.fillStyle = this.color;
		context.strokeStyle = this.color;
		context.beginPath();
		context.arc(this.position[0], this.position[1], this.size, 0, 2 * Math.PI);
		context.fill();
		context.closePath();
		context.beginPath();
		context.moveTo(...this.position);
		context.lineTo(1.5 * this.size * Math.cos(this.velocity[1]) + this.position[0], 1.5 * this.size * Math.sin(this.velocity[1]) + this.position[1]);
		context.stroke();
	};
}

var colorOptions = ["#ff0000", "#00ff00", "#0000ff"];
function initBoids(num) {
	for (var i = 0; i < num; i++){
		var color = getRandomColor(); //colorOptions[Math.floor(Math.random() * colorOptions.length)]; //getRandomColor();
		var initPosition = [Math.random() * canvas.width, Math.random() * canvas.height];
		var initVelocity = [Math.random() * (maxSpeed - 2) + 2, Math.random() * 2 * Math.PI];
		allBoids.push(new Boid(color, initPosition, initVelocity));
	}
}

function updateBoidPositions() {
	for (var i = 0; i < allBoids.length; i++){
		allBoids[i].updatePosition();
	}
}

function displayBoids() {
	for (var i = 0; i < allBoids.length; i++){
		allBoids[i].displaySelf();
	}	
}

function runBoids() {
	context.clearRect(0,0, context.canvas.width, context.canvas.height);
	updateBoidPositions();
	displayBoids();
}






var requestId;
var canvas, context;
var alreadySet = false;

var allBoids = [];
var boidCount = 0;
var populationSize;
var maxSpeed = 2;

var flockingOn;
var teamsOn;
var colorTolerance = 120;

var boidSize = 3;
var maxViewDistance = 30;
var maxAvoidDistance = boidSize * 2;
var collisionScale = 0.5;

var aveVelocitySpeedWeight = 1;
var aveAvoidSpeedWeight = 0;
var aveVelocityAngleWeight = 10;
var angleToCenterAngleWeight = 3;
var aveAvoidAngleWeight = 2.8;

function setVarsFromInput() {
	newPopulationSize = Number(document.getElementById("boids-population-input").value);
	if (newPopulationSize > populationSize) {
		initBoids(newPopulationSize - populationSize);
	} else if (newPopulationSize < populationSize) {
		allBoids = allBoids.slice(0, newPopulationSize);
	}
	populationSize = newPopulationSize;

	flockingOn = document.getElementById("boids-flocking-input").checked;
	teamsOn = document.getElementById("boids-teams-input").checked;

}

function makeCanvas() {
	if (document.getElementById("boids-canvas-full")) {
		canvas = document.getElementById("boids-canvas-full");
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		canvas.style.width = (canvas.width *  0.0625).toString() + "rem";
		canvas.style.height = (canvas.height * 0.0625).toString() + "rem";
	} else {
		canvas = document.getElementById("boids-canvas");
		canvas.width = window.innerWidth * .6;
		canvas.height = window.innerHeight * .5;
		canvas.style.width = (canvas.width *  0.0625).toString() + "rem";
		canvas.style.height = (canvas.height * 0.0625).toString() + "rem";
	}
	context = canvas.getContext("2d");

	setVarsFromInput();
	initBoids(populationSize);
}

function animateBoids() {
	makeCanvas();
	runner();
	if (!alreadySet){
		changeStartToUpdateButton();
		alreadySet = true;
	}
}

function runner() {
	requestId = undefined;
	runBoids();
	if (!requestId){
		requestId = requestAnimFrame(runner, canvas);
	}
}

function updateBoids() {
	setVarsFromInput();
}

function resetBoids() {
	context.clearRect(0,0, context.canvas.width, context.canvas.height);

	allBoids = [];
	initBoids(populationSize);
}

function clearBoids() {
	// called when collapsing the holder for Boids
	if (context) {
		context.clearRect(0, 0, canvas.width, canvas.height);
	}
	if (requestId) {
		window.cancelAnimationFrame(requestId);
		requestId = undefined;
	}
	canvas = null;
	context = null;
	allBoids = null;
	changeUpdateToStartButton();
}

function changeStartToUpdateButton() {
	btn = document.querySelector('.btn-primary.start#boids-btn');
	btn.classList.remove("start");
	btn.classList.add("update");
	btn.onclick = function() {
		updateBoids();
	}
	btn.innerHTML = "Update";
}

function changeUpdateToStartButton() {
	btn = document.querySelector('.btn-primary.update#boids-btn');
	if (btn) {
		btn.classList.remove("update");
		btn.classList.add("start");
		btn.onclick = function() {
			animateBoids();
		}
		btn.innerHTML = "Start";
		alreadySet = false;
	}
}








