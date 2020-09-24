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
import CanteenMap from "./CanteenMap";

class Canteens extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: "",
      hideMap: true,
    };

    this.onChange = this.onChange.bind(this);
    this.toggleMap = this.toggleMap.bind(this);
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

  toggleMap() {
    this.setState({ hideMap: !this.state.hideMap });
  }

  render() {
    const { loading, canteens } = this.props.canteen;
    const { hideMap } = this.state;
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
          {hideMap && (
            <div className="row">
              <div className="col-md-12">
                <h1 className="display-4 text-center">Canteens</h1>
                <p className="lead text-center">
                  Browse and discover new canteens
                </p>
                <hr />
              </div>
            </div>
          )}
          <div className="row">
            <div className="col-9 col-sm-10 col-lg-6 offset-lg-3 mr-lg-auto my-3">
              {hideMap && (
                <div className="input-group">
                  <input
                    type="search"
                    className="form-control"
                    placeholder="Search canteen"
                    name="search"
                    value={this.state.search}
                    onChange={this.onChange}
                  />
                </div>
              )}
            </div>
            <div className="col-3 col-sm-2 col-lg-1 my-3">
              <button
                type="button"
                className="btn btn-light w-100"
                onClick={this.toggleMap}
              >
                <i
                  className={`${
                    hideMap
                      ? "fas fa-map-marker-alt fa-lg"
                      : "fas fa-times fa-lg"
                  }`}
                />
              </button>
            </div>
          </div>
          {hideMap ? canteensContent : <CanteenMap canteens={canteens} />}
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
