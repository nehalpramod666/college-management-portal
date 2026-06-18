const express = require("express");

const {
  createResult,
  getResults,
  getStudentResults,
  updateResult,
} = require("../controllers/resultController");

const {
  protect,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/",
  protect,
  authorizeRoles("admin", "faculty"),
  createResult
);

router.get(
  "/",
  protect,
  authorizeRoles("admin"),
  getResults
);

router.get(
  "/student/:studentId",
  protect,
  getStudentResults
);

router.put(
  "/:id",
  protect,
  authorizeRoles("admin", "faculty"),
  updateResult
);

module.exports = router;