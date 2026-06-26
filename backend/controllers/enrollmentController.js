const Enrollment = require("../models/Enrollment");

// Enroll a student in a course
const enrollStudent = async (req, res) => {
  try {
    const { student, course } = req.body;

    const enrollment = await Enrollment.create({ student, course });

    res.status(201).json({ success: true, enrollment });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Student already enrolled in this course",
      });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all enrollments (admin)
const getEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find()
      .populate("student")
      .populate("course");

    res.status(200).json({ success: true, enrollments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get courses a student is enrolled in
const getStudentEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({
      student: req.params.studentId,
    }).populate("course");

    res.status(200).json({ success: true, enrollments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get students enrolled in a course
const getCourseEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({
      course: req.params.courseId,
    }).populate("student");

    res.status(200).json({ success: true, enrollments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Remove enrollment
const removeEnrollment = async (req, res) => {
  try {
    const enrollment = await Enrollment.findByIdAndDelete(req.params.id);

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: "Enrollment not found",
      });
    }

    res.status(200).json({ success: true, message: "Enrollment removed" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  enrollStudent,
  getEnrollments,
  getStudentEnrollments,
  getCourseEnrollments,
  removeEnrollment,
};