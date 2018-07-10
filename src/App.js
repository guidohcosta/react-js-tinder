import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import './styles/stylesheets/bootstrap.css';

class App extends Component {
  constructor() {
    super()
    this.state = {
      user: localStorage.getItem('user'),
      edit: false,
      conversations: [],
    }
    this.logUserIn = this.logUserIn.bind(this)
    this.logout = this.logout.bind(this)
    this.edit = this.edit.bind(this)
    this.cancelEdit = this.cancelEdit.bind(this)
  }

  componentDidMount() {
    this.callApi()
      .then(res => this.setState({conversations: res}))
      .catch(err => console.log(err))
  }

  callApi = async () => {
    const response = await fetch('http://localhost:8080/TrabalhoSOO/webresources/relacionador/buscarMatchs/'+this.state.user)
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

  logout(e) {
    localStorage.removeItem('user')
    this.setState({user: null})
  }

  edit(e) {
    this.setState({edit: true})
  }

  cancelEdit(e) {
    this.setState({edit: false})
  }

  render() {
    if (this.state.user == null) {
      return (
        <Login logUserIn={this.logUserIn} />
      )
    }

    if (this.state.edit) {
      return (
        <EditUserForm user={this.state.user} cancel={this.cancelEdit} />
      )
    }

    return (
      <div className="app">
        <nav className="navbar navbar-default">
          <div className="container-fluid">
            <ul className="nav navbar-nav">
              <li onClick={this.edit}>
                <a href="#">Altere seu perfil</a>
              </li>
            </ul>
            <ul className="nav navbar-nav navbar-right">
              <li onClick={this.logout}>
                <a href="#">Sair</a>
              </li>
            </ul>
          </div>
        </nav>
        <MyTinder
          conversations={this.state.conversations}
          user={this.state.user}
        />
      </div>
    )
  }
}

class EditUserForm extends Component {
  constructor() {
    super()
    this.sendUser = this.sendUser.bind(this)
  }

  componentDidMount() {
    this.callApi()
      .then(res => this.setState({conversations: res}))
      .catch(err => console.log(err))
  }

  callApi = async () => {
    const response = await fetch('http://localhost:8080/TrabalhoSOO/webresources/chat/buscarConversas/', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({login: this.props.conversation})
    })
    const body = await response.json()
    if (response.status !== 200) {
      throw Error(body.mensagem)
    }
    console.log(body)

    return body.mensagens
  }

  sendUser(user) {
  }

  render() {
    return (
      <div className="edit-user">
        <nav className="navbar navbar-default">
          <div className="container-fluid">
            <ul className="nav navbar-nav">
              <li><a href="#">Altere seu perfil</a></li>
            </ul>
            <ul className="nav navbar-nav navbar-right">
              <li onClick={this.props.cancel}>
                <a href="#">
                  <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>
                </a>
              </li>
            </ul>
          </div>
        </nav>
        <div className="container">
          <UserForm />
        </div>
      </div>
    )
  }
}

class CreateUserForm extends Component {
  constructor() {
    super()
    this.sendUser = this.sendUser.bind(this)
  }

  async sendUser(e) {
    e.preventDefault()
    var user = {
      nome: document.getElementById("nome").value,
      senha: document.getElementById("senha").value,
      login: document.getElementById("login").value,
      descricao: document.getElementById("descricao").value,
      linkImagem: document.getElementById("linkImagem").value
    }
		const response = await fetch('http://localhost:8080/TrabalhoSOO/webresources/login/inserir', {
			method: 'post',
			headers: {
				'Content-Type': 'application/json'
			},
      body: JSON.stringify(user)
		})
    const json = await response.json()
    console.log(json)
    this.props.handleCancel()
  }

  render() {
    var user = {
      name: '',
      senha: '',
      login: '',
      descricao: '',
      linkImagem: ''
    }
    return (
      <UserForm 
        sendUser={this.sendUser}
        handleCancel={this.props.handleCancel}
      />
    )
  }
}

class UserForm extends Component {
  render() {
    return (
      <form onSubmit={this.props.sendUser}>
        <div className="form-group">
          <label for="nome">Nome</label>
          <input type="text" className="form-control" id="nome" placeholder="Nome" />
        </div>
        <div className="form-group">
          <label for="senha">Senha</label>
          <input type="password" className="form-control" id="senha" placeholder="Senha" />
        </div>
        <div className="form-group">
          <label for="login">Login</label>
          <input type="text" className="form-control" id="login" placeholder="Login" />
        </div>
        <div className="form-group">
          <label for="descricao">Descrição</label>
          <input type="text" className="form-control" id="descricao" placeholder="Descrição" />
        </div>
        <div className="form-group">
          <label for="linkImagem">Foto</label>
          <input type="text" className="form-control" id="linkImagem" placeholder="Foto" />
          <p className="help-block">Coloque aqui o link para a sua foto de perfil.</p>
        </div>
        <div className="form-group">
          <input type="submit" className="form-control btn" value="Salvar" />
        </div>
        <div className="form-group" onClick={this.props.handleCancel}>
          <input type="button" className="form-control btn" value="Cancelar" />
        </div>
      </form>
    )
  }
}

