import React, { Component } from 'react'
import { API, graphqlOperation } from 'aws-amplify';
import ReactMarkdown from 'react-markdown';

// window.LOG_LEVEL = 'DEBUG';
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      body: "",
      guest: true, //set to false for render()
    }
  }
  componentWillMount() {
    // this.getGuest();
  }
  componentDidMount() {
    console.log(this.props)
    this.getContent();
  }
  getContent = async () => {
    const env = process.env.NODE_ENV;
    const graphqlQuery = `query searchPosts{
      searchPosts(
        filter:{
          and:[
            {env: {eq: "${env}"}},
            {type: {eq: "home"}},
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
  // getGuest = async () => {
  //   const guest = await Auth.currentCredentials();
  //   this.setState({
  //     guest: guest
  //   });
  //   console.log(guest);
  //   return guest;
  // }
  render() {
    let { body, guest } = this.state;
    if (body === "" || !guest) {
      return (
        <h1>Loading...</h1>
      )
    }
    return (
      <ReactMarkdown source={body} />
    );
  }
}
export default Home;