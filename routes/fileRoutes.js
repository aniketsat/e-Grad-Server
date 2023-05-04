const express = require("express");
const multer = require("multer");

const fileController = require("../controllers/fileController");

const authenticate = require("../middleware/authMiddleware");

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

// @Route     POST /api/files
// @Desc      Create a file
// @Access    Private
router.post(
  "/",
  authenticate,
  upload.single("file"),
  fileController.createFile
);

// @Route     GET /api/files
// @Desc      Get all files
// @Access    Private
router.get("/", authenticate, fileController.getAllFiles);

// @Route     GET /api/files/:id
// @Desc      Get a file
// @Access    Private
router.get("/:id", authenticate, fileController.getFile);

// @Route     PUT /api/files/:id
// @Desc      Update a file
// @Access    Private
router.put("/:id", authenticate, fileController.updateFile);

// @Route     DELETE /api/files/:id
// @Desc      Delete a file
// @Access    Private
router.delete("/:id", authenticate, fileController.deleteFile);

module.exports = router;
