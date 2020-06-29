import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { getFavouriteCanteens } from "../../../actions/canteenActions";

import CanteenItem from "../../canteens/CanteenItem";
import Spinner from "../../common/Spinner";

class FavouriteCanteens extends Component {
  componentDidMount() {
    this.props.getFavouriteCanteens();
  }

  render() {
    const { favouriteCanteensLoading, favouriteCanteens } = this.props.canteen;

    let content;

    if (favouriteCanteensLoading) {
      content = (
        <div className="row">
          <div className="col-md-12">
            <Spinner />
          </div>
        </div>
      );
    } else {
      if (favouriteCanteens.length > 0) {
        content = (
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4">
            {favouriteCanteens.map(({ canteen }) => (
              <div className="col mb-4" key={canteen._id}>
                <CanteenItem canteenData={canteen}>
                  <Link to={`/canteen/${canteen.id}`} className="btn btn-info">
                    View Canteen
                  </Link>
                </CanteenItem>
              </div>
            ))}
          </div>
        );
      } else {
        content = (
          <div className="row">
            <div className="col-md-12">
              <h4 className="text-center my-3">No canteens added yet</h4>
            </div>
          </div>
        );
      }
    }

    return (
      <div className="favourite-canteens">
        <div className="container">
          <div className="row">
            <div className="col-md-12 mb-3">
              <h1 className="display-4 text-center">Favourite Canteens</h1>
              <hr />
            </div>
          </div>
          {content}
        </div>
      </div>
    );
  }
}

FavouriteCanteens.propTypes = {
  getFavouriteCanteens: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  canteen: state.canteen,
});

const mapDispatchToProps = {
  getFavouriteCanteens,
};

export default connect(mapStateToProps, mapDispatchToProps)(FavouriteCanteens);
