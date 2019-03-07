import React, { Component } from 'react';
import { API, Analytics, graphqlOperation } from 'aws-amplify';

class Home extends Component {

  constructor(props) {
    super(props);
    this.state = {
      posts: []
    }
  }

  componentDidMount() {
    // implement edit function
    this.getPosts();
    Analytics.record({ name: 'homeVisit' });

  }

  getPosts = async () => {
    // TODO: add query
    const graphqlQuery = ``;

    try {
      const response = await API.graphql(graphqlOperation(graphqlQuery));
      const { items } = response.data.listPosts;

      if (items.length > 0) {
        this.setState({
          posts: items
        });
      }
    } catch (e) {
      console.error(e);
    }
  }

  render() {
    let { posts } = this.state
    return (
      <div>
        <h1>Welcome to Your Home Page.</h1>
        <div className="card-columns">
          {posts.map(function (data, index) {
            return (
              <div className="card" key={index}>
                <div className="card-body">
                  <h5 className="card-title">{data.title}</h5>
                  <p className="card-text">{data.message}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
}
export default Home;