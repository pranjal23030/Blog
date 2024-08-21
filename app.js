require('dotenv').config()
const express = require('express')                                                      // express from mode_values
const connectToDatabase = require('./database/')                                        // Auto import index.js , need route if another name
const Blog = require('./model/blogModel')

const app = express()                                                                   // express methods via app variable
app.use(express.json())                                                                 // Understanding json format in express
const { storage, multer } = require('./middleware/multerConfig')
const upload = multer({storage: storage})   // File upload

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

app.post("/blog", upload.single('image') ,async (req, res)=>{
    // console.log(req.body)                                                            // Accepting the data posted, {objects} and sending to database

    const title = req.body.title
    const subtitle = req.body.subtitle
    const description = req.body.description
    const filename = req.file.filename

    if(!title || !subtitle || !description) {
        return res.status(400).json({                                                   // Doesn't execute add data code
            message: "Please provide title, subtitle, description."
        })
    }

    await Blog.create({
        title : title,                                                                  // Column name : data from frontend 
        subtitle : subtitle,
        description : description,
        image: filename
    })

    res.status(200).json({
        message: "Blog api hit successfully"
    })
})

app.get("/blog",async(req,res)=>{            // Kinda like CRUD Read API
    const blogs = await Blog.find()         // returns array
    res.status(200).json({
        message: "Blogs fetched successfully",
        data: blogs
    })
})

app.use(express.static('./storage'))            // Image read permission

app.listen(process.env.PORT,()=>{
    console.log("NodeJs project has started")
})