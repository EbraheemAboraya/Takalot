require('dotenv').config();
const express = require('express');
const userRout = require('./router/usersRouter/users');
const rqeRout = require('./router/requestsRouter/request');
const TechRout = require('./router/technicalRouter/technical');
const offerRout = require('./router/offerRouter/offer');
const homeRout = require('./router/homePageRouter/home');
const feedbackRout = require('./router/feedbackRouter/feedback');
const singupRout = require('./router/signup/signup');
const uploadImageRouter = require('./router/flaskApiRouter/uploadImageRouter');
const socketIo = require('socket.io');



const { connectDB } = require('./db/dbconnect');


const path = require('path');
const http = require('http');


// Import setupSocket from your socketManager.js (ensure the path is correct)
const setupSocket = require('./sockets/socketManager');
 
// Constants
const app = express();
const server = http.createServer(app); // Create an HTTP server for Socket.IO
const port = process.env.PORT || 8000;
const io = require('./module/io_Initialization').init(server); // Use the path to your io module

 
// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

module.exports = app;


app.set('view engine', 'ejs');


// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// Routes
app.use(userRout);
app.use(rqeRout);
app.use(TechRout);
app.use(offerRout);
app.use(feedbackRout);
app.use(homeRout);
app.use(singupRout);
// Use the new upload image router under the '/api' path
app.use('/api', uploadImageRouter);


// connect to db
connectDB();

// Setup and use Socket.IO with the server
setupSocket(server);

app.listen(port, () => {
  console.log(`http://localhost:${port}/login`);
});