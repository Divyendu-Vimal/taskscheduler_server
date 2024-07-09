const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const authMiddleware = require('../middleware/authMiddleware');

// Get all tasks for the authenticated user
router.get('/', authMiddleware, async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.user._id });
        console.log('GET /api/tasks:', tasks);
        res.json(tasks);
    } catch (err) {
        console.error('Error fetching tasks:', err);
        res.status(500).json({ error: err.message });
    }
});

// Create a new task
router.post('/', authMiddleware, async (req, res) => {
    const { title, description, dueDate, priority, reminder } = req.body;
    try {
        const newTask = new Task({ title, description, dueDate, priority, reminder, userId: req.user._id });
        console.log('POST /api/tasks - New Task:', newTask);
        const savedTask = await newTask.save();
        console.log('POST /api/tasks - Saved Task:', savedTask);
        res.json(savedTask);
    } catch (err) {
        console.error('Error creating task:', err);
        res.status(500).json({ error: err.message });
    }
});

// Update a task
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const updatedTask = await Task.findOneAndUpdate({ _id: req.params.id, userId: req.user._id }, req.body, { new: true });
        console.log('PUT /api/tasks/:id - Updated Task:', updatedTask);
        res.json(updatedTask);
    } catch (err) {
        console.error('Error updating task:', err);
        res.status(500).json({ error: err.message });
    }
});

// Delete a task
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        await Task.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
        console.log('DELETE /api/tasks/:id - Task Deleted');
        res.json({ message: 'Task deleted' });
    } catch (err) {
        console.error('Error deleting task:', err);
        res.status(500).json({ error: err.message });
    }
});

// Mark a task as completed
router.patch('/:id/complete', authMiddleware, async (req, res) => {
    try {
        const updatedTask = await Task.findOneAndUpdate({ _id: req.params.id, userId: req.user._id }, { isCompleted: true }, { new: true });
        console.log('PATCH /api/tasks/:id/complete - Task Completed:', updatedTask);
        res.json(updatedTask);
    } catch (err) {
        console.error('Error marking task as completed:', err);
        res.status(500).json({ error: err.message });
    }
});

// Set a reminder for a task
router.patch('/:id/reminder', authMiddleware, async (req, res) => {
    const { reminder } = req.body;
    try {
        const updatedTask = await Task.findOneAndUpdate({ _id: req.params.id, userId: req.user._id }, { reminder }, { new: true });
        console.log('PATCH /api/tasks/:id/reminder - Reminder Set:', updatedTask);
        res.json(updatedTask);
    } catch (err) {
        console.error('Error setting reminder:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
