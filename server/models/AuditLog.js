const mongoose = require('mongoose');

const AuditLogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: [true, 'Please specify the action type'],
      enum: {
        values: ['CREATE', 'UPDATE', 'DELETE'],
        message: '{VALUE} is not a valid action type',
      },
    },
    entityType: {
      type: String,
      required: [true, 'Please specify the entity type'],
      enum: {
        values: ['Mine', 'Inspection', 'Grievance'],
        message: '{VALUE} is not a valid entity type',
      },
    },
    entityId: {
      type: String,
      required: [true, 'Please specify the entity ID'],
      trim: true,
    },
    recordSnapshot: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    performedBy: {
      type: String,
      trim: true,
      default: 'Portal User',
    },
    previousHash: {
      type: String,
      required: [true, 'Previous hash is required for chain continuity'],
      trim: true,
      default: '0000000000000000000000000000000000000000000000000000000000000000',
    },
    hash: {
      type: String,
      required: [true, 'SHA-256 hash is required'],
      trim: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('AuditLog', AuditLogSchema);
