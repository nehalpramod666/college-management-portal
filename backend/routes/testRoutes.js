const express = require("express");
const router = express.Router();

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

// Public route
router.get("/public", (req, res) => {
  res.json({ message: "Public route accessible" });
});

// Protected route
router.get("/private", protect, (req, res) => {
  res.json({
    message: "Private route accessed",
    user: req.user,
  });
});

// Admin only route
router.get("/admin", protect, authorizeRoles("admin"), (req, res) => {
  res.json({
    message: "Admin route accessed",
  });
});

module.exports = router;