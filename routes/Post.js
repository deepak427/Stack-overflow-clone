import express from "express";
import { getAllPosts, deletePost, uploadPost, likePost, uploadImageCld,uploadVideoCld} from "../controllers/Post.js";
import auth from "../middleware/auth.js"
import Multer from "multer";

const storage = new Multer.diskStorage({});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "video/mp4") {
    cb(null, true);
  } else {
    cb(
      {
        message: "Unsupported File Format",
      },
      false
    );
  }
};

const uploadImage = Multer({storage});

const uploadVideo = Multer({
  storage,
  limits: {
    fieldNameSize: 200,
    fileSize: 30 * 1024 * 1024,
  },
  fileFilter,
});

const router = express.Router();

router.post('/uploadImage',auth,uploadImage.single("my_file"), uploadImageCld)
router.post('/uploadVideo', auth,uploadVideo.single("video"), uploadVideoCld);

router.post('/upload',auth, uploadPost)
router.get('/get', getAllPosts)
router.delete('/delete/:id',auth, deletePost)
router.patch('/like/:id',auth, likePost)

export default router