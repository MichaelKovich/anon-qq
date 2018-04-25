import React, { Component } from "react";
import socketIOClient from "socket.io-client";
// import axios from "axios";

//import axios

class Teacher extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // endpoint: "http://172.31.99.112:3001/",
      code: null,
      messages: [],
      message: ""
    };
    this.socket = socketIOClient("http://192.168.1.152:3001");
  }

  // axios call to create key /keys/generate
  componentDidMount() {
    // const { endpoint } = this.state;
    this.socket.on("Message", messages => this.setState({ messages }));
    // this.setState({code: 1234});
  }

  onSubmitHandler = e => {
    e.preventDefault();
    this.socket.emit("Message", this.state.message);
    // axios.post("/messages/send", { text: this.state.message });
    this.setState({ message: "" });
  };

  render() {
    let { code, messages, message } = this.state;
    return (
      <div className="Teacher">
        The code is {code}.
        <form onSubmit={this.onSubmitHandler}>
          <input
            onChange={e => this.setState({ message: e.target.value })}
            value={message}
            type="text"
          />
        </form>
        <div className="Teacher__room">
          {messages[0] ? (
            messages.map(message => {
              return <p key={Math.random()}>{message.text}</p>;
            })
          ) : (
            <p>Not working or error or something.</p>
          )}
        </div>
      </div>
    );
  }
}

export default Teacher;
