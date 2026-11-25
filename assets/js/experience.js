(function () {
	document.querySelectorAll('#experience .timeline-card').forEach(function (card) {
		var list = card.querySelector('ul');
		if (!list) return;

		list.hidden = true;

		var btn = document.createElement('button');
		btn.type = 'button';
		btn.className = 'timeline-toggle';
		btn.setAttribute('aria-expanded', 'false');
		btn.textContent = 'Show details';
		list.parentNode.insertBefore(btn, list);

		btn.addEventListener('click', function () {
			var opening = list.hidden;
			list.hidden = !opening;
			btn.setAttribute('aria-expanded', String(opening));
			btn.textContent = opening ? 'Hide details' : 'Show details';
		});
	});
})();