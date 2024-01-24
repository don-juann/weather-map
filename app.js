const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000;

const apiKey = 'a937a79d96fe241fbbd0da8ffdf90ad0';
const timezoneApiKey = 'KMGUS2M1KJG1'
const opencageApiKey = '708b83ca51614c2eb9e8a00befe6e965'
const weather = 'https://api.openweathermap.org/data/2.5/weather';

app.use(express.static('public'));

app.get('/weather', async (req, res) => {
  try {
    const { lat, lon } = req.query;

    const weatherResponse = await axios.get(weather, {
      params: {
        lat,
        lon,
        appid: apiKey,
        units: 'metric',
      },
    });

    const weatherData = weatherResponse.data;

    res.json({
      temperature: weatherData.main.temp,
      description: weatherData.weather[0].description,
      icon: weatherData.weather[0].icon,
      coordinates: { lat, lon },
      feelsLike: weatherData.main.feels_like,
      humidity: weatherData.main.humidity,
      pressure: weatherData.main.pressure,
      windSpeed: weatherData.wind.speed,
      countryCode: weatherData.sys.country,
      rainVolume: weatherData.rain ? weatherData.rain['3h'] : 0,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/timezone', async (req,res) => {
    try {
      const {lat, lon, timestamp } = req.query;

      const timezoneResponse = await axios.get(
        `http://api.timezonedb.com/v2.1/get-time-zone?key=${timezoneApiKey}&format=json&by=position&lat=${lat}&lng=${lon}&time=${timestamp}`
      );

      const timezoneData = timezoneResponse.data;
      res.json(timezoneData);
    } catch(error){
      console.error(error);
      res.status(500).json({ error: 'Internal server error'});
    }
})

app.get('/location', async (req, res) => {
  try {
    const { lat, lon } = req.query;

    const opencageResponse = await axios.get('https://api.opencagedata.com/geocode/v1/json', {
      params: {
        q: `${lat}+${lon}`,
        key: opencageApiKey,
        language: 'en',
      },
    });

    const locationData = opencageResponse.data;

    if (locationData.results.length > 0) {
      const result = locationData.results[0].components;
      const locationDetails = {
        country: result.country,
        city: result.city,
        street: result.road || result.street,
      };

      res.json(locationDetails);
    } else {
      res.status(404).json({ error: 'Location not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.listen(port, () => {
  console.log(`Server: http://localhost:${port}`);
});