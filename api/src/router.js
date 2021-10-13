const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const imageProcessor = require("./imageProcessor");

const photoPath = path.resolve(__dirname, "../../client/photo-viewer.html");
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
router.get("photo-viewer", (request, response) => {
  response.sendFile(photoPath);
});
router.post("/upload", upload.single("photo"), async (request, response) => {
  if (request.fileValidationError) {
    response.status(400).json({
      error: request.fileValidationError,
    });
  } else {
    response.status(201).json({
      success: true,
    });
  }
  try {
    await imageProcessor(request.file.filename);
  } catch {}
});
module.exports = router;
