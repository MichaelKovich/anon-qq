import React, { Component } from "react";
import socketIOClient from "socket.io-client";

import "./Student.css";

class Student extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      code: "",
      disabled: true
    };
    this.socket = socketIOClient(process.env.REACT_APP_HOST);
  }

  componentDidMount() {
    this.socket.on("validation response", response => {
      this.setState({ disabled: !response });
    });
  }

  onCodeSubmitHandler = e => {
    e.preventDefault();
    if (this.state.code !== "") {
      this.socket.emit("verify code", e.target.value);
      this.setState({ code: "" });
    }
  };

  onSubmitHandler = e => {
    e.preventDefault();
    if (this.state.message !== "") {
      this.socket.emit("send message", this.state.message);
      this.setState({ message: "" });
    }
  };

  render() {
    let { message, disabled, code } = this.state;
    return (
      <div className="Student">
        <form onSubmit={this.onCodeSubmitHandler}>
          <input
            className="Student__input Student__input--code"
            onChange={e => this.setState({ code: e.target.value })}
            value={code}
            type="text"
            placeholder="Code"
          />
        </form>
        Enter your questions here:
        <form onSubmit={this.onSubmitHandler}>
          <input
            disabled={disabled}
            className="Student__input Student__input--question"
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
