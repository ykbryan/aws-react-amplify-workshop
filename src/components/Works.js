import React, { Component } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import ReactMarkdown from 'react-markdown';
import { Switch, Link, Route } from 'react-router-dom';
import Post from './Post';
import Moment from 'react-moment';
class Works extends Component {
  constructor(props) {
    super(props);
    this.state = {
      works: [],
      nextToken: "",
      body: "",
    }
  }
  componentDidMount() {
    this.getWorks();
    this.getContent();
  }
  getContent = async () => {
    const env = process.env.NODE_ENV;
    const graphqlQuery = `query searchPosts{
      searchPosts(
        filter:{
          and:[
            {env: {eq: "${env}"}},
            {type: {eq: "works"}},
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
  getWorks = async () => {
    const env = process.env.NODE_ENV;
    const listConfig = `query searchPosts4{
      searchPosts(
        filter:{
          and: [
            {or:[
              {type: {eq:"engineering"}},
              {type: {eq:"photography"}}
            ]}
            {publishedAt: {ne: ""}}
            {env: {eq: "${env}"}}
          ]
        }
        sort: {
          field:publishedAt
          direction:desc
        }
        limit: 10
      ){
        items{
          id
          type
          title
          content
          publishedAt
          nice_url
        }
      }
    }`;

    try {
      var response = await API.graphql(graphqlOperation(listConfig));
      const items = response.data.searchPosts.items;
      const nextToken = response.data.searchPosts.nextToken;
      // console.log(items);
      this.setState({
        "works": items,
        "nextToken": nextToken,
      });
    } catch (e) {
      console.log(e);
    }
  }
  renderBody = () => {
    let { body } = this.state;
    if (body.length !== 0) {
      return (
        <div>
          <ReactMarkdown source={body} />
        </div>
      )
    }
  }
  renderWorks = () => {
    let { works } = this.state;
    if (works.length === 0) {
      return (
        <div>Coming Soon...</div>
      )
    }
    return (
      <div className="overflow-hidden">
        {this.renderBody()}
        <div className="card-columns">
          {works.map(function (data, index) {
            const content = data.excerpt ? data.excerpt : data.content;
            return (
              <div key={index} className="card">
                <img className="card-img-top" src="https://via.placeholder.com/400x200" alt="some example" />
                <div className="card-body">
                  <h2 className="card-title">{data.title}</h2>
                  <small>{data.type}</small>
                  <p className="card-text">{content}</p>
                  {data.publishedAt &&
                    <small>
                      Last updated on <Moment format="DD MMM YYYY, HH:mm"> {data.publishedAt} </Moment>
                    </small>
                  }
                </div>
                <div className="card-body">
                  <Link className="btn btn-primary" to={`/works/${data.nice_url}`}>
                    Find out more
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    )
  }
  render() {
    return (
      <Switch>
        <Route path={`/works/:postId`} component={Post} />
        <Route
          path={`/works`}
          render={() => this.renderWorks()}
        />
      </Switch>
    );
  }
}
export default Works;