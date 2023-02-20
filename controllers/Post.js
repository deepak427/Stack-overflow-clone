import Post from "../models/Post.js";
import mongoose from "mongoose";
import cloudinary from "cloudinary";

cloudinary.config({
  cloud_name: "drwb3xq26",
  api_key: "183644779267344",
  api_secret: "PvbozBEk7eEiJbsaiX9AILDXj3A",
});

async function handleUpload(path) {
  const res = await cloudinary.v2.uploader.upload(path, {
    resource_type: "auto",
  });

  return res;
}

async function handleUploadVideo(path) {
  const res = await cloudinary.v2.uploader.upload(path, {
    resource_type: "video",
    chunk_size: 6000000,
    eager: [
      {
        width: 300,
        height: 300,
        crop: "pad",
        audio_codec: "none",
      },
      {
        width: 160,
        height: 100,
        crop: "crop",
        gravity: "south",
        audio_codec: "none",
      },
    ],
    eager_async: true,
  });

  return res;
}

export const uploadImageCld = async (req, res) => {
  const { path } = req.file;

  try {
    const cldRes = await handleUpload(path);
    res.status(200).json({ url: cldRes.secure_url });
  } catch (error) {
    res.send({
      message: error.message,
    });
  }
};

export const uploadVideoCld = async (req, res) => {
  const { path } = req.file;

  try {
    const cldRes = await handleUploadVideo(path);
    res.status(200).json({ url: cldRes.secure_url });
  } catch (error) {
    res.send({
      message: error.message,
    });
  }
};

export const uploadPost = async (req, res) => {
  const uploadPostData = req.body;

  const uploadPost = new Post(uploadPostData);
  try {
    await uploadPost.save();
    res.status(200).json({ message: "Posted successfully" });
  } catch (error) {
    console.log(error);
    res.status(409).json("Could't post");
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const postList = await Post.find();
    res.status(200).json(postList);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const deletePost = async (req, res) => {
  const { id: _id } = req.params;
  const post = await Post.findById(_id);
  const public_id = post.url.split("/").pop().split(".")[0];
  const type =
    post.url.split("/").pop().split(".")[1] === "mp4" ? "video" : "image";

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(200).send("Post unavalible");
  }
  try {
    cloudinary.v2.uploader.destroy(
      public_id,
      { invalidate: true, resource_type: type },
      function (error, result) {
        console.log(result, error);
      }
    );
    await Post.findByIdAndRemove(_id);
    res.status(200).json({ message: "Successfully deleted..." });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const likePost = async (req, res) => {
  const { id: _id } = req.params;

  const { userId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(200).send("Post unavalible");
  }
  try {
    const post = await Post.findById(_id);
    const index = post.likedBy.findIndex((id) => id === String(userId));

    if (index === -1) {
      post.likedBy.push(userId);
    } else {
      post.likedBy = post.likedBy.filter((id) => id !== String(userId));
    }

    await Post.findByIdAndUpdate(_id, post);

    res.status(200).json({ message: "Successfully liked/disliked..." });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
