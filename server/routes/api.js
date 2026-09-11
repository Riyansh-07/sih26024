const express = require('express');
const mongoose = require('mongoose');
const Mine = require('../models/Mine');
const Inspection = require('../models/Inspection');

const router = express.Router();

// GET /api/health - Health check endpoint with DB status
router.get('/health', (req, res) => {
  const dbStateMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  const dbState = mongoose.connection.readyState;

  res.status(200).json({
    success: true,
    message: 'Backend server is running smoothly',
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(process.uptime())}s`,
    database: {
      status: dbStateMap[dbState] || 'unknown',
      connected: dbState === 1,
      readyState: dbState,
    },
  });
});

// ==========================================
// MINE ROUTES (/api/mines)
// ==========================================

// GET /api/mines - Fetch all mines
router.get('/mines', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json({
        success: true,
        data: [],
        note: 'MongoDB is not connected. Configure MONGO_URI in server/.env to enable persistence.',
      });
    }

    const mines = await Mine.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: mines.length,
      data: mines,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch mines',
      error: error.message,
    });
  }
});

// GET /api/mines/:id - Fetch a single mine by ID
router.get('/mines/:id', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(400).json({
        success: false,
        message: 'MongoDB is not connected',
      });
    }

    const mine = await Mine.findById(req.params.id);
    if (!mine) {
      return res.status(404).json({
        success: false,
        message: 'Mine not found',
      });
    }

    res.status(200).json({
      success: true,
      data: mine,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch mine',
      error: error.message,
    });
  }
});

// POST /api/mines - Create a new mine
router.post('/mines', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(400).json({
        success: false,
        message: 'MongoDB is not connected. Please set a valid MONGO_URI in server/.env to save mines.',
      });
    }

    const mine = await Mine.create(req.body);
    res.status(201).json({
      success: true,
      data: mine,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to create mine',
      error: error.message,
    });
  }
});

// PUT /api/mines/:id - Update a mine by ID
router.put('/mines/:id', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(400).json({
        success: false,
        message: 'MongoDB is not connected',
      });
    }

    const mine = await Mine.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!mine) {
      return res.status(404).json({
        success: false,
        message: 'Mine not found',
      });
    }

    res.status(200).json({
      success: true,
      data: mine,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to update mine',
      error: error.message,
    });
  }
});

// DELETE /api/mines/:id - Delete a mine by ID
router.delete('/mines/:id', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(400).json({
        success: false,
        message: 'MongoDB is not connected',
      });
    }

    const mine = await Mine.findByIdAndDelete(req.params.id);
    if (!mine) {
      return res.status(404).json({
        success: false,
        message: 'Mine not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Mine deleted successfully',
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete mine',
      error: error.message,
    });
  }
});

// ==========================================
// INSPECTION ROUTES (/api/inspections)
// ==========================================

// GET /api/inspections - Fetch all inspections (populate mineId with mine name)
router.get('/inspections', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json({
        success: true,
        data: [],
        note: 'MongoDB is not connected. Configure MONGO_URI in server/.env to enable persistence.',
      });
    }

    const inspections = await Inspection.find()
      .populate('mineId', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: inspections.length,
      data: inspections,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch inspections',
      error: error.message,
    });
  }
});

// GET /api/inspections/:id - Fetch a single inspection by ID
router.get('/inspections/:id', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(400).json({
        success: false,
        message: 'MongoDB is not connected',
      });
    }

    const inspection = await Inspection.findById(req.params.id).populate('mineId', 'name');
    if (!inspection) {
      return res.status(404).json({
        success: false,
        message: 'Inspection not found',
      });
    }

    res.status(200).json({
      success: true,
      data: inspection,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch inspection',
      error: error.message,
    });
  }
});

// POST /api/inspections - Create a new inspection
router.post('/inspections', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(400).json({
        success: false,
        message: 'MongoDB is not connected. Please set a valid MONGO_URI in server/.env to save inspections.',
      });
    }

    const inspection = await Inspection.create(req.body);
    res.status(201).json({
      success: true,
      data: inspection,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to create inspection',
      error: error.message,
    });
  }
});

// DELETE /api/inspections/:id - Delete an inspection by ID
router.delete('/inspections/:id', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(400).json({
        success: false,
        message: 'MongoDB is not connected',
      });
    }

    const inspection = await Inspection.findByIdAndDelete(req.params.id);
    if (!inspection) {
      return res.status(404).json({
        success: false,
        message: 'Inspection not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Inspection deleted successfully',
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete inspection',
      error: error.message,
    });
  }
});

module.exports = router;
