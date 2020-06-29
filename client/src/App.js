import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser, logoutUser } from "./actions/authActions";
import {
  clearFavouriteCanteens,
  clearFavouriteMeals,
} from "./actions/canteenActions";

import { Provider } from "react-redux";
import store from "./store";

import PrivateRoute from "./components/common/PrivateRoute";
import FavouriteCanteens from "./components/favourite/canteens/FavouriteCanteens";

import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import Footer from "./components/layout/Footer";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import Canteens from "./components/canteens/Canteens";
import Canteen from "./components/canteen/Canteen";
import Meals from "./components/meals/Meals";
import NotFound from "./components/not-found/NotFound";

import ContentWrapper from "./components/common/ContentWrapper";

import "./App.css";

// check for token
if (localStorage.jwtToken) {
  // set auth token to auth header
  setAuthToken(localStorage.jwtToken);
  // decode token and get user info and expiration
  const decoded = jwt_decode(localStorage.jwtToken);
  // set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));

  // check for expired token
  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    // logout user
    store.dispatch(logoutUser());
    store.dispatch(clearFavouriteCanteens());
    store.dispatch(clearFavouriteMeals());
    // redirect to login
    window.location.href = "/login";
  }
}

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <Navbar />
          <Switch>
            <Route exact path="/" component={Landing} />
            <Route>
              <ContentWrapper>
                <Switch>
                  <Route exact path="/register" component={Register} />
                  <Route exact path="/login" component={Login} />
                  <Route exact path="/canteen" component={Canteens} />
                  <Route path="/canteen/:id/meals" component={Meals} />
                  <Route path="/canteen/:id" component={Canteen} />
                  <PrivateRoute
                    path="/favourite-canteens"
                    component={FavouriteCanteens}
                  />
                  <Route path="*" component={NotFound} />
                </Switch>
              </ContentWrapper>
            </Route>
          </Switch>
          <Footer />
        </Router>
      </Provider>
    );
  }
}

export default App;
