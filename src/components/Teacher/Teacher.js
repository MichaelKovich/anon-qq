import React, {Component} from 'react';
import socketIOClient from 'socket.io-client';

class Teacher extends Component {
  constructor(props) {
    super(props);
    this.state = {
      code: null,
      messages: [],
      message: '',
    };
    this.socket = socketIOClient('http://192.168.1.154:3001/');
  }

  componentDidMount() {
    this.socket.on('Message', message => {
      const aggregatedMessages = [...this.state.messages, message];
      this.setState({messages: aggregatedMessages});
      console.log(this.state);
    });
  }

  onSubmitHandler = e => {
    e.preventDefault();
    this.socket.emit('Message', this.state.message);
    this.setState({message: ''});
  };

  render() {
    let {code, messages, message} = this.state;
    return (
      <div className="Teacher">
        The code is {code}.
        <form onSubmit={this.onSubmitHandler}>
          <input
            onChange={e => this.setState({message: e.target.value})}
            value={message}
            type="text"
          />
        </form>
        <div className="Teacher__room">
          {messages[0] ? (
            messages.map(message => {
              return <p key={Math.random()}>{message}</p>;
            })
          ) : (
            <p>Please enter a message.</p>
          )}
        </div>
      </div>
    );
  }
}

export default Teacher;
