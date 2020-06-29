import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { addMealToFavourite } from "../../actions/canteenActions";

class MealItem extends Component {
  constructor(props) {
    super(props);

    this.onAddClick = this.onAddClick.bind(this);
  }

  onAddClick() {
    const { _id } = this.props.canteen.canteen;
    const { id, name, category, notes, prices } = this.props.meal;

    const meal = {
      canteenId: _id,
      category,
      name,
      notes,
      prices,
    };
    this.props.addMealToFavourite(id, meal);
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

    const addCanteenButtonStyle = {
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
            style={addCanteenButtonStyle}
            onClick={this.onAddClick}
          >
            <i className="fas fa-plus" />
          </button>
        ) : (
          <div className="text-success" style={addCanteenButtonStyle}>
            <i className="far fa-check-circle fa-2x" />
          </div>
        )}
      </div>
    );
  }
}

MealItem.propTypes = {
  addMealToFavourite: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  canteen: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  canteen: state.canteen,
});

const mapDispatchToProps = {
  addMealToFavourite,
};

export default connect(mapStateToProps, mapDispatchToProps)(MealItem);
