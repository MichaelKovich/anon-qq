import React, { Component } from "react";
import socketIOClient from "socket.io-client";

import "./Student.css";

class Student extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: ""
    };
    // this.socket = socketIOClient("http://192.168.1.154:3001/");
    this.socket = socketIOClient("http://172.31.99.112:3001/");
  }

  onSubmitHandler = e => {
    e.preventDefault();
    this.socket.emit("Message", this.state.message);
    this.setState({ message: "" });
  };

  render() {
    let { message } = this.state;
    return (
      <div className="Student">
        Enter your questions here:
        <form onSubmit={this.onSubmitHandler}>
          <input
            className="Student__input"
            onChange={e => this.setState({ message: e.target.value })}
            value={message}
            type="text"
            placeholder="Question"
          />
        </form>
      </div>
    );
  }
}

export default Student;
