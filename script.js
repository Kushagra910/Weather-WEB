const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");
const handleError = document.querySelector("#error");

var sound1 = new Audio();
sound1.src = "assets/orient-string-138428.mp3";

var sound2 = new Audio();
sound2.src = "assets/mixkit-arcade-game-jump-coin-216.wav";

let currTab = userTab;
const API_KEY = "1427669c5af670ee726814c6d5e6a88d";
currTab.classList.add("current-tab");
getfromSessionStorage();

function switchTab(clickedTab){
  if(clickedTab!=currTab){
    currTab.classList.remove ("current-tab");
    currTab = clickedTab;
    currTab.classList.add("current-tab"); 
    if(!searchForm.classList.contains("active")){
      userInfoContainer.classList.remove("active");
      grantAccessContainer.classList.remove("active");
      searchForm.classList.add("active"); 
    }
    else{
      //searcForm me tha ab yourWeather tab visible karna hoga
      searchForm.classList.remove("active");
      userInfoContainer.classList.remove("active");
      // ab yourWeather tab pe aagye ,toh weather bhi display karna padega, so we check 
      // local storage first for coordinates,if we have saved them there
      getfromSessionStorage();
    }
  }
}

userTab.addEventListener("click",() => {
  //passed the clicked tab as input to switchfunction
   switchTab(userTab);
});

searchTab.addEventListener("click",() => {
  //passed the clicked tab as input to switchfunction
   switchTab(searchTab);
});

// check if coordinates are already present in session storage
function getfromSessionStorage(){
  const localCoordinates = sessionStorage.getItem("user-coordinates");
  if(!localCoordinates){
    //local coordinates nahi save hai to
    grantAccessContainer.classList.add("active");
  }
  else{
    const coordinates = JSON.parse(localCoordinates);
    //api function call
    fetchUserWeatherInfo(coordinates);
  }
}

 async function fetchUserWeatherInfo(coordinates){
    const {lat,lon} = coordinates;
    // make grant container invisible
    grantAccessContainer.classList.remove("active");
    //make loader visible
    loadingScreen.classList.add("active");
    //API call
    try{
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      if(!response.ok){
        throw new Error("Failed to fetch weather Data");
      }
      const data = await response.json();
      loadingScreen.classList.remove("active");
      userInfoContainer.classList.add("active");
      // render the data from userInfoContainer
      renderWeatherInfo(data);
    }
    catch(err){
      loadingScreen.classList.remove("active");
      // do yourself
      userInfoContainer.classList.remove("active");
      grantAccessContainer.classList.add("active");
      handleError.classList.add("visible");
      console.error(err);
    }
 }

 function renderWeatherInfo(weatherInfo){
  //firstly we have to fetch the element

  const cityName = document.querySelector("[data-cityName]");
  const countryIcon = document.querySelector("[data-countryIcon]");
  const desc = document.querySelector("[data-weatherDesc]");
  const weatherIcon = document.querySelector("[data-weatherIcon]");
  const temp = document.querySelector("[data-temp]");
  const windspeed = document.querySelector("[data-windspeed]");
  const humidity = document.querySelector("[data-humidity]");
  const cloudiness = document.querySelector("[data-cloudiness]");
  //fetch values from weather info-object and put in UI elements

  cityName.innerText = weatherInfo?.name;
  countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
  desc.innerText = weatherInfo?.weather?.[0]?.description;
  weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
  temp.innerText = `${weatherInfo?.main?.temp} °C`;
  windspeed.innerText = `${weatherInfo?.wind?.speed}m/s`;
  humidity.innerText = `${weatherInfo?.main?.humidity}%`;
  cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;
 }

 function getLocation() {
  if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
  }
  else {
      //HW - show an alert for no gelolocation support available
      alert("Geo Location Support Not Available");
  }
}
 function showPosition(position) {
  const userCoordinates = {
    lat: position.coords.latitude,
    lon: position.coords.longitude,
  }
  sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
  fetchUserWeatherInfo(userCoordinates);
 }
 const grantsAccessButton = document.querySelector("[data-grantAccess]");
 grantsAccessButton.addEventListener("click",getLocation);

 const searchInput = document.querySelector("[data-searchInput");
 searchForm.addEventListener("submit",(e)=>{
  e.preventDefault();
  let cityName = searchInput.value;
  if(cityName === "")
    return;
  else
    fetchSearchWeatherInfo(cityName);
 })


 async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");
    try{
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch weather data");
      }
      const data = await response.json();
      loadingScreen.classList.remove("active");
      handleError.classList.remove("visible");
      userInfoContainer.classList.add("active");
      renderWeatherInfo(data);
    }
    catch(err){
      //handle it
      loadingScreen.classList.remove("active");
      userInfoContainer.classList.remove("active");
      handleError.classList.add("visible");
      console.error(err);
    }
 }
