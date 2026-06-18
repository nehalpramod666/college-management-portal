const express = require("express");

const {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
} = require("../controllers/studentController");

const {
  protect,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getStudents);

router.get("/:id", protect, getStudentById);

router.post(
  "/",
  protect,
  authorizeRoles("admin"),
  createStudent
);

router.put(
  "/:id",
  protect,
  authorizeRoles("admin"),
  updateStudent
);

router.delete(
  "/:id",
  protect,
  authorizeRoles("admin"),
  deleteStudent
);

module.exports = router;