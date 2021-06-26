import mongoose from 'mongoose';

const todoTaskSchema = new mongoose.Schema({

    content: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})

const TodoTask = mongoose.model('TodoTask', todoTaskSchema);

export default TodoTask;

//module.exports = mongoose.model('TodoTask', todoTaskSchema);