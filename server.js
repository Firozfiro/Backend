// Using Express
const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");

// create an instance of express
const app = express();
app.use(express.json());
app.use(cors());

//sample in memory storage for todo items
// let todos = [];

// connecting mongoose
// mongoose.connect('mongodb://localhost:27017/firoz-app')
mongoose.connect('mongodb+srv://code-with-firoz:FSogOtOPQhQ05Jz4@cluster0.dhctwap.mongodb.net/?appName=Cluster0')
    .then(() => {
        console.log('DB Connected')
    })
    .catch((err) => {
        console.log(err)
    })

//creating schema
const todoSchema = new mongoose.Schema({
    title: {
        required: true,
        type: String
    },
    description: String
})

//creating Model
const todoModel = mongoose.model('Todo', todoSchema);


// create a new todo item
app.post('/todos', async (req, res) => {
    const { title, description } = req.body;
    // const newTodo = {
    //     id: todos.length + 1,
    //     title,
    //     description
    // };
    // todos.push(newTodo);
    // console.log(todos)

    try {
        const newTodo = new todoModel({ title, description })
        await newTodo.save();
        res.status(201).json(newTodo);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
})

//Get all items 
app.get('/todos', async (req, res) => {
    try {
        const todos = await todoModel.find()
        res.json(todos);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
})

//update a todo item 
app.put('/todos/:id', async (req, res) => {
    try {
        const { title, description } = req.body;
        const id = req.params.id;
        const updatedTodo = await todoModel.findByIdAndUpdate(
            id,
            { title, description },
            { new: true }
        )
        if (!updatedTodo) {
            return res.status(404).json({ message: "Todo not found" })
        }
        res.json(updatedTodo)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message });
    }

})

//Delete a todo item
app.delete('/todos/:id', async (req, res) => {
    try {
        const id = req.params.id;
        await todoModel.findByIdAndDelete(id);
        res.status(204).end();
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message });
    }
})


//start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('server is listing to port' + port);
})

//route
app.get('/', (req, res) => {
    res.send('Backend is running successfully 🚀');
});