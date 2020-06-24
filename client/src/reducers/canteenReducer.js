import {
  GET_CANTEENS,
  CANTEEN_LOADING,
  SET_QUERY_CITY,
} from "../actions/types";

const initialState = {
  canteens: [],
  loading: false,
  queryCity: "",
};

export default function (state = initialState, action) {
  switch (action.type) {
    case CANTEEN_LOADING:
      return {
        ...state,
        loading: true,
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
    default:
      return state;
  }
}
