import axios from 'axios';

/**
 * Debounce function
 * @param {function} func
 * @param {number} delay
 * @param {boolean} shouldWait
 * @param {boolean} shouldTriggerImmediately
 * @return {function}
 */
export function debounce(func,
    delay = 100,
    shouldWait = true,
    shouldTriggerImmediately = false) {
  let timeout;

  return function(...args) {
    if (timeout) {
      clearTimeout(timeout);
    } else if (shouldTriggerImmediately) {
      func.apply(Window, args);
    }

    timeout = setTimeout(() => {
      if (shouldWait) {
        func.apply(Window, args);
      }

      timeout = null;
    }, delay);
  };
};

/**
 * Short hand for document.querySelector
 * @param {string} selector
 * @param {object} scope
 * @return {object}
 */
export function qs(selector, scope) {
  return (scope || document).querySelector(selector);
};

/**
 * Short hand for document.querySelectorAll
 * @param {string} selector
 * @param {object} scope
 * @return {array}
 */
export function qsa(selector, scope) {
  return (scope || document).querySelectorAll(selector);
};

/**
 * Axios library handler
 *
 * NOTE:: using the same placeholder to print images
 * TODO:: I think it's better to create a method to
 *        pass the queries (posts|users|photos) instead burn it out
 * @return {array}
 */
export const axiosHandler =
  (async () => {
  const basePath = 'https://jsonplaceholder.typicode.com/';
  const [posts, users, pictures] = await Promise.all([
    axios.get(basePath + 'posts'),
    axios.get(basePath + 'users'),
    axios.get(basePath + 'photos')
  ]);

  let response = [];

  users.data.forEach((itm, i) => {
    response.push(Object.assign({}, itm, posts.data[i], pictures.data[i]));
  });

  return response;
})();
