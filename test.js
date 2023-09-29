const express = require('express');
const mongoose = require('mongoose');
const Chart = require('chart.js');
const app = express();
const port = process.env.PORT || 3000;

// MongoDB setup
mongoose.connect('mongodb://127.0.0.1/arduino_data', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define a schema and model for your data
const dataSchema = new mongoose.Schema({
  temperature: Number,
  humidity: Number,
  helmet_status: String,
});

const Data = mongoose.model('Data', dataSchema);

// Insert provided data into the MongoDB collection
const initialData = [
  {
    temperature: 40.5,
    humidity: 40,
    helmet_status: 'Helmet OFF',
  },
  {
    temperature: 35.09999847,
    humidity: 49,
    helmet_status: 'Helmet ON',
  },
  {
    temperature: 40.5,
    humidity: 40,
    helmet_status: 'Helmet OFF',
  },
  {
    temperature: 35.09999847,
    humidity: 49,
    helmet_status: 'Helmet ON',
  },
  {
    temperature: 35.09999847,
    humidity: 49,
    helmet_status: "Helmet ON"
  }
  ,
  {
    temperature: 35.09999847,
    humidity: 49,
    helmet_status: "Helmet OFF"
  }
  ,
  {
    temperature: 35.09999847,
    humidity: 49,
    helmet_status: "Helmet ON"
  }
  ,
  {
    temperature: 35.09999847,
    humidity: 49,
    helmet_status: "Helmet OFF"
  }
  ,
  {
    temperature: 35.09999847,
    humidity: 49,
    helmet_status: "Helmet ON"
  }
  ,
  {
    temperature: 35.09999847,
    humidity: 49,
    helmet_status: "Helmet OFF"
  }
  ,
  {
    temperature: 29.5,
    humidity: 59,
    helmet_status: "Helmet ON"
  },
  
  {
    temperature: 29.5,
    humidity: 59,
    helmet_status: "Helmet OFF"
  }
  ,
  {
    temperature: 28.20000076,
    humidity: 65,
    helmet_status: "Helmet ON"
  }
  ,
  {
    temperature: 28.20000076,
    humidity: 65,
    helmet_status: "Helmet OFF"
  }
  ,
  {
    temperature: 26.70000076,
    humidity: 72,
    helmet_status: "Helmet ON"
  }
  ,
  {
    temperature: 26.70000076,
    humidity: 72,
    helmet_status: "Helmet OFF"
  }
  ,
  {
    temperature: 26.70000076,
    humidity: 72,
    helmet_status: "Helmet ON"
  }
  ,
  {
    temperature: 26.70000076,
    humidity: 72,
    helmet_status: "Helmet OFF"
  }
  ,
  {
    temperature: 27.39999962,
    humidity: 68,
    helmet_status: "Helmet ON"
  }
];

Data.insertMany(initialData)
  .then(() => {
    console.log('Initial data inserted successfully');
  })
  .catch((err) => {
    console.error('Error inserting data:', err);
  });

// Set up a basic route to display the graph

app.get('/', async (req, res) => {
    try {
      const data = await Data.find({}, 'temperature humidity helmet_status');
  
      const labels = data.map((entry, index) => `Entry ${index + 1}`);
      const temperatures = data.map((entry) => entry.temperature);
      const humidities = data.map((entry) => entry.humidity);
      const helmetStatus = data.map((entry) => (entry.helmet_status === 'Helmet ON' ? 1 : 0));
  
      const totalEntries = data.length;
      const totalHelmetsOn = helmetStatus.reduce((acc, val) => acc + val, 0);
      const safetyPercentage = (totalHelmetsOn / totalEntries) * 100;
  
      const chartData = {
        labels,
        datasets: [
          {
            label: 'Temperature (°C)',
            data: temperatures,
            yAxisID: 'temperature',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
          },
          {
            label: 'Humidity (%)',
            data: humidities,
            yAxisID: 'humidity',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
          {
            label: 'Safety Percentage',
            data: helmetStatus,
            yAxisID: 'safety',
            type: 'line',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 2,
          },
        ],
      };
  
      const chartOptions = {
        scales: {
          temperature: {
            type: 'linear',
            position: 'left',
          },
          humidity: {
            type: 'linear',
            position: 'left',
            max: 100,
            min: 0,
          },
          safety: {
            type: 'linear',
            position: 'right',
            max: 1,
            min: 0,
          },
        },
      };
  
      res.send(`
        <html>
        <head>
          <title>Temperature, Humidity, and Safety Percentage</title>
          <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
        </head>
        <body>
          <div style="width: 80%; margin: 0 auto;">
            <canvas id="dataChart"></canvas>
          </div>
          <p>Safety Percentage: ${safetyPercentage.toFixed(2)}%</p>
          <script>
            const ctx = document.getElementById('dataChart').getContext('2d');
            new Chart(ctx, {
              type: 'bar',
              data: ${JSON.stringify(chartData)},
              options: ${JSON.stringify(chartOptions)},
            });
          </script>
        </body>
        </html>
      `);
    } catch (err) {
      console.error('Error fetching data:', err);
      res.status(500).send('Error fetching data');
    }
  });
// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
