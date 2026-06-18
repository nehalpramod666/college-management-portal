const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    marks: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    grade: {
      type: String,
    },
  },
  { timestamps: true }
);

resultSchema.index(
  {
    student: 1,
    course: 1,
  },
  {
    unique: true,
  }
);

module.exports = mongoose.model("Result", resultSchema);