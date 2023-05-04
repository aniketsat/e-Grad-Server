const express = require("express");
const multer = require("multer");

const folderController = require("../controllers/folderController");

const authenticate = require("../middleware/authMiddleware");

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

// @ Route      POST /api/folders
// @ Desc       Create a folder
// @ Access     Private
router.post("/", authenticate, folderController.createFolder);

// @ Route      GET /api/folders
// @ Desc       Get all folders
// @ Access     Private
router.get("/", authenticate, folderController.getAllFolders);

// @ Route      GET /api/folders/:id
// @ Desc       Get a folder
// @ Access     Private
router.get("/:id", authenticate, folderController.getFolder);

// @ Route      PUT /api/folders/:id
// @ Desc       Update a folder
// @ Access     Private
router.put("/:id", authenticate, folderController.updateFolder);

// @ Route      DELETE /api/folders/:id
// @ Desc       Delete a folder
// @ Access     Private
router.delete("/:id", authenticate, folderController.deleteFolder);

module.exports = router;
