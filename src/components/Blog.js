import React, { Component } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import { Switch, Route, Redirect } from 'react-router-dom';
import Post from './Post';
import Posts from './Posts';

class Blog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      body: "",
      randomId: 1,
    }
  }
  componentWillMount() {
    this.getContent();
  }
  componentWillReceiveProps() {
    const { randomId } = this.state;
    this.setState({
      randomId: randomId + 1
    })
  }
  getContent = async () => {
    const env = process.env.NODE_ENV;
    const graphqlQuery = `query searchPosts{
      searchPosts(
        filter:{
          and:[
            {env: {eq: "${env}"}}
            {type: {eq: "blog"}}
            {name: {eq: "body"}}
          ]
        }
      ){
        nextToken
        items{
          title
          content
          name
        }
      }
    }`;

    try {
      const response = await API.graphql(graphqlOperation(graphqlQuery));
      const items = response.data.searchPosts.items;
      if (items.length > 0) {
        var newConfig = {};
        for (let item of items) {
          newConfig[item.name] = item.content;
        }
        this.setState(newConfig);
      }
    } catch (e) {
      console.log(e);
    }
  }
  render() {
    const { randomId, body } = this.state;
    if (!body) {
      return (
        <h1>Loading...</h1>
      );
    }
    return (
      <div key={randomId} className="overflow-hidden">
        <Switch>
          <Route exact path={"/blog/:postId"} component={Post} />
          <Route exact path={"/blog/page/:page"} render={(props) => <Posts {...props} body={body} />} />
          <Redirect to="/blog/page/1" />
        </Switch>
      </div>
    );
  }
}
export default Blog;