import mongoose from "mongoose";
import Post from "../models/Post.js";

export const postComment = async (req, res) => {
  const { id: _id } = req.params;

  const { commentBody, userCommented, commentedto, userId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(200).send("Post unavalible");
  }


  try {
    const updatedPost = await Post.findByIdAndUpdate(_id, {
      $addToSet: { comments: [{ commentBody, userCommented, commentedto, userId }] },
    });
    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(400).json(error);
  }
};

export const deleteComment = async (req, res) => {
    const { id: _id } = req.params;
    const { commentId } = req.body;
  
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(200).send("Post unavalible");
    }
  
    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return res.status(200).send("Comment unavalible");
    }
  
    try {
      await Post.updateOne(
        { _id },
        { $pull: { comments: { _id: commentId } } }
      );
      res.status(200).json({message: "Successfully deleted..."})
    } catch (error) {
      res.status(405).json(error);
    }
  };
