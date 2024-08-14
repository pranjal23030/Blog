const mongoose = require('mongoose') // CJS {Common JS}

async function connectToDatabase() {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log("Database connected successfully.")
}

module.exports = connectToDatabase            // Exporting the function => Import - export default ES {EcmaScript} || require - module.exports