import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import './styles/stylesheets/bootstrap.css';

class App extends Component {
  constructor() {
    super()
    this.state = {
      user: localStorage.getItem('user'),
      conversations: [],
    }
    this.logUserIn = this.logUserIn.bind(this)
  }

  componentDidMount() {
    this.callApi()
      .then(res => this.setState({conversations: res}))
      .catch(err => console.log(err))
  }

  callApi = async () => {
    const response = await fetch('http://localhost:8080/TrabalhoSOO/webresources/relacionador/buscarMatchs/110')
    const body = await response.json()
    if (response.status !== 200) {
      throw Error(body.mensagem)
    }

    return body.usuarios
  }

  async logUserIn(user, password) {
		const response = await fetch('http://localhost:8080/TrabalhoSOO/webresources/login/logar', {
			method: 'post',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({login: user, senha: password})
		})
    const json = await response.json()

    if (json.sucesso) {
      localStorage.setItem('user', json.id)
      this.setState({user: json.id})
    }
  }

  render() {
    if (this.state.user == null) {
      return (
        <Login logUserIn={this.logUserIn} />
      )
    } else {
      return (
        <MyTinder
          conversations={this.state.conversations}
          user={this.state.user}
        />
      )
    }
  }
}

class Login extends Component {
  constructor() {
    super()
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleUserChange = this.handleUserChange.bind(this)
    this.handlePasswordChange = this.handlePasswordChange.bind(this)
    this.state = {
      user: '',
      password: ''
    }
  }
  
  handlePasswordChange(e) {
    this.setState({password: e.target.value})
  }

  handleUserChange(e) {
    this.setState({user: e.target.value})
  }

  handleSubmit(e) {
    e.preventDefault()
    this.props.logUserIn(this.state.user, this.state.password)
    this.setState({
      user: '',
      password: ''
    })
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-6 col-md-offset-3">
            <div className="panel panel-login">
              <div className="panel-heading">
                <h3>Login</h3>
              </div>
            </div>
            <div className="panel-body">
              <div className="row">
                <form onSubmit={this.handleSubmit}>
                  <div className="form-group">
                    <input
                      onChange={this.handleUserChange}
                      type="text"
                      placeholder="Login"
                      className="form-control"
                      name="login"
                      value={this.state.user}
                    />
                  </div>
                  <div className="form-group">
                    <input
                      onChange={this.handlePasswordChange}
                      type="password"
                      placeholder="Senha"
                      className="form-control"
                      name="password"
                      value={this.state.password}
                    />
                  </div>
                  <div className="form-group">
                    <input type="submit" className="form-control btn" value="Log in" />
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
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

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.conversation != '' && prevProps.conversation != this.props.conversation) {
      this.callApi()
        .then(res => this.setState({messages: res}))
        .catch(err => console.log(err))
    }
  }

  callApi = async () => {
    const response = await fetch('http://localhost:8080/TrabalhoSOO/webresources/chat/buscarConversas/', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({idMatch: this.props.conversation})
    })
    const body = await response.json()
    if (response.status !== 200) {
      throw Error(body.mensagem)
    }
    console.log(body)

    return body.mensagens
  }

  sendChat = async (text) => {
		const response = await fetch('http://localhost:8080/TrabalhoSOO/webresources/chat/inserirConversa', {
			method: 'post',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({idUsuarioMatch: '17', idUsuario: '110', mensagem: text})
		})
		const body = await response.json()

		return body
	}
	
	async sendMessage(text) {
		const response = await fetch('http://localhost:8080/TrabalhoSOO/webresources/chat/inserirConversa', {
			method: 'post',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({idUsuarioMatch: '17', idUsuario: '110', mensagem: text})
		})
    const json = await response.json()
		this.setState({
      messages: [...this.state.messages, {mensagem:text}]
		})
	}

	updateMessages(text) {
		this.setState({
			messages: [...this.state.messages, text]
		})
	}

  render() {
    return (
      <div className="conversation" data-conversation={this.props.conversation}>
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
            <li 
              onClick={this.props.handleClick}
              data-id={conversation.idMatch}
              key={conversation.idMatch} className="list-group-item">
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
    this.handleConversationClick = this.handleConversationClick.bind(this)
    this.state = {
      conversation: ''
    }
  }

  handleConversationClick(e) {
    this.setState({
      conversation: e.currentTarget.dataset.id
    })
  }

  render() {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-3">
            <FindBanner />
            <ConversationList
              conversations={this.props.conversations}
              handleClick={this.handleConversationClick}
            />
          </div>
          <div className="col-md-9">
            <Conversation conversation={this.state.conversation} />
            <MatchList user={this.props.user} />
          </div>
        </div>
      </div>
    )
  }
}

class MatchList extends Component {
  constructor() {
    super()
    this.state = {
      matches: [],
      update: false
    }
    this.handleLike = this.handleLike.bind(this)
    this.handleDislike = this.handleDislike.bind(this)
  }

  componentDidMount() {
    this.callApi()
      .then(res => this.setState({
        matches: res,
        update: false
      }))
      .catch(err => console.log(err))
  }

  componentDidUpdate() {
    if (this.state.update) {
      this.callApi()
        .then(res => this.setState({matches: res}))
        .catch(err => console.log(err))
    }
  }

  callApi = async () => {
    const response = await fetch('http://localhost:8080/TrabalhoSOO/webresources/relacionador/buscarPessoas/110')
    const body = await response.json()
    if (response.status !== 200) {
      throw Error(body.mensagem)
    }

    return body.usuarios
  }

  async handleLike(e) {
		const response = await fetch('http://localhost:8080/TrabalhoSOO/webresources/relacionador/relacionar', {
			method: 'post',
			headers: {
				'Content-Type': 'application/json'
			},
      body: JSON.stringify({idUsuarioSolicitante: this.props.user, idUsuarioAlvo: e.currentTarget.dataset.id, acao: '1'})
		})
    const json = await response.json()
		this.setState({
      update: true
		})
  }

  async handleDislike(e) {
		const response = await fetch('http://localhost:8080/TrabalhoSOO/webresources/relacionador/relacionar', {
			method: 'post',
			headers: {
				'Content-Type': 'application/json'
			},
      body: JSON.stringify({idUsuarioSolicitante: this.props.user, idUsuarioAlvo: e.currentTarget.dataset.id, acao: '0'})
		})
    const json = await response.json()
		this.setState({
      update: true
		})
  }

  render() {
    return (
      <div className="match">
        <div className="container">
          <div className="row">
            <div className="col-md-6 col-md-offset-3 match-list">
              {this.state.matches.map(match => {
                return (
                  <Match 
                    data={match} 
                    key={match.id}
                    handleLike={this.handleLike}
                    handleDislike={this.handleDislike}
                  />
                )
              })}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

class Match extends Component {
  render() {
    return (
      <div className="card">
        <div className="center-block">
          <img
            src={this.props.data.linkImagem}
            className="img-circle center-block"
            width="200"
          />
        </div>
        <p className="description">o match é aqui</p>
        <div className="row buttons">
          <button
            className="btn btn-success"
            data-id={this.props.data.id}
            onClick={this.props.handleLike}>
            <span className="glyphicon glyphicon-ok" aria-hidden="true">Gostei</span>
          </button>
          <button
            data-id={this.props.data.id}
            onClick={this.props.handleDislike}
            className="btn btn-danger ">
            <span className="glyphicon glyphicon-remove" aria-hidden="true">Odiei</span>
          </button>
        </div>
      </div>
    )
  }
}

export default App;
