import express, { Router } from "express";
import {
  renderUploadForm,
  renderResizeForm,
  uploadImage,
  upload,
  resizeImage,
  renderCropForm,
  renderDownloadForm,
  downloadImage,
  cropImage,
} from "../controllers/imageController";

const router: Router = express.Router();

router.route("/").get(renderUploadForm);
router.route("/resize").post(resizeImage);
router.route("/resize").get(renderResizeForm);
router.route("/crop").get(renderCropForm);
router.route("/crop").post(cropImage);
router.route("/download").get(renderDownloadForm);
router.route("/download").post(downloadImage);

router.route("/").post(upload.single("image"), uploadImage);

export default router;
