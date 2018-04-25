import React, {Component} from 'react';
import socketIOClient from 'socket.io-client';
import axios from 'axios';

import './Teacher.css';

class Teacher extends Component {
  constructor(props) {
    super(props);
    this.state = {
      code: null,
      messages: [],
      // message: ""
    };
    this.socket = socketIOClient('http://192.168.1.154:3001/');
  }

  componentDidMount() {
    this.socket.on('Message', (message) => {
      // id:
      // text:
      const aggregatedMessages = [...this.state.messages, message];
      this.setState({messages: aggregatedMessages});
    });
  }

  deleteHandler(id) {
    axios
      .delete(`http://192.168.1.154:3001/messages/delete/${id}`)
      .then((response) => {
        this.setState({messages: response.data});
      })
      .catch(err => console.log(err));
  }

  render() {
    const {code, messages} = this.state;
    return (
      <div className="Teacher">
        The code is {code}.
        <div className="Teacher__room">
          {messages && messages[0] ? (
            messages.map(message => (
              <div
                className="Teacher__message"
                key={message.id}
                onClick={() => this.deleteHandler(message.id)}
              >
                {message.text}
              </div>
            ))
          ) : (
            <p className="Teacher__message--none">Waiting for student questions...</p>
          )}
        </div>
      </div>
    );
  }
}

export default Teacher;
