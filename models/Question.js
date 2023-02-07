import mongoose from "mongoose";

const QuestionSchema = mongoose.Schema({
    upVotes: {type: [String], default: []},
    downVotes: {type: [String], default: []},
    noOfAnswers: {type: Number, default: 0},
    questionTitle: {type: String, required: "Question must have a title"},
    questionBody: {type: String, required: "Question must have a body"},
    questionTags: {type: [String], required: "Question must have tags"},
    userPosted: {type: String, required: "Question must have an auther"},
    askedOn: {type: Date, default: Date.now},
    userId: {type: String},
    answer: [{
      answerBody: String,
      userAnswered: String,
      answeredOn: {type: Date, default: Date.now},
      userId: String
    }]
    })

    export default mongoose.model("question", QuestionSchema)