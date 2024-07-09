const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const authMiddleware = require('../middleware/authMiddleware');

// Get all tasks for the authenticated user
router.get('/', authMiddleware, async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.user._id });
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create a new task
router.post('/', authMiddleware, async (req, res) => {
    const { title, description, dueDate, priority, reminder } = req.body;
    try {
        const newTask = new Task({ title, description, dueDate, priority, reminder, userId: req.user._id });
        const savedTask = await newTask.save();
        res.json(savedTask);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update a task
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const updatedTask = await Task.findOneAndUpdate({ _id: req.params.id, userId: req.user._id }, req.body, { new: true });
        res.json(updatedTask);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a task
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        await Task.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
        res.json({ message: 'Task deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Mark a task as completed
router.patch('/:id/complete', authMiddleware, async (req, res) => {
    try {
        const updatedTask = await Task.findOneAndUpdate({ _id: req.params.id, userId: req.user._id }, { isCompleted: true }, { new: true });
        res.json(updatedTask);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Set a reminder for a task
router.patch('/:id/reminder', authMiddleware, async (req, res) => {
    const { reminder } = req.body;
    try {
        const updatedTask = await Task.findOneAndUpdate({ _id: req.params.id, userId: req.user._id }, { reminder }, { new: true });
        res.json(updatedTask);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
