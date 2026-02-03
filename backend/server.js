const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');


dotenv.config();

const app = express();


app.use(cors());
app.use(express.json());


const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);

    }
};


app.get('/', (req, res) => {
    res.send('SecureParcel Backend is Running...');
});


const PORT = process.env.PORT || 5000;


if (process.env.MONGO_URI) {
    connectDB().then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    });
} else {

    console.warn('MONGO_URI not found in .env, starting server without DB connection.');
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}
