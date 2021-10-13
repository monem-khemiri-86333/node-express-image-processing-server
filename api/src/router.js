const router = require("express").Router();
const multer = require("multer");

const storage = multer.diskStorage({
  destination: "api/uploads/",
  filename: filename,
});

const upload = multer({
  fileFilter: fileFilter,
  storage: storage,
});

function filename(request, file, callback) {
  callback(null, filename.originalname);
}
function fileFilter(request, file, callback) {
  if (file.mimetype !== "image/png") {
    request.fileValidationError = "Wrong file type";
    callback(null, false);
  } else {
    callback(null, true);
  }
}
router.post("/upload", upload.single("photo"), (request, response) => {
  if (request.fileValidationError) {
    response.status(400).json({
      error: request.fileValidationError,
    });
  } else {
    response.status(201).json({
      success: true,
    });
  }
});
module.exports = router;
