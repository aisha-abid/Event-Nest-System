import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  eventType: { type: String, required: true },
  eventDate: { type: Date, required: true, validate: {
    validator: function (value) {
      return value > new Date();
    },                                          //ye confict wala code hay ayesha ..ak hi chhez ko dafa kia gya ues karny se phly chek kar lyna
    
    message: 'Event date must be in the future.'
  }},
 
  venue: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Accepted', 'Rejected', 'Cancelled'], default: 'Pending' },
  confirmedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  confirmedAt: { type: Date }
}, { timestamps: true });

export default mongoose.model('Event', eventSchema);


const Event = mongoose.models.Event || mongoose.model('Event', eventSchema);