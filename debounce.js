export function debounce(func, delay) {
  let timeout;
  // if the function is called again before the delay time, the previous timeout will be cleared and a new timeout will be set
  return function (...args) {
    // if there is a timeout, clear it and set a new one
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
}
