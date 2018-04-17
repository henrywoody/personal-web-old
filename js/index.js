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


// function spawn() {
// 	console.log('spawning')
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



var livePoints = [[canvas.width/2, canvas.height, 3 * Math.PI/2]]

function spawn() {
	if (livePoints.length < 10000) {
		var newPoints = [];
		livePoints.forEach(point => {
			if (Math.random() < 0.01) {
				var child1 = [point[0], point[1], point[2] + Math.PI/6];
				var child2 = [point[0], point[1], point[2] - Math.PI/6];
				newPoints.push(child1, child2);
			} else {
				newPoints.push(point);
			}
		})
		livePoints = newPoints;
	}
}

function movePoints() {
	livePoints.forEach(point => {
		point[0] += Math.cos(point[2]);
		point[1] += Math.sin(point[2]);
	})
}


function drawPoints() {
	livePoints.forEach(point => {
		context.fillRect(point[0], point[1], 1,1);
	})
}









function runWelcome() {
	// context.clearRect(0, 0, context.canvas.width, context.canvas.height);
	context.fillStyle = '#000';
	spawn();
	movePoints();
	drawPoints();
	requestAnimFrame(runWelcome, canvas);
}

runWelcome();
