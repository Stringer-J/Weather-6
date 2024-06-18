const searchText = document.getElementById('searchCity'); //finds input box for searching for cities
const searchButton = document.getElementById('searchButton'); //finds search button
const infoBox = document.querySelector('.info'); //finds info div for printing weather information

const openKey = '06a798cc207b1bc18fa799b37f5e6c32'; //api key so api actually works

function weatherData(lat, lon) {

    const openWeather = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly,alerts&appid=${openKey}`;
    //uses allOrigins as a proxy for openWeather api to bypass CORS error
    const allOrigins = `https://api.allorigins.win/get?url=${encodeURIComponent(openWeather)}`;

    fetch(allOrigins)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const responseData = JSON.parse(data.contents); //allOrigins wraps the response in "contents"
            console.log(responseData);

            const cityName = responseData.name;
            const cityDate = responseData.dt;
            const cityIcon = responseData.weather[0].icon;
            const cityTemp = responseData.main.temp;
            const cityWind = responseData.wind.speed;
            const cityHumidity = responseData.main.humidity;

            const newDiv = document.createElement('div'); //creates first div for city and date with flex
            newDiv.style.display = 'flex';

            const name = document.createElement('h1'); //prints city name
            name.textContent = `${cityName}`;
            name.style.marginRight = '10px';

            const milliseconds = cityDate * 1000; //convert Unix timestamp to milliseconds
            const dateObject = new Date(milliseconds);
            const formattedDate = dateObject.toLocaleDateString(); //format the date

            const date = document.createElement('h1'); //prints date
            date.textContent = `(${formattedDate})`;
            newDiv.append(name, date);

            const icon = `https://openweathermap.org/img/w/${cityIcon}.png`;
            const iconImg = document.createElement('img');
            iconImg.src = icon;
            iconImg.alt = 'weather icon';
            newDiv.appendChild(iconImg);

            const newDiv2 = document.createElement('div'); //creates another div for temp, wind, humidity

            const tempConversion = ((cityTemp - 273.15) * 1.8 + 32).toFixed(2); //converts kelvin to fahrenheit
            const temp = document.createElement('p'); //prints converted temp
            temp.textContent = `Temp: ${tempConversion}°F`;
            newDiv2.appendChild(temp);

            const wind = document.createElement('p'); //prints wind speed
            wind.textContent = `Wind: ${cityWind} MPH`;
            newDiv2.appendChild(wind);

            const humidity = document.createElement('p'); //prints humidity
            humidity.textContent = `Humidity: ${cityHumidity} %`;
            newDiv2.appendChild(humidity);

            infoBox.innerHTML = ''; //clears old result before printing new result
            infoBox.appendChild(newDiv); //prints newDiv (row)
            infoBox.appendChild(newDiv2); //prints newDiv2 (column) underneath
        })
        .catch(error => { //logs error if one occurs
            console.error(error);
        });
}

searchButton.addEventListener('click', function() { //button activates on click
    const city = searchText.value.trim(); //pulls the value typed into the search bar
    const geocoding = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${openKey}`; //geocoding api used to find lat and lon with a city name

    fetch(geocoding)
        .then(response => {
            if(!response.ok) {
                throw new Error('City not found');
            }
                return response.json();
        })
        .then(data => {
            const lat = data.coord.lat;
            const lon = data.coord.lon;

            weatherData(lat, lon); //call the weatherData function from earlier that uses the lat and lon to find the city and info for the openWeather api
        })
        .catch(error => { //logs error if one occurs
            console.error(error);
        });
});

