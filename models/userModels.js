const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A user must have name"],
    maxlength: [30, "A user name should not be more than 30 characters"],
    minlength: [8, "A user name should be more than 10 characters"],
  },
  email: {
    type: String,
    required: [true, "A user must have an email"],
    validate: [validator.isEmail, "Enter a valid email"],
    unique: true,
    lowercase: true,
  },
  photo: {
    type: String,
    default: "default.jpg",
  },
  role: {
    type: String,
    enum: ["user", "guide", "lead-guide", "admin"],
    default: "user",
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: [8, "Password must have mininum of 8 characters"],
    //select set to false doesn't display that field when outputting json
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please re-enter the password"],
    validate: {
      validator: function (passConf) {
        return passConf === this.password;
      },
      message: "Password mismatch",
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userSchema.pre("save", async function (next) {
  //If the password has not been modified
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.post("save", function (user, next) {
  user.__v = undefined;
  next();
});

//Query middleware for deletion
userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

//Document method
userSchema.methods.verifyPassword = async function (
  plainPassword,
  hashedPassword
) {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  //Generate random token
  const resetToken = crypto.randomBytes(32).toString("hex");
  //Encrypt token
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};
const User = mongoose.model("User", userSchema);
module.exports = User;
