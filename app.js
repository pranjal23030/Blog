require('dotenv').config()
const express = require('express')                                                      // express from mode_values
const connectToDatabase = require('./database/')                                        // Auto import index.js , need route if another name
const Blog = require('./model/blogModel')

const app = express()                                                                   // express methods via app variable
app.use(express.json())                                                                 // Understanding json format in express

connectToDatabase()

app.get("/",(req,res)=>{                                                                // Request - Response cycle, browser==>requests
    // console.log(req)
    // res.send("Hello world")

    res.status(200).json({                                                              // Success status code
        message: "Hello world"
    })
})

app.get("/about",(req,res)=>{
    res.json({
        message: "This is the about page"
    })
})

app.post("/blog",async (req, res)=>{
    // console.log(req.body)                                                            // Accepting the data posted, {obejcts}
    const title = req.body.title
    const subtitle = req.body.subtitle
    const description = req.body.description
    const image = req.body.image

    if(!title || !subtitle || !description || !image) {
        return res.status(400).json({                                                   // Doesn't execute add data code
            message: "Please provide title, subtitle, description, image"
        })
    }
    await Blog.create({
        title : title,                                                                  // Column name : data from frontend 
        subtitle : subtitle,
        description : description,
        image : image
    })

    res.status(200).json({
        message: "Blog api hit successfully"
    })
})

app.listen(process.env.PORT,()=>{
    console.log("NodeJs project has started")
})