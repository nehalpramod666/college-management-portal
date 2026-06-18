const express = require("express");

const {
  createDepartment,
  getDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
} = require("../controllers/departmentController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

// Public route
router.get("/", getDepartments);
router.get("/:id", getDepartmentById);

// Admin only routes
router.post("/", protect, authorizeRoles("admin"), createDepartment);
router.put("/:id", protect, authorizeRoles("admin"), updateDepartment);
router.delete("/:id", protect, authorizeRoles("admin"), deleteDepartment);

module.exports = router;