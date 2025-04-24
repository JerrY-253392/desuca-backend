export const errorHandler = (err, req, res, next) => {
  console.log("console ", err)
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server errohjgjjjjr";

  return res.status(statusCode).json({
    message,
    success: false,
    issue: err.stack || null,
  });
};
