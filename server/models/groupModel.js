import mongoose from "mongoose";

const GroupSchema = new mongoose.Schema({
    name: String,
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    createdAt: { type: Date, default: Date.now }
  });

export const Group = mongoose.model('GroupSchema', ChatSchema);
export default Group;
