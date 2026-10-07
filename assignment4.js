//define my API's
const GEO = 'https://geocoding-api.open-meteo.com/v1/search';
const WX  = 'https://api.open-meteo.com/v1/forecast';

//my parameters defined in html
const search_btn=document.querySelector('#searchform');
const status_el=document.querySelector('#status');
const city=document.querySelector('#city');
const temp_el=document.querySelector('#temp');
const wind_el=document.querySelector('#wind');
const forecast_el=document.querySelector('#forecast');

async function getJSON(url) {
  const response = await fetch(url); // calling the api 
  if (!response.ok) throw new Error(`HTTP ${response.status}`); // show me if the error is 4 (client) or 5 (server not working)
  return response.json();
}

async function loadWeather(city) {
  const q = new URLSearchParams({ name: city, count: 1 }); // so we dont write manually the url
  const geo = await getJSON(`${GEO}?${q}`); //get the data from the geo api
  if (!geo.results?.length) throw new Error('not-found');// so it doesnt do error if the client try to fetch a non existing data, it will go out

  const { latitude, longitude, name } = geo.results[0]; //destructure so we dont do data.current.temperature =>current.temperature
  const p = new URLSearchParams({ //get the data from the open weather by calling the api
    latitude, longitude, forecast_days: 3, // the parameters i want
    current: 'temperature_2m,wind_speed_10m',
    daily: 'temperature_2m_max,temperature_2m_min',
  });
  return { name, ...(await getJSON(`${WX}?${p}`)) }; //spread so it will put the first elements then the new element added in a new array 
}

function renderWeather(data) {
  const { current, daily } = data;//destructure
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
}