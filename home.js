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
let geoOptions = {
    enableHighAccuracy: false,
    timeout: 5000,
    maximumAge: 0,
    owmKey: '',
};

const optionsButton = document.getElementById("options-button");
const locationButton = document.getElementById("key-button");
locationButton.style.display = 'none';
if(window.chrome && chrome.runtime && chrome.runtime.id) { // Check if running as extension
    try {
        optionsButton.addEventListener('click', function () {
            openExtensionSettings()
        });
    }
    catch (e) {
        optionsButton.style.display = 'none';
        console.log("Hiding chrome settings button")
    }
    try {
        chrome.storage.sync.get({
            showWeather: true,
            geoAccuracy: false,
            owmKey : ''
        }, function (items) {
            if (items.showWeather) {
                geoOptions.owmKey = items.owmKey;
                geoOptions.enableHighAccuracy = items.geoAccuracy;
                console.log("high accuracy: " + geoOptions.enableHighAccuracy);
                navigator.geolocation.getCurrentPosition(geoSuccess, geoError, geoOptions);
            }
        });
    }
    catch (e) {
        console.error("Could not connect to chrome\n" + e.message);
        console.log("Geolocation services have been disabled.");
    }
}
else {
    // User isn't running this as an extension - disable chrome api features
    optionsButton.style.display = 'none';
}

updateDate()
setInterval(function () {
    updateDate()
}, 1000);

function updateDate() {
    const date = new Date();
    let strDate;
    if (date.getHours() < 10)
        strDate = date.toTimeString().substr(1, 4);
    else
        strDate = date.toTimeString().substr(0, 5);
    let formattedDate = `${date.toLocaleString("en-us", { weekday: "short" })}., ${date.getDay()} ${date.toLocaleString("en-us", { month: "short" })}.`;
    document.getElementById("time").innerText = strDate;
    document.getElementById("date").innerText = formattedDate + dateSuffix;
}

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
        const anHttpRequest = new XMLHttpRequest();
        anHttpRequest.onreadystatechange = function() {
            if (anHttpRequest.readyState === 4 && anHttpRequest.status === 200)
                aCallback(anHttpRequest.responseText);
        };

        anHttpRequest.open( "GET", aUrl, true );
        anHttpRequest.send( null );
    }
};

function geoSuccess(pos) {
    const coords = pos.coords;
    //original key = 'a08a6f35015f856266be62404dcf2110'
    app_id = geoOptions['owmKey'];
    api_url = `https://api.openweathermap.org/data/2.5/weather?lat=${coords.latitude}&lon=${coords.longitude}&appid=${app_id}`;
    console.log(`More or less ${coords.accuracy} meters.`);

    let xhr = new XMLHttpRequest();
    xhr.open("GET", api_url, true);
    xhr.onload = function(e) {
        if(xhr.readyState === 4) {
            if(xhr.status === 200) {
                const json = JSON.parse(xhr.responseText);
                let temp = json.main.temp - 273.15; // TODO add fahrenheit support
                let descr = json.weather[0].description;
                descr = descr.toLowerCase().split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ');
                dateSuffix = ` - ${descr} - ${temp.toFixed(1)} \xB0 - ${json.name}`;
            }
            else {
                console.warn("Probably issue with API key");
                showOWMWarning();
            }
        }

    }
    xhr.send(null);
}
function geoError(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
}
function showOWMWarning() {
    locationButton.style.display = 'block';
    locationButton.addEventListener('click', function () {
        if(confirm("There was an retrieving weather data. It may be due to a key error, or you haven't set one up!\n\nPress OK to open options.")) {
            openExtensionSettings();
        }
    });
}
function openExtensionSettings() {
    // chrome.tabs.create({'url': `chrome://extensions/?options=${chrome.runtime.id}`});
    chrome.tabs.query({currentWindow: true, active: true}, function (tab) {
        chrome.tabs.update(tab.id, {url: `chrome://extensions/?options=${chrome.runtime.id}`});
    });
}