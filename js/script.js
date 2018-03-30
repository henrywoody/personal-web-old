function expandElement(section) {
	var currentSection = document.getElementsByClassName('expanded')[0];
	if (currentSection) {
		collapseElement(currentSection);
	}
	$( section ).switchClass("collapsed", "expanded", 500, "easeInOutQuad").promise().done(function() {
		// section.querySelector(".project-demo-holder").classList.remove("hidden");
		changeExpandToCollapseButton(section);
		reloadJS(section);
	});
}

function collapseElement(section) {
	$( document ).ready(function() {
		$( section ).switchClass("expanded", "collapsed", 500, "easeInOutQuad");
	});
	clearCanvas(section);
	btn = section.querySelector(".btn-primary.collapse");
	btn.style.visibility = "hidden";
	btn.classList.remove("collapse");
	btn.classList.add("expand");
	btn.onclick = function() {
		expandElement(this.parentElement);
	}
	btn.innerHTML = "Expand";
	// section.querySelector(".project-demo-holder").classList.add("hidden");
}

function showExpandButton(section) {
	if (section.classList.contains("collapsed")) {
		section.querySelector(".btn-primary.expand").style.visibility = "visible";
	}
}

function changeExpandToCollapseButton(section) {
	btn = section.querySelector(".btn-primary.expand");
	btn.classList.remove("expand");
	btn.classList.add("collapse");
	btn.onclick = function() {
		collapseElement(this.parentElement);
	}
	btn.innerHTML = "Collapse";
}

function hideExpandButton(section) {
	if (!(section.classList.contains("expanded"))){
		section.querySelector(".btn-primary.expand").style.visibility = "hidden";
	}
}


function reloadJS(section) {
	var script = document.createElement("script");
	script.type = "text/javascript";

	switch (section.id) {
		case 'boids':
			script.src = "js/boids.js"; 
			break;
		case 'o1dca-cellular-automata':
			script.src = "js/1dca.js"; 
			break;
		default:
			script = null; 
	}
	if (script != null) {
		console.log('loading script: ', script.src);
		document.getElementsByTagName("head")[0].appendChild(script);
	}
}

function clearCanvas(section) {
	switch (section.id) {
		case "boids":
			clearBoids();
			break;
		case "o1dca-cellular-automata":
			clear1DCA();
			break;
		default:
			null;
	}
}


