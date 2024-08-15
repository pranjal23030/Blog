require('dotenv').config()

const express = require('express')                          // express from mode_values
const connectToDatabase = require('./database/')            // Auto import index.js , need route if another name
const app = express()                                       // express methods via app variable
app.use(express.json())                                     // Understanding json format in express

connectToDatabase()

app.get("/",(req,res)=>{                                    // Request - Response cycle, browser==>requests
    // console.log(req)
    // res.send("Hello world")
    res.status(200).json({                                  // Success status code
        message: "Hello world"
    })
})

app.get("/about",(req,res)=>{
    res.json({
        message: "This is the about page"
    })
})

app.post("/blog",(req, res)=>{
    console.log(req.body)                                   // Accepting the data posted
    res.status(200).json({
        message: "Blog api hit successfully"
    })
})

app.listen(process.env.PORT,()=>{
    console.log("NodeJs project has started")
})