const express = require("express");

const {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
} = require("../controllers/courseController");

const {
  protect,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Public
router.get("/", getCourses);
router.get("/:id", getCourseById);

// Admin Only
router.post(
  "/",
  protect,
  authorizeRoles("admin"),
  createCourse
);

router.put(
  "/:id",
  protect,
  authorizeRoles("admin"),
  updateCourse
);

router.delete(
  "/:id",
  protect,
  authorizeRoles("admin"),
  deleteCourse
);

module.exports = router;