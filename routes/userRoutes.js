const express = require("express");
const multer = require("multer");

const userController = require("../controllers/userController");

const authenticate = require("../middleware/authMiddleware");

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

// @route   POST api/users/register
// @desc    Register user
// @access  Public
router.post("/register", userController.register);

// @route   POST api/users/login
// @desc    Login user and return JWT token
// @access  Public
router.post("/login", userController.login);

// @route   GET api/users/me
// @desc    Get current user
// @access  Private
router.get("/me", authenticate, userController.getCurrentUser);

// @route    POST api/users/profile
// @desc     Create profile
// @access   Public
router.post(
  "/profile",
  upload.single("profile", 1),
  userController.createProfile
);

// @route    GET api/users/profile
// @desc     Get profile
// @access   Private
router.get("/profile", authenticate, userController.getProfile);

// @route    POST api/users/resume
// @desc     Create resume
// @access   Public
router.post("/resume", upload.single("resume", 1), userController.createResume);

// @route    GET api/users/resume
// @desc     Get resume
// @access   Private
router.get("/resume", authenticate, userController.getResume);

module.exports = router;
