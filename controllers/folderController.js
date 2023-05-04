const Folder = require("../models/folderModel");
const File = require("../models/fileModel");

const createFolder = async (req, res) => {
  try {
    const { name, path, owner, username } = req.body;

    if (!name || !path || !owner || !username) {
      return res.status(400).json({
        success: false,
        message: "Missing name, path, owner or username",
      });
    }

    const folder = await Folder.create({
      name,
      path,
      owner,
      username,
    });

    res.status(201).json({
      success: true,
      message: "Folder created successfully",
      data: folder,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

const getAllFolders = async (req, res) => {
  try {
    const folders = await Folder.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Fetched all folders",
      data: folders,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

const getFolder = (req, res) => {
  res.send("Get a folder");
};

const updateFolder = (req, res) => {
  res.send("Update a folder");
};

const deleteFolder = async (req, res) => {
  try {
    const folder = await Folder.findById(req.params.id);

    if (!folder) {
      return res.status(404).json({
        success: false,
        message: "Folder not found",
      });
    }

    // check if the folder belongs to the user
    if (folder.owner.toString() !== req.user._id) {
      return res.status(401).json({
        success: false,
        message: "You are not authorized to delete this folder",
      });
    }

    // path for folders inside the folder
    const folderPath = `${folder.path}${folder.name}/`;

    // check if folder is empty
    const files = await File.find({ path: folderPath });
    if (files.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Folder is not empty",
      });
    }

    const folders = await Folder.find({ path: folderPath });
    if (folders.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Folder is not empty",
      });
    }

    const deletedFolder = await Folder.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Folder deleted successfully",
      data: deletedFolder,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

module.exports = {
  createFolder,
  getAllFolders,
  getFolder,
  updateFolder,
  deleteFolder,
};
