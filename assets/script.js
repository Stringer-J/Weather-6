const openKey = 'ef189f35c7f8730c184c236713074777';

const lat = '30.2672';  // Latitude of Austin, TX
const lon = '-97.7431'; // Longitude of Austin, TX

const openWeather = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly,alerts&appid=${openKey}`;

fetch(openWeather, {
    headers: {
        Authorization: `${openKey}`
    }
})
    .then(response => {
        return response.json()
    })
    .then(data => {
        console.log(data);
    });

