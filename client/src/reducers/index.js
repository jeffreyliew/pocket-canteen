import { combineReducers } from "redux";
import authReducer from "./authReducer";
import canteenReducer from "./canteenReducer";
import errorReducer from "./errorReducer";

export default combineReducers({
  auth: authReducer,
  canteen: canteenReducer,
  errors: errorReducer,
});
