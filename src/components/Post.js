import React, { Component } from 'react';
import Moment from 'react-moment';
import { API, graphqlOperation } from 'aws-amplify';
import ReactMarkdown from 'react-markdown';
import { Link } from 'react-router-dom';

class Post extends Component {
  constructor(props) {
    super(props);
    this.state = {
      body: "",
      postId: "",
      post: [],
    }
  }
  componentWillMount() {
    let { postId } = this.props.match.params;
    this.setState({
      postId: postId,
    });
  }
  componentDidMount() {
    let { postId } = this.state;
    this.getPost(postId);
  }
  getPost = async (postId) => {
    const env = process.env.NODE_ENV;
    const graphqlQuery = `query searchPosts{
      searchPosts(
        filter:{
          and:[
            {env: {eq: "${env}"}}
            {nice_url: {eq: "${postId}"}}
          ]
        }
        sort: {
          field:publishedAt
          direction:desc
        }
        limit: 1
      ){
        nextToken
        items{
          id
          type
          title
          content
          publishedAt
          featured_image
        }
      }
    }`;

    try {
      const response = await API.graphql(graphqlOperation(graphqlQuery));
      const items = response.data.searchPosts.items;
      if (items.length > 0) {
        this.setState({
          post: items[0]
        });
      }
    } catch (e) {
      console.log(e);
    }
  }
  renderBack = () => {
    if (this.props.history.action === "POP") {
      return (
        <Link to={"/blog"}>
          <button type="button" class="btn btn-light">Back</button>
        </Link>
      )
    }
    return (
      <button type="button" class="btn btn-light" onClick={() => this.props.history.goBack()}>Back</button>
    )
  }
  render() {
    let { post } = this.state;
    if (post.length === 0) {
      return (
        <ReactMarkdown source={"# Hello World \n## No post yet"} />
      )
    }
    return (
      <div className="row">
        <div index={post.id} className="card-body">
          <h1 className="card-title">
            {post.title}
          </h1>
          {post.featured_image &&
            <img class="card-img-top" src={post.featured_image} alt={post.title} />
          }
          <div className="card-text">
            {post.publishedAt &&
              <small>
                Written on *
                <Moment format="DD MMM YYYY, HH:mm">
                  {post.publishedAt}
                </Moment>
                *
                </small>
            }
            <ReactMarkdown source={post.content} />
            {this.renderBack()}
          </div>
        </div>
      </div>
    );
  }
}
export default Post;