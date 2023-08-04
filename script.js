
// Global variables
let bgContainer = document.querySelector(".bg-container");
let searchInput = document.querySelector("#searchInput");
let searchBtn = document.querySelector("#searchBtn");
let modalContainer = document.querySelector("#modal");
let modalCloseBtn = document.querySelector("#modalClose");
let overlayEl = document.querySelector("#overlay");
let listsTable = document.querySelector(".lists-table");
let apiKey = 'c72b3654181184b293c82318887883af';
let apiUrl = 'http://api.agromonitoring.com/agro/1.0';
var key = "pk.5c29facfe59285e81d61594415350065";
var api = "https://us1.locationiq.com/v1/search.php?format=json&";


// Recall relevant data based on the location searched
searchBtn.addEventListener("click", function (event) {
    event.preventDefault();
    let searchValue = searchInput.value.trim();
    if (searchValue === '') {
        displayModalContainer("Location not found", "Please enter the required location information.");
        return;
    } else {
        bgContainer.classList.add("height-change");
    }

});

// Display the modal box, it disappears when the background or close button is clicked
function displayModalContainer(title, text) {
    let modalTitle = document.getElementById("modal-title");
    let modalText = document.getElementById("modal-text");

    // It enables reuse
    modalTitle.textContent = title;
    modalText.textContent = text;

    modalContainer.style.display = "block";
}

overlayEl.addEventListener("click", function (event) {
    if (event.target === overlayEl) {
        modalContainer.style.display = "none";
    }
})

modalCloseBtn.addEventListener("click", function () {
    modalContainer.style.display = "none";

});

// "location IQ"
function getLatAndLong(search) {

    return fetch(api + "key=" + key + "&q=" + search)
        .then(function (res) {
            return res.json()
        })
        .then(function (data) {
            const lat = +data[0].lat;
            const lon = +data[0].lon;

            getWeather(data[0].lat, data[0].lon);

            // Store coordinates in local storage
            const coordinates = [lat, lon];
            localStorage.setItem('lastCoordinates', JSON.stringify(coordinates));
            localStorage.setItem('lastSearch', JSON.stringify(search));

            return [+data[0].lat, +data[0].lon];
        })
}

searchBtn.addEventListener("click", function () {
    let search = document.getElementById('searchInput').value.trim();
    getLatAndLong(search)
        .then(createPolygon)
        .then(getMap)
});


function satelliteFunction(latitude, longitude) {
    console.log("latitude", latitude)
    console.log("longitude", longitude)
};

// "Get list of Polys".
function formatDate(timestamp) {
    let dateObj = new Date(timestamp * 1000);
    let year = dateObj.getFullYear();
    let month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    let day = dateObj.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}


const getListOfPolygons = async () => {
    try {
        const response = await fetch(`${apiUrl}/polygons?appid=${apiKey}`);

        if (!response.ok) {
            throw new Error('Failed to fetch the list of polygons');
        }

        const data = await response.json();
        console.log('List of polygons:', data);


        if (data.length !== 0) {
            let tbody = document.createElement("tbody");
            let rows = "";

            data.forEach(lists => {
                let formattedDate = formatDate(lists.created_at);
                rows += `
                    <tr>
                        <td class="capitalize name">${lists.name}</td>
                        <td class="created">${formattedDate}</td>
                        <td class="area">${(lists.area.toFixed(2))}ha</td>
                    </tr>
                `;
            });

            tbody.innerHTML = rows;
            listsTable.append(tbody);

        }
    } catch (error) {
        console.error('Error fetching the list of polygons:', error.message);
    }
};
getListOfPolygons();


