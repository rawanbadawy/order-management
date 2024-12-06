const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const orderRoutes = require('./routes/orderRoutes');  // Import routes

dotenv.config();

const app = express();

app.use(bodyParser.json());  // Middleware to parse incoming JSON requests
app.use('/api', orderRoutes);  // Mount the routes with '/api' prefix

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(process.env.PORT || 3000, () => {
      console.log(`Server is running on port ${process.env.PORT || 3000}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });
