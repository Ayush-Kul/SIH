const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// MongoDB setup (as before)
mongoose.connect('mongodb://127.0.0.1/arduino_data', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define a schema and model for your data (as before)

let waitingTimer; // Declare a timer variable

// Define a route to receive data from Arduino Cloud
app.post('/data', (req, res) => {
  const { temperature, humidity, helmet_status } = req.body;

  // Create a new data document and save it to MongoDB
  const newData = new Data({
    temperature,
    humidity,
    helmet_status,
  });

  newData
    .save()
    .then(() => {
      console.log('Data saved successfully');
      res.status(200).send('Data received and saved.');
    })
    .catch((err) => {
      console.error('Error saving data:', err);
      res.status(500).send('Error saving data.');
    });

  // If data arrives, clear the waiting timer
  clearTimeout(waitingTimer);
});

// Define a function to print "waiting" every 5 minutes
function printWaiting() {
  console.log('Waiting for data...');
}

// Set an interval to call printWaiting every 5 minutes (300,000 milliseconds)
const interval = 3000; // 5 minutes in milliseconds
setInterval(printWaiting, interval);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Print "Waiting for data..." immediately upon server startup
printWaiting();