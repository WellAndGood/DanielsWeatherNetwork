// DOM Traversal variables

const searchInput = document.getElementById("searchInput")
const submitButton = document.getElementById("submitButton")
var cityName = document.getElementById("city-name")
var countryName = document.getElementById("country-name")
var weatherDate = document.getElementById("weather-date")
var temperature = document.getElementById("temperature-info")
var humidityInfo = document.getElementById("humidity-info")
var windSpeed = document.getElementById("wind-speed")
var UVIndex = document.getElementById("UV-index")
var weatherBlurb = document.getElementById("weather-blurb")
var weatherLogo = document.getElementById("weather-logo")
var futureWeatherInfo = document.getElementById("future-weather-info")
var searchHistoryEl = document.getElementsByClassName("searchHistory")
var searchHistoryDiv = document.getElementById("search-history-div")
var errorMessage = document.getElementById("error-message")

let searchHistory = localStorage.getItem("history").split(',') || []

// Testing the Text Content of the DOM Traversal variables

cityName.textContent = ""
countryName.textContent = ""
weatherBlurb.textContent = ""
weatherLogo.textContent = ""
temperature.textContent = ""
humidityInfo.textContent = ""
windSpeed.textContent = ""
UVIndex.textContent = ""
futureWeatherInfo.textContent = ""

// Loads Local Storage; aka search History

cityHistoryList = []

function renderSearchHistory() {
    
    var history = localStorage.getItem("history").split(',');
    localStorage.setItem("history", history)
    if (history !== null) {
        city = cityHistoryList[i]
    }

    searchHistoryEl.innerHTML = "";

    console.log(history)

    for (i = 0; i < history.length ; i++) {
        var listItem = history[i];
        var newDiv = document.createElement("div")
        newDiv.classList = "searchHistory";
        newDiv.textContent = listItem
        newDiv.setAttribute("data-city", i)
        searchHistoryDiv.appendChild(newDiv)

        console.log(history[i])
    }
}

renderSearchHistory()

// Meant to be Event Listener to recognize the search history buttons

for (var i = 0; i < searchHistoryEl.length; i++) {
    searchHistoryEl[i].addEventListener('click', function(event) {
        var targetClick = event.target.innerHTML
        getCityWeather(targetClick)
        get5Day(targetClick)

    }, false);
}

// Moment Connection
var today = moment();
weatherDate.textContent = today.format("MMMM Do, YYYY");

// Submit Button Click Event
submitButton.addEventListener("click", function(){

    // First URL --> Current Weather Data
    var citySearchString = searchInput.value.trim().replace(", ", "").replace("  ", "")

    // Current Weather and 5-Day Information  API
    getCityWeather(citySearchString)
    get5Day(citySearchString)
    
});

function getCityWeather(citySearchString) {
    const openWeatURLStart = "http://api.openweathermap.org/data/2.5/weather?q="
    var APIKey = "&appid=d1b743fbcfca85dad360210556b54d8c"
    var requestUrl = openWeatURLStart + citySearchString + APIKey

    const kelvinConversion = -273.15

    // Browser Fetch Method
    fetch(requestUrl)
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {

            // Find longitude and latitude
            latitudeData = data.coord.lat
            longitudeData = data.coord.lon

            // Find City Name and Update Text Content
            cityNameData = data.name
            cityName.textContent = cityNameData

            // Find Country Name and Update Text Content
            countryNameData = data.sys.country
            countryName.textContent = countryNameData

            // Find Wind Speed
            var windSpeedMetSec = parseFloat(data.wind.speed).toFixed(1)
            windSpeedKmHour = (windSpeedMetSec * 3.6).toFixed(1)
            windSpeed.textContent = windSpeedKmHour + " km/hour"

            // Find Celcius
            var weatherTempKelvin = parseFloat(data.main.temp) + kelvinConversion
            weatherTemp = weatherTempKelvin.toFixed(1)
            temperature.textContent = weatherTemp + "°C"

            // Find Humidity
            weatherHumidity = data.main.humidity
            humidityInfo.textContent = weatherHumidity + "%"

            // Find Weather Conditions Ex: Clouds, Clear
            weatherConditionBlurb = data.weather[0].main
            weatherConditionIconCode = data.weather[0].icon
            weatherBlurb.textContent = weatherConditionBlurb
            weatherLogo.setAttribute("src", "./assets/icons/" + weatherConditionIconCode + ".png")

            // Insert New Element in Search History; will not execute if data not fetched
            var listItem = citySearchString;
            var newDiv = document.createElement("div")
            newDiv.classList = "searchHistory";
            newDiv.textContent = listItem
            newDiv.setAttribute("data-city", i)
            searchHistoryDiv.appendChild(newDiv)

            errorMessage.textContent = ""

            // One-Stop Weather Information API - to gather UV Index
            const openWeatURLOneCall = "https://api.openweathermap.org/data/2.5/onecall?"
            var APIKey = "&appid=d1b743fbcfca85dad360210556b54d8c"
            var latAPICall = "lat=" + latitudeData
            var longAPICall = "&lon=" + longitudeData
            var requestUrlOneCall = openWeatURLOneCall + latAPICall + longAPICall + APIKey

            fetch(requestUrlOneCall)
                .then(function (responseOneCall) {
                    return responseOneCall.json()
                })
                .then(function (dataOneCall) {

                    // Selects UV Index
                    UVIndexNumber = parseInt(dataOneCall.current.uvi)
                    UVIndex.innerHTML = ""
                    UVIndex.innerHTML += UVIndexNumber
                    UVIndex.style.paddingLeft = "5px"
                    UVIndex.style.paddingRight = "5px"

                    if (UVIndexNumber >= 0 && UVIndexNumber < 3) {
                        UVIndex.style.background = "rgba(0, 255, 0, 0.5)"
                        UVIndex.innerHTML += "&nbsp(Low)"
                    } else if (UVIndexNumber > 3 && UVIndexNumber <= 6) {
                        UVIndex.style.background = "rgba(250, 216, 89, 0.5)"
                        UVIndex.innerHTML += "&nbsp(Moderate)"
                    } else if (UVIndexNumber > 6 && UVIndexNumber <= 8) {
                        UVIndex.style.background = "rgba(248, 148, 6, 0.5)"
                        UVIndex.innerHTML += "&nbsp(High)"
                    } else if (UVIndexNumber > 8 && UVIndexNumber <= 11) {
                        UVIndex.style.background = "rgba(207, 0, 15, 0.5)"
                        UVIndex.innerHTML += "&nbsp(Very High)"
                    } else if (UVIndexNumber > 11) {
                        UVIndex.style.background = "rgba(154, 18, 179, 1)"
                        UVIndex.innerHTML += "&nbsp(Extreme)"
                    }
                })
        })
        .catch((error) => {
            console.error('Error: ', error)
            errorMessage.textContent = "Please enter a valid city name."
        })
}

