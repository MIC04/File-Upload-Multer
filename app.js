const express = require("express");
const path = require("path");
const ejs = require("ejs");
const multer = require("multer");

//set Storage Engine
const storage = multer.diskStorage({
  destination: "./public/upload/",
  filename: function (req, res, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single("myImage");

function checkFileType(file, cb) {
  // Allowed Images
  const fileTypes = /jpeg|jpg|png|gif/;
  //check ext
  const extnm = fileTypes.test(path.extname(file.originalname).toLowerCase());
  //Check MIME type
  const mimetype = fileTypes.test(file.mimetype);
  if (mimetype && extnm) {
    return cb(null, true);
  } else {
    cb("Error, Image Only!");
  }
}

const port = 3000;
const app = express();
app.set("view engine", "ejs");
app.use(express.static("./publc"));

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/upload", (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      res.render("index", {
        msg: err,
      });
    } else {
      if (req.file == undefined) {
        res.render("index", {
          msg: "Error: No File Selected",
        });
      } else {
        res.render("index", {
          msg: "File Uploaded!",
          file: `uploads/${req.file.filename}`,
        });
      }
    }
  });
});

app.listen(port, () => {
  console.log(`Server is Running on http://localhost:${port}`);
});
