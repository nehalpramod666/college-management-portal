const Result = require("../models/Result");
const calculateGrade = require("../utils/gradeCalculator");

// Create Result
const createResult = async (req, res) => {
  try {
    const { student, course, marks } = req.body;

    const grade = calculateGrade(marks);

    const result = await Result.create({
      student,
      course,
      marks,
      grade,
    });

    res.status(201).json({
      success: true,
      result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Results
const getResults = async (req, res) => {
  try {
    const results = await Result.find()
      .populate("student")
      .populate("course");

    res.status(200).json({
      success: true,
      count: results.length,
      results,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Student Results
const getStudentResults = async (req, res) => {
  try {
    const results = await Result.find({
      student: req.params.studentId,
    }).populate("course");

    res.status(200).json({
      success: true,
      results,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Result
const updateResult = async (req, res) => {
  try {
    const { marks } = req.body;

    const grade = calculateGrade(marks);

    const result = await Result.findByIdAndUpdate(
      req.params.id,
      {
        marks,
        grade,
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createResult,
  getResults,
  getStudentResults,
  updateResult,
};