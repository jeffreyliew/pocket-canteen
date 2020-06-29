import axios from "axios";

import {
  GET_CANTEENS,
  CANTEEN_LOADING,
  GET_ERRORS,
  SET_QUERY_CITY,
  GET_CANTEEN,
  GET_DATES_OF_CURRENT_WEEK,
  GET_MEALS,
  GET_FAVOURITE_CANTEENS,
  CLEAR_FAVOURITE_CANTEEN,
} from "./types";

// get canteens by city
export const getCanteensByCity = (city) => (dispatch) => {
  dispatch(setCanteenLoading());
  axios
    .get(`/api/canteen?city=${city}`)
    .then((res) => {
      dispatch({
        type: GET_CANTEENS,
        payload: res.data,
      });
      dispatch(setCity(city));
    })
    .catch((err) =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      })
    );
};

// get canteen by id
export const getCanteenById = (id) => (dispatch) => {
  dispatch(setCanteenLoading());
  axios
    .get(`/api/canteen/${id}`)
    .then((res) => {
      dispatch({
        type: GET_CANTEEN,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      });
    });
};

// get dates of current week
export const getDatesOfCurrentWeek = (id, week) => (dispatch) => {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  let newWeek = [];
  let promises = [];

  for (let i = 0; i < week.length; i++) {
    promises.push(
      axios
        .get(`https://openmensa.org/api/v2/canteens/${id}/days/${week[i]}`)
        .then((res) => {
          newWeek.push({ ...res.data, day: days[i] });
        })
        .catch((err) => {
          return dispatch({
            type: GET_ERRORS,
            payload: err.response.data,
          });
        })
    );
  }

  Promise.all(promises).then(() => {
    newWeek.sort((a, b) => a.date.localeCompare(b.date));

    dispatch({
      type: GET_DATES_OF_CURRENT_WEEK,
      payload: newWeek,
    });
  });
};

// get meals
export const getMeals = (id, date) => (dispatch) => {
  dispatch(setCanteenLoading());
  axios
    .get(`https://openmensa.org/api/v2/canteens/${id}/days/${date}/meals`)
    .then((res) => {
      dispatch({
        type: GET_MEALS,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      });
    });
};

// get favourite canteens
export const getFavouriteCanteens = () => (dispatch) => {
  axios.get("/api/users/favourite/canteen").then((res) => {
    dispatch({
      type: GET_FAVOURITE_CANTEENS,
      payload: res.data,
    });
  });
};

// add canteen to favourite
export const addCanteenToFavourite = (id) => (dispatch) => {
  axios
    .post(`/api/users/favourite/canteen/${id}`)
    .then((res) => {
      dispatch({
        type: GET_FAVOURITE_CANTEENS,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      });
    });
};

// loading
export const setCanteenLoading = () => {
  return {
    type: CANTEEN_LOADING,
  };
};

// set city
export const setCity = (city) => {
  return { type: SET_QUERY_CITY, payload: city };
};

// clear canteen
export const clearFavouriteCanteen = () => {
  return {
    type: CLEAR_FAVOURITE_CANTEEN,
  };
};
