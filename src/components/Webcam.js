import React, { Component } from 'react';
import Webcam from "react-webcam";
import { Storage } from 'aws-amplify';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      image: ""
    }
  }

  componentDidMount() {
    setInterval(this.capture, 2000);
  }

  setRef = webcam => {
    this.webcam = webcam;
  };

  capture = () => {
    const imageSrc = this.webcam.getScreenshot();
    if (imageSrc) {
      console.log(imageSrc);
      this.setState({
        image: imageSrc
      });
      var today = new Date().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
      }).split(' ').join('-').split(',').join('').split(':').join('-');
      Storage.put(`rekognition-demo/${today}.jpg`, imageSrc, {
        contentType: 'image/jpeg'
      })
        .then(result => console.log(result))
        .catch(err => console.log(err));
    }
  };

  render() {
    const videoConstraints = {
      width: 1600,
      height: 1200,
      facingMode: "user"
    };

    let { image } = this.state;

    return (
      <div className="App">
        <Webcam
          audio={false}
          height={350}
          ref={this.setRef}
          screenshotFormat="image/jpeg"
          width={350}
          videoConstraints={videoConstraints}
        />
        <p>
          <button onClick={this.capture}>Capture photo</button>
        </p>
        <p>
          <img src={image} alt="Captured data to be sent to S3" />
        </p>
      </div>
    );
  }
}

export default App;