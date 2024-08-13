const mongoose = require('mongoose') // CJS {Common JS}

async function connectToDatabase() {
    await mongoose.connect('mongodb+srv://pranjalKhatiwada:pranjalmern@cluster0.dgwm7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    console.log("Database connected successfully.")
}

module.exports = connectToDatabase            // Exporting the function => Import - export default ES {EcmaScript} || require - module.exports