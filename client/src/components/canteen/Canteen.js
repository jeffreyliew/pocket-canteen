import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  getCanteenById,
  getDatesOfCurrentWeek,
} from "../../actions/canteenActions";
import getCurrentWeek from "../../utils/getCurrentWeek";
import isEmpty from "../../validation/is-empty";

import Spinner from "../common/Spinner";

class Canteen extends Component {
  componentDidMount() {
    const { id } = this.props.match.params;

    this.props.getCanteenById(id);
    this.props.getDatesOfCurrentWeek(id, getCurrentWeek());
  }

  render() {
    const { loading, canteen } = this.props.canteen;
    const { id, name, city, address, week } = canteen;

    // get today's opening status
    let closed;
    if (!isEmpty(week) && week.length === 5) {
      const today = new Date().toISOString();
      closed = week.filter((day) => today.indexOf(day.date) !== -1)[0].closed;
    }

    let canteenContent;

    if (loading) {
      canteenContent = (
        <div className="row">
          <div className="col-md-12">
            <Spinner />
          </div>
        </div>
      );
    } else {
      canteenContent = (
        <>
          <div className="row">
            <div className="col-md-6 col-lg-4 mx-auto mb-3">
              <div className="card">
                <h5 className="card-header text-center text-white bg-dark">
                  {name}
                </h5>

                <div className="card-body bg-light">
                  <h6 className="card-title my-0">City</h6>
                  <p className="card-text">{city}</p>
                  <h6 className="card-title my-0">Address</h6>
                  <p className="card-text">{address}</p>
                </div>

                {!isEmpty(week) && week.length === 5 && (
                  <div className="card-footer text-center">
                    <span
                      className={`font-weight-bold ${
                        closed ? "text-danger" : "text-success"
                      }`}
                    >
                      Today {closed ? "Closed" : "Open"}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          {!isEmpty(week) && week.length === 5 && (
            <div className="row">
              <div className="col-md-6 col-lg-4 mx-auto mb-3">
                <div className="list-group">
                  {week.map((day) => (
                    <Link
                      to={`/canteen/${id}/meals?date=${day.date}`}
                      key={day.date}
                      className="list-group-item list-group-item-action d-flex justify-content-between align-items-center font-weight-bold"
                    >
                      {day.day}
                      <span
                        className={`badge badge-pill ${
                          closed ? "badge-danger" : "badge-success"
                        }`}
                      >
                        {day.closed ? "Closed" : "Open"}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      );
    }

    return (
      <div className="canteen">
        <div className="container">
          <div className="row">
            <div className="col-md-12 mb-3">
              <h1 className="display-4 text-center">Canteen</h1>
              <p className="lead text-center">
                Information about - <span className="font-italic">{name}</span>
              </p>
              <hr />
            </div>
          </div>
          {canteenContent}
        </div>
      </div>
    );
  }
}

Canteen.propTypes = {
  getDatesOfCurrentWeek: PropTypes.func.isRequired,
  getCanteenById: PropTypes.func.isRequired,
  canteen: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  canteen: state.canteen,
  errors: state.errors,
});

const mapDispatchToProps = {
  getDatesOfCurrentWeek,
  getCanteenById,
};

export default connect(mapStateToProps, mapDispatchToProps)(Canteen);
