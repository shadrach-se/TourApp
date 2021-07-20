const Tour = require("../models/tourModels");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
exports.getOverview = catchAsync(async (req, res, next) => {
  const tours = await Tour.find();

  res.status(200).render("overview", {
    title: "All Tours",
    tours,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: "reviews",
    fields: "review rating user",
  });

  if (!tour) {
    return next(new AppError("This tour does not exist.", 404));
  }

  res.status(200).render("tour", {
    title: tour.name,
    tour,
  });
});

exports.getLogin = (req, res) => {
  res.status(200).render("loginTemplate", {
    title: "Login",
  });
};

exports.getMe = (req, res) => {
  res.status(200).render("accountTemplate", {
    title: "Account",
  });
};
