import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import './styles/stylesheets/bootstrap.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>`create-react-app` with Bootstrap Sass</h2>
        </div>
        <p className="App-intro">
          <code>src/App.js</code> pulls in bootstrap. Changing Bootstrap sass will affect this UI.
        </p>
        <h3 className="bg-primary">Example of Primary color change via <code>_variables.scss</code></h3>
        <span className="label label-default">Default</span>
        <span className="label label-primary">Primary</span>
        <span className="label label-success">Success</span>
        <span className="label label-info">Info</span>
        <span className="label label-warning">Warning</span>
        <span className="label label-danger">Danger</span>
      </div>
    );
  }
}

export default App;
