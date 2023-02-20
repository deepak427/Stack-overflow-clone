import mongoose from "mongoose";

const PostSchema = mongoose.Schema({
    userId: {type:String},
    caption: { type: String},
    url: {type: String},
    userPosted: {type: String},
    postedOn: {type: Date, default: Date.now},
    noOfComments: {type: Number, default: 0},
    comments: [{
        commentBody: {type: String},
        userCommented: {type: String},
        commentedto: {type: String},
        commentedOn: {type: Date, default: Date.now},
        userId: {type: String},
    }],
    likes: {type: Number, default: 0},
    likedBy: {type: [String]},
});

export default mongoose.model("post", PostSchema)
