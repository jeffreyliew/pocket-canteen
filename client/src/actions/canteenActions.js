import axios from "axios";

import {
  GET_CANTEENS,
  CANTEEN_LOADING,
  GET_ERRORS,
  SET_QUERY_CITY,
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
