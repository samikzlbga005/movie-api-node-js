const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
module.exports = () => {
    mongoose.connect('mongodb://localhost/movie-api');
    mongoose.connection.on('open', ()=>{
    console.log("mongoDB connected");
    });

    mongoose.connection.on('error', (err)=>{
    console.log("mongoDB not connected", err);
    });

    mongoose.Promise = global.Promise;
};