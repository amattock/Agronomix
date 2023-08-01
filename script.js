

// var repoList = document.querySelector('ul');
// var fetchButton = document.getElementById('fetch-button');

// function getApi() {
//   // replace `octocat` with anyone else's GitHub username
//   var requestUrl = 'http://api.agromonitoring.com/agro/1.0/polygons/5abb9fb82c8897000bde3e87?appid=test';

//   fetch(requestUrl)
//     .then(function (response) {
//       return response.json();
//     })
//     .then(function (data) {
//       for (var i = 0; i < data.length; i++) {
//         var listItem = document.createElement('li');
//         listItem.textContent = data[i].html_url;
//         repoList.appendChild(listItem);
//       }
//     });
// }

// fetchButton.addEventListener('click', getApi);
 



// async function logPolys() {
    // const response = await fetch("http://api.agromonitoring.com/agro/1.0/polygons/5abb9fb82c8897000bde3e87?appid=test");
    // const polygons = await response.json();
    // console.log(polygons);
    // }
              

                       


// Global variables
let bgContainer = document.querySelector(".bg-container");
let searchInput = document.querySelector("#searchInput");
let searchBtn = document.querySelector("#searchBtn");
let modalContainer = document.querySelector("#modal");
let modalCloseBtn = document.querySelector("#modalClose");
let overlayEl = document.querySelector("#overlay");


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
  })

  function satelliteFunction(latitude, longitude) {
    console.log("latitude", latitude)
    console.log("longitude", longitude)
  }

// Alex's add - "Get list of Polys".
const apiKey = '5377301dcdca71537669d26ce2c115d4';
const apiUrl = 'https://api.agromonitoring.com/agro/1.0';

const getListOfPolygons = async () => {
 try {
   const response = await fetch(`${apiUrl}/polygons?appid=${apiKey}`);

   if (!response.ok) {
     throw new Error('Failed to fetch the list of polygons');
   }

   const data = await response.json();
   console.log('List of polygons:', data);
 } catch (error) {
   console.error('Error fetching the list of polygons:', error.message);
 }
};

getListOfPolygons();