class Login extends Component {
  constructor() {
    super()
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleUserChange = this.handleUserChange.bind(this)
    this.handlePasswordChange = this.handlePasswordChange.bind(this)
    this.register = this.register.bind(this)
    this.noRegister = this.noRegister.bind(this)
    this.state = {
      user: '',
      password: '',
      register: false
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

  register(e) {
    this.setState({
      register: true
    })
  }

  noRegister(e) {
    this.setState({
      register: false
    })
  }

  render() {
    if (this.state.register) {
      return (
        <div className="container">
          <CreateUserForm handleCancel={this.noRegister} />
        </div>
      )
    }
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
                    <a onClick={this.register} href="#">Registrar-se</a>
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
              <div className="list-item media" key={index}>
                <div className="media-body">
                  <h5 className="media-heading">
                    <strong>{message.nome}</strong>
                  </h5>
                  <p>{message.mensagem}</p>
                </div>
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
        <div className="form-group">
          <input
            onChange={this.handleChange}
            value={this.state.message}
            type="text"
            placeholder="Type here"
            className="form-control"
          />
        </div>
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
              src={this.props.image}
              className="img-circle center-block"
              width="51"
            />
          </div>
          <div className="col-md-11">
            <h1 className="text-center">{ "Conversa com " + this.props.name }</h1>
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

    return body.mensagens
  }

  sendChat = async (text) => {
		const response = await fetch('http://localhost:8080/TrabalhoSOO/webresources/chat/inserirConversa', {
			method: 'post',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({idUsuarioMatch: this.props.conversation, idUsuario: this.props.user, mensagem: text})
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
			body: JSON.stringify({idUsuarioMatch: this.props.conversation, idUsuario: this.props.user, mensagem: text})
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
        <ConversationData name={this.props.name} image={this.props.image} />
        <MessageList user={this.props.user} messages={this.state.messages} />
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
              data-name={conversation.nome}
              data-image={conversation.linkImagem}
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
      <nav onClick={this.props.handleClick} className="navbar navbar-dark navbar-expand-lg">
        <a className="navbar-brand" href="#">Encontre pessoas</a>
      </nav>
    )
  }
}

class MyTinder extends Component {
  constructor() {
    super()
    this.handleConversationClick = this.handleConversationClick.bind(this)
    this.handleBannerClick = this.handleBannerClick.bind(this)
    this.state = {
      conversation: '',
      findMatch: true,
      name: '',
      image: '',
    }
  }

  handleConversationClick(e) {
    this.setState({
      conversation: e.currentTarget.dataset.id,
      name: e.currentTarget.dataset.name,
      image: e.currentTarget.dataset.image,
      findMatch: false
    })
  }

  handleBannerClick(e) {
    this.setState({
      conversation: '',
      name: '',
      image: '',
      findMatch: true
    })
  }

  render() {
    if (this.state.findMatch) {
      return (
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-3">
              <FindBanner
                handleClick={this.handleBannerClick}
              />
              <ConversationList
                conversations={this.props.conversations}
                handleClick={this.handleConversationClick}
              />
            </div>
            <div className="col-md-9">
              <MatchList user={this.props.user} />
            </div>
          </div>
        </div>
      )
    }
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-3">
            <FindBanner
              handleClick={this.handleBannerClick}
            />
            <ConversationList
              conversations={this.props.conversations}
              handleClick={this.handleConversationClick}
            />
          </div>
          <div className="col-md-9">
            <Conversation
              user={this.props.user}
              name={this.state.name}
              image={this.state.image}
              conversation={this.state.conversation}
            />
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
      this.setState({update: false})
    }
  }

  callApi = async () => {
    const response = await fetch('http://localhost:8080/TrabalhoSOO/webresources/relacionador/buscarPessoas/'+this.props.user)
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
      body: JSON.stringify({idUsuarioSolicitante: this.props.user, idUsuarioAlvo: e.currentTarget.dataset.id, acao: '0'})
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
    if (this.state.matches.length == 0) {
      return (
        <div className="no-people">
          <h1>Não encontramos mais ninguém!</h1>
          <p>Não fique triste, jájá aparece gente.</p>
        </div>
      )
    }
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
            className="img-rounded center-block"
            width="200"
          />
        </div>
        <p className="description text-center">{this.props.data.descricao}</p>
        <div className="row buttons">
          <div className="col-md-6">
            <button
              className="btn btn-success center-block"
              data-id={this.props.data.id}
              onClick={this.props.handleLike}>
              <span className="glyphicon glyphicon-ok" aria-hidden="true">Gostei</span>
            </button>
          </div>
          <div className="col-md-6">
            <button
              data-id={this.props.data.id}
              onClick={this.props.handleDislike}
              className="btn btn-danger center-block">
              <span className="glyphicon glyphicon-remove" aria-hidden="true">Odiei</span>
            </button>
          </div>
        </div>
      </div>
    )
  }
}

export default App;
