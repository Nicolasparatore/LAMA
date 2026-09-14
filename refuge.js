// Preserve the approved mountain rendering. Interior photographs now follow
// in ordinary document flow, after the landscape releases its sticky frame.
const refuge = document.querySelector('.refuge');
const travel = refuge.querySelector('.refuge-travel');
const stage = refuge.querySelector('.refuge-stage');
const canvas = refuge.querySelector('.refuge-space');
const context = canvas.getContext('2d', { alpha: false });
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const shortScreen = matchMedia('(max-height: 650px)');
const weather = new Image();
let ready = false;
let visible = false;
let frame = 0;
let width = 0;
let height = 0;
let pixelRatio = 1;

const clamp = value => Math.max(0, Math.min(1, value));
const smooth = value => { const t = clamp(value); return t * t * (3 - 2 * t); };
const enhanced = () => ready && !!context && !reducedMotion.matches && !shortScreen.matches;

function paint() {
  frame = 0;
  if (!enhanced() || !width || !height) return;
  const distance = Math.max(1, travel.offsetHeight - stage.offsetHeight);
  const progress = clamp(-travel.getBoundingClientRect().top / distance);
  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  const cover = Math.max(width / weather.naturalWidth, height / weather.naturalHeight);
  const imageWidth = weather.naturalWidth * cover;
  const imageHeight = weather.naturalHeight * cover;
  context.drawImage(weather, (width - imageWidth) / 2, (height - imageHeight) * .43, imageWidth, imageHeight);

  refuge.style.setProperty('--outside-opacity', 1 - smooth((progress - .08) / .18));
}

function requestPaint() {
  if (!frame && enhanced() && visible) frame = requestAnimationFrame(paint);
}

function resize() {
  if (!enhanced()) return;
  width = stage.clientWidth;
  height = stage.clientHeight;
  pixelRatio = Math.min(devicePixelRatio || 1, 1.5);
  canvas.width = Math.round(width * pixelRatio);
  canvas.height = Math.round(height * pixelRatio);
  paint();
}

function configure() {
  refuge.classList.toggle('is-spatial', enhanced());
  resize();
}

new IntersectionObserver(entries => {
  visible = entries[0].isIntersecting;
  if (visible) requestPaint();
}, { rootMargin: '200px' }).observe(travel);
window.addEventListener('scroll', requestPaint, { passive: true });
window.addEventListener('resize', resize, { passive: true });
reducedMotion.addEventListener('change', configure);
shortScreen.addEventListener('change', configure);

// Decode close to the chapter. Nothing new competes with the approved hero load.
const preload = new IntersectionObserver(entries => {
  if (!entries[0].isIntersecting) return;
  preload.disconnect();
  weather.src = '/public/images/refuge-weather.webp';
  weather.decode().then(() => {
    ready = true;
    configure();
  }).catch(() => { /* The ordinary photographic composition remains available. */ });
}, { rootMargin: '1800px' });
preload.observe(refuge);
