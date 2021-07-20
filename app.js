const path = require("path");
const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cookieParser = require("cookie-parser");

const AppError = require("./utils/appError");
const GlobalErrorHandler = require("./controllers/errorControllers");

const viewRouter = require("./routes/viewRoutes");
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");
const reviewRouter = require("./routes/reviewRoutes");

const app = express();

// Views engine
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// Static files...
app.use(express.static(path.join(__dirname, "public")));

// Http headers
app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      "script-src": ["'self'", "https://unpkg.com/axios/dist/"],
    },
  })
);

// Log http request information
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP. Please try again after one hour!",
});

// Rate limiting
app.use("/api", limiter);

// Body parser
app.use(express.json({ limit: "10kb" }));
// Form urlencoding
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
// Cookie parser
app.use(cookieParser());
// Data sanitization

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());
// app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      "duration",
      "ratingsQuantity",
      "ratingsAverage",
      "maxGroupSize",
      "difficulty",
      "price",
    ],
  })
);

// Display cookies
app.use((req, res, next) => {
  // console.log(req.cookies);
  next();
});

//Route Handlers...
app.use("/", viewRouter);
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl}`, 404));
});

app.use(GlobalErrorHandler);

module.exports = app;
