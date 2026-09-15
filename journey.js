// Reuse the approved booking handler and its date state.
const guestBook = document.querySelector('.guest-book');
guestBook.addEventListener('click', () => document.querySelector('#book').click());

// Three photographic thresholds, driven by native scroll position. No input interception.
const story = document.querySelector('.guest-story');
const frames = [...story.querySelectorAll('[data-guest-motion]')];
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const visibleFrames = new Set();
let pendingFrame = 0;
function paintGuestFrames() {
  pendingFrame = 0;
  if (reducedMotion.matches) return;
  const travel = innerWidth <= 600 ? 12 : 24;
  for (const frame of visibleFrames) {
    const bounds = frame.getBoundingClientRect();
    const progress = Math.max(0, Math.min(1, (innerHeight - bounds.top) / (innerHeight + bounds.height)));
    frame.querySelector('img').style.transform = `translateY(${(progress - .5) * travel}px)`;
  }
}
function scheduleGuestFrame() {
  if (!pendingFrame && !reducedMotion.matches && visibleFrames.size) pendingFrame = requestAnimationFrame(paintGuestFrames);
}
function configureGuestMotion() {
  story.classList.toggle('has-guest-motion', !reducedMotion.matches);
  if (reducedMotion.matches) {
    cancelAnimationFrame(pendingFrame);
    pendingFrame = 0;
    frames.forEach(frame => frame.querySelector('img').style.removeProperty('transform'));
  } else scheduleGuestFrame();
}
const observer = new IntersectionObserver(entries => {
  for (const entry of entries) {
    entry.target.classList.toggle('is-in-view', entry.isIntersecting);
    if (entry.isIntersecting) visibleFrames.add(entry.target);
    else visibleFrames.delete(entry.target);
  }
  scheduleGuestFrame();
}, { rootMargin: '100px' });
frames.forEach(frame => observer.observe(frame));
window.addEventListener('scroll', scheduleGuestFrame, { passive: true });
window.addEventListener('resize', scheduleGuestFrame, { passive: true });
reducedMotion.addEventListener('change', configureGuestMotion);
configureGuestMotion();
