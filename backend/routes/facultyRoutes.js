const express = require("express");

const {
  createFaculty,
  getFaculty,
  getFacultyById,
  updateFaculty,
  deleteFaculty,
} = require("../controllers/facultyController");

const {
  protect,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getFaculty);

router.get("/:id", protect, getFacultyById);

router.post(
  "/",
  protect,
  authorizeRoles("admin"),
  createFaculty
);

router.put(
  "/:id",
  protect,
  authorizeRoles("admin"),
  updateFaculty
);

router.delete(
  "/:id",
  protect,
  authorizeRoles("admin"),
  deleteFaculty
);

module.exports = router;