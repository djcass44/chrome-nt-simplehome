/*
 * Copyright (C) 2018  django
 *
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU General Public License as published by
 *     the Free Software Foundation, either version 3 of the License, or
 *     (at your option) any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU General Public License for more details.
 *
 *     You should have received a copy of the GNU General Public License
 *     along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

let dateSuffix = "";
const geoOptions = {
    enableHighAccuracy: false,
    timeout: 5000,
    maximumAge: 0
};

chrome.storage.sync.get({
    showWeather: true
}, function(items) {
    if(items.showWeather) {
        navigator.geolocation.getCurrentPosition(geoSuccess, geoError, geoOptions);
    }
});

const x = setInterval(function () {
    const date = new Date();
    let strDate;
    if (date.getHours() < 10)
        strDate = date.toTimeString().substr(1, 4);
    else
        strDate = date.toTimeString().substr(0, 5);
    let formattedDate = `${date.toLocaleString("en-us", { weekday: "short" })}., ${date.getDay()} ${date.toLocaleString("en-us", { month: "short" })}.`;
    document.getElementById("time").innerText = strDate;
    document.getElementById("date").innerText = formattedDate + dateSuffix
}, 1000);

const date = new Date();
const hour = date.getHours();

let titleColour = "#363636";
let textColour = "#000000";
let backgroundColour = "#FAFAFA";
if(hour >= 18 || hour < 7) {
    backgroundColour = "#263238";
    textColour = "#757575";
    titleColour = "#9e9e9e";
}

document.body.style.backgroundColor = backgroundColour;


const pElements = document.getElementsByTagName("p");
for(let i = 0; i < pElements.length; i++) {
    pElements[i].style.color = textColour;
}
const hElements = document.getElementsByTagName("h1");
for(let j = 0; j < hElements.length; j++) {
    hElements[j].style.color = titleColour;
}


let HttpClient = function() {
    this.get = function(aUrl, aCallback) {
        var anHttpRequest = new XMLHttpRequest();
        anHttpRequest.onreadystatechange = function() {
            if (anHttpRequest.readyState === 4 && anHttpRequest.status === 200)
                aCallback(anHttpRequest.responseText);
        }

        anHttpRequest.open( "GET", aUrl, true );
        anHttpRequest.send( null );
    }
};

function geoSuccess(pos) {
    const coords = pos.coords;
    app_id = 'a08a6f35015f856266be62404dcf2110'; // TODO make user generate own key
    api_url = `https://api.openweathermap.org/data/2.5/weather?lat=${coords.latitude}&lon=${coords.longitude}&appid=${app_id}`;
    console.log('Your current position is:');
    console.log(`Latitude : ${coords.latitude}`);
    console.log(`Longitude: ${coords.longitude}`);
    console.log(`More or less ${coords.accuracy} meters.`);
    const client = new HttpClient();
    client.get(api_url, function (response) {
        console.log("OWM response received");
        const json = JSON.parse(response);
        let temp = json.main.temp - 273.15; // TODO add fahrenheit support
        let descr = json.weather[0].description
        descr = descr.toLowerCase().split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ');
        dateSuffix = `\n${descr} - ${temp.toFixed(1)} \xB0\n${json.name}`
    })
}
function geoError(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
}