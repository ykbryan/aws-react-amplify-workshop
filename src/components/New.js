import React, { Component } from 'react'
import { API, graphqlOperation } from 'aws-amplify';

class New extends Component {

  constructor(props) {
    super(props);
    this.state = {
      title: "",
      message: ""
    }
  }
  componentDidMount() {
    // implement edit function
  }

  addPost = async (title, message) => {
    console.log(title, message)
  }

  handleSubmit = (event) => {
    let { title, message } = this.state;
    this.setState(this.state);
    this.addPost(title, message);
    event.preventDefault();
  }

  handleFieldEdit = (field, event) => {
    var current = {};
    current[field] = event.target.value;
    this.setState(current);
  }

  render() {
    return (
      <div>
        <div className="row justify-content-center">
          <h1>Add New Post</h1>
          <div className="col-12 text-left">
            <form onSubmit={this.handleSubmit.bind(this)}>
              <div className="form-group">
                <label htmlFor="yourTitle">Title</label>
                <input type="text" ref={(ref) => this.formTitle = ref} className="form-control" id="inputYourTitle" aria-describedby="yourTitleHelp" placeholder="Post Title" onChange={this.handleFieldEdit.bind(this, "title")} />
                <small id="yourTitleHelp" className="form-text text-muted">What is your blog title?</small>
              </div>
              <div className="form-group">
                <label htmlFor="yourMessage">Message</label>
                <textarea ref={(ref) => this.formMessage = ref} className="form-control" id="inputMessage" rows="3" placeholder="Your Post Message" onChange={this.handleFieldEdit.bind(this, "message")}></textarea>
              </div>
              <div className="d-flex justify-content-around">
                <button type="reset" className="btn btn-light">Reset</button>
                <button type="submit" className="btn btn-primary">Send</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }
}
export default New;