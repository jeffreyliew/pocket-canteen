import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import {
  getCanteensByCity,
  getFavouriteCanteens,
} from "../../actions/canteenActions";

import Spinner from "../common/Spinner";
import CanteenItem from "./CanteenItem";

class Canteens extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: "",
    };

    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    const query = new URLSearchParams(this.props.location.search);
    let city;

    // capitalizes city query and displays it on navbar's input field
    if (query.get("city") !== null) {
      city = query
        .get("city")
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    } else {
      city = query.get("city");
    }

    this.props.getCanteensByCity(city);

    if (this.props.auth.isAuthenticated) this.props.getFavouriteCanteens();
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    const { loading, canteens } = this.props.canteen;
    let canteensContent;

    if (loading) {
      canteensContent = (
        <div className="row">
          <div className="col-md-12">
            <Spinner />
          </div>
        </div>
      );
    } else {
      if (canteens.length > 0) {
        canteensContent = (
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4">
            {canteens
              .filter(
                (canteen) =>
                  canteen.name
                    .toLowerCase()
                    .indexOf(this.state.search.toLowerCase()) !== -1
              )
              .map((canteen) => (
                <div className="col mb-4" key={canteen._id}>
                  <CanteenItem canteenData={canteen}>
                    <Link
                      to={`/canteen/${canteen.id}`}
                      className="btn btn-info"
                    >
                      View Canteen
                    </Link>
                  </CanteenItem>
                </div>
              ))}
          </div>
        );
      } else {
        canteensContent = (
          <div className="row">
            <div className="col-md-12">
              <h4 className="text-center my-3">No canteens found...</h4>
            </div>
          </div>
        );
      }
    }

    return (
      <div className="canteens">
        <div className="container">
          <div className="row">
            <div className="col-md-12 mb-3">
              <h1 className="display-4 text-center">Canteens</h1>
              <p className="lead text-center">
                Browse and discover new canteens
              </p>
              <hr />
              <div className="row">
                <div className="col-md-6 m-auto">
                  <div className="input-group my-3">
                    <input
                      type="search"
                      className="form-control"
                      placeholder="Search canteen"
                      name="search"
                      value={this.state.search}
                      onChange={this.onChange}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {canteensContent}
        </div>
      </div>
    );
  }
}

Canteens.propTypes = {
  getCanteensByCity: PropTypes.func.isRequired,
  getFavouriteCanteens: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  canteen: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  canteen: state.canteen,
  errors: state.errors,
});

const mapDispatchToProps = {
  getCanteensByCity,
  getFavouriteCanteens,
};

export default connect(mapStateToProps, mapDispatchToProps)(Canteens);
