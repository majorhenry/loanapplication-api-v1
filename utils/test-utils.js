const runMiddleware = (middleware, req) => {
    return new Promise((resolve, reject) => {
      const res = {
        status: () => ({
          json: () => {}
        })
      };
      
      const next = (err) => {
        if (err) return reject(err);
        resolve();
      };
  
      middleware[0](req, res, () => {
        middleware[1](req, res, next);
      });
    });
  };
  
  module.exports = runMiddleware;