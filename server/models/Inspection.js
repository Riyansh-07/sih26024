const mongoose = require('mongoose');

const InspectionSchema = new mongoose.Schema(
  {
    mineId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Mine',
      required: [true, 'Please specify the mine ID'],
    },
    inspectorName: {
      type: String,
      required: [true, 'Please provide the inspector name'],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, 'Please provide the inspection date'],
      default: Date.now,
    },
    type: {
      type: String,
      required: [true, 'Please specify the inspection type'],
      enum: {
        values: ['safety', 'environmental', 'statutory'],
        message: '{VALUE} is not a valid inspection type',
      },
    },
    findings: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'passed', 'failed', 'follow-up-required'],
        message: '{VALUE} is not a valid inspection status',
      },
      default: 'pending',
    },
    severity: {
      type: String,
      enum: {
        values: ['minor', 'major', 'critical'],
        message: '{VALUE} is not a valid severity level',
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Inspection', InspectionSchema);
