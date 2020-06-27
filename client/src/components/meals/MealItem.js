import React, { Component } from "react";

class MealItem extends Component {
  render() {
    const { meal } = this.props;

    // get food traffic light of the meal
    const color = { grün: "green", gelb: "yellow", rot: "red" };
    const colorKeys = Object.keys(color);
    const mealLight = colorKeys.find((color) =>
      meal.notes.find((note) => note.indexOf(color) !== -1)
    );

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
        <div className="flex-column">
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
      </div>
    );
  }
}

export default MealItem;
