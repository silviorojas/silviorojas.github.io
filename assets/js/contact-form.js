(function () {
	var form = document.getElementById('contact-form');
	if (!form) return;

	var status = document.getElementById('form-status');
	var button = form.querySelector('input[type="submit"]');

	form.addEventListener('submit', function (e) {
		e.preventDefault();
		button.disabled = true;
		button.value = 'Sending...';
		status.textContent = '';
		status.className = '';

		fetch(form.action, {
			method: 'POST',
			body: new FormData(form),
			headers: { 'Accept': 'application/json' }
		}).then(function (res) {
			if (!res.ok) throw new Error('Request failed');
			form.reset();
			status.textContent = 'Thanks! Your message was sent.';
			status.className = 'success';
		}).catch(function () {
			status.textContent = 'Something went wrong. Please email me directly at rojassilvioomar@gmail.com.';
			status.className = 'error';
		}).finally(function () {
			button.disabled = false;
			button.value = 'Send Message';
		});
	});
})();