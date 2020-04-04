module.exports = (res, status, message, originalError) => {
  res.status(status).send({
    error: {
      message,
      originalError
    }
  });
};