const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Joi = require("joi");

const User = require("../models/userModel");
const Profile = require("../models/profileModel");
const Resume = require("../models/resumeModel");

const { JWT_SECRET } = require("../config/config");
const { default: mongoose } = require("mongoose");

// @route    POST api/users/register
// @desc     Register user
// @access   Public
const register = async (req, res) => {
  try {
    // Validate data before creating a user
    const { error } = registerValidation(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message:
          error.details[0].message.replace(/"/g, "")[0].toUpperCase() +
          error.details[0].message.replace(/"/g, "").slice(1),
      });
    }

    // Check if sic already exists
    const sicExists = await User.findOne({ sic: req.body.sic });
    if (sicExists) {
      return res.status(400).json({
        success: false,
        message: "SIC already exists",
      });
    }

    // Check if email already exists
    const emailExists = await User.findOne({ email: req.body.email });
    if (emailExists) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Create new user
    const user = await new User({
      name: req.body.name,
      email: req.body.email,
      sic: req.body.sic,
      age: req.body.age,
      address: req.body.address,
      branch: req.body.branch,
      gender: req.body.gender,
      skills: req.body.skills,
      password: hashedPassword,
    });

    // Save user to database
    const savedUser = await user.save();
    if (!savedUser) {
      return res.status(400).json({
        success: false,
        message: "User not saved",
      });
    }

    res.status(200).json({
      success: true,
      message: "User registered successfully",
      _id: savedUser._id,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      success: false,
      message: "Error registering user",
    });
  }
};

// @route    POST api/users/login
// @desc     Login user and return JWT token
// @access   Public
const login = async (req, res) => {
  try {
    const { error } = loginValidation(req.body);
    if (error) {
      console.log(error);
      return res.status(400).json({
        success: false,
        message:
          error.details[0].message.replace(/"/g, "")[0].toUpperCase() +
          error.details[0].message.replace(/"/g, "").slice(1),
      });
    }

    console.log(req.body);

    // Check if sic exists
    const sicExists = await User.findOne({ sic: req.body.sic });
    if (!sicExists) {
      return res.status(400).json({
        success: false,
        message: "SIC does not exist",
      });
    }

    // Check if password is correct
    const validPassword = await bcrypt.compare(
      req.body.password,
      sicExists.password
    );

    if (!validPassword) {
      return res.status(400).json({
        success: false,
        message: "Invalid password",
      });
    }
    // Create and assign a token
    const token = jwt.sign({ _id: sicExists._id }, JWT_SECRET);

    // save token in auth header
    req.header("Authorization", token);

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      user: sicExists,
      token: token,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      success: false,
      message: "Error logging in",
    });
  }
};

// @route    GET api/users/me
// @desc     Get current user
// @access   Private
const getCurrentUser = async (req, res) => {
  try {
    // Get user from database
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User found",
      user: user,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      success: false,
      message: "Error getting user",
    });
  }
};

// @route    POST api/users/profile
// @desc     Create profile
// @access   Private
const createProfile = async (req, res) => {
  try {
    console.log(req.body);
    // Get user from database
    const user = await User.findById(req.body.user);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    // get profile from req.file
    const profile = req.file;

    // save profile in database
    const newProfile = new Profile({
      user: user._id,
      data: profile.buffer,
      contentType: profile.mimetype,
      name: profile.originalname,
    });

    const savedProfile = await newProfile.save();

    if (!savedProfile) {
      return res.status(400).json({
        success: false,
        message: "Profile not saved",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile created successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      success: false,
      message: "Error creating profile",
    });
  }
};

// @route    GET api/users/profile
// @desc     Get profile
// @access   Private
const getProfile = async (req, res) => {
  console.log(req.user);
  try {
    // Get user from database
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    // Get profile from database
    const profile = await Profile.findOne({ user: user._id });
    console.log(profile);
    if (!profile) {
      return res.status(400).json({
        success: false,
        message: "Profile not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile found",
      profile: profile,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      success: false,
      message: "Error getting profile",
    });
  }
};

// @route    POST api/users/resume
// @desc     Create resume
// @access   Private
const createResume = async (req, res) => {
  try {
    // Get user from database
    const user = await User.findById(req.body.user);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    // get resume from req.file
    const resume = req.file;

    // save resume in database
    const newResume = new Resume({
      user: user._id,
      data: resume.buffer,
      contentType: resume.mimetype,
      name: resume.originalname,
    });

    const savedResume = await newResume.save();

    if (!savedResume) {
      return res.status(400).json({
        success: false,
        message: "Resume not saved",
      });
    }

    res.status(200).json({
      success: true,
      message: "Resume created successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      success: false,
      message: "Error creating resume",
    });
  }
};

// @route    GET api/users/resume
// @desc     Get resume
// @access   Private
const getResume = async (req, res) => {
  try {
    // Get user from database
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    // Get resume from database
    const resume = await Resume.findOne({ user: user._id });
    if (!resume) {
      return res.status(400).json({
        success: false,
        message: "Resume not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Resume found",
      resume: resume,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      success: false,
      message: "Error getting resume",
    });
  }
};

// Register validation
const registerValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(6).required(),
    email: Joi.string().min(6).required().email(),
    sic: Joi.string().min(8).max(8).required(),
    age: Joi.number().min(18).required(),
    address: Joi.string().min(20).required(),
    branch: Joi.string().min(2).max(5).required(),
    gender: Joi.string().min(4).max(6).required(),
    skills: Joi.array().required(),
    password: Joi.string().min(6).required(),
  });
  return schema.validate(data);
};

// Login validation
const loginValidation = (data) => {
  const schema = Joi.object({
    sic: Joi.string().min(8).max(8).required(),
    password: Joi.string().min(6).required(),
  });
  return schema.validate(data);
};

module.exports = {
  register,
  login,
  getCurrentUser,
  createProfile,
  getProfile,
  createResume,
  getResume,
};
