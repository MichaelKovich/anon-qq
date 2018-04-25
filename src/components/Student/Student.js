import React, { Component } from "react";
import socketIOClient from "socket.io-client";

class Student extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: ""
    };
    this.socket = socketIOClient("http://localhost:3001/");
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
        <form onSubmit={this.onSubmitHandler}>
          <input
            className="Student__input"
            onChange={e => this.setState({ message: e.target.value })}
            value={message}
            type="text"
          />
        </form>
      </div>
    );
  }
}

export default Student;
