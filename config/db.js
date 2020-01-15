const mongoose = require('mongoose');
const config = require('config');
const connectionString = config.get('mongoURI');

const connectDB = () =>{
    mongoose.connect(connectionString,{
        useNewUrlParser:true,
        useCreateIndex:true,
        useFindAndModify:false,
        useUnifiedTopology:true
    },() =>{
        try {
            console.log('DB is connected');
            return true
        } catch (error) {
            console.log("DB is not connected");
            process.exit(1);
            return false
        }
    })
}

module.exports = connectDB;