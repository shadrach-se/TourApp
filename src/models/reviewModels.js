const mongoose = require('mongoose');
const Tour = require('./tourModels');
const revSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'A review must exist'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'A review must have a tour'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A review must have a user'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//Preventing duplicate reviews from the same user on the same tour
revSchema.index({ tour: 1, user: 1 }, { unique: true });

revSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name email photo',
  });
  next();
});

revSchema.statics.calcAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    { $match: { tour: tourId } },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);
  await Tour.findByIdAndUpdate(tourId, {
    ratingsAverage: stats[0].avgRating,
    ratingsQuantity: stats[0].nRating,
  });
};

revSchema.post('save', function () {
  this.constructor.calcAverageRatings(this.tour);
});

revSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.findOne();
  console.log(this.r);
  next();
});

revSchema.post(/^findOneAnd/, async function () {
  await this.r.constructor.calcAverageRatings(this.r.tour);
});
const Review = mongoose.model('Review', revSchema);

module.exports = Review;
