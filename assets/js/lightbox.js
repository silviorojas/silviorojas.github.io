(function () {
    const images = Array.from(document.querySelectorAll('.about-gallery img'));
    const projectImg = document.getElementById('pm-img');   // image inside the project modal
    const lightbox = document.getElementById('lightbox');
    const lbImg = document.getElementById('lb-img');
    const lbCaption = document.getElementById('lb-caption');
    if (!lightbox || (!images.length && !projectImg)) return;

    let items = images;          // images the lightbox is currently navigating
    let current = 0;
    let prevOverflow = '';       // body overflow before opening (the project modal locks it too)
    let lastFocus = null;

    function show(index, direction) {
        current = (index + items.length) % items.length;
        const img = items[current];

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

    const next = () => { if (items.length > 1) show(current + 1, 'next'); };
    const prev = () => { if (items.length > 1) show(current - 1, 'prev'); };

    // list: the set of images to navigate (defaults to the About gallery).
    // With a single image, the arrows are hidden via the .single class.
    function open(index, list) {
        items = list || images;
        lightbox.classList.toggle('single', items.length < 2);
        show(index);

        lastFocus = document.activeElement;
        prevOverflow = document.body.style.overflow;
        lightbox.classList.add('open');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        lightbox.querySelector('.lb-close').focus();
    }

    function close() {
        lightbox.classList.remove('open');
        lightbox.setAttribute('aria-hidden', 'true');
        // Restore the previous value: if the project modal is open underneath,
        // the page must stay locked.
        document.body.style.overflow = prevOverflow;
        if (lastFocus) lastFocus.focus();
    }

    // About gallery
    images.forEach((img, i) => img.addEventListener('click', () => open(i)));

    // Project modal image (single-image mode)
    if (projectImg) {
        projectImg.addEventListener('click', () => {
            if (!projectImg.getAttribute('src')) return;
            open(0, [projectImg]);
        });
    }

    // Project modal gallery (several screenshots).
    // The modal content is injected with innerHTML, so we use event delegation.
    const pmContent = document.getElementById('pm-content');
    if (pmContent) {
        pmContent.addEventListener('click', (e) => {
            const thumb = e.target.closest('.pm-gallery img');
            if (!thumb) return;
            const list = Array.from(pmContent.querySelectorAll('.pm-gallery img'));
            open(list.indexOf(thumb), list);
        });
    }

    lightbox.querySelector('.lb-close').addEventListener('click', close);
    lightbox.querySelector('.lb-prev').addEventListener('click', prev);
    lightbox.querySelector('.lb-next').addEventListener('click', next);

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) close();
    });

    // Keyboard
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('open')) return;
        if (e.key === 'Escape') {
            // This file loads before project-modal.js, so stopping propagation here
            // keeps Escape from also closing the project modal underneath.
            e.stopImmediatePropagation();
            close();
        }
        if (e.key === 'ArrowLeft') prev();
        if (e.key === 'ArrowRight') next();
    });

    // ===== Touch swipe  =====
    let startX = 0, startY = 0, tracking = false;
    const MIN_DISTANCE = 50;   // minimum criteria to count as a swipe

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