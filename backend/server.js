require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const connectDB = require("./config/db")
const path = require("path");
const app = express();

//middleware to handle CORS
app.use(
    cors({
        origin: process.env.CLIENT_URL || "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

app.use(express.json());

connectDB();

app.use("/api/v1/auth", authRoutes);

//serve uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads") ));

const PORT = process.env.PORT||5000;
app.listen(PORT, ()=> console.log(`server running on PORT ${PORT}`));