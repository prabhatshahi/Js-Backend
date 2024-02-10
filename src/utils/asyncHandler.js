const asyncHandler = (requestHandler) => {
  return async (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};

export { asyncHandler };







































// const asyncHanler = (fn) => async (req, res, next) => {
//   try {
//     await fn(req, res, next);
//      // next() is used to call the next middleware function in the stack. If there are no more middleware functions in the stack, the request will be handled by the default Express error handling middleware. This is useful for handling errors that occur in asynchronous code.

//     // if there is no next() then the request will be handled by the default Express error handling middleware. This is useful for handling errors that occur in asynchronous code.
//     // if there is no next() then the request will be handled by the default Express error handling middleware. This is useful for handling errors that occur in asynchronous code.
//     // if there is no next() then the request will be handled by the default Express error handling middleware. This is useful for handling errors that occur in asynchronous code.
//     // if there is no next() then the request will be handled by the default Express error handling middleware. This is useful for handling errors that occur in asynchronous code.
//     // if there is no next() then the request will be handled by the default Express error handling middleware. This is useful for handling errors that occur in asynchronous code.
//     // if there is no next() then the request will be
//   } catch (error) {
//     res.status(err.code || 500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };
