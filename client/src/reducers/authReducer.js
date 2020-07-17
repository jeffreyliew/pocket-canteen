import isEmpty from "../validation/is-empty";

import {
  SET_CURRENT_USER,
  SET_PUSH_NOTIFICATION_MEALS,
  GET_MEAL_PUSH_SETTING,
  NOTIFICATION_SETTINGS_LOADING,
} from "../actions/types";

const initialState = {
  isAuthenticated: false,
  user: {},
  notificationSettings: { loading: false, mealNotification: false },
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_CURRENT_USER:
      return {
        ...state,
        isAuthenticated: !isEmpty(action.payload),
        user: action.payload,
      };
    case NOTIFICATION_SETTINGS_LOADING:
      return {
        ...state,
        notificationSettings: {
          ...state.notificationSettings,
          loading: true,
        },
      };
    case SET_PUSH_NOTIFICATION_MEALS:
      return {
        ...state,
        notificationSettings: {
          ...state.notificationSettings,
          loading: false,
          ...action.payload,
        },
      };
    case GET_MEAL_PUSH_SETTING:
      return {
        ...state,
        notificationSettings: {
          ...state.notificationSettings,
          loading: false,
          ...action.payload,
        },
      };
    default:
      return state;
  }
}
