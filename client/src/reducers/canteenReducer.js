import {
  GET_CANTEENS,
  CANTEEN_LOADING,
  SET_QUERY_CITY,
  GET_CANTEEN,
  GET_DATES_OF_CURRENT_WEEK,
  GET_MEALS,
  GET_FAVOURITE_CANTEENS,
  CLEAR_FAVOURITE_CANTEENS,
  GET_FAVOURITE_MEALS,
  CLEAR_FAVOURITE_MEALS,
  FAVOURITE_CANTEENS_LOADING,
} from "../actions/types";

const initialState = {
  loading: false,
  canteen: {},
  canteens: [],
  queryCity: "",
  favouriteCanteens: [],
  favouriteMeals: [],
  favouriteCanteensLoading: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case CANTEEN_LOADING:
      return {
        ...state,
        loading: true,
      };
    case FAVOURITE_CANTEENS_LOADING:
      return {
        ...state,
        favouriteCanteensLoading: true,
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
        favouriteCanteensLoading: false,
      };
    case GET_FAVOURITE_MEALS:
      return {
        ...state,
        favouriteMeals: action.payload,
      };
    case CLEAR_FAVOURITE_CANTEENS:
      return {
        ...state,
        favouriteCanteens: [],
      };
    case CLEAR_FAVOURITE_MEALS:
      return {
        ...state,
        favouriteMeals: [],
      };
    default:
      return state;
  }
}
