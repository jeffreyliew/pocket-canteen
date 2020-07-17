import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import urlBase64ToUint8Array from "../utils/urlBase64ToUint8Array";
import jwt_decode from "jwt-decode";

import {
  GET_ERRORS,
  SET_CURRENT_USER,
  SET_PUSH_NOTIFICATION_MEALS,
  GET_MEAL_PUSH_SETTING,
  NOTIFICATION_SETTINGS_LOADING,
} from "./types";

const publicVapidKey =
  "BBPEXjsgF_aEVqVznVsAlfsOXhHhrHNAfgCJncMXg11JPwMLo3eOwMuZk08x8sNtu49KrGsWMwPV9fxthSlwdlE";
const convertedVapidKey = urlBase64ToUint8Array(publicVapidKey);

// subscribe to push notifications
export const subscribePushNotificationMeals = () => (dispatch) => {
  dispatch(setNotificationSettingsLoading());

  navigator.serviceWorker.ready.then((registration) => {
    if (!registration.pushManager) {
      alert("Push not supported");
      return;
    }

    registration.pushManager
      .subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidKey,
      })
      .then((subscription) =>
        axios.post("/api/users/push/subscribe", subscription).then((res) => {
          dispatch({
            type: SET_PUSH_NOTIFICATION_MEALS,
            payload: res.data,
          });
        })
      )
      .catch((err) => console.error(`Push subscription error: ${err}`));
  });
};

// unsubscribe push notifications
export const unsubscribePushNotificationMeals = () => (dispatch) => {
  dispatch(setNotificationSettingsLoading());

  navigator.serviceWorker.ready
    .then((registration) => {
      registration.pushManager.getSubscription().then((subscription) => {
        if (!subscription) {
          return;
        }

        subscription
          .unsubscribe()
          .then(() =>
            axios.delete("/api/users/push/unsubscribe").then((res) => {
              dispatch({
                type: SET_PUSH_NOTIFICATION_MEALS,
                payload: res.data,
              });
            })
          )
          .catch((err) => console.error(err));
      });
    })
    .catch((err) => console.error(err));
};

// get settings
export const getMealPushSetting = () => (dispatch) => {
  axios.get("/api/users/settings/push/meals").then((res) => {
    dispatch(setNotificationSettingsLoading());

    dispatch({
      type: GET_MEAL_PUSH_SETTING,
      payload: res.data,
    });
  });
};

// notification settings loading
export const setNotificationSettingsLoading = () => {
  return {
    type: NOTIFICATION_SETTINGS_LOADING,
  };
};

// register
export const registerUser = (userData, history) => (dispatch) => {
  axios
    .post("/api/users/register", userData)
    .then((res) => history.push("/login"))
    .catch((err) => dispatch({ type: GET_ERRORS, payload: err.response.data }));
};

// login
export const loginUser = (userData) => (dispatch) => {
  axios
    .post("/api/users/login", userData)
    .then((res) => {
      // save to localStorage
      const { token } = res.data;
      // set token to localstorage
      localStorage.setItem("jwtToken", token);
      // set auth token to auth header
      setAuthToken(token);
      // Decode token to get user data
      const decoded = jwt_decode(token);
      // Set current user
      dispatch(setCurrentUser(decoded));
    })
    .catch((err) => dispatch({ type: GET_ERRORS, payload: err.response.data }));
};

// set logged in user
export const setCurrentUser = (decoded) => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded,
  };
};

// logout user
export const logoutUser = () => (dispatch) => {
  // Remove token from localStorage
  localStorage.removeItem("jwtToken");
  // Remove auth token from auth header
  setAuthToken(false);
  // Set current user to {} which will set isAuthenticated to false
  dispatch(setCurrentUser({}));
};
