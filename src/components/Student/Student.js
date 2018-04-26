import React, { Component } from 'react';
import socketIOClient from 'socket.io-client';

import './Student.css';

class Student extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      code: '',
      disabled: true,
      firstName: '',
      lastName: '',
      messages: []
    };
    this.socket = socketIOClient(process.env.REACT_APP_HOST);
  }

  componentDidMount() {
    this.socket.on('delete message', messages => {
      this.setState({ messages });
    });

    this.socket.on('get messages', messages => {
      this.setState({ messages });
    });
  }

  onCodeSubmitHandler = e => {
    e.preventDefault();
    let { code, firstName, lastName } = this.state;
    if (code && firstName && lastName) {
      this.socket.emit('verify code', this.state.code);
      this.socket.on('validation response', response => {
        this.setState({ disabled: !response });
      });
    }
  };

  onSubmitHandler = e => {
    e.preventDefault();
    let { message, firstName, lastName, code } = this.state;
    if (message) {
      this.socket.emit('send message', {
        user: `${firstName} ${lastName}`,
        message,
        key: code
      });
      this.setState({ message: '' });
    }
  };

  render() {
    let { message, disabled, code, messages, firstName, lastName } = this.state;

    return (
      <div className="Student">
        {disabled && (
          <form onSubmit={this.onCodeSubmitHandler}>
            <input
              autoFocus
              className="Student__input Student__input--firstname"
              onChange={e => this.setState({ firstName: e.target.value })}
              value={firstName}
              type="text"
              placeholder="First Name"
            />
            <input
              className="Student__input Student__input--lastname"
              onChange={e => this.setState({ lastName: e.target.value })}
              value={lastName}
              type="text"
              placeholder="Last Name"
            />
            <input
              className="Student__input Student__input--code"
              onChange={e => this.setState({ code: e.target.value })}
              value={code}
              type="text"
              placeholder="Code"
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
            onChange={e => this.setState({ message: e.target.value })}
            value={message}
            type="text"
            placeholder="Question"
          />
        </form>
        <div className="Student__room">
          {messages && messages[0] ? (
            messages.map(message => (
              <div className="Student__message" key={message.id}>
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
