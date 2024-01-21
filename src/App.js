import React from "react";
import "./App.scss";
import Header from "./components/Header";
import Home from "./components/home/home";

const App = () => {
  return (
    <div className="container-scroller ">
      <div className="container page-body-wrapper">
        <div className="main-panel ">
          <div className="content-wrapper">
            <Header />
            <Home />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
