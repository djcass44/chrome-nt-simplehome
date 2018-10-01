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

var x = setInterval(function() {
    var date = new Date();
    var strDate;
    if(date.getHours() < 10)
        strDate = date.toTimeString().substr(1, 4);
    else
        strDate = date.toTimeString().substr(0, 5);
    document.getElementById("time").innerHTML = strDate;
}, 1000);

var date = new Date();
var hour = date.getHours();

var titleColour = "#000000";
var textColour = "#000000";
var backgroundColour = "#FAFAFA";
if(hour >= 18 || hour < 7) {
    backgroundColour = "#263238";
    textColour = "#757575";
    titleColour = "#9e9e9e";
}

document.body.style.backgroundColor = backgroundColour;


var pElements = document.getElementsByTagName("p");
for(var i = 0; i < pElements.length; i++) {
    pElements[i].style.color = textColour;
}
var hElements = document.getElementsByTagName("h1");
for(var j = 0; j < hElements.length; j++) {
    hElements[j].style.color = titleColour;
}
