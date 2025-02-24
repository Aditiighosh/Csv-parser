const applyMiddleware = (req, res, middleware) => {
    return new Promise((resolve, reject) => {
      middleware(req, res, (result) => {
        if (result instanceof Error) return reject(result); // If middleware throws error, reject the Promise
        return resolve(result); // If no error, resolve the Promise
      });
    });
  };
  
  export default applyMiddleware;
  