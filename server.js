const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const userRoute = require("./routes/userRoute");
const adminUserRoute = require("./routes/adminUserRoute");
const app = express();
require("dotenv").config();
app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(passport.initialize());

app.get("/", (req, res) => {
    console.log("done");
    res.status(200).json({
        okay: "good"
    });
});

app.use("/api/users", userRoute);
app.use("/api/admin/user", adminUserRoute);
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is on fire${PORT}`);
    mongoose
        .connect("mongodb://localhost:27017/mern-project", {
            useNewUrlParser: true
        })
        .then(() => {
            console.log("mongobd connected successfully");
        });
});