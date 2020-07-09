import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  addMealToFavourite,
  deleteFavouriteMeal,
} from "../../actions/canteenActions";

class MealItem extends Component {
  constructor(props) {
    super(props);

    this.onAddClick = this.onAddClick.bind(this);
    this.onDeleteClick = this.onDeleteClick.bind(this);
  }

  onAddClick() {
    const { _id } = this.props.canteen.canteen;
    const { id, category, name, notes, prices } = this.props.meal;

    const meal = {
      canteenId: _id,
      date: this.props.date,
      category,
      name,
      notes,
      prices,
    };
    this.props.addMealToFavourite(id, meal);
  }

  onDeleteClick() {
    this.props.deleteFavouriteMeal(this.props.meal.id);
  }

  render() {
    const { auth, meal } = this.props;

    // get food traffic light of the meal
    const color = { grün: "green", gelb: "yellow", rot: "red" };
    const colorKeys = Object.keys(color);
    const mealLight = colorKeys.find((color) =>
      meal.notes.find((note) => note.indexOf(color) !== -1)
    );

    // get meal ids of the favourite meals
    const mealIDs = this.props.canteen.favouriteMeals.map((meal) => meal.id);

    const buttonStyle = {
      position: "absolute",
      top: "0%",
      left: "100%",
      transform: "translateX(-100%)",
    };

    return (
      <div className="d-flex flex-row ml-4">
        <span
          className="rounded-circle ml-3"
          style={{
            position: "absolute",
            top: "50%",
            left: "0%",
            transform: "translateY(-50%)",
            width: "15px",
            height: "15px",
            backgroundColor: color[mealLight],
          }}
        />
        <div className="flex-column mr-3">
          <span className="font-weight-bold">{meal.name}</span>
          <p className="card-text">
            <small className="text-muted font-italic">
              {meal.notes.join(", ")}
            </small>
          </p>
          <span>
            {meal.prices.students ? "€ " + meal.prices.students + "/" : ""}
            {meal.prices.employees ? meal.prices.employees + "/" : ""}
            {meal.prices.others ? meal.prices.others + "*" : ""}
          </span>
        </div>
        {/* render add button only if meal not added yet */}
        {!mealIDs.includes(meal.id) ? (
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
      </div>
    );
  }
}

MealItem.propTypes = {
  addMealToFavourite: PropTypes.func.isRequired,
  deleteFavouriteMeal: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  canteen: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  canteen: state.canteen,
});

const mapDispatchToProps = {
  addMealToFavourite,
  deleteFavouriteMeal,
};

export default connect(mapStateToProps, mapDispatchToProps)(MealItem);
