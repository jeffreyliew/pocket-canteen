import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getFavouriteMeals } from "../../../actions/canteenActions";

import MealItem from "../../meals/MealItem";
import Spinner from "../../common/Spinner";

class FavouriteMeals extends Component {
  componentDidMount() {
    this.props.getFavouriteMeals();
  }

  render() {
    const { favouriteMealsLoading, favouriteMeals } = this.props.canteen;

    let content;

    if (favouriteMealsLoading) {
      content = (
        <div className="row">
          <div className="col-md-12">
            <Spinner />
          </div>
        </div>
      );
    } else {
      if (favouriteMeals.length > 0) {
        content = (
          <div className="row">
            <div className="col-md-12">
              <p className="text-center font-italic">
                <small>*prices = Students/Employees/Others</small>
              </p>
            </div>
            <div className="col-md-12">
              {favouriteMeals.map((meal) => (
                <div key={meal.id} className="card mb-3">
                  <h5 className="card-header text-center text-white bg-dark">
                    {meal.canteen.name} - {meal.date}
                  </h5>

                  <div className="list-group list-group-flush">
                    <div className="list-group-item">
                      <MealItem meal={meal} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      } else {
        content = (
          <div className="row">
            <div className="col-md-12">
              <h4 className="text-center my-3">No meals added yet</h4>
            </div>
          </div>
        );
      }
    }

    return (
      <div className="favourite-meals">
        <div className="container">
          <div className="row">
            <div className="col-md-12 mb-3">
              <h1 className="display-4 text-center">Favourite Meals</h1>
              <hr />
            </div>
          </div>
          {content}
        </div>
      </div>
    );
  }
}

FavouriteMeals.propTypes = {
  getFavouriteMeals: PropTypes.func.isRequired,
  canteen: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  canteen: state.canteen,
});

const mapDispatchToProps = {
  getFavouriteMeals,
};

export default connect(mapStateToProps, mapDispatchToProps)(FavouriteMeals);
