import React, { Component } from "react";
import PropTypes from "prop-types";

class CanteenMap extends Component {
  constructor(props) {
    super(props);

    this.state = {
      location: {
        lat: 51.1657,
        long: 10.4515,
      },
      map: null,
      canteenLayerGroup: null,
    };
  }

  componentDidMount() {
    // get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;

        this.setState({
          location: {
            lat: latitude,
            long: longitude,
          },
        });
      });
    }

    // default map setup
    const { location } = this.state;
    const { L } = window;

    let map;
    let canteenMarkers;
    let canteenLayerGroup;

    // initialize map
    map = L.map("map").setView([location.lat, location.long], 6);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // create canteen markers
    canteenMarkers = this.props.canteens.map((canteen) => {
      const { id, name, coordinates } = canteen;

      return L.marker([coordinates.lat, coordinates.long]).bindPopup(
        `<a href="/canteen/${id}">${name}</a>`
      );
    });

    // create canteen layer group
    canteenLayerGroup = L.layerGroup([...canteenMarkers]);

    // set map and canteen layer group
    this.setState({
      map: map,
      canteenLayerGroup: canteenLayerGroup,
    });
  }

  componentDidUpdate(prevProps, prevState) {
    const { L } = window;
    const {
      map,
      canteenLayerGroup,
      location: { lat, long },
    } = this.state;

    // set location marker
    if (prevState.location.lat !== this.state.location.lat) {
      map.setView([lat, long], 12);
      L.marker([lat, long])
        .bindTooltip("Your location", { direction: "top", permanent: true })
        .addTo(map);
    }

    // update canteenLayerGroup
    if (prevProps.canteens !== this.props.canteens) {
      let canteenMarkers;
      let newCanteenLayerGroup;

      // clear current canteen layer group
      canteenLayerGroup.clearLayers();

      // create new canteen markers
      canteenMarkers = this.props.canteens.map((canteen) => {
        const { id, name, coordinates } = canteen;

        return L.marker([coordinates.lat, coordinates.long]).bindPopup(
          `<a href="/canteen/${id}">${name}</a>`
        );
      });

      // create new canteen layer group
      newCanteenLayerGroup = L.layerGroup([...canteenMarkers]);

      // set new canteen layer group
      this.setState({ canteenLayerGroup: newCanteenLayerGroup });
    }
  }

  render() {
    const { map } = this.state;

    if (map) {
      // add markers
      const { canteenLayerGroup } = this.state;

      canteenLayerGroup.addTo(map);
    }

    return (
      <div className="row">
        <div className="col-md-12">
          <div id="map" style={{ height: "70vh" }} />
        </div>
      </div>
    );
  }
}

CanteenMap.propTypes = {
  canteens: PropTypes.array.isRequired,
};

export default CanteenMap;
