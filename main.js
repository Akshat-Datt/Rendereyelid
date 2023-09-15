require("dotenv").config();
const express = require('express');
const app = express();
const connectDB = require('./database/DB');
const routes = require("./routes/Create");
var cors = require('cors');
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/",(req, res)=>{
    res.send("Backend is here");
})
  
app.use("/api/user", routes);

const start = async()=>{
    try{
        await connectDB(process.env.MONGODB_URL);
        app.listen(PORT, ()=>{
            console.log(`${PORT}, CONNECTED`);
        });
    }
    catch(e){
        console.log(e);
    }
}

start();