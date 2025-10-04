import mongoose, { Document, Schema } from "mongoose";

interface ITask extends Document {
  title: string;
  description: string;
  category: mongoose.Types.ObjectId;   // references Category collection
  status: "Pending" | "In Progress" | "Completed";
  assignedUser: mongoose.Types.ObjectId[]; // references User(s)
  dueDate?: Date;
}

const TaskSchema = new Schema<ITask>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: Schema.Types.ObjectId, ref: "Category", },
  status: {
    type: String,
    enum: ["Pending", "In Progress", "Completed"],
    default: "Pending",
  },
  assignedUser: [{ type: Schema.Types.ObjectId, ref: "User" }], // array of users
  dueDate: { type: Date },
}, { timestamps: true });

export default mongoose.model<ITask>("Task", TaskSchema);
