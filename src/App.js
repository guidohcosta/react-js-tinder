import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import './styles/stylesheets/bootstrap.css';

class App extends Component {
  constructor() {
    super()
    this.state = {
      user: null,
      conversations: [],
			currentChat: 14
    }
  }

  componentDidMount() {
    this.callApi()
      .then(res => this.setState({conversations: res}))
      .catch(err => console.log(err))
  }

  callApi = async () => {
    const response = await fetch('http://192.168.0.3:8080/TrabalhoSOO/webresources/relacionador/buscarPessoas/13')
    const body = await response.json()
    if (response.status !== 200) {
      throw Error(body.mensagem)
    }

    return body.usuarios
  }

  render() {
    return (
			<MyTinder
			  conversations={this.state.conversations}
				currentChat={this.state.currentChat}
			/>
		)
  }
}

class MessageList extends Component {
  render() {
    return (
      <div className="conversation">
        <div className="message-list list-group">
          {this.props.messages.map(function(message, index) {
            return (
              <div className="list-item" key={index}>
                {message.mensagem}
              </div>
            )
          })}
        </div>
      </div>
    )
  }
}

class SendMessageForm extends Component {
  constructor() {
    super()
    this.state = {
      message: ''
    }
		this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(e) {
    this.setState({
      message: e.target.value
    })  
  }

  handleSubmit(e) {
    e.preventDefault()
    this.props.sendMessage(this.state.message)
    this.setState({
      message: ''
    })  
  }

  render() {
    return (
      <form
				onSubmit={this.handleSubmit}
				className="send-message-form">
        <input
          onChange={this.handleChange}
          value={this.state.message}
					type="text"
					placeholder="Type here"
				/>
      </form>
    )
  }
}

class ConversationData extends Component {
  render() {
    return (
      <nav className="navbar navbar-expand-lg">
        <div className="row">
          <div className="col-md-1">
            <img
              src="https://scontent.fcpq2-1.fna.fbcdn.net/v/t1.0-9/22489886_1490092487738223_7986056671219924805_n.jpg?_nc_cat=0&oh=67eaed6beb60487f8ca39a11cb3fb0f1&oe=5BE0802C"
              className="img-circle"
              width="51"
            />
          </div>
          <div className="col-md-11">
            Conversa com Toddynho
          </div>
        </div>
      </nav>
    )
  }
}

class Conversation extends Component {
  constructor() {
    super()
    this.state = {
      user: null,
      messages: []
    }
		this.sendMessage = this.sendMessage.bind(this)
		this.updateMessages = this.updateMessages.bind(this)
  }

  componentDidMount() {
    this.callApi()
      .then(res => this.setState({messages: res}))
      .catch(err => console.log(err))
  }

  callApi = async () => {
    const response = await fetch('http://192.168.0.3:8080/TrabalhoSOO/webresources/chat/buscarConversas/', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({idMatch: '12'})
    })
    const body = await response.json()
    if (response.status !== 200) {
      throw Error(body.mensagem)
    }

    return body.mensagens
  }

  sendChat = async (text) => {
		const response = await fetch('http://192.168.0.3:8080/TrabalhoSOO/webresources/chat/inserirConversa', {
			method: 'post',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({idUsuarioMatch: '12', idUsuario: '103', mensagem: text})
		})
		const body = await response.json()

		return body
	}
	
	sendMessage(text) {
		this.sendChat(text)
		this.updateMessages(text)
	}

	updateMessages(text) {
		this.setState({
			messages: [...this.state.messages, text]
		})
	}

  render() {
    return (
      <div className="conversation">
        <ConversationData />
        <MessageList messages={this.state.messages} />
        <SendMessageForm sendMessage={this.sendMessage} />
      </div>
    )
  }
}

class ConversationList extends Component {
  render() {
    return (
      <ul className="list-group">
        {this.props.conversations.map(conversation => {
          return (
            <li key={conversation.id} className="list-group-item">
              <div className="row">
                <div className="col-md-2">
                  <img
                    src={conversation.linkImagem}
                    className="img-circle"
                    width="51"
                  />
                </div>
                <div className="col-md-10">
                  <h4>{conversation.nome}</h4>
                  <p>{conversation.descricao}</p>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    )
  }
}

class FindBanner extends Component {
  render() {
    return(
      <nav className="navbar navbar-dark navbar-expand-lg">
        <a className="navbar-brand" href="#">Encontre pessoas</a>
      </nav>
    )
  }
}

class MyTinder extends Component {
  constructor() {
    super()
  }

  render() {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-3">
            <FindBanner />
            <ConversationList conversations={this.props.conversations} />
          </div>
          <div className="col-md-9">
            <Conversation />
          </div>
        </div>
      </div>
    )
  }
}

export default App;
