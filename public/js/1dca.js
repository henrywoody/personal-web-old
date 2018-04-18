window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
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

	// var pixelWidth = 5;
	// var width = document.getElementById("o1dca-board").getBoundingClientRect().width;
	// width /= pixelWidth;

	// var defaultStartRow = [];
	// for (i = 0; i < width; i++){
	// 	if (i == (Math.round(width/2) - 1))
	// 		defaultStartRow.push(1);
	// 	else
	// 		defaultStartRow.push(0);
	// }


function Board(width, height, cell_size) {
	this.width = Math.round(width/cell_size);
	this.height = Math.round(height/cell_size);
	this.cell_size = cell_size;
	this.rows = [];
	this.parentTypes = [7, 6, 5, 4, 3, 2, 1, 0].map(x => toFixedLengthBinary(x, 3, array=false));

	this.setFirstRow = function (){
		var defaultStartRow = [];
		for (i = 0; i < this.width; i++){
			if (i == (Math.round(this.width/2) - 1))
				defaultStartRow.push(1);
			else
				defaultStartRow.push(0);
		}
		this.rows.push(defaultStartRow)
	};
	this.applyRule = function (rule){
		var code = toFixedLengthBinary(rule, 8);
		var newRow = [0];
		for (i = 0; i < this.rows[this.rows.length - 1].length - 2; i++){
			newRow.push(code[this.parentTypes.indexOf(this.rows[this.rows.length - 1].slice(i, i+3).join(''))]);
		}
		newRow.push(0);
		this.rows.push(newRow);
	};
	this.trimRows = function (num){
		for (i = 0; i < num; i++){
			this.rows.shift()
		}
	};
	this.displayRows = function (context){
		for (i = 0; i < this.rows.length; i++){
			for (j = 0; j < this.width; j++){
				var color = this.rows[i][j] == 0 ? dead_color : alive_color;
				context.fillStyle = color;
				context.fillRect(j*this.cell_size, i*this.cell_size, this.cell_size, this.cell_size);
			}
		}
	};
	this.updateSelf = function (rule, context){
		this.applyRule(rule);
		if (this.rows.length > this.height){
			this.trimRows(1);
		}
		this.displayRows(context);
	};
	this.run = function (rule) {
		this.updateSelf(rule, context);
	}
}

var requestId;
var holder, canvas, context, board;
var rule, alive_color, dead_color, randomRules;
var counter = 0, speed, changeRulesTime;
var alreadySet = false;

function setVarsFromInput() {
	rule = Number(document.getElementById("o1dca-rule-input").value);
	update_rule_text();
	alive_color = document.getElementById("o1dca-alive-color").value;
	dead_color = document.getElementById("o1dca-dead-color").value;
	randomRules = document.getElementById("o1dca-random-rules-check").checked;
	speed = 11 - Math.round(Number(document.getElementById("o1dca-speed").value));
	if (speed == 11){
		speed = 0;
	}
	changeRulesTime = 50 * speed;
}

function makeCanvas() {
	if (document.getElementById("o1dca-canvas-full")) {
		canvas = document.getElementById("o1dca-canvas-full");
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		canvas.style.width = (canvas.width *  0.0625).toString() + "rem";
		canvas.style.height = (canvas.height * 0.0625).toString() + "rem";
	} else {
		canvas = document.getElementById("o1dca-canvas");
		canvas.width = window.innerWidth * .6;
		canvas.height = window.innerHeight * .5;
		canvas.style.width = (canvas.width *  0.0625).toString() + "rem";
		canvas.style.height = (canvas.height * 0.0625).toString() + "rem";
	}
	context = canvas.getContext("2d");

	setVarsFromInput();

	board = new Board(canvas.width, canvas.height, 5);

	board.setFirstRow();
	board.displayRows(context);

	return [board, canvas, context];
}

function animate1DCA() {
	makeCanvas();
	runner();
	update_rule_text();
	if (!alreadySet){
		changeStartToUpdateButton();
		alreadySet = true;
	} else {
		counter = 0;
	}
}

function runner() {
	requestId = undefined;
	if (++counter % speed == 0){
		// create a new row according to the current rule
		board.run(rule);
	}
	if (randomRules && counter % changeRulesTime == 0){
		// change rules if randomRules is on
		rule = Math.round(Math.random() * 255)
		document.getElementById("o1dca-rule-input").value = rule;
		update_rule_text();
	}
	if (counter % changeRulesTime == 0) {
		counter = 0;
	}
	if (!requestId){
		requestId = requestAnimFrame(runner, canvas);
	}
}

function update1DCA() {
	setVarsFromInput();
}

function reset1DCA() {
	context.clearRect(0, 0, canvas.width, canvas.height);

	board.rows = [];
	board.setFirstRow();
}

function clear1DCA() {
	// called when collapsing the holder for 1D CA
	if (context) {
		context.clearRect(0, 0, canvas.width, canvas.height);
	}
	if (requestId) {
		window.cancelAnimationFrame(requestId);
		requestId = undefined;
	}
	canvas = null;
	context = null;
	board = null;
	changeUpdateToStartButton();
}

function changeStartToUpdateButton() {
	btn = document.querySelector('.btn-primary.start#o1dca-btn');
	btn.classList.remove("start");
	btn.classList.add("update");
	btn.onclick = function() {
		update1DCA();
	}
	btn.innerHTML = "Update";
}

function changeUpdateToStartButton() {
	btn = document.querySelector('.btn-primary.update#o1dca-btn');
	if (btn) {
		btn.classList.remove("update");
		btn.classList.add("start");
		btn.onclick = function() {
			animate1DCA();
		}
		btn.innerHTML = "Start";
		alreadySet = false;
	}
}

function update_rule_text() {
	document.getElementById("o1dca-rule-h3").innerHTML = "Rule " + rule;
}





// var paused = false;
// function playPause() {
// 	if (paused){
// 		paused = false;
// 	} else {
// 		paused = true;
// 	}
// }