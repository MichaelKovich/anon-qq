import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  return (
    <div className="Home">
      <Link to="/teacher" className="Home__link Home__link--teacher">
        Teacher
      </Link>
      <Link to="/student" className="Home__link Home__link--student">
        Student
      </Link>
    </div>
  );
};

export default Home;
