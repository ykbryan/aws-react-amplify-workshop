import React, { Component } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import ReactMarkdown from 'react-markdown';

class About extends Component {
  constructor(props) {
    super(props);
    this.state = {
      body: "",
    }
  }
  componentDidMount() {
    this.getContent();
  }
  getContent = async () => {
    const env = process.env.NODE_ENV;
    const graphqlQuery = `query searchPosts{
      searchPosts(
        filter:{
          and:[
            {env: {eq: "${env}"}},
            {type: {eq: "sample"}},
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
  renderContent = () => {
    let { body } = this.state;
    if (body !== "") {
      return (
        <ReactMarkdown source={body} />
      )
    } else {
      return (
        <h1>This is a sample page...</h1>
      )
    }
  }
  render() {
    return (
      <div>
        {this.renderContent()}
      </div>
    );
  }
}
export default About;