/* =====================================================
   COUVERTURE BRETAUD — script.js
   Menu mobile + smooth scroll + compare slider + footer year
   ===================================================== */
(function () {
  'use strict';

  /* --- MENU MOBILE (burger + drawer) ---------------- */
  const burger = document.querySelector('[data-burger]');
  const drawer = document.querySelector('[data-drawer]');
  if (burger && drawer) {
    const closeDrawer = () => {
      burger.setAttribute('aria-expanded', 'false');
      drawer.setAttribute('data-open', 'false');
      document.body.style.overflow = '';
    };
    burger.addEventListener('click', () => {
      const open = burger.getAttribute('aria-expanded') === 'true';
      if (open) return closeDrawer();
      burger.setAttribute('aria-expanded', 'true');
      drawer.setAttribute('data-open', 'true');
      document.body.style.overflow = 'hidden';
    });
    drawer.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeDrawer));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeDrawer(); });
  }

  /* --- SMOOTH SCROLL (ancres internes) -------------- */
  document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach((link) => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  /* --- COMPARE SLIDER (Avant/Après) ----------------- */
  document.querySelectorAll('[data-compare]').forEach((frame) => {
    const handle = frame.querySelector('[data-compare-handle]');
    if (!handle) return;

    let isDragging = false;
    let rafId = null;
    let pendingPct = 50;

    function setSplit(pct) {
      const clamped = Math.max(0, Math.min(100, pct));
      pendingPct = clamped;
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        frame.style.setProperty('--split', pendingPct + '%');
        handle.setAttribute('aria-valuenow', String(Math.round(pendingPct)));
        if (pendingPct <= 1)       frame.setAttribute('data-split-edge', 'left');
        else if (pendingPct >= 99) frame.setAttribute('data-split-edge', 'right');
        else                       frame.removeAttribute('data-split-edge');
      });
    }
    function pctFromClientX(clientX) {
      const rect = frame.getBoundingClientRect();
      if (rect.width === 0) return 50;
      return ((clientX - rect.left) / rect.width) * 100;
    }
    function onPointerDown(e) {
      if (e.pointerType !== 'touch') e.preventDefault();
      isDragging = true;
      frame.classList.add('is-dragging');
      try { frame.setPointerCapture(e.pointerId); } catch (_) {}
      setSplit(pctFromClientX(e.clientX));
    }
    function onPointerMove(e) {
      if (!isDragging) return;
      setSplit(pctFromClientX(e.clientX));
    }
    function onPointerUp(e) {
      if (!isDragging) return;
      isDragging = false;
      frame.classList.remove('is-dragging');
      try { frame.releasePointerCapture(e.pointerId); } catch (_) {}
    }

    frame.addEventListener('pointerdown', onPointerDown);
    frame.addEventListener('pointermove', onPointerMove);
    frame.addEventListener('pointerup', onPointerUp);
    frame.addEventListener('pointercancel', onPointerUp);

    handle.addEventListener('keydown', (e) => {
      const step = e.shiftKey ? 10 : 2;
      const current = parseFloat(frame.style.getPropertyValue('--split')) || 50;
      if (e.key === 'ArrowLeft')       { setSplit(current - step); e.preventDefault(); }
      else if (e.key === 'ArrowRight') { setSplit(current + step); e.preventDefault(); }
      else if (e.key === 'Home')       { setSplit(0);   e.preventDefault(); }
      else if (e.key === 'End')        { setSplit(100); e.preventDefault(); }
    });

    setSplit(50);
  });

  /* --- ANNÉE FOOTER AUTO --------------------------- */
  document.querySelectorAll('[data-year]').forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });
})();
