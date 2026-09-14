const ending = document.querySelector('.ending');
const endingBook = ending.querySelector('.ending-book');
const existingBook = document.querySelector('#book');

// Invoke the approved handler and native dialog; it retains the same date state.
endingBook.addEventListener('click', () => existingBook.click());

// This final behavior plays once. Revisiting the ending leaves it still.
const lastLight = new IntersectionObserver(entries => {
  if (!entries[0].isIntersecting) return;
  ending.classList.add('has-last-light');
  lastLight.disconnect();
}, { threshold: 1 });
lastLight.observe(ending.querySelector('.ending-title'));
