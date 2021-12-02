const express = require('express');
const app = express();
const mongoose = require('./database/mongoose');

const TaskList = require('./database/models/taskList');
const Task = require('./database/models/task');
const { findByIdAndUpdate, findOneAndUpdate } = require('./database/models/taskList');

/*
CORS - Cross Origin Request Security
Backend - http://localhost:3000
Frontend - http://localhost:4200
*/
// 3rd party library, app.use(cors());
// Add headers
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    //res.setHeader('Access-Control-Allow-Headers', 'Origin', 'X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    // Pass to next layer of middleware
    next();
});

//Example of middleware
app.use(express.json());// Or 3rd party bodyParser

//Routes or REST API Endpoints or RESTFul webservices Endpoints
/*
TaskList - Create, Update, ReadTaskListById, ReadAllTaskList
Task - Create, Update, ReadTaskById, ReadAllTask
*/

// Routes or API endpoints for TaskList model
// Get All Task Lists
// http://localhost:3000/tasklists  => [ {TaskList}, {TaskList} ]
// https://www.restapitutorial.com/lessons/httpmethods.html

/*app.get('/tasklists', function(req, res){
    TaskList.find({})
        .then(function(lists) {res.send(lists)})
        .catch(function(error) {console.log(error)});
});*/

app.get('/tasklists', (req, res) => {
    TaskList.find({})
        .then((lists) => {
            res.status(200).send(lists);
        })
        .catch((error) => {
            console.log(error);
            res.status(500);
        });
});

//Endpoint to get one tasklist by taklistId : http://localhost:3000/tasklists/60de196f11039f060886ddb5
app.get('/tasklists/:tasklistId', (req, res) => {
        let tasklistId = req.params.tasklistId;
        TaskList.find({ _id: tasklistId })
            .then((taskList) => {
                res.status(200).send(taskList)
            })
            .catch((error) => { console.log(error) });
    }
);




app.post('/tasklists', (req, res) => {
    console.log(req.body);
    
    let tasklistobj = { 'title': req.body.title};
    TaskList(tasklistobj).save()

    .then((taskList) => {
        res.status(201).send(taskList);
    })
    .catch((error) => {
        console.log(error);
        res.status(500);
    });
});

//PUT is full update of object
app.put('/tasklists/:tasklistId', (req, res) => {
    TaskList.findOneAndUpdate({ _id: req.params.tasklistId }, { $set: req.body })
        .then((taskList) => {
            res.status(200).send(taskList)
        })
        .catch((error) => { console.log(error) });
});


// Patch is partial update of one field of an object
app.patch('/tasklists/:tasklistId', (req, res) => {
    TaskList.findOneAndUpdate({ _id: req.params.tasklistId }, { $set: req.body })
        .then((taskList) => {
            res.status(200).send(taskList)
        })
        .catch((error) => { console.log(error) });
});



//Delete a tasklist by id
app.delete('/tasklists/:tasklistId', (req, res) => {

    //Delete all tasks withing a taklist if that tasklist is deleted
    const deleteAllContainingTask = (taskList) => {
        Task.deleteMany({ _taskListId: req.params.tasklistId })
            .then(() => { return taskList })
            .catch((error) => { console.log(error) });
    };

    const responseTaskList = TaskList.findByIdAndDelete(req.params.tasklistId)
        .then((taskList) => {
            deleteAllContainingTask(taskList);
        })
        .catch((error) => { console.log(error) });
    res.status(200).send(responseTaskList);
});



app.listen(3000, function (){
    console.log("server started on port 3000");
});