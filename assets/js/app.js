// Variable: matches
// Holds the cities that match the weather
var matches = [];

// Function: search NWS
// utilizes the NWS API to search through the list of cities and compares their upcoming weather to what the user selected
// Returns: array of cities that matches the weather description
function searchNWS(weatherDescription) {
    // set matches to a blank array
    matches = [];

    // for each city in the city array, search the weather and check to see if there's amatch in the next 7 days
    cities.airportCode.forEach(function (element, index) {
        // set up the query URL
        var queryURL = "https://api.weather.gov/gridpoints/" + cities.cwa[index] + "/" + cities.gridX[index] + "," + cities.gridY[index] + "/forecast";

        // AJAX call to the weather.gov API
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {

            var flag = false; // flag to set true if there is a weather match
            var forecast = response.properties.periods; // get the next 7 day forecast out of the response

            // loop through each forecast period 
            forecast.forEach(function (element) {
                if (element.shortForecast.includes(weatherDescription)) { // if the weather type is in the short description, it's a match
                    if (matches.indexOf(index) === -1) {
                        matches.push(index);
                        flag = true;
                    }
                }
            });
            if (flag) { // if there's a match, add the weather to the city table
                let startIndex = 0;
                var today = new Date(); // get today's date

                // forcasts are issued twice a day, make sure you're pulling the day forecast and not the night one
                if (today.getHours() >= 18) {
                    startIndex++;
                }
                var tbody = $("<tbody>");
                var tr = $("<tr>");

                // add the daily weather
                tr.append($("<td>").html($("<input>")
                    .attr("type", "checkbox")
                    .attr("data-index", index)
                    .addClass("city-select")));
                tr.append($("<td>").text(cities.cityName[index]));
                tr.append($("<td>").html(forecast[startIndex].shortForecast + "<br> " + forecast[startIndex].temperature + "°F").addClass("text-center"));
                tr.append($("<td>").html(forecast[startIndex + 2].shortForecast + "<br> " + forecast[startIndex + 2].temperature + "°F").addClass("text-center"));
                tr.append($("<td>").html(forecast[startIndex + 4].shortForecast + "<br> " + forecast[startIndex + 4].temperature + "°F").addClass("text-center"));
                tr.append($("<td>").html(forecast[startIndex + 6].shortForecast + "<br> " + forecast[startIndex + 6].temperature + "°F").addClass("text-center"));
                tr.append($("<td>").html(forecast[startIndex + 8].shortForecast + "<br> " + forecast[startIndex + 8].temperature + "°F").addClass("text-center"));
                tr.append($("<td>").html(forecast[startIndex + 10].shortForecast + "<br> " + forecast[startIndex + 10].temperature + "°F").addClass("text-center"));
                tr.append($("<td>").html(forecast[startIndex + 12].shortForecast + "<br> " + forecast[startIndex + 12].temperature + "°F").addClass("text-center"));
                tbody.append(tr);

                // add the city and weather to the table
                $("#weather-table").append(tbody);
            }
        });
    });
}


// Function: searchFlights
// use the Skyscanner API to search for the cheapest flights based on the cities selected by the user
// Returns: array of objects, cities and the cheapest flight found
function searchFlights(origin, dest, date, city) {
    // search Skyscanner Cache API for cheapest flight on date entered
    let url = "https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browsequotes/v1.0/US/USD/en-US/" + origin + "-sky/" + dest + "-sky/" + date;
    //console.log(url);
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": url,
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com",
            "x-rapidapi-key": "f655d74b8dmsh7124e9f74a7fa7ep1abd4ajsn3b73d28c941a",
            "Access-Control-Allow-Origin": "*"
        }
    };

    // Make the API call
    $.ajax(settings).done(function (response) {
        console.log(response);

        // split out the variables from the response (for more better readability)
        let quotes = response.Quotes;
        let places = response.Places;
        let carriers = response.Carriers;

        for (let i = 0; i < quotes.length; i++) { //Get price and departure date and time
            // set up our variables from the query response
            var quote = quotes[i].MinPrice
            var departdate = quotes[i].OutboundLeg.DepartureDate
            var departdateFix = departdate.slice(0, 10)
            var carrierIdGet = quotes[i].OutboundLeg.CarrierIds[0]
            var directflight = quotes[i].Direct
            var airportId = quotes[i].OutboundLeg.DestinationId

            for (let x = 0; x < places.length; x++) { //find the destination airport
                if (airportId === places[x].PlaceId) { //getting the correct carrier
                    var airportDes = places[x].Name;
                    console.log(airportDes);
                }
            }
            for (let y = 0; y < carriers.length; y++) { //find which airlines are returned
                if (carrierIdGet === carriers[y].CarrierId) { //getting the correct carrier
                    var carrierpick = carriers[y].Name;
                    console.log(carrierpick);
                }
            }

            // add the quote to do the table 
            var tbody2 = $("<tbody>");
            var tr2 = $("<tr>");
            tr2.append($("<td>").text(""));
            tr2.append($("<td>").text(city));
            tr2.append($("<td>").text(airportDes + " (" + dest + ")"));
            tr2.append($("<td>").text("$" + quote));
            tr2.append($("<td>").text(departdateFix));
            // display a check mark if it's a direct flight
            if(directflight){
                tr2.append($("<td>").html("&#x2714"));
            } else {
                tr2.append($("<td>").html("&#x2717"));
            }  
            tr2.append($("<td>").text(carrierpick));
            tr2.append($("<td>").html($("<a>").attr("href", "https://www.skyscanner.com/transport/flights/" + origin + "/" + dest + "/" + date).text("Book Now").attr("target", "_blank")));
            tbody2.append(tr2);
            $("#flight-table").append(tbody2);
        }
    });
}

