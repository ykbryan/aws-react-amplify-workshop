import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from './Home';
import Works from './Works';
import Webcam from './Webcam';
import Post from './Post';
import About from './About';
import Contact from './Contact';
import Blog from './Blog';
import Markdown from './Markdown';
import NoMatch from './NoMatch';

class Content extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/blog" component={Blog} />
        <Route path="/works" component={Works} />
        <Route exact path={"/works/:pageId"} component={Post} />
        <Route exact path="/about" component={About} />
        <Route exact path="/contact" component={Contact} />
        <Route exact path="/markdown" component={Markdown} />
        <Route exact path="/webcam" component={Webcam} />
        <Route path="*" component={NoMatch} status={404} />
      </Switch>
    )
  }
}

export default Content
