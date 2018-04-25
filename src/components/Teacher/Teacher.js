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
    };
    this.socket = socketIOClient(process.env.REACT_APP_HOST);
  }

  componentDidMount() {
    this.socket.on('get messages', (messages) => {
      this.setState({messages});
    });

    this.socket.on('delete message', (messages) => {
      this.setState({messages});
    });

    axios
      .get('http://localhost:3001/keys/generate')
      .then((response) => {
        console.log(response);
        this.setState({code: response.data.key});
      })
      .catch(err => console.log(err));
  }

  deleteHandler(id) {
    this.socket.emit('delete message', id);
  }

  render() {
    const {code, messages} = this.state;
    return (
      <div className="Teacher">
        <div>
          Your classroom code is: <p>{code}</p>
        </div>
        <div className="Teacher__room">
          {messages && messages[0] ? (
            messages.map(message => (
              <div
                className="Teacher__message"
                key={message.id}
                onClick={() => this.deleteHandler(message.id)}
              >
                {message.message}
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
