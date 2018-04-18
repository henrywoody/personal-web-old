$.fn.exists = function () {
    return this.length !== 0;
}

function expandElement(section) {
	var expandedSection = $('.expanded');
	if (expandedSection.exists()) {
		collapseElement(expandedSection);
	}
	section.switchClass('collapsed', 'expanded', 500, 'easeInOutQuad').promise().done(() => {
		// section.querySelector('.project-demo-holder').classList.remove('hidden');
		changeExpandToCollapseButton(section);
		reloadJS(section);
	});
}

function collapseElement(section) {
	$( document ).ready(function() {
		section.switchClass('expanded', 'collapsed', 500, 'easeInOutQuad');
	});
	clearCanvas(section);
	changeCollapseToExpandButton(section);
	// section.querySelector('.project-demo-holder').classList.add('hidden');
}

function showExpandButton(section) {
	if (section[0].classList.contains('collapsed')) {
		section.find('.btn-primary.expand').css('visibility', 'visible');
	}
}

function changeExpandToCollapseButton(section) {
	btn = section.find('.btn-primary.expand');
	btn.switchClass('expand', 'collapse');
	btn.html('Collapse');
	// btn.removeClass('expand');
	// btn.addClass('collapse');
	btn.off();
	btn.on('click', event => {
		collapseElement($(event.currentTarget).parent());
	})
}

function changeCollapseToExpandButton(section) {
	btn = section.find('.btn-primary.collapse');
	btn.css('visibility', 'hidden');
	btn.switchClass('collapse', 'expand');
	// btn.removeClass('collapse');
	// btn.addClass('expand');
	btn.html('Expand');
	btn.off();
	btn.on('click', event => {
		expandElement($(event.currentTarget).parent());
	})
}

function hideExpandButton(section) {
	if (!(section[0].classList.contains('expanded'))){
		section.find('.btn-primary.expand').css('visibility', 'hidden');
	}
}


function reloadJS(section) {
	var script = document.createElement('script');
	script.type = 'text/javascript';
	switch (section[0].id) {
		case 'boids':
			script.src = 'js/boids.js'; 
			break;
		case 'o1dca':
			script.src = 'js/1dca.js'; 
			break;
		case 'o2dca':
			script.src = 'js/2dca.js';
			break;
		default:
			script = null; 
	}
	if (script != null) {
		console.log('loading script: ', script.src);
		document.getElementsByTagName('head')[0].appendChild(script);
	}
}

function clearCanvas(section) {
	switch (section.id) {
		case 'boids':
			clearBoids();
			break;
		case 'o1dca':
			clear1DCA();
			break;
		case 'o2dca':
			clear2DCA();
			break;
		default:
			null;
	}
}


