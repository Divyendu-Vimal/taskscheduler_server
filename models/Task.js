const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    dueDate: { type: Date },
    priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Low' },
    isCompleted: { type: Boolean, default: false },
    reminder: { type: Date },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }  // Add userId field
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
