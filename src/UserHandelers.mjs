import express from "express";
import mongoose from "mongoose";

import User from "./UserSchema.mjs";

const router=express.Router();

router.all("/",(req,res)=>{
    res.send("Hai!");
});

router.post("/register",async (req,res)=>{

    const user=new User(req.body);
    try{
        await user.save();
        res.status(201).json({res:"User Registrations Successfull"});
        res.end();
    }
    catch(error){
        let result={}
        if (error instanceof mongoose.Error.ValidationError) {
            Object.keys(error.errors).forEach(field => {result[field]=error.errors[field].message;});
            res.status(400).json(result);
        }
        else{
            res.status(500).json({response:"Unexpected error occured"});
        }
    }
});

router.get("/:name",async (req,res,next)=>{
    const name=req.params.name;
    if(!name){
        res.status(400).json({response:"username requried"});
        next();
        return;
    }
    const user=await User.findOne({username:name});
    if(user)
        res.status(200).send(user);
    else
        res.status(404).json({response:`no user fonund with give username ${name}`});
    res.end();
});

router.delete("/delete/:name",async (req,res,next)=>{
    const name=req.params.name;
    if(!name){
        res.status(400).json({response:"username requried"});
        next();
        return;
    }
    
    try{
        const user=await User.findOneAndDelete({username:name});
        if(user)
            res.status(200).json({response:"user deleted"});
        else
            res.status(404).json({response:`no user fonund with give username ${name}`});
    }
    catch(err){
        res.status(500).json({response:"unknown error occured"});
    }
    res.end();
});

router.put("/update/:name",async (req,res)=>{const name=req.params.name;
    if(!name){
        res.status(400).json({response:"username requried"});
        next();
        return;
    }
    try{
        const user=await User.findOneAndUpdate({username:name},req.body,{returnOriginal:false});
        if(user)
            res.status(200).json({response:`user updated`,user});
        else
            res.status(404).json({response:`no user fonund with give username ${name}`});
    }
    catch(err){
        res.status(500).json({response:"unknown error occured"});
    }
    res.end();
});

router.get("/get/userCount",async (req,res)=>{
    const {start=new Date("2024-06-19T12:00:00.000+00:00"),end=new Date()}=req.query;
    console.log(start,end);
    const response=await User.aggregate()
                        .match({createdDate:{$gte:start,$lte:end}})
                        .group({_id:"$createdDate",count:{$sum:1}})
                        .project({_id:1,count:1})
                        .sort({count:1})
                        .exec();
    res.status(200).json(response);
});


export default router;