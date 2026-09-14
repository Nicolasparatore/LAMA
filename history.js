// A separate enhancement; the approved hero and calendar are untouched.
const history = document.querySelector('.history');
const scrollArea = history.querySelector('.memory-scroll');
const stage = history.querySelector('.memory-stage');
const prints = [...history.querySelectorAll('.memory-print')];
const texts = [...history.querySelectorAll('.memory-text')];
const buttons = [...history.querySelectorAll('[data-memory]')];
const motion = matchMedia('(prefers-reduced-motion: reduce)');
const shortViewport = matchMedia('(max-height: 650px)');
const useStaticStory = () => motion.matches || shortViewport.matches;
let active = -1;
let scheduled = false;
let pauseTimer;
let inView = false;

function showMemory(index) {
  if (active === index) return;
  active = index;
  prints.forEach((print, i) => {
    print.classList.toggle('is-current', i === index);
    print.setAttribute('aria-hidden', String(i !== index));
    print.classList.toggle('is-past', i < index);
  });
  texts.forEach((text, i) => text.classList.toggle('is-current', i === index));
  buttons.forEach((button, i) => {
    if (i === index) button.setAttribute('aria-current', 'step');
    else button.removeAttribute('aria-current');
  });
}

function update() {
  scheduled = false;
  if (useStaticStory()) return;
  const bounds = scrollArea.getBoundingClientRect();
  const travel = Math.max(1, scrollArea.offsetHeight - stage.offsetHeight);
  const progress = Math.max(0, Math.min(1, -bounds.top / travel));
  showMemory(Math.min(3, Math.floor(progress * 4)));
}

function onScroll() {
  if (useStaticStory() || !inView) return;
  if (!scheduled) { scheduled = true; requestAnimationFrame(update); }
  history.classList.add('is-moving');
  clearTimeout(pauseTimer);
  pauseTimer = setTimeout(() => history.classList.remove('is-moving'), 130);
}

function configure() {
  history.classList.toggle('is-enhanced', !useStaticStory());
  history.classList.remove('is-moving');
  active = -1;
  update();
}

buttons.forEach((button, index) => button.addEventListener('click', () => {
  const top = scrollArea.getBoundingClientRect().top + window.scrollY;
  const travel = scrollArea.offsetHeight - stage.offsetHeight;
  // Native scrolling remains in control; chapter links also work with a keyboard.
  window.scrollTo({ top: top + travel * ((index + .14) / 4), behavior: 'instant' });
  showMemory(index);
}));

new IntersectionObserver(entries => {
  inView = entries[0].isIntersecting;
  if (inView) update();
  else { clearTimeout(pauseTimer); history.classList.remove('is-moving'); }
}, { rootMargin: '100px' }).observe(scrollArea);
window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', update, { passive: true });
motion.addEventListener('change', configure);
shortViewport.addEventListener('change', configure);
configure();
