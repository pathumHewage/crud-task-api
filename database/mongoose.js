const mongoose = require('mongoose');


mongoose.Promise = global.Promise;

mongoose.connect('mongodb+srv://task:task123@cluster0.co9ro.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        console.log("DB Connected Sucessfully!")
    })
    .catch((error) => {
        console.log("Error occurred while DB connection", error)
    });

module.exports = mongoose;