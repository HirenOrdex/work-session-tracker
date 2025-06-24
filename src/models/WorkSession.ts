import mongoose from 'mongoose';

const WorkSessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  startTime: Date,
  endTime: Date,
  breaks: [{
    start: Date,
    end: Date
  }],
  checkedOutAutomatically: Boolean
}, { timestamps: true });

export default mongoose.model("WorkSession", WorkSessionSchema);
