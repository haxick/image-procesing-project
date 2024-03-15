import { Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import sharp from "sharp";

export const renderUploadForm = (req: Request, res: Response) => {
  res.render("upload");
};
export const renderResizeForm = (req: Request, res: Response) => {
  const imagepath = path.join(__dirname, "../images");
  fs.readdir(imagepath, (err, files) => {
    if (err) {
      console.error("Error reading directory:", err);
      res.status(500).send("Internal Server Error");
      return;
    }
    res.render("resize", { files });
  });
};
export const renderCropForm = (req: Request, res: Response) => {
  const imagepath = path.join(__dirname, "../images");
  fs.readdir(imagepath, (err, files) => {
    if (err) {
      console.error("Error reading directory:", err);
      res.status(500).send("Internal Server Error");
      return;
    }
    res.render("crop", { files });
  });
};
export const renderDownloadForm = (req: Request, res: Response) => {
  const imagepath = path.join(__dirname, "../images");
  fs.readdir(imagepath, (err, files) => {
    if (err) {
      console.error("Error reading directory:", err);
      res.status(500).send("Internal Server Error");
      return;
    }
    res.render("download", { files: files });
  });
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/images/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

export const upload = multer({ storage: storage });

export const uploadImage = (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded");
  }
  console.log(req.file);
  res.send("File uploaded successfully!");
};

export const downloadImage = (req: Request, res: Response) => {
  try {
    const imageName = req.body.imageName;

    const imagePath = path.join(__dirname, "../images/", imageName);

    if (!fs.existsSync(imagePath)) {
      return res.status(404).send("Image not found");
    }
    res.setHeader("Content-Type", "image/jpeg");
    res.setHeader("Content-Disposition", `attachment; filename=${imageName}`);

    fs.createReadStream(imagePath).pipe(res);
  } catch (error) {
    console.error("Error downloading image:", error);
    res.status(500).send("Error downloading image");
  }
};

export const resizeImage = async (req: Request, res: Response) => {
  console.log(req.body);
  try {
    const { width, height, imageName } = req.body;
    console.log(width, height, imageName);

    if (!width || !height || !imageName) {
      return res.status(400).send("Width and height parameters are required");
    }

    const imagePath = path.join(__dirname, "../images/", imageName);
    const imagePathTemp = imagePath + "_temp";

    await sharp(imagePath)
      .resize(parseInt(width), parseInt(height), {
        fit: "contain",
      })
      .toFile(imagePathTemp)
      .then(() => {
        fs.rename(imagePathTemp, imagePath, (err) => {
          if (err) throw err;
          res.send("image got resized");
        });
      });
  } catch (error) {
    console.error("Error resizing image:", error);
    res.status(500).send("Error resizing image");
  }
};
export const cropImage = async (req: Request, res: Response) => {
  try {
    const cropOptions = {
      left: parseInt(req.body.left, 10),
      top: parseInt(req.body.top, 10),
      width: parseInt(req.body.width, 10),
      height: parseInt(req.body.height, 10),
    };
    const imageName = req.body.imageName;

    const imagePath = path.join(__dirname, "../images/", imageName);
    const imagePathTemp = imagePath + "_temp";

    await sharp(imagePath)
      .extract(cropOptions)
      .toFile(imagePathTemp)
      .then(() => {
        fs.rename(imagePathTemp, imagePath, (err) => {
          if (err) {
            throw err;
          }
          res.send("Image cropped and saved successfully");
        });
      });
  } catch (error) {
    console.error("Error resizing image:", error);
    res.status(500).send("Error resizing image");
  }
};
