var repoList = document.querySelector('ul');
var fetchButton = document.getElementById('fetch-button');

function getApi() {
  // replace `octocat` with anyone else's GitHub username
  var requestUrl = 'http://api.agromonitoring.com/agro/1.0/polygons/5abb9fb82c8897000bde3e87?appid=test';

  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      for (var i = 0; i < data.length; i++) {
        var listItem = document.createElement('li');
        listItem.textContent = data[i].html_url;
        repoList.appendChild(listItem);
      }
    });
}

fetchButton.addEventListener('click', getApi);




// async function logPolys() {
    // const response = await fetch("http://api.agromonitoring.com/agro/1.0/polygons/5abb9fb82c8897000bde3e87?appid=test");
    // const polygons = await response.json();
    // console.log(polygons);
  }             

                       