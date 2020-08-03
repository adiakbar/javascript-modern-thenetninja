const key = 'cAXZRHAJCcFb4vn1EmLWn5oPR6tqmGXc';

const getCity = async (city) => {
  const base = 'http://dataservice.accuweather.com/locations/v1/cities/search';
  const query = `?apikey=${key}&q=${city}`;

  const response = await fetch(base + query);
  const data = await response.json();

  return data[0];
}

const getWeather = async (id) => {
  const base = 'http://dataservice.accuweather.com/currentconditions/v1/';
  const query = `${id}?apikey=${key}`;

  const response = await fetch(base + query);
  const data = await response.json();

  return data[0];
}

const cityForm = document.querySelector('.change-location');
const card = document.querySelector('.card');
const details = document.querySelector('.details');
const time = document.querySelector('img.time');
const icon = document.querySelector('.icon img');

// menggunakan async await karena function getCity dan getWeater
const updateCity = async (city) => {
  const cityData = await getCity(city);
  const weatherData = await getWeather(cityData.Key);

  return {
    cityData, weatherData
  }
}

const updateUI = (data) => {

  const {cityData, weatherData} = data
  
  details.innerHTML = `
    <h5 class="my-5">${cityData.EnglishName}</h5>
    <div class="my-3">${weatherData.WeatherText}</div>
    <div class="display-4 my-4">
      <span>${weatherData.Temperature.Metric.Value}</span>
      <span>&deg;C</span>
    </div>
  `;

  const iconSrc = `img/icons/${weatherData.WeatherIcon}.svg`;
  icon.setAttribute('src', iconSrc);

  let timeSrc = weatherData.IsDayTime ? 'img/day.svg' : 'img/night.svg';

  time.setAttribute('src', timeSrc);

  if(card.classList.contains('d-none')) {
    card.classList.remove('d-none');
  }
}

cityForm.addEventListener('submit',async e => {
  e.preventDefault();

  const city = cityForm.city.value.trim();
  cityForm.reset();

  const data = await updateCity(city);

  updateUI(data);
})

/* Tanpa menggunakan async await
getCity('manchester')
  .then(data => {
    // console.log(data);
    return getWeather(data.Key);
  })
  .then(data => {
    console.log(data);
  })
  .catch(err => {
    console.log(err);
  })
*/