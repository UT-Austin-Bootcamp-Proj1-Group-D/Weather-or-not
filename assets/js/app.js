var matches = [];
// Function: search NOAA
// utilizes the NOAA API to search through the list of cities and compares their upcoming weather to what the user selected
// Returns: array of cities that matches the weather description

function searchNOAA(weatherDescription) {

    matches = [];

    cities.airportCode.forEach(function (element, index) {

        var queryURL = "https://api.weather.gov/gridpoints/" + cities.cwa[index] + "/" + cities.gridX[index] + "," + cities.gridY[index] + "/forecast";
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            var flag = false
            
            var forecast = response.properties.periods;



            forecast.forEach(function (element) {
                if (element.shortForecast.includes(weatherDescription)) {
                    
                    if (matches.indexOf(index) === -1) {
                        matches.push(index);
                        //console.log(matches);
                        flag = true;

                    }
                }
            });
            if (flag) {
                let startIndex = 0;
                var today = new Date();

                if (today.getHours() >= 18) {
                    startIndex++;
                }
                var tbody = $("<tbody>");
                var tr = $("<tr>");

                tr.append($("<td>").html($("<input>")
                    .attr("type", "checkbox")
                    .attr("data-index", index)
                    .addClass("city-select")));

                tr.append($("<td>").text(cities.cityName[index]));

                tr.append($("<td>").text(forecast[startIndex].shortForecast + " " + forecast[startIndex].temperature + "°F"));
                tr.append($("<td>").text(forecast[startIndex + 2].shortForecast + " " + forecast[startIndex + 2].temperature + "°F"));
                tr.append($("<td>").text(forecast[startIndex + 4].shortForecast + " " + forecast[startIndex + 4].temperature + "°F"));
                tr.append($("<td>").text(forecast[startIndex + 6].shortForecast + " " + forecast[startIndex + 6].temperature + "°F"));
                tr.append($("<td>").text(forecast[startIndex + 8].shortForecast + " " + forecast[startIndex + 8].temperature + "°F"));
                tr.append($("<td>").text(forecast[startIndex + 10].shortForecast + " " + forecast[startIndex + 10].temperature + "°F"));
                tr.append($("<td>").text(forecast[startIndex + 12].shortForecast + " " + forecast[startIndex + 12].temperature + "°F"));
                tbody.append(tr);
                $("#weather-table").append(tbody);
            }

        });



    });

}


// Function: searchFlights
// use the Skyscanner API to search for the cheapest flights based on the cities selected by the user
// Returns: array of objects, cities and the cheapest flight found
function searchFlights(origin, dest, date) {

    // search skyscanner api for cheapest flight on date
    // return the cheapest flight 
    let url = "https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browsequotes/v1.0/US/USD/en-US/" + origin + "-sky/" + dest + "-sky/" + date + "?";
    
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": url,
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com",
            "x-rapidapi-key": "f655d74b8dmsh7124e9f74a7fa7ep1abd4ajsn3b73d28c941a"
        }
    };

    $.ajax(settings).done(function (response) {
        console.log(response);
        for (var i = 0; i < response.Quotes.length; i++) {      //Get price and departure date and time
            var quote = response.Quotes[i].MinPrice
            var departdate = response.Quotes[i].OutboundLeg.DepartureDate
            var departdateFix = departdate.slice(0, 10)
            var carrierIdGet = response.Quotes[i].OutboundLeg.CarrierIds[0]
            var directflight = response.Quotes[i].Direct
            console.log(carrierIdGet)
        }
        for (var i = 0; i < response.Places.length; i++) { //find the destination airport
            var airportDes = response.Places[1].Name
            
        }
        for (var i = 0; i < response.Carriers.length; i++) { //find which airlines are returned
            if (carrierIdGet === response.Carriers[i].CarrierId){
            var carrierpick = response.Carriers[i].Name
            console.log(carrierpick)}
        }
        
       
        $("#flights").html("");

        var tableDiv2 = $("<div>").addClass("col-md-8");
        var table2 = $("<table>").addClass("table").attr("id", "flight-table");
        var heading2 = $("<thead>").addClass("thead-dark");
        var headingTr2 = $("<tr>");
        headingTr2.append($("<th>"),
            $("<th>").text("Destination"),
            $("<th>").text("Destination Airport"),
            $("<th>").text(" Price ($)"),
            $("<th>").text("Depature Date (YYYY/MM/DD)"), //change this to user input
            $("<th>").text("Direct Flight?"),
            $("<th>").text("Airline"),
        );
        heading2.append(headingTr2);
        table2.append(heading2);
        tableDiv2.append(table2);
        $("#flights").append(tableDiv2);

        var tbody2 = $("<tbody>");
        var tr2 = $("<tr>");
        tr2.append($("<td>").text(""));
        tr2.append($("<td>").text("Destination"));
        tr2.append($("<td>").text(airportDes));
        tr2.append($("<td>").text(quote));
        tr2.append($("<td>").text(departdateFix));
        tr2.append($("<td>").text(directflight));
        tr2.append($("<td>").text(carrierpick));
        tbody2.append(tr2);
        $("#flight-table").append(tbody2);

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
    var table = $("<table>").addClass("table").attr("id", "weather-table");
    var heading = $("<thead>").addClass("thead-dark");
    var headingTr = $("<tr>");
    headingTr.append($("<th>").text("Select"),
        $("<th>").text("City"),
        $("<th>").text("Day 1"),
        $("<th>").text("Day 2"),
        $("<th>").text("Day 3"),
        $("<th>").text("Day 4"),
        $("<th>").text("Day 5"),
        $("<th>").text("Day 6"),
        $("<th>").text("Day 7"));
    heading.append(headingTr);


    searchNOAA(id);

    table.append(heading);
    tableDiv.append(table);
    //tableDiv.append($("<button>").attr("id", "search-btn").text("Search Flights"));
    $("#cities").append(tableDiv);
};

$(document).ready(function () {
    $(".weather-btn").on("click", function () {
        let id = $(this).attr("id");
        console.log(id);
        displayCitiesWeather(id);
    });

    $("#search-flights").off("click");  // This is a hack I don't know why this works
    $("#search-flights").on("click", function (event) {
        event.preventDefault();
        let citiesSelected = [];
        $("input.city-select:checked").each(function () {
            let id = $(this).attr("data-index");
            let origin = "AUS"
            let dest = cities.airportCode[id];
            let date = "2020-02-10"
            searchFlights(origin, dest, date);
        });
    });
});


// Cities onclick event

// Search flights onclick event

// Redo flights onclick event

// Edit cities onclick event