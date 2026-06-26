const express = require("express");
const router = express.Router();
const {
  enrollStudent,
  getEnrollments,
  getStudentEnrollments,
  getCourseEnrollments,
  removeEnrollment,
} = require("../controllers/enrollmentController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

// Admin only
router.post("/", protect, authorizeRoles("admin"), enrollStudent);
router.get("/", protect, authorizeRoles("admin"), getEnrollments);
router.delete("/:id", protect, authorizeRoles("admin"), removeEnrollment);

// Any logged-in user
router.get("/student/:studentId", protect, getStudentEnrollments);
router.get("/course/:courseId", protect, getCourseEnrollments);

module.exports = router;