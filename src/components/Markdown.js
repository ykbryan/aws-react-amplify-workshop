import React, { Component } from 'react'
import ReactMarkdown from 'react-markdown';
import querySearch from 'stringquery'

class Markdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: ""
    }
  }
  componentDidMount() {
    const values = querySearch(this.props.location.search);
    console.log(values);
  }
  handleField = (event) => {
    this.setState({
      message: event.target.value
    })
  }
  render() {
    let { message } = this.state;
    return (
      <div className="row">
        <div className="col-12 col-md-6">
          <textarea className="form-control" rows="24" onChange={this.handleField.bind(this)}></textarea>
        </div>
        <div className="col-12 col-md-6 text-left border border-light overflow-hidden">
          <ReactMarkdown source={message} />
        </div>
      </div>
    );
  }
}
export default Markdown;