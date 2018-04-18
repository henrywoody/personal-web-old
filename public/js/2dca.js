window.requestAnimFrame = (function(){
  return window.requestAnimationFrame       ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame    ||
		function( callback ){
			window.setTimeout(callback, 1000 / 60);
		  };
})();

function toFixedLengthBinary (num, len, array=true){
	var numStr = num.toString(2);
	numStr = ("0".repeat(len - numStr.length) + numStr);
	if (array == true)
		return numStr.split('').map(j => Number(j));
	else
		return numStr;
}


var canvas = document.getElementById("o2dca-canvas");
var context = canvas.getContext("2d");
canvas.width = window.innerWidth * .6;
canvas.height = window.innerHeight * .6;
canvas.style.width = (canvas.width *  0.0625).toString() + "rem";
canvas.style.height = (canvas.height * 0.0625).toString() + "rem";
var requestId;

function caGrid(n_rows=150, n_cols=150) {
	this.n_rows = n_rows;
	this.n_cols = n_cols;
	this.cells = [];
	this.nextCells = [];
	this.cellSize = 3;
	for (var i = 0; i < this.n_rows; i++) {
		var row = [];
		var nextRow = [];
		for (var j = 0; j < this.n_cols; j++) {
			// row.push('0');
			// row.push(Math.random() < Math.min(1/Math.abs(50-i), 1/Math.abs(50-j)) * 2 ? '1' : '0');
			row.push(Math.random() < 0.11 ? '1' : '0');
			nextRow.push('0');
		}
		this.cells.push(row);
		this.nextCells.push(nextRow);
	}

	this.apply = function(rule) {
		for (var i = 1; i < this.n_rows - 1; i++) {
			for (var j = 1; j < this.n_cols - 1; j++) {
				var reference = '';
				reference += this.cells[i+1][j];
				reference += this.cells[i+1][j+1];
				reference += this.cells[i][j+1];
				reference += this.cells[i-1][j+1];
				reference += this.cells[i-1][j];
				reference += this.cells[i-1][j-1];
				reference += this.cells[i][j-1];
				reference += this.cells[i+1][j-1];
				reference += this.cells[i][j];
				this.nextCells[i][j] = rule[reference];
			}
		}
		for (var i = 0; i < this.n_rows; i++) {
			this.cells[i] = this.nextCells[i].slice();
		}
	};

	this.displaySelf = function(colorScheme, context) {
		for (var i = 0; i < n_rows; i++) {
			for (var j = 0; j < n_cols; j++) {
				var color = colorScheme[this.cells[i][j]];
				context.fillStyle = color;
				context.fillRect(j*this.cellSize, i*this.cellSize, this.cellSize, this.cellSize);
			}
		}
	};

	this.updateSelf = function(rule, colorScheme, context) {
		this.apply(rule);
		this.displaySelf(colorScheme, context);
	};

}


// rules : top-right-bottom-left-self
var langtonLoop = {
	'00000': '0',
}

var binaryColors = {
	'0': '#ffffff',
	'1': '#000000'
}

var gameOfLife = {};
var states = ['0', '1'];
for (var i = 0; i < states.length; i++){
	for (var j = 0; j < 256; j++) {
		var new_state;
		var neighbors = toFixedLengthBinary(j, 8, false);
		var n_neighbors = (neighbors.match(/1/g) || []).length;
		switch (n_neighbors) {
			case 0:
				new_state = '0';
				break;
			case 1:
				new_state = '0';
				break;
			case 2:
				new_state = states[i];
				break;
			case 3:
				new_state = '1';
				break;
			default:
				new_state = '0';
		}

		gameOfLife[neighbors + states[i]] = new_state;
	}
}


var counter = 0;
var speed = 11;
function runner() {
	requestId = undefined;
	if (++counter % speed == 0){
		grid.updateSelf(gameOfLife, binaryColors, context);
		counter = 0;
	}
	if (!requestId){
		requestId = requestAnimFrame(runner, canvas);
	}
}

grid = new caGrid();
grid.displaySelf(binaryColors, context);
runner();