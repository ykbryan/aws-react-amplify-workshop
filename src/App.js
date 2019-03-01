import React, { Component } from 'react';
import './App.css';
import Menu from './components/Menu'
import Content from './components/Content'
import Amplify from 'aws-amplify';
import aws_exports from './aws-exports'; // specify the location of aws-exports.js file on your project
Amplify.configure(aws_exports);

class App extends Component {
  render() {
    return (
      <div className="d-flex w-100 h-100 p-3 flex-column">
        <header className="masthead mb-auto">
          <Menu />
        </header>
        <main role="main" className="inner cover">
          <Content />
        </main>
        <footer className="mastfoot mt-auto">
          <div className="inner">
            <p>
              Brought to you by <a href="https://www.linkedin.com/in/ykbryan/" target="_blank" rel="noopener noreferrer"> Bryan Chua</a>
              , using <a href="https://getbootstrap.com/" target="_blank" rel="noopener noreferrer"> bootstrap</a>
              , <a href="https://reactjs.org/" target="_blank" rel="noopener noreferrer"> react</a>
              , and <a href="https://aws-amplify.github.io/" target="_blank" rel="noopener noreferrer"> amplify </a>
              on <a href="https://aws.amazon.com/" target="_blank" rel="noopener noreferrer"> Amazon Web Service (AWS)</a>.
            </p>
          </div>
        </footer>
      </div>
    );
  }
}

export default App;