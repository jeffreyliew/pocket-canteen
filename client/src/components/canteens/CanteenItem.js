import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  addCanteenToFavourite,
  deleteFavouriteCanteen,
} from "../../actions/canteenActions";

class CanteenItem extends Component {
  constructor(props) {
    super(props);

    this.onAddClick = this.onAddClick.bind(this);
    this.onDeleteClick = this.onDeleteClick.bind(this);
  }

  onAddClick() {
    this.props.addCanteenToFavourite(this.props.canteenData._id);
  }

  onDeleteClick() {
    this.props.deleteFavouriteCanteen(this.props.canteenData._id);
  }

  render() {
    const { auth, headerStyles } = this.props;

    const { _id, name, city, address } = this.props.canteenData;

    // get canteen ids of the favourite canteens
    const canteenIDs = this.props.canteen.favouriteCanteens.map(
      (canteen) => canteen.canteen._id
    );

    const buttonStyle = {
      position: "absolute",
      top: "0%",
      left: "100%",
      transform: "translateX(-100%)",
    };

    return (
      <div className="card mx-0 h-100">
        {/* render add button only if canteen not added yet */}
        {!canteenIDs.includes(_id) ? (
          <button
            type="button"
            className="btn btn-secondary py-0 px-2 border border-secondary rounded"
            disabled={auth.isAuthenticated ? false : true}
            style={buttonStyle}
            onClick={this.onAddClick}
          >
            <i className="fas fa-plus" />
          </button>
        ) : this.props.deleteBtn ? (
          <button
            type="button"
            className="bg-light border-0 p-0 text-danger rounded-circle"
            disabled={auth.isAuthenticated ? false : true}
            style={buttonStyle}
            onClick={this.onDeleteClick}
          >
            <i className="far fa-times-circle fa-2x" />
          </button>
        ) : (
          <div className="text-success" style={buttonStyle}>
            <i className="far fa-check-circle fa-2x" />
          </div>
        )}
        <h5
          className={`card-header pr-5 text-center ${
            headerStyles ? headerStyles : ""
          }`}
        >
          {name}
        </h5>

        <div className="card-body bg-light">
          <h6 className="card-title my-0">City</h6>
          <p className="card-text">{city}</p>
          <h6 className="card-title my-0">Address</h6>
          <p className="card-text">{address}</p>
        </div>
        {this.props.children}
      </div>
    );
  }
}

CanteenItem.propTypes = {
  addCanteenToFavourite: PropTypes.func.isRequired,
  deleteFavouriteCanteen: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  canteen: PropTypes.object.isRequired,
  canteenData: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  canteen: state.canteen,
});

const mapDispatchToProps = {
  addCanteenToFavourite,
  deleteFavouriteCanteen,
};

export default connect(mapStateToProps, mapDispatchToProps)(CanteenItem);
