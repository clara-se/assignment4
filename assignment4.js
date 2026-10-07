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


