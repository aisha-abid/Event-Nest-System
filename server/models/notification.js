import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  toUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['Read', 'Unread'], default: 'Unread' }
}, { timestamps: true });

export default mongoose.model('Notification', notificationSchema);
