import React, { Component } from "react";
import socketIOClient from "socket.io-client";

import "./Teacher.css";

class Teacher extends Component {
  constructor(props) {
    super(props);
    this.state = {
      code: null,
      messages: []
      // message: ""
    };
    this.socket = socketIOClient("http://localhost:3001/");
  }

  componentDidMount() {
    this.socket.on("Message", message => {
      //id:
      //text:
      const aggregatedMessages = [...this.state.messages, message];
      this.setState({ messages: aggregatedMessages });
    });
  }

  render() {
    let { code, messages, message } = this.state;
    return (
      <div className="Teacher">
        The code is {code}.
        <div className="Teacher__room">
          {messages[0] ? (
            messages.map(message => {
              return (
                <div className="Teacher__message" key={message.id}>
                  {message.text}
                </div>
              );
            })
          ) : (
            <p className="Teacher__message--none">
              Waiting for student questions...
            </p>
          )}
        </div>
      </div>
    );
  }
}

export default Teacher;
