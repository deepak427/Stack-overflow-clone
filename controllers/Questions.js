import Question from "../models/Question.js";
import Questions from "../models/Question.js";
import mongoose from "mongoose";

export const AskQuestion = async (req, res) => {
  const postQuestionData = req.body;
  const postQuestion = new Questions(postQuestionData);
  try {
    await postQuestion.save();
    res.status(200).json("posted a question successfully");
  } catch (error) {
    console.log(error);
    res.status(409).json("Could't post a new question");
  }
};

export const getAllquestions = async (req, res) => {
  try {
    const questionList = await Questions.find();
    res.status(200).json(questionList);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const deleteQuestion = async (req, res) => {
  const { id: _id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(200).send("Question unavalible");
  }
  try {
    await Question.findByIdAndRemove(_id);
    res.status(200).json({ message: "Successfully deleted..." });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const voteQuestion = async (req, res) => {
  const { id: _id } = req.params;

  const { value, userId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(200).send("Question unavalible");
  }
  try {
    const question = await Question.findById(_id);
    const upIndex = question.upVotes.findIndex((id) => id === String(userId));
    const downIndex = question.downVotes.findIndex(
      (id) => id === String(userId)
    );

    if (value === "upvote") {
      if (downIndex !== -1) {
        question.downVotes = question.downVotes.filter(
          (id) => id !== String(userId)
        );
      }

      if (upIndex === -1) {
        question.upVotes.push(userId);
      } else {
        question.upVotes = question.upVotes.filter((id) => id !== String(userId));
      }
    }

    else if (value === "downvote") {
        if (upIndex !== -1) {
          question.upVotes = question.upVotes.filter(
            (id) => id !== String(userId)
          );
        }
  
        if (downIndex === -1) {
          question.downVotes.push(userId);
        } else {
          question.downVotes = question.downVotes.filter((id) => id !== String(userId));
        }
      }
    
    await Question.findByIdAndUpdate(_id, question)


    res.status(200).json({ message: "Successfully Voted..." });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
