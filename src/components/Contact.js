import React, { Component } from 'react'
import { API, graphqlOperation } from 'aws-amplify';
import ReactMarkdown from 'react-markdown';

class Contact extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      message: "",
      messageSent: false,
      errorFound: false,
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
            {type: {eq: "contact"}},
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
  handleFieldEdit = (field, event) => {
    var current = {};
    current[field] = event.target.value;
    this.setState(current);
  }
  handleSubmit = (event) => {
    let { name, email, message, errorFound } = this.state;
    if (name && email && message) {
      if (errorFound) {
        this.setState({
          errorFound: false,
        });
      }
      this.saveForm(name, email, message);
    } else if (!errorFound) {
      this.setState({
        errorFound: true,
      });
    }
    event.preventDefault();
  }
  renderContent = () => {
    let { body } = this.state;
    if (body !== "") {
      return (
        <ReactMarkdown source={body} />
      )
    } else {
      return (
        <h2>Contact me</h2>
      )
    }
  }
  saveForm = async (name, email, message) => {
    const createMutation = `mutation createForm {
      createForm(input:{
        type: "contact"
        name: "${name}"
        email: "${email}"
        content: "${message}"
      }) {
        id
        name
        content
      }
    }`;

    try {
      await API.graphql(graphqlOperation(createMutation));
      console.log("success, do something");
      this.setState({
        name: "",
        email: "",
        message: "",
        messageSent: true,
        errorFound: false,
      });
      this.formName.value = "";
      this.formEmail.value = "";
      this.formMessage.value = "";
    } catch (e) {
      this.setState({
        messageSent: false,
        errorFound: true,
      });
    }
  }
  renderSuccessMessage = () => {
    let { messageSent } = this.state;
    if (!messageSent) {
      return;
    }
    return (
      <div className="alert alert-success" role="alert">
        <h4 className="alert-heading">Message is sent!</h4>
        <p>Thank you for contacting me</p>
        <hr />
        <p class="mb-0">I will get back to you soon.</p>
      </div>
    );
  }
  renderErrorMessage = () => {
    let { errorFound } = this.state;
    if (!errorFound) {
      return;
    }
    return (
      <div className="alert alert-warning alert-dismissible fade show" role="alert">
        <strong>Holy guacamole!</strong> You should check in on some of those fields below.
        <button type="button" className="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    );
  }
  render() {
    return (
      <div>
        {this.renderContent()}
        {this.renderSuccessMessage()}
        {this.renderErrorMessage()}
        <div className="row justify-content-center">
          <div className="col-12 text-left">
            <form onSubmit={this.handleSubmit.bind(this)}>
              <div className="form-group">
                <label htmlFor="yourName">Your Name</label>
                <input type="text" ref={(ref) => this.formName = ref} className="form-control" id="inputYourName" aria-describedby="yourNameHelp" placeholder="How do I address you" onChange={this.handleFieldEdit.bind(this, "name")} />
                <small id="yourNameHelp" className="form-text text-muted">How do I address you?</small>
              </div>
              <div className="form-group">
                <label htmlFor="inputEmail">Your Email</label>
                <input type="email" ref={(ref) => this.formEmail = ref} className="form-control" id="inputEmail" placeholder="Which email should I reply to" onChange={this.handleFieldEdit.bind(this, "email")} />
              </div>
              <div className="form-group">
                <label htmlFor="yourMessage">Your Message</label>
                <textarea ref={(ref) => this.formMessage = ref} className="form-control" id="inputEmail" rows="3" placeholder="Write to me" onChange={this.handleFieldEdit.bind(this, "message")}></textarea>
              </div>
              <div className="d-flex justify-content-around">
                <button type="reset" className="btn btn-light">Reset</button>
                <button type="submit" className="btn btn-primary">Send</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}
export default Contact;