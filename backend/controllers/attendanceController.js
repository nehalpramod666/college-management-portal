const Attendance = require("../models/Attendance");

const markAttendance = async (req, res) => {
  try {
    const {
      student,
      course,
      status,
      markedBy,
      date,
    } = req.body;

    const exists = await Attendance.findOne({
      student,
      course,
      date,
    });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Attendance already marked",
      });
    }

    const attendance = await Attendance.create({
      student,
      course,
      status,
      markedBy,
      date,
    });

    res.status(201).json({
      success: true,
      attendance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find()
      .populate("student")
      .populate("course")
      .populate("markedBy");

    res.status(200).json({
      success: true,
      count: attendance.length,
      attendance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getStudentAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find({
      student: req.params.studentId,
    })
      .populate("course");

    res.status(200).json({
      success: true,
      attendance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  markAttendance,
  getAttendance,
  getStudentAttendance,
};