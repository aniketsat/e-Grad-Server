const File = require("../models/fileModel");

// @Route     POST /api/files
// @Desc      Create a file
// @Access    Private
const createFile = async (req, res) => {
  try {
    const { originalname, mimetype, buffer, size } = req.file;

    const { path, owner, username } = req.body;

    // check if a file with same name exists in same path or not
    const fileExists = await File.findOne({ name: originalname, path });
    if (fileExists) {
      return res.status(400).json({
        success: false,
        message: "File with same name already exists in this path",
      });
    }

    const file = File.create({
      name: originalname,
      path,
      owner,
      size,
      data: buffer,
      contentType: mimetype,
      username,
    });

    res.status(201).json({
      success: true,
      data: file,
      message: "File created successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      err: error.message,
    });
  }
};

// @Route     GET /api/files
// @Desc      Get all files
// @Access    Private
const getAllFiles = async (req, res) => {
  try {
    const files = await File.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: files,
      message: "Files retrieved successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      err: error.message,
    });
  }
};

// @Route     GET /api/files/:id
// @Desc      Get a file
// @Access    Private
const getFile = (req, res) => {
  res.send("Get a file");
};

// @Route     PUT /api/files/:id
// @Desc      Update a file
// @Access    Private
const updateFile = (req, res) => {
  res.send("Update a file");
};

// @Route     DELETE /api/files/:id
// @Desc      Delete a file
// @Access    Private
const deleteFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    // Check if the file belongs to the user
    if (file.owner.toString() !== req.user._id) {
      return res.status(401).json({
        success: false,
        message: "You are not authorized to delete this file",
      });
    }

    const deletedFile = await File.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      data: deletedFile,
      message: "File deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      err: error.message,
    });
  }
};

module.exports = {
  createFile,
  getAllFiles,
  getFile,
  updateFile,
  deleteFile,
};
