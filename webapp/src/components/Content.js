import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from './Home';
import Sample from './Sample';
import New from './New';
import NoMatch from './NoMatch';

class Content extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/samplepage" component={Sample} />
        <Route exact path="/new" component={New} />
        <Route path="*" component={NoMatch} status={404} />
      </Switch>
    )
  }
}

export default Content
