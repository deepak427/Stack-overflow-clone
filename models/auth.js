import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name: {type: String, requred: true},
    email: {type: String, requred: true},
    password: {type: String, requred: true},
    about: {type: String},
    tags: {type: [String]},
    joinedOn: {type: Date, default: Date.now}
})

export default mongoose.model("User", userSchema)