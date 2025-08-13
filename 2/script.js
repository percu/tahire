(function(){
  // Carruseles en tarjetas
  const carousels = document.querySelectorAll('.carousel');
  carousels.forEach(initCarousel);

  function initCarousel(root){
    const track = root.querySelector('.track');
    const slides = Array.from(track.querySelectorAll('img'));
    const dots = root.querySelector('.dots');
    const prev = root.querySelector('.prev');
    const next = root.querySelector('.next');

    slides.forEach((_, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', 'Ir a imagen ' + (i+1));
      b.addEventListener('click', () => goTo(i));
      dots.appendChild(b);
    });

    function updateDots(){
      const i = Math.round(track.scrollLeft / track.clientWidth);
      dots.querySelectorAll('button').forEach((b, idx) => {
        b.setAttribute('aria-current', idx === i ? 'true' : 'false');
      });
    }
    updateDots();

    function goTo(i){
      track.scrollTo({ left: i * track.clientWidth, behavior: 'smooth' });
    }
    function move(dir){
      const i = Math.round(track.scrollLeft / track.clientWidth) + dir;
      const clamped = Math.max(0, Math.min(slides.length - 1, i));
      goTo(clamped);
    }

    prev.addEventListener('click', () => move(-1));
    next.addEventListener('click', () => move(1));
    track.addEventListener('scroll', updateDots, { passive: true });

    // click para abrir lightbox
    slides.forEach((img, i) => {
      img.addEventListener('click', () => openLightbox(slides, i));
    });
  }

  // Lightbox
  const lb = document.querySelector('.lightbox');
  const lbTrack = lb.querySelector('.lb-track');
  const lbPrev = lb.querySelector('.lb-prev');
  const lbNext = lb.querySelector('.lb-next');
  const lbClose = lb.querySelector('.lb-close');
  const lbCaption = document.getElementById('lb-caption');
  let current = 0;
  let currentSlides = [];

  function openLightbox(slides, startIndex){
    currentSlides = slides;
    lbTrack.innerHTML = '';
    current = startIndex || 0;

    slides.forEach(s => {
      const wrap = document.createElement('div');
      wrap.className = 'lb-slide';
      const img = document.createElement('img');
      img.src = s.getAttribute('src');
      img.alt = s.getAttribute('alt') || '';
      img.decoding = 'async';
      wrap.appendChild(img);
      lbTrack.appendChild(wrap);
    });

    lb.setAttribute('aria-hidden','false');
    lb.dataset.open = 'true';
    updateLightboxCaption();
    updateLightboxPosition();
  }

  function updateLightboxCaption(){
    const s = currentSlides[current];
    const cap = (s && (s.getAttribute('data-caption') || s.getAttribute('alt'))) || '';
    lbCaption.textContent = cap;
  }

  function updateLightboxPosition(){
    const width = lbTrack.clientWidth || 1;
    lbTrack.scrollTo({ left: current * width, behavior: 'instant' });
  }

  function moveLightbox(dir){
    const total = lbTrack.children.length;
    current = Math.max(0, Math.min(total-1, current + dir));
    updateLightboxPosition();
    updateLightboxCaption();
  }

  lbPrev.addEventListener('click', () => moveLightbox(-1));
  lbNext.addEventListener('click', () => moveLightbox(1));
  lbClose.addEventListener('click', closeLightbox);
  lb.addEventListener('click', (e) => { if (e.target === lb) closeLightbox(); });
  document.addEventListener('keydown', (e) => {
    if (lb.dataset.open === 'true'){
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') moveLightbox(-1);
      if (e.key === 'ArrowRight') moveLightbox(1);
    }
  });

  function closeLightbox(){
    lb.setAttribute('aria-hidden','true');
    lb.dataset.open = 'false';
    lbTrack.innerHTML = '';
    currentSlides = [];
  }
})();