// Function: displayCitiesWeather
// displays the cities and their weather to the page
function displayCitiesWeather(id) {
    $("#cities").html(""); // clear out the cities div

    // set up the table heading variables
    var tableDiv = $("<div>").addClass("col-md-12");
    var table = $("<table>").addClass("table").attr("id", "weather-table");
    var heading = $("<thead>").addClass("thead-dark");
    var headingTr = $("<tr>");
    headingTr.append($("<th>").text("Select"),
        $("<th>").text("City"),
        $("<th>").text("Day 1").addClass("text-center"),
        $("<th>").text("Day 2").addClass("text-center"),
        $("<th>").text("Day 3").addClass("text-center"),
        $("<th>").text("Day 4").addClass("text-center"),
        $("<th>").text("Day 5").addClass("text-center"),
        $("<th>").text("Day 6").addClass("text-center"),
        $("<th>").text("Day 7").addClass("text-center"));
    heading.append(headingTr); // add heading to the table variable

    // Search the NOAA API 
    searchNWS(id);

    table.append(heading);
    tableDiv.append(table);
    $("#cities").append(tableDiv); // add the cities to the page
};

// Function: weather-btn on click
// searches for the weather type when one of the 4 weather buttons is pressed
$(".weather-btn").on("click", function (e) {
    e.preventDefault(); // don't reload the page
    let id = $(this).attr("id");
    //console.log(id);
    displayCitiesWeather(id); // display the weather in the city
    $("#contact-class").removeAttr("hidden"); // show the date and airport picker
});

// function: Search Flights onclick
$("#search-flights").on("click", function (e) {
    // check the validity of the form - if it's valid go ahead and continue
    if ($("form")[0].checkValidity()) {
        e.preventDefault(); // don't reload the page
        $("#flights").empty(); // clear out the flights table

        // set up the heading
        var tableDiv2 = $("<div>").addClass("col-md-12");
        var table2 = $("<table>").addClass("table").attr("id", "flight-table");
        var heading2 = $("<thead>").addClass("thead-dark");
        var headingTr2 = $("<tr>");
        headingTr2.append($("<th>"),
            $("<th>").text("Destination City"),
            $("<th>").text("Destination Airport"),
            $("<th>").text("Price"),
            $("<th>").text("Depature Date (YYYY-MM-DD)"), 
            $("<th>").text("Direct Flight?"),
            $("<th>").text("Airline"),
            $("<th>").text("")
        );
        // add hedaing to the table variable
        heading2.append(headingTr2);
        table2.append(heading2);
        tableDiv2.append(table2);
        // add heading to page
        $("#flights").append(tableDiv2);

        // for each city that was selected, search for the lowest flight prices
        $("input.city-select:checked").each(function () {
            let id = $(this).attr("data-index");
            let origin = $("#autocomplete-airport-1").val().substr(0, 3);
            let dest = cities.airportCode[id];
            let date = $("#date-input").val();
            date = moment(date, 'MM/DD/YYYY').format('YYYY-MM-DD');
            let city = cities.cityName[id];
            searchFlights(origin, dest, date, city);
        });
    } else { 
        console.log("form not valid");
    }
});

$(document).ready(function () {
    // Set up the airport autocomplete
    var options = {
        formatting: `<div class="$(unique-result)"
                         single-result" 
                         data-index="$(i)"> 
                       $(IATA) </div>`
    };
    AirportInput("autocomplete-airport-1", options);

    //  Set up the daterangepicker
    $("#date-input").daterangepicker({
        singleDatePicker: true,
        showDropdowns: true,
        minYear: 1901,
        maxYear: parseInt(moment().format('YYYY'), 10),
        maxDate: moment().add(7, 'days')
    }, function (start, end, label) {});
});