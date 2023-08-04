const express = require("express");
const connectDB = require("./config/db");
const users = require("./routes/api/users");
const auth = require("./routes/api/auth");
const profile = require("./routes/api/profile");
const post = require("./routes/api/posts");
const cors = require("cors")
require('dotenv').config();
const app = express();
// let domainName = "";

// if (process.env.STATUS === "production") {
//     domainName = "https://dev-connector-backend.vercel.app"
// }

//Connect Database
connectDB();

// init Middleware
app.use(express.json());

// app.get("/", (req, res) => res.send("API Running"));

// Defining Routes
app.use(cors());
app.use(`/api/users`, users);
app.use(`/api/auth`, auth);
app.use(`/api/profile`, profile);
app.use(`/api/posts`, post);
app.use(`/`, (req, res) => {
    res.send('Welcome to the server')
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server started on PORT ${PORT}`)
});
// Serve static assets in production
// console.log('NODE_ENV: ' + config.util.getEnv('NODE_ENV'));
// if (process.env.STATUS == "production") {

//     app.get("*", (req, res) => {
//         res.sendFile(path.resolve(__dirname, 'api', 'index.js'));
//     })
// }

// else {
//     console.log("I am running and env is Development")
// }


// "vercel-build": "npm install && npm install --prefix client && npm run server && npm run build --prefix client"