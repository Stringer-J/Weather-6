const searchText = document.getElementById('searchCity'); //finds input box for searching for cities
const searchButton = document.getElementById('searchButton'); //finds search button
const infoBox = document.querySelector('.info'); //finds info div for printing weather information
const infoBox2 = document.querySelector('.info2'); //finds 2nd info box for 5 day forecast
const historyBox = document.querySelector('.history'); //finds history div for putting new history buttons

const openKey = '06a798cc207b1bc18fa799b37f5e6c32'; //api key so api actually works

function weatherData(lat, lon) {

    const openWeather = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly,alerts&appid=${openKey}`;
    //uses allOrigins as a proxy for openWeather api to bypass CORS error
    const allOrigins = `https://api.allorigins.win/get?url=${encodeURIComponent(openWeather)}`;

    fetch(allOrigins)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok'); //shows error if there is no api response
            }
            return response.json(); //returns whatever you wanted from the api
        })
        .then(data => {
            const responseData = JSON.parse(data.contents); //allOrigins wraps the response in "contents"
            console.log(responseData); //logs response so I know what I'm working with

            //creates variables for all the different things I want to display from the response object
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
            date.style.marginRight = '10px';
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

            const fiveDay = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly,alerts&appid=${openKey}`;

            fetch(fiveDay)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    const forecastData = data.list;

                    const groupedByDay = {};

                    //calculates tomorrow's date in UTC format
                    const tomorrow = new Date();
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    tomorrow.setHours(0, 0, 0, 0);
                    const tomorrowUTC = tomorrow.getTime() / 1000;

                    forecastData.forEach(forecast => {
                        const timestamp = forecast.dt;
                        if (timestamp >= tomorrowUTC) {
                        const date3 = new Date(timestamp * 1000).toLocaleDateString('en-US', {
                            month: 'numeric',
                            day: 'numeric',
                            year: '2-digit'
                        });
                        if (!groupedByDay[date3]) {
                            groupedByDay[date3] = forecast;
                        }
                        }
                    })

                    infoBox2.innerHTML = '';

                    Object.keys(groupedByDay).forEach(date3 => {
                        const forecast = groupedByDay[date3]; // Get the first forecast for this day

                        const forecastDayDiv = document.createElement('div');
                        forecastDayDiv.style.padding = '5px';
                        forecastDayDiv.style.marginRight = '40px';
                        forecastDayDiv.style.marginTop = '20px';
                        forecastDayDiv.style.marginBottom = '25%';
                        forecastDayDiv.style.color = 'white';
                        forecastDayDiv.style.backgroundColor = 'black';
    
                        const date2 = document.createElement('h2');
                        date2.textContent = `${date3}`;
                        forecastDayDiv.appendChild(date2);

                        const forecastImg = forecast.weather[0].icon;
                        const forecastTemp = ((forecast.main.temp - 273.15) * 1.8 + 32).toFixed(2);
                        const forecastWind = forecast.wind.speed;
                        const forecastHumidity = forecast.main.humidity;

                        const forecastDiv = document.createElement('div');

                        const icon2 = `https://openweathermap.org/img/w/${forecastImg}.png`;
                        const iconImg2 = document.createElement('img');
                        iconImg2.src = icon2;
                        iconImg2.alt = 'weather icon';
                        forecastDiv.appendChild(iconImg2);

                        const temp2 = document.createElement('p');
                        temp2.textContent = `Temp: ${forecastTemp}°F`;
                        forecastDiv.appendChild(temp2);

                        const wind2 = document.createElement('p');
                        wind2.textContent = `Wind: ${forecastWind} MPH`;
                        forecastDiv.appendChild(wind2);

                        const humidity2 = document.createElement('p');
                        humidity2.textContent = `Humidity: ${forecastHumidity} %`;
                        forecastDiv.appendChild(humidity2);

                        forecastDayDiv.appendChild(forecastDiv);

                        infoBox2.appendChild(forecastDayDiv);
                    })      
                })
                })

            if (!previousButton(cityName)) {
            const historyButton = document.createElement('button'); //creates a button to access previous searches
            historyButton.textContent = `${cityName}`;
            historyBox.appendChild(historyButton);

            historyButton.addEventListener('click', function() { //when you click the button, it loads and prints city weather info
                infoBox.innerHTML = '';
                const city2 = cityName; //
                const geocoding = `https://api.openweathermap.org/data/2.5/weather?q=${city2}&appid=${openKey}`; //geocoding api used to find lat and lon with a city name
            
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
            })
        }}

function previousButton(cityName) { //checks if you've already searched for this city and created a button in the history box
    const buttons = historyBox.getElementsByTagName('button');
    for (let i = 0; i < buttons.length; i++) {
        if (buttons[i].textContent === cityName) {
            return true;
        }
    }
    return false;
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

