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

// Saves options to chrome.storage
function save_options() {
    const showWeather = document.getElementById('showWeather').checked;
    const tempUnit = document.querySelector('input[name="temp"]:checked').value;
    const themeType = document.querySelector('input[name="theme"]:checked').value;
    const geoAccuracy = document.getElementById('geoAccuracy').checked;
    const owmKey = document.getElementById('owmKey').value;

    chrome.storage.sync.set({
        showWeather: showWeather,
        geoAccuracy: geoAccuracy,
        owmKey : owmKey,
        tempUnit: tempUnit,
        themeType: themeType,
    }, function() {
        // Update status to let user know options were saved.
        if (Notification && Notification.permission === "granted") {
            new Notification('Saved!', {
                // icon: '',
                body: "Options have been successfully saved.",
            });
        }
        else {
            const status = document.getElementById('status');
            status.textContent = 'Options saved.';
            setTimeout(function () {
                status.textContent = '';
            }, 750);
        }
    });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
    chrome.storage.sync.get({
        showWeather: true,
        geoAccuracy: false,
        owmKey: '',
        tempUnit: true,
        themeType: ''
    }, function(items) {
        document.getElementById('showWeather').checked = items.showWeather;
        document.getElementById('geoAccuracy').checked = items.geoAccuracy;
        document.getElementById('owmKey').value = items.owmKey;
        if (items.tempUnit) {
            if (items.tempUnit === 'F')
                document.getElementById('fahrenheit').checked = true;
            else
                document.getElementById('celsius').checked = true;
        }
        if(items.themeType === 'Dark')
            document.getElementById('theme-dark').checked = true;
        else if(items.themeType === 'Light')
            document.getElementById('theme-light').checked = true;
        else
            document.getElementById('theme-auto').checked = true;
    });
}

if(Notification) {
    if(Notification.permission !== "granted")
        Notification.requestPermission();
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);