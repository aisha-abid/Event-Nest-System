import mongoose from "mongoose";
const { Schema } = mongoose;

const messageSchema = new Schema(
  {
    userId: { 
      type: Schema.Types.ObjectId, 
      required: true, 
      ref: "User" 
    }, // jis customer ke liye ye chat hai

    sender: { 
      type: String, 
      enum: ["user", "admin"], 
      required: true 
    }, // kisne bheja

    text: { 
      type: String, 
      required: true 
    }, // message content

    read: { 
      type: Boolean, 
      default: false 
    }, // message read hua ya nahi (future me read receipts ke liye)

    socketId: { 
      type: String 
    } // optional: agar tum chaho to track kar sakti ho kis socket se aaya
  },
  { 
    timestamps: true // createdAt, updatedAt auto add honge
  }
);

export default mongoose.model("Message", messageSchema);
