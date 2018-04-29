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
      firstName: '',
      lastName: '',
      messages: [],
      submitted: false,
      validClassroomKey: false,
      validMentorKey: false
    };
    this.socket = socketIOClient();
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
    this.setState({submitted: true});

    let {classroomKey, mentorKey, firstName, lastName} = this.state;
    if (classroomKey && firstName && lastName) {
      this.socket.emit('verify key', {classroomKey, mentorKey});
      this.socket.on('validation response', keyRing => {
        this.setState({
          validClassroomKey: keyRing.classroomKey,
          validMentorKey: keyRing.mentorKey
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
        key: classroomKey
      });
      this.setState({message: ''});
    }
  };

  render() {
    let {
      message,
      classroomKey,
      mentorKey,
      messages,
      firstName,
      lastName,
      submitted,
      validClassroomKey,
      validMentorKey
    } = this.state;

    const bucketOfMonkeys = !(
      submitted &&
      validClassroomKey &&
      (!mentorKey || (mentorKey && validMentorKey))
    );

    return (
      <div className="Student">
        {bucketOfMonkeys && (
          <form onSubmit={this.onCodeSubmitHandler}>
            <div className="Student__inputs">
              <input
                autoFocus
                className="Student__input Student__input--classroom"
                onChange={e => this.setState({classroomKey: e.target.value})}
                value={classroomKey}
                type="text"
                required
                placeholder="Classroom Code"
                style={{
                  fontFamily: "'Courier New', Courier, monospace",
                  border: classroomKey
                    ? submitted && validClassroomKey
                      ? '1px solid #ccc'
                      : submitted && !validClassroomKey
                        ? '1px solid #ff7675'
                        : '1px solid #ccc'
                    : '1px solid #ccc'
                }}
              />
              <input
                className="Student__input Student__input--mentor"
                onChange={e => this.setState({mentorKey: e.target.value})}
                value={mentorKey}
                type="text"
                placeholder="Mentor Code"
                style={{
                  fontFamily: "'Courier New', Courier, monospace",
                  border: mentorKey
                    ? submitted && validMentorKey
                      ? '1px solid #ccc'
                      : submitted && !validMentorKey
                        ? '1px solid #ff7675'
                        : '1px solid #ccc'
                    : '1px solid #ccc'
                }}
              />
            </div>
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
            <button className="Student__submit">Enter Room</button>
          </form>
        )}
        {!bucketOfMonkeys ? (
          <div>
            You're currently logged in as a{' '}
            {mentorKey && validMentorKey ? 'mentor' : 'student'}.
            <br />
            <br />
            Enter your questions here:
            <br />
            <br />
            <form onSubmit={this.onSubmitHandler}>
              <input
                disabled={bucketOfMonkeys}
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
                    {validMentorKey &&
                      message &&
                      message.user &&
                      `${message.user}: `}
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
        ) : null}
      </div>
    );
  }
}

export default Student;
