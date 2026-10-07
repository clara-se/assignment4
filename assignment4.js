//define my API's
const GEO = 'https://geocoding-api.open-meteo.com/v1/search';
const WX  = 'https://api.open-meteo.com/v1/forecast';

//add the icon sources :: searched that it is written that way
const WEATHER_CODES = {
  0:  ['Clear sky', '01d'],
  1:  ['Mainly clear', '02d'],
  2:  ['Partly cloudy', '03d'],
  3:  ['Overcast', '04d'],
  45: ['Fog', '50d'],
  48: ['Rime fog', '50d'],
  51: ['Light drizzle', '09d'],
  53: ['Drizzle', '09d'],
  55: ['Heavy drizzle', '09d'],
  56: ['Freezing drizzle', '09d'],
  57: ['Freezing drizzle', '09d'],
  61: ['Light rain', '10d'],
  63: ['Rain', '10d'],
  65: ['Heavy rain', '10d'],
  66: ['Freezing rain', '13d'],
  67: ['Freezing rain', '13d'],
  71: ['Light snow', '13d'],
  73: ['Snow', '13d'],
  75: ['Heavy snow', '13d'],
  77: ['Snow grains', '13d'],
  80: ['Light showers', '09d'],
  81: ['Showers', '09d'],
  82: ['Violent showers', '09d'],
  85: ['Snow showers', '13d'],
  86: ['Heavy snow showers', '13d'],
  95: ['Thunderstorm', '11d'],
  96: ['Thunderstorm with hail', '11d'],
  99: ['Thunderstorm with hail', '11d'],
};

//the code that we re gonna get we re gonna match it to the condition and put a backup if we fetch an unknown weather
function describe(code) {
  return WEATHER_CODES[code] ?? ['Unknown conditions', '03d'];
}

//my parameters defined in html
const search_btn=document.querySelector('#searchform');
const status_el=document.querySelector('#status');
const city=document.querySelector('#city');
const temp_el=document.querySelector('#temp');
const wind_el=document.querySelector('#wind');
const forecast_el=document.querySelector('#forecast');
//added new parameters
const icon_el       = document.querySelector('#icon');
const conditions_el = document.querySelector('#conditions');
const feels_el      = document.querySelector('#feels');
const humidity_el   = document.querySelector('#humidity');

async function getJSON(url) {
  const response = await fetch(url); // calling the api 
  if (!response.ok) throw new Error(`HTTP ${response.status}`); // show me if the error is 4 (client) or 5 (server not working)
  return response.json();
}

async function loadWeather(city) {
  const q = new URLSearchParams({ name: city, count: 1 }); // so we dont write manually the url
  const geo = await getJSON(`${GEO}?${q}`); //get the data from the geo api
  if (!geo.results?.length) throw new Error('not-found');// so it doesnt do error ad goes out if the client try to fetch a non existing data,we show him a message what he does wrong

  const { latitude, longitude, name } = geo.results[0]; //pulls the 3 fields out of the first geocoding result
  const p = new URLSearchParams({ //get the data from the open weather by calling the api
    latitude, longitude, forecast_days: 3, // the parameters i want
    //current: 'temperature_2m,wind_speed_10m',
    current: 'temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code', // now we take parameters other than temperature
    daily: 'temperature_2m_max,temperature_2m_min',
  });
  return { name, ...(await getJSON(`${WX}?${p}`)) }; //spread so it will put the first elements then the new element added in a new object
}

function renderWeather(data) {
  const { current, daily } = data;//destructure  so we dont do data.current.temperature =>current.temperature
  temp_el.textContent =
    `${Math.round(current.temperature_2m)}°C`; //bel element tem_el ecrit la valeur qui est dans current.temperature..
  wind_el.textContent =
    `Wind ${current.wind_speed_10m} km/h`; //same thing as temp_el but for wind

  forecast_el.replaceChildren( // replace childreen is to delete everything so we can re input
    ...daily.time.map((day, i) => { //spread but day1 day2 .. and then add the new element
      const card = document.createElement('li'); //create an element li in html in the unorder list
      card.textContent = `${day}: ${daily.temperature_2m_max[i]}°`; // in the li add the temp daily in it
      return card;
    })
  );
  //added where hes gonna fetch the code to put the matching weather using openweathermap api this time cz open meteo dont have icons
    const [text, iconName] = describe(current.weather_code);
    icon_el.src = `https://openweathermap.org/img/wn/${iconName}@2x.png`;
    icon_el.alt = text; // the text that match with my codes are my alt text in case the person cant see the icon
    conditions_el.textContent = text;
}

function setStatus(state, message = '') { // we need to state the status for the user so he knows whats going on with have" idle, loading, done and error"
  status_el.dataset.state = state;
  status_el.textContent = message;
  search_btn.disabled = state === 'loading';
}

function friendly(err) { //function in case we have an error , we will send a mesage to the user so he kknows what he did wrong 
  if (err.message === 'not-found') {
    return "City not found. Check the spelling and try again.";
  }
  return "Couldn't reach the weather service. Check your connection and try again.";
}

async function onSearch(e) {
  e.preventDefault();
  const city = input.value.trim();// we let the user input the city he wants
  setStatus('loading', `Loading ${city}…`); //now we show load
  try {
    const data = await loadWeather(city); // we try to fetsh the data of the city the user wants 
    renderWeather(data); //take the variables i want that i defined in renderweather
    setStatus('success');
  } catch (err) { // in case we coulldnt fetsh the data , we go to the function friendly that shows the user what he did wrong
    setStatus('error', friendly(err));
  }
}

form.addEventListener('submit', onSearch);// add a listener on the button search 
setStatus('idle', 'Search for a city');// what to show when the state is idle