import React, { Component } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import ReactMarkdown from 'react-markdown';
import { Link } from 'react-router-dom';
import Moment from 'react-moment';

class Posts extends Component {
  constructor(props) {
    super(props);

    let { body } = props;
    let { page } = props.match.params;
    page = !page ? 1 : parseInt(page, 10);

    this.state = {
      posts: [],
      page: page,
      limit: 6,
      total: 0,
      body: body,
    }
  }
  componentWillMount() {
    this.getPosts();
  }
  getPosts = async () => {
    const env = process.env.NODE_ENV;
    const { page, limit } = this.state;
    const skip = (page - 1) * limit;
    const graphqlQuery = `query searchPosts{
      searchPosts(
        filter:{
          and:[
            {env: {eq: "${env}"}}
            {publishedAt: {ne: ""}}
            {type: {eq: "blog"}}
            {name: {eq: "post"}}
            {nice_url: {ne: ""}}
          ]
        }
        sort: {
          field:publishedAt
          direction:desc
        }
        limit: ${limit}
        nextToken: ${skip}
      ){
        items{
          id
          type
          title
          content
          publishedAt
          featured_image
          nice_url
          tags
        }
        total
      }
    }`;

    try {
      const response = await API.graphql(graphqlOperation(graphqlQuery));
      const { items, total } = response.data.searchPosts;

      if (items.length > 0) {
        this.setState({
          posts: items,
          total: total
        });
      }
    } catch (e) {
      console.log(e);
    }
  }
  renderPosts = () => {
    let { posts, page } = this.state;
    if (posts.length === 0) {
      return (
        <ReactMarkdown source={"# Loading..."} />
      )
    } else {
      return (
        <div key={page} className="card-columns">
          {posts.map(function (data, index) {
            return (
              <div className="card" key={index}>
                {data.featured_image &&
                  <img className="card-img-top" src={data.featured_image} alt={data.title} />
                }
                <div className="card-body">
                  <h5 className="card-title">
                    <Link
                      className=""
                      to={`/blog/${data.nice_url}`}>
                      {data.title}
                    </Link>
                  </h5>
                  <p className="card-text">
                    {data.publishedAt &&
                      <small>
                        Written on <Moment format="DD MMM YYYY, HH:mm"> {data.publishedAt} </Moment>
                      </small>
                    }
                  </p>
                </div>
                <div className="card-body">
                  <ReactMarkdown source={data.content} />
                </div>
              </div>
            );
          })}
        </div>
      )
    }
  }
  renderPagination = () => {
    const { total, page, limit } = this.state;
    let showPrevious = false;
    let showNext = false;
    let showFirst = false;
    let showLast = false;
    const totalPages = Math.ceil(total / limit);
    if (total !== 0) {
      if (page !== 1) {
        // showFirst = true;
      }
      if (page > 1) {
        showPrevious = true;
      }
      if (total > (page * limit)) {
        showNext = true;
      }
      if (page !== totalPages) {
        // showLast = true;
      }
    }
    return (
      <ul className="pagination-numbers mx-auto">
        {showFirst &&
          <li><Link className="" to={`/blog/page/1`}> Back to First </Link></li>
        }
        {showPrevious &&
          <li><Link className="" to={`/blog/page/${page - 1}`}> Previous Page </Link></li>
        }
        {showNext &&
          <li><Link className="" to={`/blog/page/${page + 1}`}> Next Page </Link></li>
        }
        {showLast &&
          <li><Link className="" to={`/blog/page/${totalPages}`}> Go to Last </Link></li>
        }
      </ul>
    );
  }
  render() {
    const { body } = this.state;
    return (
      <div key={this.state.page}>
        {body &&
          <ReactMarkdown source={body} />
        }
        {this.renderPosts()}
        <div className="row">
          {this.renderPagination()}
        </div>
      </div>
    );
  }
}
export default Posts;