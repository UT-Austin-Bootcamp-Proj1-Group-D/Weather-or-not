// Function: search NOAA
// utilizes the NOAA API to search through the list of cities and compares their upcoming weather to what the user selected
// Returns: array of cities that matches the weather description
var cities = {
  cityName: ["Los Angeles", "Atlanta", "Chicago", "Dallas", "Denver" ,"New York", "San Francisco", "Seattle", "Las Vegas", "Orlando", "Charlotte", "Phoenix", "Houston", "Minneapolis", "Detroit", "Philadelphia"],
  airportCode: ["LAX", "ATL", "ORD", "DFW", "DEN", "JFK", "SFO", "SEA", "LAS", "MCO", "CLT", "PHX", "IAH", "MSP", "DTW", "PHL"],
  lat: [33.942791, 33.748997, 41.978611, 32.897480, 39.849312, 40.712776, 37.774929, 47.443546, 36.086010, 28.538336, 35.213890, 33.448376, 29.760427, 44.977753, 42.3314, 39.9526],
  long: [-118.410042, -84.387985, -87.904724, -97.040443, -104.673828, -74.005974, -122.419418, -122.301659, -115.153969, -81.379234, -80.943054, -112.074036, -95.369804, -93.265015, -83.0458,-75.1652],
  cwa: ["LOX", "FFC", "LOT", "FWD", "BOU", "OKX", "MTR", "SEW", "VEF", "MLB", "GSP", "PSR", "HGX", "MPX", "DTX", "PHI"],
  gridX: [147, 50, 65, 79, 73, 32, 88, 123, 121, 25, 114, 158, 64, 107, 70, 49],
  gridY: [40, 86, 76, 108, 65, 34, 126, 59, 93, 68, 63, 57, 96, 71, 33, 75]
}
function searchNOAA(weatherDescription) {
  var queryURL = "https://api.weather.gov/gridpoints/" +cities.cwa[0]+ "/"+cities.gridX[0]+","+cities.gridY[0]+"/forecast";

  $.ajax({
    url: queryURL,
    method: "GET"
  })
    .then(function (response) {
      for (var i =0 ; i<response.properties.periods.length; i++){
      var results = response.properties.periods[i]
      var forecast = results.shortForecast
      console.log(forecast)
}})}


// Function: searchFlights
// use the Skyscanner API to search for the cheapest flights based on the cities selected by the user
// Returns: array of objects, cities and the cheapest flight found
function searchFlights(citiesSelected) {
    let origin = "AUS"
    let dest = "LAX"
    let endDate = "2020-01-29"
    // search skyscanner api for cheapest flight on date
    // return the cheapest flight 

    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browsequotes/v1.0/US/USD/en-US/SFO-sky/JFK-sky/2020-09-01?inboundpartialdate=2020-12-01",
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com",
            "x-rapidapi-key": "f655d74b8dmsh7124e9f74a7fa7ep1abd4ajsn3b73d28c941a"
        }
    };

    $.ajax(settings).done(function (response) {
        console.log(response);
    });

}

// Function displayLowestPrices
// displays the lowest price flights to the page
function displayLowestPrices() {
    $("#cities").html("");
}

// Function: displayCitiesWeather
// displays the cities and their weather to the page
function displayCitiesWeather(id) {
    $("#cities").html("");
    //console.log(id);

    var tableDiv = $("<div>").addClass("col-md-12");
    var table = $("<table>").addClass("table");
    var heading = $("<thead>").addClass("thead-dark");
    var headingTr = $("<tr>");
    headingTr.append($("<th>").text("Select"), $("<th>").text("City"), $("<th>").text("Day 1"), $("<th>").text("Day 2"), $("<th>").text("Day 3"));
    heading.append(headingTr);


    let citiesWeather = searchNOAA(id);

    // TODO: Create foreach looping through each citiesWeather and add to table

    //var tbody = $("<tbody>");
    //var tr = $("<tr>");
    //tr.append($("<td>").text("blah"));
    // tbody.append(tr);
    // table.append(tbody);

    table.append(heading);
    tableDiv.append(table);
    $("#cities").append(tableDiv);
};

$(document).ready(function () {
    $(".weather-btn").on("click", function () {
        let id = $(this).attr("id");
        //console.log(id);
        displayCitiesWeather(id);
    });
    
    
});



// Cities onclick event

// Search flights onclick event

// Redo flights onclick event

// Edit cities onclick event