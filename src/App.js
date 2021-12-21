import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import PublicNavbar from "./components/PublicNavbar";
import { Col, Container, Row } from "react-bootstrap";
import Menu from "./components/Menu";
import WeatherInfo from "./components/WeatherInfo";
import { ClipLoader } from "react-spinners";

const cities = ["hanoi", "paris", "new york", "seoul"];
const API_KEY = process.env.REACT_APP_API_KEY;

const App = () => {
  const [loading, setLoading] = useState(false);
  const [selectedCity, setSelectedCity] = useState(null);
  const [weather, setWeather] = useState(null);
  const [apiError, setAPIError] = useState("");

  const getWeatherByCurrentLocation = async (lat, lon) => {
    try {
      let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
      const res = await fetch(url);
      const data = await res.json();

      setWeather(data);
      setLoading(false);
    } catch (err) {
      setAPIError(err.message);
      setLoading(false);
    }
  };

  const getUserLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      getWeatherByCurrentLocation(latitude, longitude);
    });
  };

  const getWeatherByCity = async () => {
    try {
      let url = `https://api.openweathermap.org/data/2.5/weather?q=${selectedCity}&appid=${API_KEY}`;
      const res = await fetch(url);
      const data = await res.json();

      setWeather(data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setAPIError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedCity == null) {
      setLoading(true);
      getUserLocation();
    } else {
      setLoading(true);
      getWeatherByCity();
    }
  }, [selectedCity]);

  const handleCityChange = (city) => {
    if (city === "current") {
      setSelectedCity(null);
    } else {
      setSelectedCity(city);
    }
  };

  return (
    <>
      <Container className="vh-100">
        {loading ? (
          <div className="w-100 vh-100 d-flex justify-content-center align-items-center">
            <ClipLoader color="#f86c6b" size={150} loading={loading} />
          </div>
        ) : !apiError ? (
          <div class="main-container">
            <WeatherInfo weather={weather} />
            <Menu
              cities={cities}
              handleCityChange={handleCityChange}
              selectedCity={selectedCity}
            />
          </div>
        ) : (
          apiError
        )}
      </Container>
    </>
  );
};
export default App;
