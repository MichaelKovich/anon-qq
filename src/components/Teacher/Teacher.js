import React, {Component} from 'react';
import socketIOClient from 'socket.io-client';

import './Teacher.css';

class Teacher extends Component {
  constructor(props) {
    super(props);
    this.state = {
      code: null,
      messages: [],
      numberOfStudents: 0
    };
    this.socket = socketIOClient(process.env.REACT_APP_HOST);
    this.socket.emit('generate code');
  }

  componentDidMount() {
    this.socket.on('get messages', messages => {
      this.setState({messages});
    });

    this.socket.on('delete message', messages => {
      this.setState({messages});
    });

    this.socket.on('generation response', code => {
      if (!this.state.code) {
        this.setState({code});
      }
    });

    this.socket.on('number of students', numberOfStudents => {
      this.setState({numberOfStudents});
    });
  }

  deleteHandler(id) {
    this.socket.emit('delete message', {id, key: this.state.code});
  }

  closeRoom = () => {
    const {code} = this.state;
    this.socket.emit('close room', code);
    this.props.history.push('/');
  };

  render() {
    const {code, messages, numberOfStudents} = this.state;
    return (
      <div className="Teacher">
        <div className="Teacher__header">
          Your classroom code is: <pre>{code}</pre>
          <p className="Teacher__number_students">
            Number of students in room: {numberOfStudents}
          </p>
          <button className="Teacher__exit" onClick={this.closeRoom}>
            Close Room
          </button>
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
