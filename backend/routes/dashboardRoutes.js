const express = require("express");
const router = express.Router();

const {
  getAdminDashboard,
} = require("../controllers/dashboardController");

const {
  protect,
  authorizeRoles,
} = require("../middleware/authMiddleware");

router.get(
  "/admin",
  protect,
  authorizeRoles("admin"),
  getAdminDashboard
);

module.exports = router;