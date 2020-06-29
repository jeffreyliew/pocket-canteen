import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import isEmpty from "../../validation/is-empty";
import {
  getMeals,
  getCanteenById,
  getFavouriteMeals,
} from "../../actions/canteenActions";

import MealItem from "./MealItem";
import Spinner from "../common/Spinner";

class Meals extends Component {
  componentDidMount() {
    const { id } = this.props.match.params;
    const query = new URLSearchParams(this.props.location.search);

    this.props.getCanteenById(id);
    this.props.getMeals(id, query.get("date"));

    if (this.props.auth.isAuthenticated) {
      this.props.getFavouriteMeals();
    }
  }

  render() {
    const { canteen, loading } = this.props.canteen;
    const { id, name, meals } = canteen;

    const query = new URLSearchParams(this.props.location.search);

    let mealsContent;

    // sort meals by category
    let sortedMeals = {};
    if (meals) {
      meals.forEach((meal) => {
        const { category } = meal;
        // if category exists push meal
        if (Object.keys(sortedMeals).includes(category)) {
          sortedMeals[category].push(meal);
        } else {
          // create new category array
          sortedMeals = {
            ...sortedMeals,
            [category]: [],
          };

          // push meal to new category
          sortedMeals[category].push(meal);
        }
      });
    }

    if (loading) {
      mealsContent = (
        <div className="row">
          <div className="col-md-12">
            <Spinner />
          </div>
        </div>
      );
    } else {
      if (isEmpty(sortedMeals)) {
        mealsContent = (
          <div className="row">
            <div className="col-md-12">
              <h4 className="text-center my-3">No meals found...</h4>
            </div>
          </div>
        );
      } else {
        mealsContent = (
          <div className="row">
            <div className="col-md-12">
              <p className="text-center font-italic">
                <small>*prices = Students/Employees/Others</small>
              </p>
            </div>
            <div className="col-md-12">
              {Object.keys(sortedMeals).map((category, index) => (
                <div key={index} className="card">
                  <h5 className="card-header text-center text-white bg-dark">
                    {category}
                  </h5>
                  <div className="list-group list-group-flush">
                    {sortedMeals[category].map((meal) => {
                      return (
                        <div key={meal.id} className="list-group-item">
                          <MealItem meal={meal} date={query.get("date")} />
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      }
    }

    return (
      <div className="meals">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <Link
                to={`/canteen/${id}`}
                className="btn btn-light mb-3 float-left"
              >
                Back
              </Link>
            </div>
            <div className="col-md-6" />
          </div>
          <div className="row">
            <div className="col-md-12 mb-2">
              <h1 className="display-4 text-center">Meals</h1>
              <p className="lead text-center">{name}</p>
              <hr />
              <p className="text-center font-weight-bold font-italic">
                {new Date(query.get("date")).toDateString()}
              </p>
            </div>
          </div>
          {mealsContent}
        </div>
      </div>
    );
  }
}

Meals.propTypes = {
  getCanteenById: PropTypes.func.isRequired,
  getMeals: PropTypes.func.isRequired,
  getFavouriteMeals: PropTypes.func.isRequired,
  canteen: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  canteen: state.canteen,
  errors: state.errors,
});

const mapDispatchToProps = {
  getCanteenById,
  getMeals,
  getFavouriteMeals,
};

export default connect(mapStateToProps, mapDispatchToProps)(Meals);
