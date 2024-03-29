window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
          	window.setTimeout(callback, 1000 / 60);
          };
})();




var canvas = document.getElementById('index-canvas');
var context = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


// context.fillStyle = '#000';
// context.beginPath();
// context.arc(100, 100, 50, 0, 2 * Math.PI);
// context.fillRect(10,10,200,200);
// context.fill();
// context.closePath();


// var grid = [];

// for (var i = 0; i < 100; i++) {
// 	var newRow = [];
// 	for (var j = 0; j < 100; j++) {
// 		newRow.push(0);
// 	}
// 	grid.push(newRow);
// }

// grid[50][50] = 1;


// function split() {
// 	console.log('spliting')
// 	for (var i = 0; i < grid.length; i++) {
// 		for (var j = 0; j < grid[0].length; j++) {
// 			if (grid[i][j] == 1) {
// 				var m,n;
// 				if (Math.random() < 0.5) {
// 					m = Math.min(i + 1, grid.length-1);
// 				} else {
// 					m = Math.max(i - 1, 0);
// 				}
// 				if (Math.random() < 0.5) {
// 					n = Math.min(j + 1, grid.length-1);
// 				} else {
// 					n = Math.max(j - 1, 0);
// 				}
// 				grid[m][n] = 1;
// 			}
// 		}
// 	}
// }

// function drawPoints() {
// 	for (var i = 0; i < grid.length; i++) {
// 		for (var j = 0; j < grid[0].length; j++) {
// 			context.fillStyle = grid[i][j] == 1 ? '#000' : '#fff';
// 			context.fillRect(5*i,5*j,5*(i+1), 5*(j+1));
// 		}
// 	}
// }

// function runWelcome() {
// 	// context.clearRect(0, 0, context.canvas.width, context.canvas.height);
// 	context.fillStyle = '#000000';
// 	split();
// 	drawPoints();
// 	requestAnimFrame(runWelcome, canvas);
// }

// runWelcome();











// ==================================

function setPoints() {
	var numPoints = Math.round(Math.random() * 2 + 1) * 2;
	var points = [];
	for (var n = 0; n < numPoints; n++) {
		points.push({ x: canvas.width/2, y: canvas.height/2, d: 2*n * Math.PI/numPoints });
	}
	return points;
}

function addPointSet(pointSets, id) {
	pointSets.push({id: id, alpha: 1, age: 0, pointSet: setPoints()});
	return pointSets;
}

function split(livePoints) {
	if (livePoints.length <= maxPointSetSize && Math.random() < splitProb) {
		return livePoints.reduce((s,p) => s.push({
				x: p.x,
				y: p.y,
				d: p.d + splitAngleDiff
			},
			{
				x: p.x,
				y: p.y,
				d: p.d - splitAngleDiff
			}) && s, []);
	} else {
		return livePoints;
	}
}

function randomizeDirections(livePoints) {
	return livePoints.map(point => {
		let { x,y,d } = point;
		if (Math.random() < 0.1) {
			return { 
				x: x,
				y: y,
				d: d * Math.random() < 0.5 ? 1.05 : 0.95
			};
		}
	})
}

function movePoints(livePoints) {
	return livePoints.map(point => {
		let { x,y,d } = point
		return {
			x: x + stepSize * Math.cos(d),
			y: y + stepSize * Math.sin(d),
			d: d
		}
	})
}


function drawPoints(livePoints) {
	livePoints.forEach(point => {
		context.fillRect(point.x, point.y, stepSize,stepSize);
	})
}




var stepSize = 1;
var splitProb = stepSize/2 * 0.015;
var angleChoices = [2,3,4,6,10].map(x => Math.PI/x);
var splitAngleDiff = angleChoices[Math.round(Math.random() * (angleChoices.length - 1))];
var pointSets = [];
var maxPointSetSize = 2**7;
var maxAge = 5000

var generation = 0;
var fadeOutTime = 900;
var fadeFactor = 1.3;
var phaseTime = 750;
var phaseIndex = 0;
var totalPhases = 0;
var maxPhases = 2;
var refreshTime = Math.round(Math.log(stepSize)) + 1;

// seafoam
var phases = [
	['#ffffff'],
	['#cff09e'],
	['#a8dba8'],
	['#79bd9a'],
	['#3b8686'],
	['#0b486b'],
	// ['#000000']
];

var phases = [['#ffffff']];

// rainbow
var phases = [
	['#ffffff'],
	['#e03a3e'],
	['#f5821f'],
	['#fdb827'],
	['#61bb46'],
	['#009ddc'],
	['#6262bb'],
	['#963d97']
];

var phases = [
	['#ffffff'],
	['#ffd700'], //gold
]

// fire & ice
// var phases = [
// 	// blues
// 	['#1a54e5'],
// 	['#7ddcff'],
// 	['#ffffff'],
// 	// reds
// 	['#ff362c'],
// 	['#ff7925'],
// 	['#ffd052'],
// ]


pointSets = addPointSet(pointSets, phaseIndex);
totalPhases++;

function runWelcome() {
	if (generation % refreshTime == 0) {
		pointSets = pointSets.map(info => {
			let { id, alpha, age, pointSet } = info;

			let newAlpha = alpha;
			let before = pointSet.length;
			pointSet = split(pointSet);
			if  (pointSet.length > before) {
				newAlpha /= fadeFactor;
			}

			// randomizeDirections(pointSet);
			pointSet = movePoints(pointSet);


			// context.clearRect(0, 0, context.canvas.width, context.canvas.height);
			// context.globalAlpha = ((fadeOutTime - generation++)/fadeOutTime);
			context.fillStyle = phases[id][0]; /*night mode*/
			context.globalAlpha = newAlpha;
			drawPoints(pointSet);
			return {id: id, alpha: newAlpha, age: ++age, pointSet: pointSet}
		})
	}
		
	if (generation++ >= phaseTime) {
		if (totalPhases++ < maxPhases) {
			phaseIndex = (phaseIndex + 1) % phases.length;
			// if (phaseIndex % 3 == 0) {
			// 	context.clearRect(0, 0, context.canvas.width, context.canvas.height);
			// }

			pointSets = addPointSet(pointSets, phaseIndex);

			// reset counter
			generation = 0;
		}
	}

	// remove old ones
	let toRemove = pointSets.map(info => {
		let { age } = info;
		if (age++ > maxAge)
			return true;
	})
	for (var i = 0; i < pointSets.length; i++) {
		if (toRemove[i])
			pointSets.splice(i, 1);
	}

	requestAnimFrame(runWelcome, canvas);
}

runWelcome();
