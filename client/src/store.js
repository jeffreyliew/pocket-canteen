import { createStore } from "redux";
import rootReducer from "./reducers";
import middlewares from "./middlewares";

const initialState = {};

const store = createStore(rootReducer, initialState, middlewares);

export default store;
