import express from 'express';
import jwt from 'jsonwebtoken';
import TodoTask from "./models/TodoTask.js";
import cookie from "cookie";


const router = express.Router();

// import auth from "./auth";

import auth from "./auth.js";
import verify from "./verifyToken.js";

//const __dirname = process.cwd();
import path from 'path';
const __dirname = path.resolve();


router.use('/', (req, res, next) => {
    console.log("/" + req.method);
    next();
})

router.get('/', (req, res) => {
    res.sendFile('views/main.html', { root: __dirname });
});

router.get('/todo', verify, (req, res) => {
    TodoTask.find({}, (err, tasks) => {
        res.render("todo.ejs", { todoTasks: tasks })
    });
});

router.get('/login', (req, res) => {
    res.sendFile('views/login.html', { root: __dirname });
});

router.post('/register', auth);
router.post('/login', auth);

router.get('/logout', (req, res) => {
    res.sendFile('views/logout.html', { root: __dirname });
});

router.get('/todo-json', (req, res) => {
    TodoTask.find({}, (err, tasks) => {
        res.send({ todoTasks: tasks })
    });
});


router.post('/todo', async (req, res) => {
    
    const cookies = cookie.parse(req.headers.cookie);
    const token = cookies.token;
    
    let parsedToken = jwt.decode(token, { json: true});
    parsedToken = JSON.parse(JSON.stringify(parsedToken));

    const todoTask = new TodoTask({
        content: req.body.content,
        author: parsedToken._id
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


// router.get('/:id', (req, res, next) => {
//     res.json({ message: "hello " + req.params.id });
// })


export default router;

//module.exports = router;