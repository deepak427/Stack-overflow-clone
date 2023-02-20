import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  name: { type: String, requred: true },
  email: { type: String, requred: true },
  password: { type: String, requred: true },
  friends: [
    {
      friendId: { type: String },
      friendName: { type: String },
    },
  ],
  friendRequests: [
    {
      friendId: { type: String },
      friendName: { type: String },
    },
  ],
  sentRequests: { type: [String] },
  about: { type: String },
  tags: { type: [String] },
  joinedOn: { type: Date, default: Date.now },
  subscription: { type: String, default: "Free" },
  subscriptionId: { type: String },
  remainingQuestions: { type: String, default: "1" },
});

export default mongoose.model("User", userSchema);
