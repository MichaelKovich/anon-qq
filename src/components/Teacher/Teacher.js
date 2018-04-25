import React, {Component} from 'react';
import socketIOClient from 'socket.io-client';

import './Teacher.css';

class Teacher extends Component {
  constructor(props) {
    super(props);
    this.state = {
      code: null,
      messages: [],
    };
    this.socket = socketIOClient(process.env.REACT_APP_HOST);
    this.socket.emit('generate code');
  }

  componentDidMount() {
    this.socket.on('get messages', (messages) => {
      this.setState({messages});
    });

    this.socket.on('delete message', (messages) => {
      this.setState({messages});
    });

    this.socket.on('generation response', (code) => {
      if (!this.state.code) {
        this.setState({code});
      }
    });
  }

  deleteHandler(id) {
    this.socket.emit('delete message', {id, key: this.state.code});
  }

  render() {
    const {code, messages} = this.state;
    return (
      <div className="Teacher">
        <div>
          Your classroom code is: <pre>{code}</pre>
        </div>
        <div className="Teacher__room">
          {messages && messages[0] ? (
            messages.map(message => (
              <div
                className="Teacher__message"
                key={message.id}
                onClick={() => this.deleteHandler(message.id)}
              >
                {`${message.user}: ${message.message}`}
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
