import React, { Component } from "react";
import { BrowserRouter as Router } from "react-router-dom";

import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import Footer from "./components/layout/Footer";

import "./App.css";

class App extends Component {
  render() {
    return (
      <Router>
        <Navbar />
        <Landing />
        <Footer />
      </Router>
    );
  }
}

export default App;
