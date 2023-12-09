import axios from 'axios';
import React, { useEffect, useState } from 'react'
import BarChart from '../components/BarChart';
import { clearLocalStorage } from '../utils/setLocalStorage';
import { useDispatch } from 'react-redux';
import { logoutRequest, logoutSuccess } from '../redux/actions';

const Home = () => {
  const dispatch = useDispatch()
  const [contries, setContries] = useState([])
  const [states, setStates] = useState([])
  const [cities, setCities] = useState([])
  const [forecast, setForecast] = useState([])
  const [countryCodeForCities, setCountryCodeForCities] = useState("");
  const [cityDetails, setCityDetails] = useState({
    countryCode: "",
    stateCode: "",
    cityName: ""
  });
  const [weatherDetails, setWeatherDetails] = useState({
    temp: "",
    weather: "",
    wind: "",
    coord: "",
    sun: "",
    locationName: ""
  });

  const myCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(success)
    function success(pos) {
      const crd = pos.coords;
      // console.log('Your current position is:');
      // console.log(`Latitude : ${crd.latitude}`);
      // console.log(`Longitude: ${crd.longitude}`);
      // console.log(`More or less ${crd.accuracy} meters.`);
      getWeatherByCoOrdinates(crd.latitude, crd.longitude)
      getForcastWeather(crd.latitude, crd.longitude)
    }

  }

  const fetchCountries = async () => {
    try {
      let res = await axios.get("https://api.countrystatecity.in/v1/countries", {
        headers: {
          'X-CSCAPI-KEY': process.env.REACT_APP_COUNTRY_KEY
        }
      })
      setContries(res.data)
    } catch (error) {
      console.log('error: ', error);
    }
  }

  const fetchStateByCountry = async (countryCode) => {
    setCountryCodeForCities(countryCode)
    try {
      let res = await axios.get(`https://api.countrystatecity.in/v1/countries/${countryCode}/states`, {
        headers: {
          'X-CSCAPI-KEY': process.env.REACT_APP_COUNTRY_KEY
        }
      })
      setStates(res.data)
    } catch (error) {
      console.log('error: ', error);
    }
  }

  const fetchCityByState = async (stateCode) => {
    try {
      let res = await axios.get(`https://api.countrystatecity.in/v1/countries/${countryCodeForCities}/states/${stateCode}/cities`, {
        headers: {
          'X-CSCAPI-KEY': process.env.REACT_APP_COUNTRY_KEY
        }
      })
      setCities(res.data)
    } catch (error) {
      console.log('error: ', error);
    }
  }

  const convertUnixTimestampToDateString = (timestamp) => {
    // Convert the timestamp to milliseconds (required by the Date constructor)
    const timestampInMilliseconds = timestamp * 1000;

    // Create a new Date object using the timestamp
    const date = new Date(timestampInMilliseconds);

    // Get the components of the date (year, month, day, hours, minutes, seconds)
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    // Construct the formatted date string
    const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    return formattedDate;
  }

  const handleLogout = () => {
    dispatch(logoutRequest());
    clearLocalStorage("user");
    dispatch(logoutSuccess());
  }

  useEffect(() => {
    myCurrentLocation();
    fetchCountries();
  }, [])

  let id;
  const handleCountryChange = (event) => {
    const contryCode = event.target.value;
    if (id) {
      // console.log('id: ', id);
      clearTimeout(id)
    }
    id = setTimeout(() => {
      setCityDetails(prev => ({ ...prev, countryCode: contryCode }))
      fetchStateByCountry(contryCode);
    }, 500);

  }

  const handleStateChange = (event) => {
    const stateCode = event.target.value;
    if (id) {
      // console.log('id: ', id);
      clearTimeout(id)
    }
    id = setTimeout(() => {
      setCityDetails(prev => ({ ...prev, stateCode: stateCode }))
      fetchCityByState(stateCode)
    }, 500);

  }

  const handleCityChange = (event) => {
    const cityCode = event.target.value;
    setCityDetails(prev => ({ ...prev, cityName: cityCode }))
  }

  const handleSubmit = () => {
    // console.log('cityDetails: ', cityDetails);
    getWeatherByCityName(cityDetails)
  }

  const getForcastWeather = async (latitude, longitude) => {
    try {
      // let res = await axios(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=83962d0d72f2c41f4baf02103bca32b8&units=metric`) // openweather api 
      let res = await axios(`https://api.weatherapi.com/v1/forecast.json?key=9ac5a1b2d6e449148bd123841230712&q=${latitude},${longitude}&days=7&aqi=no&alerts=no`) // openweather api 
      // console.log('res.data: ', res.data.forecast);
      // console.log('res.data: ', res.data.forecast.forecastday);

      setForecast(res.data.forecast.forecastday.map((item, i) => item.day.avgtemp_c))
    }
    catch (error) {
      console.log('error: ', error);
    }
  }

  const getWeatherByCoOrdinates = async (latitude, longitude) => {
    try {
      let res = await axios(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=83962d0d72f2c41f4baf02103bca32b8&units=metric`)
      // console.log('res: ', res);
      setWeatherDetails(prev => (
        {
          ...prev,
          temp: res.data.main,
          weather: res.data.weather[0],
          wind: res.data.wind,
          coord: res.data.coord,
          sun: res.data.sys,
          locationName: res.data.name
        }
      ))
    }
    catch (error) {
      console.log('error: ', error);
    }
  }

  const getWeatherByCityName = async ({ cityName, stateCode, countryCode }) => {
    if (cityName === "" || stateCode === "" || countryCode === "") {
      return alert("Please select Country , State and City")
    }
    try {
      let res = await axios(`https://api.openweathermap.org/data/2.5/weather?q=${cityName},${stateCode},${countryCode}&appid=83962d0d72f2c41f4baf02103bca32b8&units=metric`)
      // console.log('getWeatherByCityName res: ', res.data);
      setWeatherDetails(prev => (
        {
          ...prev,
          temp: res.data.main,
          weather: res.data.weather[0],
          wind: res.data.wind,
          coord: res.data.coord,
          sun: res.data.sys,
          locationName: res.data.name
        }
      ))
      getForcastWeather(res.data.coord.lat, res.data.coord.lon)
    }
    catch (error) {
      console.log('error: ', error);
    }
  }

  // console.log('weatherDetails: ', weatherDetails);
  // console.log('forecast: ', forecast);

  return (
    <>
      <div className="px-4 mt-4 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 relative">
        <div className="px-4 absolute right-0 top-1">
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
        <h5 className="mb-6 text-3xl font-bold text-center text-teal-500 py-1 ">
          Weather App
        </h5>
        <div className="flex flex-col mt-[35px] shadow-md py-8 px-4">
          <div className="flex flex-col lg:flex-row gap-5 shadow-md pb-5 px-2 justify-end items-center">
            <select onChange={handleCountryChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 
                    text-sm rounded-lg focus:ring-blue-500
                   focus:border-blue-500 block w-full p-2.5
                   dark:bg-gray-700 dark:border-gray-600
                   dark:placeholder-gray-400 dark:text-white
                   dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              <option value="">Choose a country</option>
              {
                contries.length > 0 && contries.map((item, i) => (
                  <option key={item.id} value={item.iso2}>{item.name}</option>
                ))
              }
            </select>
            <select onChange={handleStateChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
              <option value="">Choose a State</option>
              {
                contries.length > 0 && states.map((item, i) => (
                  <option key={item.id} value={item.iso2}>{item.name}</option>
                ))
              }
            </select>
            <select onChange={handleCityChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
              <option value="">Choose a City</option>
              {
                contries.length > 0 && cities.map((item, i) => (
                  <option key={item.id} value={item.iso2}>{item.name}</option>
                ))
              }
            </select>
            <button
              onClick={handleSubmit}
              className="w-1/4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Submit
            </button>
          </div>
          <div className="flex flex-col lg:flex-row mt-[35px] py-8 px-4 gap-6">
            <div className=" flex-1 flex flex-col items-center gap-8">
              <h5 className="text-2xl font-extrabold leading-none">
                You Location on Map
              </h5>
              <div className="w-full h-96">
                <iframe
                  src={`https://maps.google.com/maps?q=${weatherDetails.locationName}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                  className="w-full h-full"
                  loading="lazy"
                  title='map'
                ></iframe>
              </div>
            </div>
            <div className="flex-1 flex flex-col items-center gap-8">
              <h5 className="text-2xl font-extrabold leading-none">
                Weather Details
              </h5>
              <div className=" grid gap-5 row-gap-5 sm:grid-cols-2">
                <div className="max-w-md">
                  <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-indigo-50">
                    <svg
                      className="w-12 h-12 text-deep-purple-accent-400"
                      stroke="currentColor"
                      viewBox="0 0 52 52"
                    >
                      <polygon
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                        points="29 13 14 29 25 29 23 39 38 23 27 23"
                      />
                    </svg>
                  </div>
                  <h6 className="mb-2 font-semibold leading-5">Temperature</h6>
                  <p className="text-sm text-gray-700 flex flex-col">
                    <span>Temp: {weatherDetails.temp.temp} °C</span>
                    <span>Humidity: {weatherDetails.temp.humidity} °C</span>
                    <span>Maximum Temp: {weatherDetails.temp.temp_max} °C</span>
                    <span>Minimum Temp: {weatherDetails.temp.temp_min} °C</span>
                  </p>
                </div>
                <div className="max-w-md">
                  <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-indigo-50">
                    <svg
                      className="w-12 h-12 text-deep-purple-accent-400"
                      stroke="currentColor"
                      viewBox="0 0 52 52"
                    >
                      <polygon
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                        points="29 13 14 29 25 29 23 39 38 23 27 23"
                      />
                    </svg>
                  </div>
                  <h6 className="mb-2 font-semibold leading-5">Weather</h6>
                  <p className="text-sm text-gray-700 flex flex-col">
                    <span>Overall: {weatherDetails.weather.main}</span>
                    <span>Description : {weatherDetails.weather.description}</span>
                  </p>
                </div>
                <div className="max-w-md">
                  <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-indigo-50">
                    <svg
                      className="w-12 h-12 text-deep-purple-accent-400"
                      stroke="currentColor"
                      viewBox="0 0 52 52"
                    >
                      <polygon
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                        points="29 13 14 29 25 29 23 39 38 23 27 23"
                      />
                    </svg>
                  </div>
                  <h6 className="mb-2 font-semibold leading-5">Wind</h6>
                  <p className="text-sm text-gray-700 flex flex-col">
                    <span>Speed: {weatherDetails.wind.speed}/mph</span>
                    <span>Degree: {weatherDetails.wind.deg}</span>
                  </p>
                </div>
                <div className="max-w-md">
                  <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-indigo-50">
                    <svg
                      className="w-12 h-12 text-deep-purple-accent-400"
                      stroke="currentColor"
                      viewBox="0 0 52 52"
                    >
                      <polygon
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                        points="29 13 14 29 25 29 23 39 38 23 27 23"
                      />
                    </svg>
                  </div>
                  <h6 className="mb-2 font-semibold leading-5">Sun</h6>
                  <div className="text-sm text-gray-700 flex flex-col">
                    <span>Sunrise {convertUnixTimestampToDateString(weatherDetails.sun.sunrise)}</span>
                    <span>Sunset {convertUnixTimestampToDateString(weatherDetails.sun.sunset)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className=" flex flex-col items-center justify-center ">
            <h5 className="mt-6 text-2xl font-bold text-center text-violet-700 py-1 underline ">
              Forcast Data of next 7 Days
            </h5>
            <BarChart data={forecast} />
          </div>
        </div>

      </div>

    </>
  );
};

export default Home