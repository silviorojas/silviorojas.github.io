(function () {
	var body = document.getElementById('term-body');
	if (!body) return;

	//If the user requested less movement, we leave the final text static.
	var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	var source = body.querySelectorAll('.t-line');
	if (reduceMotion || !source.length) return;

	var steps = Array.prototype.map.call(source, function (el) {
		return { type: el.getAttribute('data-type'), text: el.textContent };
	});

	// We reserve the final height so that the page doesn't "jump" while typing.
	body.style.minHeight = body.offsetHeight + 'px';
	body.innerHTML = '';

	var cursor = document.createElement('span');
	cursor.className = 't-cursor';

	function addRow(type) {
		var row = document.createElement('div');
		row.className = 't-row t-' + type;

		if (type === 'cmd') {
			var prompt = document.createElement('span');
			prompt.className = 't-prompt';
			prompt.textContent = '$ ';
			row.appendChild(prompt);
		}

		var text = document.createElement('span');
		text.className = 't-text';
		row.appendChild(text);
		row.appendChild(cursor); // The cursor always goes to the end of the current row.
		body.appendChild(row);
		return text;
	}

	function typeText(el, str, done) {
		var i = 0;
		(function next() {
			if (i < str.length) {
				el.textContent += str.charAt(i++);
				setTimeout(next, 45 + Math.random() * 60); // "human" velocity
			} else {
				done();
			}
		})();
	}

	function run(index) {
		if (index >= steps.length) return;

		var step = steps[index];
		var el = addRow(step.type);

		if (step.type === 'cmd') {
			typeText(el, step.text, function () {
				setTimeout(function () { run(index + 1); }, 350); // pause before the result
			});
		} else {
			el.textContent = step.text;
			setTimeout(function () { run(index + 1); }, 120);
		}
	}

	setTimeout(function () { run(0); }, 600);
})();