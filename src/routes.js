import React from "react";
import { Switch, Route } from "react-router-dom";

import Home from "./components/Home/Home";
import Teacher from "./components/Teacher/Teacher";
import Student from "./components/Student/Student";

export default (
  <div className="container">
    <Switch>
      <Route path="/" exact component={Home} />
      <Route path="/teacher" component={Teacher} />
      <Route path="/student" component={Student} />
    </Switch>
  </div>
);
