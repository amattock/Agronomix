
// Global variables
let bgContainer = document.querySelector(".bg-container");
let searchInput = document.querySelector("#searchInput");
let searchBtn = document.querySelector("#searchBtn");
let modalContainer = document.querySelector("#modal");
let modalCloseBtn = document.querySelector("#modalClose");
let overlayEl = document.querySelector("#overlay");
let listsTable = document.querySelector(".lists-table");


// Recall relevant data based on the location searched
searchBtn.addEventListener("click", function(event){
    event.preventDefault();
    let searchValue = searchInput.value.trim();
    if(searchValue === ''){
        displayModalContainer("Location not found", "Please enter the required location information.");
        return;
    }else{
        bgContainer.classList.add("height-change");
    }

});


// Display the modal box, it disappears when the background or close button is clicked
function displayModalContainer(title, text){
    let modalTitle = document.getElementById("modal-title");
    let modalText = document.getElementById("modal-text");

    // It enables reuse
    modalTitle.textContent = title;
    modalText.textContent = text;

    modalContainer.style.display = "block";
}

overlayEl.addEventListener("click", function(event){
    if(event.target === overlayEl){
        modalContainer.style.display = "none";
    }
})

modalCloseBtn.addEventListener("click", function(){
    modalContainer.style.display = "none";

});
// "location IQ"
var key = "pk.5c29facfe59285e81d61594415350065"
var api = "https://us1.locationiq.com/v1/search.php?format=json&"


function getLatAndLong(search) {
    fetch(api + "key=" + key + "&q=" + search)
        .then(function (res) {
        return res.json()
        })
        .then(function (data) {
        console.log(data)
        var latitude = data[0].lat
        var longitude = data[0].lon
        satelliteFunction(latitude, longitude)
        })
}

searchBtn.addEventListener("click", function () {
    let search = document.getElementById('searchInput').value.trim();
    getLatAndLong(search)
});

function satelliteFunction(latitude, longitude) {
    console.log("latitude", latitude)
    console.log("longitude", longitude)
};

// "Get list of Polys".
const apiKey = '5377301dcdca71537669d26ce2c115d4';
const apiUrl = 'https://api.agromonitoring.com/agro/1.0';

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
        if (data.length !== 0){

            let tbody = document.createElement("tbody");
            let rows = "";

            data.forEach(lists => {
                let formattedDate = formatDate(lists.created_at);
                rows += `
                    <tr>
                        <td class="name">${lists.name}</td>
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


//   "Create Poly"
const polygonCoordinates = [
    [-87.6244212, 41.8755616],
];

const createPolygon = async () => {
    try {
    const response = await fetch(`${apiUrl}/polygons?appid=${apiKey}`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "name": 'Your Polygon Name',
            "geo_json": {
                "type": "Feature",
                "properties": {

                },
                "geometry": {
                "type": "Polygon",
                "coordinates": [polygonCoordinates],
                },
            },
        }),
    });

    if (!response.ok) {
        throw new Error('Failed to create the polygon');
    }

    const data = await response.json();
    console.log('Polygon created:', data);
    
    } catch (error) {
        console.error('Error creating the polygon:', error.message);
    }
};
createPolygon();





