import {
  GET_CANTEENS,
  CANTEEN_LOADING,
  SET_QUERY_CITY,
  GET_CANTEEN,
  GET_DATES_OF_CURRENT_WEEK,
  GET_MEALS,
  GET_FAVOURITE_CANTEENS,
  CLEAR_FAVOURITE_CANTEEN,
} from "../actions/types";

const initialState = {
  loading: false,
  canteen: {},
  canteens: [],
  queryCity: "",
  favouriteCanteens: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case CANTEEN_LOADING:
      return {
        ...state,
        loading: true,
      };
    case GET_CANTEEN:
      return {
        ...state,
        loading: false,
        canteen: {
          ...state.canteen,
          ...action.payload,
        },
      };
    case GET_CANTEENS:
      return {
        ...state,
        canteens: action.payload,
        loading: false,
      };
    case SET_QUERY_CITY:
      return {
        ...state,
        queryCity: action.payload,
      };
    case GET_DATES_OF_CURRENT_WEEK:
      return {
        ...state,
        canteen: {
          ...state.canteen,
          week: action.payload,
        },
      };
    case GET_MEALS:
      return {
        ...state,
        canteen: {
          ...state.canteen,
          meals: action.payload,
        },
        loading: false,
      };
    case GET_FAVOURITE_CANTEENS:
      return {
        ...state,
        favouriteCanteens: action.payload,
      };
    case CLEAR_FAVOURITE_CANTEEN:
      return {
        ...state,
        favouriteCanteens: [],
      };
    default:
      return state;
  }
}
