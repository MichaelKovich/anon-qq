import React, {Component} from 'react';
import socketIOClient from 'socket.io-client';

import './Student.css';

class Student extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      classroomKey: '',
      mentorKey: '',
      disabled: true,
      firstName: '',
      lastName: '',
      messages: [],
      invalidClassroomKey: false,
      invalidMentorKey: false
    };
    this.socket = socketIOClient(process.env.REACT_APP_HOST);
  }

  componentDidMount() {
    this.socket.on('delete message', messages => {
      this.setState({messages});
    });

    this.socket.on('get messages', messages => {
      this.setState({messages});
    });
  }

  onCodeSubmitHandler = e => {
    e.preventDefault();
    let {classroomKey, mentorKey, firstName, lastName} = this.state;
    if (classroomKey && firstName && lastName) {
      this.socket.emit('verify key', {classroomKey, mentorKey});
      this.socket.on('validation response', keyRing => {
        let {classroomKeyResponse, mentorKeyResponse} = keyRing;
        this.setState({
          disabled: !(classroomKeyResponse && mentorKeyResponse),
          invalidClassroomKey: !classroomKeyResponse,
          invalidMentorKey: mentorKey !== '' && !mentorKeyResponse
        });
      });
    }
  };

  onSubmitHandler = e => {
    e.preventDefault();
    let {message, firstName, lastName, classroomKey} = this.state;
    if (message) {
      this.socket.emit('send message', {
        user: `${firstName} ${lastName}`,
        message,
        classroomKey
      });
      this.setState({message: ''});
    }
  };

  render() {
    let {
      message,
      disabled,
      classroomKey,
      mentorKey,
      messages,
      firstName,
      lastName,
      invalidClassroomKey,
      invalidMentorKey
    } = this.state;

    return (
      <div className="Student">
        {disabled && (
          <form onSubmit={this.onCodeSubmitHandler}>
            <input
              autoFocus
              className="Student__input"
              onChange={e => this.setState({classroomKey: e.target.value})}
              value={classroomKey}
              type="text"
              required
              placeholder="Classroom Code"
              style={{
                fontFamily: "'Courier New', Courier, monospace",
                border: invalidClassroomKey
                  ? '1px solid #ff7675'
                  : '1px solid #ccc;'
              }}
            />
            <input
              className="Student__input"
              onChange={e => this.setState({mentorKey: e.target.value})}
              value={mentorKey}
              type="text"
              placeholder="Mentor Code"
              style={{
                fontFamily: "'Courier New', Courier, monospace",
                border: invalidMentorKey
                  ? '1px solid #ff7675'
                  : '1px solid #ccc;'
              }}
            />
            <input
              className="Student__input Student__input--firstname"
              onChange={e => this.setState({firstName: e.target.value})}
              value={firstName}
              type="text"
              required
              placeholder="First Name"
            />
            <input
              className="Student__input Student__input--lastname"
              onChange={e => this.setState({lastName: e.target.value})}
              value={lastName}
              type="text"
              required
              placeholder="Last Name"
            />

            <button
              style={{
                display: 'none'
              }}
            />
          </form>
        )}
        Enter your questions here:
        <form onSubmit={this.onSubmitHandler}>
          <input
            disabled={disabled}
            className="Student__input Student__input--question"
            onChange={e => this.setState({message: e.target.value})}
            value={message}
            type="text"
            required
            placeholder="Question"
          />
        </form>
        <div className="Student__room">
          {messages && messages[0] ? (
            messages.map(message => (
              <div className="Student__message" key={message.id}>
                {mentorKey !== '' && !invalidMentorKey && `${message.user}: `}
                {message.message}
              </div>
            ))
          ) : (
            <p className="Student__message--none">
              Waiting for student questions...
            </p>
          )}
        </div>
      </div>
    );
  }
}

export default Student;
