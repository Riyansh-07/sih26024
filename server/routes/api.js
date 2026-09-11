const express = require('express');
const mongoose = require('mongoose');
const Item = require('../models/Item');

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

// GET /api/items - Fetch all items
router.get('/items', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json({
        success: true,
        data: [],
        note: 'MongoDB is not connected. Configure MONGO_URI in server/.env to enable persistence.',
      });
    }

    const items = await Item.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch items',
      error: error.message,
    });
  }
});

// POST /api/items - Create a new item
router.post('/items', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(400).json({
        success: false,
        message: 'MongoDB is not connected. Please set a valid MONGO_URI in server/.env to save items.',
      });
    }

    const { title, description, status } = req.body;
    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Title is required',
      });
    }

    const item = await Item.create({ title, description, status });
    res.status(201).json({
      success: true,
      data: item,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to create item',
      error: error.message,
    });
  }
});

// DELETE /api/items/:id - Delete an item
router.delete('/items/:id', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(400).json({
        success: false,
        message: 'MongoDB is not connected',
      });
    }

    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Item deleted successfully',
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete item',
      error: error.message,
    });
  }
});

module.exports = router;
