import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

class Landing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      city: "",
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();

    const { city } = this.state;

    this.props.history.push(
      `/canteen${city.length > 0 ? `?city=${city.toLowerCase()}` : ""}`
    );
  }

  render() {
    const { auth } = this.props;

    return (
      <div className="landing">
        <div className="dark-overlay landing-inner text-light">
          <div className="container">
            <div className="row">
              <div className="col-md-12 text-center">
                <h1 className="display-3 mb-4">Pocket Canteen</h1>
                <p className="lead">Find a canteen nearby</p>
                <hr />

                <form onSubmit={this.onSubmit}>
                  <div className="row">
                    <div className="col-md-6 mx-auto mb-2">
                      <div className="form-group">
                        <div className="input-group">
                          <input
                            type="text"
                            className="form-control form-control-lg"
                            placeholder="Enter your city, e.g. Berlin"
                            name="city"
                            value={this.state.city}
                            onChange={this.onChange}
                          />
                          <div className="input-group-append">
                            <button
                              type="submit"
                              className="btn btn-primary btn-block px-3"
                            >
                              <i className="fas fa-search" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>

                {!auth.isAuthenticated && (
                  <>
                    <Link className="btn btn-lg btn-info mr-2" to="/register">
                      Sign Up
                    </Link>
                    <Link className="btn btn-lg btn-light" to="/login">
                      Login
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Landing.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(Landing);
