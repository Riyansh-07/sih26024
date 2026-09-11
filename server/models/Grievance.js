const mongoose = require('mongoose');

const GrievanceSchema = new mongoose.Schema(
  {
    mineId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Mine',
      required: [true, 'Please specify the mine ID'],
    },
    submittedBy: {
      type: String,
      required: [true, 'Please provide the submitter name'],
      trim: true,
    },
    category: {
      type: String,
      enum: {
        values: ['Wages', 'Safety', 'Environmental', 'General'],
        message: '{VALUE} is not a valid grievance category',
      },
      default: 'General',
    },
    description: {
      type: String,
      required: [true, 'Please provide a grievance description'],
      trim: true,
    },
    status: {
      type: String,
      enum: {
        values: ['submitted', 'in-review', 'resolved', 'rejected'],
        message: '{VALUE} is not a valid grievance status',
      },
      default: 'submitted',
    },
    dateSubmitted: {
      type: Date,
      default: Date.now,
    },
    dateResolved: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Grievance', GrievanceSchema);
