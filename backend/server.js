require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const pollRoutes = require("./routes/pollRoutes");
const connectDB = require("./config/db")
const path = require("path");
const app = express();
const downloadRoutes = require("./routes/download");

//googleauth
const passport = require("./config/passport");
const session = require("express-session");

connectDB();

//middleware to handle CORS
app.use(
    cors({
        origin: process.env.CLIENT_URL || "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true, //important if using sessions / cookies
    })
);

app.use(express.json());


app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());





app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/poll", pollRoutes);
app.use("/api/v1/poll", downloadRoutes);

//serve uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads") ));

const PORT = process.env.PORT||5000;
app.listen(PORT, ()=> console.log(`server running on PORT ${PORT}`));