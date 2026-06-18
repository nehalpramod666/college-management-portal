const express = require("express");

const {
  markAttendance,
  getAttendance,
  getStudentAttendance,
} = require("../controllers/attendanceController");

const {
  protect,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Admin + Faculty
router.post(
  "/",
  protect,
  authorizeRoles("admin", "faculty"),
  markAttendance
);

// Admin
router.get(
  "/",
  protect,
  authorizeRoles("admin"),
  getAttendance
);

// Student/Admin/Faculty
router.get(
  "/student/:studentId",
  protect,
  getStudentAttendance
);

module.exports = router;