// Create Poly API
// create sperate function for this
const createPolygon = async (coordinates) => {
    const halfSide = 250;

    var latitude = coordinates[0]
    var longitude = coordinates[1]

    // Calculate the latitudinal and longitudinal offsets for the square
    const latOffset = halfSide / 111111; // 1 degree of latitude is approximately 111,111 meters
    const lonOffset = halfSide / (111111 * Math.cos(latitude * Math.PI / 180)); // Correct for longitude offset due to latitude

    // Define the four corners of the square by adding/subtracting the offsets from the center
    const topLeft = [longitude - lonOffset, latitude + latOffset];
    const topRight = [longitude + lonOffset, latitude + latOffset];
    const bottomLeft = [longitude - lonOffset, latitude - latOffset];
    const bottomRight = [longitude + lonOffset, latitude - latOffset];

    var square = [topLeft, topRight, bottomRight, bottomLeft, topLeft]
    console.log('long/lat square coordinates:', square)

    try {
        const response = await fetch(`${apiUrl}/polygons?appid=${apiKey}&duplicated=true`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: searchInput.value,
                geo_json: {
                    type: 'Feature',
                    properties: {
                    },

                    geometry: {
                        type: 'Polygon',
                        coordinates: [square],
                    },
                },
            }),
        });
        if (!response.ok) {
            throw new Error('Failed to create the polygon');
        }
        const data = await response.json();
        localStorage.setItem('Polygon created:', searchInput.value, square);
        return data;
    } catch (error) {
        console.error('Error creating the polygon:', error.message);
    }
}

// weather API
function getWeather(latitude, longitude) {
    fetch("https:api.agromonitoring.com/agro/1.0/weather?lat=" + latitude + "&lon=" + longitude + "&appid=" + apiKey)
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {
            let temp = ((data.main.temp - 273.15) * 9 / 5 + 32).toFixed(2);
            let realTemp = ((data.main.feels_like - 273.15) * 9 / 5 + 32).toFixed(2);
            let iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;

            let weatherBox = document.querySelector(".weather-box");
            let weatherContents = `
                <div class="self-stretch bg-slate-800 rounded-md p-6 weather-description">
                    <div class="text-xl font-bold capitalize weather-location add-icon location-icon">${searchInput.value}</div>
                    <div class="pl-6 mt-2  weather-icon">
                        <img class="display-block" src="${iconUrl}" alt="weather icon" />
                    </div>
                    <div class="pl-6 current-weather">${data.weather[0].main}</div>
                    <div class="pl-6 mt-6 text-2xl font-bold current-weather">${temp}℉</div>
                </div>

                <div class="mt-5 sm:mt-0 self-stretch p-6 border-slate-500 bg-slate-800 rounded-md weather-conditions">
                    <div class="text-xs font-light conditions-title">All conditions</div>
                    <ul class="flex flex-wrap pt-5 weather-ul">
                        <li class="mb-7 basis-1/2">
                            <div class="text-sm font-light conditions-title add-icon humidity-icon">Humidity</div>
                            <p class="pl-6 mt-2 font-bold sm:text-lg">${data.main.humidity}%</p>
                        </li>
                        <li class="mb-7 basis-1/2">
                            <div class="text-sm font-light conditions-title add-icon wind-icon">Wind</div>
                            <p class="pl-6 mt-2 font-bold sm:text-lg">${data.wind.speed} MPH</p>
                        </li>
                        <li class="basis-1/2">
                            <div class="text-sm font-light conditions-title add-icon temperature-icon">Real feel</div>
                            <p class="pl-6 mt-2 font-bold sm:text-lg">${realTemp}℉</p>
                        </li>
                    </ul>
                </div>`;

            weatherBox.innerHTML = weatherContents;

        })
}

// satellite API
function getMap(data) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 5);


    const endDate = new Date().toISOString();
    return fetch("http://api.agromonitoring.com/agro/1.0/image/search?start=" + startDate + "&end=" + endDate + "&polyid=" + data.id + "&appid=" + apiKey)
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {
            console.log("Sat Data:", data)
        })
        .catch(function (error) {
            console.log(error)
        })
}


// On page load, retrieve and display weather information for the last searched location
window.addEventListener('DOMContentLoaded', function () {
    const lastCoordinates = JSON.parse(localStorage.getItem('lastCoordinates'));
    const lastSearch = JSON.parse(localStorage.getItem('lastSearch'));

    if (lastCoordinates) {
        getWeather(lastCoordinates[0], lastCoordinates[1]);
    }

    // Wait for the element to be created, then update its content
    const observer = new MutationObserver(function () {
        const lastSearchLocation = document.querySelector(".weather-location");
        if (lastSearchLocation) {
            lastSearchLocation.textContent = lastSearch;
            observer.disconnect(); // Stop observing once the element is found and updated
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
});





