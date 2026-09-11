const mongoose = require('mongoose');

const MineSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a mine name'],
      trim: true,
    },
    location: {
      state: {
        type: String,
        trim: true,
      },
      district: {
        type: String,
        trim: true,
      },
    },
    type: {
      type: String,
      required: [true, 'Please specify the mine type'],
      enum: {
        values: ['opencast', 'underground'],
        message: '{VALUE} is not a valid mine type',
      },
    },
    coalGrade: {
      type: String,
      trim: true,
    },
    capacityMtpa: {
      type: Number,
      min: [0, 'Capacity cannot be negative'],
    },
    operationalStatus: {
      type: String,
      enum: {
        values: ['active', 'under-maintenance', 'closed'],
        message: '{VALUE} is not a valid operational status',
      },
      default: 'active',
    },
    subsidiary: {
      type: String,
      required: [true, 'Please provide the subsidiary name'],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Mine', MineSchema);
