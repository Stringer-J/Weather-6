const openKey = '06a798cc207b1bc18fa799b37f5e6c32';

const lat = '30.2672';  // Latitude of Austin, TX
const lon = '-97.7431'; // Longitude of Austin, TX

// Construct the API URL with AllOrigins as the proxy
const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly,alerts&appid=${openKey}`;
const allOriginsUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(apiUrl)}`;

fetch(allOriginsUrl)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        const responseData = JSON.parse(data.contents); // AllOrigins wraps the response in "contents"
        console.log(responseData);
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });



