import mongoose from "mongoose";

const UserFeedbackSchema = new mongoose.Schema({
  response: String,
  relates: Boolean,
  query: String,
  country: String,
}, { timestamps: true });

const UserFeedbackModel = mongoose.models.userFeedback || mongoose.model('userFeedback', UserFeedbackSchema);

export default UserFeedbackModel;