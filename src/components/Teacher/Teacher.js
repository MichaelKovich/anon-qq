import React, {Component} from 'react';
import socketIOClient from 'socket.io-client';

import './Teacher.css';

class Teacher extends Component {
  constructor(props) {
    super(props);
    this.state = {
      key: null,
      messages: [],
      numberOfStudents: 0
    };
    this.socket = socketIOClient(process.env.REACT_APP_HOST);
    this.socket.emit('generate key');
  }

  componentDidMount() {
    this.socket.on('get messages', messages => {
      this.setState({messages});
    });

    this.socket.on('delete message', messages => {
      this.setState({messages});
    });

    this.socket.on('generation response', key => {
      if (!this.state.key) {
        this.setState({key});
      }
    });

    this.socket.on('number of students', numberOfStudents => {
      this.setState({numberOfStudents});
    });
  }

  deleteHandler(id) {
    this.socket.emit('delete message', {id, key: this.state.key.classroomKey});
  }

  closeRoom = () => {
    const {key} = this.state;
    this.socket.emit('close room', key.classroomKey);
    this.props.history.push('/');
  };

  componentWillUnmount() {
    const {key} = this.state;
    key.classroomKey && this.socket.emit('close room', key.classroomKey);
  }

  render() {
    const {key, messages, numberOfStudents} = this.state;
    return (
      <div className="Teacher">
        <div className="Teacher__header">
          <div className="Teacher__code-text">
            <p>Your classroom code is: </p>
            <pre className="Teacher__code">{key && key.classroomKey}</pre>
          </div>
          <div className="Teacher__code-text">
            <p>Your mentor code is: </p>
            <pre className="Teacher__code">{key && key.mentorKey}</pre>
          </div>
          <div className="Teacher__number-text">
            <p>Number of students in room:</p>
            <pre className="Teacher__number-students">{numberOfStudents}</pre>
          </div>
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
