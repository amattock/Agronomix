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
        displayModalContainer();
        return;
    }else{
        bgContainer.classList.add("height-change");
    }

});


// Display the modal box, it disappears when the background or close button is clicked
function displayModalContainer(){
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
