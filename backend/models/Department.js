const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    hod: {
      type: String,
      default: "Not Assigned",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Department", departmentSchema);