function get5Day(citySearchString) {
    futureWeatherInfo.textContent = ""
    const fiveDayURLStart = "http://api.openweathermap.org/data/2.5/forecast?q="
    var APIKey = "&appid=d1b743fbcfca85dad360210556b54d8c"
    var fiveDayRequestUrl = fiveDayURLStart + citySearchString + APIKey
    console.log("5-day Forecast URL: " + fiveDayRequestUrl)

    const kelvinConversion = -273.15

    // Browser Fetch Method
    fetch(fiveDayRequestUrl)
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {
            var weatherList = data.list
            var noonForecastArray = [weatherList[4], weatherList[12], weatherList[20], weatherList[28], weatherList[36]]

            for (var i = 0; i < noonForecastArray.length; i++) {

                // Find Date and converts to Moment Format
                var fiveDayDate = noonForecastArray[i].dt_txt
                var fiveDayMoment = moment(fiveDayDate).format("MM/DD/YY")

                // Find Celcius
                var fiveDayTempKelvin = parseFloat(noonForecastArray[i].main.temp) + kelvinConversion
                fiveDayWeatherTemp = fiveDayTempKelvin.toFixed(1) + " °C"

                // Find Humidity
                fiveDayHumidity = noonForecastArray[i].main.humidity + "%"

                // Find Weather Conditions Ex: Clouds, Clear
                fiveDayIconCode = noonForecastArray[i].weather[0].icon

                // Creates the div for the 5-day Forecast, one at a time
                var fiveDayDiv = document.createElement("div")
                fiveDayDiv.classList = 'futureWeatherBox'

                // Creates the date element of the forecast 
                var fiveDayDate = document.createElement("h3")
                fiveDayDate.textContent = fiveDayMoment
                fiveDayDate.setAttribute("class", "h3")

                // Creates the image element of the forecast
                var fiveDayIcon = document.createElement("img")
                fiveDayIcon.setAttribute("src", "./assets/icons/" + fiveDayIconCode + ".png")

                // Creates the temperature element of the forecast
                var fiveDayCelcius = document.createElement("p")
                fiveDayCelcius.textContent = "Temp: " + fiveDayWeatherTemp

                // Creates the humidity element of the forecast
                var fiveDayHumidityDiv = document.createElement("p")
                var humidityText = fiveDayHumidity
                // console.log(humidityText)
                fiveDayHumidityDiv.innerText = "Humidity: " + humidityText

                // Append everything together
                futureWeatherInfo.appendChild(fiveDayDiv)
                fiveDayDiv.append(fiveDayDate)
                fiveDayDiv.append(fiveDayIcon)
                fiveDayDiv.append(fiveDayCelcius)
                fiveDayDiv.append(fiveDayHumidityDiv)
            }

            // Creates Search History Array 
            var history = localStorage.getItem("history").split(',');
            console.log(searchHistory[0])
            console.log("Line 160:" , searchHistory)
            searchHistory.unshift(citySearchString)
            searchHistory.join(history)
            console.log("Line 162:" , searchHistory)

            // Removes Duplicates in Array
            filteredArray = searchHistory.filter(function (item, pos, self) {
                return self.indexOf(item) == pos
            })
            console.log(filteredArray)
            localStorage.setItem("history", filteredArray)

        })
        .catch((error) => {
            console.error('Error: ', error)
        })
}