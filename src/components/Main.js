import React, { Component } from "react";
import Header from "./Header";
import City from "./City";
import "../MainStyle.css";

class Main extends Component {
  render() {
    return (
      <div className="MainPage">
        <Header />
        <City />
      </div>
    );
  }
}

export default Main;
