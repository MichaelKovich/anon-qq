import React from 'react';
import {Link} from 'react-router-dom';
import './Home.css';

const Home = () => (
  <div className="Home">
    <Link to="/instructor" className="Home__link Home__link--teacher">
      Instructor
    </Link>
    <Link to="/student" className="Home__link Home__link--student">
      Students / Mentors
    </Link>
  </div>
);

export default Home;
