import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {
  subscribePushNotificationMeals,
  unsubscribePushNotificationMeals,
  getMealPushSetting,
} from "../../../actions/authActions";

import Spinner from "../../common/Spinner";

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      setPushNotificationMeals:
        props.auth.notificationSettings.mealNotification,
    };

    this.onCheckPushNotificationMeals = this.onCheckPushNotificationMeals.bind(
      this
    );
  }

  componentDidMount() {
    this.props.getMealPushSetting();
  }

  componentDidUpdate(prevProps) {
    const { loading, mealNotification } = this.props.auth.notificationSettings;

    if (
      !loading &&
      prevProps.auth.notificationSettings.mealNotification !== mealNotification
    ) {
      this.setState({
        setPushNotificationMeals: mealNotification,
      });
    }
  }

  onCheckPushNotificationMeals() {
    this.setState(
      {
        setPushNotificationMeals: !this.state.setPushNotificationMeals,
      },
      () => {
        const {
          loading,
          mealNotification,
        } = this.props.auth.notificationSettings;
        const { setPushNotificationMeals } = this.state;

        if (!loading && !mealNotification && setPushNotificationMeals) {
          this.props.subscribePushNotificationMeals();
        } else if (!loading && mealNotification && !setPushNotificationMeals) {
          this.props.unsubscribePushNotificationMeals();
        }
      }
    );
  }

  render() {
    const { notificationSettings } = this.props.auth;

    return (
      <div className="settings">
        <div className="container">
          <div className="row">
            <div className="col-md-12 mb-3">
              <h1 className="display-4 text-center">Settings</h1>
              <hr />
            </div>
          </div>
          <div className="row position-relative">
            {notificationSettings.loading && (
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                }}
              >
                <Spinner />
              </div>
            )}

            <div className="col-md-12">
              <div
                className="custom-control custom-switch"
                style={notificationSettings.loading ? { opacity: 0.25 } : {}}
              >
                <input
                  type="checkbox"
                  className="custom-control-input"
                  id="pushNotificationMeals"
                  name="pushNotificationMeals"
                  value={this.state.setPushNotificationMeals}
                  checked={this.state.setPushNotificationMeals}
                  onChange={this.onCheckPushNotificationMeals}
                  disabled={notificationSettings.loading ? true : false}
                />
                <label
                  className="custom-control-label"
                  htmlFor="pushNotificationMeals"
                >
                  Receive push notifications if favourite meals are available
                  today
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Settings.propTypes = {
  getMealPushSetting: PropTypes.func.isRequired,
  subscribePushNotificationMeals: PropTypes.func.isRequired,
  unsubscribePushNotificationMeals: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

const mapDispatchToProps = {
  getMealPushSetting,
  subscribePushNotificationMeals,
  unsubscribePushNotificationMeals,
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
