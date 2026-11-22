(function () {
    const modal = document.getElementById('project-modal');
    if (!modal) return;

    const img = document.getElementById('pm-img');
    const title = document.getElementById('pm-title');
    const content = document.getElementById('pm-content');
    const closeBtn = modal.querySelector('.pm-close');
    let lastFocus = null;

    function open(card) {
        const cardImg = card.querySelector('.image img');
        img.src = cardImg.src;
        img.alt = cardImg.alt;
        title.textContent = card.querySelector('header h3').textContent;
        // description-box is authored in index.html (not user input), so innerHTML is safe here
        content.innerHTML = card.querySelector('.description-box').innerHTML;

        lastFocus = document.activeElement;
        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        modal.querySelector('.pm-panel').scrollTop = 0;
        closeBtn.focus();
    }

    function close() {
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        if (lastFocus) lastFocus.focus();
    }

    document.querySelectorAll('.project-card .project-open').forEach(function (el) {
        el.addEventListener('click', function (e) {
            e.preventDefault();
            open(el.closest('.project-card'));
        });
    });

    closeBtn.addEventListener('click', close);
    modal.addEventListener('click', function (e) {
        if (e.target === modal) close();
    });

    document.addEventListener('keydown', function (e) {
        if (!modal.classList.contains('open')) return;
        if (e.key === 'Escape') close();

        // Keep keyboard focus inside the modal
        if (e.key === 'Tab') {
            const focusable = modal.querySelectorAll('a[href], button');
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        }
    });
})();