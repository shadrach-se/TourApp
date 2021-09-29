const AppError = require('../utils/appError');
const castHandleDB = (err) => {
  const message = `Invalid ${err.path}:${err.value}`;
  return new AppError(message, 404);
};

const handleDuplicateFields = (err) => {
  const value = Object.keys(err.keyValue).join(',');
  const message = `Duplicate fields: ${value}`;
  return new AppError(message, 404);
};

const handleValidationError = (err) => {
  const messages = Object.values(err.errors)
    .map((ele) => ele.message)
    .join('. ');
  const message = `Invalid input. ${messages}`;
  return new AppError(message, 400);
};

const handleJsonWebTokenError = () => {
  return new AppError('Invalid token. Please login again.', 401);
};

const handleTokenExpiredError = () => {
  return new AppError('Token expired. Please login again.', 401);
};
const sendErrDev = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    // API
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }
  // RENDERED WEBSITE
  return res.status(err.statusCode).render('errorTemplate', {
    title: 'Error',
    msg: err.message,
  });
};

const sendErrProd = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    console.log(
      `UNCAUGHT ERROR FROM ERROR CONTROLLER...\n************************************\n`,
      err
    );
    return res.status(500).json({
      status: 'fail',
      message: 'Something went wrong!',
    });
  }

  if (err.isOperational) {
    return res.status(err.statusCode).render('errorTemplate', {
      title: 'Error',
      msg: err.message,
    });
  }
  console.log(
    `UNCAUGHT ERROR FROM ERROR CONTROLLER...\n************************************\n`,
    err
  );
  return res.status(500).render('errorTemplate', {
    title: 'Error',
    msg: 'Please try again later.',
  });
};
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode ?? 500;
  err.status = err.status ?? 'error';
  if (process.env.NODE_ENV === 'development') {
    sendErrDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    if (err.name === 'CastError') {
      error = castHandleDB(error);
    }
    if (err.code === 11000) {
      error = handleDuplicateFields(error);
    }
    if (err.name === 'ValidationError') {
      error = handleValidationError(error);
    }
    if (err.name === 'JsonWebTokenError') {
      error = handleJsonWebTokenError();
    }
    if (err.name === 'TokenExpiredError') {
      error = handleTokenExpiredError();
    }
    if (error.message) {
      sendErrProd(error, req, res);
    } else {
      sendErrProd(err, req, res);
    }
  }
};
