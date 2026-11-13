(function () {
    const images = Array.from(document.querySelectorAll('.about-gallery img'));
    const lightbox = document.getElementById('lightbox');
    const lbImg = document.getElementById('lb-img');
    const lbCaption = document.getElementById('lb-caption');
    if (!images.length || !lightbox) return;

    let current = 0;

    function show(index, direction) {
        current = (index + images.length) % images.length;
        const img = images[current];

        const apply = () => {
            lbImg.src = img.dataset.full || img.src;
            lbImg.alt = img.alt;
            lbCaption.textContent = img.alt;
            lbImg.classList.remove('slide-left', 'slide-right');
        };

        if (direction && lightbox.classList.contains('open')) {
            // animation: one exits to the side and the new one enters
            lbImg.classList.add(direction === 'next' ? 'slide-left' : 'slide-right');
            setTimeout(apply, 150);
        } else {
            apply();
        }
    }

    const next = () => show(current + 1, 'next');
    const prev = () => show(current - 1, 'prev');

    function open(index) {
        show(index);
        lightbox.classList.add('open');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function close() {
        lightbox.classList.remove('open');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    images.forEach((img, i) => img.addEventListener('click', () => open(i)));
    lightbox.querySelector('.lb-close').addEventListener('click', close);
    lightbox.querySelector('.lb-prev').addEventListener('click', prev);
    lightbox.querySelector('.lb-next').addEventListener('click', next);

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) close();
    });

    // Keyboard
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('open')) return;
        if (e.key === 'Escape') close();
        if (e.key === 'ArrowLeft') prev();
        if (e.key === 'ArrowRight') next();
    });

    // ===== Touch swipe  =====
    let startX = 0, startY = 0, tracking = false;
    const MIN_DISTANCE = 50;   // pminimum criteria to count as a swipe

    lightbox.addEventListener('touchstart', (e) => {
        if (e.touches.length !== 1) { tracking = false; return; }  // ignore pinch
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        tracking = true;
    }, { passive: true });

    lightbox.addEventListener('touchend', (e) => {
        if (!tracking) return;
        tracking = false;

        const dx = e.changedTouches[0].clientX - startX;
        const dy = e.changedTouches[0].clientY - startY;

        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > MIN_DISTANCE) {
            dx < 0 ? next() : prev();           //left -> next, right -> previous
        } else if (dy > MIN_DISTANCE * 2 && Math.abs(dy) > Math.abs(dx)) {
            close();                            // swipe down -> close
        }
    }, { passive: true });
})();
