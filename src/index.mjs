import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./UserHandelers.mjs"

const {response,request}=express;

dotenv.config()

const app=express();

//middleware configuration
app.use(express.json());
app.use("/user",userRouter);


//mongoDb Connection
mongoose
.connect(process.env.MONGO_URL)
.then(()=>{console.log("Connected to Database");})
.catch((err)=>{console.log(err.message)});

//server starting
app.listen(process.env.PORT,()=>{
    console.log(`Server Listining on ${process.env.PORT} port`);
});

