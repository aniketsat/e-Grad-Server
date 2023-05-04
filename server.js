const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const connectDb = require("./config/db");

const { PORT } = require("./config/config");

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

// Logger middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${req.ip}`);
  next();
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/folders", require("./routes/folderRoutes"));
app.use("/api/files", require("./routes/fileRoutes"));
app.use("/api/posts", require("./routes/postRoutes"));
app.use("/api/replies", require("./routes/replyRoutes"));
app.use("/api/questions", require("./routes/questionRoutes"));

app.listen(PORT, () => {
  connectDb();
  console.log(`Server is running on http://localhost:${PORT}`);
});
