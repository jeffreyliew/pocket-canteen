import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import { getCanteensByCity, clearCanteen } from "../../actions/canteenActions";

import "./navbar.css";

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      city: "",
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onLogoutClick = this.onLogoutClick.bind(this);
  }

  componentDidUpdate(prevProps) {
    // update city input field after submit
    const { queryCity } = this.props.canteen;
    if (queryCity !== prevProps.canteen.queryCity) {
      this.setState({ city: queryCity === null ? "" : queryCity });
    }
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();

    const { city } = this.state;
    let cityUpperCase;

    // capitalize first letter
    if (city.length > 0) {
      cityUpperCase = city
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    }

    this.props.getCanteensByCity(city.length > 0 ? cityUpperCase : city);
    this.props.history.push(
      `/canteen${city.length > 0 ? `?city=${city.toLowerCase()}` : ""}`
    );
  }

  onLogoutClick(e) {
    e.preventDefault();
    this.props.clearCanteen();
    this.props.logoutUser();
  }

  render() {
    const { isAuthenticated } = this.props.auth;

    const authLinks = (
      <ul className="navbar-nav ml-auto">
        <li className="nav-item">
          <button
            type="button"
            onClick={this.onLogoutClick}
            className="btn nav-link"
          >
            <i className="fas fa-user-circle rounded-circle mr-1" />
            Logout
          </button>
        </li>
      </ul>
    );

    const guestLinks = (
      <ul className="navbar-nav ml-auto">
        <li className="nav-item">
          <Link className="nav-link" to="/register">
            Sign Up
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/login">
            Login
          </Link>
        </li>
      </ul>
    );

    return (
      <nav className="navbar sticky-top navbar-expand-sm navbar-dark bg-dark">
        <div className="container">
          <Link className="navbar-brand" to="/">
            Home
          </Link>

          {this.props.location.pathname !== "/" && (
            <form
              className="form-inline navbar__search"
              onSubmit={this.onSubmit}
            >
              <div className="input-group input-group-sm">
                <input
                  className="form-control border-secondary bg-dark text-white"
                  type="text"
                  placeholder="Enter your city, e.g. Berlin"
                  name="city"
                  value={this.state.city}
                  onChange={this.onChange}
                />
                <div className="input-group-append">
                  <button
                    type="submit"
                    className="btn btn-secondary btn-block px-2"
                  >
                    <i className="fas fa-search" />
                  </button>
                </div>
              </div>
            </form>
          )}

          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#mobile-nav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="mobile-nav">
            {isAuthenticated ? authLinks : guestLinks}
          </div>
        </div>
      </nav>
    );
  }
}

Navbar.propTypes = {
  getCanteensByCity: PropTypes.func.isRequired,
  logoutUser: PropTypes.func.isRequired,
  clearCanteen: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  canteen: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  canteen: state.canteen,
});

const mapDispatchToProps = {
  getCanteensByCity,
  logoutUser,
  clearCanteen,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Navbar));
