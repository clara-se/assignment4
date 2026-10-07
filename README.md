# assignment4
# Weather Dashboard
We did an webpage where when u enter a city in the search bar, you get the live weather and a 3 day forecast in this city.
## Screenshot
<img width="958" height="503" alt="image" src="https://github.com/user-attachments/assets/091f5323-9c20-4570-b0c2-08a83fc3d00c" />

## Features
The features are: 1-searching an city by name 
                  2- you obtain current temperature, conditions, icon of the weather, feels-like, humidity and wind speed
                  3- you have a 3 day forecast
                  4- when the search is going on, u ca see a loading message so the user knows what status he's in
                  5-layout that adapts to desktop and mobile

## APIs used (no API key needed)
We use 3 open source API's where each one had a purpose:
- **Open-Meteo Geocoding API**: turns a city name into latitude and longitude
- **Open-Meteo Forecast API**: returns the weather for those coordinates
- **OpenWeatherMap icon images**: only the weather icon pictures, loaded from a public URL


in case API does need a key, put the key in a `.env` file (it is listed in `.gitignore`) and never commit it.
