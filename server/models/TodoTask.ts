import mongoose from 'mongoose';

const todoTaskSchema = new mongoose.Schema({

    content: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        default: null
    }

})

const TodoTask = mongoose.model('TodoTask', todoTaskSchema);

export default TodoTask;

//module.exports = mongoose.model('TodoTask', todoTaskSchema);