import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getCanteensByCity } from "../../actions/canteenActions";

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

    this.props.getCanteensByCity(query.get("city"));
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
                <CanteenItem key={canteen._id} canteen={canteen} />
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
  canteen: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  canteen: state.canteen,
  errors: state.errors,
});

const mapDispatchToProps = {
  getCanteensByCity,
};

export default connect(mapStateToProps, mapDispatchToProps)(Canteens);
