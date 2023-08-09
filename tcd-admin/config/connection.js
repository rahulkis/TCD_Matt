const mongoose = require('mongoose');
const fs = require('fs');

const caContent = [fs.readFileSync( __dirname + "/rds-combined-ca-bundle.pem")];
const connectDB = async()=>{
    const con = await mongoose.connect(process.env.MONGO_URI,{
        useNewUrlParser:true,
        useCreateIndex:true,
        useFindAndModify:false,
        useUnifiedTopology:true,
        sslCA: caContent
    })
    console.log(`MongoDB connected : ${con.connection.host}`)
}

module.exports = connectDB