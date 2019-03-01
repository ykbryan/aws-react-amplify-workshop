import React, { Component } from 'react'
import { Link } from 'react-router-dom'

class Menu extends Component {
  generateLink = (url, name) => {
    return (
      <Link
        className={this.renderActiveLink(url)}
        to={url}>
        {name}
      </Link>
    );
  }
  renderActiveLink = (link) => {
    if (window.location.pathname === link) {
      return "nav-link active";
    }
    return "nav-link";
  }
  render() {
    return (
      <div className="inner">
        <nav className="nav nav-masthead justify-content-center">
          {this.generateLink('/', 'Home')}
          {this.generateLink('/samplepage', 'Sample Page')}
        </nav>
      </div>
    );
  }
}
export default Menu;