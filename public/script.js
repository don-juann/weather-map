const map = L.map('map').setView([0, 0], 2);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap',
}).addTo(map);


async function getWeather() {
    const lat = document.getElementById('lat').value;
    const lon = document.getElementById('lon').value;

    if(lat < -90 || lat > 90 || lon < -180 || lon > 180){
        alert(
            "Please enter valid coordinates:\nLatitude (-90 to 90)\nLongtitude (-180 to 180)"
          );
        return;
        
    }else{
        document.getElementById('weatherInfo').innerHTML = '';

        const weatherResponse = await fetch(`http://localhost:3000/weather?lat=${lat}&lon=${lon}`);
        const weatherData = await weatherResponse.json();

        const locationResponse = await fetch(`http://localhost:3000/location?lat=${lat}&lon=${lon}`);
        const locationData = await locationResponse.json();

        const timestamp = weatherData.dt;
        const timezoneResponse = await fetch(
            `/timezone?lat=${lat}&lon=${lon}&timestamp=${timestamp}`
        );
        const timezoneData = await timezoneResponse.json();
        const timezone = timezoneData.zoneName;

        const weatherInfoDiv = document.getElementById('weatherInfo');
        weatherInfoDiv.innerHTML = `
            <p>Temperature: ${weatherData.temperature} °C</p>
            <p>Description: ${weatherData.description}</p>
            <img src="http://openweathermap.org/img/wn/${weatherData.icon}.png" alt="weather icon">
            <p>Feels Like: ${weatherData.feelsLike} °C</p>
            <p>Humidity: ${weatherData.humidity}%</p>
            <p>Pressure: ${weatherData.pressure} hPa</p>
            <p>Wind Speed: ${weatherData.windSpeed} m/s</p>
            <p>Country Code: ${weatherData.countryCode}</p>
            <p>Rain Volume (last 3 hours): ${weatherData.rainVolume} mm</p>
            <p>Timezone: ${timezone}</p>
            <p>Location: ${getLocationString(locationData)}</p>
            `;

        map.setView([lat, lon], 10);
    }}

    function getLocationString(locationData) {
        const parts = [];
    
        if (locationData.country) {
            parts.push(`${locationData.country}`);
        }
    
        if (locationData.city) {
            parts.push(`${locationData.city}`);
        }
    
        if (locationData.street) {
            parts.push(`${locationData.street}`);
        }
    
        return parts.length > 0 ? parts.join(', ') : 'N/A';
    }

document.getElementById('maillink').addEventListener('click', () => {
    alert('221122@astanait.edu.kz');
    return;
} )
