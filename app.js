require('dotenv').config()
const express = require('express')                                                      // express from mode_values
const connectToDatabase = require('./database/')                                        // Auto import index.js , need route if another name
const Blog = require('./model/blogModel')

const app = express()                                                                   // express methods via app variable
app.use(express.json())                                                                 // Understanding json format in express
const { storage, multer } = require('./middleware/multerConfig')
const upload = multer({ storage: storage })   // File upload
const fs = require('fs') // File system
const { isValidObjectId } = require('mongoose')

const cors = require('cors')

app.use(cors({
    origin: ["http://localhost:5173", "https://pranjal-front-blog.vercel.app"]
}))

connectToDatabase()

app.get("/", (req, res) => {                                                                // Request - Response cycle, browser==>requests
    // console.log(req)
    // res.send("Hello world")

    res.status(200).json({                                                              // Success status code
        message: "Hello world"
    })
})

app.get("/about", (req, res) => {
    res.json({
        message: "This is the about page"
    })
})

// CREATE

app.post("/blog", upload.single('image'), async (req, res) => {
    // console.log(req.body)                                                            // Accepting the data posted, {objects} and sending to database

    const { title, subtitle, description } = req.body

    let filename;
    if (req.file) {
        filename = "https://pranjal-blog-project.onrender.com/" + req.file.filename
    } else {
        filename = "https://cdn.mos.cms.futurecdn.net/i26qpaxZhVC28XRTJWafQS-1200-80.jpeg"
    }

    if (!title || !subtitle || !description) {
        return res.status(400).json({                                                   // Doesn't execute add data code
            message: "Please provide title, subtitle, description."
        })
    }

    await Blog.create({
        title: title,                                                                  // Column name : data from frontend 
        subtitle: subtitle,
        description: description,
        image: filename
    })

    res.status(200).json({
        message: "Blog api hit successfully"
    })
})

// ALL READ

app.get("/blog", async (req, res) => {            // Kinda like CRUD Read API
    const blogs = await Blog.find()         // returns array
    res.status(200).json({
        message: "Blogs fetched successfully",
        data: blogs
    })
})

// SINGLE READ

app.get("/blog/:id", async (req, res) => {
    const id = req.params.id

    if (!isValidObjectId(id)) {
        return res.status(400).json({
            message: 'id is not valid.'
        })
    }

    const blog = await Blog.findById(id) // object

    if (!blog) {
        return res.status(404).json({
            message: "no data found"
        })
    }

    res.status(200).json({
        message: "Fetched successfully",
        data: blog
    })

})

// DELETE

app.delete("/blog/:id", async (req, res) => {
    const id = req.params.id
    const blog = await Blog.findById(id)
    const imageName = blog.image

    fs.unlink(`storage/${imageName}`, (err) => {
        if (err) {
            console.log(err)
        } else {
            console.log("File deleted successfully")
        }
    })
    await Blog.findByIdAndDelete(id)
    res.status(200).json({
        message: 'Blog deleted successfully'
    })
})

// UPDATE

app.patch('/blog/:id', upload.single('image'), async (req, res) => {
    const id = req.params.id
    const { title, subtitle, description } = req.body
    let imageName;
    if (req.file) {
        imageName = "https://pranjal-blog-project.onrender.com/" + req.file.filename
        const blog = await Blog.findById(id)
        const oldImageName = blog.image

        fs.unlink(`storage/${oldImageName}`, (err) => {
            if (err) {
                console.log(err)
            } else {
                console.log("File deleted successfully")
            }
        })
    }
    await Blog.findByIdAndUpdate(id, {
        title: title,
        subtitle: subtitle,
        description: description,
        image: imageName
    })
    res.status(200).json({
        message: "Blog updated successfully"
    })
})


app.use(express.static('./storage'))            // Image read permission

app.listen(process.env.PORT, () => {
    console.log("NodeJs project has started")
})