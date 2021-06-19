const express = require('express');
const TodoTask = require("./models/TodoTask");

const router = express.Router();



router.use('/', (req, res, next) => {
    console.log("/" + req.method);
    next();
})

router.get('/', (req, res) => {
    res.sendFile('views/main.html', { root: __dirname });
});

router.get('/todo', (req, res) => {
    TodoTask.find({}, (err, tasks) => {
        res.render("todo.ejs", { todoTasks: tasks })
    });
});

router.get('/todo-json', (req, res) => {
    TodoTask.find({}, (err, tasks) => {
        res.send({ todoTasks: tasks })
    });
});


router.post('/todo', async (req, res) => {
    console.log("i got soething", { body: req.body });
    const todoTask = new TodoTask({
        content: req.body.content
    });
    try {
        await todoTask.save();
        res.redirect("/todo");
    } catch (err) {
        res.redirect("/todo");
    }
});


router.route("/edit/:id")
    .get((req, res) => {
        const id = req.params.id;
        TodoTask.find({}, (err, tasks) => {
            res.render("todoEdit.ejs", { todoTasks: tasks, idTask: id });
        });
    })
    .post((req, res) => {
        const id = req.params.id;
        TodoTask.findByIdAndUpdate(id, { content: req.body.content }, err => {
            if (err) return res.send(500, err);
            res.redirect("/todo");
        });
    });


router.route("/remove/:id").get((req, res) => {
    const id = req.params.id;
    TodoTask.findByIdAndRemove(id, err => {
        if (err) return res.send(500, err);
        res.redirect("/todo");
    });
});

router.route("/remove-json/:id").get((req, res) => {
    const id = req.params.id;
    TodoTask.findByIdAndRemove(id, err => {
        if (err) return res.send(500, err);
        res.send({message:"success"});
    });
});





router.get('/cheese', (req, res, next) => {
    res.sendFile(__dirname + "/public/cheese/index.html");

});


router.get('/:id', (req, res, next) => {
    res.json({ message: "hello " + req.params.id });
})



module.exports = router;