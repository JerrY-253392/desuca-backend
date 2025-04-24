import mongoose, { Schema } from 'mongoose';

// Task Schema
const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed'],
      default: 'pending',
    },
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'creatorModel',
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'assignedModel',
    },
    creatorModel: {
      type: String,
      required: true,
      enum: ['User', 'Admin', 'Manager'],
    },
    assignedModel: {
      type: String,
      required: true,
      enum: ['User', 'Admin', 'Manager'],
    },
  },
  { timestamps: true }
);

const Task = mongoose.model('Task', taskSchema);
export default Task;
