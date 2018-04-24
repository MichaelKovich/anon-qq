import React, { Component } from "react";
import socketIOClient from "socket.io-client";
import axios from "axios";

//import axios

class Teacher extends Component {
  state = {
    endpoint: "http://localhost:3001",
    code: null,
    messages: [],
    message: ""
  };

  //axios call to create key /keys/generate
  componentDidMount() {
    const { endpoint } = this.state;
    const socket = socketIOClient(endpoint);
    socket.on("Message", messages => this.setState({ messages }));
    // this.setState({code: 1234});
  }

  onSubmitHandler = e => {
    e.preventDefault();
    axios.post("/messages/send", { text: this.state.message });
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
              console.log(message);
              {
                /* return <p>{message}</p>; */
              }
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
