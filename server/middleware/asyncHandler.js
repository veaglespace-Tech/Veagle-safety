/**
 * Global Async Handler wrapper to catch errors in async controller functions
 * and cleanly pass them to Express error handling middleware.
 * @param {Function} fn
 * @returns {Function}
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
