import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

class CanteenItem extends Component {
  render() {
    const { id, name, city, address } = this.props.canteen;

    return (
      <div className="col mb-4">
        <div className="card mx-0 h-100">
          <h5 className="card-header">{name}</h5>

          <div className="card-body bg-light">
            <h6 className="card-title my-0">City</h6>
            <p className="card-text">{city}</p>
            <h6 className="card-title my-0">Address</h6>
            <p className="card-text">{address}</p>
          </div>
          <Link to={`/canteen/${id}`} className="btn btn-info">
            View Canteen
          </Link>
        </div>
      </div>
    );
  }
}

CanteenItem.propTypes = {
  canteen: PropTypes.object.isRequired,
};

export default CanteenItem;
