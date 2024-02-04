// document function
$(document).ready(function () {
    // display the cities stored in local storage
    displayLocalStorage();
    // event listener for the search button
    $("#search-button").on("click", function (event) {
        // prevent the default action of the event
        event.preventDefault();
        // get the value of the search input
        var city = $("#search-input").val().trim();
        //clear the search input
        $("#search-input").val("");
        // store the city in local storage
        storeCity(city);
        // if the city is not empty fetch the lon and lat of the city then the weather data 
        if (city) {
            fetchDataSequentially(city);
        }
        else {
            alert("Please enter a city");
        }
    });
    
    // event listener for the history buttons
    $("#history").on("click", "#history-button", function (event) {
        // prevent the default action of the event
        event.preventDefault();
        // get the city name from the button
        var city = $(this).attr("data-city");
        // fetch the lon and lat of the city then the weather data 
        fetchDataSequentially(city);
    });

    // function to fetch the lon and lat of the city and then fetch the weather data
    function fetchDataSequentially(city) {
        fetch("https://api.openweathermap.org/geo/1.0/direct?q=" + city
        + "&limit=1&appid=7edf678be3dfbb52ca6176d7c38aa0f0")
        .then(function (response) {
            return response.json();
        })
        // when the data is converted to JSON, call the function to get the weather data
        .then(function (data) {
            console.log(data);
            // get the lon and lat from the data returned from the 1st fetch 
            var lat = data[0].lat.toString();
            var lon = data[0].lon.toString();
            // fetch the weather data using the lon and lat
            fetch("https://api.openweathermap.org/data/2.5/forecast?lat=" + lat
                + "&lon=" + lon + "&units=metric&appid=7edf678be3dfbb52ca6176d7c38aa0f0")
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    // display the data from the second fetch 
                    console.log(data);
                    displayCurrentWeather(data);
                    displayForecast(data);
                    //update stored city buttons
                    displayLocalStorage();
                });
        });
    }

    // function to display the weather data
    function displayCurrentWeather(data){
        // get the forecast data from the data returned from the fetch 
        var forecast = data.list;
        // get the current date
        var today = dayjs().format('DD/MM/YYYY');
        // todays forecast 
        $("#today").empty();
        var todayHeadingEl = $("<h2>").text(data.city.name+ " " + today);
        var todayIconEl = $("<img>").attr("src", "https://openweathermap.org/img/w/" + forecast[0].weather[0].icon + ".png");
        var todaytempEl = $("<p>").text("Temperature: " + forecast[0].main.temp + "°C");
        var todaywindEl = $("<p>").text("Wind: " + forecast[0].wind.speed + " MPH");
        var todayhumidityEl = $("<p>").text("Humidity: " + forecast[0].main.humidity + "%");

        todayHeadingEl.append(todayIconEl);
        $("#today").append(todayHeadingEl, todaytempEl, todaywindEl, todayhumidityEl);

        // add a class to the today section to style it
        $("#today").addClass("todayStyle");
    }
    // function to display the forecast weather data at 12pm for the next 5 days
    function displayForecast(data){
        // clear forecast section
        $("#forecast").empty();
        // get the forecast data from the data returned from the fetch 
        var forecast = data.list;
        // loop through the forecast data
        for (var i = 0; i < forecast.length; i++) {
            // get the date and time of the forecast
            var date = forecast[i].dt_txt;
            // if the time is 12pm, display the forecast data
            if (date.includes("12:00:00")) {
                // create a div to hold the forecast data
                var forecastEl = $("<div>").addClass("col-2 forecast");
                // create a h5 element to hold the date
                var dateEl = $("<h5>").text(dayjs(date).format('DD/MM/YYYY'));
                // create an img element to hold the weather icon
                var iconEl = $("<img>").attr("src", "https://openweathermap.org/img/w/" + forecast[i].weather[0].icon + ".png");
                // create a p element to hold the temperature
                var tempEl = $("<p>").text("Temp: " + forecast[i].main.temp + "°C");
                // create a p element to hold the wind speed
                var windEl = $("<p>").text("Wind: " + forecast[i].wind.speed + " MPH");
                // create a p element to hold the humidity
                var humidityEl = $("<p>").text("Humidity: " + forecast[i].main.humidity + "%");
                // append the data to the forecast div
                forecastEl.append(dateEl, iconEl, tempEl, windEl, humidityEl);
                // append the forecast div to the forecast section
                $("#forecast").append(forecastEl);
            }
        }
        // add a heading to the forecast section
        var forecastHeadingEl = $("<h2>").text("5-Day Forecast:").addClass("col-12");
        $("#forecast").prepend(forecastHeadingEl);
        // add a class to the forecast section to style it
        $("#forecast").addClass("forecastStyle");
    }

    // function to save the city to local storage
    function storeCity(city){
        // check if the city is empty
        if (city === "") {
            return;
        }
        // get the city array from local storage or create an empty array
        var cityArray = JSON.parse(localStorage.getItem("city")) || [];
        // check if city is already in the array
        if (cityArray.includes(city)) {
            return;
        }
        // add the city to the array
        cityArray.push(city);
        // save the array to local storage
        localStorage.setItem("city", JSON.stringify(cityArray));
    }

    function displayLocalStorage(){
        // get the city array from local storage
        var cityArray = JSON.parse(localStorage.getItem("city"));
        // clear the history section
        $("#history").empty();
        // loop through the city array
        if (cityArray === null) {
            return;
        }
        for (var i = 0; i < cityArray.length; i++) {
            // create a button for each city in the array
            var cityEl = $("<button>").text(cityArray[i]);
            // add classes and attributes to the button
            cityEl.addClass("btn btn-secondary btn-block");
            // add the city name as a data attribute
            cityEl.attr("data-city", cityArray[i])
            // add an id to the button
            cityEl.attr("id", "history-button")
            $("#history").append(cityEl);
        }
    }
    $(document).ready(function () {
        // ...
    
        // Initialize Autocomplete on the search input
        $("#search-input").autocomplete({
            source: function (request, response) {
                // Your logic to fetch autocomplete suggestions based on the request.term
                // For simplicity, you can use a static list or fetch from an API
                var suggestions = ["London", "New York", "Paris", "Tokyo"];
                var filteredSuggestions = $.ui.autocomplete.filter(suggestions, request.term);
                response(filteredSuggestions);
            },
            minLength: 2, // Minimum characters to start autocomplete
            select: function (event, ui) {
                // Trigger the search button click when an item is selected
                $("#search-button").trigger("click");
            }
        });
    
        // ...
    
    });
    
    $(document).ready(function () {
        // ...
    
        // Event listener for the clear history button
        $("#clearHistoryBtn").on("click", function () {
            clearSearchHistory();
        });
    
        // Function to clear search history from local storage
        function clearSearchHistory() {
            // Remove the "city" key from local storage
            localStorage.removeItem("city");
            // Clear the history section
            $("#history").empty();
        }
    
        // ...
    });
    
});