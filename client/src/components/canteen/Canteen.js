import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  getCanteenById,
  getDatesOfCurrentWeek,
  getFavouriteCanteens,
} from "../../actions/canteenActions";
import getCurrentWeek from "../../utils/getCurrentWeek";
import isEmpty from "../../validation/is-empty";

import Spinner from "../common/Spinner";
import CanteenItem from "../canteens/CanteenItem";

class Canteen extends Component {
  componentDidMount() {
    const { id } = this.props.match.params;

    this.props.getCanteenById(id);
    this.props.getDatesOfCurrentWeek(id, getCurrentWeek());

    if (this.props.auth.isAuthenticated) this.props.getFavouriteCanteens();
  }

  render() {
    const { loading, canteen } = this.props.canteen;
    const { id, name, week } = canteen;

    // get today's opening status
    let closedToday;
    let today;
    if (!isEmpty(week) && week.length === 5) {
      today = new Date(
        Date.now() - new Date().getTimezoneOffset() * 60000
      ).toISOString();

      const day = new Date();
      // check if saturday or sunday
      if (day.getDay() === 0 || day.getDay() === 6) {
        closedToday = true;
      } else {
        closedToday = week.filter((day) => today.indexOf(day.date) !== -1)[0]
          .closed;
      }
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
              <CanteenItem
                canteenData={canteen}
                headerStyles={"text-white bg-dark"}
              >
                {!isEmpty(week) && week.length === 5 && (
                  <div className="card-footer text-center">
                    <span
                      className={`font-weight-bold ${
                        closedToday ? "text-danger" : "text-success"
                      }`}
                    >
                      Today {closedToday ? "Closed" : "Open"}
                    </span>
                  </div>
                )}
              </CanteenItem>
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
                      className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${
                        today.indexOf(day.date) !== -1
                          ? "border border-info bg-info text-white"
                          : ""
                      } ${day.closed ? "disabled" : ""}`}
                    >
                      <div className="d-flex flex-column">
                        <span className="font-weight-bold">{day.day}</span>
                        <small className="font-italic">{day.date}</small>
                      </div>
                      <span
                        className={`badge badge-pill ${
                          day.closed ? "badge-danger" : "badge-success"
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
            <div className="col-md-6">
              <Link to="/canteen" className="btn btn-light mb-3 float-left">
                Back To Canteens
              </Link>
            </div>
            <div className="col-md-6" />
          </div>
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
  getDatesOfCurrentWeek,
  getCanteenById,
  getFavouriteCanteens,
};

export default connect(mapStateToProps, mapDispatchToProps)(Canteen);
